import { IPortfolio } from "types/portfolio";

export const portfolioDetails: IPortfolio = {
    "id": 1,
    "name": "My first portfolio",
    "description": "This is my main Portfolio",
    "color": "#607d8b",
    "countryCode": "eu",
    "dateCreated": "2024-08-17T09:19:26.879704Z",
    "firstYear": 2021,
    "lastUpdated": "2024-08-17T09:19:26.879813Z",
    "hideClosedCompanies": true,
    "baseCurrency": {
        "name": "European Euro",
        "code": "EUR",
        "symbol": "€",
        "id": 5,
        "dateCreated": "2024-08-17T08:58:33.318938Z",
        "lastUpdated": "2024-08-17T08:58:33.318974Z"
    },
    "companies": [
        {
            "id": 1,
            "name": "Apple Inc.",
            "ticker": "AAPL",
            "baseCurrency": "USD",
            "dividendsCurrency": "USD",
            "market": {
                "name": "NASDAQ",
                "description": "United States stock exchange (NASDAQ)",
                "region": "us",
                "openTime": "09:30:00",
                "closeTime": "16:00:00",
                "timezone": "America/New_York",
                "dateCreated": "2024-08-17T08:58:33.281779Z",
                "lastUpdated": "2024-08-17T08:58:33.281800Z",
                "id": 4
            },
            "sector": {
                "name": "Technology Hardware,Storage and Peripherals",
                "dateCreated": "2024-08-17T08:58:33.471985Z",
                "lastUpdated": "2024-08-17T08:58:33.559921Z",
                "id": 13,
                "superSector": {
                    "name": "Technology Hardware and Equipment",
                    "dateCreated": "2024-08-17T08:58:33.422612Z",
                    "lastUpdated": "2024-08-17T08:58:33.422631Z",
                    "id": 12
                }
            },
            "isClosed": false
        },
        {
            "id": 2,
            "name": "Cisco Systems, Inc.",
            "ticker": "csco",
            "baseCurrency": "USD",
            "dividendsCurrency": "USD",
            "market": {
                "name": "NASDAQ",
                "description": "United States stock exchange (NASDAQ)",
                "region": "us",
                "openTime": "09:30:00",
                "closeTime": "16:00:00",
                "timezone": "America/New_York",
                "dateCreated": "2024-08-17T08:58:33.281779Z",
                "lastUpdated": "2024-08-17T08:58:33.281800Z",
                "id": 4
            },
            "sector": {
                "name": "Communications Equipment",
                "dateCreated": "2024-08-17T08:58:33.481675Z",
                "lastUpdated": "2024-08-17T08:58:33.561626Z",
                "id": 19,
                "superSector": {
                    "name": "Technology Hardware and Equipment",
                    "dateCreated": "2024-08-17T08:58:33.422612Z",
                    "lastUpdated": "2024-08-17T08:58:33.422631Z",
                    "id": 12
                }
            },
            "isClosed": false
        },
        {
            "id": 3,
            "name": "Coca-Cola Company (The)",
            "ticker": "ko",
            "baseCurrency": "USD",
            "dividendsCurrency": "USD",
            "market": {
                "name": "NYSE",
                "description": "New York stock exchange (NYSE)",
                "region": "us",
                "openTime": "09:30:00",
                "closeTime": "16:00:00",
                "timezone": "America/New_York",
                "dateCreated": "2024-08-17T08:58:33.268640Z",
                "lastUpdated": "2024-08-17T08:58:33.268665Z",
                "id": 1
            },
            "sector": {
                "name": "Soft Drinks",
                "dateCreated": "2024-08-17T08:58:33.502310Z",
                "lastUpdated": "2024-08-17T08:58:33.537369Z",
                "id": 35,
                "superSector": {
                    "name": "Food, Beverage and Tobacco",
                    "dateCreated": "2024-08-17T08:58:33.393477Z",
                    "lastUpdated": "2024-08-17T08:58:33.393519Z",
                    "id": 6
                }
            },
            "isClosed": false
        },
        {
            "id": 4,
            "name": "McDonald's Corporation",
            "ticker": "MCD",
            "baseCurrency": "USD",
            "dividendsCurrency": "USD",
            "market": {
                "name": "NYSE",
                "description": "New York stock exchange (NYSE)",
                "region": "us",
                "openTime": "09:30:00",
                "closeTime": "16:00:00",
                "timezone": "America/New_York",
                "dateCreated": "2024-08-17T08:58:33.268640Z",
                "lastUpdated": "2024-08-17T08:58:33.268665Z",
                "id": 1
            },
            "sector": {
                "name": "Restaurants",
                "dateCreated": "2024-08-17T08:58:33.498841Z",
                "lastUpdated": "2024-08-17T08:58:33.568502Z",
                "id": 32,
                "superSector": {
                    "name": "Consumer Services",
                    "dateCreated": "2024-08-17T08:58:33.430887Z",
                    "lastUpdated": "2024-08-17T08:58:33.430905Z",
                    "id": 16
                }
            },
            "isClosed": false
        }
    ]
}