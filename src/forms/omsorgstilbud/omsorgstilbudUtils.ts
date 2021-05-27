import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import dayjs from 'dayjs';
import { Omsorgsdag, OmsorgsdagerIMåned } from './types';

export const OmsorgsdagerFormFieldKey = 'omsorgsdager';

export const datoErIPeriode = (dato: Date, range: DateRange): boolean =>
    dayjs(dato).isSameOrAfter(range.from, 'day') && dayjs(dato).isSameOrBefore(range.to, 'day');

export const getAlleMånederIPerioden = (
    range: DateRange,
    values: { [key: string]: Omsorgsdag[] }
): OmsorgsdagerIMåned[] => {
    const måneder: OmsorgsdagerIMåned[] = [];
    let current = dayjs(range.from);

    do {
        const key = `${OmsorgsdagerFormFieldKey}-${current.format('MM-YY')}`;
        const monthRange: DateRange = { from: current.toDate(), to: current.endOf('month').toDate() };
        måneder.push({
            key,
            omsorgsdager: values[key] || [],
            from: monthRange.from,
            to: dayjs(monthRange.to).isAfter(range.to) ? range.to : monthRange.to,
        });
        current = current.add(1, 'month').startOf('month');
    } while (current.isBefore(range.to));
    return måneder;
};
export const filterDagerIPeriode = (data: Omsorgsdag[], fraDato: Date, tilDato: Date): Omsorgsdag[] =>
    data.filter((dag) => datoErIPeriode(dag.dato, { from: fraDato, to: tilDato }));
