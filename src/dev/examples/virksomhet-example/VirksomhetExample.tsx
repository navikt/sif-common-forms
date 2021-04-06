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

enum FormField {
    'virksomheter' = 'virksomheter',
}

export const mockVirksomhet: Virksomhet = {
    id: '024782550-1402-01448-04932-71872390929312',
    næringstyper: [Næringstype.ANNEN, Næringstype.DAGMAMMA],
    navnPåVirksomheten: 'Gamle greier',
    registrertINorge: YesOrNo.YES,
    organisasjonsnummer: '123123123',
    fom: new Date('2007-02-01T00:00:00.000Z'),
    erPågående: true,
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
    const intl = useIntl();
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
                                    validate={validateRequiredList}
                                    labels={{
                                        addLabel: 'Legg til',
                                        listTitle: 'Virksomhet',
                                        modalTitle: 'Virksomhet',
                                    }}
                                />
                            </TypedFormikForm>
                        );
                    }}
                />
                <SubmitPreview values={listFormValues} />
            </Panel>

            <Box margin="xxl" padBottom="l">
                <Undertittel>Kun dialog</Undertittel>
            </Box>
            <DialogFormWrapper width="wide">
                <Panel border={true}>
                    <VirksomhetForm
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
