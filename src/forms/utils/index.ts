import { Tidsperiode } from '../tidsperiode';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';

export const mapFomTomToDateRange = ({ fom, tom }: Tidsperiode): DateRange => ({
    from: fom,
    to: tom,
});
