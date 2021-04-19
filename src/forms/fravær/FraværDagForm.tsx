import React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange, dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import {
    getFieldErrorRenderer,
    getSummaryFieldErrorRenderer,
} from '@navikt/sif-common-core/lib/validation/renderUtils';
import { getTypedFormComponents } from '@navikt/sif-common-formik/lib';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { FormikDatepickerProps } from '@navikt/sif-common-formik/lib/components/formik-datepicker/FormikDatepicker';
import {
    validateDate,
    validateRequiredValue,
    validateYesOrNoIsAnswered,
} from '@navikt/sif-common-formik/lib/validation';
import dayjs from 'dayjs';
import { Systemtittel } from 'nav-frontend-typografi';
import FormattedHtmlMessage from '../components/formatted-html-message/FormattedHtmlMessage';
import FraværTimerSelect from './FraværTimerSelect';
import { isFraværDag, mapFormValuesToFraværDag, mapFraværDagToFormValues, toMaybeNumber } from './fraværUtilities';
import { validateFraværDagCollision, validateLessOrEqualTo, validateNotHelgedag } from './fraværValidationUtils';
import { getFraværÅrsakRadios } from './fraværÅrsakRadios';
import { FraværDag, FraværDagFormValues } from './types';
import ÅrsakInfo from './ÅrsakInfo';
import { validateAll } from '@navikt/sif-common-formik/lib/validation/validationUtils';

export interface FraværDagFormLabels {
    tittel: string;
    dato: string;
    antallArbeidstimer: string;
    timerFravær: string;
    hjemmePgaKorona: string;
    årsak: string;
    ok: string;
    avbryt: string;
}

interface Props {
    fraværDag?: Partial<FraværDag>;
    dagDescription?: JSX.Element;
    minDate: Date;
    maxDate: Date;
    dateRangesToDisable?: DateRange[];
    helgedagerIkkeTillatt?: boolean;
    headerContent?: JSX.Element;
    maksArbeidstidPerDag?: number;
    onSubmit: (values: FraværDag) => void;
    onCancel: () => void;
}

export enum FraværDagFormFields {
    dato = 'dato',
    timerArbeidsdag = 'timerArbeidsdag',
    timerFravær = 'timerFravær',
    hjemmePgaKorona = 'hjemmePgaKorona',
    årsak = 'årsak',
}

export const FraværDagForm = getTypedFormComponents<FraværDagFormFields, FraværDagFormValues>();

