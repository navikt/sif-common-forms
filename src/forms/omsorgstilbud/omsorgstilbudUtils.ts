import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import dayjs from 'dayjs';

export const getMonthsInDateRange = (range: DateRange): DateRange[] => {
    const months: DateRange[] = [];
    let current = dayjs(range.from);
    do {
        const monthRange: DateRange = { from: current.toDate(), to: current.endOf('month').toDate() };
        months.push({
            from: monthRange.from,
            to: dayjs(monthRange.to).isAfter(range.to) ? range.to : monthRange.to,
        });
        current = current.add(1, 'month').startOf('month');
    } while (current.isBefore(range.to));
    return months;
};
