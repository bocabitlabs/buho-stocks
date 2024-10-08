"""buho_backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

import re

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path, re_path, register_converter
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions

from benchmarks.urls import router as benchmarks_router
from buho_backend import path_converters
from buho_backend.views import TaskResultList, start_task_view
from currencies.urls import router as currencies_router
from dividends_transactions.urls import router as dividends_transactions_router
from exchange_rates.urls import router as exchange_rates_router
from markets.urls import router as markets_router
from rights_transactions.urls import router as rights_transactions_router
from sectors.urls import router as sectors_router
from shares_transactions.urls import router as shares_transactions_router
from stock_prices.urls import router as stock_prices_router

register_converter(path_converters.DateConverter, "date")
uuid_regex = re.compile(r"[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}")

schema_view = get_schema_view(
    openapi.Info(
        title="Buho Backend API",
        default_version="v1",
        description="Backend docs",
        terms_of_service="https://www.google.com/policies/terms/",
        license=openapi.License(name="GPL3 License"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

api_base_url = "api/v1/"

urlpatterns = [
    path("admin/", admin.site.urls),
    path(api_base_url, include(benchmarks_router.urls)),
    path(api_base_url, include(markets_router.urls)),
    path(api_base_url, include(markets_router.urls)),
    path(api_base_url, include(sectors_router.urls)),
    path(api_base_url, include(currencies_router.urls)),
    path(api_base_url, include(exchange_rates_router.urls)),
    path(api_base_url, include(dividends_transactions_router.urls)),
    path(api_base_url, include(rights_transactions_router.urls)),
    path(api_base_url, include(shares_transactions_router.urls)),
    path(api_base_url, include(stock_prices_router.urls)),
    path(
        "api/v1/companies/",
        include("companies.urls.companies"),
        name="companies",
    ),
    path(
        "api/v1/exchange-rates/", include("exchange_rates.urls"), name="exchange_rates"
    ),
    path("api/v1/initialize-data/", include("initialize_data.urls")),
    path("api/v1/portfolios/", include("portfolios.urls"), name="portfolios"),
    path(
        "api/v1/portfolios/<int:portfolio_id>/companies/",
        include("companies.urls.companies_portfolio"),
        name="companies",
    ),
    path(
        "api/v1/portfolios/<int:portfolio_id>/messages/",
        include("log_messages.urls"),
        name="log-messages",
    ),
    path("api/v1/settings/", include("settings.urls")),
    path("api/v1/stats/", include("stats.urls")),
    path("api/v1/tasks-results/", TaskResultList.as_view(), name="task_result_list"),
    path(api_base_url, include("markets.urls"), name="timezones_list"),
    re_path(
        r"^swagger(?P<format>\.json|\.yaml)$",
        schema_view.without_ui(cache_timeout=0),  # type: ignore
        name="schema-json",
    ),
    re_path(
        r"^swagger/$",
        schema_view.with_ui("swagger", cache_timeout=0),
        name="schema-swagger-ui",
    ),
    re_path(
        r"^redoc/$", schema_view.with_ui("redoc", cache_timeout=0), name="schema-redoc"
    ),
    path("api/v1/start-task/", start_task_view),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
