import { createFormikDatepickerValue } from '@navikt/sif-common-formik/lib';
import { jsonSort } from '@navikt/sif-common-core/lib/utils/jsonSort';
import { AnnetBarn, AnnetBarnFormValues } from './types';
import annetBarnUtils from './annetBarnUtils';

const id = '123';
const fnr = '234';
const fødselsdato = new Date(2000, 10, 10);
const navn = 'Annet barns navn';

const annetBarn: AnnetBarn = {
    fnr,
    fødselsdato,
    navn,
    id,
};

const formValues: AnnetBarnFormValues = {
    fnr,
    fødselsdato: createFormikDatepickerValue(fødselsdato),
    navn,
};

const { mapFormValuesToPartialAnnetBarn, isAnnetBarn, mapAnnetBarnToFormValues } = annetBarnUtils;

describe('annetBarn', () => {
    it('maps annet barn to formValues correctly', () => {
        const formJson = jsonSort(formValues);
        const barnJson = jsonSort(mapAnnetBarnToFormValues(annetBarn));
        expect(barnJson).toEqual(formJson);
    });
    it('maps formValues to annetBarn correctly - with id of annet barn', () => {
        const barnJson = jsonSort(annetBarn);
        const formJson = jsonSort(mapFormValuesToPartialAnnetBarn(formValues, id));
        expect(barnJson).toEqual(formJson);
    });
    it('maps formValues to annetBarn correctly - without id of annet barn', () => {
        const barnJson = jsonSort({ ...annetBarn, id: undefined });
        const formJson = jsonSort(mapFormValuesToPartialAnnetBarn(formValues));
        expect(barnJson).toEqual(formJson);
    });
    it('isAnnetBarn verifies type AnnetBarn correctly', () => {
        expect(isAnnetBarn({})).toBeFalsy();
        expect(isAnnetBarn({ ...annetBarn, fødselsdato: undefined })).toBeFalsy();
        expect(isAnnetBarn({ ...annetBarn, navn: undefined })).toBeFalsy();
        expect(isAnnetBarn({ ...annetBarn, fnr: undefined })).toBeFalsy();
        expect(isAnnetBarn({ fnr, navn, fødselsdato })).toBeTruthy();
    });
});
