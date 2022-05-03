import { dateToISOString, ISOStringToDate } from '@navikt/sif-common-formik/lib';
import { guid } from 'nav-frontend-js-utils';
import { OpptjeningUtland, OpptjeningUtlandFormValues } from './types';

const isValidOpptjeningUtland = (opptjeningUtland: Partial<OpptjeningUtland>): opptjeningUtland is OpptjeningUtland => {
    return (
        opptjeningUtland.fom !== undefined &&
        opptjeningUtland.tom !== undefined &&
        opptjeningUtland.landkode !== undefined
    );
};

const mapFormValuesToOpptjeningUtland = (
    formValues: OpptjeningUtlandFormValues,
    id: string | undefined
): Partial<OpptjeningUtland> => {
    return {
        ...formValues,
        id: id || guid(),
        fom: ISOStringToDate(formValues.fom),
        tom: ISOStringToDate(formValues.tom),
    };
};

const mapOpptjeningUtlandToFormValues = ({
    fom,
    tom,
    landkode,
    type,
    navn,
}: Partial<OpptjeningUtland>): OpptjeningUtlandFormValues => ({
    fom: dateToISOString(fom),
    tom: dateToISOString(tom),
    landkode,
    type,
    navn,
});

const opptjeningUtlandUtils = {
    isValidOpptjeningUtland,
    mapFormValuesToOpptjeningUtland,
    mapOpptjeningUtlandToFormValues,
};
export default opptjeningUtlandUtils;
