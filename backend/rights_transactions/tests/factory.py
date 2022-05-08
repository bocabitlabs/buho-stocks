from factory import django, Faker, SubFactory
from auth.tests.factory import UserFactory
from buho_backend.transaction_types import TransactionType
from companies.tests.factory import CompanyFactory
from rights_transactions.models import RightsTransaction


class RightsTransactionFactory(django.DjangoModelFactory):
    class Meta:
        model = RightsTransaction

    count = Faker("pyint")
    gross_price_per_share = Faker('pydecimal', left_digits=4, right_digits=3, positive=True)

    total_commission = Faker('pydecimal', left_digits=4, right_digits=3, positive=True)
    exchange_rate = Faker('pydecimal', left_digits=1, right_digits=3, positive=True)
    transaction_date = Faker('date_object')
    notes = Faker("paragraph")

    type = Faker(
        'random_element', elements=[x[0] for x in TransactionType.choices]
    )

    user = SubFactory(UserFactory)
    company = SubFactory(CompanyFactory)

    # @post_generation
    # def set_currencies(self, create, extracted, base_currency, **kwargs):
    #     self.gross_price_per_share_currency = base_currency
    #     self.total_commission_currency = base_currency