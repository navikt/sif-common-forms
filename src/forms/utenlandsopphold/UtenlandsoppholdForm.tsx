import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { getCountryName, YesOrNo } from '@navikt/sif-common-formik';
import { getTypedFormComponents } from '@navikt/sif-common-formik/lib';
import { Systemtittel } from 'nav-frontend-typografi';
import Box from '@navikt/sif-common/lib/common/components/box/Box';
import {
    commonFieldErrorRenderer
} from '@navikt/sif-common/lib/common/utils/commonFieldErrorRenderer';
import { countryIsMemberOfEøsOrEfta } from '@navikt/sif-common/lib/common/utils/countryUtils';
import intlHelper from '@navikt/sif-common/lib/common/utils/intlUtils';
import dateRangeValidation from '@navikt/sif-common/lib/common/validation/dateRangeValidation';
import {
    validateRequiredField, validateRequiredSelect, validateYesOrNoIsAnswered
} from '@navikt/sif-common/lib/common/validation/fieldValidations';
import { hasValue } from '@navikt/sif-common/lib/common/validation/hasValue';
import { isUtenlandsoppholdType, Utenlandsopphold, UtenlandsoppholdÅrsak } from './types';

interface Props {
    minDate: Date;
    maxDate: Date;
    opphold?: Utenlandsopphold;
    onSubmit: (values: Utenlandsopphold) => void;
    onCancel: () => void;
}

enum UtenlandsoppholdFormFields {
    fom = 'fom',
    tom = 'tom',
    landkode = 'landkode',
    årsak = 'årsak',
    erBarnetInnlagt = 'erBarnetInnlagt'
}

const defaultFormValues: Partial<Utenlandsopphold> = {
    fom: undefined,
    tom: undefined,
    landkode: undefined,
    erBarnetInnlagt: YesOrNo.UNANSWERED,
    årsak: undefined
};

type FormValues = Partial<Utenlandsopphold>;

const Form = getTypedFormComponents<UtenlandsoppholdFormFields, FormValues>();

const UtenlandsoppholdForm: React.FunctionComponent<Props> = ({
    maxDate,
    minDate,
    opphold: initialValues = defaultFormValues,
    onSubmit,
    onCancel
}) => {
    const intl = useIntl();

    const onFormikSubmit = (formValues: Partial<Utenlandsopphold>) => {
        if (isUtenlandsoppholdType(formValues)) {
            onSubmit({
                ...formValues,
                årsak: countryIsMemberOfEøsOrEfta(formValues.landkode) ? undefined : formValues.årsak
            });
        } else {
            throw new Error('UtenlandsoppholdForm: Formvalues is not a valid Utenlandsopphold on submit.');
        }
    };

    return (
        <Form.FormikWrapper
            initialValues={initialValues}
            onSubmit={onFormikSubmit}
            renderForm={(formik) => {
                const { values } = formik;
                const showInnlagtQuestion: boolean =
                    values.landkode !== undefined &&
                    hasValue(values.landkode) &&
                    !countryIsMemberOfEøsOrEfta(values.landkode);

                return (
                    <Form.Form
                        onCancel={onCancel}
                        fieldErrorRenderer={(error) => commonFieldErrorRenderer(intl, error)}>
                        <Systemtittel tag="h1">
                            <FormattedMessage id="utenlandsopphold.form.tittel" />
                        </Systemtittel>
                        <Box margin="l">
                            <Form.DateIntervalPicker
                                legend={intlHelper(intl, 'utenlandsopphold.form.tidsperiode.spm')}
                                fromDatepickerProps={{
                                    name: UtenlandsoppholdFormFields.fom,
                                    label: intlHelper(intl, 'utenlandsopphold.form.tidsperiode.fraDato'),
                                    fullscreenOverlay: true,
                                    dateLimitations: {
                                        minDato: minDate,
                                        maksDato: values.tom || maxDate
                                    },
                                    validate: (date: Date) =>
                                        dateRangeValidation.validateFromDate(date, minDate, maxDate, values.tom)
                                }}
                                toDatepickerProps={{
                                    name: UtenlandsoppholdFormFields.tom,
                                    label: intlHelper(intl, 'utenlandsopphold.form.tidsperiode.tilDato'),
                                    fullscreenOverlay: true,
                                    dateLimitations: {
                                        minDato: values.fom || minDate,
                                        maksDato: maxDate
                                    },
                                    validate: (date: Date) =>
                                        dateRangeValidation.validateToDate(date, minDate, maxDate, values.fom)
                                }}
                            />
                        </Box>

                        <Box margin="l">
                            <Form.CountrySelect
                                name={UtenlandsoppholdFormFields.landkode}
                                label={intlHelper(intl, 'utenlandsopphold.form.land.spm')}
                                validate={validateRequiredSelect}
                            />
                        </Box>

                        {showInnlagtQuestion && values.landkode && (
                            <>
                                <Box margin="m">
                                    <Form.YesOrNoQuestion
                                        name={UtenlandsoppholdFormFields.erBarnetInnlagt}
                                        legend={intlHelper(intl, 'utenlandsopphold.form.erBarnetInnlagt.spm', {
                                            land: getCountryName(values.landkode, intl.locale)
                                        })}
                                        validate={validateYesOrNoIsAnswered}
                                    />
                                </Box>
                                {values.erBarnetInnlagt === YesOrNo.YES && (
                                    <>
                                        <Form.RadioPanelGroup
                                            legend={intlHelper(intl, 'utenlandsopphold.form.årsak.spm', {
                                                land: getCountryName(values.landkode, intl.locale)
                                            })}
                                            name={UtenlandsoppholdFormFields.årsak}
                                            validate={validateRequiredField}
                                            radios={[
                                                {
                                                    value: UtenlandsoppholdÅrsak.INNLAGT_DEKKET_NORGE,
                                                    label: intlHelper(
                                                        intl,
                                                        `utenlandsopphold.form.årsak.${UtenlandsoppholdÅrsak.INNLAGT_DEKKET_NORGE}`
                                                    )
                                                },
                                                {
                                                    value: UtenlandsoppholdÅrsak.INNLAGT_DEKKET_ANNET_LAND,
                                                    label: intlHelper(
                                                        intl,
                                                        `utenlandsopphold.form.årsak.${UtenlandsoppholdÅrsak.INNLAGT_DEKKET_ANNET_LAND}`,
                                                        { land: getCountryName(values.landkode, intl.locale) }
                                                    )
                                                },
                                                {
                                                    value: UtenlandsoppholdÅrsak.ANNET,
                                                    label: intlHelper(
                                                        intl,
                                                        `utenlandsopphold.form.årsak.${UtenlandsoppholdÅrsak.ANNET}`
                                                    )
                                                }
                                            ]}
                                        />
                                    </>
                                )}
                            </>
                        )}
                    </Form.Form>
                );
            }}
        />
    );
};

export default UtenlandsoppholdForm;
