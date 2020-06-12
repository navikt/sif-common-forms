import React from 'react';
import { useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { commonFieldErrorRenderer } from '@navikt/sif-common-core/lib/utils/commonFieldErrorRenderer';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import dateRangeValidation from '@navikt/sif-common-core/lib/validation/dateRangeValidation';
import { getTypedFormComponents } from '@navikt/sif-common-formik/lib';
import { Systemtittel } from 'nav-frontend-typografi';
import { isTidsperiode, Tidsperiode } from './types';

export interface TidsperiodeFormLabels {
    title?: string;
    fromDate: string;
    toDate: string;
    intervalTitle?: string;
    okButton: string;
    cancelButton: string;
}

interface Props {
    minDate: Date;
    maxDate: Date;
    tidsperiode?: Partial<Tidsperiode>;
    alleTidsperioder?: Tidsperiode[];
    formLabels?: Partial<TidsperiodeFormLabels>;
    onSubmit: (values: Tidsperiode) => void;
    onCancel: () => void;
}

const defaultLabels: TidsperiodeFormLabels = {
    title: 'Tidsperiode',
    fromDate: 'Fra og med',
    toDate: 'Til og med',
    okButton: 'Ok',
    cancelButton: 'Avbryt',
};

enum TidsperiodeFormFields {
    tom = 'tom',
    fom = 'fom',
}

type FormValues = Partial<Tidsperiode>;

const mapTidsperiodeToDateRange = (tidsperiode: Tidsperiode): DateRange => ({
    from: tidsperiode.fom,
    to: tidsperiode.tom,
});

const Form = getTypedFormComponents<TidsperiodeFormFields, FormValues>();

const TidsperiodeForm = ({
    maxDate,
    minDate,
    formLabels,
    tidsperiode = { fom: undefined, tom: undefined },
    alleTidsperioder = [],
    onSubmit,
    onCancel,
}: Props) => {
    const intl = useIntl();
    const onFormikSubmit = (formValues: FormValues) => {
        if (isTidsperiode(formValues)) {
            onSubmit(formValues);
        } else {
            throw new Error('TidsperiodeForm: Formvalues is not a valid Tidsperiode on submit.');
        }
    };

    const inlineLabels: TidsperiodeFormLabels = { ...defaultLabels, ...formLabels };

    return (
        <>
            <Form.FormikWrapper
                initialValues={tidsperiode}
                onSubmit={onFormikSubmit}
                renderForm={(formik) => {
                    const dateRanges = alleTidsperioder.map((t) => mapTidsperiodeToDateRange(t));

                    const validateFromDate = (date: Date) => {
                        return dateRangeValidation.validateFromDate(date, minDate, maxDate, formik.values.tom);
                    };

                    const validateToDate = (date: Date) => {
                        return dateRangeValidation.validateToDate(date, minDate, maxDate, formik.values.tom);
                    };

                    return (
                        <Form.Form
                            onCancel={onCancel}
                            fieldErrorRenderer={(error) => commonFieldErrorRenderer(intl, error)}>
                            <Systemtittel tag="h1">{inlineLabels.title}</Systemtittel>
                            <FormBlock>
                                <Form.DateRangePicker
                                    legend={inlineLabels.intervalTitle}
                                    fullscreenOverlay={true}
                                    minDate={minDate}
                                    maxDate={maxDate}
                                    disabledDateRanges={dateRanges}
                                    fromInputProps={{
                                        label: inlineLabels.fromDate,
                                        name: TidsperiodeFormFields.fom,
                                        validate: validateFromDate,
                                        onChange: () => {
                                            setTimeout(() => {
                                                formik.validateField(TidsperiodeFormFields.tom);
                                            });
                                        },
                                    }}
                                    toInputProps={{
                                        label: inlineLabels.toDate,
                                        name: TidsperiodeFormFields.tom,
                                        validate: validateToDate,
                                        onChange: () => {
                                            setTimeout(() => {
                                                formik.validateField(TidsperiodeFormFields.fom);
                                            });
                                        },
                                    }}
                                />
                            </FormBlock>
                        </Form.Form>
                    );
                }}
            />
        </>
    );
};

export default TidsperiodeForm;
