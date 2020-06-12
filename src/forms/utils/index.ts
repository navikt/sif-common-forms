import { DateTidsperiode } from '../tidsperiode';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';

export const mapFomTomToDateRange = ({ fom, tom }: DateTidsperiode): DateRange => ({
    from: fom,
    to: tom,
});
