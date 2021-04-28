import React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange, dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { getTypedFormComponents, ISOStringToDate } from '@navikt/sif-common-formik/lib';
import {
    getDateRangeValidator,
    getRequiredFieldValidator,
    getYesOrNoValidator,
    ValidateDateError,
    ValidateDateRangeError,
    ValidateRequiredFieldError,
    ValidateYesOrNoError,
} from '@navikt/sif-common-formik/lib/validation';
import getFormErrorHandler from '@navikt/sif-common-formik/lib/validation/intlFormErrorHandler';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import dayjs from 'dayjs';
import { Systemtittel } from 'nav-frontend-typografi';
import FormattedHtmlMessage from '../components/formatted-html-message/FormattedHtmlMessage';
import { isFraværPeriode, mapFormValuesToFraværPeriode, mapFraværPeriodeToFormValues } from './fraværUtilities';
import {
    FraværFieldValidationErrors,
    validateErSammeÅr,
    validateFraOgMedForCollision,
    validateFraværPeriodeCollision,
    validateNotHelgedag,
    validateTilOgMedForCollision,
} from './fraværValidationUtils';
import { getFraværÅrsakRadios } from './fraværÅrsakRadios';
import { FraværPeriode, FraværPeriodeFormValues } from './types';
import ÅrsakInfo from './ÅrsakInfo';
import { handleDateRangeValidationError } from '../utils';

export interface FraværPeriodeFormLabels {
    tittel: string;
    tidsrom: string;
    fom: string;
    tom: string;
    hjemmePgaKorona: string;
    årsak: string;
    ok: string;
    avbryt: string;
}

interface Props {
    fraværPeriode?: Partial<FraværPeriode>;
    periodeDescription?: JSX.Element;
    minDate: Date;
    maxDate: Date;
    dateRangesToDisable?: DateRange[];
    helgedagerIkkeTillat?: boolean;
    begrensTilSammeÅr?: boolean;
    headerContent?: JSX.Element;
    onSubmit: (values: FraværPeriode) => void;
    onCancel: () => void;
}

enum FraværPeriodeFormFields {
    fraOgMed = 'fraOgMed',
    tilOgMed = 'tilOgMed',
    årsak = 'årsak',
    hjemmePgaKorona = 'hjemmePgaKorona',
}

export const FraværPeriodeFormErrors = {
    [FraværPeriodeFormFields.fraOgMed]: {
        [ValidateRequiredFieldError.noValue]: 'fraværPeriodeForm.fraOgMed.noValue',
        [ValidateDateError.dateAfterMax]: 'fraværPeriodeForm.fraOgMed.dateAfterMax',
        [ValidateDateError.dateBeforeMin]: 'fraværPeriodeForm.fraOgMed.dateBeforeMin',
        [ValidateDateError.invalidDateFormat]: 'fraværPeriodeForm.fraOgMed.invalidDateFormat',
        [ValidateDateRangeError.fromDateIsAfterToDate]: 'fraværPeriodeForm.fraOgMed.fromDateIsAfterToDate',
        [FraværFieldValidationErrors.er_helg]: 'fraværPeriodeForm.fraOgMed.er_helg',
        [FraværFieldValidationErrors.fra_og_til_er_ulike_år]: 'fraværPeriodeForm.fraOgMed.fra_og_til_er_ulike_år',
        [FraværFieldValidationErrors.fra_dato_kolliderer_med_annet_fravær]:
            'fraværPeriodeForm.fraOgMed.fra_dato_kolliderer_med_annet_fravær',
    },
    [FraværPeriodeFormFields.tilOgMed]: {
        [ValidateRequiredFieldError.noValue]: 'fraværPeriodeForm.tilOgMed.noValue',
        [ValidateDateError.dateAfterMax]: 'fraværPeriodeForm.tilOgMed.dateAfterMax',
        [ValidateDateError.dateBeforeMin]: 'fraværPeriodeForm.tilOgMed.dateBeforeMin',
        [ValidateDateError.invalidDateFormat]: 'fraværPeriodeForm.tilOgMed.invalidDateFormat',
        [ValidateDateRangeError.toDateIsBeforeFromDate]: 'fraværPeriodeForm.tilOgMed.toDateIsBeforeFromDate',
        [FraværFieldValidationErrors.er_helg]: 'fraværPeriodeForm.tilOgMed.er_helg',
        [FraværFieldValidationErrors.fra_og_til_er_ulike_år]: 'fraværPeriodeForm.tilOgMed.fra_og_til_er_ulike_år',
        [FraværFieldValidationErrors.til_dato_kolliderer_med_annet_fravær]:
            'fraværPeriodeForm.tilOgMed.til_dato_kolliderer_med_annet_fravær',
    },
    [FraværPeriodeFormFields.årsak]: {
        [ValidateRequiredFieldError.noValue]: 'fraværPeriodeForm.årsak.noValue',
    },
    [FraværPeriodeFormFields.hjemmePgaKorona]: {
        [ValidateYesOrNoError.yesOrNoIsUnanswered]: 'fraværPeriodeForm.årsak.yesOrNoIsUnanswered',
    },
    ['fraOgMed_tilOgMed']: {
        [FraværFieldValidationErrors.dager_overlapper_med_andre_dager]:
            'fraværPeriodeForm.periode.dager_overlapper_med_andre_dager',
    },
};

