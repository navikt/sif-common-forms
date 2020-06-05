import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { commonFieldErrorRenderer } from '@navikt/sif-common-core/lib/utils/commonFieldErrorRenderer';
import { countryIsMemberOfEøsOrEfta } from '@navikt/sif-common-core/lib/utils/countryUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import dateRangeValidation from '@navikt/sif-common-core/lib/validation/dateRangeValidation';
import {
    validateRequiredField,
    validateRequiredSelect,
    validateYesOrNoIsAnswered,
} from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { hasValue } from '@navikt/sif-common-core/lib/validation/hasValue';
import { getCountryName, YesOrNo } from '@navikt/sif-common-formik';
import { getTypedFormComponents } from '@navikt/sif-common-formik/lib';
import { Systemtittel } from 'nav-frontend-typografi';
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
    erBarnetInnlagt = 'erBarnetInnlagt',
}

const defaultFormValues: Partial<Utenlandsopphold> = {
    fom: undefined,
    tom: undefined,
    landkode: undefined,
    erBarnetInnlagt: YesOrNo.UNANSWERED,
    årsak: undefined,
};

type FormValues = Partial<Utenlandsopphold>;

const Form = getTypedFormComponents<UtenlandsoppholdFormFields, FormValues>();

const UtenlandsoppholdForm = ({ maxDate, minDate, opphold: initialValues, onSubmit, onCancel }: Props) => {
    const intl = useIntl();

    const onFormikSubmit = (formValues: Partial<Utenlandsopphold>) => {
        if (isUtenlandsoppholdType(formValues)) {
            onSubmit({
                ...formValues,
                årsak: countryIsMemberOfEøsOrEfta(formValues.landkode) ? undefined : formValues.årsak,
            });
        } else {
            throw new Error('UtenlandsoppholdForm: Formvalues is not a valid Utenlandsopphold on submit.');
        }
    };

    return (
        <Form.FormikWrapper
            initialValues={initialValues || defaultFormValues}
            onSubmit={onFormikSubmit}
            renderForm={(formik) => {
                const { values } = formik;
                const showInnlagtQuestion: boolean =
                    values.landkode !== undefined &&
                    hasValue(values.landkode) &&
                    !countryIsMemberOfEøsOrEfta(values.landkode);

                const fromDateLimitations = {
                    minDato: minDate,
                    maksDato: values.tom || maxDate,
                };

                const toDateLimitations = {
                    minDato: values.fom || minDate,
                    maksDato: maxDate,
                };

                return (
                    <Form.Form
                        onCancel={onCancel}
                        fieldErrorRenderer={(error) => commonFieldErrorRenderer(intl, error)}>
                        <Systemtittel tag="h1">
                            <FormattedMessage id="utenlandsopphold.form.tittel" />
                        </Systemtittel>
                        <FormBlock>
                            <Form.DateIntervalPicker
                                legend={intlHelper(intl, 'utenlandsopphold.form.tidsperiode.spm')}
                                fromDatepickerProps={{
                                    name: UtenlandsoppholdFormFields.fom,
                                    label: intlHelper(intl, 'utenlandsopphold.form.tidsperiode.fraDato'),
                                    fullscreenOverlay: true,
                                    dateLimitations: fromDateLimitations,
                                    validate: (date: Date) =>
                                        dateRangeValidation.validateFromDate(
                                            date,
                                            fromDateLimitations.minDato,
                                            fromDateLimitations.maksDato,
                                            values.tom
                                        ),
                                }}
                                toDatepickerProps={{
                                    name: UtenlandsoppholdFormFields.tom,
                                    label: intlHelper(intl, 'utenlandsopphold.form.tidsperiode.tilDato'),
                                    fullscreenOverlay: true,
                                    dateLimitations: toDateLimitations,
                                    validate: (date: Date) =>
                                        dateRangeValidation.validateToDate(
                                            date,
                                            toDateLimitations.minDato,
                                            toDateLimitations.maksDato,
                                            values.fom
                                        ),
                                }}
                            />
                        </FormBlock>

                        <FormBlock>
                            <Form.CountrySelect
                                name={UtenlandsoppholdFormFields.landkode}
                                label={intlHelper(intl, 'utenlandsopphold.form.land.spm')}
                                validate={validateRequiredSelect}
                            />
                        </FormBlock>

                        {showInnlagtQuestion && values.landkode && (
                            <>
                                <FormBlock>
                                    <Form.YesOrNoQuestion
                                        name={UtenlandsoppholdFormFields.erBarnetInnlagt}
                                        legend={intlHelper(intl, 'utenlandsopphold.form.erBarnetInnlagt.spm', {
                                            land: getCountryName(values.landkode, intl.locale),
                                        })}
                                        validate={validateYesOrNoIsAnswered}
                                    />
                                </FormBlock>
                                {values.erBarnetInnlagt === YesOrNo.YES && (
                                    <>
                                        <FormBlock>
                                            <Form.RadioPanelGroup
                                                legend={intlHelper(intl, 'utenlandsopphold.form.årsak.spm', {
                                                    land: getCountryName(values.landkode, intl.locale),
                                                })}
                                                name={UtenlandsoppholdFormFields.årsak}
                                                validate={validateRequiredField}
                                                radios={[
                                                    {
                                                        value: UtenlandsoppholdÅrsak.INNLAGT_DEKKET_NORGE,
                                                        label: intlHelper(
                                                            intl,
                                                            `utenlandsopphold.form.årsak.${UtenlandsoppholdÅrsak.INNLAGT_DEKKET_NORGE}`
                                                        ),
                                                    },
                                                    {
                                                        value: UtenlandsoppholdÅrsak.INNLAGT_DEKKET_ANNET_LAND,
                                                        label: intlHelper(
                                                            intl,
                                                            `utenlandsopphold.form.årsak.${UtenlandsoppholdÅrsak.INNLAGT_DEKKET_ANNET_LAND}`,
                                                            { land: getCountryName(values.landkode, intl.locale) }
                                                        ),
                                                    },
                                                    {
                                                        value: UtenlandsoppholdÅrsak.ANNET,
                                                        label: intlHelper(
                                                            intl,
                                                            `utenlandsopphold.form.årsak.${UtenlandsoppholdÅrsak.ANNET}`
                                                        ),
                                                    },
                                                ]}
                                            />
                                        </FormBlock>
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
