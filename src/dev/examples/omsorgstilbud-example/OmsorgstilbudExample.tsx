import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { Clock } from '@navikt/ds-icons';
import AriaAlternative from '@navikt/sif-common-core/lib/components/aria/AriaAlternative';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { DateRange, dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { getTypedFormComponents, YesOrNo } from '@navikt/sif-common-formik/lib';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import getIntlFormErrorHandler from '@navikt/sif-common-formik/lib/validation/intlFormErrorHandler';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import dayjs from 'dayjs';
import { Undertittel } from 'nav-frontend-typografi';
import CalendarGrid from '../../../forms/omsorgstilbud/CalendarGrid';
import OmsorgstilbudInfoAndDialog from '../../../forms/omsorgstilbud/OmsorgstilbudInfoAndDialog';
import { Omsorgsdag } from '../../../forms/omsorgstilbud/types';
import PageIntro from '../../components/page-intro/PageIntro';
import Panel from 'nav-frontend-paneler';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';

enum FormField {
    periodeFra = 'periodeFra',
    periodeTil = 'periodeTil',
    omsorgsdager = 'omsorgsdager',
}

interface FormValues {
    [FormField.periodeFra]?: string;
    [FormField.periodeTil]?: string;
    [FormField.omsorgsdager]?: Omsorgsdag[];
}

const initialValues: FormValues = {
    periodeFra: datepickerUtils.getDateStringFromValue(new Date()),
    periodeTil: datepickerUtils.getDateStringFromValue(dayjs().add(15, 'days').toDate()),
};

const FormComponents = getTypedFormComponents<FormField, FormValues, ValidationError>();

interface OmsorgsdagerIMåned {
    key: string;
    from: Date;
    to: Date;
    omsorgsdager: Omsorgsdag[];
}

export const datoErIPeriode = (dato: Date, range: DateRange): boolean =>
    dayjs(dato).isSameOrAfter(range.from, 'day') && dayjs(dato).isSameOrBefore(range.to, 'day');

const getAlleMånederIPerioden = (range: DateRange, omsorgsdager: Omsorgsdag[]): OmsorgsdagerIMåned[] => {
    const måneder: OmsorgsdagerIMåned[] = [];
    let current = dayjs(range.from);

    do {
        const monthRange: DateRange = { from: current.toDate(), to: current.endOf('month').toDate() };
        const dager = omsorgsdager.filter(
            (dag) =>
                dayjs(dag.dato).isSameOrAfter(monthRange.from, 'day') &&
                dayjs(dag.dato).isSameOrBefore(monthRange.to, 'day')
        );

        måneder.push({
            key: `${FormField.omsorgsdager}-${current.format('MM-YY')}`,
            omsorgsdager: dager,
            from: monthRange.from,
            to: dayjs(monthRange.to).isAfter(range.to) ? range.to : monthRange.to,
        });
        current = current.add(1, 'month').startOf('month');
    } while (current.isBefore(range.to));
    return måneder;
};

const OmsorgstilbudExample = () => {
    const [formValues, setFormValues] = useState<FormValues>({
        periodeFra: datepickerUtils.getDateStringFromValue(new Date()),
        periodeTil: datepickerUtils.getDateStringFromValue(dayjs().add(15, 'days').toDate()),
    });
    const intl = useIntl();
    return (
        <>
            <PageIntro title="Omsorgstilbud">Skjema som brukes for å registrere omsorgstilbud.</PageIntro>
            <Box padBottom="l">
                <Undertittel>Dialoginnhold</Undertittel>
            </Box>
            <FormComponents.FormikWrapper
                initialValues={initialValues}
                onSubmit={setFormValues}
                renderForm={({ values }) => {
                    const { omsorgsdager, periodeFra, periodeTil } = values;
                    const from = datepickerUtils.getDateFromDateString(periodeFra) || dateToday;
                    const to =
                        datepickerUtils.getDateFromDateString(periodeTil) || dayjs(from).add(1, 'month').toDate();

                    const range = { from, to };
                    const måneder = getAlleMånederIPerioden(range, omsorgsdager || []);

                    return (
                        <FormComponents.Form
                            includeButtons={true}
                            submitButtonLabel="Valider skjema"
                            formErrorHandler={getIntlFormErrorHandler(intl)}>
                            <FormBlock>
                                {1 + 1 === 3 && (
                                    <CalendarGrid
                                        month={new Date()}
                                        dateFormatter={(date: Date) => (
                                            <AriaAlternative
                                                visibleText={dayjs(date).format('D.')}
                                                ariaText={dayjs(date).format('DD.MM.YYYY')}
                                            />
                                        )}
                                        content={[
                                            {
                                                date: new Date(),
                                                content: (
                                                    <span className={'varighet'}>
                                                        <span className="varighet__ikon">
                                                            <Clock />
                                                        </span>
                                                        <span className="varighet__tid">1t 20 min</span>
                                                    </span>
                                                ),
                                            },
                                        ]}
                                    />
                                )}
                            </FormBlock>

                            <FormComponents.DateIntervalPicker
                                fromDatepickerProps={{
                                    label: 'Fra',
                                    name: FormField.periodeFra,
                                }}
                                toDatepickerProps={{
                                    label: 'Til',
                                    name: FormField.periodeTil,
                                }}
                            />
                            {måneder.map((m) => {
                                const mndOgÅr = dayjs(m.from).format('MMMM YYYY');
                                const inputName = `omsorgstilbud-${dayjs(m.from).format('MM-YY')}`;
                                const skalIOmsorgstilbud = values[inputName] === YesOrNo.YES;
                                return (
                                    <Box key={dayjs(m.from).format('MM.YYYY')} margin="xl">
                                        <FormComponents.YesOrNoQuestion
                                            name={inputName as any}
                                            legend={`Skal barnet i omsorgstilbud ${mndOgÅr}`}
                                        />
                                        {skalIOmsorgstilbud && (
                                            <FormBlock margin="l">
                                                <ResponsivePanel className={'omsorgstilbudInfoDialogWrapper'}>
                                                    <OmsorgstilbudInfoAndDialog
                                                        name={`${m.key}`}
                                                        fraDato={m.from}
                                                        tilDato={m.to}
                                                        omsorgsdager={m.omsorgsdager}
                                                        labels={{
                                                            addLabel: `Legg til timer`,
                                                            deleteLabel: `Fjern alle timer`,
                                                            editLabel: `Endre timer`,
                                                            infoTitle: `Omsorgstilbud - ${mndOgÅr}`,
                                                            modalTitle: `Omsorgstilbud - ${mndOgÅr}`,
                                                        }}
                                                    />
                                                </ResponsivePanel>
                                            </FormBlock>
                                        )}
                                    </Box>
                                );
                            })}
                        </FormComponents.Form>
                    );
                }}
            />
        </>
    );
};

export default OmsorgstilbudExample;
