import { FormikDatepickerValue } from '@navikt/sif-common-core/lib/validation/types';

export interface DateTidsperiode {
    id?: string;
    fom: Date;
    tom: Date;
}

export type DateTidsperiodeFormValues = {
    fom?: FormikDatepickerValue;
    tom?: FormikDatepickerValue;
};
