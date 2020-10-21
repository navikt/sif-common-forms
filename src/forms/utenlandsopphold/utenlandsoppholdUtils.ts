import { createFormikDatepickerValue } from '@navikt/sif-common-formik/lib';
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
        perioder.forEach(({ fom, tom }) => {
            if (fom?.date && tom?.date) {
                barnInnlagtPerioder.push({ fom: fom.date, tom: tom.date });
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
        fom: formValues.fom?.date,
        tom: formValues.tom?.date,
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
    fom: createFormikDatepickerValue(fom),
    tom: createFormikDatepickerValue(tom),
    erBarnetInnlagt,
    landkode,
    årsak,
    barnInnlagtPerioder: barnInnlagtPerioder?.map((p) => ({
        fom: createFormikDatepickerValue(p.fom),
        tom: createFormikDatepickerValue(p.tom),
    })),
});

const utenlandsoppholdUtils = {
    isValidUtenlandsopphold,
    mapFormValuesToUtenlandsopphold,
    mapUtenlandsoppholdToFormValues,
};
export default utenlandsoppholdUtils;
