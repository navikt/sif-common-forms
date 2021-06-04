import React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { dateToday, prettifyDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { getTypedFormComponents, Time, YesOrNo } from '@navikt/sif-common-formik/lib';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import getIntlFormErrorHandler from '@navikt/sif-common-formik/lib/validation/intlFormErrorHandler';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import dayjs from 'dayjs';
import { Undertittel } from 'nav-frontend-typografi';
import { OmsorgstilbudInlineForm } from '../../../forms/omsorgstilbud/OmsorgstilbudForm';
import OmsorgstilbudFormPart from '../../../forms/omsorgstilbud/OmsorgstilbudFormPart';
import { OmsorgstilbudDag, OmsorgstilbudMåned } from '../../../forms/omsorgstilbud/types';
import PageIntro from '../../components/page-intro/PageIntro';

enum FormField {
    periodeFra = 'periodeFra',
    periodeTil = 'periodeTil',
    måneder = 'måneder',
    dager = 'dager',
    tidIOmsorg = 'tidIOmsorg',
}

interface FormValues {
    [FormField.periodeFra]?: string;
    [FormField.periodeTil]?: string;
    [FormField.måneder]: OmsorgstilbudMåned[];
    [FormField.dager]: OmsorgstilbudDag[];
    [FormField.tidIOmsorg]: { [isoDateString: string]: Partial<Time> };
}

const initialValues: FormValues = {
    periodeFra: datepickerUtils.getDateStringFromValue(dayjs().subtract(10, 'days').toDate()),
    periodeTil: datepickerUtils.getDateStringFromValue(dayjs().add(12, 'days').toDate()),
    dager: [],
    [FormField.måneder]: [
        {
            skalHaOmsorgstilbud: YesOrNo.YES,
        },
    ],
    tidIOmsorg: {},
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
                                måneder={values.måneder}
                                dager={values.dager}
                                søknadsperiode={{ from, to }}
                                perioderFieldName={FormField.måneder}
                                dagerFieldName={FormField.dager}
                            />
                            <OmsorgstilbudInlineForm fieldName={FormField.tidIOmsorg} søknadsperiode={{ from, to }} />
                        </FormComponents.Form>
                    );
                }}
            />
        </>
    );
};

export default OmsorgstilbudExample;
