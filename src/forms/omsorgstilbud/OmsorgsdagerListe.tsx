import React from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import dayjs from 'dayjs';
import { groupBy } from 'lodash';
import { EtikettInfo } from 'nav-frontend-etiketter';
import { Element, Undertittel } from 'nav-frontend-typografi';
import FormattedTimeText from './FormattedTimeText';
import { Omsorgsdag } from './types';

interface Props {
    omsorgsdager: Omsorgsdag[];
}

const sortDays = (d1: Omsorgsdag, d2: Omsorgsdag): number => (dayjs(d1.dato).isSameOrBefore(d2.dato) ? -1 : 1);

const bem = bemUtils('omsorgstilbudListe');

export const OmsorgsdagerListe = ({ omsorgsdager }: Props) => {
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
                                                <FormattedTimeText time={{ hours: timer, minutes: minutter }} />)
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

export default OmsorgsdagerListe;
