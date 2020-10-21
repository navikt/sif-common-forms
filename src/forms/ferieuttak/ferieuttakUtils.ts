import { createFormikDatepickerValue } from '@navikt/sif-common-formik/lib';
import { guid } from 'nav-frontend-js-utils';
import { Ferieuttak, FerieuttakFormValues } from './types';

export const isValidFerieuttak = (ferieuttak: Partial<Ferieuttak>): ferieuttak is Ferieuttak => {
    return ferieuttak.fom !== undefined && ferieuttak.tom !== undefined;
};

const mapFormValuesToFerieuttak = (formValues: FerieuttakFormValues, id: string | undefined): Partial<Ferieuttak> => {
    return {
        id: id || guid(),
        fom: formValues.fom?.date,
        tom: formValues.tom?.date,
    };
};

const mapFerieuttakToFormValues = ({ fom, tom }: Partial<Ferieuttak>): FerieuttakFormValues => {
    return {
        fom: createFormikDatepickerValue(fom),
        tom: createFormikDatepickerValue(tom),
    };
};

const ferieuttakUtils = {
    isValidFerieuttak,
    mapFerieuttakToFormValues,
    mapFormValuesToFerieuttak,
};

export default ferieuttakUtils;
