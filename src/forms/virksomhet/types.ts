import { ApiStringDate } from '@navikt/sif-common-core/lib/types/ApiStringDate';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';

export enum Næringstype {
    'FISKER' = 'FISKE',
    'JORDBRUK' = 'JORDBRUK_SKOGBRUK',
    'DAGMAMMA' = 'DAGMAMMA',
    'ANNEN' = 'ANNEN'
}

export enum VirksomhetFormField {
    'næringstyper' = 'næringstyper',
    'fiskerErPåBladB' = 'fiskerErPåBladB',
    'fom' = 'fom',
    'tom' = 'tom',
    'næringsinntekt' = 'næringsinntekt',
    'erPågående' = 'erPågående',
    'navnPåVirksomheten' = 'navnPåVirksomheten',
    'organisasjonsnummer' = 'organisasjonsnummer',
    'registrertINorge' = 'registrertINorge',
    'registrertILand' = 'registrertILand',
    'harBlittYrkesaktivILøpetAvDeTreSisteFerdigliknedeÅrene' = 'harBlittYrkesaktivILøpetAvDeTreSisteFerdigliknedeÅrene',
    'oppstartsdato' = 'oppstartsdato',
    'hattVarigEndringAvNæringsinntektSiste4Kalenderår' = 'hattVarigEndringAvNæringsinntektSiste4Kalenderår',
    'varigEndringINæringsinntekt_dato' = 'varigEndringINæringsinntekt_dato',
    'varigEndringINæringsinntekt_inntektEtterEndring' = 'varigEndringINæringsinntekt_inntektEtterEndring',
    'varigEndringINæringsinntekt_forklaring' = 'varigEndringINæringsinntekt_forklaring',
    'endretNæringsinntektInformasjon' = 'endretNæringsinntektInformasjon',
    'harRegnskapsfører' = 'harRegnskapsfører',
    'regnskapsfører' = 'regnskapsfører',
    'regnskapsfører_navn' = 'regnskapsfører_navn',
    'regnskapsfører_telefon' = 'regnskapsfører_telefon',
    'harRevisor' = 'harRevisor',
    'revisor_navn' = 'revisor_navn',
    'revisor_telefon' = 'revisor_telefon',
    'kanInnhenteOpplsyningerFraRevisor' = 'kanInnhenteOpplsyningerFraRevisor'
}

export interface Virksomhet {
    id?: string;
    [VirksomhetFormField.næringstyper]: Næringstype[];
    [VirksomhetFormField.fiskerErPåBladB]?: YesOrNo;
    [VirksomhetFormField.fom]: Date;
    [VirksomhetFormField.tom]?: Date;
    [VirksomhetFormField.næringsinntekt]?: number;
    [VirksomhetFormField.erPågående]?: boolean;
    [VirksomhetFormField.navnPåVirksomheten]: string;
    [VirksomhetFormField.organisasjonsnummer]?: string;
    [VirksomhetFormField.registrertINorge]: YesOrNo;
    [VirksomhetFormField.registrertILand]?: string;
    [VirksomhetFormField.harBlittYrkesaktivILøpetAvDeTreSisteFerdigliknedeÅrene]?: YesOrNo;
    [VirksomhetFormField.oppstartsdato]?: Date;
    [VirksomhetFormField.hattVarigEndringAvNæringsinntektSiste4Kalenderår]?: YesOrNo;
    [VirksomhetFormField.varigEndringINæringsinntekt_dato]?: Date;
    [VirksomhetFormField.varigEndringINæringsinntekt_inntektEtterEndring]?: number;
    [VirksomhetFormField.varigEndringINæringsinntekt_forklaring]?: string;
    [VirksomhetFormField.harRegnskapsfører]: YesOrNo;
    [VirksomhetFormField.regnskapsfører_navn]?: string;
    [VirksomhetFormField.regnskapsfører_telefon]?: string;
    [VirksomhetFormField.harRevisor]?: YesOrNo;
    [VirksomhetFormField.revisor_navn]?: string;
    [VirksomhetFormField.revisor_telefon]?: string;
    [VirksomhetFormField.kanInnhenteOpplsyningerFraRevisor]?: YesOrNo;
}

export const isVirksomhet = (virksomhet: Partial<Virksomhet>): virksomhet is Virksomhet => {
    return true;
};

export interface VirksomhetApiData {
    naringstype: Næringstype[];
    fiskerErPåBladB?: boolean;
    fra_og_med: ApiStringDate;
    til_og_med?: ApiStringDate | null;
    er_pagaende?: boolean;
    naringsinntekt?: number;
    navn_pa_virksomheten: string;
    organisasjonsnummer?: string;
    registrert_i_norge: boolean;
    registrert_i_land?: string;
    har_blitt_yrkesaktiv_siste_tre_ferdigliknede_arene?: boolean;
    yrkesaktiv_siste_tre_ferdigliknede_arene?: {
        oppstartsdato: ApiStringDate;
    };
    har_varig_endring_av_inntekt_siste_4_kalenderar?: boolean;
    varig_endring?: {
        dato?: ApiStringDate | null;
        inntekt_etter_endring?: number;
        forklaring?: string;
    };
    har_regnskapsforer: boolean;
    regnskapsforer?: {
        navn: string;
        telefon: string;
    };
    har_revisor?: boolean;
    revisor?: {
        navn: string;
        telefon: string;
        kan_innhente_opplysninger?: boolean;
    };
}
