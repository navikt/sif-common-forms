import { IntlShape } from 'react-intl';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { isFunction } from 'formik';
import { DateTidsperiode } from '../tidsperiode';

export const mapFomTomToDateRange = ({ fom, tom }: DateTidsperiode): DateRange => ({
    from: fom,
    to: tom,
});

export const getFormsFieldErrorRenderer = (intl: IntlShape) => (error) => {
    if (isFunction(error)) {
        return error();
    }
    return intlHelper(intl, error);
};
