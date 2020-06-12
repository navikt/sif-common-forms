import React from 'react';
import { useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { commonFieldErrorRenderer } from '@navikt/sif-common-core/lib/utils/commonFieldErrorRenderer';
import dateRangeValidation from '@navikt/sif-common-core/lib/validation/dateRangeValidation';
import { getTypedFormComponents } from '@navikt/sif-common-formik/lib';
import { Systemtittel } from 'nav-frontend-typografi';
import { Ferieuttak, isFerieuttak } from './types';
import { mapFomTomToDateRange } from '../utils';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';

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

const defaultLabels: FerieuttakFormLabels = {
    title: 'Registrer uttak av ferie',
    fromDate: 'Fra og med',
    toDate: 'Til og med',
    intervalTitle: 'Velg tidsrom',
    okButton: 'Ok',
    cancelButton: 'Avbryt',
};

enum FerieuttakFormFields {
    tom = 'tom',
    fom = 'fom',
}

type FormValues = Partial<Ferieuttak>;

const Form = getTypedFormComponents<FerieuttakFormFields, FormValues>();

const FerieuttakForm = ({
    maxDate,
    minDate,
    labels,
    ferieuttak = { fom: undefined, tom: undefined },
    alleFerieuttak = [],
    onSubmit,
    onCancel,
}: Props) => {
    const intl = useIntl();
    const onFormikSubmit = (formValues: FormValues) => {
        if (isFerieuttak(formValues)) {
            onSubmit(formValues);
        } else {
            throw new Error('FerieuttakForm: Formvalues is not a valid Ferieuttak on submit.');
        }
    };

    const formLabels: FerieuttakFormLabels = { ...defaultLabels, ...labels };
    const andreFerieuttak: DateRange[] | undefined =
        ferieuttak === undefined
            ? alleFerieuttak.map(mapFomTomToDateRange)
            : alleFerieuttak.filter((f) => f.id !== ferieuttak.id).map(mapFomTomToDateRange);

    console.log(andreFerieuttak);

    return (
        <>
            <Form.FormikWrapper
                initialValues={ferieuttak}
                onSubmit={onFormikSubmit}
                renderForm={(formik) => (
                    <Form.Form
                        onCancel={onCancel}
                        fieldErrorRenderer={(error) => commonFieldErrorRenderer(intl, error)}>
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
                                    validate: (date: Date) =>
                                        dateRangeValidation.validateFromDate(date, minDate, maxDate, formik.values.tom),
                                    onChange: () => {
                                        setTimeout(() => {
                                            formik.validateField(FerieuttakFormFields.tom);
                                        });
                                    },
                                }}
                                toInputProps={{
                                    label: formLabels.toDate,
                                    name: FerieuttakFormFields.tom,
                                    validate: (date: Date) =>
                                        dateRangeValidation.validateToDate(date, minDate, maxDate, formik.values.fom),
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
