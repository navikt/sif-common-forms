import React from 'react';
import { useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { commonFieldErrorRenderer } from '@navikt/sif-common-core/lib/utils/commonFieldErrorRenderer';
import dateRangeValidation from '@navikt/sif-common-core/lib/validation/dateRangeValidation';
import { getTypedFormComponents } from '@navikt/sif-common-formik/lib';
import { Systemtittel } from 'nav-frontend-typografi';
import { DateTidsperiodeFormValues, DateTidsperiode } from './types';
import { mapFomTomToDateRange } from '../utils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import tidsperiodeUtils from './tidsperiodeUtils';
import { FormikDatepickerValue } from '@navikt/sif-common-core/lib/validation/types';

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
                    const validateFromDate = (dateValue?: FormikDatepickerValue) => {
                        return dateRangeValidation.validateFromDate(
                            dateValue?.date,
                            minDate,
                            maxDate,
                            formik.values.tom?.date
                        );
                    };

                    const validateToDate = (dateValue?: FormikDatepickerValue) => {
                        return dateRangeValidation.validateToDate(
                            dateValue?.date,
                            minDate,
                            maxDate,
                            formik.values.tom?.date
                        );
                    };

                    const disabledDateRanges =
                        tidsperiode === undefined
                            ? alleTidsperioder.map(mapFomTomToDateRange)
                            : alleTidsperioder.filter((t) => t.id !== tidsperiode.id).map(mapFomTomToDateRange);

                    return (
                        <Form.Form
                            onCancel={onCancel}
                            fieldErrorRenderer={(error) => commonFieldErrorRenderer(intl, error)}>
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
                                        validate: validateFromDate,
                                        onChange: () => {
                                            setTimeout(() => {
                                                formik.validateField(TidsperiodeFormFields.tom);
                                            });
                                        },
                                    }}
                                    toInputProps={{
                                        label: inlineLabels.toDate,
                                        name: TidsperiodeFormFields.tom,
                                        validate: validateToDate,
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
