import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { getTypedFormComponents, ISOStringToDate } from '@navikt/sif-common-formik/lib';
import {
    getDateRangeValidator,
    getRequiredFieldValidator,
    ValidateDateError,
    ValidateDateInRangeError,
    ValidateRequiredFieldError,
} from '@navikt/sif-common-formik/lib/validation';
import { Systemtittel } from 'nav-frontend-typografi';
import { getIntlFormErrorRenderer, mapFomTomToDateRange } from '../utils';
import bostedUtlandUtils from './bostedUtlandUtils';
import { BostedUtland, BostedUtlandFormValues } from './types';
import { prettifyDate } from '@navikt/sif-common-core/lib/utils/dateUtils';

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
        [ValidateDateInRangeError.fromDateIsAfterToDate]: 'bostedUtlandForm.fom.fromDateIsAfterToDate',
    },
    [BostedUtlandFormFields.tom]: {
        [ValidateRequiredFieldError.noValue]: 'bostedUtlandForm.tom.noValue',
        [ValidateDateError.dateAfterMax]: 'bostedUtlandForm.tom.dateAfterMax',
        [ValidateDateError.dateBeforeMin]: 'bostedUtlandForm.tom.dateBeforeMin',
        [ValidateDateError.invalidDateFormat]: 'bostedUtlandForm.tom.invalidDateFormat',
        [ValidateDateInRangeError.toDateIsBeforeFromDate]: 'bostedUtlandForm.tom.toDateIsBeforeFromDate',
    },
    [BostedUtlandFormFields.landkode]: {
        [ValidateRequiredFieldError.noValue]: 'bostedUtlandForm.landkode.noValue',
    },
};

const Form = getTypedFormComponents<BostedUtlandFormFields, BostedUtlandFormValues>();

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
                    <Form.Form onCancel={onCancel} fieldErrorRenderer={getIntlFormErrorRenderer(intl)}>
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
                                    validate: getDateRangeValidator.validateFromDate(
                                        {
                                            required: true,
                                            min: fomDateLimits.minDate,
                                            max: fomDateLimits.maxDate,
                                            toDate: ISOStringToDate(values.tom),
                                        },
                                        {
                                            noValue: BostedUtlandFormErrors.fom.noValue,
                                            dateBeforeMin: () =>
                                                intlHelper(intl, BostedUtlandFormErrors.fom.dateBeforeMin, {
                                                    dato: prettifyDate(fomDateLimits.minDate),
                                                }),
                                            invalidDateFormat: BostedUtlandFormErrors.fom.invalidDateFormat,
                                            dateAfterMax: () =>
                                                intlHelper(intl, BostedUtlandFormErrors.fom.dateAfterMax, {
                                                    dato: prettifyDate(fomDateLimits.maxDate),
                                                }),

                                            fromDateIsAfterToDate: BostedUtlandFormErrors.fom.fromDateIsAfterToDate,
                                        }
                                    ),
                                }}
                                toInputProps={{
                                    name: BostedUtlandFormFields.tom,
                                    label: intlHelper(intl, 'bostedUtland.form.tidsperiode.tilDato'),
                                    validate: getDateRangeValidator.validateToDate(
                                        {
                                            required: true,
                                            min: tomDateLimits.minDate,
                                            max: tomDateLimits.maxDate,
                                            fromDate: ISOStringToDate(values.fom),
                                        },
                                        {
                                            noValue: BostedUtlandFormErrors.tom.noValue,
                                            dateBeforeMin: BostedUtlandFormErrors.tom.dateBeforeMin,
                                            invalidDateFormat: BostedUtlandFormErrors.tom.invalidDateFormat,
                                            dateAfterMax: BostedUtlandFormErrors.tom.dateAfterMax,
                                            toDateIsBeforeFromDate: BostedUtlandFormErrors.tom.toDateIsBeforeFromDate,
                                        }
                                    ),
                                }}
                            />
                        </FormBlock>
                        <FormBlock>
                            <Form.CountrySelect
                                name={BostedUtlandFormFields.landkode}
                                label={intlHelper(intl, 'bostedUtland.form.land.spm')}
                                validate={getRequiredFieldValidator({
                                    noValue: BostedUtlandFormErrors.landkode.noValue,
                                })}
                            />
                        </FormBlock>
                    </Form.Form>
                );
            }}
        />
    );
};

export default BostedUtlandForm;
