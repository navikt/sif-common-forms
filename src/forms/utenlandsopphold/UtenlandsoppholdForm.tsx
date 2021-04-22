import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { countryIsMemberOfEøsOrEfta } from '@navikt/sif-common-core/lib/utils/countryUtils';
import { dateToday, prettifyDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
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
import { getIntlFormErrorRenderer, mapFomTomToDateRange } from '../utils';
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

export const UtlandsoppholdFormErrors = {
    [UtenlandsoppholdFormFields.fom]: {
        [ValidateRequiredFieldError.noValue]: 'utenlandsoppholdForm.fom.noValue',
        [ValidateDateInRangeError.fromDateIsAfterToDate]: 'utenlandsoppholdForm.fom.fromDateIsAfterToDate',
        [ValidateDateError.invalidDateFormat]: 'utenlandsoppholdForm.fom.invalidDateFormat',
        [ValidateDateError.dateBeforeMin]: 'utenlandsoppholdForm.fom.dateBeforeMin',
        [ValidateDateError.dateAfterMax]: 'utenlandsoppholdForm.fom.dateAfterMax',
    },
    [UtenlandsoppholdFormFields.tom]: {
        [ValidateRequiredFieldError.noValue]: 'utenlandsoppholdForm.tom.noValue',
        [ValidateDateInRangeError.toDateIsBeforeFromDate]: 'utenlandsoppholdForm.tom.toDateIsBeforeFromDate',
        [ValidateDateError.invalidDateFormat]: 'utenlandsoppholdForm.tom.invalidDateFormat',
        [ValidateDateError.dateBeforeMin]: 'utenlandsoppholdForm.tom.dateBeforeMin',
        [ValidateDateError.dateAfterMax]: 'utenlandsoppholdForm.tom.dateAfterMax',
    },
    [UtenlandsoppholdFormFields.landkode]: {
        [ValidateRequiredFieldError.noValue]: 'utenlandsoppholdForm.landkode.noValue',
    },
    [UtenlandsoppholdFormFields.årsak]: { [ValidateRequiredFieldError.noValue]: 'utenlandsoppholdForm.årsak.noValue' },
    [UtenlandsoppholdFormFields.erBarnetInnlagt]: {
        [ValidateYesOrNoError.yesOrNoIsUnanswered]: 'utenlandsoppholdForm.erBarnetInnlagt.yesOrNoIsUnanswered',
    },
    [UtenlandsoppholdFormFields.barnInnlagtPerioder]: {
        [ValidateListError.listIsEmpty]: 'utenlandsoppholdForm.barnInnlagtPerioder.listIsEmpty',
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
                    values: { fom, tom, landkode, erBarnetInnlagt, barnInnlagtPerioder = [] },
                } = formik;

                const hasDateStringValues = hasValue(fom) && hasValue(tom);
                const fomDate = ISOStringToDate(fom);
                const tomDate = ISOStringToDate(tom);

                const includeInnlagtPerioderQuestion =
                    hasDateStringValues && landkode !== undefined && erBarnetInnlagt === YesOrNo.YES;

                const includeInnlagtQuestion: boolean =
                    landkode !== undefined && hasValue(landkode) && !countryIsMemberOfEøsOrEfta(landkode);

                const showÅrsakQuestion = barnInnlagtPerioder.length > 0;

                return (
                    <Form.Form
                        includeButtons={true}
                        onCancel={onCancel}
                        fieldErrorRenderer={getIntlFormErrorRenderer(intl)}>
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
                                    validate: getDateRangeValidator.validateFromDate(
                                        {
                                            required: true,
                                            min: minDate,
                                            max: maxDate,
                                            toDate: ISOStringToDate(tom),
                                        },
                                        {
                                            noValue: UtlandsoppholdFormErrors.fom.noValue,
                                            dateBeforeMin: () =>
                                                intlHelper(intl, UtlandsoppholdFormErrors.fom.dateBeforeMin, {
                                                    dato: prettifyDate(minDate),
                                                }),
                                            dateAfterMax: () =>
                                                intlHelper(intl, UtlandsoppholdFormErrors.fom.dateAfterMax, {
                                                    dato: prettifyDate(maxDate),
                                                }),
                                            invalidDateFormat: UtlandsoppholdFormErrors.fom.invalidDateFormat,
                                            fromDateIsAfterToDate: UtlandsoppholdFormErrors.fom.fromDateIsAfterToDate,
                                        }
                                    ),
                                }}
                                toInputProps={{
                                    name: UtenlandsoppholdFormFields.tom,
                                    label: intlHelper(intl, 'utenlandsopphold.form.tidsperiode.tilDato'),
                                    dayPickerProps: {
                                        initialMonth: tomDate || fomDate || dateToday,
                                    },
                                    validate: getDateRangeValidator.validateToDate(
                                        {
                                            required: true,
                                            min: minDate,
                                            max: maxDate,
                                            fromDate: ISOStringToDate(fom),
                                        },
                                        {
                                            noValue: UtlandsoppholdFormErrors.tom.noValue,
                                            dateBeforeMin: () =>
                                                intlHelper(intl, UtlandsoppholdFormErrors.tom.dateBeforeMin, {
                                                    dato: prettifyDate(minDate),
                                                }),
                                            dateAfterMax: () =>
                                                intlHelper(intl, UtlandsoppholdFormErrors.tom.dateAfterMax, {
                                                    dato: prettifyDate(maxDate),
                                                }),
                                            invalidDateFormat: UtlandsoppholdFormErrors.tom.invalidDateFormat,
                                            toDateIsBeforeFromDate: UtlandsoppholdFormErrors.tom.toDateIsBeforeFromDate,
                                        }
                                    ),
                                }}
                            />
                        </FormBlock>
                        {hasDateStringValues && (
                            <FormBlock>
                                <Form.CountrySelect
                                    name={UtenlandsoppholdFormFields.landkode}
                                    label={intlHelper(intl, 'utenlandsopphold.form.land.spm')}
                                    validate={getRequiredFieldValidator({
                                        noValue: UtlandsoppholdFormErrors.landkode.noValue,
                                    })}
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
                                        validate={getYesOrNoValidator({
                                            yesOrNoIsUnanswered:
                                                UtlandsoppholdFormErrors.erBarnetInnlagt.yesOrNoIsUnanswered,
                                        })}
                                    />
                                </FormBlock>
                                {includeInnlagtPerioderQuestion && (
                                    <FormBlock margin="l">
                                        <TidsperiodeListAndDialog
                                            name={UtenlandsoppholdFormFields.barnInnlagtPerioder}
                                            minDate={ISOStringToDate(fom)}
                                            maxDate={ISOStringToDate(tom)}
                                            validate={getListValidator(
                                                { required: true },
                                                {
                                                    listIsEmpty:
                                                        UtlandsoppholdFormErrors.barnInnlagtPerioder.listIsEmpty,
                                                }
                                            )}
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
                                                validate={getRequiredFieldValidator({
                                                    noValue: UtlandsoppholdFormErrors.årsak.noValue,
                                                })}
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
