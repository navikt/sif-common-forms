/* eslint-disable @typescript-eslint/camelcase */
import { createFormikDatepickerValue } from '@navikt/sif-common-formik/lib';
import { guid } from 'nav-frontend-js-utils';
import { Næringstype, Virksomhet, VirksomhetFormValues } from './types';

export const harFiskerNæringstype = (næringstyper: Næringstype[]): boolean =>
    næringstyper.find((n) => n === Næringstype.FISKER) !== undefined;

export const mapFormValuesToVirksomhet = (
    formValues: VirksomhetFormValues,
    id: string | undefined
): Partial<Virksomhet> => {
    return {
        ...formValues,
        id: id || guid(),
        fom: formValues.fom?.date,
        tom: formValues.tom?.date,
        oppstartsdato: formValues.oppstartsdato?.date,
        varigEndringINæringsinntekt_dato: formValues.varigEndringINæringsinntekt_dato?.date,
    };
};

export const mapVirksomhetToFormValues = (virksomhet: Virksomhet): VirksomhetFormValues => {
    return {
        ...virksomhet,
        fom: createFormikDatepickerValue(virksomhet.fom),
        tom: createFormikDatepickerValue(virksomhet.tom),
        oppstartsdato: createFormikDatepickerValue(virksomhet.oppstartsdato),
        varigEndringINæringsinntekt_dato: createFormikDatepickerValue(virksomhet.varigEndringINæringsinntekt_dato),
    };
};
