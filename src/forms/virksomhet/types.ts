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
}
export type VirksomhetFormValues = Partial<
    Omit<Virksomhet, 'fom' | 'tom' | 'oppstartsdato' | 'varigEndringINæringsinntekt_dato'> & {
        [VirksomhetFormField.fom]: string;
        [VirksomhetFormField.tom]?: string;
        [VirksomhetFormField.oppstartsdato]?: string;
        [VirksomhetFormField.varigEndringINæringsinntekt_dato]?: string;
    }
>;

export const isVirksomhet = (virksomhet: Partial<Virksomhet>): virksomhet is Virksomhet => {
    return virksomhet !== undefined;
};

export interface VirksomhetApiData {
    næringstyper: Næringstype[];
    fiskerErPåBladB?: boolean;
    fraOgMed: ApiStringDate;
    tilOgMed?: ApiStringDate | null;
    erNyoppstartet: boolean;
    næringsinntekt?: number;
    navnPåVirksomheten: string;
    organisasjonsnummer?: string;
    registrertINorge: boolean;
    registrertIUtlandet?: {
        landkode: string;
        landnavn: string;
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
}
