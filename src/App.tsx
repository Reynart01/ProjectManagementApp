import React from 'react';
import { Switch, Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';

import { withLazy } from 'shared/utils';
import { withAlertsManagement } from 'shared/alerts-management';

import { coreInstance } from 'api';

const LoginView = withLazy(() => import('views/login'));
const RegisterView = withLazy(() => import('views/register'));
const MainView = withLazy(() => import('views/main'));
const HomeView = withLazy(() => import('views/home'));

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login" component={LoginView} />
        <Route path="/register" component={RegisterView} />
        <Route path="/app" component={MainView} />
        <Route path="" component={HomeView} />
      </Switch>
    </BrowserRouter>
  );
};

export default withAlertsManagement(App)(coreInstance);
