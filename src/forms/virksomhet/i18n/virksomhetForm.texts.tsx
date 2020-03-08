import React from 'react';
import { VirksomhetFormText } from './textKeys';

export const VirksomhetTextNB: VirksomhetFormText = {
    næringstype_fisker: 'Fisker',
    næringstype_jordbruker: 'Jorbruker',
    næringstype_dagmamma: 'Dagmamma eller familiebarnehage i eget hjem',
    næringstype_annet: 'Annet',
    form_title: 'Opplysninger om virksomheten din',
    hva_heter_virksomheten: 'Hva heter virksomheten?',
    fisker_bladB: 'Er du fisker på blad B?',
    registert_i_norge: (virksomhet: string) => `Er ${virksomhet} registert i Norge?`,
    registert_i_hvilket_land: (virksomhet: string) => `I hvilket land er ${virksomhet} din registrert i?`,
    organisasjonsnummer: 'Hva er organisasjonsnummeret?',
    startdato: (navnPåVirksomheten) => `Når startet du ${navnPåVirksomheten}?`,
    kalenderFom: 'Startdato',
    kalenderTom: 'Eventuell avsluttet dato',
    kalenderPågående: 'Er pågående',
    næringsinntekt: 'Næringsinntekt',
    blittYrkesaktiv: 'Har du begynt å jobbe i løpet av de tre siste ferdigliknede årene?',
    dateYrkesaktiv: 'Oppgi dato for når du ble yrkesaktiv',
    varigEndringSiste4år:
        'Har du hatt en varig endring i arbeidsforholdet ditt, virksomheten eller arbeidssituasjonen din de siste fire årene?',
    varigEndrinDato: 'Oppgi dato for endringen',
    variEndringInntekt: 'Oppgi næringsinntekten din etter endringen. Oppgi årsinntekten i hele kroner.',
    varigEndingBeskrivelse:
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
