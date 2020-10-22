import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { createFieldValidationError } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { FieldValidationResult } from '@navikt/sif-common-core/lib/validation/types';
import { dateToISOString, FormikValidateFunction, ISOStringToDate } from '@navikt/sif-common-formik/lib';
import { isString } from 'formik';
import moment from 'moment';
import { FraværFieldValidationErrors } from './fraværValidationUtils';
import { FraværDag, FraværDagFormValues, FraværPeriode, FraværPeriodeFormValues } from './types';
import { guid } from 'nav-frontend-js-utils';

export const isFraværDag = (fraværDag: Partial<FraværDag>): fraværDag is FraværDag => {
    return (
        fraværDag.dato !== undefined && fraværDag.timerArbeidsdag !== undefined && fraværDag.timerFravær !== undefined
    );
};

export const isFraværPeriode = (fraværPeriode: Partial<FraværPeriode>): fraværPeriode is FraværPeriode => {
    return fraværPeriode.from !== undefined && fraværPeriode.to !== undefined;
};

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

export const validateNotHelgedag = (maybeDate: string | undefined): FieldValidationResult => {
    const date = ISOStringToDate(maybeDate);
    return date && dateErHelg(date) ? createFieldValidationError(FraværFieldValidationErrors.er_helg) : undefined;
};

export const timeText = (timer: string): string =>
    timer === '0' || timer === '0.5' || timer === '1' ? 'time' : 'timer';

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

export const mapFormValuesToFraværDag = (
    formValues: FraværDagFormValues,
    id: string | undefined
): Partial<FraværDag> => {
    return {
        ...formValues,
        id: id || guid(),
        dato: ISOStringToDate(formValues.dato),
    };
};

export const mapFraværDagToFormValues = (fraværDag: Partial<FraværDag>): FraværDagFormValues => {
    return {
        ...fraværDag,
        dato: fraværDag.dato ? dateToISOString(fraværDag.dato) : '',
    };
};

export const mapFormValuesToFraværPeriode = (
    formValues: FraværPeriodeFormValues,
    id: string | undefined
): Partial<FraværPeriode> => {
    return {
        ...formValues,
        id: id || guid(),
        from: ISOStringToDate(formValues.from),
        to: ISOStringToDate(formValues.to),
    };
};

export const mapFraværPeriodeToFormValues = (fraværPeriode: Partial<FraværPeriode>): FraværPeriodeFormValues => {
    return {
        ...fraværPeriode,
        from: fraværPeriode.from ? dateToISOString(fraværPeriode.from) : '',
        to: fraværPeriode.to ? dateToISOString(fraværPeriode.to) : '',
    };
};
