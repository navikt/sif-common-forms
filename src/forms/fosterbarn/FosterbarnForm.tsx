import React from 'react';
import { useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import Tiles from '@navikt/sif-common-core/lib/components/tiles/Tiles';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { getTypedFormComponents } from '@navikt/sif-common-formik/lib';
import {
    getFødselsnummerValidator,
    getRequiredFieldValidator,
    ValidateFødselsnummerError,
    ValidateRequiredFieldError,
} from '@navikt/sif-common-formik/lib/validation';
import { guid } from 'nav-frontend-js-utils';
import { Systemtittel } from 'nav-frontend-typografi';
import { Fosterbarn, isFosterbarn } from './types';
import { getIntlFormErrorRenderer } from '../utils';

interface FosterbarnFormText {
    form_fødselsnummer_label: string;
    form_fornavn_label: string;
    form_etternavn_label: string;
}

interface Props {
    fosterbarn?: Partial<Fosterbarn>;
    onSubmit: (values: Fosterbarn) => void;
    onCancel: () => void;
    disallowedFødselsnumre?: string[];
    includeName?: boolean;
    text?: FosterbarnFormText;
}

enum FosterbarnFormField {
    fødselsnummer = 'fødselsnummer',
    fornavn = 'fornavn',
    etternavn = 'etternavn',
}

type FormValues = Partial<Fosterbarn>;

export const FosterbarnFormErrors = {
    [FosterbarnFormField.fornavn]: { [ValidateRequiredFieldError.noValue]: 'fosterbarnForm.fornavn.noValue' },
    [FosterbarnFormField.etternavn]: { [ValidateRequiredFieldError.noValue]: 'fosterbarnForm.etternavn.noValue' },
    [FosterbarnFormField.fødselsnummer]: {
        [ValidateRequiredFieldError.noValue]: 'fosterbarnForm.fødselsnummer.noValue',
        [ValidateFødselsnummerError.disallowedFødselsnummer]: 'fosterbarnForm.fødselsnummer.disallowedFødselsnummer',
        [ValidateFødselsnummerError.fødselsnummerNot11Chars]: 'fosterbarnForm.fødselsnummer.fødselsnummerNot11Chars',
        [ValidateFødselsnummerError.invalidFødselsnummer]: 'fosterbarnForm.fødselsnummer.invalidFødselsnummer',
    },
};

const Form = getTypedFormComponents<FosterbarnFormField, FormValues>();

const FosterbarnForm = ({
    fosterbarn: initialValues = { fornavn: '', etternavn: '', fødselsnummer: '' },
    disallowedFødselsnumre,
    text,
    includeName,
    onSubmit,
    onCancel,
}: Props) => {
    const intl = useIntl();
    const onFormikSubmit = (formValues: FormValues) => {
        if (isFosterbarn(formValues, includeName)) {
            onSubmit({ ...formValues, id: initialValues.id || guid() });
        } else {
            throw new Error('Fosterbarn skjema: Formvalues is not a valid Fosterbarn on submit.');
        }
    };

    const defaultText: FosterbarnFormText = {
        form_etternavn_label: intlHelper(intl, 'fosterbarn.form.etternavn_label'),
        form_fornavn_label: intlHelper(intl, 'fosterbarn.form.fornavn_label'),
        form_fødselsnummer_label: intlHelper(intl, 'fosterbarn.form.fødselsnummer_label'),
    };

    const txt = { ...defaultText, ...text };

    return (
        <>
            <Form.FormikWrapper
                initialValues={initialValues}
                onSubmit={onFormikSubmit}
                renderForm={() => (
                    <Form.Form onCancel={onCancel} fieldErrorRenderer={getIntlFormErrorRenderer(intl)}>
                        <Systemtittel tag="h1">Fosterbarn</Systemtittel>
                        <FormBlock>
                            <Form.Input
                                name={FosterbarnFormField.fødselsnummer}
                                label={txt.form_fødselsnummer_label}
                                validate={getFødselsnummerValidator(
                                    {
                                        required: true,
                                        disallowedValues: disallowedFødselsnumre,
                                    },
                                    {
                                        noValue: FosterbarnFormErrors.fødselsnummer.noValue,
                                        disallowedFødselsnummer:
                                            FosterbarnFormErrors.fødselsnummer.disallowedFødselsnummer,
                                        invalidFødselsnummer: FosterbarnFormErrors.fødselsnummer.invalidFødselsnummer,
                                        fødselsnummerNot11Chars:
                                            FosterbarnFormErrors.fødselsnummer.fødselsnummerNot11Chars,
                                    }
                                )}
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
                                        validate={getRequiredFieldValidator({
                                            noValue: FosterbarnFormErrors.fornavn.noValue,
                                        })}
                                    />
                                </FormBlock>
                                <FormBlock>
                                    <Form.Input
                                        name={FosterbarnFormField.etternavn}
                                        label={txt.form_etternavn_label}
                                        validate={getRequiredFieldValidator({
                                            noValue: FosterbarnFormErrors.etternavn.noValue,
                                        })}
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
