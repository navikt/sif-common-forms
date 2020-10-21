import { createFormikDatepickerValue } from '@navikt/sif-common-formik/lib';
import { jsonSort } from '@navikt/sif-common-core/lib/utils/jsonSort';
import { BostedUtland, BostedUtlandFormValues } from './types';
import utils from './bostedUtlandUtils';

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
    fom: createFormikDatepickerValue(fom),
    tom: createFormikDatepickerValue(tom),
    landkode,
};

const { mapBostedUtlandToFormValues, mapFormValuesToBostedUtland, isValidBostedUtland } = utils;

describe('annetBarn', () => {
    it('maps bostedUtland to formValues correctly', () => {
        const formJson = jsonSort(formValues);
        const barnJson = jsonSort(mapBostedUtlandToFormValues(bostedUtland));
        expect(barnJson).toEqual(formJson);
    });
    it('maps formValues to bostedUtland correctly - with id of annet barn', () => {
        const barnJson = jsonSort(bostedUtland);
        const formJson = jsonSort(mapFormValuesToBostedUtland(formValues));
        expect(barnJson).toEqual(formJson);
    });
    it('maps formValues to bostedUtland correctly - without id of bosted', () => {
        const barnJson = jsonSort({ ...bostedUtland, id: undefined });
        const formJson = jsonSort(mapFormValuesToBostedUtland(formValues));
        expect(barnJson).toEqual(formJson);
    });
    it('isValidBostedUtland verifies type bostedUtland correctly', () => {
        expect(isValidBostedUtland({})).toBeFalsy();
        expect(isValidBostedUtland({ ...bostedUtland, fom: undefined })).toBeFalsy();
        expect(isValidBostedUtland({ ...bostedUtland, tom: undefined })).toBeFalsy();
        expect(isValidBostedUtland({ ...bostedUtland, landkode: undefined })).toBeFalsy();
        expect(isValidBostedUtland({ fom, tom, landkode })).toBeTruthy();
    });
});
