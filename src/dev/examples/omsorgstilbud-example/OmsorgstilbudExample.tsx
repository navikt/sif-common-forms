import React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
// import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
// import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
// import { dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { getTypedFormComponents, YesOrNo } from '@navikt/sif-common-formik/lib';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import getIntlFormErrorHandler from '@navikt/sif-common-formik/lib/validation/intlFormErrorHandler';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import dayjs from 'dayjs';
import { Undertittel } from 'nav-frontend-typografi';
import OmsorgstilbudFormPart from '../../../forms/omsorgstilbud/OmsorgstilbudFormPart';
import { OmsorgstilbudPeriodeFormValue } from '../../../forms/omsorgstilbud/types';
// import OmsorgstilbudInfoAndDialog from '../../../forms/omsorgstilbud/OmsorgstilbudInfoAndDialog';
// import { getMonthsInDateRange } from '../../../forms/omsorgstilbud/omsorgstilbudUtils';
// import { OmsorgstilbudFormField, OmsorgstilbudPeriodeFormValue } from '../../../forms/omsorgstilbud/types';
import PageIntro from '../../components/page-intro/PageIntro';
import {
    getDatoerForOmsorgstilbudPeriode,
    OmsorgstilbudInlineForm,
} from '../../../forms/omsorgstilbud/OmsorgstilbudForm';
import { dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';

enum FormField {
    periodeFra = 'periodeFra',
    periodeTil = 'periodeTil',
    omsorgstilbud = 'omsorgstilbud',
}

interface FormValues {
    [FormField.periodeFra]?: string;
    [FormField.periodeTil]?: string;
    [FormField.omsorgstilbud]: OmsorgstilbudPeriodeFormValue[];
}

const initialValues: FormValues = {
    periodeFra: datepickerUtils.getDateStringFromValue(dayjs().subtract(10, 'days').toDate()),
    periodeTil: datepickerUtils.getDateStringFromValue(dayjs().add(12, 'days').toDate()),
    [FormField.omsorgstilbud]: [
        {
            periode: {
                from: dayjs('2021-06-01').toDate(),
                to: dayjs('2021-06-30').toDate(),
            },
            omsorgsdager: [
                {
                    dato: dayjs('2021-06-03').toDate(),
                    tid: { hours: '2', minutes: '0' },
                },
                {
                    dato: dayjs('2021-06-07').toDate(),
                    tid: { hours: '2', minutes: '0' },
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
                    const datoer = getDatoerForOmsorgstilbudPeriode(from, to);

                    // const range = { from, to };
                    // const måneder = getMonthsInDateRange(range);

                    return (
                        <FormComponents.Form
                            includeButtons={false}
                            submitButtonLabel="Valider skjema"
                            formErrorHandler={getIntlFormErrorHandler(intl)}>
                            {/* <FormComponents.DateIntervalPicker
                                fromDatepickerProps={{
                                    label: 'Fra',
                                    name: FormField.periodeFra,
                                }}
                                toDatepickerProps={{
                                    label: 'Til',
                                    name: FormField.periodeTil,
                                }}
                            /> */}
                            <OmsorgstilbudFormPart
                                omsorgstilbud={values.omsorgstilbud}
                                fieldName={FormField.omsorgstilbud}
                            />

                            <OmsorgstilbudInlineForm
                                fieldName={`enkeltdager`}
                                datoer={datoer}
                                ukeTittelRenderer={() => <>asaa</>}
                            />
                        </FormComponents.Form>
                    );
                }}
            />
        </>
    );
};

export default OmsorgstilbudExample;
