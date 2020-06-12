import React from 'react';
import { useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { commonFieldErrorRenderer } from '@navikt/sif-common-core/lib/utils/commonFieldErrorRenderer';
import dateRangeValidation from '@navikt/sif-common-core/lib/validation/dateRangeValidation';
import { getTypedFormComponents } from '@navikt/sif-common-formik/lib';
import { Systemtittel } from 'nav-frontend-typografi';
import { FraværPeriode, isFraværPeriode } from './types';
import { validateNotHelgedag } from './fraværUtilities';
import { validateAll } from './fraværValidationUtils';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';

export interface FraværPeriodeFormLabels {
    title: string;
    intervalTitle: string;
    fromDate: string;
    toDate: string;
    okButton: string;
    cancelButton: string;
}

interface Props {
    fraværPeriode?: Partial<FraværPeriode>;
    minDate: Date;
    maxDate: Date;
    dateRangesToDisable?: DateRange[];
    helgedagerIkkeTillat?: boolean;
    labels?: Partial<FraværPeriodeFormLabels>;
    onSubmit: (values: FraværPeriode) => void;
    onCancel: () => void;
}

const defaultLabels: FraværPeriodeFormLabels = {
    title: 'Periode med fravær',
    intervalTitle: 'Velg tidsrom',
    fromDate: 'Fra og med',
    toDate: 'Til og med',
    okButton: 'Ok',
    cancelButton: 'Avbryt',
};

enum FraværPeriodeFormFields {
    from = 'from',
    to = 'to',
}

type FormValues = Partial<FraværPeriode>;

const Form = getTypedFormComponents<FraværPeriodeFormFields, FormValues>();

const outDenneHvisInkludert = (denneFraværsPerioden: Partial<FraværPeriode>): ((dateRange: DateRange) => boolean) => (
    fraværPeriode: FraværPeriode
) => !(fraværPeriode?.from === denneFraværsPerioden.from && fraværPeriode?.to === denneFraværsPerioden.to);

const FraværPeriodeForm: React.FunctionComponent<Props> = ({
    fraværPeriode: initialValues = { from: undefined, to: undefined },
    maxDate,
    minDate,
    dateRangesToDisable,
    helgedagerIkkeTillat,
    labels,
    onSubmit,
    onCancel,
}: Props) => {
    const intl = useIntl();
    const onFormikSubmit = (formValues: FormValues) => {
        if (isFraværPeriode(formValues)) {
            onSubmit(formValues);
        } else {
            throw new Error('FraværPeriodeForm: Formvalues is not a valid FraværPeriode on submit.');
        }
    };

    const formLabels: FraværPeriodeFormLabels = { ...defaultLabels, ...labels };

    return (
        <>
            <Form.FormikWrapper
                initialValues={initialValues}
                onSubmit={onFormikSubmit}
                renderForm={(formik) => (
                    <Form.Form
                        onCancel={onCancel}
                        fieldErrorRenderer={(error) => commonFieldErrorRenderer(intl, error)}>
                        <Systemtittel tag="h1">{formLabels.title}</Systemtittel>
                        <FormBlock>
                            <Form.DateIntervalPicker
                                legend={formLabels.intervalTitle}
                                fromDatepickerProps={{
                                    label: formLabels.fromDate,
                                    name: FraværPeriodeFormFields.from,
                                    fullscreenOverlay: true,
                                    minDate: minDate,
                                    maxDate: formik.values.to || maxDate,
                                    disableWeekend: helgedagerIkkeTillat || false,
                                    disabledDateRanges: dateRangesToDisable
                                        ? dateRangesToDisable.filter(outDenneHvisInkludert(initialValues))
                                        : undefined,
                                    validate: validateAll([
                                        ...(helgedagerIkkeTillat ? [validateNotHelgedag] : []),
                                        (date: Date) =>
                                            dateRangeValidation.validateFromDate(
                                                date,
                                                minDate,
                                                maxDate,
                                                formik.values.to
                                            ),
                                    ]),
                                    onChange: () => {
                                        setTimeout(() => {
                                            formik.validateField(FraværPeriodeFormFields.from);
                                        });
                                    },
                                }}
                                toDatepickerProps={{
                                    label: formLabels.toDate,
                                    name: FraværPeriodeFormFields.to,
                                    fullscreenOverlay: true,
                                    minDate: formik.values.from || minDate,
                                    maxDate,
                                    disableWeekend: helgedagerIkkeTillat || false,
                                    disabledDateRanges: dateRangesToDisable
                                        ? dateRangesToDisable.filter(outDenneHvisInkludert(initialValues))
                                        : undefined,

                                    validate: validateAll([
                                        ...(helgedagerIkkeTillat ? [validateNotHelgedag] : []),
                                        (date: Date) =>
                                            dateRangeValidation.validateToDate(
                                                date,
                                                minDate,
                                                maxDate,
                                                formik.values.from
                                            ),
                                    ]),
                                    onChange: () => {
                                        setTimeout(() => {
                                            formik.validateField(FraværPeriodeFormFields.to);
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

export default FraværPeriodeForm;
