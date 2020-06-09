import React from 'react';
import { useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { commonFieldErrorRenderer } from '@navikt/sif-common-core/lib/utils/commonFieldErrorRenderer';
import dateRangeValidation from '@navikt/sif-common-core/lib/validation/dateRangeValidation';
import { getTypedFormComponents } from '@navikt/sif-common-formik/lib';
import { Systemtittel } from 'nav-frontend-typografi';
import { Tidsperiode, isTidsperiode } from './types';

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
    tidsperiode?: Partial<Tidsperiode>;
    formLabels?: Partial<TidsperiodeFormLabels>;
    onSubmit: (values: Tidsperiode) => void;
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

type FormValues = Partial<Tidsperiode>;

const Form = getTypedFormComponents<TidsperiodeFormFields, FormValues>();

const TidsperiodeForm = ({
    maxDate,
    minDate,
    formLabels,
    tidsperiode: initialValues = { fom: undefined, tom: undefined },
    onSubmit,
    onCancel,
}: Props) => {
    const intl = useIntl();
    const onFormikSubmit = (formValues: FormValues) => {
        if (isTidsperiode(formValues)) {
            onSubmit(formValues);
        } else {
            throw new Error('TidsperiodeForm: Formvalues is not a valid Tidsperiode on submit.');
        }
    };

    const inlineLabels: TidsperiodeFormLabels = { ...defaultLabels, ...formLabels };

    return (
        <>
            <Form.FormikWrapper
                initialValues={initialValues}
                onSubmit={onFormikSubmit}
                renderForm={(formik) => (
                    <Form.Form
                        onCancel={onCancel}
                        fieldErrorRenderer={(error) => commonFieldErrorRenderer(intl, error)}>
                        <Systemtittel tag="h1">{inlineLabels.title}</Systemtittel>
                        <FormBlock>
                            <Form.DateIntervalPicker
                                legend={inlineLabels.intervalTitle}
                                fromDatepickerProps={{
                                    label: inlineLabels.fromDate,
                                    name: TidsperiodeFormFields.fom,
                                    fullscreenOverlay: true,
                                    dateLimitations: {
                                        minDato: minDate,
                                        maksDato: maxDate || formik.values.tom,
                                    },
                                    validate: (date: Date) =>
                                        dateRangeValidation.validateFromDate(date, minDate, maxDate, formik.values.tom),
                                    onChange: () => {
                                        setTimeout(() => {
                                            formik.validateField(TidsperiodeFormFields.tom);
                                        });
                                    },
                                }}
                                toDatepickerProps={{
                                    label: inlineLabels.toDate,
                                    name: TidsperiodeFormFields.tom,
                                    fullscreenOverlay: true,
                                    dateLimitations: {
                                        minDato: minDate || formik.values.fom,
                                        maksDato: maxDate,
                                    },
                                    validate: (date: Date) =>
                                        dateRangeValidation.validateToDate(date, minDate, maxDate, formik.values.fom),
                                    onChange: () => {
                                        setTimeout(() => {
                                            formik.validateField(TidsperiodeFormFields.fom);
                                        });
                                    },
                                }}
                            />
                        </FormBlock>
                    </Form.Form>
                )}
            />
        </>
    );
};

export default TidsperiodeForm;
