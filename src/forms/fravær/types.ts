export interface FraværPeriode {
    id?: string;
    fom: Date;
    tom: Date;
}

export const isFraværPeriode = (fraværPeriode: Partial<FraværPeriode>): fraværPeriode is FraværPeriode => {
    return fraværPeriode.fom !== undefined && fraværPeriode.tom !== undefined;
};

export interface FraværDag {
    id?: string;
    dato: Date;
    timerArbeidsdag: number;
    timerFravær: number;
}

export const isFraværDag = (fraværDag: Partial<FraværDag>): fraværDag is FraværDag => {
    return fraværDag.dato !== undefined && fraværDag.timerArbeidsdag !== undefined && fraværDag.timerFravær !== undefined;
};

export interface DateRangeToDisable {
    fom: Date;
    tom: Date;
}
