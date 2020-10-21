import { FormikDatepickerValue } from '@navikt/sif-common-core/lib/validation/types';

export interface Ferieuttak {
    id?: string;
    fom: Date;
    tom: Date;
}

export type FerieuttakFormValues = {
    fom?: FormikDatepickerValue;
    tom?: FormikDatepickerValue;
};
