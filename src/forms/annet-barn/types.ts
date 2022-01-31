export enum BarnType {
    'fosterbarn' = 'FOSTERBARN',
    'barnetBorIUtlandet' = 'BARNET_BOR_I_UTLANDET',
    'annet' = 'ANNET',
}
export interface AnnetBarn {
    id?: string;
    fnr: string;
    fødselsdato: Date;
    navn: string;
    type?: BarnType;
}

export type AnnetBarnFormValues = Partial<
    Omit<AnnetBarn, 'fødselsdato' | 'id'> & {
        fødselsdato: string;
    }
>;
