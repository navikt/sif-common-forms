import React from 'react';
import { useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { commonFieldErrorRenderer } from '@navikt/sif-common-core/lib/utils/commonFieldErrorRenderer';
import dateRangeValidation from '@navikt/sif-common-core/lib/validation/dateRangeValidation';
import { getTypedFormComponents } from '@navikt/sif-common-formik/lib';
import { Systemtittel } from 'nav-frontend-typografi';
import { FraværDateRange, FraværPeriode, isFraværPeriode } from './types';
import { validateNotHelgedag } from './fraværUtilities';
import { validateAll } from './fraværValidationUtils';

export interface FraværPeriodeFormLabels {
    title: string;
    intervalTitle: string;
    fromDate: string;
    toDate: string;
    okButton: string;
    cancelButton: string;
}

interface Props {
    fraværPeriode?: Partial<FraværPeriode>;
    minDate: Date;
    maxDate: Date;
    dateRangesToDisable?: FraværDateRange[];
    helgedagerIkkeTillat?: boolean;
    labels?: Partial<FraværPeriodeFormLabels>;
    onSubmit: (values: FraværPeriode) => void;
    onCancel: () => void;
}

const defaultLabels: FraværPeriodeFormLabels = {
    title: 'Periode med fravær',
    intervalTitle: 'Velg tidsrom',
    fromDate: 'Fra og med',
    toDate: 'Til og med',
    okButton: 'Ok',
    cancelButton: 'Avbryt',
};

enum FraværPeriodeFormFields {
    tom = 'tom',
    fom = 'fom',
}

type FormValues = Partial<FraværPeriode>;

const Form = getTypedFormComponents<FraværPeriodeFormFields, FormValues>();

const FraværPeriodeForm: React.FunctionComponent<Props> = ({
    fraværPeriode: initialValues = { fom: undefined, tom: undefined },
    maxDate,
    minDate,
    dateRangesToDisable,
    helgedagerIkkeTillat,
    labels,
    onSubmit,
    onCancel,
}) => {
    const intl = useIntl();
    const onFormikSubmit = (formValues: FormValues) => {
        if (isFraværPeriode(formValues)) {
            onSubmit(formValues);
        } else {
            throw new Error('FraværPeriodeForm: Formvalues is not a valid FraværPeriode on submit.');
        }
    };

    const formLabels: FraværPeriodeFormLabels = { ...defaultLabels, ...labels };

    return (
        <>
            <Form.FormikWrapper
                initialValues={initialValues}
                onSubmit={onFormikSubmit}
                renderForm={(formik) => (
                    <Form.Form
                        onCancel={onCancel}
                        fieldErrorRenderer={(error) => commonFieldErrorRenderer(intl, error)}>
                        <Systemtittel tag="h1">{formLabels.title}</Systemtittel>
                        <FormBlock>
                            <Form.DateIntervalPicker
                                legend={formLabels.intervalTitle}
                                fromDatepickerProps={{
                                    label: formLabels.fromDate,
                                    name: FraværPeriodeFormFields.fom,
                                    fullscreenOverlay: true,
                                    dateLimitations: {
                                        minDato: minDate,
                                        maksDato: maxDate || formik.values.tom,
                                        helgedagerIkkeTillatt: helgedagerIkkeTillat || false,
                                        ugyldigeTidsperioder: dateRangesToDisable,
                                    },
                                    validate: validateAll([
                                        ...(helgedagerIkkeTillat ? [validateNotHelgedag] : []),
                                        (date: Date) =>
                                            dateRangeValidation.validateFromDate(
                                                date,
                                                minDate,
                                                maxDate,
                                                formik.values.tom
                                            ),
                                    ]),
                                    onChange: () => {
                                        setTimeout(() => {
                                            formik.validateField(FraværPeriodeFormFields.tom);
                                        });
                                    },
                                }}
                                toDatepickerProps={{
                                    label: formLabels.toDate,
                                    name: FraværPeriodeFormFields.tom,
                                    fullscreenOverlay: true,
                                    dateLimitations: {
                                        minDato: minDate || formik.values.fom,
                                        maksDato: maxDate,
                                        helgedagerIkkeTillatt: helgedagerIkkeTillat || false,
                                        ugyldigeTidsperioder: dateRangesToDisable,
                                    },
                                    validate: validateAll([
                                        ...(helgedagerIkkeTillat ? [validateNotHelgedag] : []),
                                        (date: Date) =>
                                            dateRangeValidation.validateToDate(
                                                date,
                                                minDate,
                                                maxDate,
                                                formik.values.fom
                                            ),
                                    ]),
                                    onChange: () => {
                                        setTimeout(() => {
                                            formik.validateField(FraværPeriodeFormFields.fom);
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

export default FraværPeriodeForm;
