import React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { dateToday, prettifyDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { getTypedFormComponents, YesOrNo } from '@navikt/sif-common-formik/lib';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import getIntlFormErrorHandler from '@navikt/sif-common-formik/lib/validation/intlFormErrorHandler';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import dayjs from 'dayjs';
import { Undertittel } from 'nav-frontend-typografi';
import OmsorgstilbudFormPart from '../../../forms/omsorgstilbud/OmsorgstilbudFormPart';
import { OmsorgstilbudDag, OmsorgstilbudPeriode } from '../../../forms/omsorgstilbud/types';
import PageIntro from '../../components/page-intro/PageIntro';

enum FormField {
    periodeFra = 'periodeFra',
    periodeTil = 'periodeTil',
    perioder = 'perioder',
    dager = 'dager',
}

interface FormValues {
    [FormField.periodeFra]?: string;
    [FormField.periodeTil]?: string;
    [FormField.perioder]: OmsorgstilbudPeriode[];
    [FormField.dager]: OmsorgstilbudDag[];
}

const initialValues: FormValues = {
    periodeFra: datepickerUtils.getDateStringFromValue(dayjs().subtract(10, 'days').toDate()),
    periodeTil: datepickerUtils.getDateStringFromValue(dayjs().add(12, 'days').toDate()),
    dager: [],
    [FormField.perioder]: [
        {
            periode: {
                from: dayjs('2021-06-01').toDate(),
                to: dayjs('2021-06-30').toDate(),
            },
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
                    return (
                        <FormComponents.Form
                            includeButtons={false}
                            submitButtonLabel="Valider skjema"
                            formErrorHandler={getIntlFormErrorHandler(intl)}>
                            <p>
                                Fra: {prettifyDate(from)} - Tilo: {prettifyDate(to)}
                            </p>
                            <OmsorgstilbudFormPart
                                perioder={values.perioder}
                                dager={values.dager}
                                søknadsperiode={{ from, to }}
                                perioderFieldName={FormField.perioder}
                                dagerFieldName={FormField.dager}
                            />
                            {/* <OmsorgstilbudInlineForm fieldName={FormField.dager} datoer={datoer} /> */}
                        </FormComponents.Form>
                    );
                }}
            />
        </>
    );
};

export default OmsorgstilbudExample;
