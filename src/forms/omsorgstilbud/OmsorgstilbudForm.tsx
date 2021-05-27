import React from 'react';
import { useIntl } from 'react-intl';
import { useMediaQuery } from 'react-responsive';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import { getTypedFormComponents, Time } from '@navikt/sif-common-formik/lib';
import {
    isValidTime,
    TimeInputLayoutProps,
} from '@navikt/sif-common-formik/lib/components/formik-time-input/TimeInput';
import getTimeValidator from '@navikt/sif-common-formik/lib/validation/getTimeValidator';
import getFormErrorHandler from '@navikt/sif-common-formik/lib/validation/intlFormErrorHandler';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import { hasValue } from '@navikt/sif-common-formik/lib/validation/validationUtils';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import groupby from 'lodash.groupby';
import { Normaltekst, Systemtittel, Undertittel } from 'nav-frontend-typografi';
import { Omsorgsdag } from './types';
import './omsorgstilbudForm.less';

dayjs.extend(isoWeek);
dayjs.extend(weekOfYear);

interface Props {
    omsorgsdager?: Omsorgsdag[];
    fraDato: Date;
    tilDato: Date;
    onSubmit: (omsorgsdager: Omsorgsdag[]) => void;
    onCancel?: () => void;
}

enum FormField {
    omsorgsdager = 'omsorgsdager',
}
interface FormValues {
    [FormField.omsorgsdager]: Array<Partial<Time>>;
}

const Form = getTypedFormComponents<FormField, FormValues, ValidationError>();

interface DateInfo {
    index: number;
    date: Date;
    dayOfWeek: number;
    yearAndWeek: string;
    weekNum: number;
    year: number;
    label: string;
    labelFull: string;
    time?: Time;
}

interface WeekInfo {
    year: number;
    weekNum: number;
    dates: DateInfo[];
}

const getDates = (from: Date, to: Date): DateInfo[] => {
    const dates: DateInfo[] = [];
    let date = dayjs(from);
    let index = 0;
    while (date.isSameOrBefore(to, 'day')) {
        const dayOfWeek = date.isoWeekday();
        if (dayOfWeek <= 5) {
            dates.push({
                index,
                date: date.toDate(),
                dayOfWeek,
                weekNum: date.isoWeek(),
                year: date.year(),
                yearAndWeek: `${date.year()}.${date.isoWeek()}`,
                label: `${date.format('dddd').substring(0, 3)}. ${date.format('DD.MM.YYYY')}`,
                labelFull: `${date.format('dddd')} ${date.format('DD. MMM')}`,
            });
            index++;
        }
        date = date.add(1, 'day');
    }
    return dates;
};
const bem = bemUtils('omsorgstilbudDager');

const renderEmptyNodes = (num: number): JSX.Element[] | undefined => {
    if (num === 0) {
        return undefined;
    }
    let x = 0;
    const items: JSX.Element[] = [];
    do {
        items.push(<span key={x} />);
        x++;
    } while (x < num);
    return items;
};

const getWeeks = (days: DateInfo[]): WeekInfo[] => {
    const weekAndDates = groupby(days, (date) => date.yearAndWeek);
    const weeks = Object.keys(weekAndDates).map((key): WeekInfo => {
        const dates = weekAndDates[key];
        return { year: dates[0].year, weekNum: dates[0].weekNum, dates: weekAndDates[key] };
    });
    return weeks;
};

const getInitialValues = (omsorgsdager: Omsorgsdag[], dagerIPerioden: DateInfo[]): FormValues => {
    return {
        omsorgsdager: dagerIPerioden.map((dag) => {
            const omsorgsdag = omsorgsdager?.find((od) => dayjs(od.dato).isSame(dag.date, 'day'));
            return omsorgsdag ? omsorgsdag.tid : { hours: '', minutes: '' };
        }),
    };
};

