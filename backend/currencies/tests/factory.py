from factory import Factory, Faker


class CurrencyFactory(Factory):
    name = Faker("currency_name")
    code = Faker("currency_code")
    symbol = Faker("currency_symbol")
    countries = [Faker("country") for _ in range(3)]
