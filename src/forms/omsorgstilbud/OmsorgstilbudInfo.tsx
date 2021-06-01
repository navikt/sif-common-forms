import React from 'react';
import AriaAlternative from '@navikt/sif-common-core/lib/components/aria/AriaAlternative';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { Time } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import { EtikettInfo } from 'nav-frontend-etiketter';
import { Undertekst, Undertittel } from 'nav-frontend-typografi';
import CalendarGrid from '../components/calendar-grid/CalendarGrid';
import FormattedTimeText from './FormattedTimeText';
import { OmsorgstilbudDag } from './types';

interface Props {
    omsorgsdager: OmsorgstilbudDag[];
    fraDato: Date;
    tilDato: Date;
}

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
                <span className="varighet__info__tid">
                    <AriaAlternative visibleText={<FormattedTimeText time={tid} />} ariaText={formatTimeFull(tid)} />
                </span>
            </div>
        </EtikettInfo>
    );
};

const OmsorgstilbudInfo: React.FunctionComponent<Props> = ({ omsorgsdager, fraDato, tilDato }) => {
    if (omsorgsdager.length === 0) {
        return <>Ingen dager registrert</>;
    }
    const måned = omsorgsdager[0].dato;
    return (
        <>
            <Undertittel>Omsorgstilbud {dayjs(måned).format('MMM YYYY')}</Undertittel>
            <Box margin="s">
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
                        return <Undertekst className={'ingenTidRegistrert'}>Ingen tid registrert</Undertekst>;
                    }}
                    content={omsorgsdager.map((dag) => ({
                        date: dag.dato,
                        content: <DagContent tid={dag.tid} />,
                    }))}
                />
            </Box>
        </>
    );
};
export default OmsorgstilbudInfo;
