import { dateToISOString, ISOStringToDate } from '@navikt/sif-common-formik/lib';
import { hasValue } from '@navikt/sif-common-formik/lib/validation/validationUtils';
import { guid } from 'nav-frontend-js-utils';
import { AnnetBarn, AnnetBarnFormValues } from './types';

const isAnnetBarn = (annetBarn: Partial<AnnetBarn>): annetBarn is AnnetBarn => {
    const { fnr, navn, fødselsdato } = annetBarn;
    return hasValue(fnr) && hasValue(navn) && hasValue(fødselsdato);
};

const mapFormValuesToPartialAnnetBarn = (
    formValues: AnnetBarnFormValues,
    id: string | undefined
): Partial<AnnetBarn> => {
    return {
        ...formValues,
        id: id || guid(),
        fødselsdato: ISOStringToDate(formValues.fødselsdato),
    };
};

const mapAnnetBarnToFormValues = (annetBarn: Partial<AnnetBarn>): AnnetBarnFormValues => {
    return {
        fnr: annetBarn.fnr,
        navn: annetBarn.navn,
        fødselsdato: dateToISOString(annetBarn.fødselsdato),
        type: annetBarn.type,
    };
};

const annetBarnUtils = {
    mapAnnetBarnToFormValues,
    mapFormValuesToPartialAnnetBarn,
    isAnnetBarn,
};

export default annetBarnUtils;