const getTimeInputLayout = (isNarrow: boolean, isWide: boolean): TimeInputLayoutProps => ({
    srOnlyLabels: false,
    justifyContent: 'right',
    layout: isNarrow ? 'compactWithSpace' : isWide ? undefined : 'horizontal',
});

const OmsorgstilbudForm = ({ fraDato, tilDato, omsorgsdager, onSubmit, onCancel }: Props) => {
    const intl = useIntl();
    const isNarrow = useMediaQuery({ maxWidth: 400 });
    const isWide = useMediaQuery({ minWidth: 1050 });
    const dates = getDates(fraDato, tilDato);
    const weeks = getWeeks(dates);

    if (dayjs(fraDato).isAfter(tilDato)) {
        return <div>Fra dato er før til-dato</div>;
    }

    const onFormikSubmit = (formDager: Partial<FormValues>) => {
        const submitDager: Omsorgsdag[] = [];
        formDager.omsorgsdager?.forEach((time, index) => {
            const date = dates[index]?.date;
            if (date && time && isValidTime(time)) {
                submitDager.push({
                    dato: date,
                    tid: time,
                });
            }
        });
        onSubmit(submitDager.filter((dag) => hasValue(dag.tid.hours) || hasValue(dag.tid.minutes)));
    };

    return (
        <Normaltekst tag="div">
            <Form.FormikWrapper
                initialValues={getInitialValues(omsorgsdager || [], dates)}
                onSubmit={onFormikSubmit}
                renderForm={() => {
                    return (
                        <Form.Form
                            onCancel={onCancel}
                            formErrorHandler={getFormErrorHandler(intl, 'tidsperiodeForm')}
                            includeButtons={true}>
                            <Systemtittel tag="h1">Omsorgstilbud - {dayjs(fraDato).format('MMMM YYYY')}</Systemtittel>
                            <Box margin="l">
                                <p>
                                    Fyll ut antall timer og minutter de dagene barnet skal være i omsorgstilbud. Dager
                                    hvor barnet ikke skal være i omsorgstilbud, trenger du ikke fylle ut noe.
                                </p>
                                <p>
                                    <strong>Du kan registrere opp til 7 timer og 30 minutter på én dag.</strong>
                                </p>
                            </Box>
                            <div className={bem.block}>
                                {weeks.map(({ dates, year, weekNum }) => {
                                    const preDaysInWeek = dates[0].dayOfWeek - 1;
                                    return (
                                        <Box key={weekNum} margin="m">
                                            <ResponsivePanel>
                                                <Undertittel style={{ marginBottom: '1rem' }}>
                                                    Uke {weekNum}, {year}
                                                </Undertittel>
                                                <div className={isWide ? 'omsorgstilbud__uke' : undefined}>
                                                    {renderEmptyNodes(preDaysInWeek)}
                                                    {dates.map((day) => (
                                                        <div
                                                            key={day.date.getTime()}
                                                            className={bem.element('dagWrapper')}>
                                                            <Form.TimeInput
                                                                name={`${FormField.omsorgsdager}.${day.index}` as any}
                                                                label={<span className="caps">{day.label}</span>}
                                                                timeInputLayout={getTimeInputLayout(isNarrow, isWide)}
                                                                validate={(time) => {
                                                                    const error = getTimeValidator({
                                                                        required: false,
                                                                        max: { hours: 7, minutes: 30 },
                                                                    })(time);
                                                                    return error
                                                                        ? {
                                                                              key: `omsorgstilbud.validation.${error}`,
                                                                              values: {
                                                                                  dag: day.labelFull,
                                                                                  maksTimer: 7,
                                                                              },
                                                                              keepKeyUnaltered: true,
                                                                          }
                                                                        : undefined;
                                                                }}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </ResponsivePanel>
                                        </Box>
                                    );
                                })}
                            </div>
                        </Form.Form>
                    );
                }}
            />
        </Normaltekst>
    );
};

export default OmsorgstilbudForm;
