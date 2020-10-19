import * as React from 'react';
import '@formatjs/intl-pluralrules//locale-data/nb';
import '@formatjs/intl-pluralrules//locale-data/nn';
import '@formatjs/intl-pluralrules/polyfill';
import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
import { getLocaleFromSessionStorage, setLocaleInSessionStorage } from '@navikt/sif-common-core/lib/utils/localeUtils';
import 'nav-frontend-skjema-style';
import { Normaltekst } from 'nav-frontend-typografi';
import AppIntlProvider from './dev/components/app-intl-provider/AppIntlProvider';
import DevPage from './dev/DevPage';
import '@navikt/sif-common-core/lib/styles/globalStyles.less';

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
