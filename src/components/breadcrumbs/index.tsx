import * as React from 'react';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';

import styles from './breadcrumbs.module.css';

import { removeRemainingCrumbs, TBreadCrumbsState } from '../../services/breadcrumbs';
import { FC } from 'react';

const Crumb: FC<{ path: string; url: string; title: string }> = ({ path, url, title }) => {
  const match = useRouteMatch(path);
  const history = useHistory();
  const { state } = useLocation<TBreadCrumbsState>();

  const routeTo = (event: React.MouseEvent) => {
    event.preventDefault();
    history.replace({ pathname: url, state: removeRemainingCrumbs(state, url) });
  };

  return (
    <span className={styles.item}>
      {match && match.isExact ? (
        title
      ) : (
        <>
          <a href={url} onClick={routeTo}>
            {title}
          </a>
          {` > `}
        </>
      )}
    </span>
  );
};

const Breadcrumbs = () => {
  const { state } = useLocation<TBreadCrumbsState>();
  if (state) {
    return (
      <nav>
        {state.map(crumb => (
          <Crumb {...crumb} key={crumb.url} />
        ))}
      </nav>
    );
  }
  return null;
};

export { Breadcrumbs };