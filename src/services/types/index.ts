import { store } from '../store';
import { TUserState } from '../reducers/user';
import { TLaureatesState } from '../reducers/laureates';
import { TCountriesState } from '../reducers/countries';

export type AppDispatch = typeof store.dispatch;
export type RootState = {
  user: TUserState;
  laureates: TLaureatesState;
  countries: TCountriesState;
};