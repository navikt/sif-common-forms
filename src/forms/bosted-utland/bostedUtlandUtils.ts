import { createFormikDatepickerValue } from '@navikt/sif-common-formik/lib';
import { BostedUtland, BostedUtlandFormValues } from './types';

const isValidBostedUtland = (bosted: Partial<BostedUtland>): bosted is BostedUtland => {
    const { fom, landkode, tom } = bosted;
    return fom !== undefined && landkode !== undefined && tom !== undefined;
};

const mapFormValuesToBostedUtland = (
    formValues: BostedUtlandFormValues,
    id: string | undefined
): Partial<BostedUtland> => {
    return {
        id,
        fom: formValues.fom?.date,
        tom: formValues.tom?.date,
        landkode: formValues.landkode,
    };
};

const mapBostedUtlandToFormValues = ({ fom, tom, landkode }: Partial<BostedUtland>): BostedUtlandFormValues => {
    return {
        fom: createFormikDatepickerValue(fom),
        tom: createFormikDatepickerValue(tom),
        landkode,
    };
};

const bostedUtlandUtils = {
    isValidBostedUtland,
    mapBostedUtlandToFormValues,
    mapFormValuesToBostedUtland,
};

export default bostedUtlandUtils;
