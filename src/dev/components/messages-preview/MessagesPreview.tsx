import React from 'react';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import { Undertittel } from 'nav-frontend-typografi';
import Box from '@navikt/sif-common/lib/common/components/box/Box';
import bemUtils from '@navikt/sif-common/lib/common/utils/bemUtils';
import {
    createMultiLocaleObject, getMissingMessageKeys, MessageFileFormat
} from '../../utils/devIntlUtils';
import './messagesPreview.less';

interface Props {
    messages: MessageFileFormat;
}

const bem = bemUtils('messagesList');

const MessagesPreview: React.FunctionComponent<Props> = ({ messages }) => {
    const allMessages = createMultiLocaleObject(messages);
    const missingMessages = getMissingMessageKeys(allMessages);
    return (
        <>
            {missingMessages && (
                <>
                    <Undertittel>Tekstnøkler som mangler verdi for locale</Undertittel>
                    <Box margin="m">
                        <AlertStripeFeil>
                            <pre className={bem.element('missingList')}>
                                {Object.keys(missingMessages).map((key) => (
                                    <div key={key}>
                                        {missingMessages[key]}: {key}
                                    </div>
                                ))}
                            </pre>
                        </AlertStripeFeil>
                    </Box>
                </>
            )}
            <Box margin="xl">
                <Undertittel>Alle tekstnøkler</Undertittel>
            </Box>
            <dl className={bem.block}>
                {Object.keys(allMessages).map((key) => {
                    return (
                        <span key={key}>
                            <dt>{key}</dt>
                            {Object.keys(allMessages[key]).map((locale) => {
                                const value = allMessages[key][locale];
                                return (
                                    <dd key={locale}>
                                        <span className={bem.element('locale')}>
                                            <span className={bem.element('etikett')}>{locale}:</span>
                                        </span>
                                        <span className={bem.element('message')}>
                                            {value ? value : <span className={bem.element('missing')}>Mangler!</span>}
                                        </span>
                                    </dd>
                                );
                            })}
                        </span>
                    );
                })}
            </dl>
        </>
    );
};

export default MessagesPreview;
