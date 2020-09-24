import { hasValue } from '@navikt/sif-common-core/lib/validation/hasValue';

export interface AnnetBarn {
    id?: string;
    fnr: string;
    fødselsdato: Date;
    navn: string;
}

export const isAnnetBarn = (annetBarn: Partial<AnnetBarn>): annetBarn is AnnetBarn => {
    const { fnr, navn, fødselsdato } = annetBarn;
    return hasValue(fnr) && hasValue(navn) && hasValue(fødselsdato);
};
