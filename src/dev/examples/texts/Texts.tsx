import React from 'react';
import { MessageFileFormat } from '@navikt/sif-common-core/lib/dev-utils/intl/devIntlUtils';
import bostedUtlandMessages from '../../../forms/bosted-utland/bostedUtlandMessages';
import MessagesPreview from '@navikt/sif-common-core/lib/dev-utils/intl/messages-preview/MessagesPreview';
import MessagePreviewExplanation from '@navikt/sif-common-core/lib/dev-utils/intl/messages-preview/MessagePreviewExplanation';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import ferieuttakMessages from '../../../forms/ferieuttak/ferieuttakMessages';
import fosterbarnMessages from '../../../forms/fosterbarn/fosterbarnMessages';
import fraværMessages from '../../../forms/fravær/fraværMessages';
import tidsperiodeMessages from '../../../forms/tidsperiode/tidsperiodeMessages';
import utenlandsoppholdMessages from '../../../forms/utenlandsopphold/utenlandsoppholdMessages';
import virksomhetMessages from '../../../forms/virksomhet/virksomhetMessages';
import Box from '@navikt/sif-common-core/lib/components/box/Box';

const Texts = () => {
    const formMessages: { title: string; messages: MessageFileFormat }[] = [];
    formMessages.push({ title: 'Bosted utland', messages: bostedUtlandMessages });
    formMessages.push({ title: 'Ferieuttak', messages: ferieuttakMessages });
    formMessages.push({ title: 'Fosterbarn', messages: fosterbarnMessages });
    formMessages.push({ title: 'Fravær', messages: fraværMessages });
    formMessages.push({ title: 'Tidsperiode', messages: tidsperiodeMessages });
    formMessages.push({ title: 'Utenlandsopphold', messages: utenlandsoppholdMessages });
    formMessages.push({ title: 'Næringsvirksomhet (selvstendig næringsdrivende)', messages: virksomhetMessages });
    return (
        <div>
            <Box>
                <MessagePreviewExplanation />
            </Box>
            {formMessages.map(({ title, messages }) => {
                return (
                    <div key={title}>
                        <FormBlock margin="none" paddingBottom="xl">
                            <MessagesPreview
                                messages={messages}
                                title={title}
                                showExplanation={false}
                                showMissingTextSummary={true}
                            />
                        </FormBlock>
                    </div>
                );
            })}
        </div>
    );
};

export default Texts;
