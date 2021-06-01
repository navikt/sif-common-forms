import React from 'react';
import { Clock } from '@navikt/ds-icons';
import AriaAlternative from '@navikt/sif-common-core/lib/components/aria/AriaAlternative';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { Time } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import { EtikettInfo } from 'nav-frontend-etiketter';
import { Undertekst, Undertittel } from 'nav-frontend-typografi';
import FormattedTimeText from './FormattedTimeText';
import { Omsorgsdag } from './types';
import CalendarGrid from '../components/calendar-grid/CalendarGrid';

interface Props {
    omsorgsdager: Omsorgsdag[];
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
                <span className="varighet__info__ikon">
                    <Clock />
                </span>
                <span className="varighet__info__tid">
                    <AriaAlternative visibleText={<FormattedTimeText time={tid} />} ariaText={formatTimeFull(tid)} />
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
            {/* )}
            {visning === 'liste' && <OmsorgsdagerListe omsorgsdager={omsorgsdager} />} */}
        </>
    );
};
export default OmsorgstilbudInfo;
