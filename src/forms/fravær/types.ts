import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { FormikDatepickerValue } from '@navikt/sif-common-core/lib/validation/types';

export interface FraværPeriode extends DateRange {
    id?: string;
}

export type FraværPeriodeFormValues = Partial<{
    from: FormikDatepickerValue;
    to: FormikDatepickerValue;
}>;

export interface FraværDag {
    id?: string;
    dato: Date;
    timerArbeidsdag: string;
    timerFravær: string;
}

export type FraværDagFormValues = Partial<
    Omit<FraværDag, 'dato'> & {
        dato: FormikDatepickerValue;
    }
>;
