import React, { useState } from 'react';
import { Clock } from '@navikt/ds-icons';
import AriaAlternative from '@navikt/sif-common-core/lib/components/aria/AriaAlternative';
import AriaText from '@navikt/sif-common-core/lib/components/aria/AriaText';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import { Time } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import { groupBy } from 'lodash';
import { EtikettInfo } from 'nav-frontend-etiketter';
import { Element, Undertittel } from 'nav-frontend-typografi';
import CalendarGrid from './CalendarGrid';
import { Omsorgsdag } from './types';

interface Props {
    omsorgsdager: Omsorgsdag[];
    fraDato: Date;
    tilDato: Date;
}

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
    return `${timer} ${pluralize(timer, 'time', 'timer')}, ${minutter} ${pluralize(minutter, 'minutt', 'minutter')}`;
};

const pluralize = (tall: number | string, singular: string, plural: string): string =>
    typeof tall === 'number' ? (tall === 1 ? singular : plural) : tall === '1' ? singular : plural;

const DagContent = ({ tid }: { tid: Time }) => {
    return (
        <EtikettInfo className={'varighet'}>
            <div className={'varighet__info'}>
                <span className="varighet__info__ikon">
                    <Clock />
                </span>
                <span className="varighet__info__tid">
                    <AriaAlternative visibleText={formatTime(tid)} ariaText={formatTimeFull(tid)} />
                </span>
            </div>
        </EtikettInfo>
    );
};

const OmsorgstilbudInfo: React.FunctionComponent<Props> = ({ omsorgsdager, fraDato, tilDato }) => {
    // const [visning, setVisning] = useState<'liste' | 'kalender'>('kalender');
    if (omsorgsdager.length === 0) {
        return <>Ingen dager registrert</>;
    }
    const måned = omsorgsdager[0].dato;
    return (
        <>
            {/* <Tabs
                defaultAktiv={1}
                onChange={(_, idx) => {
                    setVisning(idx === 0 ? 'liste' : 'kalender');
                }}>
                <Tab>Vis liste</Tab>
                <Tab>Vis kalender</Tab>
            </Tabs> */}
            {/* {visning === 'kalender' && ( */}
            <CalendarGrid
                month={måned}
                min={fraDato}
                max={tilDato}
                dateFormatter={(date: Date) => (
                    <AriaAlternative
                        visibleText={dayjs(date).format('D.')}
                        ariaText={dayjs(date).format('dddd DD. MMM YYYY')}
                    />
                )}
                noContentRenderer={() => {
                    // return <AriaAlternative visibleText={''} ariaText={'Ingen tid registrert'} />;
                    return <AriaText>Ingen tid registrert</AriaText>;
                }}
                content={omsorgsdager.map((dag) => ({
                    date: dag.dato,
                    content: <DagContent tid={dag.tid} />,
                }))}
            />
            {/* )}
            {visning === 'liste' && <OmsorgsdagerListe omsorgsdager={omsorgsdager} />} */}
        </>
    );
};

const sortDays = (d1: Omsorgsdag, d2: Omsorgsdag): number => (dayjs(d1.dato).isSameOrBefore(d2.dato) ? -1 : 1);

export const OmsorgsdagerListe = ({ omsorgsdager }: { omsorgsdager: Omsorgsdag[] }) => {
    if (omsorgsdager.length === 0) {
        return <>Ingen omsorgsdager registrert</>;
    }

    const weeksWithDays = groupBy(omsorgsdager, (dag) => `${dag.dato.getFullYear()}-${dayjs(dag.dato).isoWeek()}`);
    return (
        <>
            <Undertittel className="m-caps">{dayjs(omsorgsdager[0].dato).format('MMM YYYY')}</Undertittel>
            <div className={bem.block}>
                {Object.keys(weeksWithDays).map((key) => {
                    const days = weeksWithDays[key];
                    return (
                        <div key={key}>
                            <Box margin="l">
                                <Element tag="h3">Uke {dayjs(days[0].dato).isoWeek()}</Element>
                            </Box>
                            <Box margin="m">
                                {days.sort(sortDays).map((dag, idx) => {
                                    const timer = dag.tid.hours || '0';
                                    const minutter = dag.tid.minutes || '0';

                                    return (
                                        <EtikettInfo
                                            className={bem.element('dag')}
                                            key={idx}
                                            style={{ marginRight: '.5rem', marginBottom: '.5rem' }}>
                                            <span className={bem.element('dato')}>
                                                {dayjs(dag.dato).format('dddd D.')}
                                            </span>
                                            <br />
                                            <span className={bem.element('tid')}>
                                                {formatTime({ hours: timer, minutes: minutter })}
                                            </span>
                                        </EtikettInfo>
                                    );
                                })}
                            </Box>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default OmsorgstilbudInfo;
