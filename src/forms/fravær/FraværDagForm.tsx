import React from 'react';
import { useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { commonFieldErrorRenderer } from '@navikt/sif-common-core/lib/utils/commonFieldErrorRenderer';
import { getTypedFormComponents } from '@navikt/sif-common-formik/lib';
import { Systemtittel } from 'nav-frontend-typografi';
import { DateRangeToDisable, FraværDag, isFraværDag } from './types';
import FraværTimerSelect from './FraværTimerSelect';
import { FormikDatepickerProps } from '@navikt/sif-common-formik/lib/components/formik-datepicker/FormikDatepicker';
import { validateRequiredField } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { validateAll, validateLessOrEqualTo } from './todo';

export interface FraværDagFormLabels {
    title: string;
    fromDate: string;
    toDate: string;
    intervalTitle: string;
    okButton: string;
    cancelButton: string;
}

interface Props {
    fraværDag?: Partial<FraværDag>;
    minDate: Date;
    maxDate: Date;
    dateRangesToDisable?: DateRangeToDisable[];
    helgedagerIkkeTillatt?: boolean;
    labels?: Partial<FraværDagFormLabels>;
    onSubmit: (values: FraværDag) => void;
    onCancel: () => void;
}

const defaultLabels: FraværDagFormLabels = {
    title: 'TODO: Tittel for FraværDagForm', // TODO
    fromDate: 'Fra og med',
    toDate: 'Til og med',
    intervalTitle: 'Velg tidsrom',
    okButton: 'Ok',
    cancelButton: 'Avbryt'
};

export enum FraværDagFormFields {
    dato = 'dato',
    timerArbeidsdag = 'timerArbeidsdag',
    timerFravær = 'timerFravær'
}

type FormValues = Partial<FraværDag>;

export const FraværDagForm = getTypedFormComponents<FraværDagFormFields, FormValues>();

const FraværDagFormView: React.FunctionComponent<Props> = ({
                                                               fraværDag: initialValues = {
                                                                   dato: undefined,
                                                                   timerArbeidsdag: undefined,
                                                                   timerFravær: undefined
                                                               },
                                                               maxDate,
                                                               minDate,
                                                               dateRangesToDisable,
                                                               helgedagerIkkeTillatt,
                                                               labels,
                                                               onSubmit,
                                                               onCancel
                                                           }) => {
    const intl = useIntl();
    const onFormikSubmit = (formValues: FormValues) => {
        if (isFraværDag(formValues)) {
            onSubmit(formValues);
        } else {
            throw new Error('FerieuttakForm: Formvalues is not a valid Ferieuttak on submit.');
        }
    };

    const formLabels: FraværDagFormLabels = { ...defaultLabels, ...labels };

    return (
        <>
            <FraværDagForm.FormikWrapper
                initialValues={initialValues}
                onSubmit={onFormikSubmit}
                renderForm={(formik) => {
                    const { values } = formik;
                    const datepickerProps: FormikDatepickerProps < FraværDagFormFields > = {
                        label: formLabels.fromDate,
                        name: FraværDagFormFields.dato,
                        fullscreenOverlay: true,
                        dateLimitations: {
                            minDato: minDate,
                            maksDato: maxDate,
                            helgedagerIkkeTillatt: helgedagerIkkeTillatt || false,
                            ugyldigeTidsperioder: dateRangesToDisable
                        },
                        validate: validateRequiredField,
                        onChange: () => {
                            setTimeout(() => {
                                formik.validateField(FraværDagFormFields.dato);
                            });
                        }
                    };

                    return (
                        <FraværDagForm.Form
                            onCancel={onCancel}
                            fieldErrorRenderer={(error) => commonFieldErrorRenderer(intl, error)}>
                            <Systemtittel tag="h1">{formLabels.title}</Systemtittel>
                            <FormBlock>
                                <FraværDagForm.DatePicker {...datepickerProps} />
                            </FormBlock>
                            <FormBlock>
                                <FraværTimerSelect name={FraværDagFormFields.timerArbeidsdag}
                                                   validate={validateRequiredField}/>
                            </FormBlock>
                            <FormBlock>
                                <FraværTimerSelect
                                    name={FraværDagFormFields.timerFravær}
                                    validate={validateAll([
                                        validateRequiredField,
                                        validateLessOrEqualTo(values.timerArbeidsdag)
                                    ])}/>
                            </FormBlock>
                        </FraværDagForm.Form>
                    );
                }}
            />
        </>
    );
};

export default FraværDagFormView;
