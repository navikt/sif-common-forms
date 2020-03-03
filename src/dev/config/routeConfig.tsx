import React from 'react';
import DialogForms from '../examples/dialog-forms/DialogForms';
import FrilansExample from '../examples/frilans-example/FrilansExample';
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
        renderContent: () => <Intro />
    },
    {
        path: 'dialog-forms',
        title: 'Dialogskjema',
        renderContent: () => <DialogForms />
    },
    {
        path: 'frilans',
        title: 'Frilans',
        renderContent: () => <FrilansExample />
    },
    {
        path: 'næring',
        title: 'Næringsvirksomhet',
        renderContent: () => <VirksomhetExample />
    }
];

export const getRouteConfig = (pathname: string): RouteConfig | undefined => {
    return routes.find((f) => isActiveRoute(f.path, pathname));
};

export const isActiveRoute = (path: string, pathname: string): boolean => {
    return pathname.indexOf(path) >= 0;
};
