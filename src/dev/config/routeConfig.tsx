/* eslint-disable react/display-name */
import React from 'react';
import DialogForms from '../examples/dialog-forms/DialogForms';
import VirksomhetExample from '../examples/virksomhet-example/VirksomhetExample';
import Intro from '../Intro';

export interface RouteConfig {
    path: string;
    title: string;
    renderContent: () => React.ReactNode;
}

export const routes: RouteConfig[] = [
    {
        path: 'frontpage',
        title: 'Forside',
        renderContent: () => <Intro />,
    },
    {
        path: 'dialog-forms',
        title: 'Dialogskjema',
        renderContent: () => <DialogForms />,
    },
    {
        path: 'næring',
        title: 'Næringsvirksomhet',
        renderContent: () => <VirksomhetExample />,
    },
];

export const isActiveRoute = (path: string, pathname: string): boolean => {
    return pathname.indexOf(path) >= 0;
};

export const getRouteConfig = (pathname: string): RouteConfig | undefined => {
    return routes.find((f) => isActiveRoute(f.path, pathname));
};
