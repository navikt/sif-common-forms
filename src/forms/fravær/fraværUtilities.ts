import { DateRangeToDisable, FraværDag } from './types';

export const fraværDagTilDateRangeToDisable = (fraværDag: FraværDag): DateRangeToDisable => ({
    fom: fraværDag.dato,
    tom: fraværDag.dato
});

