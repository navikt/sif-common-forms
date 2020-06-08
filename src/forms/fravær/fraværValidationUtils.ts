import { FieldValidationResult } from '@navikt/sif-common-core/lib/validation/types';
import { FormikValidateFunction } from '@navikt/sif-common-formik/lib';
import { createFieldValidationError } from '@navikt/sif-common-core/lib/validation/fieldValidations';

export enum FraværFieldValidationErrors {
    'påkrevd' = 'fieldvalidation.påkrevd',
    'fraværsperioder_mangler' = 'fieldvalidation.fraværsperioder_mangler',
    'fraværsperioder_overlapper' = 'fieldvalidation.fraværsperioder_overlapper',
    'fraværsperioder_utenfor_periode' = 'fieldvalidation.fraværsperioder_utenfor_periode',
    'fraværsperioder_overlapper_med_fraværsdager' = 'fieldvalidation.fraværsperioder_overlapper_med_fraværsdager',
    'dager_med_fravær_ugyldig_dag' = 'fieldvalidation.dager_med_fravær_ugyldig_dag',
    'dager_med_fravær_mangler' = 'fieldvalidation.dager_med_fravær_mangler',
    'dager_med_fravær_like' = 'fieldvalidation.dager_med_fravær_like',
    'dager_med_fravær_utenfor_periode' = 'fieldvalidation.dager_med_fravær_utenfor_periode',
    'dager_med_for_mange_timer' = 'fieldvalidation.dager_med_for_mange_timer',
    'dager_med_fravær_overlapper_perioder' = 'fieldvalidation.dager_med_fravær_overlapper_perioder',
    'timer_ikke_tall' = 'fieldvalidation.timer_ikke_tall',
    'timer_for_mange_timer' = 'fieldvalidation.timer_for_mange_timer',
    'dato_utenfor_gyldig_tidsrom' = 'fieldvalidation.dato_utenfor_gyldig_tidsrom',
    'tom_er_før_fom' = 'fieldvalidation.tom_er_før_fom',
    'ingen_dokumenter' = 'fieldvalidation.ingen_dokumenter',
    'for_mange_dokumenter' = 'fieldvalidation.for_mange_dokumenter',
    'fravær_timer_mer_enn_arbeidstimer' = 'fravær.form.validation.timer_mer_enn_arbeidstimer',
    'er_helg' = 'fravær.form.validation.er_helg',
}

export type FieldValidationArray = (validations: FormikValidateFunction[]) => (value: any) => FieldValidationResult;

export const validateAll: FieldValidationArray = (validations: FormikValidateFunction[]): FormikValidateFunction => (
    value: any
): FieldValidationResult =>
    validations
        .map((validate: FormikValidateFunction) => validate(value))
        .reduce((prev: FieldValidationResult, curr: FieldValidationResult) => prev || curr, undefined);

export const validateLessOrEqualTo = (maybeMaxValue: number | undefined): FormikValidateFunction => (
    maybeValue: string | undefined
) => {
    const maybeValueFloat: number | undefined = maybeValue ? parseFloat(maybeValue) : undefined;
    if (maybeMaxValue && maybeValueFloat) {
        return maybeValueFloat <= maybeMaxValue
            ? undefined
            : createFieldValidationError(FraværFieldValidationErrors.fravær_timer_mer_enn_arbeidstimer);
    }
    return undefined;
};
