import React from 'react';
import { useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import Tiles from '@navikt/sif-common-core/lib/components/tiles/Tiles';
import {
    commonFieldErrorRenderer
} from '@navikt/sif-common-core/lib/utils/commonFieldErrorRenderer';
import {
    validateFødselsnummer, validateRequiredField
} from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { getTypedFormComponents } from '@navikt/sif-common-formik/lib';
import { Systemtittel } from 'nav-frontend-typografi';
import { FosterbarnTextsNb } from './i18n/fosterbarnText';
import { FosterbarnTextKeys as FosterbarnTexts } from './i18n/fosterbarnTextKeys';
import { Fosterbarn, isFosterbarn } from './types';

interface Props {
    fosterbarn?: Partial<Fosterbarn>;
    onSubmit: (values: Fosterbarn) => void;
    onCancel: () => void;
    text?: FosterbarnTexts;
}

enum FosterbarnFormField {
    fødselsnummer = 'fødselsnummer',
    fornavn = 'fornavn',
    etternavn = 'etternavn'
}

type FormValues = Partial<Fosterbarn>;

const Form = getTypedFormComponents<FosterbarnFormField, FormValues>();

const FosterbarnForm: React.FunctionComponent<Props> = ({
    fosterbarn: initialValues = { fornavn: '', etternavn: '', fødselsnummer: '' },
    text,
    onSubmit,
    onCancel
}) => {
    const intl = useIntl();
    const onFormikSubmit = (formValues: FormValues) => {
        if (isFosterbarn(formValues)) {
            onSubmit(formValues);
        } else {
            throw new Error('Fosterbarn skjema: Formvalues is not a valid Fosterbarn on submit.');
        }
    };

    const txt = { ...FosterbarnTextsNb, ...text };

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
                    </Form.Form>
                )}
            />
        </>
    );
};

export default FosterbarnForm;
