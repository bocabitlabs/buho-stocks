import logging
import time

from buho_backend.celery_app import app
from buho_backend.consumers import update_task_status
from companies.models import Company
from portfolios.models import Portfolio
from stats.utils.company_stats_utils import CompanyStatsUtils
from stats.utils.portfolio_stats_utils import PortfolioStatsUtils

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
        f"Updating portfolio stats",
        f"Error updating portfolio stats for",
        "FAILED",
        100,
    )
    return "OK"


@app.task(bind=True, ignore_result=False)
def update_portolfio_stats(self, portfolio_id, companies_ids, year, update_api_price=False):
    logger.info(f"Updating portfolio stats for portfolio {portfolio_id}")
    logger.debug(
        f"Portfolio update info - Portfolio: {portfolio_id}, Companies: {companies_ids}, Año: {year}, Update from API: {update_api_price}"
    )

    portfolio = Portfolio.objects.get(id=portfolio_id)

    total_companies = portfolio.companies.count() + 1
    current = 0
    percent = 0
    for company in portfolio.companies.all():
        try:
            # Print the percentage of total progress
            percent = 0 if current == 0 else int(current / total_companies * 100)
            logger.debug(f"{self.request.id} - Progress: {percent}")
            update_task_status(
                self.request.id,
                f"Updating portfolio stats ({year})",
                f"Updating company {company.name}",
                "PROGRESS",
                percent,
            )
            company_stats = CompanyStatsUtils(company.id, year=year, update_api_price=update_api_price)
            company_stats.update_stats_for_year()
            current += 1
        except Exception as error:
            logger.error(f"Error updating company stats for {company.name}: {error}", exc_info=True)
            update_task_status(
                self.request.id,
                f"Updating portfolio stats ({year})",
                f"Error updating company stats for {company.name}",
                "FAILED",
                100,
            )
            return "FAILED"
    try:
        # Update the portfolio
        portfolio_stats = PortfolioStatsUtils(portfolio_id, year=year, update_api_price=update_api_price)
        portfolio_stats.update_stats_for_year()

        update_task_status(self.request.id, f"Updating portfolio stats ({year})", "Stats updated", "COMPLETED", 100)
        return "OK"
    except Exception as error:
        logger.error(f"Error updating portfolio stats for {portfolio.name}: {error}", exc_info=True)
        update_task_status(
            self.request.id,
            f"Updating portfolio stats ({year})",
            f"Error updating portfolio stats for {portfolio.name}",
            "FAILED",
            100,
        )
        return "FAILED"


@app.task(bind=True, ignore_result=False)
def update_company_stats(self, company_id, year, update_api_price=False):
    company = Company.objects.get(id=company_id)

    logger.info(f"Updating {company.name} stats (ID: {company_id})")
    logger.debug(f"Company update info - Company: {company_id}, Year: {year}, Update from API: {update_api_price}")

    try:
        logger.debug(f"{self.request.id} - Progress: 50")
        update_task_status(
            self.request.id,
            f"Updating {company.name} stats ({year})",
            f"Updating company {company.name}",
            "PROGRESS",
            50,
        )
        company_stats = CompanyStatsUtils(company.id, year=year, update_api_price=update_api_price)
        company_stats.update_stats_for_year()

        update_task_status(
            self.request.id, f"Updating {company.name} stats ({year})", "Stats updated", "COMPLETED", 100
        )
        return "OK"

    except Exception as error:
        logger.error(f"Error updating company {company.name} stats: {error}", exc_info=True)
        update_task_status(
            self.request.id,
            f"Updating {company.name} stats ({year})",
            f"Error updating company {company.name} stats",
            "FAILED",
            100,
        )
        return "FAILED"
