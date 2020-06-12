import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { commonFieldErrorRenderer } from '@navikt/sif-common-core/lib/utils/commonFieldErrorRenderer';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import dateRangeValidation from '@navikt/sif-common-core/lib/validation/dateRangeValidation';
import { validateRequiredSelect } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { getTypedFormComponents } from '@navikt/sif-common-formik/lib';
import { Systemtittel } from 'nav-frontend-typografi';
import { BostedUtland, isValidBostedUtland } from './types';

export interface BostedUtlandFormLabels {
    tittel: string;
}

interface Props {
    minDate: Date;
    maxDate: Date;
    bosted?: BostedUtland;
    onSubmit: (values: BostedUtland) => void;
    onCancel: () => void;
}

enum BostedUtlandFormFields {
    fom = 'fom',
    tom = 'tom',
    landkode = 'landkode',
}

type FormValues = Partial<BostedUtland>;

const Form = getTypedFormComponents<BostedUtlandFormFields, FormValues>();

const BostedUtlandForm = ({ maxDate, minDate, bosted, onSubmit, onCancel }: Props) => {
    const intl = useIntl();

    const onFormikSubmit = (formValues: Partial<BostedUtland>) => {
        if (isValidBostedUtland(formValues)) {
            onSubmit(formValues);
        } else {
            throw new Error('BostedUtlandForm: Formvalues is not a valid BostedUtland on submit.');
        }
    };

    return (
        <Form.FormikWrapper
            initialValues={bosted || {}}
            onSubmit={onFormikSubmit}
            renderForm={(formik) => {
                const { values } = formik;

                const fomDateLimits = {
                    minDate,
                    maxDate: values.tom || maxDate,
                };
                const tomDateLimits = {
                    minDate: values.fom || minDate,
                    maxDate: maxDate,
                };
                return (
                    <Form.Form
                        onCancel={onCancel}
                        fieldErrorRenderer={(error) => commonFieldErrorRenderer(intl, error)}>
                        <Systemtittel tag="h1">
                            <FormattedMessage id="bostedUtland.form.tittel" />
                        </Systemtittel>

                        <FormBlock>
                            <Form.DateIntervalPicker
                                legend={intlHelper(intl, 'bostedUtland.form.tidsperiode.spm')}
                                fromDatepickerProps={{
                                    name: BostedUtlandFormFields.fom,
                                    label: intlHelper(intl, 'bostedUtland.form.tidsperiode.fraDato'),
                                    fullscreenOverlay: true,
                                    ...fomDateLimits,
                                    validate: (date: Date) =>
                                        dateRangeValidation.validateFromDate(
                                            date,
                                            fomDateLimits.minDate,
                                            fomDateLimits.maxDate,
                                            values.tom
                                        ),
                                }}
                                toDatepickerProps={{
                                    name: BostedUtlandFormFields.tom,
                                    label: intlHelper(intl, 'bostedUtland.form.tidsperiode.tilDato'),
                                    fullscreenOverlay: true,
                                    ...tomDateLimits,
                                    validate: (date: Date) =>
                                        dateRangeValidation.validateToDate(
                                            date,
                                            tomDateLimits.minDate,
                                            tomDateLimits.maxDate,
                                            values.fom
                                        ),
                                }}
                            />
                        </FormBlock>
                        <FormBlock>
                            <Form.CountrySelect
                                name={BostedUtlandFormFields.landkode}
                                label={intlHelper(intl, 'bostedUtland.form.land.spm')}
                                validate={validateRequiredSelect}
                            />
                        </FormBlock>
                    </Form.Form>
                );
            }}
        />
    );
};

export default BostedUtlandForm;
