import { dateToISOString, ISOStringToDate } from '@navikt/sif-common-formik/lib';
import { guid } from 'nav-frontend-js-utils';
import {
    Utenlandsopphold,
    UtenlandsoppholdFormValues,
    UtenlandsoppholdInnlagtPeriode,
    UtenlandsoppholdFormInnlagtPeriode,
} from './types';

const isValidUtenlandsopphold = (utenlandsopphold: Partial<Utenlandsopphold>): utenlandsopphold is Utenlandsopphold => {
    return (
        utenlandsopphold.fom !== undefined &&
        utenlandsopphold.tom !== undefined &&
        utenlandsopphold.landkode !== undefined
    );
};

const getBarnInnlagtIPerioderFromFormValues = (
    perioder?: UtenlandsoppholdFormInnlagtPeriode[]
): UtenlandsoppholdInnlagtPeriode[] | undefined => {
    const barnInnlagtPerioder: UtenlandsoppholdInnlagtPeriode[] = [];
    if (perioder) {
        perioder.forEach((periode) => {
            const fom = ISOStringToDate(periode.fom);
            const tom = ISOStringToDate(periode.tom);
            if (fom && tom) {
                barnInnlagtPerioder.push({ fom, tom });
            }
        });
    }
    return barnInnlagtPerioder.length > 0 ? barnInnlagtPerioder : undefined;
};

const mapFormValuesToUtenlandsopphold = (
    formValues: UtenlandsoppholdFormValues,
    id: string | undefined
): Partial<Utenlandsopphold> => {
    const barnInnlagtPerioder = getBarnInnlagtIPerioderFromFormValues(formValues.barnInnlagtPerioder);
    return {
        ...formValues,
        id: id || guid(),
        fom: ISOStringToDate(formValues.fom),
        tom: ISOStringToDate(formValues.tom),
        barnInnlagtPerioder,
    };
};

const mapUtenlandsoppholdToFormValues = ({
    fom,
    tom,
    erBarnetInnlagt,
    barnInnlagtPerioder,
    landkode,
    årsak,
}: Partial<Utenlandsopphold>): UtenlandsoppholdFormValues => ({
    fom: dateToISOString(fom),
    tom: dateToISOString(tom),
    erBarnetInnlagt,
    landkode,
    årsak,
    barnInnlagtPerioder: barnInnlagtPerioder?.map((p) => ({
        fom: dateToISOString(p.fom),
        tom: dateToISOString(p.tom),
    })),
});

const utenlandsoppholdUtils = {
    isValidUtenlandsopphold,
    mapFormValuesToUtenlandsopphold,
    mapUtenlandsoppholdToFormValues,
};
export default utenlandsoppholdUtils;
