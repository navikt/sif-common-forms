import { formatDateToApiFormat } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { Frilansoppdrag, FrilansoppdragApiData } from './types';

export const mapFrilansOppdragToApiData = (frilansoppdrag: Frilansoppdrag): FrilansoppdragApiData | undefined => {
    const { arbeidsgiverNavn, erPågående, fom, tom } = frilansoppdrag;
    return {
        arbeidsgivernavn: arbeidsgiverNavn,
        fra_og_med: formatDateToApiFormat(fom),
        til_og_med: erPågående || tom === undefined ? null : formatDateToApiFormat(tom),
        er_pagaende: erPågående
    };
};
