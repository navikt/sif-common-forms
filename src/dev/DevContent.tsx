import React from 'react';
import MediaQuery from 'react-responsive';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import HeaderMenu from './components/header-menu/HeaderMenu';
import LeftMenu from './components/left-menu/LeftMenu';
import { getRouteConfig } from './config/routeConfig';
import Intro from './Intro';

type Props = RouteComponentProps;

const DevContent = ({
    history: {
        location: { pathname },
    },
}: Props) => {
    const routeConfig = getRouteConfig(pathname);
    return (
        <>
            <MediaQuery minWidth={1072}>
                <aside className="asideContent">
                    <LeftMenu />
                </aside>
                <article style={{ maxWidth: '1000px' }} className="mainContent">
                    {routeConfig ? routeConfig.renderContent() : <Intro />}
                </article>
            </MediaQuery>
            <MediaQuery maxWidth={1071}>
                <aside className="asideContentTop">
                    <HeaderMenu />
                </aside>
                <article style={{ maxWidth: '1000px' }} className="mainContent">
                    {routeConfig ? routeConfig.renderContent() : <Intro />}
                </article>
            </MediaQuery>
        </>
    );
};

export default withRouter(DevContent);
