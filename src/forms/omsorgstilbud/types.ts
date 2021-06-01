import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { Time } from '@navikt/sif-common-formik/lib';

export interface OmsorgstilbudDag {
    dato: Date;
    tid: Time;
}

export interface OmsorgstilbudPeriodeFormValue {
    skalHaOmsorgstilbud: YesOrNo;
    omsorgsdager: OmsorgstilbudDag[];
}
