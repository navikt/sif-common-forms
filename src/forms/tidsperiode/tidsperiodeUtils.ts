import { createFormikDatepickerValue } from '@navikt/sif-common-formik/lib';
import { guid } from 'nav-frontend-js-utils';
import { DateTidsperiode, DateTidsperiodeFormValues } from './types';

const isValidDateTidsperiode = (tidsperiode: Partial<DateTidsperiode>): tidsperiode is DateTidsperiode => {
    return tidsperiode.fom !== undefined && tidsperiode.tom !== undefined;
};

const mapFormValuesToDateTidsperiode = (
    formValues: DateTidsperiodeFormValues,
    id: string | undefined
): Partial<DateTidsperiode> => {
    return {
        id: id || guid(),
        fom: formValues.fom?.date,
        tom: formValues.tom?.date,
    };
};

const mapDateTidsperiodeToFormValues = ({ fom, tom }: Partial<DateTidsperiode>): DateTidsperiodeFormValues => {
    return {
        fom: createFormikDatepickerValue(fom),
        tom: createFormikDatepickerValue(tom),
    };
};

const tidsperiodeUtils = {
    isValidDateTidsperiode,
    mapDateTidsperiodeToFormValues,
    mapFormValuesToDateTidsperiode,
};

export default tidsperiodeUtils;
