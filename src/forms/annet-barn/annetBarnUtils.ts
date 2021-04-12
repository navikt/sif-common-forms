import { hasValue } from '@navikt/sif-common-core/lib/validation/hasValue';
import { dateToISOString, ISOStringToDate } from '@navikt/sif-common-formik/lib';
import { guid } from 'nav-frontend-js-utils';
import { AnnetBarn, AnnetBarnFormValues } from './types';

const isAnnetBarn = (annetBarn: Partial<AnnetBarn>, includeFødselsdatoSpørsmål = true): annetBarn is AnnetBarn => {
    const { fnr, navn, fødselsdato } = annetBarn;
    return hasValue(fnr) && hasValue(navn) && (includeFødselsdatoSpørsmål === false || hasValue(fødselsdato));
};

const mapFormValuesToPartialAnnetBarn = (
    formValues: AnnetBarnFormValues,
    id: string | undefined,
    includeFødselsdatoSpørsmål: boolean
): Partial<AnnetBarn> => {
    return {
        ...formValues,
        id: id || guid(),
        fødselsdato:
            includeFødselsdatoSpørsmål && formValues.fødselsdato ? ISOStringToDate(formValues.fødselsdato) : undefined,
    };
};

const mapAnnetBarnToFormValues = (
    annetBarn: Partial<AnnetBarn>,
    includeFødselsdatoSpørsmål: boolean
): AnnetBarnFormValues => {
    return {
        fnr: annetBarn.fnr,
        navn: annetBarn.navn,
        fødselsdato: includeFødselsdatoSpørsmål
            ? annetBarn.fødselsdato
                ? dateToISOString(annetBarn.fødselsdato)
                : ''
            : undefined,
    };
};

const annetBarnUtils = {
    mapAnnetBarnToFormValues,
    mapFormValuesToPartialAnnetBarn,
    isAnnetBarn,
};

export default annetBarnUtils;
