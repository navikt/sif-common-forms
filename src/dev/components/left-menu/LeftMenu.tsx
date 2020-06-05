import React from 'react';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import 'nav-frontend-lenker-style';
import { isActiveRoute, routes } from '../../config/routeConfig';

const lenkeBem = bemUtils('lenke');

const LeftMenu = ({
    history: {
        location: { pathname },
    },
}: RouteComponentProps) => {
    return (
        <div className="leftMenu">
            {routes.map((route) => (
                <Link
                    key={route.path}
                    to={route.path}
                    className={lenkeBem.classNames(
                        lenkeBem.block,
                        lenkeBem.modifierConditional('active', isActiveRoute(route.path, pathname))
                    )}>
                    {route.title}
                </Link>
            ))}
        </div>
    );
};

export default withRouter(LeftMenu);
