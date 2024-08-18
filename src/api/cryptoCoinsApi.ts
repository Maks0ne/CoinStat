import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface ICoin {
  CoinInfo: {
    Name: string;
    FullName: string;
    ImageUrl: string;
  };
  RAW?: {
    USD?: {
      PRICE: number;
      CHANGE24HOUR: number;
    };
  };
}

export interface ICoinsTransformed {
  name: string;
  fullName: string;
  imageUrl: string;
  price: number;
  change24hour: number;
}

export const cryptoCoinApi = createApi({
  reducerPath: 'cryptoCoinApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://min-api.cryptocompare.com/data/' }),
  endpoints: (builder) => ({
    getCoins: builder.query<ICoinsTransformed[], void>({
      query: () => 'top/mktcapfull?limit=35&tsym=USD',
      transformResponse: (response: { Data: ICoin[] }) => {
        return response.Data
        .filter(coin => coin.RAW?.USD)
        .map((coin) => ({
          name: coin.CoinInfo.Name,
          fullName: coin.CoinInfo.FullName,
          imageUrl: `https://www.cryptocompare.com${coin.CoinInfo.ImageUrl}`,
          price: coin.RAW!.USD!.PRICE,
          change24hour: coin.RAW!.USD!.CHANGE24HOUR,
        }));
      },
    }),
  }),
});

export const { useGetCoinsQuery } = cryptoCoinApi;