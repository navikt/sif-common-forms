import React from 'react';
import { useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { commonFieldErrorRenderer } from '@navikt/sif-common-core/lib/utils/commonFieldErrorRenderer';
import { getTypedFormComponents } from '@navikt/sif-common-formik/lib';
import { Systemtittel } from 'nav-frontend-typografi';
import { FraværDag, isFraværDag } from './types';
import FraværTimerSelect from './FraværTimerSelect';
import { FormikDatepickerProps } from '@navikt/sif-common-formik/lib/components/formik-datepicker/FormikDatepicker';
import { validateRequiredField } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { toMaybeNumber, validateNotHelgedag } from './fraværUtilities';
import { validateAll, validateLessOrEqualTo } from './fraværValidationUtils';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';

export interface FraværDagFormLabels {
    title: string;
    date: string;
    antallArbeidstimer: string;
    timerFravær: string;
    okButton: string;
    cancelButton: string;
}

interface Props {
    fraværDag?: Partial<FraværDag>;
    minDate: Date;
    maxDate: Date;
    dateRangesToDisable?: DateRange[];
    helgedagerIkkeTillatt?: boolean;
    labels?: Partial<FraværDagFormLabels>;
    maksArbeidstidPerDag?: number;
    onSubmit: (values: FraværDag) => void;
    onCancel: () => void;
}

const defaultLabels: FraværDagFormLabels = {
    title: 'Dag med delvis fravær',
    date: 'Dato',
    antallArbeidstimer: 'Antall timer du skulle ha jobbet denne dagen',
    timerFravær: 'Antall timer du var borte fra jobb denne dagen',
    okButton: 'Ok',
    cancelButton: 'Avbryt',
};

export enum FraværDagFormFields {
    dato = 'dato',
    timerArbeidsdag = 'timerArbeidsdag',
    timerFravær = 'timerFravær',
}

type FormValues = Partial<FraværDag>;

export const outDenneHvisInkludert = (initialValues: Partial<FraværDag>): ((dateRange: DateRange) => boolean) => (
    dateRange: DateRange
) => !(dateRange.from === initialValues.dato && dateRange.to === initialValues.dato);

export const FraværDagForm = getTypedFormComponents<FraværDagFormFields, FormValues>();

const FraværDagFormView: React.FunctionComponent<Props> = ({
    fraværDag: initialValues = {
        dato: undefined,
        timerArbeidsdag: undefined,
        timerFravær: undefined,
    },
    maxDate,
    minDate,
    dateRangesToDisable,
    helgedagerIkkeTillatt,
    labels,
    maksArbeidstidPerDag,
    onSubmit,
    onCancel,
}: Props) => {
    const intl = useIntl();
    const onFormikSubmit = (formValues: FormValues) => {
        if (isFraværDag(formValues)) {
            onSubmit(formValues);
        } else {
            throw new Error('FraværDagFOrm: Formvalues is not a valid FraværDag on submit.');
        }
    };

    const formLabels: FraværDagFormLabels = { ...defaultLabels, ...labels };

    return (
        <>
            <FraværDagForm.FormikWrapper
                initialValues={initialValues}
                onSubmit={onFormikSubmit}
                renderForm={(formik) => {
                    const { values } = formik;
                    const datepickerProps: FormikDatepickerProps<FraværDagFormFields> = {
                        label: formLabels.date,
                        name: FraværDagFormFields.dato,
                        fullscreenOverlay: true,

                        minDate,
                        maxDate,
                        disableWeekend: helgedagerIkkeTillatt || false,
                        disabledDateRanges: dateRangesToDisable
                            ? dateRangesToDisable.filter(outDenneHvisInkludert(initialValues))
                            : undefined,

                        validate: helgedagerIkkeTillatt
                            ? validateAll([validateRequiredField, validateNotHelgedag])
                            : validateRequiredField,
                        onChange: () => {
                            setTimeout(() => {
                                formik.validateField(FraværDagFormFields.dato);
                            });
                        },
                    };

                    return (
                        <FraværDagForm.Form
                            onCancel={onCancel}
                            fieldErrorRenderer={(error) => commonFieldErrorRenderer(intl, error)}>
                            <Systemtittel tag="h1">{formLabels.title}</Systemtittel>
                            <FormBlock>
                                <FraværDagForm.DatePicker {...datepickerProps} />
                            </FormBlock>
                            <FormBlock>
                                <FraværTimerSelect
                                    name={FraværDagFormFields.timerArbeidsdag}
                                    validate={validateRequiredField}
                                    label={formLabels.antallArbeidstimer}
                                    maksTid={maksArbeidstidPerDag}
                                />
                            </FormBlock>
                            <FormBlock>
                                <FraværTimerSelect
                                    name={FraværDagFormFields.timerFravær}
                                    validate={validateAll([
                                        validateRequiredField,
                                        validateLessOrEqualTo(toMaybeNumber(values.timerArbeidsdag)),
                                    ])}
                                    label={formLabels.timerFravær}
                                    maksTid={maksArbeidstidPerDag}
                                />
                            </FormBlock>
                        </FraværDagForm.Form>
                    );
                }}
            />
        </>
    );
};

export default FraværDagFormView;
