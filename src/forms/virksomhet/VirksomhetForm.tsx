import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import { date3YearsAgo, date4YearsAgo, dateToday, prettifyDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { getTypedFormComponents, ISOStringToDate, YesOrNo } from '@navikt/sif-common-formik/lib';
import {
    getDateRangeValidator,
    getDateValidator,
    getListValidator,
    getNumberValidator,
    getOrgNumberValidator,
    getRequiredFieldValidator,
    getStringValidator,
    getYesOrNoValidator,
    ValidateDateError,
    ValidateDateRangeError,
    ValidateListError,
    ValidateNumberError,
    ValidateOrgNumberError,
    ValidateRequiredFieldError,
    ValidateStringError,
    ValidateYesOrNoError,
} from '@navikt/sif-common-formik/lib/validation';
import getFormErrorHandler from '@navikt/sif-common-formik/lib/validation/intlFormErrorHandler';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import { FormikProps } from 'formik';
import { Systemtittel, Undertittel } from 'nav-frontend-typografi';
import { isVirksomhet, Næringstype, Virksomhet, VirksomhetFormField, VirksomhetFormValues } from './types';
import {
    erVirksomhetRegnetSomNyoppstartet,
    harFiskerNæringstype,
    mapFormValuesToVirksomhet,
    mapVirksomhetToFormValues,
} from './virksomhetUtils';
import { handleDateRangeValidationError } from '../utils';

interface Props {
    virksomhet?: Virksomhet;
    skipOrgNumValidation?: boolean;
    harFlereVirksomheter?: boolean;
    onSubmit: (oppdrag: Virksomhet) => void;
    onCancel: () => void;
}

const MAKS_INNTEKT = 999999999;

export const VirksomhetFormErrors = {
    [VirksomhetFormField.næringstyper]: {
        [ValidateListError.listIsEmpty]: 'virksomhetForm.næringstyper.listIsEmpty',
    },
    [VirksomhetFormField.fiskerErPåBladB]: {
        [ValidateYesOrNoError.yesOrNoIsUnanswered]: 'virksomhetForm.fiskerErPåBladB.yesOrNoIsUnanswered',
    },
    [VirksomhetFormField.navnPåVirksomheten]: {
        [ValidateRequiredFieldError.noValue]: 'virksomhetForm.navnPåVirksomheten.noValue',
    },
    [VirksomhetFormField.registrertINorge]: {
        [ValidateYesOrNoError.yesOrNoIsUnanswered]: 'virksomhetForm.registrertINorge.yesOrNoIsUnanswered',
    },
    [VirksomhetFormField.registrertILand]: {
        [ValidateRequiredFieldError.noValue]: 'virksomhetForm.registrertILand.noValue',
    },
    [VirksomhetFormField.organisasjonsnummer]: {
        [ValidateOrgNumberError.invalidOrgNumberFormat]: 'virksomhetForm.organisasjonsnummer.invalidOrgNumberFormat',
    },
    [VirksomhetFormField.fom]: {
        [ValidateRequiredFieldError.noValue]: 'virksomhetForm.fom.noValue',
        [ValidateDateError.dateAfterMax]: 'virksomhetForm.fom.dateAfterMax',
        [ValidateDateError.invalidDateFormat]: 'virksomhetForm.fom.invalidDateFormat',
        [ValidateDateRangeError.fromDateIsAfterToDate]: 'virksomhetForm.fom.fromDateIsAfterToDate',
    },
    [VirksomhetFormField.tom]: {
        [ValidateRequiredFieldError.noValue]: 'virksomhetForm.tom.noValue',
        [ValidateDateError.dateBeforeMin]: 'virksomhetForm.tom.dateBeforeMin',
        [ValidateDateError.dateAfterMax]: 'virksomhetForm.tom.dateAfterMax',
        [ValidateDateError.invalidDateFormat]: 'virksomhetForm.tom.invalidDateFormat',
        [ValidateDateRangeError.toDateIsBeforeFromDate]: 'virksomhetForm.tom.toDateIsBeforeFromDate',
    },
    [VirksomhetFormField.næringsinntekt]: {
        [ValidateNumberError.invalidNumberFormat]: 'virksomhetForm.næringsinntekt.invalidNumberFormat',
        [ValidateNumberError.numberIsTooSmall]: 'virksomhetForm.næringsinntekt.numberIsTooSmall',
        [ValidateNumberError.numberIsTooLarge]: 'virksomhetForm.næringsinntekt.numberIsTooLarge',
    },
    [VirksomhetFormField.harBlittYrkesaktivILøpetAvDeTreSisteFerdigliknedeÅrene]: {
        [ValidateYesOrNoError.yesOrNoIsUnanswered]:
            'virksomhetForm.harBlittYrkesaktivILøpetAvDeTreSisteFerdigliknedeÅrene.yesOrNoIsUnanswered',
    },
    [VirksomhetFormField.blittYrkesaktivDato]: {
        [ValidateRequiredFieldError.noValue]: 'virksomhetForm.blittYrkesaktivDato.noValue',
        [ValidateDateError.invalidDateFormat]: 'virksomhetForm.blittYrkesaktivDato.invalidDateFormat',
        [ValidateDateError.dateAfterMax]: 'virksomhetForm.blittYrkesaktivDato.dateAfterMax',
        [ValidateDateError.dateBeforeMin]: 'virksomhetForm.blittYrkesaktivDato.dateBeforeMin',
    },
    [VirksomhetFormField.hattVarigEndringAvNæringsinntektSiste4Kalenderår]: {
        [ValidateYesOrNoError.yesOrNoIsUnanswered]:
            'virksomhetForm.hattVarigEndringAvNæringsinntektSiste4Kalenderår.yesOrNoIsUnanswered',
    },
    [VirksomhetFormField.varigEndringINæringsinntekt_dato]: {
        [ValidateRequiredFieldError.noValue]: 'virksomhetForm.varigEndringINæringsinntekt_dato.noValue',
        [ValidateDateError.invalidDateFormat]: 'virksomhetForm.varigEndringINæringsinntekt_dato.invalidDateFormat',
        [ValidateDateError.dateAfterMax]: 'virksomhetForm.varigEndringINæringsinntekt_dato.dateAfterMax',
        [ValidateDateError.dateBeforeMin]: 'virksomhetForm.varigEndringINæringsinntekt_dato.dateBeforeMin',
    },
    [VirksomhetFormField.varigEndringINæringsinntekt_inntektEtterEndring]: {
        [ValidateRequiredFieldError.noValue]: 'virksomhetForm.varigEndringINæringsinntekt_inntektEtterEndring.noValue',
        [ValidateNumberError.invalidNumberFormat]:
            'virksomhetForm.varigEndringINæringsinntekt_inntektEtterEndring.invalidNumberFormat',
        [ValidateNumberError.numberIsTooLarge]:
            'virksomhetForm.varigEndringINæringsinntekt_inntektEtterEndring.numberIsTooLarge',
        [ValidateNumberError.numberIsTooSmall]:
            'virksomhetForm.varigEndringINæringsinntekt_inntektEtterEndring.numberIsTooSmall',
    },
    [VirksomhetFormField.varigEndringINæringsinntekt_forklaring]: {
        [ValidateRequiredFieldError.noValue]: 'virksomhetForm.varigEndringINæringsinntekt_forklaring.noValue',
        [ValidateStringError.stringIsTooLong]: 'virksomhetForm.varigEndringINæringsinntekt_forklaring.stringIsTooLong',
        [ValidateStringError.stringIsTooShort]:
            'virksomhetForm.varigEndringINæringsinntekt_forklaring.stringIsTooShort',
    },
    [VirksomhetFormField.harRegnskapsfører]: {
        [ValidateYesOrNoError.yesOrNoIsUnanswered]: 'virksomhetForm.harRegnskapsfører.yesOrNoIsUnanswered',
    },
    [VirksomhetFormField.regnskapsfører_navn]: {
        [ValidateRequiredFieldError.noValue]: 'virksomhetForm.regnskapsfører_navn.noValue',
        [ValidateStringError.stringIsTooLong]: 'virksomhetForm.regnskapsfører_navn.stringIsTooLong',
        [ValidateStringError.stringIsTooShort]: 'virksomhetForm.regnskapsfører_navn.stringIsTooShort',
    },
    [VirksomhetFormField.regnskapsfører_telefon]: {
        [ValidateRequiredFieldError.noValue]: 'virksomhetForm.regnskapsfører_telefon.noValue',
        [ValidateStringError.stringIsTooLong]: 'virksomhetForm.regnskapsfører_telefon.stringIsTooLong',
        [ValidateStringError.stringIsTooShort]: 'virksomhetForm.regnskapsfører_telefon.stringIsTooShort',
    },
};

const Form = getTypedFormComponents<VirksomhetFormField, VirksomhetFormValues, ValidationError>();

const visNæringsinntekt = (values: VirksomhetFormValues): boolean => {
    const fomDate = ISOStringToDate(values.fom);
    return fomDate !== undefined && erVirksomhetRegnetSomNyoppstartet(fomDate);
};

const ensureValidNæringsinntekt = (values: VirksomhetFormValues): number | undefined => {
    if (visNæringsinntekt(values)) {
        return values.næringsinntekt;
    }
    return undefined;
};

const VirksomhetForm = ({ virksomhet, harFlereVirksomheter, onSubmit, onCancel, skipOrgNumValidation }: Props) => {
    const intl = useIntl();
    const getText = (key: string, value?: any): string => intlHelper(intl, `${key}`, value);

    const onFormikSubmit = (values: VirksomhetFormValues) => {
        const virksomhetToSubmit = mapFormValuesToVirksomhet(values, virksomhet?.id);
        if (isVirksomhet(virksomhetToSubmit)) {
            onSubmit({
                ...virksomhetToSubmit,
                næringsinntekt: ensureValidNæringsinntekt(values),
            });
        } else {
            throw new Error('VirksomhetForm: Formvalues is not a valid Virksomhet on submit.');
        }
    };

    return (
        <Form.FormikWrapper
            initialValues={virksomhet ? mapVirksomhetToFormValues(virksomhet) : { næringstyper: [] }}
            onSubmit={onFormikSubmit}
            renderForm={(formik: FormikProps<VirksomhetFormValues>) => {
                const { values, setFieldValue } = formik;
                const { navnPåVirksomheten = 'virksomheten', næringstyper = [] } = values;
                const fomDate = ISOStringToDate(values.fom);
                const tomDate = ISOStringToDate(values.tom);
                return (
                    <Form.Form
                        includeValidationSummary={true}
                        onCancel={onCancel}
                        formErrorHandler={getFormErrorHandler(intl, 'virksomhetForm')}>
                        <Box padBottom="l">
                            <Systemtittel tag="h1">
                                {harFlereVirksomheter
                                    ? getText('sifForms.virksomhet.form_title.flere')
                                    : getText('sifForms.virksomhet.form_title')}
                            </Systemtittel>
                        </Box>

                        <Form.CheckboxPanelGroup
                            name={VirksomhetFormField.næringstyper}
                            legend={getText('sifForms.virksomhet.hvilken_type_virksomhet')}
                            checkboxes={[
                                {
                                    value: Næringstype.FISKE,
                                    label: getText(`sifForms.virksomhet.næringstype_${Næringstype.FISKE}`),
                                },
                                {
                                    value: Næringstype.JORDBRUK_SKOGBRUK,
                                    label: getText(`sifForms.virksomhet.næringstype_${Næringstype.JORDBRUK_SKOGBRUK}`),
                                },
                                {
                                    value: Næringstype.DAGMAMMA,
                                    label: getText(`sifForms.virksomhet.næringstype_${Næringstype.DAGMAMMA}`),
                                },
                                {
                                    value: Næringstype.ANNEN,
                                    label: getText(`sifForms.virksomhet.næringstype_${Næringstype.ANNEN}`),
                                },
                            ]}
                            validate={getListValidator({ required: true })}
                        />

                        {harFiskerNæringstype(næringstyper) && (
                            <Box margin="xl">
                                <Form.YesOrNoQuestion
                                    name={VirksomhetFormField.fiskerErPåBladB}
                                    legend={getText('sifForms.virksomhet.fisker_blad_b')}
                                    validate={getYesOrNoValidator()}
                                />
                            </Box>
                        )}

                        <Box margin="xl">
                            <Form.Input
                                name={VirksomhetFormField.navnPåVirksomheten}
                                label={getText('sifForms.virksomhet.hva_heter_virksomheten')}
                                validate={getRequiredFieldValidator()}
                                maxLength={50}
                            />
                        </Box>

                        <Box margin="xl">
                            <Form.YesOrNoQuestion
                                name={VirksomhetFormField.registrertINorge}
                                legend={getText('sifForms.virksomhet.registert_i_norge', { navnPåVirksomheten })}
                                validate={getYesOrNoValidator()}
                                description={
                                    harFiskerNæringstype(næringstyper) ? (
                                        <ExpandableInfo
                                            title={intlHelper(intl, 'sifForms.virksomhet.veileder_fisker.tittel')}>
                                            <FormattedMessage
                                                id="sifForms.virksomhet.veileder_fisker"
                                                values={{ navnPåVirksomheten }}
                                            />
                                        </ExpandableInfo>
                                    ) : undefined
                                }
                            />
                        </Box>

                        {values.registrertINorge === YesOrNo.NO && (
                            <Box margin="xl">
                                <Form.CountrySelect
                                    name={VirksomhetFormField.registrertILand}
                                    label={getText('sifForms.virksomhet.registert_i_hvilket_land', {
                                        navnPåVirksomheten,
                                    })}
                                    validate={getRequiredFieldValidator()}
                                    useAlpha3Code={true}
                                />
                            </Box>
                        )}

                        {values.registrertINorge === YesOrNo.YES && (
                            <Box margin="xl">
                                <Form.Input
                                    name={VirksomhetFormField.organisasjonsnummer}
                                    label={getText('sifForms.virksomhet.organisasjonsnummer')}
                                    style={{ maxWidth: '10rem' }}
                                    maxLength={9}
                                    validate={
                                        skipOrgNumValidation ? undefined : getOrgNumberValidator({ required: true })
                                    }
                                />
                            </Box>
                        )}

                        {(values.registrertINorge === YesOrNo.YES || values.registrertINorge === YesOrNo.NO) && (
                            <Box margin="xl">
                                <Form.DateRangePicker
                                    legend={getText('sifForms.virksomhet.startdato', { navnPåVirksomheten })}
                                    showYearSelector={true}
                                    maxDate={dateToday}
                                    fromInputProps={{
                                        label: getText('sifForms.virksomhet.kalender_fom'),
                                        name: VirksomhetFormField.fom,
                                        validate: (value) => {
                                            const error = getDateRangeValidator.validateFromDate({
                                                required: true,
                                                max: dateToday,
                                                toDate: tomDate,
                                            })(value);
                                            if (error === ValidateDateError.dateAfterMax) {
                                                return {
                                                    key: error,
                                                    values: { dato: prettifyDate(dateToday) },
                                                };
                                            }
                                            return error;
                                        },
                                    }}
                                    toInputProps={{
                                        label: getText('sifForms.virksomhet.kalender_tom'),
                                        name: VirksomhetFormField.tom,
                                        disabled: values.erPågående === true,
                                        validate:
                                            values.erPågående === true
                                                ? undefined
                                                : (value) => {
                                                      const error = getDateRangeValidator.validateToDate({
                                                          required: true,
                                                          max: dateToday,
                                                          fromDate: fomDate,
                                                      })(value);
                                                      return handleDateRangeValidationError(
                                                          error,
                                                          undefined,
                                                          dateToday
                                                      );
                                                  },
                                    }}
                                />
                                <Form.Checkbox
                                    label={getText('sifForms.virksomhet.kalender_pågående')}
                                    name={VirksomhetFormField.erPågående}
                                    afterOnChange={(checked) => {
                                        if (checked) {
                                            setFieldValue(VirksomhetFormField.tom, undefined);
                                        }
                                    }}
                                />
                            </Box>
                        )}

                        {fomDate && (
                            <>
                                {harFlereVirksomheter && (
                                    <Box margin="xxl">
                                        {erVirksomhetRegnetSomNyoppstartet(fomDate) ? (
                                            <>
                                                <Undertittel>
                                                    {getText(
                                                        'sifForms.virksomhet.nyoppstartet.næringsinntektFlere.header'
                                                    )}
                                                </Undertittel>
                                                <p>
                                                    {getText(
                                                        'sifForms.virksomhet.nyoppstartet.næringsinntektFlere.info'
                                                    )}
                                                </p>
                                            </>
                                        ) : (
                                            <>
                                                <Undertittel>
                                                    {getText(
                                                        'sifForms.virksomhet.ikkeNyoppstartet.næringsinntektFlere.header'
                                                    )}
                                                </Undertittel>
                                                <p>
                                                    {getText(
                                                        'sifForms.virksomhet.ikkeNyoppstaret.næringsinntektFlere.info'
                                                    )}
                                                </p>
                                            </>
                                        )}
                                    </Box>
                                )}

                                {/* Nyoppstartet  */}
                                {erVirksomhetRegnetSomNyoppstartet(fomDate) && (
                                    <>
                                        <Box margin="xl">
                                            <Form.NumberInput
                                                name={VirksomhetFormField.næringsinntekt}
                                                label={
                                                    harFlereVirksomheter
                                                        ? getText(
                                                              'sifForms.virksomhet.næringsinntekt.flereVirksomheter.spm'
                                                          )
                                                        : getText('sifForms.virksomhet.næringsinntekt.enVirksomhet.spm')
                                                }
                                                maxLength={10}
                                                style={{ maxWidth: '10rem' }}
                                                validate={(value) => {
                                                    const error = getNumberValidator({ min: 0, max: MAKS_INNTEKT })(
                                                        value
                                                    );
                                                    if (error === ValidateNumberError.numberIsTooLarge) {
                                                        return {
                                                            key: error,
                                                            values: { min: MAKS_INNTEKT },
                                                        };
                                                    }
                                                    if (error === ValidateNumberError.numberIsTooSmall) {
                                                        return {
                                                            key: error,
                                                            values: { min: 0 },
                                                        };
                                                    }
                                                    return error;
                                                }}
                                                description={
                                                    <>
                                                        {harFlereVirksomheter
                                                            ? getText(
                                                                  'sifForms.virksomhet.næringsinntekt.flereVirksomheter.spm.description'
                                                              )
                                                            : getText(
                                                                  'sifForms.virksomhet.næringsinntekt.enVirksomhet.spm.description'
                                                              )}
                                                        <ExpandableInfo
                                                            title={getText(
                                                                'sifForms.virksomhet.hvaErNæringsresultat.title'
                                                            )}>
                                                            {harFlereVirksomheter
                                                                ? getText(
                                                                      'sifForms.virksomhet.hvaErNæringsresultat.flereVirksomheter.text'
                                                                  )
                                                                : getText(
                                                                      'sifForms.virksomhet.hvaErNæringsresultat.enVirksomhet.text'
                                                                  )}
                                                        </ExpandableInfo>
                                                    </>
                                                }
                                            />
                                        </Box>
                                        <Box margin="xl">
                                            <Form.YesOrNoQuestion
                                                name={
                                                    VirksomhetFormField.harBlittYrkesaktivILøpetAvDeTreSisteFerdigliknedeÅrene
                                                }
                                                legend={getText('sifForms.virksomhet.har_blitt_yrkesaktiv')}
                                                validate={getYesOrNoValidator()}
                                                description={
                                                    <ExpandableInfo
                                                        title={getText(
                                                            'sifForms.virksomhet.har_blitt_yrkesaktiv_info_title'
                                                        )}>
                                                        {getText('sifForms.virksomhet.har_blitt_yrkesaktiv_info')}
                                                    </ExpandableInfo>
                                                }
                                            />
                                        </Box>
                                        {values.harBlittYrkesaktivILøpetAvDeTreSisteFerdigliknedeÅrene ===
                                            YesOrNo.YES && (
                                            <FormBlock margin="m">
                                                <ResponsivePanel>
                                                    <Form.DatePicker
                                                        name={VirksomhetFormField.blittYrkesaktivDato}
                                                        label={getText('sifForms.virksomhet.har_blitt_yrkesaktiv_dato')}
                                                        showYearSelector={true}
                                                        minDate={date3YearsAgo}
                                                        maxDate={dateToday}
                                                        validate={getDateValidator({
                                                            required: true,
                                                            max: dateToday,
                                                            min: date3YearsAgo,
                                                        })}
                                                    />
                                                </ResponsivePanel>
                                            </FormBlock>
                                        )}
                                    </>
                                )}

                                {/* Ikke nyoppstartet */}
                                {erVirksomhetRegnetSomNyoppstartet(fomDate) === false && (
                                    <>
                                        <Box margin="xl">
                                            <Form.YesOrNoQuestion
                                                name={
                                                    VirksomhetFormField.hattVarigEndringAvNæringsinntektSiste4Kalenderår
                                                }
                                                legend={getText('sifForms.virksomhet.varig_endring_spm')}
                                                validate={getYesOrNoValidator()}
                                            />
                                        </Box>
                                        {values.hattVarigEndringAvNæringsinntektSiste4Kalenderår === YesOrNo.YES && (
                                            <>
                                                <Box margin="xl">
                                                    <Form.DatePicker
                                                        name={VirksomhetFormField.varigEndringINæringsinntekt_dato}
                                                        label={getText('sifForms.virksomhet.varig_endring_dato')}
                                                        validate={getDateValidator({
                                                            required: true,
                                                            min: date4YearsAgo,
                                                            max: dateToday,
                                                        })}
                                                        minDate={date4YearsAgo}
                                                        maxDate={dateToday}
                                                    />
                                                </Box>
                                                <Box margin="xl">
                                                    <Form.NumberInput
                                                        name={
                                                            VirksomhetFormField.varigEndringINæringsinntekt_inntektEtterEndring
                                                        }
                                                        label={getText('sifForms.virksomhet.varig_endring_inntekt')}
                                                        maxLength={10}
                                                        style={{ maxWidth: '10rem' }}
                                                        validate={getNumberValidator({
                                                            required: true,
                                                            min: 0,
                                                            max: MAKS_INNTEKT,
                                                        })}
                                                    />
                                                </Box>
                                                <Box margin="xl">
                                                    <Form.Textarea
                                                        name={
                                                            VirksomhetFormField.varigEndringINæringsinntekt_forklaring
                                                        }
                                                        label={getText('sifForms.virksomhet.varig_endring_tekst')}
                                                        validate={(value) => {
                                                            const error = getStringValidator({
                                                                required: true,
                                                                minLength: 5,
                                                                maxLength: 1000,
                                                            })(value);
                                                            if (error === ValidateStringError.stringIsTooShort) {
                                                                return {
                                                                    key: error,
                                                                    values: { lengde: 5 },
                                                                };
                                                            }
                                                            if (error === ValidateStringError.stringIsTooLong) {
                                                                return {
                                                                    key: error,
                                                                    values: { lengde: 1000 },
                                                                };
                                                            }
                                                            return error;
                                                        }}
                                                        maxLength={1000}
                                                    />
                                                </Box>
                                            </>
                                        )}
                                    </>
                                )}

                                {values.registrertINorge === YesOrNo.YES && (
                                    <>
                                        <Box margin="xl">
                                            <Form.YesOrNoQuestion
                                                name={VirksomhetFormField.harRegnskapsfører}
                                                legend={getText('sifForms.virksomhet.regnskapsfører_spm')}
                                                validate={getYesOrNoValidator()}
                                            />
                                        </Box>
                                        {values.harRegnskapsfører === YesOrNo.YES && (
                                            <FormBlock margin="m">
                                                <ResponsivePanel>
                                                    <Form.Input
                                                        name={VirksomhetFormField.regnskapsfører_navn}
                                                        label={getText('sifForms.virksomhet.regnskapsfører_navn')}
                                                        validate={(value) => {
                                                            const error = getStringValidator({
                                                                required: true,
                                                                minLength: 3,
                                                                maxLength: 50,
                                                            })(value);
                                                            if (error === ValidateStringError.stringIsTooShort) {
                                                                return {
                                                                    key: error,
                                                                    values: { lengde: 5 },
                                                                };
                                                            }
                                                            if (error === ValidateStringError.stringIsTooLong) {
                                                                return {
                                                                    key: error,
                                                                    values: { lengde: 1000 },
                                                                };
                                                            }
                                                            return error;
                                                        }}
                                                        maxLength={50}
                                                    />
                                                    <Box margin="xl">
                                                        <Form.Input
                                                            name={VirksomhetFormField.regnskapsfører_telefon}
                                                            label={getText(
                                                                'sifForms.virksomhet.regnskapsfører_telefon'
                                                            )}
                                                            validate={(value) => {
                                                                const error = getStringValidator({
                                                                    required: true,
                                                                    minLength: 5,
                                                                    maxLength: 15,
                                                                })(value);
                                                                if (error === ValidateStringError.stringIsTooShort) {
                                                                    return {
                                                                        key: error,
                                                                        values: { lengde: 5 },
                                                                    };
                                                                }
                                                                if (error === ValidateStringError.stringIsTooLong) {
                                                                    return {
                                                                        key: error,
                                                                        values: { lengde: 1000 },
                                                                    };
                                                                }
                                                                return error;
                                                            }}
                                                            maxLength={15}
                                                        />
                                                    </Box>
                                                </ResponsivePanel>
                                            </FormBlock>
                                        )}
                                    </>
                                )}
                                {values.harRegnskapsfører === YesOrNo.YES && (
                                    <Box margin="xl">
                                        <CounsellorPanel>
                                            {getText('sifForms.virksomhet.veileder_innhenter_info.1')}
                                            <br />
                                            {getText('sifForms.virksomhet.veileder_innhenter_info.2')}
                                        </CounsellorPanel>
                                    </Box>
                                )}
                            </>
                        )}
                    </Form.Form>
                );
            }}
        />
    );
};

export default VirksomhetForm;
