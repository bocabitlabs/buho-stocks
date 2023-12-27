import logging
import time

from django.conf import settings

from buho_backend.celery_app import app
from buho_backend.consumers import update_task_status
from companies.models import Company
from portfolios.models import Portfolio
from stats.calculators.company_stats_utils import CompanyStatsCalculator
from stats.calculators.portfolio_stats_utils import PortfolioStatsUtils

logger = logging.getLogger("buho_backend")


@app.task(bind=True, ignore_result=False)
def debug_task(self):
    print(f"Request: {self.request!r}")
    total = 20
    for i in range(total):
        # Print the percentage of total progress
        percent = 0 if i == 0 else int(i / total * 100)
        logger.debug(f"{self.request.id} - Progress: {percent}")
        update_task_status(self.request.id, "Sample task", "Details 1", "PROGRESS", percent)
        time.sleep(1)
    # update_task_status(self.request.id, "Sample task", "Details 2", "COMPLETED", 100)
    update_task_status(
        self.request.id,
        "Updating portfolio stats",
        "Error updating portfolio stats for",
        "FAILED",
        100,
    )
    return "OK"


@app.task(bind=True, ignore_result=False)
def update_portolfio_stats(self, portfolio_id, companies_ids, year, update_api_price=False):
    logger.info(f"Updating portfolio stats for portfolio {portfolio_id}")

    logger.debug(
        f"Portfolio update info - Portfolio: {portfolio_id}, "
        f"Companies: {companies_ids}"
        f"Year: {year}" + f"Update from API: {update_api_price}"
    )

    portfolio = Portfolio.objects.get(id=portfolio_id)

    companies = []
    if len(companies_ids) > 0:
        # Given a list of Company id's, create an array of all these companies
        companies = []
        company_queryset = Company.objects.filter(pk__in=companies_ids)
        for company in company_queryset:
            companies.append(company)
        total_companies = len(companies)
    else:
        total_companies = portfolio.companies.count() + 1
        # Get only companies that are not closed
        companies = portfolio.companies.filter(is_closed=False)

    current = 0
    percent = 0
    for company in companies:
        year_text = year
        if year == settings.YEAR_FOR_ALL:
            year_text = "All"
        try:
            # Print the percentage of total progress
            percent = 0 if current == 0 else int(current / total_companies * 100)
            logger.debug(f"{self.request.id} - Progress: {percent}")
            if year == settings.YEAR_FOR_ALL:
                year_text = "All"
            update_task_status(
                self.request.id,
                "Updating portfolio stats",
                {"year": year_text, "task_description": "Updating company", "company": company.name},
                "PROGRESS",
                percent,
            )
            company_stats = CompanyStatsCalculator(company.id, year=year, update_api_price=update_api_price)
            company_stats.update_year_stats()
            current += 1
        except Exception as error:
            logger.error(f"Error updating company stats for {company.name}: {error}", exc_info=True)
            update_task_status(
                self.request.id,
                "Updating portfolio stats",
                {"year": year_text, "task_description": "Error updating company stats", "company": company.name},
                "FAILED",
                100,
            )
            return "FAILED"
    try:
        # Update the portfolio
        portfolio_stats = PortfolioStatsUtils(portfolio_id, year=year, update_api_price=update_api_price)
        portfolio_stats.update_year_stats()

        update_task_status(
            self.request.id,
            "Updating portfolio stats",
            {"year": year_text, "task_description": "Stats updated", "company": company.name},
            "COMPLETED",
            100,
        )

        if year != settings.YEAR_FOR_ALL:
            update_portolfio_stats.delay(portfolio_id, companies_ids, settings.YEAR_FOR_ALL, update_api_price)

        return "OK"
    except Exception as error:
        logger.error(f"Error updating portfolio stats for {portfolio.name}: {error}", exc_info=True)
        update_task_status(
            self.request.id,
            "Updating portfolio stats",
            {"year": year_text, "task_description": "Error updating portfolio stats", "company": portfolio.name},
            "FAILED",
            100,
        )
        return "FAILED"
