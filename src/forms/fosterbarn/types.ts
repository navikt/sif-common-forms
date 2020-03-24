import { hasValue } from '@navikt/sif-common-core/lib/validation/hasValue';

export interface Fosterbarn {
    id?: string;
    fødselsnummer: string;
    fornavn: string;
    etternavn: string;
}

export const isFosterbarn = (fosterbarn: Partial<Fosterbarn>): fosterbarn is Fosterbarn => {
    const { fornavn, etternavn, fødselsnummer } = fosterbarn;
    return hasValue(fornavn) && hasValue(etternavn) && hasValue(fødselsnummer);
};
