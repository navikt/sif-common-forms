import { jsonSort } from '@navikt/sif-common-core/lib/utils/jsonSort';
import { createFormikDatepickerValue } from '@navikt/sif-common-formik/lib';
import utils from './tidsperiodeUtils';
import { DateTidsperiode, DateTidsperiodeFormValues } from './types';

const id = '123';
const fom = new Date(2000, 10, 10);
const tom = new Date(2000, 10, 11);

const tidsperiode: DateTidsperiode = {
    fom,
    tom,
};

const formValues: DateTidsperiodeFormValues = {
    fom: createFormikDatepickerValue(fom),
    tom: createFormikDatepickerValue(tom),
};

const { mapDateTidsperiodeToFormValues, mapFormValuesToDateTidsperiode, isValidDateTidsperiode } = utils;

describe('annetBarn', () => {
    it('maps bostedUtland to formValues correctly', () => {
        const formJson = jsonSort(formValues);
        const barnJson = jsonSort(mapDateTidsperiodeToFormValues(tidsperiode));
        expect(barnJson).toEqual(formJson);
    });
    it('maps formValues to bostedUtland correctly - with id of annet barn', () => {
        const barnJson = jsonSort(tidsperiode);
        const formJson = jsonSort(mapFormValuesToDateTidsperiode(formValues, undefined));
        expect(barnJson).toEqual(formJson);
    });
    it('maps formValues to bostedUtland correctly - without id of bosted', () => {
        const barnJson = jsonSort({ ...tidsperiode, id: undefined });
        const formJson = jsonSort(mapFormValuesToDateTidsperiode(formValues, undefined));
        expect(barnJson).toEqual(formJson);
    });
    it('isValidBostedUtland verifies type bostedUtland correctly', () => {
        expect(isValidDateTidsperiode({})).toBeFalsy();
        expect(isValidDateTidsperiode({ ...tidsperiode, fom: undefined })).toBeFalsy();
        expect(isValidDateTidsperiode({ ...tidsperiode, tom: undefined })).toBeFalsy();
        expect(isValidDateTidsperiode({ fom, tom })).toBeTruthy();
    });
});
