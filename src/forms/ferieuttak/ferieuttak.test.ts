import { jsonSort } from '@navikt/sif-common-core/lib/utils/jsonSort';
import { dateToISOString } from '@navikt/sif-common-formik/lib';
import utils from './ferieuttakUtils';
import { Ferieuttak, FerieuttakFormValues } from './types';

const fom = new Date(2000, 10, 10);
const tom = new Date(2000, 10, 11);

const ferieuttak: Ferieuttak = {
    fom,
    tom,
};

const formValues: FerieuttakFormValues = {
    fom: dateToISOString(fom),
    tom: dateToISOString(tom),
};

const { mapFerieuttakToFormValues, mapFormValuesToFerieuttak, isValidFerieuttak } = utils;

describe('ferieuttak', () => {
    it('maps ferieuttak to formValues correctly', () => {
        const formJson = jsonSort(formValues);
        const barnJson = jsonSort(mapFerieuttakToFormValues(ferieuttak));
        expect(barnJson).toEqual(formJson);
    });
    it('maps formValues to ferieuttak correctly - with id', () => {
        const barnJson = jsonSort(ferieuttak);
        const formJson = jsonSort(mapFormValuesToFerieuttak(formValues, undefined));
        expect(barnJson).toEqual(formJson);
    });
    it('maps formValues to ferieuttak correctly - without id', () => {
        const barnJson = jsonSort({ ...ferieuttak, id: undefined });
        const formJson = jsonSort(mapFormValuesToFerieuttak(formValues, undefined));
        expect(barnJson).toEqual(formJson);
    });
    it('isValidferieuttak verifies type ferieuttak correctly', () => {
        expect(isValidFerieuttak({})).toBeFalsy();
        expect(isValidFerieuttak({ ...ferieuttak, fom: undefined })).toBeFalsy();
        expect(isValidFerieuttak({ ...ferieuttak, tom: undefined })).toBeFalsy();
        expect(isValidFerieuttak({ fom, tom })).toBeTruthy();
    });
});
