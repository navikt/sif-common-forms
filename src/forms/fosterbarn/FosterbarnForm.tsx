/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import Tiles from '@navikt/sif-common-core/lib/components/tiles/Tiles';
import { commonFieldErrorRenderer } from '@navikt/sif-common-core/lib/utils/commonFieldErrorRenderer';
import { validateFødselsnummer, validateRequiredField } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { getTypedFormComponents } from '@navikt/sif-common-formik/lib';
import { Systemtittel } from 'nav-frontend-typografi';
import { Fosterbarn, isFosterbarn } from './types';

interface Props {
    fosterbarn?: Partial<Fosterbarn>;
    onSubmit: (values: Fosterbarn) => void;
    onCancel: () => void;
    includeName?: boolean;
    text?: FosterbarnFormText;
}

interface FosterbarnFormText {
    form_fødselsnummer_label: string;
    form_fornavn_label: string;
    form_etternavn_label: string;
}

const defaultText: FosterbarnFormText = {
    form_etternavn_label: 'Etternavn',
    form_fornavn_label: 'Fornavn',
    form_fødselsnummer_label: 'Fødselsnummer',
};

enum FosterbarnFormField {
    fødselsnummer = 'fødselsnummer',
    fornavn = 'fornavn',
    etternavn = 'etternavn',
}

type FormValues = Partial<Fosterbarn>;

const Form = getTypedFormComponents<FosterbarnFormField, FormValues>();

const FosterbarnForm = ({
    fosterbarn: initialValues = { fornavn: '', etternavn: '', fødselsnummer: '' },
    text,
    includeName,
    onSubmit,
    onCancel,
}: Props) => {
    const intl = useIntl();
    const onFormikSubmit = (formValues: FormValues) => {
        if (isFosterbarn(formValues, includeName)) {
            onSubmit(formValues);
        } else {
            throw new Error('Fosterbarn skjema: Formvalues is not a valid Fosterbarn on submit.');
        }
    };

    const txt = { ...defaultText, ...text };

    return (
        <>
            <Form.FormikWrapper
                initialValues={initialValues}
                onSubmit={onFormikSubmit}
                renderForm={() => (
                    <Form.Form
                        onCancel={onCancel}
                        fieldErrorRenderer={(error) => commonFieldErrorRenderer(intl, error)}>
                        <Systemtittel tag="h1">Fosterbarn</Systemtittel>
                        <FormBlock>
                            <Form.Input
                                name={FosterbarnFormField.fødselsnummer}
                                label={txt.form_fødselsnummer_label}
                                validate={validateFødselsnummer}
                                inputMode="numeric"
                                maxLength={11}
                                style={{ width: '11rem' }}
                            />
                        </FormBlock>
                        {includeName && (
                            <Tiles columns={2}>
                                <FormBlock>
                                    <Form.Input
                                        name={FosterbarnFormField.fornavn}
                                        label={txt.form_fornavn_label}
                                        validate={validateRequiredField}
                                    />
                                </FormBlock>
                                <FormBlock>
                                    <Form.Input
                                        name={FosterbarnFormField.etternavn}
                                        label={txt.form_etternavn_label}
                                        validate={validateRequiredField}
                                    />
                                </FormBlock>
                            </Tiles>
                        )}
                    </Form.Form>
                )}
            />
        </>
    );
};

export default FosterbarnForm;