const FraværDagFormView = ({
    fraværDag = {
        dato: undefined,
        timerArbeidsdag: undefined,
        timerFravær: undefined,
        årsak: undefined,
    },
    dagDescription,
    maxDate,
    minDate,
    dateRangesToDisable,
    helgedagerIkkeTillatt,
    maksArbeidstidPerDag,
    headerContent,
    onSubmit,
    onCancel,
}: Props) => {
    const intl = useIntl();
    const onFormikSubmit = (formValues: FraværDagFormValues) => {
        const fraværDagToSubmit = mapFormValuesToFraværDag(formValues, fraværDag.id);
        if (isFraværDag(fraværDagToSubmit)) {
            onSubmit(fraværDagToSubmit);
        } else {
            throw new Error('FraværDagFOrm: Formvalues is not a valid FraværDag on submit.');
        }
    };

    const formLabels: FraværDagFormLabels = {
        ok: intlHelper(intl, 'fravær.form.felles.ok'),
        avbryt: intlHelper(intl, 'fravær.form.felles.avbryt'),
        årsak: intlHelper(intl, 'fravær.form.felles.årsak'),
        tittel: intlHelper(intl, 'fravær.form.dag.tittel'),
        dato: intlHelper(intl, 'fravær.form.dag.dato'),
        antallArbeidstimer: intlHelper(intl, 'fravær.form.dag.antallArbeidstimer'),
        timerFravær: intlHelper(intl, 'fravær.form.dag.timerFravær'),
        hjemmePgaKorona: intlHelper(intl, 'fravær.form.felles.hjemmePgaKorona'),
    };
    const fraværÅrsakRadios = getFraværÅrsakRadios(intl);
    const disabledDateRanges = dateRangesToDisable
        ? dateRangesToDisable.filter((range) => {
              const { dato } = fraværDag;
              return !(dato && dayjs(dato).isSame(range.from, 'day') && dayjs(dato).isSame(range.to, 'day'));
          })
        : undefined;

    return (
        <>
            <FraværDagForm.FormikWrapper
                initialValues={mapFraværDagToFormValues(fraværDag)}
                onSubmit={onFormikSubmit}
                renderForm={(formik) => {
                    const { values } = formik;
                    const valgtDato = datepickerUtils.getDateFromDateString(values.dato);
                    const datepickerProps: FormikDatepickerProps<FraværDagFormFields> = {
                        label: formLabels.dato,
                        name: FraværDagFormFields.dato,
                        fullscreenOverlay: true,
                        dayPickerProps: {
                            initialMonth: dayjs(dateToday).isAfter(maxDate) ? maxDate : dateToday,
                        },
                        minDate,
                        maxDate,
                        disableWeekend: helgedagerIkkeTillatt || false,
                        disabledDateRanges,
                        validate: helgedagerIkkeTillatt
                            ? (value) =>
                                  validateAll([
                                      () => validateRequiredValue(value),
                                      () => validateDate({ min: minDate, max: maxDate })(value),
                                      () => validateNotHelgedag(value),
                                      () => validateFraværDagCollision(valgtDato, disabledDateRanges),
                                  ])
                            : (value) =>
                                  validateAll([
                                      () => validateRequiredValue(value),
                                      () => validateDate({ min: minDate, max: maxDate }),
                                  ]),
                        onChange: () => {
                            setTimeout(() => {
                                formik.validateField(FraværDagFormFields.dato);
                            });
                        },
                    };

                    return (
                        <FraværDagForm.Form
                            onCancel={onCancel}
                            fieldErrorRenderer={getFieldErrorRenderer(intl, 'fraværDagForm')}
                            summaryFieldErrorRenderer={getSummaryFieldErrorRenderer(intl, 'fraværDagForm')}>
                            <Systemtittel tag="h1">{formLabels.tittel}</Systemtittel>
                            {headerContent && <Box>{headerContent}</Box>}
                            <FormBlock>
                                <FraværDagForm.DatePicker {...datepickerProps} description={dagDescription} />
                            </FormBlock>
                            <FormBlock>
                                <FraværTimerSelect
                                    name={FraværDagFormFields.timerArbeidsdag}
                                    validate={validateRequiredValue}
                                    label={formLabels.antallArbeidstimer}
                                    maksTid={maksArbeidstidPerDag}
                                />
                            </FormBlock>
                            <FormBlock>
                                <FraværTimerSelect
                                    name={FraværDagFormFields.timerFravær}
                                    validate={(value) =>
                                        validateAll([
                                            () => validateRequiredValue(value),
                                            () => validateLessOrEqualTo(toMaybeNumber(values.timerArbeidsdag))(value),
                                        ])
                                    }
                                    label={formLabels.timerFravær}
                                    maksTid={maksArbeidstidPerDag}
                                />
                            </FormBlock>
                            <FormBlock>
                                <FraværDagForm.YesOrNoQuestion
                                    legend={formLabels.hjemmePgaKorona}
                                    name={FraværDagFormFields.hjemmePgaKorona}
                                    validate={validateYesOrNoIsAnswered}
                                    description={
                                        <ExpandableInfo title={intlHelper(intl, 'info.smittevern.tittel')}>
                                            <FormattedHtmlMessage id="info.smittevern.info.html" />
                                        </ExpandableInfo>
                                    }
                                />
                            </FormBlock>
                            {values.hjemmePgaKorona === YesOrNo.YES && (
                                <FormBlock>
                                    <FraværDagForm.RadioPanelGroup
                                        legend={formLabels.årsak}
                                        name={FraværDagFormFields.årsak}
                                        validate={validateRequiredValue}
                                        radios={fraværÅrsakRadios}
                                        description={<ÅrsakInfo />}
                                    />
                                </FormBlock>
                            )}
                        </FraværDagForm.Form>
                    );
                }}
            />
        </>
    );
};

export default FraværDagFormView;
