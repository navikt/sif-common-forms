import React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import { commonFieldErrorRenderer } from '@navikt/sif-common-core/lib/utils/commonFieldErrorRenderer';
import { date3YearsAgo, date4YearsAgo, dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import {
    validateOrgNumber,
    validatePhoneNumber,
    validateRequiredField,
    validateRequiredList,
    validateRequiredNumber,
    validateYesOrNoIsAnswered,
} from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { hasValue } from '@navikt/sif-common-core/lib/validation/hasValue';
import { FormikYesOrNoQuestion, getTypedFormComponents, YesOrNo } from '@navikt/sif-common-formik/lib';
import { FormikProps } from 'formik';
import moment from 'moment';
import { Systemtittel } from 'nav-frontend-typografi';
import InfoTilFisker from './parts/InfoTilFisker';
import {
    isVirksomhet,
    Næringstype,
    Virksomhet,
    VirksomhetFormField,
    VirksomhetFormValues,
    VirksomhetHideFields,
} from './types';
import { harFiskerNæringstype, mapFormValuesToVirksomhet, mapVirksomhetToFormValues } from './virksomhetUtils';

interface Props {
    virksomhet?: Virksomhet;
    hideFormFields?: VirksomhetHideFields;
    onSubmit: (oppdrag: Virksomhet) => void;
    onCancel: () => void;
}

const MAKS_INNTEKT = 999999999;

const Form = getTypedFormComponents<VirksomhetFormField, VirksomhetFormValues>();

const visNæringsinntekt = (values: VirksomhetFormValues): boolean => {
    return values.fom?.date !== undefined && moment(values.fom.date).isAfter(date4YearsAgo);
};

const ensureValidNæringsinntekt = (values: VirksomhetFormValues): number | undefined => {
    if (visNæringsinntekt(values)) {
        return values.næringsinntekt;
    }
    return undefined;
};

const VirksomhetForm = ({ onCancel, virksomhet, onSubmit, hideFormFields }: Props) => {
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

    const intl = useIntl();
    const getText = (key: string, value?: any): string => intlHelper(intl, `sifForms.virksomhet.${key}`, value);
    const hideFiskerPåBladB = hideFormFields?.[VirksomhetFormField.fiskerErPåBladB] === true;
    const hideRevisor = hideFormFields?.harRevisor === true;

    return (
        <Form.FormikWrapper
            initialValues={virksomhet ? mapVirksomhetToFormValues(virksomhet) : { næringstyper: [] }}
            onSubmit={onFormikSubmit}
            renderForm={(formik: FormikProps<VirksomhetFormValues>) => {
                const { values, setFieldValue } = formik;
                const { navnPåVirksomheten = 'virksomheten' } = values;
                return (
                    <Form.Form
                        includeValidationSummary={true}
                        onCancel={onCancel}
                        fieldErrorRenderer={(error) => commonFieldErrorRenderer(intl, error)}>
                        <Box padBottom="l">
                            <Systemtittel tag="h1">{getText('form_title')}</Systemtittel>
                        </Box>
                        <Form.CheckboxPanelGroup
                            name={VirksomhetFormField.næringstyper}
                            legend={getText('hvilken_type_virksomhet')}
                            checkboxes={[
                                {
                                    value: Næringstype.FISKER,
                                    label: getText('næringstype_fisker'),
                                },
                                {
                                    value: Næringstype.JORDBRUK,
                                    label: getText('næringstype_jordbruker'),
                                },
                                {
                                    value: Næringstype.DAGMAMMA,
                                    label: getText('næringstype_dagmamma'),
                                },
                                {
                                    value: Næringstype.ANNEN,
                                    label: getText('næringstype_annet'),
                                },
                            ]}
                            validate={validateRequiredList}
                        />

                        {harFiskerNæringstype(values.næringstyper || []) && hideFiskerPåBladB !== true && (
                            <Box margin="xl">
                                <FormikYesOrNoQuestion<VirksomhetFormField>
                                    name={VirksomhetFormField.fiskerErPåBladB}
                                    legend={getText('fisker_blad_b')}
                                    validate={validateYesOrNoIsAnswered}
                                />
                            </Box>
                        )}

                        <Box margin="xl">
                            <Form.Input
                                name={VirksomhetFormField.navnPåVirksomheten}
                                label={getText('hva_heter_virksomheten')}
                                validate={validateRequiredField}
                                maxLength={50}
                            />
                        </Box>

                        {harFiskerNæringstype(values.næringstyper || []) &&
                            values.navnPåVirksomheten !== undefined &&
                            hasValue(navnPåVirksomheten) && (
                                <Box margin="xl">
                                    <InfoTilFisker navnPåVirksomheten={values.navnPåVirksomheten} />
                                </Box>
                            )}

                        <Box margin="xl">
                            <Form.YesOrNoQuestion
                                name={VirksomhetFormField.registrertINorge}
                                legend={getText('registert_i_norge', { navnPåVirksomheten })}
                                validate={validateYesOrNoIsAnswered}
                            />
                        </Box>

                        {values.registrertINorge === YesOrNo.NO && (
                            <Box margin="xl">
                                <Form.CountrySelect
                                    name={VirksomhetFormField.registrertILand}
                                    label={getText('registert_i_hvilket_land', { navnPåVirksomheten })}
                                    validate={validateRequiredField}
                                    useAlpha3Code={true}
                                />
                            </Box>
                        )}

                        {values.registrertINorge === YesOrNo.YES && (
                            <Box margin="xl">
                                <Form.Input
                                    name={VirksomhetFormField.organisasjonsnummer}
                                    label={getText('organisasjonsnummer')}
                                    style={{ maxWidth: '10rem' }}
                                    maxLength={9}
                                    validate={(value) =>
                                        validateOrgNumber(value, values.registrertINorge === YesOrNo.YES)
                                    }
                                />
                            </Box>
                        )}

                        {(values.registrertINorge === YesOrNo.YES || values.registrertINorge === YesOrNo.NO) && (
                            <Box margin="xl">
                                <Form.DateRangePicker
                                    legend={getText('startdato', { navnPåVirksomheten })}
                                    showYearSelector={true}
                                    maxDate={dateToday}
                                    fromInputProps={{
                                        label: getText('kalender_fom'),
                                        name: VirksomhetFormField.fom,
                                        validate: validateRequiredField,
                                    }}
                                    toInputProps={{
                                        label: getText('kalender_tom'),
                                        name: VirksomhetFormField.tom,
                                        disabled: values.erPågående === true,
                                    }}
                                />
                                <Form.Checkbox
                                    label={getText('kalender_pågående')}
                                    name={VirksomhetFormField.erPågående}
                                    afterOnChange={(checked) => {
                                        if (checked) {
                                            setFieldValue(VirksomhetFormField.tom, undefined);
                                        }
                                    }}
                                />
                            </Box>
                        )}

                        {values.fom?.date && moment(values.fom.date).isAfter(date4YearsAgo) && (
                            <>
                                <Box margin="xl">
                                    <Form.Input
                                        name={VirksomhetFormField.næringsinntekt}
                                        label={getText('næringsinntekt')}
                                        type="number"
                                        maxLength={10}
                                        max={MAKS_INNTEKT}
                                        style={{ maxWidth: '10rem' }}
                                        validate={validateRequiredNumber({ min: 0, max: MAKS_INNTEKT })}
                                        description={
                                            <ExpandableInfo title={getText('næringsinntekt_info_title')}>
                                                {getText('næringsinntekt_info')}
                                            </ExpandableInfo>
                                        }
                                    />
                                </Box>
                                <Box margin="xl">
                                    <Form.YesOrNoQuestion
                                        name={
                                            VirksomhetFormField.harBlittYrkesaktivILøpetAvDeTreSisteFerdigliknedeÅrene
                                        }
                                        legend={getText('har_blitt_yrkesaktiv')}
                                        validate={validateYesOrNoIsAnswered}
                                        description={
                                            <ExpandableInfo title={getText('har_blitt_yrkesaktiv_info_title')}>
                                                {getText('har_blitt_yrkesaktiv_info')}
                                            </ExpandableInfo>
                                        }
                                    />
                                </Box>
                                {values.harBlittYrkesaktivILøpetAvDeTreSisteFerdigliknedeÅrene === YesOrNo.YES && (
                                    <FormBlock margin="m">
                                        <ResponsivePanel>
                                            <Form.DatePicker
                                                name={VirksomhetFormField.oppstartsdato}
                                                label={getText('har_blitt_yrkesaktiv_dato')}
                                                showYearSelector={true}
                                                minDate={date3YearsAgo}
                                                maxDate={dateToday}
                                                validate={validateRequiredField}
                                            />
                                        </ResponsivePanel>
                                    </FormBlock>
                                )}
                            </>
                        )}
                        {values.fom?.date && moment(values.fom.date).isAfter(date4YearsAgo) === false && (
                            <>
                                <Box margin="xl">
                                    <Form.YesOrNoQuestion
                                        name={VirksomhetFormField.hattVarigEndringAvNæringsinntektSiste4Kalenderår}
                                        legend={getText('varig_endring_spm')}
                                        validate={validateYesOrNoIsAnswered}
                                    />
                                </Box>
                                {values.hattVarigEndringAvNæringsinntektSiste4Kalenderår === YesOrNo.YES && (
                                    <>
                                        <Box margin="xl">
                                            <Form.DatePicker
                                                name={VirksomhetFormField.varigEndringINæringsinntekt_dato}
                                                label={getText('varig_endring_dato')}
                                                validate={validateRequiredField}
                                                minDate={date4YearsAgo}
                                                maxDate={dateToday}
                                            />
                                        </Box>
                                        <Box margin="xl">
                                            <Form.Input
                                                name={
                                                    VirksomhetFormField.varigEndringINæringsinntekt_inntektEtterEndring
                                                }
                                                label={getText('varig_endring_inntekt')}
                                                type="number"
                                                maxLength={10}
                                                max={MAKS_INNTEKT}
                                                style={{ maxWidth: '10rem' }}
                                                validate={validateRequiredNumber({ min: 0, max: MAKS_INNTEKT })}
                                            />
                                        </Box>
                                        <Box margin="xl">
                                            <Form.Textarea
                                                name={VirksomhetFormField.varigEndringINæringsinntekt_forklaring}
                                                label={getText('varig_endring_tekst')}
                                                validate={validateRequiredField}
                                                maxLength={1000}
                                            />
                                        </Box>
                                    </>
                                )}
                            </>
                        )}

                        {(values.fom || values.registrertINorge === YesOrNo.YES) && (
                            <>
                                <Box margin="xl">
                                    <Form.YesOrNoQuestion
                                        name={VirksomhetFormField.harRegnskapsfører}
                                        legend={getText('regnskapsfører_spm')}
                                        validate={validateYesOrNoIsAnswered}
                                    />
                                </Box>

                                {values.harRegnskapsfører === YesOrNo.YES && (
                                    <FormBlock margin="m">
                                        <ResponsivePanel>
                                            <Form.Input
                                                name={VirksomhetFormField.regnskapsfører_navn}
                                                label={getText('regnskapsfører_navn')}
                                                validate={validateRequiredField}
                                                maxLength={50}
                                            />
                                            <Box margin="xl">
                                                <Form.Input
                                                    name={VirksomhetFormField.regnskapsfører_telefon}
                                                    label={getText('regnskapsfører_telefon')}
                                                    validate={validatePhoneNumber}
                                                    maxLength={15}
                                                />
                                            </Box>
                                        </ResponsivePanel>
                                    </FormBlock>
                                )}

                                {values.harRegnskapsfører === YesOrNo.NO && hideRevisor === false && (
                                    <>
                                        <Box margin="xl">
                                            <Form.YesOrNoQuestion
                                                name={VirksomhetFormField.harRevisor}
                                                legend={getText('revisor_spm')}
                                                validate={validateYesOrNoIsAnswered}
                                            />
                                        </Box>

                                        {values.harRevisor === YesOrNo.YES && (
                                            <FormBlock margin="m">
                                                <ResponsivePanel>
                                                    <Form.Input
                                                        name={VirksomhetFormField.revisor_navn}
                                                        label={getText('revisor_navn')}
                                                        validate={validateRequiredField}
                                                        maxLength={50}
                                                    />
                                                    <Box margin="xl">
                                                        <Form.Input
                                                            name={VirksomhetFormField.revisor_telefon}
                                                            label={getText('revisor_telefon')}
                                                            validate={validatePhoneNumber}
                                                            maxLength={15}
                                                        />
                                                    </Box>
                                                    <Box margin="xl">
                                                        <Form.YesOrNoQuestion
                                                            name={VirksomhetFormField.kanInnhenteOpplsyningerFraRevisor}
                                                            legend={getText('revisor_fullmakt')}
                                                            validate={validateYesOrNoIsAnswered}
                                                        />
                                                    </Box>
                                                </ResponsivePanel>
                                            </FormBlock>
                                        )}
                                    </>
                                )}
                            </>
                        )}
                        {(values.harRegnskapsfører === YesOrNo.YES ||
                            (values.harRevisor && values.harRevisor !== YesOrNo.UNANSWERED)) && (
                            <Box margin="xl">
                                <CounsellorPanel>
                                    {getText('veileder_innhenter_info.1')}
                                    <br />
                                    {getText('veileder_innhenter_info.2')}
                                </CounsellorPanel>
                            </Box>
                        )}
                    </Form.Form>
                );
            }}
        />
    );
};

export default VirksomhetForm;
