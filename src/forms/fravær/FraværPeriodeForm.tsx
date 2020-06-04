import React from 'react';
import { useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { commonFieldErrorRenderer } from '@navikt/sif-common-core/lib/utils/commonFieldErrorRenderer';
import dateRangeValidation from '@navikt/sif-common-core/lib/validation/dateRangeValidation';
import { getTypedFormComponents } from '@navikt/sif-common-formik/lib';
import { Systemtittel } from 'nav-frontend-typografi';
import { DateRangeToDisable, FraværPeriode, isFraværPeriode } from './types';

export interface FraværPeriodeFormLabels {
    title: string;
    fromDate: string;
    toDate: string;
    intervalTitle: string;
    okButton: string;
    cancelButton: string;
}

interface Props {
    fraværPeriode?: Partial<FraværPeriode>;
    minDate: Date;
    maxDate: Date;
    dateRangesToDisable?: DateRangeToDisable[];
    helgedagerIkkeTillat?: boolean;
    labels?: Partial<FraværPeriodeFormLabels>;
    onSubmit: (values: FraværPeriode) => void;
    onCancel: () => void;
}

const defaultLabels: FraværPeriodeFormLabels = {
    title: 'TODO: Tittel for FraværPeriodeForm', // TODO
    fromDate: 'Fra og med',
    toDate: 'Til og med',
    intervalTitle: 'Velg tidsrom',
    okButton: 'Ok',
    cancelButton: 'Avbryt'
};

enum FraværPeriodeFormFields {
    tom = 'tom',
    fom = 'fom'
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
    onCancel
}) => {
    const intl = useIntl();
    const onFormikSubmit = (formValues: FormValues) => {
        if (isFraværPeriode(formValues)) {
            onSubmit(formValues);
        } else {
            throw new Error('FerieuttakForm: Formvalues is not a valid Ferieuttak on submit.');
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
                                        ugyldigeTidsperioder: dateRangesToDisable
                                    },
                                    validate: (date: Date) =>
                                        dateRangeValidation.validateFromDate(date, minDate, maxDate, formik.values.tom),
                                    onChange: () => {
                                        setTimeout(() => {
                                            formik.validateField(FraværPeriodeFormFields.tom);
                                        });
                                    }
                                }}
                                toDatepickerProps={{
                                    label: formLabels.toDate,
                                    name: FraværPeriodeFormFields.tom,
                                    fullscreenOverlay: true,
                                    dateLimitations: {
                                        minDato: minDate || formik.values.fom,
                                        maksDato: maxDate
                                    },
                                    validate: (date: Date) =>
                                        dateRangeValidation.validateToDate(date, minDate, maxDate, formik.values.fom),
                                    onChange: () => {
                                        setTimeout(() => {
                                            formik.validateField(FraværPeriodeFormFields.fom);
                                        });
                                    }
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
