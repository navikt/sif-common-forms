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
    ValidateStringError,
} from '@navikt/sif-common-formik/lib/validation';
import getFormErrorHandler from '@navikt/sif-common-formik/lib/validation/intlFormErrorHandler';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import { guid } from 'nav-frontend-js-utils';
import { Systemtittel } from 'nav-frontend-typografi';
import { Fosterbarn, isFosterbarn } from './types';

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
    [FosterbarnFormField.fornavn]: {
        [ValidateStringError.stringHasNoValue]: 'fosterbarnForm.fornavn.stringHasNoValue',
    },
    [FosterbarnFormField.etternavn]: {
        [ValidateStringError.stringHasNoValue]: 'fosterbarnForm.etternavn.stringHasNoValue',
    },
    [FosterbarnFormField.fødselsnummer]: {
        [ValidateStringError.stringHasNoValue]: 'fosterbarnForm.fødselsnummer.stringHasNoValue',
        [ValidateFødselsnummerError.fødselsnummerIsNotAllowed]:
            'fosterbarnForm.fødselsnummer.fødselsnummerIsNotAllowed',
        [ValidateFødselsnummerError.fødselsnummerIsNot11Chars]:
            'fosterbarnForm.fødselsnummer.fødselsnummerIsNot11Chars',
        [ValidateFødselsnummerError.fødselsnummerIsInvalid]: 'fosterbarnForm.fødselsnummer.fødselsnummerIsInvalid',
    },
};

const Form = getTypedFormComponents<FosterbarnFormField, FormValues, ValidationError>();

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
                    <Form.Form onCancel={onCancel} formErrorHandler={getFormErrorHandler(intl, 'fosterbarnForm')}>
                        <Systemtittel tag="h1">Fosterbarn</Systemtittel>
                        <FormBlock>
                            <Form.Input
                                name={FosterbarnFormField.fødselsnummer}
                                label={txt.form_fødselsnummer_label}
                                validate={getFødselsnummerValidator({
                                    required: true,
                                    disallowedValues: disallowedFødselsnumre,
                                })}
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
                                        validate={getRequiredFieldValidator()}
                                    />
                                </FormBlock>
                                <FormBlock>
                                    <Form.Input
                                        name={FosterbarnFormField.etternavn}
                                        label={txt.form_etternavn_label}
                                        validate={getRequiredFieldValidator()}
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
