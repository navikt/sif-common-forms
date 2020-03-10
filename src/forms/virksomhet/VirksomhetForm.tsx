import React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import {
    commonFieldErrorRenderer
} from '@navikt/sif-common-core/lib/utils/commonFieldErrorRenderer';
import {
    date3YearsAgo, date4YearsAgo, dateToday
} from '@navikt/sif-common-core/lib/utils/dateUtils';
import {
    validateOrgNumber, validateRequiredField, validateRequiredList, validateYesOrNoIsAnswered
} from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { hasValue } from '@navikt/sif-common-core/lib/validation/hasValue';
import {
    FormikYesOrNoQuestion, getTypedFormComponents, YesOrNo
} from '@navikt/sif-common-formik/lib';
import { FormikProps } from 'formik';
import moment from 'moment';
import { Panel } from 'nav-frontend-paneler';
import { Systemtittel } from 'nav-frontend-typografi';
import { VirksomhetTextNB } from './i18n/virksomhetForm.texts';
import InfoTilFisker from './parts/InfoTilFisker';
import { isVirksomhet, Næringstype, Virksomhet, VirksomhetFormField } from './types';
import { harFiskerNæringstype } from './virksomhetUtils';

interface Props {
    virksomhet?: Virksomhet;
    onSubmit: (oppdrag: Virksomhet) => void;
    onCancel: () => void;
}

const initialValues: FormValues = {
    næringstyper: []
};

type FormValues = Partial<Virksomhet>;

const Form = getTypedFormComponents<VirksomhetFormField, FormValues>();

