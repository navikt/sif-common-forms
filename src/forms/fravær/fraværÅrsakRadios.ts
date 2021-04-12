import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { RadioPanelProps } from 'nav-frontend-skjema';
import { IntlShape } from 'react-intl';
import { FraværÅrsak } from './types';

export const getFraværÅrsakRadios = (intl: IntlShape): RadioPanelProps[] => [
    {
        label: intlHelper(intl, `fravær.årsak.${FraværÅrsak.stengtSkoleBhg}`),
        value: FraværÅrsak.stengtSkoleBhg,
    },
    {
        label: intlHelper(intl, `fravær.årsak.${FraværÅrsak.smittevernhensyn}`),
        value: FraværÅrsak.smittevernhensyn,
    },
];
