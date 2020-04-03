import { hasValue } from '@navikt/sif-common-core/lib/validation/hasValue';

export interface Fosterbarn {
    id?: string;
    fødselsnummer: string;
    fornavn?: string;
    etternavn?: string;
}

export const isFosterbarn = (fosterbarn: Partial<Fosterbarn>, includeName?: boolean): fosterbarn is Fosterbarn => {
    const { fornavn, etternavn, fødselsnummer } = fosterbarn;
    if (includeName) {
        return hasValue(fornavn) && hasValue(etternavn) && hasValue(fødselsnummer);
    }
    return hasValue(fødselsnummer);
};
