import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { CountryPage, HomePage, LoginPage, PersonPage, ListPage, NotFound404 } from './pages';
import { ProtectedRoute } from './components/protected-route';

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/login">
          <LoginPage />
        </Route>
        <ProtectedRoute path="/" exact={true}>
          <HomePage />
        </ProtectedRoute>
        <ProtectedRoute path="/list" exact={true}>
          <ListPage />
        </ProtectedRoute>
        <ProtectedRoute path={`/list/:country`} exact={true}>
          <CountryPage />
        </ProtectedRoute>
        <ProtectedRoute path={`/list/:country/:personId`} exact={true}>
          <PersonPage />
        </ProtectedRoute>
        <Route>
          <NotFound404 />
        </Route>
      </Switch>
    </Router>
  );
}