export enum OppdragsgiverType {
    'ARBEIDSTAKER' = 'ARBEIDSTAKER',
    'FRILANSER' = 'FRILANSER',
}

export interface OpptjeningUtland {
    id?: string;
    fom: Date;
    tom: Date;
    landkode: string;
    type: OppdragsgiverType;
    navn: string;
}

export type OpptjeningUtlandFormValues = Partial<
    Omit<OpptjeningUtland, 'id' | 'fom' | 'tom'> & {
        fom?: string;
        tom?: string;
    }
>;
