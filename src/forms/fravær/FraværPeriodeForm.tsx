import React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { commonFieldErrorRenderer } from '@navikt/sif-common-core/lib/utils/commonFieldErrorRenderer';
import { DateRange, dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import dateRangeValidation from '@navikt/sif-common-core/lib/validation/dateRangeValidation';
import {
    validateRequiredField,
    validateYesOrNoIsAnswered,
} from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { getTypedFormComponents, ISOStringToDate } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import { Systemtittel } from 'nav-frontend-typografi';
import FormattedHtmlMessage from '../components/formatted-html-message/FormattedHtmlMessage';
import { isFraværPeriode, mapFormValuesToFraværPeriode, mapFraværPeriodeToFormValues } from './fraværUtilities';
import {
    validateAll,
    validateErSammeÅr,
    validateFraOgMedForCollision,
    validateFraværPeriodeCollision,
    validateNotHelgedag,
    validateTilOgMedForCollision,
} from './fraværValidationUtils';
import { getFraværÅrsakRadios } from './fraværÅrsakRadios';
import { FraværPeriode, FraværPeriodeFormValues } from './types';
import ÅrsakInfo from './ÅrsakInfo';

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

const Form = getTypedFormComponents<FraværPeriodeFormFields, FraværPeriodeFormValues>();

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
                            fieldErrorRenderer={(error) => commonFieldErrorRenderer(intl, error)}>
                            <Systemtittel tag="h1">{formLabels.tittel}</Systemtittel>
                            {headerContent && <Box margin="l">{headerContent}</Box>}
                            <FormBlock>
                                <Form.DateIntervalPicker
                                    legend={formLabels.tidsrom}
                                    description={periodeDescription}
                                    validate={() => {
                                        return validateFraværPeriodeCollision(fromDate, toDate, disabledDateRanges);
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
                                        validate: validateAll<string>([
                                            ...(helgedagerIkkeTillat ? [validateNotHelgedag] : []),
                                            ...(begrensTilSammeÅr
                                                ? [(dateString) => validateErSammeÅr(dateString, tilOgMed)]
                                                : []),
                                            () => validateFraOgMedForCollision(fromDate, disabledDateRanges),
                                            (dateString) =>
                                                dateRangeValidation.validateFromDate(
                                                    ISOStringToDate(dateString),
                                                    minDate,
                                                    maxDate,
                                                    toDate
                                                ),
                                        ]),
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
                                        validate: validateAll<string>([
                                            ...(helgedagerIkkeTillat ? [validateNotHelgedag] : []),
                                            ...(begrensTilSammeÅr
                                                ? [(dateString) => validateErSammeÅr(fraOgMed, dateString)]
                                                : []),
                                            () => validateTilOgMedForCollision(toDate, disabledDateRanges),
                                            (dateString) =>
                                                dateRangeValidation.validateToDate(
                                                    ISOStringToDate(dateString),
                                                    minDate,
                                                    maxDate,
                                                    fromDate
                                                ),
                                        ]),
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
                                    validate={validateYesOrNoIsAnswered}
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
                                        validate={validateRequiredField}
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

export default FraværPeriodeForm;
