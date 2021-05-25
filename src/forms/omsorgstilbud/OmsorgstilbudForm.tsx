import React from 'react';
import { useIntl } from 'react-intl';
import { useMediaQuery } from 'react-responsive';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import { dateToISOString, getTypedFormComponents, ISOStringToDate, Time } from '@navikt/sif-common-formik/lib';
import getTimeValidator from '@navikt/sif-common-formik/lib/validation/getTimeValidator';
import getFormErrorHandler from '@navikt/sif-common-formik/lib/validation/intlFormErrorHandler';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import groupby from 'lodash.groupby';
import { Normaltekst, Systemtittel, Undertittel } from 'nav-frontend-typografi';
import { Omsorgsdag } from './types';
import './omsorgstilbudForm.less';
import { isValidTime } from '@navikt/sif-common-formik/lib/components/formik-time-input/TimeInput';
import { hasValue } from '@navikt/sif-common-formik/lib/validation/validationUtils';

dayjs.extend(isoWeek);
dayjs.extend(weekOfYear);

interface Props {
    omsorgsdager?: Omsorgsdag[];
    fraDato: Date;
    tilDato: Date;
    onSubmit: (omsorgsdager: Omsorgsdag[]) => void;
    onCancel?: () => void;
}

type OmsorgsgdagFormType = { [key: string]: Partial<Time> };

interface FormValues {
    [key: string]: Partial<Time>;
}

const Form = getTypedFormComponents<string, FormValues, ValidationError>();

interface DateInput {
    key: string;
    dayOfWeek: number;
    dayName: string;
    dateString: string;
    week: number;
    yearAndWeek: string;
    label: string;
    time?: Time;
}

const getDates = (from: Date, to: Date): DateInput[] => {
    const dates: DateInput[] = [];
    let date = dayjs(from);
    while (date.isSameOrBefore(to, 'day')) {
        const dayOfWeek = date.isoWeekday();
        if (dayOfWeek <= 5) {
            const dayName = date.format('dddd');
            const dateString = date.format('DD.MM.YYYY');
            const week = date.isoWeek();
            const year = date.year();
            const yearAndWeek = `${week},  ${year}`;
            dates.push({
                key: dateToISOString(date.toDate()),
                dayOfWeek,
                dayName,
                dateString,
                week,
                yearAndWeek,
                label: `${dayName.substring(0, 3)}. ${dateString}`,
            });
        }
        date = date.add(1, 'day');
    }
    return dates;
};
const bem = bemUtils('omsorgstilbudDager');

const mapOmsorgsdagerToFormValues = (omsorgsdager?: Omsorgsdag[]) => {
    const omsorgsdag: OmsorgsgdagFormType = {};
    omsorgsdager?.forEach((dag) => {
        const key = dateToISOString(dag.dato);
        omsorgsdag[key] = dag.tid;
    });
    return omsorgsdag;
};

const OmsorgstilbudForm = ({ fraDato, tilDato, omsorgsdager, onSubmit, onCancel }: Props) => {
    const intl = useIntl();
    const isWide = useMediaQuery({ minWidth: 600 });

    const onFormikSubmit = (formDager: Partial<FormValues>) => {
        const submitDager: Omsorgsdag[] = [];
        if (formDager) {
            Object.keys(formDager).forEach((key) => {
                const time = formDager[key];
                const date = ISOStringToDate(key);
                if (date && time && isValidTime(time)) {
                    submitDager.push({
                        dato: date,
                        tid: time,
                    });
                }
            });
        }
        onSubmit(submitDager);
    };

    const fromDate = dayjs(fraDato);
    const toDate = dayjs(tilDato);

    if (fromDate.isAfter(toDate)) {
        return <div>Fra dato er før til-dato</div>;
    }

    const dates = getDates(fraDato, tilDato);
    const weeks = groupby(dates, (date) => date.yearAndWeek);
    const mndOgÅr = fromDate.format('MMMM YYYY');
    return (
        <Normaltekst tag="div">
            <Form.FormikWrapper
                initialValues={mapOmsorgsdagerToFormValues(omsorgsdager)}
                onSubmit={onFormikSubmit}
                renderForm={() => {
                    return (
                        <Form.Form
                            onCancel={onCancel}
                            formErrorHandler={getFormErrorHandler(intl, 'tidsperiodeForm')}
                            includeButtons={true}>
                            <Systemtittel tag="h1">Omsorgstilbud - {mndOgÅr}</Systemtittel>
                            <Box margin="l">
                                <p>
                                    Fyll ut antall timer og minutter de dagene barnet skal være i omsorgstilbud. Dager
                                    hvor barnet ikke skal være i omsorgstilbud, trenger du ikke fylle ut noe.
                                </p>
                                <p>
                                    <strong>Du kan registrere opp til 7 timer og 30 minutter på én dag.</strong>
                                </p>
                            </Box>
                            <div className={bem.classNames(bem.block, bem.modifierConditional('wide', isWide))}>
                                {Object.keys(weeks).map((key) => {
                                    const weekDates = weeks[key];
                                    const mndYearAndWeek = weekDates[0].yearAndWeek;
                                    return (
                                        <Box key={key} margin="m">
                                            <ResponsivePanel>
                                                <Undertittel>Uke {mndYearAndWeek}</Undertittel>
                                                {weekDates.map((day) => (
                                                    <Box key={day.key} margin={isWide ? 'm' : 'l'}>
                                                        <Form.TimeInput
                                                            name={day.key}
                                                            className={
                                                                hasValue(day.time?.hours) || hasValue(day.time?.minutes)
                                                                    ? 'with-value'
                                                                    : undefined
                                                            }
                                                            label={<span className="caps">{day.label}</span>}
                                                            timeInputLayout={{
                                                                srOnlyLabels: true,
                                                                layout: isWide ? 'horizontal' : undefined,
                                                                suffix: { hours: 'tim', minutes: 'min' },
                                                                placeholders: {
                                                                    hours: '0',
                                                                    minutes: '0',
                                                                },
                                                            }}
                                                            validate={(time) => {
                                                                const error = getTimeValidator({
                                                                    required: false,
                                                                    max: { hours: 7, minutes: 30 },
                                                                })(time);
                                                                return error
                                                                    ? {
                                                                          key: `omsorgstilbud.validation.${error}`,
                                                                          values: { dag: day.label, maksTimer: 7 },
                                                                          keepKeyUnaltered: true,
                                                                      }
                                                                    : undefined;
                                                            }}
                                                        />
                                                    </Box>
                                                ))}
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
