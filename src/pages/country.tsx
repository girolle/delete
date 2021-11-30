import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useRouteMatch, useLocation, useHistory } from 'react-router-dom';
import styles from './page.module.css';
import LaureateList from '../components/laureate-list';
import Dropdown from '../components/dropdown';
import { Breadcrumbs } from '../components/breadcrumbs';
import { deserializeQuery, serializeQuery } from '../services/api';
import { isContainRoute, TBreadCrumbsState } from '../services/breadcrumbs';
import { getLaureatesThunk } from '../services/actions/laureates';
import { getCountriesThunk } from '../services/actions/countries';
import { TLaureate, TPrize } from '../services/types/data';
import { useDispatch, useSelector } from '../services/hooks';
import { COUNTRIES_REQUEST } from '../services/constants';

const ALL = 'all';

export const CountryPage = () => {
  const { laureates } = useSelector(state => state.laureates);
  const { countries } = useSelector(state => state.countries);

  const dispatch = useDispatch();
  const [selectedYear, setSelectedYear] = useState(ALL);
  const [selectedCategory, setSelectedCategory] = useState(ALL);
  const [yearOptions, setYearOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [countryTitle, setCountryTitle] = useState('');

  const { country } = useParams<{ country: string }>();
  const { pathname, search, state } = useLocation<TBreadCrumbsState>();
  const history = useHistory();
  const { path, url } = useRouteMatch();

  useEffect(
    () => {
      if (countryTitle && state && !isContainRoute(state, url)) {
        history.replace({ state: [...state, { path, url, title: countryTitle }] });
      }
    },
    [countryTitle, path, url, state, history]
  );

  const loadFilters = useCallback((filteredLaureates: ReadonlyArray<TLaureate>) => {
    const years: Set<string> = new Set();
    const categories: Set<string> = new Set();
    filteredLaureates.forEach(({ prizes }) => {
      prizes.forEach(({ year, category }) => {
        years.add(year);
        categories.add(category);
      });
    });
    // @ts-ignore
    setYearOptions([ALL, ...Array.from(years)]);
    // @ts-ignore
    setCategoryOptions([ALL, ...Array.from(categories)]);
  }, []);

  useEffect(
    () => {
      const currentCountry = countries.find(({ code }) => code === country);
      setCountryTitle(currentCountry && currentCountry.name ? currentCountry.name : country);
    },
    [country, countries]
  );

  useEffect(
    () => {
      const countryLaureates = laureates.filter(
        ({ bornCountryCode }) => bornCountryCode === country
      );
      loadFilters(countryLaureates);
    },
    [country, laureates, loadFilters]
  );

  useEffect(
    () => {
      dispatch(getLaureatesThunk());
      dispatch(getCountriesThunk());
      dispatch({ type: COUNTRIES_REQUEST });
    },
    [dispatch]
  );

  const isItemFits = useCallback(
    (prizes: ReadonlyArray<TPrize>) => {
      const isYearFits = (year: string) => {
        return selectedYear !== ALL ? year === selectedYear : true;
      };
      const isCategoryFits = (category: string) =>
        selectedCategory !== ALL ? category === selectedCategory : true;
      return prizes.some(({ year, category }) => isYearFits(year) && isCategoryFits(category));
    },
    [selectedYear, selectedCategory]
  );

  const filteredLaureates = useMemo(
    () => {
      const countryLaureates = laureates.filter(
        ({ bornCountryCode }) => bornCountryCode === country
      );

      const res: Array<TLaureate> = [];
      countryLaureates.forEach(laureate => {
        if (isItemFits(laureate.prizes)) {
          res.push(laureate);
        }
      });

      return res;
    },
    [country, laureates, isItemFits]
  );

  useEffect(
    () => {
      const params = deserializeQuery(search);
      setSelectedYear(`${params.year || ALL}`);
      setSelectedCategory(params.category || ALL);
    },
    [search]
  );

  const filterItems = useCallback(
    (value, type) => {
      let query = search;

      const isAllItems = value.toLowerCase() === ALL;
      if (!search && !isAllItems) {
        query = `?${type}=${value}`;
      } else {
        let params = deserializeQuery(query);
        if (isAllItems) {
          if (params.hasOwnProperty(type)) {
            delete params[type];
          }
        } else {
          params = { ...params, [type]: value };
        }
        query = serializeQuery(params);
      }
      const { state } = history.location;
      history.replace({
        state,
        pathname,
        search: query
      });
    },
    [history, pathname, search]
  );

  return (
    <div className={styles.vertical_padding}>
      <header className={styles.horizontal_padding}>
        <Breadcrumbs />
        <h1>{countryTitle}</h1>
      </header>
      <div className={styles.filters}>
        <div className={styles.filter_item}>
          <Dropdown
            label="Year"
            options={yearOptions}
            handleOnSelect={value => filterItems(value, 'year')}
            selected={selectedYear}
          />
        </div>
        <div className={styles.filter_item}>
          <Dropdown
            label="Category"
            options={categoryOptions}
            handleOnSelect={value => filterItems(value, 'category')}
            selected={selectedCategory}
          />
        </div>
      </div>
      <LaureateList laureates={filteredLaureates} />
    </div>
  );
};