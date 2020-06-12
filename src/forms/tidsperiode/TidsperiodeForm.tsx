import React from 'react';
import { useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { commonFieldErrorRenderer } from '@navikt/sif-common-core/lib/utils/commonFieldErrorRenderer';
import dateRangeValidation from '@navikt/sif-common-core/lib/validation/dateRangeValidation';
import { getTypedFormComponents } from '@navikt/sif-common-formik/lib';
import { Systemtittel } from 'nav-frontend-typografi';
import { isDateTidsperiode, DateTidsperiode } from './types';
import { mapFomTomToDateRange } from '../utils';

export interface TidsperiodeFormLabels {
    title?: string;
    fromDate: string;
    toDate: string;
    intervalTitle?: string;
    okButton: string;
    cancelButton: string;
}

interface Props {
    minDate: Date;
    maxDate: Date;
    tidsperiode?: Partial<DateTidsperiode>;
    alleTidsperioder?: DateTidsperiode[];
    formLabels?: Partial<TidsperiodeFormLabels>;
    onSubmit: (values: DateTidsperiode) => void;
    onCancel: () => void;
}

const defaultLabels: TidsperiodeFormLabels = {
    title: 'Tidsperiode',
    fromDate: 'Fra og med',
    toDate: 'Til og med',
    okButton: 'Ok',
    cancelButton: 'Avbryt',
};

enum TidsperiodeFormFields {
    tom = 'tom',
    fom = 'fom',
}

type FormValues = Partial<DateTidsperiode>;

const Form = getTypedFormComponents<TidsperiodeFormFields, FormValues>();

const TidsperiodeForm = ({
    maxDate,
    minDate,
    formLabels,
    tidsperiode = { fom: undefined, tom: undefined },
    alleTidsperioder = [],
    onSubmit,
    onCancel,
}: Props) => {
    const intl = useIntl();
    const onFormikSubmit = (formValues: FormValues) => {
        if (isDateTidsperiode(formValues)) {
            onSubmit(formValues);
        } else {
            throw new Error('TidsperiodeForm: Formvalues is not a valid Tidsperiode on submit.');
        }
    };

    const inlineLabels: TidsperiodeFormLabels = { ...defaultLabels, ...formLabels };

    return (
        <>
            <Form.FormikWrapper
                initialValues={tidsperiode}
                onSubmit={onFormikSubmit}
                renderForm={(formik) => {
                    const validateFromDate = (date: Date) => {
                        return dateRangeValidation.validateFromDate(date, minDate, maxDate, formik.values.tom);
                    };

                    const validateToDate = (date: Date) => {
                        return dateRangeValidation.validateToDate(date, minDate, maxDate, formik.values.tom);
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
