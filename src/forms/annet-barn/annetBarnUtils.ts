import { hasValue } from '@navikt/sif-common-core/lib/validation/hasValue';
import { createFormikDatepickerValue } from '@navikt/sif-common-formik/lib';
import { AnnetBarn, AnnetBarnFormValues } from './types';

const isAnnetBarn = (annetBarn: Partial<AnnetBarn>): annetBarn is AnnetBarn => {
    const { fnr, navn, fødselsdato } = annetBarn;
    return hasValue(fnr) && hasValue(navn) && hasValue(fødselsdato);
};

const mapFormValuesToPartialAnnetBarn = (formValues: AnnetBarnFormValues, id?: string): Partial<AnnetBarn> => {
    return {
        ...formValues,
        id,
        fødselsdato: formValues.fødselsdato?.date,
    };
};

const mapAnnetBarnToFormValues = (annetBarn: Partial<AnnetBarn>): AnnetBarnFormValues => {
    return {
        fnr: annetBarn.fnr,
        navn: annetBarn.navn,
        fødselsdato: createFormikDatepickerValue(annetBarn.fødselsdato),
    };
};

const annetBarnUtils = {
    mapAnnetBarnToFormValues,
    mapFormValuesToPartialAnnetBarn,
    isAnnetBarn,
};

export default annetBarnUtils;
