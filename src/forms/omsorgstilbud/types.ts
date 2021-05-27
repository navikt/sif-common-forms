import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { Time } from '@navikt/sif-common-formik/lib';

export interface Omsorgsdag {
    dato: Date;
    tid: Time;
}

export interface Måned {
    from: Date;
    to: Date;
}

export interface OmsorgstilbudPeriodeFormValue {
    skalHaOmsorgstilbud: YesOrNo;
    omsorgsdager: Omsorgsdag[];
}
