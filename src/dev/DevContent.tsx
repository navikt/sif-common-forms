import React from 'react';
import MediaQuery from 'react-responsive';
import { useHistory } from 'react-router-dom';
import HeaderMenu from './components/header-menu/HeaderMenu';
import LeftMenu from './components/left-menu/LeftMenu';
import { getRouteConfig } from './config/routeConfig';
import Intro from './Intro';

interface Props {}

const DevContent: React.FunctionComponent<Props> = (props) => {
    const history = useHistory();
    const {
        location: { pathname }
    } = history;
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

export default DevContent;
