import { registerAs } from '@nestjs/config';

export default registerAs(
  'rate',
  (): Record<string, any> => ({
    clients: {
      NBUApiUrl:
        'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchangenew?valcode=USD&json',
      privatbankApiUrl:
        'https://api.privatbank.ua/p24api/pubinfo?exchange&coursid=5',
      monobankApiUrl: 'https://api.monobank.ua/bank/currency',
      currencybeaconApiUrl:
        'https://api.currencybeacon.com/v1/latest?api_key=3mmxKhizwvv45RgChliXaxUIY3aSkKO1&base=USD&symbols=UAH',
      currencyApiUrl:
        'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json',
    },
  }),
);
