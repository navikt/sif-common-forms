import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { Time } from '@navikt/sif-common-formik/lib';

export interface Omsorgsdag {
    dato: Date;
    tid: Time;
}

export interface OmsorgsdagerIMåned {
    key: string;
    from: Date;
    to: Date;
    omsorgsdager: Omsorgsdag[];
}

export interface OmsorgstilbudPeriodeFormValue {
    skalHaOmsorgstilbud: YesOrNo;
    omsorgsdager: Omsorgsdag[];
}
