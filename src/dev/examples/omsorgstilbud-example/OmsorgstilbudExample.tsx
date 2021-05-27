import React from 'react';
import { useIntl } from 'react-intl';
import { Clock } from '@navikt/ds-icons';
import AriaAlternative from '@navikt/sif-common-core/lib/components/aria/AriaAlternative';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import { dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { getTypedFormComponents, YesOrNo } from '@navikt/sif-common-formik/lib';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import getIntlFormErrorHandler from '@navikt/sif-common-formik/lib/validation/intlFormErrorHandler';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import dayjs from 'dayjs';
import { Undertittel } from 'nav-frontend-typografi';
import CalendarGrid from '../../../forms/omsorgstilbud/CalendarGrid';
import OmsorgstilbudInfoAndDialog from '../../../forms/omsorgstilbud/OmsorgstilbudInfoAndDialog';
import PageIntro from '../../components/page-intro/PageIntro';
import { getAlleMånederIPerioden } from '../../../forms/omsorgstilbud/omsorgstilbudUtils';

enum FormField {
    periodeFra = 'periodeFra',
    periodeTil = 'periodeTil',
}

// type OmsorgsdagerFormValue = {[key: string]: Omsor[]}
interface FormValues {
    [FormField.periodeFra]?: string;
    [FormField.periodeTil]?: string;
    // [FormField.omsorgsdager]: Om
}

const initialValues: FormValues = {
    periodeFra: datepickerUtils.getDateStringFromValue(dayjs().subtract(10, 'days').toDate()),
    periodeTil: datepickerUtils.getDateStringFromValue(dayjs().add(15, 'days').toDate()),
};

const FormComponents = getTypedFormComponents<FormField, FormValues, ValidationError>();

const OmsorgstilbudExample = () => {
    const intl = useIntl();
    return (
        <>
            <PageIntro title="Omsorgstilbud">Skjema som brukes for å registrere omsorgstilbud.</PageIntro>
            <Box padBottom="l">
                <Undertittel>Dialoginnhold</Undertittel>
            </Box>
            <FormComponents.FormikWrapper
                initialValues={initialValues}
                onSubmit={() => null}
                renderForm={({ values }) => {
                    const { periodeFra, periodeTil } = values;
                    const from = datepickerUtils.getDateFromDateString(periodeFra) || dateToday;
                    const to =
                        datepickerUtils.getDateFromDateString(periodeTil) || dayjs(from).add(1, 'month').toDate();

                    const range = { from, to };
                    const måneder = getAlleMånederIPerioden(range, values as any);

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
                                            legend={`Skal barnet i omsorgstilbud ${mndOgÅr}?`}
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
                                                            editLabel: `Endre`,
                                                            infoTitle:
                                                                m.omsorgsdager.length === 0
                                                                    ? `Omsorgstilbud - ${mndOgÅr}`
                                                                    : undefined,
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
