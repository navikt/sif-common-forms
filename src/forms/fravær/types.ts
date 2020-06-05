import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';

export interface FraværPeriode extends DateRange {
    id?: string;
}

export const isFraværPeriode = (fraværPeriode: Partial<FraværPeriode>): fraværPeriode is FraværPeriode => {
    return fraværPeriode.from !== undefined && fraværPeriode.to !== undefined;
};

export interface FraværDag {
    id?: string;
    dato: Date;
    timerArbeidsdag: number;
    timerFravær: number;
}

export const isFraværDag = (fraværDag: Partial<FraværDag>): fraværDag is FraværDag => {
    return (
        fraværDag.dato !== undefined && fraværDag.timerArbeidsdag !== undefined && fraværDag.timerFravær !== undefined
    );
};
