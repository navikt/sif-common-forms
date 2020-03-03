export interface Ferieuttak {
    id?: string;
    fom: Date;
    tom: Date;
}

export const isFerieuttak = (ferieuttak: Partial<Ferieuttak>): ferieuttak is Ferieuttak => {
    return ferieuttak.fom !== undefined && ferieuttak.tom !== undefined;
};