const VirksomhetForm: React.FunctionComponent<Props> = ({ onCancel, virksomhet = initialValues, onSubmit }) => {
    const onFormikSubmit = (values: Partial<Virksomhet>) => {
        if (isVirksomhet(values)) {
            onSubmit(values);
        } else {
            throw new Error('VirksomhetForm: Formvalues is not a valid Virksomhet on submit.');
        }
    };

    const intl = useIntl();
    const txt = VirksomhetTextNB;

    return (
        <Form.FormikWrapper
            initialValues={virksomhet}
            onSubmit={onFormikSubmit}
            renderForm={(formik: FormikProps<FormValues>) => {
                const { values, setFieldValue } = formik;
                const { navnPåVirksomheten = 'virksomheten' } = values;
                return (
                    <Form.Form
                        includeValidationSummary={true}
                        onCancel={onCancel}
                        fieldErrorRenderer={(error) => commonFieldErrorRenderer(intl, error)}>
                        <Box padBottom="l">
                            <Systemtittel tag="h1">{txt.form_title}</Systemtittel>
                        </Box>
                        <Form.CheckboxPanelGroup
                            name={VirksomhetFormField.næringstyper}
                            legend={txt.hva_heter_virksomheten}
                            checkboxes={[
                                {
                                    value: Næringstype.FISKER,
                                    label: txt.næringstype_fisker
                                },
                                {
                                    value: Næringstype.JORDBRUK,
                                    label: txt.næringstype_jordbruker
                                },
                                {
                                    value: Næringstype.DAGMAMMA,
                                    label: txt.næringstype_dagmamma
                                },
                                {
                                    value: Næringstype.ANNEN,
                                    label: txt.næringstype_annet
                                }
                            ]}
                            validate={validateRequiredList}
                        />

                        {harFiskerNæringstype(values.næringstyper || []) && (
                            <Box margin="xl">
                                <FormikYesOrNoQuestion<VirksomhetFormField>
                                    name={VirksomhetFormField.fiskerErPåBladB}
                                    legend={txt.fisker_blad_b}
                                    validate={validateYesOrNoIsAnswered}
                                />
                            </Box>
                        )}

                        <Box margin="xl">
                            <Form.Input
                                name={VirksomhetFormField.navnPåVirksomheten}
                                label={txt.hva_heter_virksomheten}
                                validate={validateRequiredField}
                            />
                        </Box>

                        {harFiskerNæringstype(values.næringstyper || []) &&
                            values.navnPåVirksomheten !== undefined &&
                            hasValue(navnPåVirksomheten) && (
                                <Box margin="xl">
                                    <InfoTilFisker navnPåNæringen={values.navnPåVirksomheten} />
                                </Box>
                            )}

                        <Box margin="xl">
                            <Form.YesOrNoQuestion
                                name={VirksomhetFormField.registrertINorge}
                                legend={txt.registert_i_norge(navnPåVirksomheten)}
                                validate={validateYesOrNoIsAnswered}
                            />
                        </Box>

                        {values.registrertINorge === YesOrNo.NO && (
                            <Box margin="xl">
                                <Form.CountrySelect
                                    name={VirksomhetFormField.registrertILand}
                                    label={txt.registert_i_hvilket_land(navnPåVirksomheten)}
                                    validate={validateRequiredField}
                                />
                            </Box>
                        )}

                        {values.registrertINorge === YesOrNo.YES && (
                            <Box margin="xl">
                                <Form.Input
                                    name={VirksomhetFormField.organisasjonsnummer}
                                    label={txt.organisasjonsnummer}
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
                                <Form.DateIntervalPicker
                                    legend={txt.startdato(navnPåVirksomheten)}
                                    fromDatepickerProps={{
                                        label: txt.kalender_fom,
                                        name: VirksomhetFormField.fom,
                                        showYearSelector: true,
                                        dateLimitations: {
                                            maksDato: dateToday
                                        },
                                        validate: validateRequiredField
                                    }}
                                    toDatepickerProps={{
                                        label: txt.kalender_tom,
                                        name: VirksomhetFormField.tom,
                                        disabled: values.erPågående === true,
                                        showYearSelector: true,
                                        dateLimitations: {
                                            minDato: values.fom || undefined,
                                            maksDato: dateToday
                                        }
                                    }}
                                />
                                <Form.Checkbox
                                    label={txt.kalender_pågående}
                                    name={VirksomhetFormField.erPågående}
                                    afterOnChange={(checked) => {
                                        if (checked) {
                                            setFieldValue(VirksomhetFormField.tom, undefined);
                                        }
                                    }}
                                />
                            </Box>
                        )}

                        {values.fom && moment(values.fom).isAfter(date4YearsAgo) && (
                            <>
                                <Box margin="xl">
                                    <Form.Input
                                        name={VirksomhetFormField.næringsinntekt}
                                        label={txt.næringsinntekt}
                                        validate={validateRequiredField}
                                        type="number"
                                        maxLength={10}
                                        style={{ maxWidth: '10rem' }}
                                    />
                                </Box>
                                <Box margin="xl">
                                    <Form.YesOrNoQuestion
                                        name={
                                            VirksomhetFormField.harBlittYrkesaktivILøpetAvDeTreSisteFerdigliknedeÅrene
                                        }
                                        legend={txt.har_blitt_yrkesaktiv}
                                        validate={validateYesOrNoIsAnswered}
                                    />
                                </Box>
                                {values.harBlittYrkesaktivILøpetAvDeTreSisteFerdigliknedeÅrene === YesOrNo.YES && (
                                    <Panel>
                                        <Form.DatePicker
                                            name={VirksomhetFormField.oppstartsdato}
                                            label={txt.har_blitt_yrkesakriv_dato}
                                            showYearSelector={true}
                                            dateLimitations={{
                                                minDato: date3YearsAgo,
                                                maksDato: dateToday
                                            }}
                                            validate={validateRequiredField}
                                        />
                                    </Panel>
                                )}
                            </>
                        )}
                        {values.fom && moment(values.fom).isAfter(date4YearsAgo) === false && (
                            <>
                                <Box margin="xl">
                                    <Form.YesOrNoQuestion
                                        name={VirksomhetFormField.hattVarigEndringAvNæringsinntektSiste4Kalenderår}
                                        legend={txt.varig_endring_spm}
                                        validate={validateYesOrNoIsAnswered}
                                    />
                                </Box>
                                {values.hattVarigEndringAvNæringsinntektSiste4Kalenderår === YesOrNo.YES && (
                                    <>
                                        <Box margin="xl">
                                            <Form.DatePicker
                                                name={VirksomhetFormField.varigEndringINæringsinntekt_dato}
                                                label={txt.varig_endring_dato}
                                                validate={validateRequiredField}
                                                dateLimitations={{
                                                    minDato: date4YearsAgo,
                                                    maksDato: dateToday
                                                }}
                                            />
                                        </Box>
                                        <Box margin="xl">
                                            <Form.Input
                                                name={
                                                    VirksomhetFormField.varigEndringINæringsinntekt_inntektEtterEndring
                                                }
                                                label={txt.varig_endring_inntekt}
                                                validate={validateRequiredField}
                                            />
                                        </Box>
                                        <Box margin="xl">
                                            <Form.Textarea
                                                name={VirksomhetFormField.varigEndringINæringsinntekt_forklaring}
                                                label={txt.varig_endring_tekst}
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
                                        legend={txt.regnskapsfører_spm}
                                        validate={validateYesOrNoIsAnswered}
                                    />
                                </Box>

                                {values.harRegnskapsfører === YesOrNo.YES && (
                                    <Panel>
                                        <Form.Input
                                            name={VirksomhetFormField.regnskapsfører_navn}
                                            label={txt.regnskapsfører_navn}
                                            validate={validateRequiredField}
                                        />
                                        <Box margin="xl">
                                            <Form.Input
                                                name={VirksomhetFormField.regnskapsfører_telefon}
                                                label={txt.regnskapsfører_telefon}
                                                validate={validateRequiredField}
                                            />
                                        </Box>
                                    </Panel>
                                )}

                                {values.harRegnskapsfører === YesOrNo.NO && (
                                    <>
                                        <Box margin="xl">
                                            <Form.YesOrNoQuestion
                                                name={VirksomhetFormField.harRevisor}
                                                legend={txt.revisor_spm}
                                                validate={validateYesOrNoIsAnswered}
                                            />
                                        </Box>

                                        {values.harRevisor === YesOrNo.YES && (
                                            <Panel>
                                                <Form.Input
                                                    name={VirksomhetFormField.revisor_navn}
                                                    label={txt.revisor_navn}
                                                    validate={validateRequiredField}
                                                />
                                                <Box margin="xl">
                                                    <Form.Input
                                                        name={VirksomhetFormField.revisor_telefon}
                                                        label={txt.revisor_telefon}
                                                        validate={validateRequiredField}
                                                    />
                                                </Box>
                                                <Box margin="xl">
                                                    <Form.YesOrNoQuestion
                                                        name={VirksomhetFormField.kanInnhenteOpplsyningerFraRevisor}
                                                        legend={txt.revisor_fullmakt}
                                                        validate={validateYesOrNoIsAnswered}
                                                    />
                                                </Box>
                                            </Panel>
                                        )}
                                    </>
                                )}
                            </>
                        )}
                        {(values.harRegnskapsfører === YesOrNo.YES ||
                            (values.harRevisor && values.harRevisor !== YesOrNo.UNANSWERED)) && (
                            <Box margin="xl">
                                <CounsellorPanel>
                                    {txt.veileder_innhenter_info_html()}

                                    {/* /** Nynorsk:
                                     Vi hentar inn opplysningar om verksemda og inntekta di frå offentlege register. Vi tek kontakt med deg viss vi treng fleire opplysningar.
                                      */}
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
