import React, { useState } from 'react';
import Tabs from 'nav-frontend-tabs';
import 'nav-frontend-tabs-style';
import PageIntro from '../../components/page-intro/PageIntro';
import { RouteConfig } from '../../config/routeConfig';
import BostedUtlandExample from './BostedUtlandExample';
import FerieuttakExample from './FerieuttakExample';
import FosterbarnExample from './FosterbarnExample';
import UtenlandsoppholdIPeriodenExample from './UtenlandsoppholdExample';
import FraværExample from './FraværExample';

interface Props {}

const tabRoutes: RouteConfig[] = [
    {
        path: 'bosted-utland',
        renderContent: () => <BostedUtlandExample />,
        title: 'Bosted utland'
    },
    {
        path: 'ferieuttak',
        renderContent: () => <FerieuttakExample />,
        title: 'Ferieuttak i perioden'
    },
    {
        path: 'utenlandsopphold',
        renderContent: () => <UtenlandsoppholdIPeriodenExample />,
        title: 'Utenlandsopphold i perioden'
    },
    {
        path: 'fosterbarn',
        renderContent: () => <FosterbarnExample />,
        title: 'Fosterbarn'
    },
    {
        path: 'fravær',
        renderContent: () => <FraværExample />,
        title: 'Fravær'
    }
];

const DialogForms: React.FunctionComponent<Props> = (props) => {
    const [path, setPath] = useState(tabRoutes[0].path);
    const activeRoute = tabRoutes.find((r) => {
        return r.path === path;
    });
    return (
        <>
            <PageIntro title="Dialogskjema">
                Skjema for ferieuttak i perioden, utenlandsopphold i perioden og bosted i utlandet.
            </PageIntro>
            <Tabs
                onChange={(evt, idx) => setPath(tabRoutes[idx].path)}
                tabs={tabRoutes.map((r) => ({
                    label: r.title,
                    active: r.path === path ? 'true' : 'false'
                }))}
            />
            {activeRoute && activeRoute.renderContent()}
        </>
    );
};

export default DialogForms;
