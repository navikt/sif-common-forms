import { FormikDatepickerValue } from '@navikt/sif-common-core/lib/validation/types';

export interface BostedUtland {
    id?: string;
    fom: Date;
    tom: Date;
    landkode: string;
}

export type BostedUtlandFormValues = Partial<
    Omit<BostedUtland, 'id' | 'fom' | 'tom'> & {
        fom: FormikDatepickerValue;
        tom: FormikDatepickerValue;
    }
>;
