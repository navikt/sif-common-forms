import React from 'react';
import { useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { commonFieldErrorRenderer } from '@navikt/sif-common-core/lib/utils/commonFieldErrorRenderer';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import dateRangeValidation from '@navikt/sif-common-core/lib/validation/dateRangeValidation';
import { getTypedFormComponents, ISOStringToDate } from '@navikt/sif-common-formik/lib';
import { Systemtittel } from 'nav-frontend-typografi';
import {
    isFraværPeriode,
    mapFormValuesToFraværPeriode,
    mapFraværPeriodeToFormValues,
    validateNotHelgedag,
} from './fraværUtilities';
import { validateAll } from './fraværValidationUtils';
import { FraværPeriode, FraværPeriodeFormValues } from './types';

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

const Form = getTypedFormComponents<FraværPeriodeFormFields, FraværPeriodeFormValues>();

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
    const onFormikSubmit = (formValues: FraværPeriodeFormValues) => {
        const fraværPeriodeToSubmit = mapFormValuesToFraværPeriode(formValues, initialValues.id);
        if (isFraværPeriode(fraværPeriodeToSubmit)) {
            onSubmit(fraværPeriodeToSubmit);
        } else {
            throw new Error('FraværPeriodeForm: Formvalues is not a valid FraværPeriode on submit.');
        }
    };

    const formLabels: FraværPeriodeFormLabels = { ...defaultLabels, ...labels };

    return (
        <>
            <Form.FormikWrapper
                initialValues={mapFraværPeriodeToFormValues(initialValues)}
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
                                    maxDate: ISOStringToDate(formik.values.to) || maxDate,
                                    disableWeekend: helgedagerIkkeTillat || false,
                                    disabledDateRanges: dateRangesToDisable
                                        ? dateRangesToDisable.filter(outDenneHvisInkludert(initialValues))
                                        : undefined,
                                    validate: validateAll<string>([
                                        ...(helgedagerIkkeTillat ? [validateNotHelgedag] : []),
                                        (dateString) =>
                                            dateRangeValidation.validateFromDate(
                                                ISOStringToDate(dateString),
                                                minDate,
                                                maxDate,
                                                ISOStringToDate(formik.values.to)
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
                                    minDate: ISOStringToDate(formik.values.from) || minDate,
                                    maxDate,
                                    disableWeekend: helgedagerIkkeTillat || false,
                                    disabledDateRanges: dateRangesToDisable
                                        ? dateRangesToDisable.filter(outDenneHvisInkludert(initialValues))
                                        : undefined,

                                    validate: validateAll<string>([
                                        ...(helgedagerIkkeTillat ? [validateNotHelgedag] : []),
                                        (dateString) =>
                                            dateRangeValidation.validateToDate(
                                                ISOStringToDate(dateString),
                                                minDate,
                                                maxDate,
                                                ISOStringToDate(formik.values.from)
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
