import React from 'react';
import ContentWithHeader from '@navikt/sif-common-core/lib/components/content-with-header/ContentWithHeader';
import Box from '@navikt/sif-common-core/lib/components/box/Box';

interface Props {
    header: string;
}

const SummaryBlock: React.FunctionComponent<Props> = ({ header, children }) => (
    <Box margin="l">
        <ContentWithHeader header={header}>{children}</ContentWithHeader>
    </Box>
);

export default SummaryBlock;