export const FraværPeriodeFormName = 'fraværPeriodeForm';

const Form = getTypedFormComponents<FraværPeriodeFormFields, FraværPeriodeFormValues, ValidationError>();

const FraværPeriodeForm = ({
    fraværPeriode = {},
    periodeDescription,
    maxDate,
    minDate,
    dateRangesToDisable,
    helgedagerIkkeTillat,
    headerContent,
    begrensTilSammeÅr,
    onSubmit,
    onCancel,
}: Props) => {
    const intl = useIntl();

    const onFormikSubmit = (formValues: FraværPeriodeFormValues) => {
        const fraværPeriodeToSubmit = mapFormValuesToFraværPeriode(formValues, fraværPeriode.id);
        if (isFraværPeriode(fraværPeriodeToSubmit)) {
            onSubmit(fraværPeriodeToSubmit);
        } else {
            throw new Error('FraværPeriodeForm: Formvalues is not a valid FraværPeriode on submit.');
        }
    };

    const formLabels: FraværPeriodeFormLabels = {
        ok: intlHelper(intl, 'fravær.form.felles.ok'),
        avbryt: intlHelper(intl, 'fravær.form.felles.avbryt'),
        årsak: intlHelper(intl, 'fravær.form.felles.årsak'),
        tittel: intlHelper(intl, 'fravær.form.periode.tittel'),
        tidsrom: intlHelper(intl, 'fravær.form.periode.tidsrom'),
        hjemmePgaKorona: intlHelper(intl, 'fravær.form.felles.hjemmePgaKorona'),
        fom: intlHelper(intl, 'fravær.form.periode.fom'),
        tom: intlHelper(intl, 'fravær.form.periode.tom'),
    };
    const fraværÅrsakRadios = getFraværÅrsakRadios(intl);

    const disabledDateRanges = dateRangesToDisable
        ? dateRangesToDisable.filter((range) => {
              const { fraOgMed, tilOgMed } = fraværPeriode;
              return !(
                  fraOgMed &&
                  tilOgMed &&
                  dayjs(fraOgMed).isSame(range.from, 'day') &&
                  dayjs(tilOgMed).isSame(range.to, 'day')
              );
          })
        : undefined;

    return (
        <>
            <Form.FormikWrapper
                initialValues={mapFraværPeriodeToFormValues(fraværPeriode)}
                onSubmit={onFormikSubmit}
                renderForm={(formik) => {
                    const { fraOgMed, tilOgMed } = formik.values;
                    const fromDate: Date | undefined = ISOStringToDate(fraOgMed);
                    const toDate: Date | undefined = ISOStringToDate(tilOgMed);
                    return (
                        <Form.Form
                            onCancel={onCancel}
                            formErrorHandler={getFormErrorHandler(intl, 'fraværPeriodeForm')}>
                            <Systemtittel tag="h1">{formLabels.tittel}</Systemtittel>
                            {headerContent && <Box margin="l">{headerContent}</Box>}
                            <FormBlock>
                                <Form.DateIntervalPicker
                                    legend={formLabels.tidsrom}
                                    description={periodeDescription}
                                    validate={() => {
                                        const err = validateFraværPeriodeCollision(
                                            fromDate,
                                            toDate,
                                            disabledDateRanges
                                        );
                                        if (err) {
                                            return FraværPeriodeFormErrors.fraOgMed_tilOgMed
                                                .dager_overlapper_med_andre_dager;
                                        }
                                    }}
                                    fromDatepickerProps={{
                                        label: formLabels.fom,
                                        name: FraværPeriodeFormFields.fraOgMed,
                                        fullscreenOverlay: true,
                                        minDate: minDate,
                                        maxDate: toDate || maxDate,
                                        disableWeekend: helgedagerIkkeTillat || false,
                                        disabledDateRanges,
                                        dayPickerProps: {
                                            initialMonth:
                                                fromDate || toDate || dayjs(dateToday).isAfter(maxDate)
                                                    ? maxDate
                                                    : dateToday,
                                        },
                                        validate: getFromDateValidator({
                                            begrensTilSammeÅr,
                                            minDate,
                                            maxDate,
                                            helgedagerIkkeTillat,
                                            disabledDateRanges,
                                            toDate,
                                            tilOgMed,
                                        }),
                                        onChange: () => {
                                            setTimeout(() => {
                                                formik.validateField(FraværPeriodeFormFields.fraOgMed);
                                                formik.validateField(FraværPeriodeFormFields.tilOgMed);
                                            });
                                        },
                                    }}
                                    toDatepickerProps={{
                                        label: formLabels.tom,
                                        name: FraværPeriodeFormFields.tilOgMed,
                                        fullscreenOverlay: true,
                                        minDate: fromDate || minDate,
                                        maxDate,
                                        disableWeekend: helgedagerIkkeTillat || false,
                                        disabledDateRanges,
                                        dayPickerProps: {
                                            initialMonth:
                                                toDate || fromDate || dayjs(dateToday).isAfter(maxDate)
                                                    ? maxDate
                                                    : dateToday,
                                        },
                                        validate: getToDateValidator({
                                            begrensTilSammeÅr,
                                            disabledDateRanges,
                                            fraOgMed,
                                            fromDate,
                                            helgedagerIkkeTillat,
                                            maxDate,
                                            minDate,
                                        }),
                                        onChange: () => {
                                            setTimeout(() => {
                                                formik.validateField(FraværPeriodeFormFields.fraOgMed);
                                                formik.validateField(FraværPeriodeFormFields.tilOgMed);
                                            });
                                        },
                                    }}
                                />
                            </FormBlock>
                            <FormBlock>
                                <Form.YesOrNoQuestion
                                    legend={formLabels.hjemmePgaKorona}
                                    name={FraværPeriodeFormFields.hjemmePgaKorona}
                                    validate={getYesOrNoValidator()}
                                    description={
                                        <ExpandableInfo title={intlHelper(intl, 'info.smittevern.tittel')}>
                                            <FormattedHtmlMessage id="info.smittevern.info.html" />
                                        </ExpandableInfo>
                                    }
                                />
                            </FormBlock>

                            {formik.values.hjemmePgaKorona === YesOrNo.YES && (
                                <FormBlock>
                                    <Form.RadioPanelGroup
                                        legend={formLabels.årsak}
                                        name={FraværPeriodeFormFields.årsak}
                                        validate={getRequiredFieldValidator()}
                                        radios={fraværÅrsakRadios}
                                        description={<ÅrsakInfo />}
                                    />
                                </FormBlock>
                            )}
                        </Form.Form>
                    );
                }}
            />
        </>
    );
};

