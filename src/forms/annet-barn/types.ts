import { FormikDatepickerValue } from '@navikt/sif-common-formik/lib';

export interface AnnetBarn {
    id?: string;
    fnr: string;
    fødselsdato: Date;
    navn: string;
}

export type AnnetBarnFormValues = Partial<
    Omit<AnnetBarn, 'fødselsdato' | 'id'> & {
        fødselsdato: FormikDatepickerValue;
    }
>;
