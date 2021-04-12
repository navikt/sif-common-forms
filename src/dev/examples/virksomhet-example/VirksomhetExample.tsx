import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { commonFieldErrorRenderer } from '@navikt/sif-common-core/lib/utils/commonFieldErrorRenderer';
import { validateRequiredList } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { TypedFormikForm, TypedFormikWrapper, YesOrNo } from '@navikt/sif-common-formik/lib';
import DialogFormWrapper from '@navikt/sif-common-formik/lib/components/formik-modal-form-and-list/dialog-form-wrapper/DialogFormWrapper';
import Panel from 'nav-frontend-paneler';
import { Checkbox } from 'nav-frontend-skjema';
import { Undertittel } from 'nav-frontend-typografi';
import { mapVirksomhetToVirksomhetApiData } from '../../../forms/virksomhet/mapVirksomhetToApiData';
import { isVirksomhet, Næringstype, Virksomhet } from '../../../forms/virksomhet/types';
import VirksomhetForm from '../../../forms/virksomhet/VirksomhetForm';
import VirksomhetListAndDialog from '../../../forms/virksomhet/VirksomhetListAndDialog';
import PageIntro from '../../components/page-intro/PageIntro';
import SubmitPreview from '../../components/submit-preview/SubmitPreview';
import VirksomhetSummary from '../../../forms/virksomhet/VirksomhetSummary';

enum FormField {
    'virksomheter' = 'virksomheter',
}

export const mockVirksomhet: Virksomhet = {
    id: '024782550-1402-01448-04932-71872390929312',
    næringstyper: [Næringstype.ANNEN, Næringstype.DAGMAMMA, Næringstype.FISKE, Næringstype.JORDBRUK_SKOGBRUK],
    fiskerErPåBladB: YesOrNo.YES,
    navnPåVirksomheten: 'Virksomhet AS',
    registrertINorge: YesOrNo.YES,
    organisasjonsnummer: '123123123',
    fom: new Date('2007-02-01T00:00:00.000Z'),
    erPågående: true,
    næringsinntekt: 20000,
    harBlittYrkesaktivILøpetAvDeTreSisteFerdigliknedeÅrene: YesOrNo.YES,
    blittYrkesaktivDato: new Date(),
    hattVarigEndringAvNæringsinntektSiste4Kalenderår: YesOrNo.YES,
    varigEndringINæringsinntekt_dato: new Date('2019-12-09T00:00:00.000Z'),
    varigEndringINæringsinntekt_inntektEtterEndring: 200000,
    varigEndringINæringsinntekt_forklaring: 'Jeg fikk flere barn',
    harRegnskapsfører: YesOrNo.YES,
    regnskapsfører_navn: 'Regnskapsefører Truls',
    regnskapsfører_telefon: '98219409',
};

interface FormValues {
    [FormField.virksomheter]: Virksomhet[];
}
const initialValues: FormValues = { virksomheter: [] };

const VirksomhetExample = () => {
    const [singleFormValues, setSingleFormValues] = useState<Partial<Virksomhet> | undefined>(undefined);
    const [listFormValues, setListFormValues] = useState<Partial<FormValues> | undefined>(undefined);
    const [hideFisker, setHideFisker] = useState<boolean>(false);
    const [gjelderFlereVirksomheter, setGjelderFlereVirksomheter] = useState<boolean>(false);
    const intl = useIntl();

    const virksomhetForApiMapping =
        gjelderFlereVirksomheter && listFormValues?.virksomheter?.length === 1
            ? listFormValues.virksomheter[0]
            : undefined;

    const apiVirksomhet =
        virksomhetForApiMapping && isVirksomhet(virksomhetForApiMapping)
            ? mapVirksomhetToVirksomhetApiData(intl.locale, virksomhetForApiMapping)
            : undefined;
    return (
        <>
            <PageIntro title="Næringsvirksomhet">Skjema som brukes for på registrere en næringsvirksomhet.</PageIntro>
            <Box padBottom="l">
                <Undertittel>Liste og dialog</Undertittel>
            </Box>
            <Panel border={true}>
                <TypedFormikWrapper<FormValues>
                    initialValues={initialValues}
                    onSubmit={setListFormValues}
                    renderForm={() => {
                        return (
                            <TypedFormikForm<FormValues>
                                includeButtons={true}
                                submitButtonLabel="Valider skjema"
                                fieldErrorRenderer={(error) => commonFieldErrorRenderer(intl, error)}>
                                <VirksomhetListAndDialog<FormField>
                                    name={FormField.virksomheter}
                                    gjelderFlereVirksomheter={gjelderFlereVirksomheter}
                                    maxItems={1}
                                    validate={validateRequiredList}
                                    labels={{
                                        addLabel: gjelderFlereVirksomheter ? 'Registrer virksomhet' : 'Legg til',
                                        listTitle: 'Virksomhet',
                                        modalTitle: 'Virksomhet',
                                    }}
                                />
                            </TypedFormikForm>
                        );
                    }}
                />
                <Box margin="l">
                    <hr />
                    <Panel style={{ padding: '1rem' }}>
                        <Box padBottom="m">Varianter:</Box>
                        <Box margin="m">
                            <Checkbox
                                label="Gjelder flere virksomheter"
                                checked={gjelderFlereVirksomheter}
                                onChange={(evt) => setGjelderFlereVirksomheter(evt.currentTarget.checked)}
                            />
                            <p>Denne må settes sammen med maks antall til 1</p>
                        </Box>
                    </Panel>
                </Box>
            </Panel>

            {apiVirksomhet && (
                <>
                    <Box margin="xxl" padBottom="l">
                        <Undertittel>Oppsummering av api data</Undertittel>
                    </Box>
                    <Panel border={true}>
                        <VirksomhetSummary virksomhet={apiVirksomhet} />
                    </Panel>
                </>
            )}

            <Box margin="xxl" padBottom="l">
                <Undertittel>Kun dialog</Undertittel>
            </Box>

            <DialogFormWrapper width="wide">
                <Panel border={true}>
                    <VirksomhetForm
                        gjelderFlereVirksomheter={true}
                        onCancel={() => setSingleFormValues({})}
                        onSubmit={(values) => setSingleFormValues(values)}
                    />
                    <Box margin="l">
                        <hr />
                        <Panel style={{ padding: '1rem' }}>
                            <Box padBottom="m">Spørsmål som kan skjules:</Box>
                            <Box margin="m">
                                <Checkbox
                                    label="Fisker på Blad B"
                                    checked={hideFisker}
                                    onChange={(evt) => setHideFisker(evt.currentTarget.checked)}
                                />
                            </Box>
                        </Panel>
                    </Box>
                    <Box margin="l">
                        <SubmitPreview values={singleFormValues} />
                    </Box>
                    <Box margin="xl">
                        <Undertittel>API-data</Undertittel>
                        <SubmitPreview
                            values={
                                singleFormValues && isVirksomhet(singleFormValues)
                                    ? mapVirksomhetToVirksomhetApiData(intl.locale, singleFormValues)
                                    : undefined
                            }
                        />
                    </Box>
                </Panel>
            </DialogFormWrapper>
        </>
    );
};

export default VirksomhetExample;
