import React, { useEffect, useState } from 'react';
import { useParams, useRouteMatch, useLocation, useHistory } from 'react-router-dom';
import styles from './page.module.css';
import personPageStyles from './person-page.module.css';
import PersonInfo from '../components/person-info';
import { Breadcrumbs } from '../components/breadcrumbs';
import { isContainRoute, TBreadCrumbsState } from '../services/breadcrumbs';
import { getLaureatesThunk } from '../services/actions/laureates';
import { TLaureate } from '../services/types/data';
import { useDispatch, useSelector } from '../services/hooks';

export const PersonPage = () => {
  const dispatch = useDispatch();
  const { laureates, laureatesRequest } = useSelector(state => state.laureates);

  const [person, setPerson] = useState<TLaureate>();
  const { personId } = useParams<{ personId: string }>();
  const { url, path } = useRouteMatch();
  const { state } = useLocation<TBreadCrumbsState>();
  const history = useHistory();

  useEffect(() => setPerson(laureates.find(({ id }) => id === personId)), [personId, laureates]);

  useEffect(
    () => {
      dispatch(getLaureatesThunk());
    },
    [personId, dispatch]
  );

  useEffect(
    () => {
      if (person && person.firstname && person.surname && state && !isContainRoute(state, url)) {
        const personBreadcrumb = { path, url, title: `${person.firstname} ${person.surname}` };
        history.replace({ state: [...state, personBreadcrumb] });
      }
    },
    [person, path, url, state, history]
  );

  return (
    <div className={personPageStyles.wrapper}>
      <div className={styles.container}>
        <Breadcrumbs />
        {!laureatesRequest && person ? <PersonInfo person={person} /> : null}
      </div>
    </div>
  );
};