import {
  COUNTRIES_REQUEST,
  COUNTRIES_REQUEST_FAILED,
  COUNTRIES_REQUEST_SUCCESS
} from '../constants';
import { TCountry } from '../types/data';
import { getCountriesRequest } from '../api';

export interface IGetCountriesAction {
  readonly type: typeof COUNTRIES_REQUEST;
}

export interface IGetCountriesFailedAction {}

export interface IGetCountriesSuccessAction {
  readonly type: any;
  readonly countries: any;
}

export type TCountriesActions = any;

export const getCountriesAction = (): IGetCountriesAction => ({
  type: COUNTRIES_REQUEST
});

export const getCountriesFailedAction = (): IGetCountriesFailedAction => ({
  type: COUNTRIES_REQUEST_FAILED
});

export const getCountriesSuccessAction = (
  countries: ReadonlyArray<TCountry>
): IGetCountriesSuccessAction => ({
  type: COUNTRIES_REQUEST_SUCCESS,
  countries
});

export const getCountriesThunk: any = () => (dispatch: any) => {
  dispatch(getCountriesAction());
  getCountriesRequest().then(res => {
    if (res && res.success) {
      dispatch(getCountriesSuccessAction(res.countries));
    } else {
      dispatch(getCountriesFailedAction());
    }
  });
};