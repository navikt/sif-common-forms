import React from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import dayjs from 'dayjs';
import { Undertittel } from 'nav-frontend-typografi';
import OmsorgstilbudCalendar from './OmsorgstilbudCalendar';
import { OmsorgstilbudDag } from './types';
import { getOmsorgsdagerIPeriode } from './omsorgstilbudUtils';

interface Props {
    alleOmsorgsdager: OmsorgstilbudDag[];
    fraDato: Date;
    tilDato: Date;
    skjulTommeDagerIListe?: boolean;
    tittelRenderer?: (fraDato: Date, tilDato: Date, omsorgsdager: OmsorgstilbudDag[]) => React.ReactNode;
}

const OmsorgstilbudInfo: React.FunctionComponent<Props> = ({
    alleOmsorgsdager,
    fraDato,
    tilDato,
    tittelRenderer,
    skjulTommeDagerIListe,
}) => {
    const omsorgsdagerIPeriode = getOmsorgsdagerIPeriode(alleOmsorgsdager, { from: fraDato, to: tilDato });
    if (omsorgsdagerIPeriode.length === 0) {
        return <>Ingen dager registrert</>;
    }
    const måned = omsorgsdagerIPeriode[0].dato;
    return (
        <>
            {tittelRenderer ? (
                tittelRenderer(fraDato, tilDato, omsorgsdagerIPeriode)
            ) : (
                <Undertittel tag="h3">Omsorgstilbud {dayjs(måned).format('MMM YYYY')}</Undertittel>
            )}

            <Box margin="s">
                <OmsorgstilbudCalendar
                    måned={måned}
                    fraDato={fraDato}
                    tilDato={tilDato}
                    omsorgsdager={omsorgsdagerIPeriode}
                    skjulTommeDagerIListe={skjulTommeDagerIListe}
                />
            </Box>
        </>
    );
};
export default OmsorgstilbudInfo;
