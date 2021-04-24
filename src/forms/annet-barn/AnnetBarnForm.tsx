import React from 'react';
import { useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { prettifyDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
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
import getFieldErrorHandler from '@navikt/sif-common-formik/lib/validation/fieldErrorHandler';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import { Systemtittel } from 'nav-frontend-typografi';
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
    [AnnetBarnFormFields.navn]: { [ValidateRequiredFieldError.noValue]: 'annetBarnForm.navn.noValue' },
    [AnnetBarnFormFields.fødselsdato]: {
        [ValidateRequiredFieldError.noValue]: 'annetBarnForm.fødselsdato.noValue',
        [ValidateDateError.dateBeforeMin]: 'annetBarnForm.fødselsdato.dateBeforeMin',
        [ValidateDateError.dateAfterMax]: 'annetBarnForm.fødselsdato.dateAfterMax',
        [ValidateDateError.invalidDateFormat]: 'annetBarnForm.fødselsdato.invalidDateFormat',
    },
    [AnnetBarnFormFields.fnr]: {
        [ValidateRequiredFieldError.noValue]: 'annetBarnForm.fnr.noValue',
        [ValidateFødselsnummerError.invalidFødselsnummer]: 'annetBarnForm.fnr.invalidFødselsnummer',
        [ValidateFødselsnummerError.fødselsnummerNot11Chars]: 'annetBarnForm.fnr.fødselsnummerNot11Chars',
        [ValidateFødselsnummerError.disallowedFødselsnummer]: 'annetBarnForm.fnr.disallowedFødselsnummer',
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

const Form = getTypedFormComponents<AnnetBarnFormFields, AnnetBarnFormValues, ValidationError>();

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
                <Form.Form onCancel={onCancel} fieldErrorHandler={getFieldErrorHandler(intl, 'annetBarnForm')}>
                    <Systemtittel tag="h1">{formLabels.title}</Systemtittel>
                    <FormBlock>
                        <Form.Input
                            name={AnnetBarnFormFields.navn}
                            label={formLabels.navn}
                            validate={getRequiredFieldValidator()}
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
                            validate={(value) => {
                                const dateError = getDateValidator({ required: true, min: minDate, max: maxDate })(
                                    value
                                );
                                if (dateError === ValidateDateError.dateBeforeMin) {
                                    return {
                                        key: dateError,
                                        values: { dato: prettifyDate(minDate) },
                                    };
                                }
                                return dateError;
                            }}
                            maxDate={maxDate}
                            minDate={minDate}
                            showYearSelector={true}
                        />
                    </FormBlock>

                    <FormBlock>
                        <Form.Input
                            name={AnnetBarnFormFields.fnr}
                            label={formLabels.fnr}
                            validate={getFødselsnummerValidator({
                                required: true,
                                disallowedValues: disallowedFødselsnumre,
                            })}
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
