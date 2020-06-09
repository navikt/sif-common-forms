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
    validateRequiredList,
} from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { hasValue } from '@navikt/sif-common-core/lib/validation/hasValue';
import { getCountryName, YesOrNo } from '@navikt/sif-common-formik';
import { getTypedFormComponents } from '@navikt/sif-common-formik/lib';
import { Systemtittel } from 'nav-frontend-typografi';
import { isUtenlandsoppholdType, Utenlandsopphold, UtenlandsoppholdÅrsak } from './types';
import TidsperiodeListAndDialog from '../tidsperiode/TidsperiodeListAndDialog';

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
    barnInnlagtPerioder = 'barnInnlagtPerioder',
}

const defaultFormValues: Partial<Utenlandsopphold> = {
    fom: undefined,
    tom: undefined,
    landkode: undefined,
    erBarnetInnlagt: YesOrNo.UNANSWERED,
    barnInnlagtPerioder: [],
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
                const {
                    values: { fom, tom, landkode, erBarnetInnlagt, barnInnlagtPerioder = [], årsak },
                } = formik;

                const fromDateLimitations = {
                    minDato: minDate,
                    maksDato: tom || maxDate,
                };

                const toDateLimitations = {
                    minDato: fom || minDate,
                    maksDato: maxDate,
                };

                const includeInnlagtPerioderQuestion =
                    fom !== undefined && tom !== undefined && landkode !== undefined && erBarnetInnlagt === YesOrNo.YES;

                const includeInnlagtQuestion: boolean =
                    landkode !== undefined && hasValue(landkode) && !countryIsMemberOfEøsOrEfta(landkode);

                const showÅrsakQuestion = barnInnlagtPerioder.length > 0;

                const areAllQuestionsAnswered: boolean =
                    fom !== undefined &&
                    tom !== undefined &&
                    landkode !== undefined &&
                    erBarnetInnlagt !== YesOrNo.UNANSWERED &&
                    (erBarnetInnlagt === YesOrNo.YES ? barnInnlagtPerioder.length > 0 && årsak !== undefined : true);

                return (
                    <Form.Form
                        includeButtons={areAllQuestionsAnswered}
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
                                            tom
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
                                            fom
                                        ),
                                }}
                            />
                        </FormBlock>
                        {fom !== undefined && tom !== undefined && (
                            <FormBlock>
                                <Form.CountrySelect
                                    name={UtenlandsoppholdFormFields.landkode}
                                    label={intlHelper(intl, 'utenlandsopphold.form.land.spm')}
                                    validate={validateRequiredSelect}
                                />
                            </FormBlock>
                        )}

                        {includeInnlagtQuestion && landkode && fom && tom && (
                            <>
                                <FormBlock>
                                    <Form.YesOrNoQuestion
                                        name={UtenlandsoppholdFormFields.erBarnetInnlagt}
                                        legend={intlHelper(intl, 'utenlandsopphold.form.erBarnetInnlagt.spm', {
                                            land: getCountryName(landkode, intl.locale),
                                        })}
                                        validate={validateYesOrNoIsAnswered}
                                    />
                                </FormBlock>
                                {includeInnlagtPerioderQuestion && (
                                    <FormBlock margin="l">
                                        <TidsperiodeListAndDialog
                                            name={UtenlandsoppholdFormFields.barnInnlagtPerioder}
                                            minDate={fom}
                                            maxDate={tom}
                                            validate={validateRequiredList}
                                            formTitle="Periode barnet er innlagt"
                                            labels={{
                                                addLabel: 'Legg til periode',
                                                modalTitle: 'Periode barnet er innlagt',
                                                listTitle: 'Periode(r) barnet er innlagt',
                                            }}
                                        />
                                    </FormBlock>
                                )}
                                {showÅrsakQuestion && (
                                    <>
                                        <FormBlock>
                                            <Form.RadioPanelGroup
                                                legend={intlHelper(intl, 'utenlandsopphold.form.årsak.spm', {
                                                    land: getCountryName(landkode, intl.locale),
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
                                                            { land: getCountryName(landkode, intl.locale) }
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
