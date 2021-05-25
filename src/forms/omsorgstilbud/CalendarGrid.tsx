import React from 'react';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import { DateRange, prettifyDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import dayjs from 'dayjs';
import minMax from 'dayjs/plugin/minMax';
import './calendarGrid.less';

dayjs.extend(minMax);

interface CalendarDayContent {
    date: Date;
    content: JSX.Element | undefined;
}

interface Props {
    content: CalendarDayContent[];
    month: Date;
    min?: Date;
    max?: Date;
    dateFormatter?: (date: Date) => React.ReactNode;
    noContentRenderer?: (date: Date) => React.ReactNode;
}

const getFirstWeekdayInMonth = (month: Date): Date => {
    const firstDayInMonth = dayjs(month).startOf('month');
    const firstWeekday = firstDayInMonth.isoWeekday();
    if (firstWeekday <= 5) {
        return firstDayInMonth.toDate();
    } else if (firstWeekday === 6) {
        return firstDayInMonth.add(2, 'days').toDate();
    }
    return firstDayInMonth.add(1, 'day').toDate();
};

const getFirstWeekdayOnOrAfter = (date: Date): Date => {
    const weekday = dayjs(date).isoWeekday();
    if (weekday <= 5) {
        return date;
    } else if (weekday === 6) {
        return dayjs(date).add(2, 'days').toDate();
    }
    return dayjs(date).add(1, 'day').toDate();
};

const getDaysToRender = (
    month: Date,
    calendarDayContent: CalendarDayContent[],
    range?: Partial<DateRange>
): CalendarDayContent[] => {
    const from = range?.from ? getFirstWeekdayOnOrAfter(range.from) : getFirstWeekdayInMonth(month);
    const to = range?.to || dayjs(month).endOf('month');
    const days: Array<CalendarDayContent> = [];

    let current = dayjs(from).subtract(dayjs(from).isoWeekday() - 1, 'days');

    do {
        const date = current.toDate();
        if (current.isoWeekday() <= 5) {
            const dayContent = calendarDayContent.find((c) => dayjs(c.date).isSame(date, 'day'));
            days.push({ date, content: dayContent !== undefined ? dayContent.content : undefined });
        }
        current = current.add(1, 'day');
    } while (current.isSameOrBefore(to));
    return days;
};

const bem = bemUtils('calendarGrid');

const CalendarGrid: React.FunctionComponent<Props> = ({
    content,
    month,
    min,
    max,
    dateFormatter = prettifyDate,
    noContentRenderer,
}) => {
    const days = getDaysToRender(month, content, { from: min, to: max });
    let weekNum: number;
    return (
        <div className={bem.block}>
            <span role="presentation" aria-hidden={true} className={bem.element('day')}>
                Uke
            </span>
            <span role="presentation" aria-hidden={true} className={bem.element('day')}>
                Mandag
            </span>
            <span role="presentation" aria-hidden={true} className={bem.element('day')}>
                Tirsdag
            </span>
            <span role="presentation" aria-hidden={true} className={bem.element('day')}>
                Onsdag
            </span>
            <span role="presentation" aria-hidden={true} className={bem.element('day')}>
                Torsdag
            </span>
            <span role="presentation" aria-hidden={true} className={bem.element('day')}>
                Fredag
            </span>
            {days.map((d) => {
                const dayWeekNum = dayjs(d.date).isoWeek();
                const content =
                    dayjs(d.date).isSame(month, 'month') === false || (min && dayjs(d.date).isBefore(min)) ? (
                        <div />
                    ) : (
                        <div
                            aria-hidden={d.content === undefined}
                            className={bem.classNames(
                                bem.element('contentWrapper'),
                                bem.modifierConditional('noData', d.content === undefined)
                            )}>
                            <div className={bem.element('date')}>{dateFormatter(d.date)}</div>
                            <div className={bem.element('dateContent')}>
                                {d.content || (noContentRenderer !== undefined ? noContentRenderer(d.date) : null)}
                            </div>
                        </div>
                    );
                if (weekNum !== dayWeekNum) {
                    weekNum = dayWeekNum;
                    return (
                        <>
                            <span role="presentation" aria-hidden={true} className={bem.element('weekNum')}>
                                {weekNum}
                            </span>
                            {content}
                        </>
                    );
                }
                return content;
            })}
        </div>
    );
};

export default CalendarGrid;
