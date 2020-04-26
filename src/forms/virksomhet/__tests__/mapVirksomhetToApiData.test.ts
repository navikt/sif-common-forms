import { formatDateToApiFormat } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { jsonSort } from '@navikt/sif-common-core/lib/utils/jsonSort';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { mapVirksomhetToVirksomhetApiData } from '../mapVirksomhetToApiData';
import { Næringstype, Virksomhet, VirksomhetApiData } from '../types';

const fom = new Date();
const tom = new Date();

const virksomhetFormData: Virksomhet = {
    næringstyper: [Næringstype.ANNEN],
    navnPåVirksomheten: 'ABC',
    fom,
    erPågående: true,
    tom,
    registrertINorge: YesOrNo.YES,
    registrertILand: '',
    organisasjonsnummer: '123123123',
    næringsinntekt: 123,
    harRegnskapsfører: YesOrNo.YES,
    regnskapsfører_navn: 'RegnskapsførerHenrik',
    regnskapsfører_telefon: '234',
};

export const revisorInfo = {
    revisor_navn: 'RevisorHenrik',
    revisor_telefon: '2341',
    kanInnhenteOpplsyningerFraRevisor: YesOrNo.YES,
};

const virksomhetApiData: VirksomhetApiData = {
    næringstyper: [Næringstype.ANNEN],
    navnPåVirksomheten: 'ABC',
    fraOgMed: formatDateToApiFormat(fom),
    tilOgMed: null,
    næringsinntekt: 123,
    registrertINorge: true,
    regnskapsfører: {
        navn: 'RegnskapsførerHenrik',
        telefon: '234',
    },
    organisasjonsnummer: '123123123',
};

describe('mapVirksomhetToApiData', () => {
    it('should verify standard required fields to be mapped', () => {
        const mappedData = mapVirksomhetToVirksomhetApiData('nb', virksomhetFormData as Virksomhet);
        expect(JSON.stringify(jsonSort(mappedData))).toEqual(JSON.stringify(jsonSort(virksomhetApiData)));
    });

    it('should not include revisor if user has regnskapsfører', () => {
        const mappedData = mapVirksomhetToVirksomhetApiData('nb', {
            ...virksomhetFormData,
            harRegnskapsfører: YesOrNo.NO,
            harRevisor: YesOrNo.YES,
            ...revisorInfo,
        });
        const apiData: VirksomhetApiData = {
            ...virksomhetApiData,
            regnskapsfører: undefined,
            revisor: {
                navn: revisorInfo.revisor_navn,
                telefon: revisorInfo.revisor_telefon,
                kanInnhenteOpplysninger: true,
            },
        };
        expect(JSON.stringify(jsonSort(mappedData))).toEqual(JSON.stringify(jsonSort(apiData)));
    });

    it('should not include orgnumber if it is not registered in Norway', () => {
        const mappedData = mapVirksomhetToVirksomhetApiData('nb', {
            ...virksomhetFormData,
            organisasjonsnummer: '123',
            registrertINorge: YesOrNo.NO,
            registrertILand: 'SE',
        });
        const apiData: VirksomhetApiData = {
            ...virksomhetApiData,
            organisasjonsnummer: undefined,
            registrertILand: {
                kode: 'SE',
                navn: 'Sverige',
            },
            registrertINorge: false,
        };
        expect(JSON.stringify(jsonSort(mappedData))).toEqual(JSON.stringify(jsonSort(apiData)));
    });
});
