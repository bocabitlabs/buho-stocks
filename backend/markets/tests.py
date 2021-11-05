import datetime
from django.test import TestCase
from django.contrib.auth.models import User

from markets.models import Market


class MarketTestCase(TestCase):
    """
    Tests for the Market model
    """

    def setUp(self):
        User.objects.create(username="testuser", password="testpassword")
        Market.objects.create(
            name="Test Market",
            description="Test Description",
            color="red",
            open_time="09:00",
            close_time="17:00",
            user=User.objects.get(username="testuser"),
        )

    def test_market_content(self):
        """Test the Market attributes"""
        market = Market.objects.get(id=1)
        self.assertEqual(market.name, "Test Market")
        self.assertEqual(market.description, "Test Description")
        self.assertEqual(market.color, "red")
        self.assertEqual(market.open_time, datetime.time(9, 0))
        self.assertEqual(market.close_time, datetime.time(17, 0))
