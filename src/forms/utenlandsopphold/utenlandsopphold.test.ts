import { jsonSort } from '@navikt/sif-common-core/lib/utils/jsonSort';
import { createFormikDatepickerValue } from '@navikt/sif-common-formik/lib';
import { Utenlandsopphold, UtenlandsoppholdFormValues } from './types';
import utils from './utenlandsoppholdUtils';

const fom = new Date(2000, 10, 10);
const tom = new Date(2000, 10, 11);
const landkode = 'no';

const utenlandsopphold: Utenlandsopphold = {
    fom,
    tom,
    landkode,
};

const formValues: UtenlandsoppholdFormValues = {
    fom: createFormikDatepickerValue(fom),
    tom: createFormikDatepickerValue(tom),
    landkode,
};

const { mapUtenlandsoppholdToFormValues, mapFormValuesToUtenlandsopphold, isValidUtenlandsopphold } = utils;

describe('utenlandsopphold', () => {
    it('maps utenlandsopphold to formValues correctly', () => {
        const formJson = jsonSort(formValues);
        const mappedJson = jsonSort(mapUtenlandsoppholdToFormValues(utenlandsopphold));
        expect(mappedJson).toEqual(formJson);
    });
    it('maps formValues to utenlandsopphold correctly - with id', () => {
        const mappedJson = jsonSort(utenlandsopphold);
        const formJson = jsonSort(mapFormValuesToUtenlandsopphold(formValues, undefined));
        expect(mappedJson).toEqual(formJson);
    });
    it('maps formValues to utenlandsopphold correctly - without id', () => {
        const mappedJson = jsonSort({ ...utenlandsopphold, id: undefined });
        const formJson = jsonSort(mapFormValuesToUtenlandsopphold(formValues, undefined));
        expect(mappedJson).toEqual(formJson);
    });
    it('isValidUtenlandsopphold verifies type utenlandsopphold correctly', () => {
        expect(isValidUtenlandsopphold({})).toBeFalsy();
        expect(isValidUtenlandsopphold({ ...utenlandsopphold, fom: undefined })).toBeFalsy();
        expect(isValidUtenlandsopphold({ ...utenlandsopphold, tom: undefined })).toBeFalsy();
        expect(isValidUtenlandsopphold({ ...utenlandsopphold, landkode: undefined })).toBeFalsy();
        expect(isValidUtenlandsopphold({ fom, tom, landkode })).toBeTruthy();
    });
});
