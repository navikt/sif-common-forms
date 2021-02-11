import { dateToISOString, ISOStringToDate } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import { guid } from 'nav-frontend-js-utils';
import { Næringstype, Virksomhet, VirksomhetFormValues } from './types';

export const harFiskerNæringstype = (næringstyper: Næringstype[]): boolean =>
    næringstyper.find((n) => n === Næringstype.FISKER) !== undefined;

export const getDatoForFerdiglignetÅrTreÅrSiden = (): Date => {
    return dayjs().subtract(3, 'years').startOf('year').toDate();
};

export const erVirksomhetRegnetSomNyoppstartet = (oppstartsdato: Date) => {
    const ligningsdato = getDatoForFerdiglignetÅrTreÅrSiden();
    const oppstartsday = dayjs(oppstartsdato).startOf('day');
    return oppstartsday.isSameOrAfter(ligningsdato);
};

export const mapFormValuesToVirksomhet = (
    formValues: VirksomhetFormValues,
    id: string | undefined
): Partial<Virksomhet> => {
    return {
        ...formValues,
        id: id || guid(),
        fom: ISOStringToDate(formValues.fom),
        tom: ISOStringToDate(formValues.tom),
        oppstartsdato: ISOStringToDate(formValues.oppstartsdato),
        varigEndringINæringsinntekt_dato: ISOStringToDate(formValues.varigEndringINæringsinntekt_dato),
    };
};

export const mapVirksomhetToFormValues = (virksomhet: Virksomhet): VirksomhetFormValues => {
    return {
        ...virksomhet,
        fom: dateToISOString(virksomhet.fom),
        tom: dateToISOString(virksomhet.tom),
        oppstartsdato: dateToISOString(virksomhet.oppstartsdato),
        varigEndringINæringsinntekt_dato: dateToISOString(virksomhet.varigEndringINæringsinntekt_dato),
    };
};
