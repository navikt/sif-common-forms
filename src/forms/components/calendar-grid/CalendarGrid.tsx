import React from 'react';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import { DateRange, prettifyDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import dayjs from 'dayjs';
import minMax from 'dayjs/plugin/minMax';
import { groupBy } from 'lodash';
import { guid } from 'nav-frontend-js-utils';
import './calendarGrid.less';

dayjs.extend(minMax);

interface Day {
    date: Date;
    content: JSX.Element | undefined;
}

interface Week {
    year: number;
    weekNumber: number;
    days: Day[];
}

interface Props {
    content: Day[];
    month: Date;
    min?: Date;
    max?: Date;
    dateFormatter?: (date: Date) => React.ReactNode;
    dateFormatterFull?: (date: Date) => React.ReactNode;
    noContentRenderer?: (date: Date) => React.ReactNode;
}

const getFirstWeekdayOnOrAfterDate = (date: Date): Date => {
    const weekday = dayjs(date).isoWeekday();
    if (weekday <= 5) {
        return date;
    } else if (weekday === 6) {
        return dayjs(date).add(2, 'days').toDate();
    }
    return dayjs(date).add(1, 'day').toDate();
};

const getDays = (month: Date, calendarDayContent: Day[], range?: Partial<DateRange>): Day[] => {
    const from = getFirstWeekdayOnOrAfterDate(range?.from || month);
    const to = range?.to || dayjs(month).endOf('month');
    const days: Array<Day> = [];
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

const getWeeks = (days: Day[]): Week[] => {
    const weeksAndDays = groupBy(days, (day) => `${day.date.getFullYear()}_${dayjs(day.date).isoWeek()}`);
    const weeks = Object.keys(weeksAndDays).map((key): Week => {
        const days = weeksAndDays[key];
        const weekNumber = dayjs(days[0].date).isoWeek();
        const year = dayjs(days[0].date).year();
        return { year, weekNumber, days };
    });
    return weeks;
};

const bem = bemUtils('calendarGrid');

const CalendarGrid: React.FunctionComponent<Props> = ({
    content,
    month,
    min,
    max,
    dateFormatter = prettifyDate,
    dateFormatterFull = (date) => dayjs(date).format('dddd DD. MMM'),
    noContentRenderer,
}) => {
    const days = getDays(month, content, { from: min, to: max });
    const weeks = getWeeks(days);
    return (
        <div className={bem.block}>
            <span role="presentation" aria-hidden={true} className={bem.element('dayHeader', 'week')}>
                Uke
            </span>
            <span role="presentation" aria-hidden={true} className={bem.element('dayHeader')}>
                Mandag
            </span>
            <span role="presentation" aria-hidden={true} className={bem.element('dayHeader')}>
                Tirsdag
            </span>
            <span role="presentation" aria-hidden={true} className={bem.element('dayHeader')}>
                Onsdag
            </span>
            <span role="presentation" aria-hidden={true} className={bem.element('dayHeader')}>
                Torsdag
            </span>
            <span role="presentation" aria-hidden={true} className={bem.element('dayHeader')}>
                Fredag
            </span>
            {weeks.map((week) => {
                const daysInWeek = week.days;
                const weekNum = week.weekNumber;
                return [
                    <span role="presentation" aria-hidden={true} className={bem.element('weekNum')} key={guid()}>
                        <span className={bem.element('weekNum_label')}>Uke {` `}</span>
                        <span>{weekNum}</span>
                    </span>,
                    daysInWeek.map((d) => {
                        return dayjs(d.date).isSame(month, 'month') === false ||
                            (min && dayjs(d.date).isBefore(min)) ? (
                            <div
                                key={guid()}
                                aria-hidden={true}
                                className={bem.classNames(bem.element('day', 'outsideMonth'))}
                            />
                        ) : (
                            <div
                                key={guid()}
                                aria-hidden={d.content === undefined}
                                className={bem.classNames(
                                    bem.element('day'),
                                    bem.modifierConditional('empty', d.content === undefined)
                                )}>
                                <div className={bem.element('date')}>
                                    <span className={bem.classNames(bem.element('date__full'))}>
                                        <span>{dateFormatterFull(d.date)}</span>
                                    </span>
                                    <span className={bem.element('date__short')}>{dateFormatter(d.date)}</span>
                                </div>
                                <div>
                                    {d.content || (noContentRenderer !== undefined ? noContentRenderer(d.date) : null)}
                                </div>
                            </div>
                        );
                    }),
                ];
            })}
        </div>
    );
};

export default CalendarGrid;