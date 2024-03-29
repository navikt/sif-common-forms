import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { dateToISOString, ISOStringToDate } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { isString } from 'formik';
import { guid } from 'nav-frontend-js-utils';
import { FraværDag, FraværDagFormValues, FraværPeriode, FraværPeriodeFormValues, FraværÅrsak } from './types';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export const isFraværDag = (fraværDag: Partial<FraværDag>): fraværDag is FraværDag => {
    const isValidÅrsak = brukHjemmePgaKoronaDagForm(fraværDag.dato) ? fraværDag.årsak !== undefined : true;
    return (
        fraværDag.dato !== undefined &&
        fraværDag.timerArbeidsdag !== undefined &&
        fraværDag.timerFravær !== undefined &&
        isValidÅrsak
    );
};

export const isFraværPeriode = (fraværPeriode: Partial<FraværPeriode>): fraværPeriode is FraværPeriode => {
    const isValidÅrsak = brukHjemmePgaKoronaPeriodeForm(fraværPeriode.fraOgMed, fraværPeriode.tilOgMed)
        ? fraværPeriode.årsak !== undefined
        : true;

    return fraværPeriode.fraOgMed !== undefined && fraværPeriode.tilOgMed !== undefined && isValidÅrsak;
};

export const fraværDagToFraværDateRange = (fraværDag: FraværDag): DateRange => ({
    from: fraværDag.dato,
    to: fraværDag.dato,
});

export const fraværPeriodeToDateRange = (fraværDag: FraværPeriode): DateRange => ({
    from: fraværDag.fraOgMed,
    to: fraværDag.tilOgMed,
});

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

export const rangeCollideWithRanges = (range: DateRange, ranges: DateRange[] = []): boolean => {
    if (!range || !range.from || !range.to || ranges.length === 0) {
        return false;
    }
    return ranges.some((periode) => {
        const fromDay = dayjs(range.from);
        const toDay = dayjs(range.to);
        const { from, to } = periode;
        if (fromDay.isBefore(from) && toDay.isAfter(to)) return true;
        if (fromDay.isSameOrAfter(from, 'day') && fromDay.isSameOrBefore(to, 'day')) return true;
        if (toDay.isSameOrAfter(from, 'day') && toDay.isSameOrBefore(to, 'day')) return true;
    });
};

export const dateCollideWithRanges = (date: Date | undefined, ranges: DateRange[] = []): boolean => {
    if (!date || ranges.length === 0) {
        return false;
    }
    return ranges.some((range) => {
        return dayjs(date).isSameOrAfter(range.from, 'day') && dayjs(date).isSameOrBefore(range.to, 'day');
    });
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

export const getHjemmePgaKoronaFormValueFromFraværÅrsak = (årsak?: FraværÅrsak): YesOrNo => {
    if (årsak === undefined) {
        return YesOrNo.UNANSWERED;
    }
    return årsak === FraværÅrsak.smittevernhensyn || årsak === FraværÅrsak.stengtSkoleBhg ? YesOrNo.YES : YesOrNo.NO;
};

export const getÅrsakFromFraværFormValues = (formValues: FraværDagFormValues | FraværPeriodeFormValues): FraværÅrsak =>
    formValues.hjemmePgaKorona === YesOrNo.YES && formValues.årsak ? formValues.årsak : FraværÅrsak.ordinært;

export const mapFormValuesToFraværDag = (
    formValues: FraværDagFormValues,
    id: string | undefined
): Partial<FraværDag> => {
    return {
        id: id || guid(),
        timerArbeidsdag: formValues.timerArbeidsdag,
        timerFravær: formValues.timerFravær,
        dato: ISOStringToDate(formValues.dato),
        årsak: brukHjemmePgaKoronaDagForm(ISOStringToDate(formValues.dato))
            ? getÅrsakFromFraværFormValues(formValues)
            : undefined,
    };
};

export const mapFraværDagToFormValues = (fraværDag: Partial<FraværDag>): FraværDagFormValues => {
    return {
        timerArbeidsdag: fraværDag.timerArbeidsdag,
        timerFravær: fraværDag.timerFravær,
        dato: fraværDag.dato ? dateToISOString(fraværDag.dato) : '',
        hjemmePgaKorona: brukHjemmePgaKoronaDagForm(fraværDag.dato)
            ? getHjemmePgaKoronaFormValueFromFraværÅrsak(fraværDag.årsak)
            : YesOrNo.UNANSWERED,
        årsak: brukHjemmePgaKoronaDagForm(fraværDag.dato) ? fraværDag.årsak : undefined,
    };
};

export const mapFormValuesToFraværPeriode = (
    formValues: FraværPeriodeFormValues,
    id: string | undefined
): Partial<FraværPeriode> => {
    const brukÅrsak = brukHjemmePgaKoronaPeriodeForm(
        ISOStringToDate(formValues.fraOgMed),
        ISOStringToDate(formValues.tilOgMed)
    );

    return {
        id: id || guid(),
        fraOgMed: ISOStringToDate(formValues.fraOgMed),
        tilOgMed: ISOStringToDate(formValues.tilOgMed),
        årsak: brukÅrsak ? getÅrsakFromFraværFormValues(formValues) : undefined,
    };
};

export const mapFraværPeriodeToFormValues = (fraværPeriode: Partial<FraværPeriode>): FraværPeriodeFormValues => {
    return {
        fraOgMed: fraværPeriode.fraOgMed ? dateToISOString(fraværPeriode.fraOgMed) : '',
        tilOgMed: fraværPeriode.tilOgMed ? dateToISOString(fraværPeriode.tilOgMed) : '',
        hjemmePgaKorona: getHjemmePgaKoronaFormValueFromFraværÅrsak(fraværPeriode.årsak),
        årsak: fraværPeriode.årsak,
    };
};

export const brukHjemmePgaKoronaPeriodeForm = (fraOgMed?: Date, tilOgMed?: Date) => {
    if (fraOgMed === undefined || tilOgMed === undefined) {
        return false;
    }
    return (
        dayjs(fraOgMed).isBefore(dayjs('01.01.2023'), 'year') && dayjs(tilOgMed).isBefore(dayjs('01.01.2023'), 'year')
    );
};

export const brukHjemmePgaKoronaDagForm = (dag?: Date) => {
    if (dag === undefined) {
        return false;
    }

    return dayjs(dag).isBefore(dayjs('01.01.2023'), 'year');
};