const getFromDateValidator = ({
    helgedagerIkkeTillat,
    begrensTilSammeÅr,
    tilOgMed,
    toDate,
    disabledDateRanges,
    minDate,
    maxDate,
}: {
    helgedagerIkkeTillat?: boolean;
    begrensTilSammeÅr?: boolean;
    tilOgMed?: string;
    toDate?: Date;
    disabledDateRanges?: DateRange[];
    minDate?: Date;
    maxDate?: Date;
}) => (value): ValidationError | undefined => {
    if (helgedagerIkkeTillat && validateNotHelgedag(value)) {
        return {
            key: FraværPeriodeFormErrors.fraOgMed.er_helg,
            keepKeyUnaltered: true,
        };
    }
    if (begrensTilSammeÅr && validateErSammeÅr(value, tilOgMed)) {
        return {
            key: FraværPeriodeFormErrors.fraOgMed.fra_og_til_er_ulike_år,
            keepKeyUnaltered: true,
        };
    }
    if (validateFraOgMedForCollision(toDate, disabledDateRanges)) {
        return {
            key: FraværPeriodeFormErrors.fraOgMed.fra_dato_kolliderer_med_annet_fravær,
            keepKeyUnaltered: true,
        };
    }
    const dateError = getDateRangeValidator.validateFromDate({
        required: true,
        min: minDate,
        max: maxDate,
        toDate,
    })(value);

    return handleDateRangeValidationError(dateError, minDate, maxDate);
};

const getToDateValidator = ({
    helgedagerIkkeTillat,
    begrensTilSammeÅr,
    fraOgMed,
    fromDate,
    disabledDateRanges,
    minDate,
    maxDate,
}: {
    helgedagerIkkeTillat?: boolean;
    begrensTilSammeÅr?: boolean;
    fraOgMed?: string;
    fromDate?: Date;
    disabledDateRanges?: DateRange[];
    minDate?: Date;
    maxDate?: Date;
}) => (value) => {
    if (helgedagerIkkeTillat && validateNotHelgedag(value)) {
        return {
            key: FraværPeriodeFormErrors.tilOgMed.er_helg,
            keepKeyUnaltered: true,
        };
    }
    if (begrensTilSammeÅr && validateErSammeÅr(fraOgMed, value)) {
        return {
            key: FraværPeriodeFormErrors.tilOgMed.fra_og_til_er_ulike_år,
            keepKeyUnaltered: true,
        };
    }
    if (validateTilOgMedForCollision(fromDate, disabledDateRanges)) {
        return {
            key: FraværPeriodeFormErrors.tilOgMed.til_dato_kolliderer_med_annet_fravær,
            keepKeyUnaltered: true,
        };
    }
    const dateError = getDateRangeValidator.validateToDate({
        required: true,
        min: minDate,
        max: maxDate,
        fromDate,
    })(value);
    return handleDateRangeValidationError(dateError, minDate, maxDate);
};
export default FraværPeriodeForm;
