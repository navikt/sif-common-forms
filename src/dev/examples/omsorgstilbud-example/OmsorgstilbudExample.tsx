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
import { OmsorgstilbudInlineForm } from '../../../forms/omsorgstilbud/OmsorgstilbudForm';
import { OmsorgstilbudMåned, TidIOmsorgstilbud } from '../../../forms/omsorgstilbud/types';
import PageIntro from '../../components/page-intro/PageIntro';
import EkspanderbartPanel from 'nav-frontend-ekspanderbartpanel';
import OmsorgstilbudFormPart from './OmsorgstilbudFormPart';

export enum OmsorgstilbudFormField {
    periodeFra = 'periodeFra',
    periodeTil = 'periodeTil',
    måneder = 'måneder',
    enkeltdager = 'enkeltdager',
}
interface FormValues {
    [OmsorgstilbudFormField.periodeFra]?: string;
    [OmsorgstilbudFormField.periodeTil]?: string;
    [OmsorgstilbudFormField.måneder]: OmsorgstilbudMåned[];
    [OmsorgstilbudFormField.enkeltdager]: TidIOmsorgstilbud;
}

const initialValues: FormValues = {
    periodeFra: datepickerUtils.getDateStringFromValue(dayjs().subtract(12, 'days').toDate()),
    periodeTil: datepickerUtils.getDateStringFromValue(dayjs().add(12, 'days').toDate()),
    [OmsorgstilbudFormField.måneder]: [
        {
            skalHaOmsorgstilbud: YesOrNo.YES,
        },
    ],
    enkeltdager: {},
};

export interface OmsorgstilbudInfo {
    måneder?: OmsorgstilbudMåned[];
    enkeltdager?: TidIOmsorgstilbud /** Brukes hvor tid oppgis inline i skjema, ikke i dialog */;
}

const FormComponents = getTypedFormComponents<OmsorgstilbudFormField, FormValues, ValidationError>();

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
                            includeButtons={true}
                            submitButtonLabel="Valider skjema"
                            formErrorHandler={getIntlFormErrorHandler(intl)}>
                            <p>
                                Fra: {prettifyDate(from)} - Tilo: {prettifyDate(to)}
                            </p>
                            <OmsorgstilbudFormPart
                                info={{ enkeltdager: values.enkeltdager, måneder: values.måneder }}
                                søknadsperiode={{ from, to }}
                            />
                            <EkspanderbartPanel tittel="abc" apen={true}>
                                <OmsorgstilbudInlineForm
                                    fieldName={OmsorgstilbudFormField.enkeltdager}
                                    søknadsperiode={{ from, to }}
                                />
                            </EkspanderbartPanel>
                        </FormComponents.Form>
                    );
                }}
            />
        </>
    );
};

export default OmsorgstilbudExample;
