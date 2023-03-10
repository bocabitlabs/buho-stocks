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
from benchmarks.urls import router as benchmarks_router
from buho_backend import path_converters
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path, re_path, register_converter
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from markets.urls import router as markets_router
from rest_framework import permissions
from sectors.urls import router as sectors_router

register_converter(path_converters.DateConverter, "date")

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


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/", include(benchmarks_router.urls)),
    path("api/v1/", include(markets_router.urls)),
    path("api/v1/", include("markets.urls")),
    path("api/v1/", include(sectors_router.urls)),
    path("api/v1/initialize-data/", include("initialize_data.urls")),
    # path("api/v1/", include("sectors.urls.api")),
    path(
        "api/v1/companies/<int:company_id>/shares/",
        include("shares_transactions.urls"),
        name="shares-transactions",
    ),
    path(
        "api/v1/companies/<int:company_id>/rights/",
        include("rights_transactions.urls"),
        name="rights-transactions",
    ),
    path(
        "api/v1/companies/<int:company_id>/dividends/",
        include("dividends_transactions.urls"),
        name="dividends-transactions",
    ),
    path(
        "api/v1/companies/<int:company_id>/stock-prices/",
        include("stock_prices.urls"),
        name="stocks-prices",
    ),
    path("api/v1/currencies/", include("currencies.urls.api")),
    path("api/v1/exchange-rates/", include("exchange_rates.urls"), name="exchange_rates"),
    path("api/v1/portfolios/", include("portfolios.urls"), name="portfolios"),
    path(
        "api/v1/portfolios/<int:portfolio_id>/messages/",
        include("log_messages.urls"),
        name="log-messages",
    ),
    path(
        "api/v1/portfolios/<int:portfolio_id>/companies/",
        include("companies.urls"),
        name="companies",
    ),
    path("api/v1/settings/", include("settings.urls")),
    path("api/v1/stats/", include("stats.urls")),
    path("admin-actions/currencies/", include("currencies.urls.admin")),
    re_path(
        r"^swagger(?P<format>\.json|\.yaml)$",
        schema_view.without_ui(cache_timeout=0),  # type: ignore
        name="schema-json",
    ),
    re_path(r"^swagger/$", schema_view.with_ui("swagger", cache_timeout=0), name="schema-swagger-ui"),  # type: ignore
    re_path(r"^redoc/$", schema_view.with_ui("redoc", cache_timeout=0), name="schema-redoc"),  # type: ignore
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
