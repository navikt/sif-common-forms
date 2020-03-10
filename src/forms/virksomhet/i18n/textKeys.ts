export interface VirksomhetFormText {
    næringstype_fisker: string;
    næringstype_jordbruker: string;
    næringstype_dagmamma: string;
    næringstype_annet: string;
    form_title: string;
    hva_heter_virksomheten: string;
    fisker_blad_b: string;
    registert_i_norge: (virksomhet: string) => string;
    registert_i_hvilket_land: (virksomhet: string) => string;
    organisasjonsnummer: string;
    startdato: (virksomhet: string) => string;
    kalender_fom: string;
    kalender_tom: string;
    kalender_pågående: string;
    næringsinntekt: string;
    næringsinntekt_info: string;
    har_blitt_yrkesaktiv: string;
    har_blitt_yrkesakriv_dato: string;
    varig_endring_spm: string;
    varig_endring_dato: string;
    varig_endring_inntekt: string;
    varig_endring_tekst: string;
    regnskapsfører_spm: string;
    regnskapsfører_navn: string;
    regnskapsfører_telefon: string;
    revisor_spm: string;
    revisor_navn: string;
    revisor_telefon: string;
    revisor_fullmakt: string;
    veileder_innhenter_info_html: () => React.ReactNode;
}
