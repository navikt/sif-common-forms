export enum Årsak {
    'fosterbarn' = 'FOSTERBARN',
    'barnetBorIUtlandet' = 'BARNET_BOR_I_UTLANDET',
    'annet' = 'ANNET',
}
export interface AnnetBarn {
    id?: string;
    fnr: string;
    fødselsdato: Date;
    navn: string;
    årsakenTilÅLeggeBarnet?: Årsak;
}

export type AnnetBarnFormValues = Partial<
    Omit<AnnetBarn, 'fødselsdato' | 'id'> & {
        fødselsdato: string;
    }
>;
