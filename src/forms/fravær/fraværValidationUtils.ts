import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { createFieldValidationError } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { FieldValidationResult } from '@navikt/sif-common-core/lib/validation/types';
import { FormikValidateFunction, ISOStringToDate } from '@navikt/sif-common-formik/lib';
import {
    dateCollideWithRanges,
    dateErHelg,
    fraværDagToFraværDateRange,
    fraværPeriodeToDateRange,
    rangeCollideWithRanges,
} from './fraværUtilities';
import { FraværDag, FraværPeriode } from './types';

export enum FraværFieldValidationErrors {
    'påkrevd' = 'fieldvalidation.påkrevd',
    'fraværsperioder_mangler' = 'fieldvalidation.fraværsperioder_mangler',
    'fraværsperioder_overlapper' = 'fieldvalidation.fraværsperioder_overlapper',
    'fraværsperioder_utenfor_periode' = 'fieldvalidation.fraværsperioder_utenfor_periode',
    'dager_med_fravær_ugyldig_dag' = 'fieldvalidation.dager_med_fravær_ugyldig_dag',
    'dager_med_fravær_mangler' = 'fieldvalidation.dager_med_fravær_mangler',
    'dager_med_fravær_like' = 'fieldvalidation.dager_med_fravær_like',
    'dager_med_fravær_utenfor_periode' = 'fieldvalidation.dager_med_fravær_utenfor_periode',
    'dager_med_for_mange_timer' = 'fieldvalidation.dager_med_for_mange_timer',
    'dager_overlapper_med_andre_dager' = 'fieldvalidation.dager_overlapper_med_andre_dager',
    'fra_dato_kolliderer_med_annet_fravær' = 'fieldvalidation.fra_dato_kolliderer_med_annet_fravær',
    'til_dato_kolliderer_med_annet_fravær' = 'fieldvalidation.til_dato_kolliderer_med_annet_fravær',
    'dato_kolliderer_med_annet_fravær' = 'fieldvalidation.dato_kolliderer_med_annet_fravær',
    'timer_ikke_tall' = 'fieldvalidation.timer_ikke_tall',
    'timer_for_mange_timer' = 'fieldvalidation.timer_for_mange_timer',
    'dato_utenfor_gyldig_tidsrom' = 'fieldvalidation.dato_utenfor_gyldig_tidsrom',
    'tom_er_før_fom' = 'fieldvalidation.tom_er_før_fom',
    'ingen_dokumenter' = 'fieldvalidation.ingen_dokumenter',
    'for_mange_dokumenter' = 'fieldvalidation.for_mange_dokumenter',
    'fravær_timer_mer_enn_arbeidstimer' = 'fravær.form.validation.timer_mer_enn_arbeidstimer',
    'er_helg' = 'fravær.form.validation.er_helg',
    'fra_og_til_er_ulike_år' = 'fravær.form.validation.fra_og_til_er_ulike_år',
    'fra_og_til_overlapper_andre_perioder' = 'fravær.form.validation.fra_og_til_overlapper_andre_perioder',
    'dato_overlapper_med_andre_perioder' = 'fravær.form.validation.dato_overlapper_med_andre_perioder',
}

export type FieldValidationArray<ValueType> = (
    validations: FormikValidateFunction<ValueType>[]
) => (value: ValueType) => FieldValidationResult;

export const validateAll = <ValueType>(validations: FormikValidateFunction<ValueType>[]): FormikValidateFunction => (
    value: ValueType
): FieldValidationResult =>
    validations
        .map((validate: FormikValidateFunction<ValueType>) => validate(value))
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

export const validateErSammeÅr = (maybeDateFrom: string | undefined, maybeDateTo: string | undefined) => {
    const fromDate = ISOStringToDate(maybeDateFrom);
    const toDate = ISOStringToDate(maybeDateTo);
    if (fromDate && toDate && fromDate.getFullYear() !== toDate.getFullYear()) {
        return createFieldValidationError(FraværFieldValidationErrors.fra_og_til_er_ulike_år);
    }
    return undefined;
};

export const validateNotHelgedag = (maybeDate: string | undefined): FieldValidationResult => {
    const date = ISOStringToDate(maybeDate);
    return date && dateErHelg(date) ? createFieldValidationError(FraværFieldValidationErrors.er_helg) : undefined;
};

export const validateFraværPeriodeCollision = (
    from: Date | undefined,
    to: Date | undefined,
    ranges: DateRange[] | undefined
): FieldValidationResult => {
    if (!from || !to || (ranges || []).length === 0) {
        return undefined;
    }
    return rangeCollideWithRanges({ from, to }, ranges)
        ? createFieldValidationError(FraværFieldValidationErrors.dager_overlapper_med_andre_dager)
        : undefined;
};

export const validateFraOgMedForCollision = (
    date: Date | undefined,
    ranges: DateRange[] | undefined
): FieldValidationResult => {
    if (!date || (ranges || []).length === 0) {
        return undefined;
    }
    return dateCollideWithRanges(date, ranges)
        ? createFieldValidationError(FraværFieldValidationErrors.fra_dato_kolliderer_med_annet_fravær)
        : undefined;
};

export const validateTilOgMedForCollision = (
    date: Date | undefined,
    ranges: DateRange[] | undefined
): FieldValidationResult => {
    if (!date || (ranges || []).length === 0) {
        return undefined;
    }
    return dateCollideWithRanges(date, ranges)
        ? createFieldValidationError(FraværFieldValidationErrors.til_dato_kolliderer_med_annet_fravær)
        : undefined;
};

export const validateFraværDagCollision = (
    date: Date | undefined,
    ranges: DateRange[] | undefined
): FieldValidationResult => {
    if (!date || (ranges || []).length === 0) {
        return undefined;
    }
    return dateCollideWithRanges(date, ranges)
        ? createFieldValidationError(FraværFieldValidationErrors.dato_kolliderer_med_annet_fravær)
        : undefined;
};

export const validateNoCollisions = (
    fraværDager: FraværDag[],
    fraværPerioder: FraværPeriode[]
) => (): FieldValidationResult => {
    if (fraværPerioder.length === 0 && fraværDager.length === 0) {
        return undefined;
    }

    const allFraværDagDateRanges = fraværDager.map(fraværDagToFraværDateRange);
    const allFraværPeriodeDateRanges = fraværPerioder.map(fraværPeriodeToDateRange);

    const hasDateCollision = fraværDager.some((dag) => {
        const rangesWithoutCurrentDag = [
            ...fraværDager.filter((d) => d !== dag).map(fraværDagToFraværDateRange),
            ...allFraværPeriodeDateRanges,
        ];
        return dateCollideWithRanges(dag.dato, rangesWithoutCurrentDag);
    });

    const hasRangeCollision = fraværPerioder.some((periode) => {
        const rangesWithoutCurrentPeriode = [
            ...allFraværDagDateRanges,
            ...fraværPerioder.filter((p) => p !== periode).map(fraværPeriodeToDateRange),
        ];
        return rangeCollideWithRanges(fraværPeriodeToDateRange(periode), rangesWithoutCurrentPeriode);
    });
    return hasDateCollision || hasRangeCollision
        ? createFieldValidationError(FraværFieldValidationErrors.dager_overlapper_med_andre_dager)
        : undefined;
};
