import * as React from 'react';
import '@formatjs/intl-pluralrules/dist/locale-data/nb';
import '@formatjs/intl-pluralrules/dist/locale-data/nn';
import '@formatjs/intl-pluralrules/polyfill';
import 'nav-frontend-skjema-style';
import { Normaltekst } from 'nav-frontend-typografi';
import { Locale } from '@navikt/sif-common/lib/common/types/Locale';
import {
    getLocaleFromSessionStorage, setLocaleInSessionStorage
} from '@navikt/sif-common/lib/common/utils/localeUtils';
import AppIntlProvider from './dev/components/app-intl-provider/AppIntlProvider';
import DevPage from './dev/DevPage';
import '@navikt/sif-common/lib/common/styles/globalStyles.less';

const localeFromSessionStorage = getLocaleFromSessionStorage();

const App: React.FC = () => {
    const [locale, setLocale] = React.useState(localeFromSessionStorage || 'nb');
    return (
        <Normaltekst tag="div">
            <AppIntlProvider locale={locale as Locale}>
                <DevPage
                    onChangeLocale={(l: Locale) => {
                        setLocaleInSessionStorage(l);
                        setLocale(l);
                    }}
                />
            </AppIntlProvider>
        </Normaltekst>
    );
};

export default App;
