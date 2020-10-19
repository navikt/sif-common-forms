import React from 'react';
import { useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { commonFieldErrorRenderer } from '@navikt/sif-common-core/lib/utils/commonFieldErrorRenderer';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import {
    validateAll,
    validateDateInRange,
    validateFødselsnummer,
    validateRequiredField,
} from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { getTypedFormComponents } from '@navikt/sif-common-formik/lib';
import { Systemtittel } from 'nav-frontend-typografi';
import { AnnetBarn, isAnnetBarn } from './types';

export interface AnnetBarnFormLabels {
    title: string;
    fnr: string;
    placeholderFnr?: string;
    fødselsdato: string;
    navn: string;
    placeholderNavn?: string;
    okButton: string;
    cancelButton: string;
    aldersGrenseText?: string;
}

interface Props {
    annetBarn?: Partial<AnnetBarn>;
    labels?: Partial<AnnetBarnFormLabels>;
    minDate: Date;
    maxDate: Date;
    onSubmit: (values: AnnetBarn) => void;
    onCancel: () => void;
}

enum AnnetBarnFormFields {
    fnr = 'fnr',
    fødselsdato = 'fødselsdato',
    navn = 'navn',
}

type FormValues = Partial<AnnetBarn>;

const Form = getTypedFormComponents<AnnetBarnFormFields, FormValues>();

const AnnetBarnForm = ({
    annetBarn = { fnr: '', navn: '', fødselsdato: undefined },
    labels,
    minDate,
    maxDate,
    onSubmit,
    onCancel,
}: Props) => {
    const intl = useIntl();
    const onFormikSubmit = (formValues: FormValues) => {
        if (isAnnetBarn(formValues)) {
            onSubmit(formValues);
        } else {
            throw new Error('AnnetBarnForm: Formvalues is not a valid AnnetBarn on submit.');
        }
    };

    const defaultLabels: AnnetBarnFormLabels = {
        title: intlHelper(intl, 'annetBarn.form.title'),
        fnr: intlHelper(intl, 'annetBarn.form.fnr'),
        fødselsdato: intlHelper(intl, 'annetBarn.form.fødselsdato'),
        navn: intlHelper(intl, 'annetBarn.form.navn'),
        okButton: intlHelper(intl, 'annetBarn.form.okButton'),
        cancelButton: intlHelper(intl, 'annetBarn.form.cancelButton'),
    };

    const formLabels: AnnetBarnFormLabels = { ...defaultLabels, ...labels };

    return (
        <>
            <Form.FormikWrapper
                initialValues={annetBarn}
                onSubmit={onFormikSubmit}
                renderForm={() => (
                    <Form.Form
                        onCancel={onCancel}
                        fieldErrorRenderer={(error) => commonFieldErrorRenderer(intl, error)}>
                        <Systemtittel tag="h1">{formLabels.title}</Systemtittel>
                        <FormBlock>
                            <Form.Input
                                name={AnnetBarnFormFields.navn}
                                label={formLabels.navn}
                                validate={validateRequiredField}
                                placeholder={formLabels.placeholderNavn}
                            />
                        </FormBlock>
                        <FormBlock>
                            <Form.DatePicker
                                name={AnnetBarnFormFields.fødselsdato}
                                label={
                                    formLabels.aldersGrenseText
                                        ? `${formLabels.fødselsdato} ${formLabels.aldersGrenseText}`
                                        : `${formLabels.fødselsdato}`
                                }
                                validate={validateAll([
                                    validateRequiredField,
                                    validateDateInRange({ from: minDate, to: maxDate }),
                                ])}
                                maxDate={maxDate}
                                minDate={minDate}
                                showYearSelector={true}
                            />
                        </FormBlock>
                        <FormBlock>
                            <Form.Input
                                name={AnnetBarnFormFields.fnr}
                                label={formLabels.fnr}
                                validate={validateAll([validateRequiredField, validateFødselsnummer])}
                                inputMode="numeric"
                                maxLength={11}
                                placeholder={formLabels.placeholderFnr}
                            />
                        </FormBlock>
                    </Form.Form>
                )}
            />
        </>
    );
};

export default AnnetBarnForm;
