export interface Tidsperiode {
    id?: string;
    fom: Date;
    tom: Date;
}

export const isTidsperiode = (tidsperiode: Partial<Tidsperiode>): tidsperiode is Tidsperiode => {
    return tidsperiode.fom !== undefined && tidsperiode.tom !== undefined;
};
