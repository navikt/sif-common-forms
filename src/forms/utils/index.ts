import { IntlShape } from 'react-intl';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { isFunction } from 'formik';
import { DateTidsperiode } from '../tidsperiode';
import { FormikFieldErrorRender } from '@navikt/sif-common-formik/lib/components/typed-formik-form/TypedFormikForm';

export const mapFomTomToDateRange = ({ fom, tom }: DateTidsperiode): DateRange => ({
    from: fom,
    to: tom,
});

export const getIntlFormErrorRenderer = (intl: IntlShape): FormikFieldErrorRender => (error) => {
    if (isFunction(error)) {
        return error();
    }
    return intlHelper(intl, error);
};
