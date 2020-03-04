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
import { getTypedFormComponents, YesOrNo } from '@navikt/sif-common-formik/lib';
import { FormikProps } from 'formik';
import moment from 'moment';
import { Panel } from 'nav-frontend-paneler';
import { Systemtittel } from 'nav-frontend-typografi';
import InfoTilFisker from './parts/InfoTilFisker';
import { Fiskerinfo, isVirksomhet, Næringstype, Virksomhet, VirksomhetFormField } from './types';
import { harFiskerNæringstype } from './virksomhetUtils';

interface Props {
    virksomhet?: Virksomhet;
    onSubmit: (oppdrag: Virksomhet) => void;
    onCancel: () => void;
}

const initialValues: FormValues = {
    næringstyper: [],
    fiskerinfo: []
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
                            <Systemtittel tag="h1">Opplysninger om virksomheten din</Systemtittel>
                        </Box>
                        <Form.CheckboxPanelGroup
                            name={VirksomhetFormField.næringstyper}
                            legend="Hvilken type virksomhet har du?"
                            checkboxes={[
                                {
                                    value: Næringstype.FISKER,
                                    label: 'Fisker'
                                },
                                {
                                    value: Næringstype.JORDBRUK,
                                    label: 'Jordbruker'
                                },
                                {
                                    value: Næringstype.DAGMAMMA,
                                    label: 'Dagmamma i eget hjem'
                                },
                                {
                                    value: Næringstype.ANNEN,
                                    label: 'Annet'
                                }
                            ]}
                            validate={validateRequiredList}
                        />

                        {harFiskerNæringstype(values.næringstyper || []) && (
                            <Box margin="xl">
                                <Form.CheckboxPanelGroup
                                    name={VirksomhetFormField.fiskerinfo}
                                    legend="Fisker"
                                    checkboxes={[
                                        {
                                            value: Fiskerinfo.BLAD_A,
                                            label: 'Blad A'
                                        },
                                        {
                                            value: Fiskerinfo.BLAD_B,
                                            label: 'Blad B'
                                        },
                                        {
                                            value: Fiskerinfo.LOTT,
                                            label: 'Lott'
                                        },
                                        {
                                            value: Fiskerinfo.HYRE,
                                            label: 'Hyre'
                                        }
                                    ]}
                                    validate={validateRequiredField}
                                />
                            </Box>
                        )}

                        <Box margin="xl">
                            <Form.Input
                                name={VirksomhetFormField.navnPåVirksomheten}
                                label="Hva heter virksomheten din?"
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
                                legend={`Er ${navnPåVirksomheten} registrert i Norge`}
                                validate={validateYesOrNoIsAnswered}
                            />
                        </Box>

                        {values.registrertINorge === YesOrNo.NO && (
                            <Box margin="xl">
                                <Form.CountrySelect
                                    name={VirksomhetFormField.registrertILand}
                                    label={`I hvilket land er ${navnPåVirksomheten} din registrert i?`}
                                    validate={validateRequiredField}
                                />
                            </Box>
                        )}

                        {values.registrertINorge === YesOrNo.YES && (
                            <Box margin="xl">
                                <Form.Input
                                    name={VirksomhetFormField.organisasjonsnummer}
                                    label="Hva er organisasjonsnummeret?"
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
                                    legend={`Når startet du ${navnPåVirksomheten}?`}
                                    fromDatepickerProps={{
                                        label: 'Startdato',
                                        name: VirksomhetFormField.fom,
                                        showYearSelector: true,
                                        dateLimitations: {
                                            maksDato: dateToday
                                        },
                                        validate: validateRequiredField
                                    }}
                                    toDatepickerProps={{
                                        label: 'Eventuell avsluttet dato',
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
                                    label="Er pågående"
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
                                        label="Næringsinntekt"
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
                                        legend="Har du begynt å jobbe i løpet av de tre siste ferdigliknede årene?"
                                        validate={validateYesOrNoIsAnswered}
                                    />
                                </Box>
                                {values.harBlittYrkesaktivILøpetAvDeTreSisteFerdigliknedeÅrene === YesOrNo.YES && (
                                    <Panel>
                                        <Form.DatePicker
                                            name={VirksomhetFormField.oppstartsdato}
                                            label="Oppgi dato for når du ble yrkesaktiv"
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
                                        legend="Har du hatt en varig endring i arbeidsforholdet ditt, virksomheten eller arbeidssituasjonen din de siste fire årene?"
                                        validate={validateYesOrNoIsAnswered}
                                    />
                                </Box>
                                {values.hattVarigEndringAvNæringsinntektSiste4Kalenderår === YesOrNo.YES && (
                                    <>
                                        <Box margin="xl">
                                            <Form.DatePicker
                                                name={VirksomhetFormField.varigEndringINæringsinntekt_dato}
                                                label="Oppgi dato for endringen"
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
                                                label="Oppgi næringsinntekten din etter endringen. Oppgi årsinntekten i hele kroner."
                                                validate={validateRequiredField}
                                            />
                                        </Box>
                                        <Box margin="xl">
                                            <Form.Textarea
                                                name={VirksomhetFormField.varigEndringINæringsinntekt_forklaring}
                                                label="Her kan du skrive kort hva som har endret seg i arbeidsforholdet ditt, virksomheten eller arbeidssituasjonen din"
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
                                        legend="Har du regnskapsfører?"
                                        validate={validateYesOrNoIsAnswered}
                                    />
                                </Box>

                                {values.harRegnskapsfører === YesOrNo.YES && (
                                    <Panel>
                                        <Form.Input
                                            name={VirksomhetFormField.regnskapsfører_navn}
                                            label="Oppgi navnet til regnskapsfører"
                                            validate={validateRequiredField}
                                        />
                                        <Box margin="xl">
                                            <Form.Input
                                                name={VirksomhetFormField.regnskapsfører_telefon}
                                                label="Oppgi telefonnummeret til regnskapsfører"
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
                                                legend="Har du revisor?"
                                                validate={validateYesOrNoIsAnswered}
                                            />
                                        </Box>

                                        {values.harRevisor === YesOrNo.YES && (
                                            <Panel>
                                                <Form.Input
                                                    name={VirksomhetFormField.revisor_navn}
                                                    label="Oppgi navnet til revisor"
                                                    validate={validateRequiredField}
                                                />
                                                <Box margin="xl">
                                                    <Form.Input
                                                        name={VirksomhetFormField.revisor_telefon}
                                                        label="Oppgi telefonnummeret til revisor"
                                                        validate={validateRequiredField}
                                                    />
                                                </Box>
                                                <Box margin="xl">
                                                    <Form.YesOrNoQuestion
                                                        name={VirksomhetFormField.kanInnhenteOpplsyningerFraRevisor}
                                                        legend="Gir du NAV fullmakt til å innhente opplysninger direkte fra revisor?"
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
                                    Vi henter inn opplysninger om virksomheten og inntekten din fra offentlige registre.
                                    Vi tar kontakt med deg hvis vi trenger flere opplysninger.
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
