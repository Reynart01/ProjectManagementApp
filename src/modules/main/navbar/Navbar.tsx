import React, { useMemo } from 'react';
import { useLocation } from 'react-router';
import { Link, NavLink } from 'react-router-dom';

import AddTemplateIcon from '@material-ui/icons/Queue';

import { Button } from 'ui';

import { Guard } from 'core/auth';

import UserSection from './user-section';

import csx from './Navbar.scss';

const getBreadcrumbs = (pathname: string) => {
  return pathname.split('/');
};

const getLinkPath = (index: number, breadcrumbs: string[], basePath: string) => {
  const path = `${basePath}/${breadcrumbs.slice(0, index + 1).join('/')}`;
  return path;
};

namespace Navbar {
  export interface Props {
    basePath: string;
  }
}

const Navbar = ({ basePath }: Navbar.Props) => {
  const location = useLocation();

  const breadcrumbs = useMemo(() => getBreadcrumbs(location.pathname.replace(`${basePath}/`, '')), [
    location,
    basePath
  ]);

  const isTemplatesRoute = useMemo(() => location.pathname.includes('templates'), [
    location.pathname
  ]);

  return (
    <nav className={csx.navbar}>
      <div className={csx.breadcrumbs}>
        {breadcrumbs.map((breadcrumb, idx) => (
          <React.Fragment key={idx}>
            <div className={csx.breadcrumb}>
              <Link to={getLinkPath(idx, breadcrumbs, basePath)}>{breadcrumb}</Link>
            </div>
            <div className={csx.breadcrumbDivider}>{'>'}</div>
          </React.Fragment>
        ))}
      </div>

      {isTemplatesRoute && (
        <Guard.Protected>
          <NavLink replace to="/app/templates/management">
            <Button>
              <AddTemplateIcon />
              CREATE TEMPLATE
            </Button>
          </NavLink>
        </Guard.Protected>
      )}

      <div className={csx.divider} />

      <UserSection />
    </nav>
  );
};

export default Navbar;
