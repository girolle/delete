import { useAuth } from '../services/auth';
import { Redirect, Route } from 'react-router-dom';
import { FC, useEffect, useState } from 'react';
import { RouteProps } from 'react-router';

export const ProtectedRoute: FC<RouteProps> = ({ children, ...rest }) => {
  let { getUser, ...auth } = useAuth();
  const [isUserLoaded, setUserLoaded] = useState(false);

  const init = async () => {
    await getUser();
    setUserLoaded(true);
  };

  useEffect(() => {
    init();
    // eslint-disable-next-line
  }, []);

  if (!isUserLoaded) {
    return null;
  }

  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location }
            }}
          />
        )
      }
    />
  );
};