import React from 'react';
import { useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { getTypedFormComponents } from '@navikt/sif-common-formik/lib';
import {
    getDateValidator,
    getFødselsnummerValidator,
    getRequiredFieldValidator,
    ValidateDateError,
    ValidateFødselsnummerError,
    ValidateRequiredFieldError,
} from '@navikt/sif-common-formik/lib/validation';
import { validateAll } from '@navikt/sif-common-formik/lib/validation/validationUtils';
import { Systemtittel } from 'nav-frontend-typografi';
import { getIntlFormErrorRenderer } from '../utils';
import annetBarnUtils from './annetBarnUtils';
import { AnnetBarn, AnnetBarnFormValues } from './types';

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

enum AnnetBarnFormFields {
    fnr = 'fnr',
    fødselsdato = 'fødselsdato',
    navn = 'navn',
}

export const AnnetBarnFormErrors = {
    [AnnetBarnFormFields.navn]: { [ValidateRequiredFieldError.noValue]: 'annetBarn.navn.noValue' },
    [AnnetBarnFormFields.fødselsdato]: {
        [ValidateRequiredFieldError.noValue]: 'annetBarn.fødselsdato.noValue',
        [ValidateDateError.dateBeforeMin]: 'annetBarn.fødselsdato.dateBeforeMin',
        [ValidateDateError.dateAfterMax]: 'annetBarn.fødselsdato.dateAfterMax',
        [ValidateDateError.invalidDateFormat]: 'annetBarn.fødselsdato.invalidFormat',
    },
    [AnnetBarnFormFields.fnr]: {
        [ValidateRequiredFieldError.noValue]: 'annetBarn.fnr.noValue',
        [ValidateFødselsnummerError.invalidFødselsnummer]: 'annetBarn.fnr.invalidFødselsnummer',
        [ValidateFødselsnummerError.fødselsnummerNot11Chars]: 'annetBarn.fnr.fødselsnummerNot11Chars',
        [ValidateFødselsnummerError.fødselsnummerChecksumError]: 'annetBarn.fnr.fødselsnummerChecksumError',
        [ValidateFødselsnummerError.disallowedFødselsnummer]: 'annetBarn.fnr.disallowedFødselsnummer',
    },
};

interface Props {
    annetBarn?: Partial<AnnetBarn>;
    labels?: Partial<AnnetBarnFormLabels>;
    minDate: Date;
    maxDate: Date;
    disallowedFødselsnumre?: string[];
    onSubmit: (values: AnnetBarn) => void;
    onCancel: () => void;
}

const Form = getTypedFormComponents<AnnetBarnFormFields, AnnetBarnFormValues>();

const AnnetBarnForm = ({
    annetBarn = { fnr: '', navn: '', fødselsdato: undefined, id: undefined },
    labels,
    minDate,
    maxDate,
    disallowedFødselsnumre,
    onSubmit,
    onCancel,
}: Props) => {
    const intl = useIntl();

    const onFormikSubmit = (formValues: AnnetBarnFormValues) => {
        const annetBarnToSubmit = annetBarnUtils.mapFormValuesToPartialAnnetBarn(formValues, annetBarn.id);
        if (annetBarnUtils.isAnnetBarn(annetBarnToSubmit)) {
            onSubmit(annetBarnToSubmit);
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
        <Form.FormikWrapper
            initialValues={annetBarnUtils.mapAnnetBarnToFormValues(annetBarn)}
            onSubmit={onFormikSubmit}
            renderForm={() => (
                <Form.Form onCancel={onCancel} fieldErrorRenderer={getIntlFormErrorRenderer(intl)}>
                    <Systemtittel tag="h1">{formLabels.title}</Systemtittel>
                    <FormBlock>
                        <Form.Input
                            name={AnnetBarnFormFields.navn}
                            label={formLabels.navn}
                            validate={getRequiredFieldValidator({
                                noValue: AnnetBarnFormErrors.fnr.noValue,
                            })}
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
                            validate={(value) =>
                                validateAll([
                                    () =>
                                        getRequiredFieldValidator({
                                            noValue: AnnetBarnFormErrors.fødselsdato.noValue,
                                        })(value),
                                    () =>
                                        getDateValidator(
                                            { min: minDate, max: maxDate },
                                            {
                                                dateAfterMax: AnnetBarnFormErrors.fødselsdato.dateAfterMax,
                                                dateBeforeMin: AnnetBarnFormErrors.fødselsdato.dateBeforeMin,
                                                invalidDateFormat: AnnetBarnFormErrors.fødselsdato.invalidDateFormat,
                                                noValue: AnnetBarnFormErrors.fødselsdato.noValue,
                                            }
                                        )(value),
                                ])
                            }
                            maxDate={maxDate}
                            minDate={minDate}
                            showYearSelector={true}
                        />
                    </FormBlock>

                    <FormBlock>
                        <Form.Input
                            name={AnnetBarnFormFields.fnr}
                            label={formLabels.fnr}
                            validate={(value) =>
                                validateAll([
                                    () =>
                                        getRequiredFieldValidator({
                                            noValue: AnnetBarnFormErrors.fnr.noValue,
                                        })(value),
                                    () =>
                                        getFødselsnummerValidator(
                                            {
                                                required: true,
                                                disallowedValues: disallowedFødselsnumre,
                                            },
                                            {
                                                noValue: AnnetBarnFormErrors.fnr.noValue,
                                                invalidFødselsnummer: AnnetBarnFormErrors.fnr.invalidFødselsnummer,
                                                disallowedFødselsnummer:
                                                    AnnetBarnFormErrors.fnr.disallowedFødselsnummer,
                                                fødselsnummerChecksumError:
                                                    AnnetBarnFormErrors.fnr.fødselsnummerChecksumError,
                                                fødselsnummerNot11Chars:
                                                    AnnetBarnFormErrors.fnr.fødselsnummerNot11Chars,
                                            }
                                        )(value),
                                ])
                            }
                            inputMode="numeric"
                            maxLength={11}
                            placeholder={formLabels.placeholderFnr}
                        />
                    </FormBlock>
                </Form.Form>
            )}
        />
    );
};

export default AnnetBarnForm;
