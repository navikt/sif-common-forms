import { ApiStringDate } from '@navikt/sif-common/lib/common/types/ApiStringDate';

export enum FrilansoppdragFormField {
    'arbeidsgiverNavn' = 'arbeidsgiverNavn',
    'fom' = 'fom',
    'tom' = 'tom',
    'erPågående' = 'erPågående'
}

export interface Frilansoppdrag {
    id?: string;
    [FrilansoppdragFormField.arbeidsgiverNavn]: string;
    [FrilansoppdragFormField.fom]: Date;
    [FrilansoppdragFormField.tom]: Date | undefined;
    [FrilansoppdragFormField.erPågående]: boolean | undefined;
}

export interface FrilansoppdragApiData {
    arbeidsgivernavn: string;
    fra_og_med: ApiStringDate;
    til_og_med: ApiStringDate | null;
    er_pagaende?: boolean;
}

export const isFrilansoppdrag = (oppdrag: Partial<Frilansoppdrag>): oppdrag is Frilansoppdrag => {
    const { arbeidsgiverNavn, erPågående, fom, tom } = oppdrag;
    if (arbeidsgiverNavn !== undefined && fom !== undefined && (erPågående !== undefined || tom !== undefined)) {
        return true;
    }
    return false;
};
