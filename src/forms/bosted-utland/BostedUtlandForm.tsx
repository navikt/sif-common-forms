import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { commonFieldErrorRenderer } from '@navikt/sif-common-core/lib/utils/commonFieldErrorRenderer';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import dateRangeValidation from '@navikt/sif-common-core/lib/validation/dateRangeValidation';
import { validateRequiredSelect } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { getTypedFormComponents } from '@navikt/sif-common-formik/lib';
import { Systemtittel } from 'nav-frontend-typografi';
import { BostedUtland, BostedUtlandFormValues } from './types';
import { mapFomTomToDateRange } from '../utils';
import bostedUtlandUtils from './bostedUtlandUtils';

export interface BostedUtlandFormLabels {
    tittel: string;
}

interface Props {
    minDate: Date;
    maxDate: Date;
    bosted?: BostedUtland;
    alleBosteder?: BostedUtland[];
    onSubmit: (values: BostedUtland) => void;
    onCancel: () => void;
}

enum BostedUtlandFormFields {
    fom = 'fom',
    tom = 'tom',
    landkode = 'landkode',
}

interface DateLimits {
    minDate: Date;
    maxDate: Date;
}
const Form = getTypedFormComponents<BostedUtlandFormFields, BostedUtlandFormValues>();

const BostedUtlandForm = ({ maxDate, minDate, bosted, alleBosteder = [], onSubmit, onCancel }: Props) => {
    const intl = useIntl();

    const onFormikSubmit = (formValues: BostedUtlandFormValues) => {
        const bostedToSubmit = bostedUtlandUtils.mapFormValuesToBostedUtland(formValues, bosted?.id);
        if (bostedUtlandUtils.isValidBostedUtland(bostedToSubmit)) {
            onSubmit(bostedToSubmit);
        } else {
            throw new Error('BostedUtlandForm: Formvalues is not a valid BostedUtland on submit.');
        }
    };

    return (
        <Form.FormikWrapper
            initialValues={bostedUtlandUtils.mapBostedUtlandToFormValues(bosted || {})}
            onSubmit={onFormikSubmit}
            renderForm={(formik) => {
                const { values } = formik;
                const fomDateLimits: DateLimits = {
                    minDate,
                    maxDate: values.tom?.date || maxDate,
                };
                const tomDateLimits: DateLimits = {
                    minDate: values.fom?.date || minDate,
                    maxDate: maxDate,
                };

                const andreBosteder =
                    bosted === undefined
                        ? alleBosteder.map(mapFomTomToDateRange)
                        : alleBosteder.filter((b) => b.id !== bosted.id).map(mapFomTomToDateRange);

                return (
                    <Form.Form
                        onCancel={onCancel}
                        fieldErrorRenderer={(error) => commonFieldErrorRenderer(intl, error)}>
                        <Systemtittel tag="h1">
                            <FormattedMessage id="bostedUtland.form.tittel" />
                        </Systemtittel>

                        <FormBlock>
                            <Form.DateRangePicker
                                legend={intlHelper(intl, 'bostedUtland.form.tidsperiode.spm')}
                                fullscreenOverlay={true}
                                minDate={minDate}
                                maxDate={maxDate}
                                allowRangesToStartAndStopOnSameDate={false}
                                disabledDateRanges={andreBosteder}
                                fromInputProps={{
                                    name: BostedUtlandFormFields.fom,
                                    label: intlHelper(intl, 'bostedUtland.form.tidsperiode.fraDato'),
                                    validate: (dateValue) =>
                                        dateRangeValidation.validateFromDate(
                                            dateValue?.date,
                                            fomDateLimits.minDate,
                                            fomDateLimits.maxDate,
                                            values.tom?.date
                                        ),
                                }}
                                toInputProps={{
                                    name: BostedUtlandFormFields.tom,
                                    label: intlHelper(intl, 'bostedUtland.form.tidsperiode.tilDato'),
                                    validate: (dateValue) =>
                                        dateRangeValidation.validateToDate(
                                            dateValue?.date,
                                            tomDateLimits.minDate,
                                            tomDateLimits.maxDate,
                                            values.fom?.date
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
