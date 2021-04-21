import React from 'react';
import { useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import {
    getFieldErrorRenderer,
    getSummaryFieldErrorRenderer,
} from '@navikt/sif-common-formik/lib/utils/formikErrorRenderUtils';
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

export const AnnetBarnFormErrorKeys = {
    fields: {
        [AnnetBarnFormFields.navn]: [...Object.keys(ValidateRequiredFieldError)],
        [AnnetBarnFormFields.fødselsdato]: [
            ...Object.keys(ValidateRequiredFieldError),
            ...Object.keys(ValidateDateError),
        ],
        [AnnetBarnFormFields.fnr]: [
            ...Object.keys(ValidateRequiredFieldError),
            ...Object.keys(ValidateFødselsnummerError),
        ],
    },
};

export const AnnetBarnFormName = 'annetBarnForm';

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
        <>
            <Form.FormikWrapper
                initialValues={annetBarnUtils.mapAnnetBarnToFormValues(annetBarn)}
                onSubmit={onFormikSubmit}
                renderForm={() => (
                    <Form.Form
                        onCancel={onCancel}
                        fieldErrorRenderer={getFieldErrorRenderer(intl, AnnetBarnFormName)}
                        summaryFieldErrorRenderer={getSummaryFieldErrorRenderer(intl, AnnetBarnFormName)}>
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
                                validate={(value) =>
                                    validateAll([
                                        () => getRequiredFieldValidator()(value),
                                        () => getDateValidator({ min: minDate, max: maxDate })(value),
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
                                        () => getRequiredFieldValidator()(value),
                                        () =>
                                            getFødselsnummerValidator({
                                                required: true,
                                                disallowedValues: disallowedFødselsnumre,
                                            })(value),
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
        </>
    );
};

export default AnnetBarnForm;
