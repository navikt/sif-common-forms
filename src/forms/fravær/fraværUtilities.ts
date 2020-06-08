import { FraværDag, FraværPeriode } from './types';
import { FormikValidateFunction } from '@navikt/sif-common-formik/lib';
import { FieldValidationResult } from '@navikt/sif-common-core/lib/validation/types';
import moment from 'moment';
import { createFieldValidationError } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { FraværFieldValidationErrors } from './fraværValidationUtils';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { isString } from 'formik';

export const fraværDagToFraværDateRange = (fraværDag: FraværDag): DateRange => ({
    from: fraværDag.dato,
    to: fraværDag.dato,
});

export const datesCollideWithDateRanges = (dates: Date[], ranges: DateRange[]): boolean => {
    if (ranges.length > 0 && dates.length > 0) {
        return dates.some((d) => {
            return ranges.some((range) => moment(d).isSameOrAfter(range.from) && moment(d).isSameOrBefore(range.to));
        });
    }
    return false;
};

export const validateNoCollisions = (
    fraværDager: FraværDag[],
    fraværPerioder: FraværPeriode[]
): FormikValidateFunction => (): FieldValidationResult =>
    datesCollideWithDateRanges(
        fraværDager.map((d) => d.dato),
        fraværPerioder
    )
        ? createFieldValidationError(FraværFieldValidationErrors.dager_med_fravær_overlapper_perioder)
        : undefined;

export enum Weekday {
    monday = 'monday',
    tuesday = 'tuesday',
    wednesday = 'wednesday',
    thursday = 'thursday',
    friday = 'friday',
    saturday = 'saturday',
    sunday = 'sunday',
}

export const getWeekdayName = (date: Date): Weekday | undefined => {
    switch (date.getDay()) {
        case 0:
            return Weekday.sunday;
        case 1:
            return Weekday.monday;
        case 2:
            return Weekday.tuesday;
        case 3:
            return Weekday.wednesday;
        case 4:
            return Weekday.thursday;
        case 5:
            return Weekday.friday;
        case 6:
            return Weekday.saturday;
        default:
            return undefined;
    }
};

export const dateErHelg = (date: Date) =>
    getWeekdayName(date) === Weekday.saturday || getWeekdayName(date) === Weekday.sunday;

export const validateNotHelgedag = (maybeDate: Date | undefined): FieldValidationResult =>
    maybeDate && dateErHelg(maybeDate) ? createFieldValidationError(FraværFieldValidationErrors.er_helg) : undefined;

export const timeText = (timer: string): string =>
    timer === '1' || timer.includes('.') ? 'time' : 'timer';

export const dateRangeToFomTom = (dateRange: DateRange): { fom: Date; tom: Date } => ({
    fom: dateRange.from,
    tom: dateRange.to,
});
export const toMaybeNumber = (timerArbeidsdag: string | undefined): number | undefined => {
    if (timerArbeidsdag && isString(timerArbeidsdag)) {
        return parseFloat(timerArbeidsdag);
    }
    return undefined;
};
