import React, { useState } from 'react';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import { prettifyDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import dayjs from 'dayjs';
import { Omsorgsdag } from './types';
import { Time } from '@navikt/sif-common-formik/lib';
import CalendarGrid from './CalendarGrid';
import { Clock } from '@navikt/ds-icons';
import AriaAlternative from '@navikt/sif-common-core/lib/components/aria/AriaAlternative';
import AriaText from '@navikt/sif-common-core/lib/components/aria/AriaText';
import Tabs from 'nav-frontend-tabs';
import Tab from 'nav-frontend-tabs/lib/tab';

interface Props {
    omsorgdager: Omsorgsdag[];
    fraDato: Date;
    tilDato: Date;
}

interface OmsorgsdagInfo {
    dato: Date;
    tid: Time;
    dagnavn: string;
    ukenummer: number;
    årstall: number;
    årOgUke: string;
    datoTittel: string;
}

const getOmsorgsdagInfo = ({ dato, tid }: Omsorgsdag): OmsorgsdagInfo => {
    const date = dayjs(dato);
    const ukenummer = date.isoWeek();
    const årstall = date.year();
    const dagnavn = date.format('dddd');
    return {
        dato,
        tid,
        ukenummer,
        årstall,
        dagnavn,
        årOgUke: `${ukenummer},  ${årstall}`,
        datoTittel: `${dagnavn.substring(0, 3)}. ${prettifyDate(dato)}`,
    };
};

const bem = bemUtils('omsorgstilbudListe');

const formatTime = (time: Partial<Time>): JSX.Element => {
    const timer = time.hours || '0';
    const minutter = time.minutes || '0';
    return (
        <>
            <span style={{ whiteSpace: 'nowrap' }}>{timer} tim.</span>
            {` `}
            <span style={{ whiteSpace: 'nowrap' }}>{minutter} min.</span>
        </>
    );
};

const formatTimeFull = (time: Partial<Time>): string => {
    const timer = time.hours || '0';
    const minutter = time.minutes || '0';
    return `${timer} timer ${minutter} minutter`;
};

const DagContent = ({ tid }: { tid: Time }) => {
    return (
        <span className={'varighet'}>
            <span className="varighet__ikon">
                <Clock />
            </span>
            <span className="varighet__tid">
                <AriaAlternative visibleText={formatTime(tid)} ariaText={formatTimeFull(tid)} />
            </span>
        </span>
    );
};

const OmsorgstilbudInfo: React.FunctionComponent<Props> = ({ omsorgdager, fraDato, tilDato }) => {
    const [visning, setVisning] = useState<'liste' | 'kalender'>('kalender');
    if (omsorgdager.length === 0) {
        return <>Ingen dager registrert</>;
    }
    const måned = omsorgdager[0].dato;
    return (
        <>
            <Tabs
                defaultAktiv={1}
                onChange={(_, idx) => {
                    setVisning(idx === 0 ? 'liste' : 'kalender');
                }}>
                <Tab>Vis liste</Tab>
                <Tab>Vis kalender</Tab>
            </Tabs>
            {visning === 'kalender' && (
                <CalendarGrid
                    month={måned}
                    min={fraDato}
                    max={tilDato}
                    dateFormatter={(date: Date) => (
                        <AriaAlternative
                            visibleText={dayjs(date).format('D.')}
                            ariaText={dayjs(date).format('DD.MM.YYYY')}
                        />
                    )}
                    noContentRenderer={() => {
                        return <AriaText>Ingen tid registrert</AriaText>;
                    }}
                    content={omsorgdager.map((dag) => ({
                        date: dag.dato,
                        content: <DagContent tid={dag.tid} />,
                    }))}
                />
            )}
            {visning === 'liste' && (
                <ol className={bem.block}>
                    {omsorgdager.map((dag) => {
                        const timer = dag.tid.hours || 0;
                        const minutter = dag.tid.minutes || 0;
                        const { datoTittel } = getOmsorgsdagInfo(dag);

                        return (
                            <li key={datoTittel} className={bem.element('dag')}>
                                <span className={bem.element('dato')}>{datoTittel}</span>
                                <span className={bem.element('tid')}>
                                    {timer} timer, {minutter} minutter
                                </span>
                            </li>
                        );
                    })}
                </ol>
            )}
        </>
    );
};

export default OmsorgstilbudInfo;
