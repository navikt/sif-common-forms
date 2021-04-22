import React from 'react';
import { useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { getTypedFormComponents, ISOStringToDate } from '@navikt/sif-common-formik/lib';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import {
    getDateRangeValidator,
    ValidateDateError,
    ValidateDateInRangeError,
    ValidateRequiredFieldError,
} from '@navikt/sif-common-formik/lib/validation';
import { Systemtittel } from 'nav-frontend-typografi';
import { getIntlFormErrorRenderer, mapFomTomToDateRange } from '../utils';
import tidsperiodeUtils from './tidsperiodeUtils';
import { DateTidsperiode, DateTidsperiodeFormValues } from './types';

export interface TidsperiodeFormLabels {
    title?: string;
    fromDate: string;
    toDate: string;
    intervalTitle?: string;
    okButton: string;
    cancelButton: string;
}

interface Props {
    minDate?: Date;
    maxDate?: Date;
    tidsperiode?: Partial<DateTidsperiode>;
    alleTidsperioder?: DateTidsperiode[];
    formLabels?: Partial<TidsperiodeFormLabels>;
    onSubmit: (values: DateTidsperiode) => void;
    onCancel: () => void;
}

enum TidsperiodeFormFields {
    tom = 'tom',
    fom = 'fom',
}

export const TidsperiodeFormErrors = {
    [TidsperiodeFormFields.fom]: {
        [ValidateRequiredFieldError.noValue]: 'tidsperiodeForm.fom.noValue',
        [ValidateDateInRangeError.fromDateIsAfterToDate]: 'tidsperiodeForm.fom.fromDateIsAfterToDate',
        [ValidateDateError.invalidDateFormat]: 'tidsperiodeForm.fom.invalidDateFormat',
        [ValidateDateError.dateBeforeMin]: 'tidsperiodeForm.fom.dateBeforeMin',
        [ValidateDateError.dateAfterMax]: 'tidsperiodeForm.fom.dateAfterMax',
    },
    [TidsperiodeFormFields.tom]: {
        [ValidateRequiredFieldError.noValue]: 'tidsperiodeForm.tom.noValue',
        [ValidateDateInRangeError.toDateIsBeforeFromDate]: 'tidsperiodeForm.tom.toDateIsBeforeFromDate',
        [ValidateDateError.invalidDateFormat]: 'tidsperiodeForm.tom.invalidDateFormat',
        [ValidateDateError.dateBeforeMin]: 'tidsperiodeForm.tom.dateBeforeMin',
        [ValidateDateError.dateAfterMax]: 'tidsperiodeForm.tom.dateAfterMax',
    },
};

const Form = getTypedFormComponents<TidsperiodeFormFields, DateTidsperiodeFormValues>();

const TidsperiodeForm = ({
    maxDate,
    minDate,
    formLabels,
    tidsperiode,
    alleTidsperioder = [],
    onSubmit,
    onCancel,
}: Props) => {
    const intl = useIntl();

    const onFormikSubmit = (formValues: DateTidsperiodeFormValues) => {
        const dateTidsperiodeToSubmit = tidsperiodeUtils.mapFormValuesToDateTidsperiode(formValues, tidsperiode?.id);
        if (tidsperiodeUtils.isValidDateTidsperiode(dateTidsperiodeToSubmit)) {
            onSubmit(dateTidsperiodeToSubmit);
        } else {
            throw new Error('TidsperiodeForm: Formvalues is not a valid Tidsperiode on submit.');
        }
    };

    const defaultLabels: TidsperiodeFormLabels = {
        title: intlHelper(intl, 'tidsperiode.form.title'),
        fromDate: intlHelper(intl, 'tidsperiode.form.fromDate'),
        toDate: intlHelper(intl, 'tidsperiode.form.toDate'),
        okButton: intlHelper(intl, 'tidsperiode.form.okButton'),
        cancelButton: intlHelper(intl, 'tidsperiode.form.cancelButton'),
    };

    const inlineLabels: TidsperiodeFormLabels = { ...defaultLabels, ...formLabels };

    return (
        <>
            <Form.FormikWrapper
                initialValues={tidsperiodeUtils.mapDateTidsperiodeToFormValues(tidsperiode || {})}
                onSubmit={onFormikSubmit}
                renderForm={(formik) => {
                    const {
                        values: { fom },
                    } = formik;
                    const initialMonth = datepickerUtils.getDateFromDateString(fom) || minDate;
                    const disabledDateRanges =
                        tidsperiode === undefined
                            ? alleTidsperioder.map(mapFomTomToDateRange)
                            : alleTidsperioder.filter((t) => t.id !== tidsperiode.id).map(mapFomTomToDateRange);

                    return (
                        <Form.Form onCancel={onCancel} fieldErrorRenderer={getIntlFormErrorRenderer(intl)}>
                            <Systemtittel tag="h1">{inlineLabels.title}</Systemtittel>
                            <FormBlock>
                                <Form.DateRangePicker
                                    legend={inlineLabels.intervalTitle}
                                    fullscreenOverlay={true}
                                    minDate={minDate}
                                    maxDate={maxDate}
                                    disabledDateRanges={disabledDateRanges}
                                    fromInputProps={{
                                        label: inlineLabels.fromDate,
                                        name: TidsperiodeFormFields.fom,
                                        dayPickerProps: { initialMonth },
                                        validate: getDateRangeValidator.validateFromDate(
                                            {
                                                required: true,
                                                min: minDate,
                                                max: maxDate,
                                                toDate: ISOStringToDate(formik.values.tom),
                                            },
                                            {
                                                noValue: TidsperiodeFormErrors.fom.noValue,
                                                dateAfterMax: TidsperiodeFormErrors.fom.dateAfterMax,
                                                dateBeforeMin: TidsperiodeFormErrors.fom.dateBeforeMin,
                                                invalidDateFormat: TidsperiodeFormErrors.fom.invalidDateFormat,
                                                fromDateIsAfterToDate: TidsperiodeFormErrors.fom.fromDateIsAfterToDate,
                                            }
                                        ),
                                        onChange: () => {
                                            setTimeout(() => {
                                                formik.validateField(TidsperiodeFormFields.tom);
                                            });
                                        },
                                    }}
                                    toInputProps={{
                                        label: inlineLabels.toDate,
                                        name: TidsperiodeFormFields.tom,
                                        validate: getDateRangeValidator.validateToDate(
                                            {
                                                required: true,
                                                min: minDate,
                                                max: maxDate,
                                                fromDate: ISOStringToDate(formik.values.fom),
                                            },
                                            {
                                                noValue: TidsperiodeFormErrors.tom.noValue,
                                                dateAfterMax: TidsperiodeFormErrors.tom.dateAfterMax,
                                                dateBeforeMin: TidsperiodeFormErrors.tom.dateBeforeMin,
                                                invalidDateFormat: TidsperiodeFormErrors.tom.invalidDateFormat,
                                                toDateIsBeforeFromDate:
                                                    TidsperiodeFormErrors.tom.toDateIsBeforeFromDate,
                                            }
                                        ),
                                        onChange: () => {
                                            setTimeout(() => {
                                                formik.validateField(TidsperiodeFormFields.fom);
                                            });
                                        },
                                    }}
                                />
                            </FormBlock>
                        </Form.Form>
                    );
                }}
            />
        </>
    );
};

export default TidsperiodeForm;
