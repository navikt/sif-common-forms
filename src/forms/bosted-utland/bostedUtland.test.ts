import { jsonSort } from '@navikt/sif-common-core/lib/utils/jsonSort';
import { BostedUtland, BostedUtlandFormValues } from './types';
import utils from './bostedUtlandUtils';
import { dateToISOString } from '@navikt/sif-common-formik/lib';

const id = '123';
const fom = new Date(2000, 10, 10);
const tom = new Date(2000, 10, 11);
const landkode = 'Argentina';

const bostedUtland: BostedUtland = {
    fom,
    tom,
    landkode,
};

const formValues: BostedUtlandFormValues = {
    fom: dateToISOString(fom),
    tom: dateToISOString(tom),
    landkode,
};

const { mapBostedUtlandToFormValues, mapFormValuesToBostedUtland, isValidBostedUtland } = utils;

describe('bostedUtland', () => {
    it('maps bostedUtland to formValues correctly', () => {
        const formJson = jsonSort(formValues);
        const mapJson = jsonSort(mapBostedUtlandToFormValues(bostedUtland));
        expect(mapJson).toEqual(formJson);
    });
    it('maps formValues to bostedUtland correctly - with id', () => {
        const bostedJson = jsonSort(bostedUtland);
        const formJson = jsonSort(mapFormValuesToBostedUtland(formValues, undefined));
        expect(bostedJson).toEqual(formJson);
    });
    it('maps formValues to bostedUtland correctly - without id', () => {
        const bostedJson = jsonSort({ ...bostedUtland, id: undefined });
        const formJson = jsonSort(mapFormValuesToBostedUtland(formValues, undefined));
        expect(bostedJson).toEqual(formJson);
    });
    it('isValidBostedUtland verifies type bostedUtland correctly', () => {
        expect(isValidBostedUtland({})).toBeFalsy();
        expect(isValidBostedUtland({ ...bostedUtland, fom: undefined })).toBeFalsy();
        expect(isValidBostedUtland({ ...bostedUtland, tom: undefined })).toBeFalsy();
        expect(isValidBostedUtland({ ...bostedUtland, landkode: undefined })).toBeFalsy();
        expect(isValidBostedUtland({ fom, tom, landkode })).toBeTruthy();
    });
});
