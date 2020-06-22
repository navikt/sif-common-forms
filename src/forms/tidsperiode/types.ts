export interface DateTidsperiode {
    id?: string;
    fom: Date;
    tom: Date;
}

export const isDateTidsperiode = (tidsperiode: Partial<DateTidsperiode>): tidsperiode is DateTidsperiode => {
    return tidsperiode.fom !== undefined && tidsperiode.tom !== undefined;
};
