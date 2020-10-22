import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';

export interface FraværPeriode extends DateRange {
    id?: string;
}

export type FraværPeriodeFormValues = Partial<{
    from: string;
    to: string;
}>;

export interface FraværDag {
    id?: string;
    dato: Date;
    timerArbeidsdag: string;
    timerFravær: string;
}

export type FraværDagFormValues = Partial<
    Omit<FraværDag, 'dato'> & {
        dato: string;
    }
>;
