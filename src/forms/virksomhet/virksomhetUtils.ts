import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { date4YearsAgo } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { dateToISOString, ISOStringToDate } from '@navikt/sif-common-formik/lib';
import { getNumberFromStringInput } from '@navikt/sif-common-formik/lib/validation/validationUtils';
import dayjs from 'dayjs';
import { guid } from 'nav-frontend-js-utils';
import { Næringstype, Virksomhet, VirksomhetFormValues } from './types';

export const harFiskerNæringstype = (næringstyper: Næringstype[]): boolean =>
    næringstyper.find((n) => n === Næringstype.FISKE) !== undefined;

export const erFiskerNæringstype = (næringstype?: Næringstype): boolean =>
    næringstype ? næringstype === Næringstype.FISKE : false;

export const erVirksomhetRegnetSomNyoppstartet = (oppstartsdato: Date) => {
    return dayjs(oppstartsdato).startOf('day').isAfter(date4YearsAgo);
};

export const cleanupVirksomhetFormValues = (formValues: VirksomhetFormValues): VirksomhetFormValues => {
    const values: VirksomhetFormValues = { ...formValues };

    if (erFiskerNæringstype(values.næringstype) === false) {
        values.fiskerErPåBladB = YesOrNo.UNANSWERED;
    }
    const fomDate = ISOStringToDate(values.fom);
    const tomDate = ISOStringToDate(values.tom);

    if (tomDate) {
        values.erPågående = undefined;
    }

    if (fomDate && erVirksomhetRegnetSomNyoppstartet(fomDate)) {
        values.hattVarigEndringAvNæringsinntektSiste4Kalenderår = YesOrNo.UNANSWERED;
    }
    if (fomDate && erVirksomhetRegnetSomNyoppstartet(fomDate) === false) {
        values.næringsinntekt = undefined;
        values.harBlittYrkesaktivILøpetAvDeTreSisteFerdigliknedeÅrene = YesOrNo.UNANSWERED;
    }
    if (values.harBlittYrkesaktivILøpetAvDeTreSisteFerdigliknedeÅrene !== YesOrNo.YES) {
        values.blittYrkesaktivDato = undefined;
    }
    if (values.hattVarigEndringAvNæringsinntektSiste4Kalenderår !== YesOrNo.YES) {
        values.varigEndringINæringsinntekt_dato = undefined;
        values.varigEndringINæringsinntekt_forklaring = undefined;
        values.varigEndringINæringsinntekt_inntektEtterEndring = undefined;
    }
    if (values.registrertINorge === YesOrNo.NO) {
        values.organisasjonsnummer = undefined;
        values.harRegnskapsfører = YesOrNo.UNANSWERED;
        values.regnskapsfører_telefon = undefined;
    }
    if (values.registrertINorge === YesOrNo.YES) {
        values.registrertILand = undefined;
    }
    if (values.harRegnskapsfører !== YesOrNo.YES) {
        values.regnskapsfører_navn = undefined;
        values.regnskapsfører_telefon = undefined;
    }
    return values;
};

export const mapFormValuesToVirksomhet = (
    formValues: VirksomhetFormValues,
    id: string | undefined
): Partial<Virksomhet> => {
    const næringsinntekt = getNumberFromStringInput(formValues.næringsinntekt);
    const inntektEtterVarigEndring = getNumberFromStringInput(
        formValues.varigEndringINæringsinntekt_inntektEtterEndring
    );

    return {
        ...formValues,
        id: id || guid(),
        fom: ISOStringToDate(formValues.fom),
        tom: ISOStringToDate(formValues.tom),
        blittYrkesaktivDato: ISOStringToDate(formValues.blittYrkesaktivDato),
        næringsinntekt,
        varigEndringINæringsinntekt_dato: ISOStringToDate(formValues.varigEndringINæringsinntekt_dato),
        varigEndringINæringsinntekt_inntektEtterEndring: inntektEtterVarigEndring,
    };
};

export const mapVirksomhetToFormValues = (virksomhet: Virksomhet): VirksomhetFormValues => {
    return {
        ...virksomhet,
        fom: dateToISOString(virksomhet.fom),
        tom: dateToISOString(virksomhet.tom),
        blittYrkesaktivDato: dateToISOString(virksomhet.blittYrkesaktivDato),
        næringsinntekt: virksomhet.næringsinntekt ? `${virksomhet.næringsinntekt}` : undefined,
        varigEndringINæringsinntekt_dato: dateToISOString(virksomhet.varigEndringINæringsinntekt_dato),
        varigEndringINæringsinntekt_inntektEtterEndring: virksomhet.varigEndringINæringsinntekt_inntektEtterEndring
            ? `${virksomhet.varigEndringINæringsinntekt_inntektEtterEndring}`
            : undefined,
    };
};
