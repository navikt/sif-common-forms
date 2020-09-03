import React from 'react';
import { useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { AnnetBarn, isAnnetBarn } from './types';
import { getTypedFormComponents } from '@navikt/sif-common-formik/lib';
import { Systemtittel } from 'nav-frontend-typografi';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { commonFieldErrorRenderer } from '@navikt/sif-common-core/lib/utils/commonFieldErrorRenderer';
import { validateFødselsnummer, validateRequiredField } from '@navikt/sif-common-core/lib/validation/fieldValidations';

export interface AnnetBarnFormLabels {
    title: string;
    fnr: string;
    navn: string;
    okButton: string;
    cancelButton: string;
}

interface Props {
    annetBarn?: Partial<AnnetBarn>;
    labels?: Partial<AnnetBarnFormLabels>;
    onSubmit: (values: AnnetBarn) => void;
    onCancel: () => void;
}

enum AnnetBarnFormFields {
    fnr = 'fnr',
    navn = 'navn',
}

type FormValues = Partial<AnnetBarn>;

const Form = getTypedFormComponents<AnnetBarnFormFields, FormValues>();

const AnnetBarnForm = ({ annetBarn: annetBarn = { fnr: '', navn: '' }, labels, onSubmit, onCancel }: Props) => {
    const intl = useIntl();
    const onFormikSubmit = (formValues: FormValues) => {
        if (isAnnetBarn(formValues)) {
            onSubmit(formValues);
        } else {
            throw new Error('AnnetbarnForm: Formvalues is not a valid Annetbarn on submit.');
        }
    };

    const defaultLabels: AnnetBarnFormLabels = {
        title: intlHelper(intl, 'annetbarn.form.title'),
        fnr: intlHelper(intl, 'annetbarn.form.fnr'),
        navn: intlHelper(intl, 'annetbarn.form.navn'),
        okButton: intlHelper(intl, 'annetbarn.form.okButton'),
        cancelButton: intlHelper(intl, 'annetbarn.form.cancelButton'),
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
                                name={AnnetBarnFormFields.fnr}
                                label={formLabels.fnr}
                                validate={validateFødselsnummer}
                                inputMode="numeric"
                                maxLength={11}
                            />
                        </FormBlock>
                        <FormBlock>
                            <Form.Input
                                name={AnnetBarnFormFields.navn}
                                label={formLabels.navn}
                                validate={validateRequiredField}
                            />
                        </FormBlock>
                    </Form.Form>
                )}
            />
        </>
    );
};

export default AnnetBarnForm;
