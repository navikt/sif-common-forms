import React from 'react';
import { useIntl } from 'react-intl';
import { getTypedFormComponents } from '@navikt/sif-common-formik/lib';
import { Systemtittel } from 'nav-frontend-typografi';
import Box from '@navikt/sif-common/lib/common/components/box/Box';
import {
    commonFieldErrorRenderer
} from '@navikt/sif-common/lib/common/utils/commonFieldErrorRenderer';
import dateRangeValidation from '@navikt/sif-common/lib/common/validation/dateRangeValidation';
import { Ferieuttak, isFerieuttak } from './types';

export interface FerieuttakFormLabels {
    title: string;
    fromDate: string;
    toDate: string;
    intervalTitle: string;
    okButton: string;
    cancelButton: string;
}

interface Props {
    minDate: Date;
    maxDate: Date;
    ferieuttak?: Partial<Ferieuttak>;
    labels?: Partial<FerieuttakFormLabels>;
    onSubmit: (values: Ferieuttak) => void;
    onCancel: () => void;
}

const defaultLabels: FerieuttakFormLabels = {
    title: 'Registrer uttak av ferie',
    fromDate: 'Fra og med',
    toDate: 'Til og med',
    intervalTitle: 'Velg tidsrom',
    okButton: 'Ok',
    cancelButton: 'Avbryt'
};

enum FerieuttakFormFields {
    tom = 'tom',
    fom = 'fom'
}

type FormValues = Partial<Ferieuttak>;

const Form = getTypedFormComponents<FerieuttakFormFields, FormValues>();

const FerieuttakForm: React.FunctionComponent<Props> = ({
    maxDate,
    minDate,
    labels,
    ferieuttak: initialValues = { fom: undefined, tom: undefined },
    onSubmit,
    onCancel
}) => {
    const intl = useIntl();
    const onFormikSubmit = (formValues: FormValues) => {
        if (isFerieuttak(formValues)) {
            onSubmit(formValues);
        } else {
            throw new Error('FerieuttakForm: Formvalues is not a valid Ferieuttak on submit.');
        }
    };

    const formLabels: FerieuttakFormLabels = { ...defaultLabels, ...labels };

    return (
        <>
            <Form.FormikWrapper
                initialValues={initialValues}
                onSubmit={onFormikSubmit}
                renderForm={(formik) => (
                    <Form.Form
                        onCancel={onCancel}
                        fieldErrorRenderer={(error) => commonFieldErrorRenderer(intl, error)}>
                        <Box padBottom="l">
                            <Systemtittel tag="h1">{formLabels.title}</Systemtittel>
                        </Box>
                        <Form.DateIntervalPicker
                            legend={formLabels.intervalTitle}
                            fromDatepickerProps={{
                                label: formLabels.fromDate,
                                name: FerieuttakFormFields.fom,
                                fullscreenOverlay: true,
                                dateLimitations: {
                                    minDato: minDate,
                                    maksDato: maxDate || formik.values.tom
                                },
                                validate: (date: Date) =>
                                    dateRangeValidation.validateFromDate(date, minDate, maxDate, formik.values.tom),
                                onChange: () => {
                                    setTimeout(() => {
                                        formik.validateField(FerieuttakFormFields.tom);
                                    });
                                }
                            }}
                            toDatepickerProps={{
                                label: formLabels.toDate,
                                name: FerieuttakFormFields.tom,
                                fullscreenOverlay: true,
                                dateLimitations: {
                                    minDato: minDate || formik.values.fom,
                                    maksDato: maxDate
                                },
                                validate: (date: Date) =>
                                    dateRangeValidation.validateToDate(date, minDate, maxDate, formik.values.fom),
                                onChange: () => {
                                    setTimeout(() => {
                                        formik.validateField(FerieuttakFormFields.fom);
                                    });
                                }
                            }}
                        />
                    </Form.Form>
                )}
            />
        </>
    );
};

export default FerieuttakForm;
