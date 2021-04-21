import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { countryIsMemberOfEøsOrEfta } from '@navikt/sif-common-core/lib/utils/countryUtils';
import { dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import {
    getFieldErrorRenderer,
    getSummaryFieldErrorRenderer,
} from '@navikt/sif-common-formik/lib/utils/formikErrorRenderUtils';
import { DateRange, getCountryName, ISOStringToDate, YesOrNo } from '@navikt/sif-common-formik';
import { getTypedFormComponents } from '@navikt/sif-common-formik/lib';
import {
    getDateRangeValidator,
    getListValidator,
    getRequiredFieldValidator,
    getYesOrNoValidator,
    ValidateDateError,
    ValidateDateInRangeError,
    ValidateListError,
    ValidateRequiredFieldError,
    ValidateYesOrNoError,
} from '@navikt/sif-common-formik/lib/validation';
import { hasValue } from '@navikt/sif-common-formik/lib/validation/validationUtils';
import { Systemtittel } from 'nav-frontend-typografi';
import TidsperiodeListAndDialog from '../tidsperiode/TidsperiodeListAndDialog';
import { mapFomTomToDateRange } from '../utils';
import { Utenlandsopphold, UtenlandsoppholdFormValues, UtenlandsoppholdÅrsak } from './types';
import utils from './utenlandsoppholdUtils';

interface Props {
    minDate: Date;
    maxDate: Date;
    opphold?: Utenlandsopphold;
    alleOpphold?: Utenlandsopphold[];
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

export const UtlandsoppholdFormErrorKeys = {
    fields: {
        [UtenlandsoppholdFormFields.fom]: [
            ...Object.keys(ValidateDateError),
            ValidateDateInRangeError.fromDateIsAfterToDate,
        ],
        [UtenlandsoppholdFormFields.tom]: [
            ...Object.keys(ValidateDateError),
            ValidateDateInRangeError.toDateIsBeforeFromDate,
        ],
        [UtenlandsoppholdFormFields.landkode]: Object.keys(ValidateRequiredFieldError),
        [UtenlandsoppholdFormFields.årsak]: Object.keys(ValidateRequiredFieldError),
        [UtenlandsoppholdFormFields.erBarnetInnlagt]: Object.keys(ValidateYesOrNoError),
        [UtenlandsoppholdFormFields.barnInnlagtPerioder]: [
            ValidateListError.listIsEmpty,
            ValidateListError.listHasTooFewItems,
        ],
    },
};

const defaultFormValues: UtenlandsoppholdFormValues = {
    fom: undefined,
    tom: undefined,
    landkode: undefined,
    erBarnetInnlagt: YesOrNo.UNANSWERED,
    barnInnlagtPerioder: [],
    årsak: undefined,
};

export const UtenlandsoppholdFormName = 'utenlandsoppholdForm';

const Form = getTypedFormComponents<UtenlandsoppholdFormFields, UtenlandsoppholdFormValues>();

const UtenlandsoppholdForm = ({ maxDate, minDate, opphold, alleOpphold = [], onSubmit, onCancel }: Props) => {
    const intl = useIntl();

    const onFormikSubmit = (formValues: Partial<UtenlandsoppholdFormValues>) => {
        const utenlandsoppholdToSubmit = utils.mapFormValuesToUtenlandsopphold(formValues, opphold?.id);
        if (utils.isValidUtenlandsopphold(utenlandsoppholdToSubmit)) {
            onSubmit({
                ...utenlandsoppholdToSubmit,
                årsak: countryIsMemberOfEøsOrEfta(utenlandsoppholdToSubmit.landkode) ? undefined : formValues.årsak,
            });
        } else {
            throw new Error('UtenlandsoppholdForm: Formvalues is not a valid Utenlandsopphold on submit.');
        }
    };

    const registrerteTidsperioder: DateRange[] | undefined =
        opphold === undefined
            ? alleOpphold.map(mapFomTomToDateRange)
            : alleOpphold.filter((o) => o.id !== opphold.id).map(mapFomTomToDateRange);

    const initialValues = opphold ? utils.mapUtenlandsoppholdToFormValues(opphold) : defaultFormValues;
    return (
        <Form.FormikWrapper
            initialValues={initialValues}
            onSubmit={onFormikSubmit}
            renderForm={(formik) => {
                const {
                    values: { fom, tom, landkode, erBarnetInnlagt, barnInnlagtPerioder = [], årsak },
                } = formik;

                const hasDateStringValues = hasValue(fom) && hasValue(tom);
                const fomDate = ISOStringToDate(fom);
                const tomDate = ISOStringToDate(tom);

                const includeInnlagtPerioderQuestion =
                    hasDateStringValues && landkode !== undefined && erBarnetInnlagt === YesOrNo.YES;

                const includeInnlagtQuestion: boolean =
                    landkode !== undefined && hasValue(landkode) && !countryIsMemberOfEøsOrEfta(landkode);

                const showÅrsakQuestion = barnInnlagtPerioder.length > 0;

                const areAllQuestionsAnswered: boolean =
                    hasDateStringValues && landkode !== undefined && includeInnlagtQuestion === false
                        ? true
                        : erBarnetInnlagt !== YesOrNo.UNANSWERED &&
                          (erBarnetInnlagt === YesOrNo.YES
                              ? barnInnlagtPerioder.length > 0 && årsak !== undefined
                              : true);

                return (
                    <Form.Form
                        includeButtons={areAllQuestionsAnswered}
                        onCancel={onCancel}
                        fieldErrorRenderer={getFieldErrorRenderer(intl, UtenlandsoppholdFormName)}
                        summaryFieldErrorRenderer={getSummaryFieldErrorRenderer(intl, UtenlandsoppholdFormName)}>
                        <Systemtittel tag="h1">
                            <FormattedMessage id="utenlandsopphold.form.tittel" />
                        </Systemtittel>
                        <FormBlock>
                            <Form.DateRangePicker
                                legend={intlHelper(intl, 'utenlandsopphold.form.tidsperiode.spm')}
                                fullscreenOverlay={true}
                                disabledDateRanges={registrerteTidsperioder}
                                minDate={minDate}
                                maxDate={maxDate}
                                fromInputProps={{
                                    name: UtenlandsoppholdFormFields.fom,
                                    label: intlHelper(intl, 'utenlandsopphold.form.tidsperiode.fraDato'),
                                    dayPickerProps: {
                                        initialMonth: fomDate || minDate || dateToday,
                                    },
                                    validate: getDateRangeValidator.validateFromDate({
                                        required: true,
                                        min: minDate,
                                        max: maxDate,
                                        toDate: ISOStringToDate(tom),
                                    }),
                                }}
                                toInputProps={{
                                    name: UtenlandsoppholdFormFields.tom,
                                    label: intlHelper(intl, 'utenlandsopphold.form.tidsperiode.tilDato'),
                                    dayPickerProps: {
                                        initialMonth: tomDate || fomDate || dateToday,
                                    },
                                    validate: getDateRangeValidator.validateToDate({
                                        required: true,
                                        min: minDate,
                                        max: maxDate,
                                        fromDate: ISOStringToDate(fom),
                                    }),
                                }}
                            />
                        </FormBlock>
                        {hasDateStringValues && (
                            <FormBlock>
                                <Form.CountrySelect
                                    name={UtenlandsoppholdFormFields.landkode}
                                    label={intlHelper(intl, 'utenlandsopphold.form.land.spm')}
                                    validate={getRequiredFieldValidator()}
                                />
                            </FormBlock>
                        )}

                        {includeInnlagtQuestion && landkode && hasDateStringValues && (
                            <>
                                <FormBlock>
                                    <Form.YesOrNoQuestion
                                        name={UtenlandsoppholdFormFields.erBarnetInnlagt}
                                        legend={intlHelper(intl, 'utenlandsopphold.form.erBarnetInnlagt.spm', {
                                            land: getCountryName(landkode, intl.locale),
                                        })}
                                        validate={getYesOrNoValidator()}
                                    />
                                </FormBlock>
                                {includeInnlagtPerioderQuestion && (
                                    <FormBlock margin="l">
                                        <TidsperiodeListAndDialog
                                            name={UtenlandsoppholdFormFields.barnInnlagtPerioder}
                                            minDate={ISOStringToDate(fom)}
                                            maxDate={ISOStringToDate(tom)}
                                            validate={getListValidator({ required: true })}
                                            formTitle={intlHelper(
                                                intl,
                                                'utenlandsopphold.form.perioderBarnetErInnlag.formTitle'
                                            )}
                                            labels={{
                                                addLabel: intlHelper(
                                                    intl,
                                                    'utenlandsopphold.form.perioderBarnetErInnlag.addLabel'
                                                ),
                                                modalTitle: intlHelper(
                                                    intl,
                                                    'utenlandsopphold.form.perioderBarnetErInnlag.modalTitle'
                                                ),
                                                listTitle: intlHelper(
                                                    intl,
                                                    'utenlandsopphold.form.perioderBarnetErInnlag.listTitle'
                                                ),
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
                                                validate={getRequiredFieldValidator()}
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
