import { FieldValidationResult } from '@navikt/sif-common-core/lib/validation/types';
import { FormikValidateFunction } from '@navikt/sif-common-formik/lib';
import { FieldValidationErrors } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { isString } from 'formik';
import { validateAll } from '../fraværValidationUtils';

const etTomtObject = {};
const etTall = 1;
const enString = 'En string';

const validerNotUndefined: FormikValidateFunction = (value) => (value ? undefined : FieldValidationErrors.påkrevd);
const validerErString: FormikValidateFunction = (value) =>
    value && isString(value) ? undefined : FieldValidationErrors.ugyldig_telefonnummer;
const validerErTalletEn: FormikValidateFunction = (value) =>
    value === 1 ? undefined : FieldValidationErrors.tall_ugyldig;

describe('Fieldvalidations', () => {
    describe('validateAll', () => {
        it('returnerer undefined ved tom validation liste', () => {
            const result: (value: any) => FieldValidationResult = validateAll([]);
            expect(result('En eller annen verdi. Hva som helst')).toBe(undefined);
        });
        it('returnerer undefined fordi value er definert', () => {
            const result: (value: any) => FieldValidationResult = validateAll([validerNotUndefined]);
            expect(result(etTomtObject)).toBe(undefined);
        });
        it('returnerer undefined fordi value er gyldig string', () => {
            const result: (value: any) => FieldValidationResult = validateAll([validerErString]);
            expect(result(enString)).toBe(undefined);
        });
        it('returnerer ugyldig telefonnummer fordi value er object og ikke string', () => {
            const result: (value: any) => FieldValidationResult = validateAll([validerErString]);
            expect(result(etTomtObject)).toBe(FieldValidationErrors.ugyldig_telefonnummer);
        });
        it('returnerer ugyldig tall', () => {
            const result: (value: any) => FieldValidationResult = validateAll([
                validerNotUndefined,
                validerErString,
                validerErTalletEn,
            ]);
            expect(result(enString)).toBe(FieldValidationErrors.tall_ugyldig);
        });
        it('returnerer undefiend fordi value er 1', () => {
            const result: (value: any) => FieldValidationResult = validateAll([validerNotUndefined, validerErTalletEn]);
            expect(result(etTall)).toBe(undefined);
        });
        it('returnerer ugyldig telefonnummer', () => {
            const result: (value: any) => FieldValidationResult = validateAll([
                validerNotUndefined,
                validerErString,
                validerErTalletEn,
            ]);
            expect(result(enString)).toBe(FieldValidationErrors.tall_ugyldig);
        });
    });
});
