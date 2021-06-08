import { date4YearsAgo } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { dateToISOString, ISOStringToDate } from '@navikt/sif-common-formik/lib';
import { getNumberFromStringInput } from '@navikt/sif-common-formik/lib/validation/validationUtils';
import dayjs from 'dayjs';
import { guid } from 'nav-frontend-js-utils';
import { Næringstype, Virksomhet, VirksomhetFormValues } from './types';

export const harFiskerNæringstype = (næringstyper: Næringstype[]): boolean =>
    næringstyper.find((n) => n === Næringstype.FISKE) !== undefined;

export const erVirksomhetRegnetSomNyoppstartet = (oppstartsdato: Date) => {
    return dayjs(oppstartsdato).startOf('day').isAfter(date4YearsAgo);
};

export const mapFormValuesToVirksomhet = (
    formValues: VirksomhetFormValues,
    id: string | undefined
): Partial<Virksomhet> => {
    const varigEndringINæringsinntekt_inntektEtterEndring = getNumberFromStringInput(
        formValues.varigEndringINæringsinntekt_inntektEtterEndring
    );
    return {
        ...formValues,
        id: id || guid(),
        fom: ISOStringToDate(formValues.fom),
        tom: ISOStringToDate(formValues.tom),
        blittYrkesaktivDato: ISOStringToDate(formValues.blittYrkesaktivDato),
        varigEndringINæringsinntekt_dato: ISOStringToDate(formValues.varigEndringINæringsinntekt_dato),
        varigEndringINæringsinntekt_inntektEtterEndring: varigEndringINæringsinntekt_inntektEtterEndring
            ? Math.round(varigEndringINæringsinntekt_inntektEtterEndring)
            : varigEndringINæringsinntekt_inntektEtterEndring,
    };
};

export const mapVirksomhetToFormValues = (virksomhet: Virksomhet): VirksomhetFormValues => {
    return {
        ...virksomhet,
        fom: dateToISOString(virksomhet.fom),
        tom: dateToISOString(virksomhet.tom),
        blittYrkesaktivDato: dateToISOString(virksomhet.blittYrkesaktivDato),
        varigEndringINæringsinntekt_dato: dateToISOString(virksomhet.varigEndringINæringsinntekt_dato),
        varigEndringINæringsinntekt_inntektEtterEndring: `${virksomhet.varigEndringINæringsinntekt_inntektEtterEndring}`,
    };
};
