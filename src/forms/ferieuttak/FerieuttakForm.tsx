import React from 'react';
import { useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import {
    getFieldErrorRenderer,
    getSummaryFieldErrorRenderer,
} from '@navikt/sif-common-core/lib/validation/renderUtils';
import { getTypedFormComponents, ISOStringToDate } from '@navikt/sif-common-formik/lib';
import { getDateRangeValidator } from '@navikt/sif-common-formik/lib/validation';
import { Systemtittel } from 'nav-frontend-typografi';
import { mapFomTomToDateRange } from '../utils';
import ferieuttakUtils from './ferieuttakUtils';
import { Ferieuttak, FerieuttakFormValues } from './types';

export interface FerieuttakFormLabels {
    title: string;
    fromDate: string;
    toDate: string;
    intervalTitle: string;
    okButton: string;
    cancelButton: string;
}

interface Props {
    minDate: Date;
    maxDate: Date;
    ferieuttak?: Partial<Ferieuttak>;
    alleFerieuttak?: Ferieuttak[];
    labels?: Partial<FerieuttakFormLabels>;
    onSubmit: (values: Ferieuttak) => void;
    onCancel: () => void;
}

enum FerieuttakFormFields {
    tom = 'tom',
    fom = 'fom',
}

const Form = getTypedFormComponents<FerieuttakFormFields, FerieuttakFormValues>();

const FerieuttakForm = ({ maxDate, minDate, labels, ferieuttak, alleFerieuttak = [], onSubmit, onCancel }: Props) => {
    const intl = useIntl();
    const onFormikSubmit = (formValues: FerieuttakFormValues) => {
        const ferieuttakToSubmit = ferieuttakUtils.mapFormValuesToFerieuttak(formValues, ferieuttak?.id);
        if (ferieuttakUtils.isValidFerieuttak(ferieuttakToSubmit)) {
            onSubmit({ ...ferieuttak, ...ferieuttakToSubmit });
        } else {
            throw new Error('FerieuttakForm: Formvalues is not a valid Ferieuttak on submit.');
        }
    };

    const defaultLabels: FerieuttakFormLabels = {
        title: intlHelper(intl, 'ferieuttak.list.title'),
        fromDate: intlHelper(intl, 'ferieuttak.list.fromDate'),
        toDate: intlHelper(intl, 'ferieuttak.list.toDate'),
        intervalTitle: intlHelper(intl, 'ferieuttak.list.intervalTitle'),
        okButton: intlHelper(intl, 'ferieuttak.list.okButton'),
        cancelButton: intlHelper(intl, 'ferieuttak.list.cancelButton'),
    };

    const formLabels: FerieuttakFormLabels = { ...defaultLabels, ...labels };

    const andreFerieuttak: DateRange[] | undefined =
        ferieuttak === undefined
            ? alleFerieuttak.map(mapFomTomToDateRange)
            : alleFerieuttak.filter((f) => f.id !== ferieuttak.id).map(mapFomTomToDateRange);

    return (
        <>
            <Form.FormikWrapper
                initialValues={ferieuttakUtils.mapFerieuttakToFormValues(ferieuttak || {})}
                onSubmit={onFormikSubmit}
                renderForm={(formik) => (
                    <Form.Form
                        onCancel={onCancel}
                        fieldErrorRenderer={getFieldErrorRenderer(intl, 'ferieuttakForm')}
                        summaryFieldErrorRenderer={getSummaryFieldErrorRenderer(intl, 'ferieuttakForm')}>
                        <Systemtittel tag="h1">{formLabels.title}</Systemtittel>
                        <FormBlock>
                            <Form.DateRangePicker
                                legend={formLabels.intervalTitle}
                                fullscreenOverlay={true}
                                minDate={minDate}
                                maxDate={maxDate}
                                allowRangesToStartAndStopOnSameDate={true}
                                disabledDateRanges={andreFerieuttak}
                                fromInputProps={{
                                    label: formLabels.fromDate,
                                    name: FerieuttakFormFields.fom,
                                    validate: getDateRangeValidator.validateFromDate({
                                        required: true,
                                        min: minDate,
                                        max: maxDate,
                                        toDate: ISOStringToDate(formik.values.tom),
                                    }),
                                    onChange: () => {
                                        setTimeout(() => {
                                            formik.validateField(FerieuttakFormFields.tom);
                                        });
                                    },
                                }}
                                toInputProps={{
                                    label: formLabels.toDate,
                                    name: FerieuttakFormFields.tom,

                                    validate: getDateRangeValidator.validateToDate({
                                        required: true,
                                        min: minDate,
                                        max: maxDate,
                                        fromDate: ISOStringToDate(formik.values.fom),
                                    }),
                                    onChange: () => {
                                        setTimeout(() => {
                                            formik.validateField(FerieuttakFormFields.fom);
                                        });
                                    },
                                }}
                            />
                        </FormBlock>
                    </Form.Form>
                )}
            />
        </>
    );
};

export default FerieuttakForm;
