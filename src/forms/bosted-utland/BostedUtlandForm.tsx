import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { getTypedFormComponents, ISOStringToDate } from '@navikt/sif-common-formik/lib';
import {
    getDateRangeValidator,
    getRequiredFieldValidator,
    ValidateDateError,
    ValidateDateRangeError,
    ValidateRequiredFieldError,
} from '@navikt/sif-common-formik/lib/validation';
import getFormErrorHandler from '@navikt/sif-common-formik/lib/validation/intlFormErrorHandler';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import { Systemtittel } from 'nav-frontend-typografi';
import { handleDateRangeValidationError, mapFomTomToDateRange } from '../utils';
import bostedUtlandUtils from './bostedUtlandUtils';
import { BostedUtland, BostedUtlandFormValues } from './types';

export interface BostedUtlandFormLabels {
    tittel: string;
}

interface Props {
    minDate: Date;
    maxDate: Date;
    bosted?: BostedUtland;
    alleBosteder?: BostedUtland[];
    onSubmit: (values: BostedUtland) => void;
    onCancel: () => void;
}

enum BostedUtlandFormFields {
    fom = 'fom',
    tom = 'tom',
    landkode = 'landkode',
}

interface DateLimits {
    minDate: Date;
    maxDate: Date;
}

export const BostedUtlandFormErrors = {
    [BostedUtlandFormFields.fom]: {
        [ValidateRequiredFieldError.noValue]: 'bostedUtlandForm.fom.noValue',
        [ValidateDateError.dateAfterMax]: 'bostedUtlandForm.fom.dateAfterMax',
        [ValidateDateError.dateBeforeMin]: 'bostedUtlandForm.fom.dateBeforeMin',
        [ValidateDateError.invalidDateFormat]: 'bostedUtlandForm.fom.invalidDateFormat',
        [ValidateDateRangeError.fromDateIsAfterToDate]: 'bostedUtlandForm.fom.fromDateIsAfterToDate',
    },
    [BostedUtlandFormFields.tom]: {
        [ValidateRequiredFieldError.noValue]: 'bostedUtlandForm.tom.noValue',
        [ValidateDateError.dateAfterMax]: 'bostedUtlandForm.tom.dateAfterMax',
        [ValidateDateError.dateBeforeMin]: 'bostedUtlandForm.tom.dateBeforeMin',
        [ValidateDateError.invalidDateFormat]: 'bostedUtlandForm.tom.invalidDateFormat',
        [ValidateDateRangeError.toDateIsBeforeFromDate]: 'bostedUtlandForm.tom.toDateIsBeforeFromDate',
    },
    [BostedUtlandFormFields.landkode]: {
        [ValidateRequiredFieldError.noValue]: 'bostedUtlandForm.landkode.noValue',
    },
};

const Form = getTypedFormComponents<BostedUtlandFormFields, BostedUtlandFormValues, ValidationError>();

const BostedUtlandForm = ({ maxDate, minDate, bosted, alleBosteder = [], onSubmit, onCancel }: Props) => {
    const intl = useIntl();

    const onFormikSubmit = (formValues: BostedUtlandFormValues) => {
        const bostedToSubmit = bostedUtlandUtils.mapFormValuesToBostedUtland(formValues, bosted?.id);
        if (bostedUtlandUtils.isValidBostedUtland(bostedToSubmit)) {
            onSubmit(bostedToSubmit);
        } else {
            throw new Error('BostedUtlandForm: Formvalues is not a valid BostedUtland on submit.');
        }
    };

    return (
        <Form.FormikWrapper
            initialValues={bostedUtlandUtils.mapBostedUtlandToFormValues(bosted || {})}
            onSubmit={onFormikSubmit}
            renderForm={(formik) => {
                const { values } = formik;
                const fomDateLimits: DateLimits = {
                    minDate,
                    maxDate: ISOStringToDate(values.tom) || maxDate,
                };
                const tomDateLimits: DateLimits = {
                    minDate: ISOStringToDate(values.fom) || minDate,
                    maxDate: maxDate,
                };

                const andreBosteder =
                    bosted === undefined
                        ? alleBosteder.map(mapFomTomToDateRange)
                        : alleBosteder.filter((b) => b.id !== bosted.id).map(mapFomTomToDateRange);

                return (
                    <Form.Form onCancel={onCancel} formErrorHandler={getFormErrorHandler(intl, 'bostedUtlandForm')}>
                        <Systemtittel tag="h1">
                            <FormattedMessage id="bostedUtland.form.tittel" />
                        </Systemtittel>

                        <FormBlock>
                            <Form.DateRangePicker
                                legend={intlHelper(intl, 'bostedUtland.form.tidsperiode.spm')}
                                fullscreenOverlay={true}
                                minDate={minDate}
                                maxDate={maxDate}
                                allowRangesToStartAndStopOnSameDate={false}
                                disabledDateRanges={andreBosteder}
                                fromInputProps={{
                                    name: BostedUtlandFormFields.fom,
                                    label: intlHelper(intl, 'bostedUtland.form.tidsperiode.fraDato'),
                                    validate: (value) => {
                                        const error = getDateRangeValidator.validateFromDate({
                                            required: true,
                                            min: fomDateLimits.minDate,
                                            max: fomDateLimits.maxDate,
                                            toDate: ISOStringToDate(values.tom),
                                        })(value);
                                        return handleDateRangeValidationError(
                                            error,
                                            fomDateLimits.minDate,
                                            fomDateLimits.maxDate
                                        );
                                    },
                                }}
                                toInputProps={{
                                    name: BostedUtlandFormFields.tom,
                                    label: intlHelper(intl, 'bostedUtland.form.tidsperiode.tilDato'),
                                    validate: (value) => {
                                        const error = getDateRangeValidator.validateToDate({
                                            required: true,
                                            min: tomDateLimits.minDate,
                                            max: tomDateLimits.maxDate,
                                            fromDate: ISOStringToDate(values.fom),
                                        })(value);
                                        return handleDateRangeValidationError(
                                            error,
                                            tomDateLimits.minDate,
                                            tomDateLimits.maxDate
                                        );
                                    },
                                }}
                            />
                        </FormBlock>
                        <FormBlock>
                            <Form.CountrySelect
                                name={BostedUtlandFormFields.landkode}
                                label={intlHelper(intl, 'bostedUtland.form.land.spm')}
                                validate={getRequiredFieldValidator()}
                            />
                        </FormBlock>
                    </Form.Form>
                );
            }}
        />
    );
};

export default BostedUtlandForm;
