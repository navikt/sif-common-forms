import React from 'react';
import { useIntl } from 'react-intl';
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
import OmsorgstilbudInfoAndDialog from '../../../forms/omsorgstilbud/OmsorgstilbudInfoAndDialog';
import { getMonthsInDateRange } from '../../../forms/omsorgstilbud/omsorgstilbudUtils';
import { OmsorgstilbudPeriodeFormValue } from '../../../forms/omsorgstilbud/types';
import PageIntro from '../../components/page-intro/PageIntro';

enum FormField {
    periodeFra = 'periodeFra',
    periodeTil = 'periodeTil',
    omsorgstilbud = 'omsorgstilbud',
}

enum OmsorgstilbudFormField {
    skalHaOmsorgstilbud = 'skalHaOmsorgstilbud',
    omsorgsdager = 'omsorgsdager',
}

interface FormValues {
    [FormField.periodeFra]?: string;
    [FormField.periodeTil]?: string;
    [FormField.omsorgstilbud]: OmsorgstilbudPeriodeFormValue[];
}

const initialValues: FormValues = {
    periodeFra: datepickerUtils.getDateStringFromValue(dayjs().subtract(10, 'days').toDate()),
    periodeTil: datepickerUtils.getDateStringFromValue(dayjs().add(15, 'days').toDate()),
    [FormField.omsorgstilbud]: [
        {
            omsorgsdager: [
                {
                    dato: dayjs().subtract(7, 'days').toDate(),
                    tid: { hours: '2', minutes: '0' },
                },
                {
                    dato: dayjs().subtract(6, 'days').toDate(),
                    tid: { hours: '2', minutes: '0' },
                },
                {
                    dato: dayjs().subtract(5, 'days').toDate(),
                    tid: { hours: '2', minutes: '0' },
                },
                {
                    dato: dayjs().subtract(1, 'days').toDate(),
                    tid: { hours: '2', minutes: '30' },
                },
            ],
            skalHaOmsorgstilbud: YesOrNo.YES,
        },
    ],
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
                    const måneder = getMonthsInDateRange(range);

                    return (
                        <FormComponents.Form
                            includeButtons={false}
                            submitButtonLabel="Valider skjema"
                            formErrorHandler={getIntlFormErrorHandler(intl)}>
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
                            {måneder.map((m, index) => {
                                const mndOgÅr = dayjs(m.from).format('MMMM YYYY');
                                const getFieldName = (field: OmsorgstilbudFormField): any =>
                                    `${FormField.omsorgstilbud}.${index}.${field}`;
                                const skalIOmsorgstilbud =
                                    values.omsorgstilbud[index]?.skalHaOmsorgstilbud === YesOrNo.YES;
                                return (
                                    <Box key={dayjs(m.from).format('MM.YYYY')} margin="xl">
                                        <FormComponents.YesOrNoQuestion
                                            name={getFieldName(OmsorgstilbudFormField.skalHaOmsorgstilbud)}
                                            legend={`Skal barnet i omsorgstilbud ${mndOgÅr}?`}
                                        />
                                        {skalIOmsorgstilbud && (
                                            <FormBlock margin="l">
                                                <ResponsivePanel className={'omsorgstilbudInfoDialogWrapper'}>
                                                    <OmsorgstilbudInfoAndDialog
                                                        name={getFieldName(OmsorgstilbudFormField.omsorgsdager)}
                                                        fraDato={m.from}
                                                        tilDato={m.to}
                                                        labels={{
                                                            addLabel: `Legg til timer`,
                                                            deleteLabel: `Fjern alle timer`,
                                                            editLabel: `Endre`,
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
