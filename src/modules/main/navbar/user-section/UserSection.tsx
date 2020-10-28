import React from 'react';
import { NavLink, useHistory } from 'react-router-dom';

import { Avatar } from '@material-ui/core';

import { Button } from 'ui';

import { Guard } from 'core/auth';
import { TemplateCategory } from 'core/api';

import Notifications from './notifications';

import csx from './UserSection.scss';

const UserSection = () => {
  const { replace } = useHistory();

  return (
    <div className={csx.userSection}>
      <Guard.Protected>
        {({ user: { username }, logOut }) => (
          <>
            <div className={csx.details}>
              <span>Hi, {username}</span>
              <Avatar className={csx.avatar}>{username.charAt(0).toUpperCase()}</Avatar>
            </div>

            <Notifications />

            <div className={csx.divider} />

            <span
              className={csx.logoutBtn}
              onClick={() => {
                replace(`/app/templates/${TemplateCategory.ALL}`);
                logOut();
              }}
            >
              Logout
            </span>
          </>
        )}
      </Guard.Protected>

      <Guard.Unprotected>
        <>
          <NavLink to="/login">
            <Button className={csx.logInBtn}>LOG IN</Button>
          </NavLink>

          <NavLink to="/register">
            <Button>CREATE ACCOUNT</Button>
          </NavLink>
        </>
      </Guard.Unprotected>
    </div>
  );
};

export default UserSection;
