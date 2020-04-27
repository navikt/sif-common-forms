import { ApiStringDate } from '@navikt/sif-common-core/lib/types/ApiStringDate';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';

export enum Næringstype {
    'FISKER' = 'FISKE',
    'JORDBRUK' = 'JORDBRUK_SKOGBRUK',
    'DAGMAMMA' = 'DAGMAMMA',
    'ANNEN' = 'ANNEN',
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
    'kanInnhenteOpplsyningerFraRevisor' = 'kanInnhenteOpplsyningerFraRevisor',
}

export interface VirksomhetHideFields {
    [VirksomhetFormField.fiskerErPåBladB]: boolean;
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
    næringstyper: Næringstype[];
    fiskerErPåBladB?: boolean;
    fraOgMed: ApiStringDate;
    tilOgMed?: ApiStringDate | null;
    næringsinntekt?: number;
    navnPåVirksomheten: string;
    organisasjonsnummer?: string;
    registrertINorge: boolean;
    registrertILand?: {
        alpha3code: string;
        navn: string;
    };
    yrkesaktivSisteTreFerdigliknedeÅrene?: {
        oppstartsdato: ApiStringDate;
    };
    varigEndring?: {
        dato: ApiStringDate;
        inntektEtterEndring: number;
        forklaring: string;
    };
    regnskapsfører?: {
        navn: string;
        telefon: string;
    };
    revisor?: {
        navn: string;
        telefon: string;
        kanInnhenteOpplysninger?: boolean;
    };
}
