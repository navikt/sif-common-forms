import { createFormikDatepickerValue } from '@navikt/sif-common-formik/lib';
import { DateTidsperiode, DateTidsperiodeFormValues } from './types';

const isValidDateTidsperiode = (tidsperiode: Partial<DateTidsperiode>): tidsperiode is DateTidsperiode => {
    return tidsperiode.fom !== undefined && tidsperiode.tom !== undefined;
};

const mapFormValuesToDateTidsperiode = (
    formValues: DateTidsperiodeFormValues,
    id: string | undefined
): Partial<DateTidsperiode> => {
    return {
        id,
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
