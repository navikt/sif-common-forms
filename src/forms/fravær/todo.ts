import { FieldValidationResult } from '@navikt/sif-common-core/lib/validation/types';
import { FormikValidateFunction } from '@navikt/sif-common-formik/lib';
import { createFieldValidationError } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import moment from 'moment';

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
    'utenlandsopphold_ikke_registrert' = 'fieldvalidation.utenlandsopphold_ikke_registrert',
    'utenlandsopphold_overlapper' = 'fieldvalidation.utenlandsopphold_overlapper',
    'utenlandsopphold_utenfor_periode' = 'fieldvalidation.utenlandsopphold_utenfor_periode',
    'timer_ikke_tall' = 'fieldvalidation.timer_ikke_tall',
    'timer_for_mange_timer' = 'fieldvalidation.timer_for_mange_timer',
    'dato_utenfor_gyldig_tidsrom' = 'fieldvalidation.dato_utenfor_gyldig_tidsrom',
    'tom_er_før_fom' = 'fieldvalidation.tom_er_før_fom',
    'ingen_dokumenter' = 'fieldvalidation.ingen_dokumenter',
    'for_mange_dokumenter' = 'fieldvalidation.for_mange_dokumenter',

    'fravær_timer_mer_enn_arbeidstimer' = 'fieldvalidation.fravær.dag.form.timer_mer_enn_arbeidstimer'
}

export type FieldValidationArray = (validations: FormikValidateFunction[]) => (value: any) => FieldValidationResult;

export const validateAll: FieldValidationArray = (
    validations: FormikValidateFunction[]
): FormikValidateFunction => (value: any): FieldValidationResult =>
    validations
        .map((validate: FormikValidateFunction) => validate(value))
        .reduce((prev: FieldValidationResult, curr: FieldValidationResult) => prev || curr, undefined);

const datoErInnenforTidsrom = (dato: Date, range: Partial<DateRange>): boolean => {
    if (range.from && range.to) {
        return moment(dato).isBetween(range.from, range.to, 'days', '[]');
    }
    if (range.from) {
        return moment(dato).isSameOrAfter(range.from);
    }
    if (range.to) {
        return moment(dato).isSameOrBefore(range.to);
    }
    return true;
};

export const validateDateInRange = (tidsrom: Partial<DateRange>) => (date: any): FieldValidationResult => {
    if (!datoErInnenforTidsrom(date, tidsrom)) {
        return createFieldValidationError(FraværFieldValidationErrors.dato_utenfor_gyldig_tidsrom);
    }
    return undefined;
};

export const validateLessOrEqualTo = (maxValue: number | undefined): FormikValidateFunction => (value: number | undefined) => {
    if (maxValue && value) {
        return value <= maxValue ? undefined : createFieldValidationError('fravær_timer_mer_enn_arbeidstimer');
    }
    return undefined;
};

