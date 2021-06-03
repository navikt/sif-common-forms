import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { Time } from '@navikt/sif-common-formik/lib';

export interface OmsorgstilbudDag {
    dato: Date;
    tid: Time;
}

export interface OmsorgstilbudPeriode {
    periode: DateRange;
    skalHaOmsorgstilbud: YesOrNo;
}

export enum SkalHaOmsorgstilbudFormField {
    skalHaOmsorgstilbud = 'skalHaOmsorgstilbud',
}
