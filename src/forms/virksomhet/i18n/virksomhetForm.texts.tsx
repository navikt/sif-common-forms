import React from 'react';
import { VirksomhetFormText } from './textKeys';

export const VirksomhetTextNB: VirksomhetFormText = {
    næringstype_fisker: 'Fisker',
    næringstype_jordbruker: 'Jorbruker',
    næringstype_dagmamma: 'Dagmamma eller familiebarnehage i eget hjem',
    næringstype_annet: 'Annet',
    form_title: 'Opplysninger om virksomheten din',
    hva_heter_virksomheten: 'Hva heter virksomheten?',
    fisker_blad_b: 'Er du fisker på blad B?',
    veielder_fisker: (virksomhet) =>
        `Hvis du ikke har organisasjonsnummer, svarer du nei på spørsmålet "Er ${virksomhet} registrert i Norge?" I nedtrekkslisten velger du at virksomheten er registrert i Norge.`,
    registert_i_norge: (virksomhet: string) => `Er ${virksomhet} registert i Norge?`,
    registert_i_hvilket_land: (virksomhet: string) => `I hvilket land er ${virksomhet} din registrert i?`,
    organisasjonsnummer: 'Hva er organisasjonsnummeret?',
    startdato: (navnPåVirksomheten) => `Når startet du ${navnPåVirksomheten}?`,
    kalender_fom: 'Startdato',
    kalender_tom: 'Eventuell sluttdato',
    kalender_pågående: 'Er pågående',
    næringsinntekt:
        'Hva har du hatt i næringsresultat før skatt de siste 12 månedene? Hvis virksomheten har vart i kortere tid, kan du bruke denne perioden og regne om til årsinntekt. Oppgi beløpet i hele kroner.',
    næringsinntekt_info: 'Næringsresultatet er inntekter du har i næringen din, minus utgifter og avskrivninger.',
    har_blitt_yrkesaktiv: 'Har du begynt å jobbe i løpet av de tre siste ferdigliknede årene?',
    har_blitt_yrkesakriv_dato: 'Oppgi dato for når du ble yrkesaktiv',
    varig_endring_spm:
        'Har du hatt en varig endring i arbeidsforholdet ditt, virksomheten eller arbeidssituasjonen din de siste fire årene?',
    varig_endring_dato: 'Oppgi dato for endringen',
    varig_endring_inntekt: 'Oppgi næringsinntekten din etter endringen. Oppgi årsinntekten i hele kroner.',
    varig_endring_tekst:
        'Her kan du skrive kort hva som har endret seg i arbeidsforholdet ditt, virksomheten eller arbeidssituasjonen din',
    regnskapsfører_spm: 'Har du regnskapsfører?',
    regnskapsfører_navn: 'Oppgi navnet til regnskapsfører',
    regnskapsfører_telefon: 'Oppgi telefonnummeret til regnskapsfører',
    revisor_spm: 'Har du revisor?',
    revisor_navn: 'Oppgi navnet til revisor',
    revisor_telefon: 'Oppgi telefonnummeret til revisor',
    revisor_fullmakt: 'Gir du NAV fullmakt til å innhente opplysninger direkte fra revisor?',
    veileder_innhenter_info_html: () => (
        <div>
            Vi henter inn opplysninger om virksomheten og inntekten din fra offentlige registre.
            <br />
            Vi tar kontakt med deg hvis vi trenger flere opplysninger.
        </div>
    )
};
