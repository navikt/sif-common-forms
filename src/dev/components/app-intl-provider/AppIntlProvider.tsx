import * as React from 'react';
import { IntlProvider } from 'react-intl';
import '@formatjs/intl-pluralrules//locale-data/en';
import '@formatjs/intl-pluralrules//locale-data/nb';
import '@formatjs/intl-pluralrules//locale-data/nn';
import '@formatjs/intl-pluralrules/polyfill';
import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
import { appMessages } from './messages';

export interface IntlProviderProps {
    locale: Locale;
}
export interface IntlProviderProps {
    locale: Locale;
    onError?: (error: any) => void;
}

const AppIntlProvider: React.FunctionComponent<IntlProviderProps> = ({ locale, onError, children }) => {
    const messages = locale === 'nb' ? appMessages.nb : appMessages.nn;
    return (
        <IntlProvider locale={locale} messages={messages} onError={onError}>
            {children}
        </IntlProvider>
    );
};

export default AppIntlProvider;
