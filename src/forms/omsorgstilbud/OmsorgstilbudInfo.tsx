import React from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import dayjs from 'dayjs';
import { Undertittel } from 'nav-frontend-typografi';
import OmsorgstilbudCalendar from './OmsorgstilbudCalendar';
import { OmsorgstilbudDag } from './types';

interface Props {
    omsorgsdager: OmsorgstilbudDag[];
    fraDato: Date;
    tilDato: Date;
    skjulTommeDagerIListe?: boolean;
}

const OmsorgstilbudInfo: React.FunctionComponent<Props> = ({
    omsorgsdager,
    fraDato,
    tilDato,
    skjulTommeDagerIListe,
}) => {
    if (omsorgsdager.length === 0) {
        return <>Ingen dager registrert</>;
    }
    const måned = omsorgsdager[0].dato;
    return (
        <>
            <Undertittel>Omsorgstilbud {dayjs(måned).format('MMM YYYY')}</Undertittel>
            <Box margin="s">
                <OmsorgstilbudCalendar
                    måned={måned}
                    fraDato={fraDato}
                    tilDato={tilDato}
                    omsorgsdager={omsorgsdager}
                    skjulTommeDagerIListe={skjulTommeDagerIListe}
                />
            </Box>
        </>
    );
};
export default OmsorgstilbudInfo;
