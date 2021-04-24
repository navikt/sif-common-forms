import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { TypedFormikForm, TypedFormikWrapper, YesOrNo } from '@navikt/sif-common-formik/lib';
import { getListValidator } from '@navikt/sif-common-formik/lib/validation';
import getFieldErrorHandler from '@navikt/sif-common-formik/lib/validation/fieldErrorHandler';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import flat from 'flat';
import Panel from 'nav-frontend-paneler';
import { Checkbox } from 'nav-frontend-skjema';
import { Undertittel } from 'nav-frontend-typografi';
import { VirksomhetFormErrors } from '../../../forms';
import { mapVirksomhetToVirksomhetApiData } from '../../../forms/virksomhet/mapVirksomhetToApiData';
import { isVirksomhet, Næringstype, Virksomhet } from '../../../forms/virksomhet/types';
import VirksomhetInfoAndDialog from '../../../forms/virksomhet/VirksomhetInfoAndDialog';
import virksomhetMessages from '../../../forms/virksomhet/virksomhetMessages';
import VirksomhetSummary from '../../../forms/virksomhet/VirksomhetSummary';
import PageIntro from '../../components/page-intro/PageIntro';
import FormValidationErrorMessages from '../../components/validation-error-messages/ValidationErrorMessages';

enum FormField {
    'virksomhet' = 'virksomhet',
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
    [FormField.virksomhet]?: Virksomhet;
}

const initialValues: FormValues = {};

const VirksomhetExample = () => {
    const [formValues, setFormValues] = useState<Partial<FormValues> | undefined>(undefined);
    const [harFlereVirksomheter, setHarFlereVirksomheter] = useState<boolean>(false);
    const intl = useIntl();

    const { virksomhet } = formValues || {};

    const apiVirksomhet =
        virksomhet && isVirksomhet(virksomhet) ? mapVirksomhetToVirksomhetApiData(intl.locale, virksomhet) : undefined;
    return (
        <>
            <PageIntro title="Næringsvirksomhet">Skjema som brukes for på registrere en næringsvirksomhet.</PageIntro>
            <Box padBottom="l">
                <Undertittel>Liste og dialog</Undertittel>
            </Box>
            <Panel border={true}>
                <TypedFormikWrapper<FormValues>
                    initialValues={initialValues}
                    onSubmit={setFormValues}
                    renderForm={() => {
                        return (
                            <TypedFormikForm<FormValues, ValidationError>
                                includeButtons={true}
                                submitButtonLabel="Valider skjema"
                                fieldErrorHandler={getFieldErrorHandler(intl)}>
                                <VirksomhetInfoAndDialog<FormField>
                                    name={FormField.virksomhet}
                                    harFlereVirksomheter={harFlereVirksomheter}
                                    validate={getListValidator({ required: true })}
                                    labels={{
                                        addLabel: harFlereVirksomheter ? 'Registrer virksomhet' : 'Legg til',
                                        deleteLabel: 'Fjern',
                                        editLabel: 'Endre',
                                        infoTitle: 'Virksomhet',
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
                                label="Bruker har flere virksomheter"
                                checked={harFlereVirksomheter}
                                onChange={(evt) => setHarFlereVirksomheter(evt.currentTarget.checked)}
                            />
                        </Box>
                    </Panel>
                </Box>
            </Panel>

            <Box margin="xxl" padBottom="l">
                <FormValidationErrorMessages
                    validationErrorIntlKeys={flat(VirksomhetFormErrors)}
                    intlMessages={virksomhetMessages}
                />
            </Box>

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
        </>
    );
};

export default VirksomhetExample;
