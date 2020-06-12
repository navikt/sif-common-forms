import React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { commonFieldErrorRenderer } from '@navikt/sif-common-core/lib/utils/commonFieldErrorRenderer';
import dateRangeValidation from '@navikt/sif-common-core/lib/validation/dateRangeValidation';
import { validateRequiredField } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { getTypedFormComponents } from '@navikt/sif-common-formik/lib';
import { FormikProps } from 'formik';
import { Systemtittel } from 'nav-frontend-typografi';
import { Frilansoppdrag, FrilansoppdragFormField, isFrilansoppdrag } from './types';

interface Props {
    oppdrag?: Frilansoppdrag;
    minDate: Date;
    maxDate: Date;
    onSubmit: (oppdrag: Frilansoppdrag) => void;
    onCancel: () => void;
}

type FormValues = Partial<Frilansoppdrag>;

const Form = getTypedFormComponents<FrilansoppdragFormField, FormValues>();

const FrilansoppdragForm = ({ onCancel, oppdrag, onSubmit, minDate, maxDate }: Props) => {
    const onFormikSubmit = (values: Partial<Frilansoppdrag>) => {
        if (isFrilansoppdrag(values)) {
            onSubmit(values);
        } else {
            throw new Error('FrilansoppdragForm: Formvalues is not a valid Frilansoppdrag on submit.');
        }
    };

    const intl = useIntl();

    return (
        <Form.FormikWrapper
            initialValues={oppdrag || {}}
            onSubmit={onFormikSubmit}
            renderForm={(formik: FormikProps<FormValues>) => {
                const { values, setFieldValue } = formik;
                return (
                    <Form.Form
                        includeValidationSummary={false}
                        onCancel={onCancel}
                        fieldErrorRenderer={(error) => commonFieldErrorRenderer(intl, error)}>
                        <Box padBottom="l">
                            <Systemtittel tag="h1">Frilansoppdrag</Systemtittel>
                        </Box>
                        <Form.Input
                            label="Navn på arbeidsgiver"
                            name={FrilansoppdragFormField.arbeidsgiverNavn}
                            validate={validateRequiredField}
                        />
                        <Box margin="l">
                            <Form.DateRangePicker
                                legend={'Periode'}
                                fullscreenOverlay={true}
                                showYearSelector={true}
                                minDate={minDate}
                                maxDate={maxDate}
                                fromInputProps={{
                                    label: 'Fra og med',
                                    name: FrilansoppdragFormField.fom,
                                    validate: (date) =>
                                        dateRangeValidation.validateFromDate(date, minDate, maxDate, values.tom),
                                }}
                                toInputProps={{
                                    label: 'Til og med',
                                    name: FrilansoppdragFormField.tom,
                                    disabled: values.erPågående === true,
                                    validate:
                                        values.erPågående !== true
                                            ? (date: Date) =>
                                                  dateRangeValidation.validateToDate(date, minDate, maxDate, values.fom)
                                            : undefined,
                                }}
                            />
                            <Form.Checkbox
                                label="Pågående"
                                name={FrilansoppdragFormField.erPågående}
                                afterOnChange={(checked) => {
                                    if (checked) {
                                        setFieldValue(FrilansoppdragFormField.tom, undefined);
                                    }
                                }}
                            />
                        </Box>
                    </Form.Form>
                );
            }}
        />
    );
};

export default FrilansoppdragForm;
