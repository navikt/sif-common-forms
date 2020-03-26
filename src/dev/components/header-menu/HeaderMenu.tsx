import * as React from 'react';
import { Button, Menu, MenuItem, Wrapper } from 'react-aria-menubutton';
import { useHistory } from 'react-router-dom';
import { NedChevron } from 'nav-frontend-chevron';
import { isActiveRoute, RouteConfig, routes } from '../../config/routeConfig';
import './headerMenu.less';

const renderMenuItem = (route: RouteConfig) => {
    return (
        <li key={route.path}>
            <MenuItem className="headerMenu__menu__item">
                <div data-page={route.path}>{route.title}</div>
            </MenuItem>
        </li>
    );
};

const HeaderMenu: React.StatelessComponent = () => {
    const history = useHistory();
    const {
        location: { pathname }
    } = history;

    const toggle = (element: any) => {
        const r = element.props ? element.props['data-page'] : undefined;
        if (r) {
            history.push(r);
        }
    };
    const route = routes.find((r) => isActiveRoute(r.path, pathname)) || routes[0];
    return (
        <div className="headerMenu">
            <Wrapper className="headerMenu__wrapper" onSelection={toggle}>
                <Button className="headerMenu__button">
                    <div className="headerMenu__button__label">{route ? route.title : 'Velg'}</div>
                    <div className="headerMenu__button__chevron">
                        <NedChevron />
                    </div>
                </Button>
                <Menu className="headerMenu__menu">
                    <ul>{routes.map(renderMenuItem)}</ul>
                </Menu>
            </Wrapper>
        </div>
    );
};
export default HeaderMenu;
