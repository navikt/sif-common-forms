import React from 'react';
import { Panel } from 'nav-frontend-paneler';
import Box from '@navikt/sif-common/lib/common/components/box/Box';

interface Props {
    values?: {};
}

function SubmitPreview<FormValues>({ values }: Props) {
    return (
        <Box margin="xl">
            <div style={{ borderTop: '1px dashed #59514B', paddingTop: '1rem', margin: '0 -1rem' }}>
                <Box margin="m">
                    {values && (
                        <Panel style={{ padding: '1rem' }}>
                            <pre style={{ margin: 0, fontSize: '.8rem' }}>{JSON.stringify(values, null, 2)}</pre>
                        </Panel>
                    )}
                    {values === undefined && <Panel style={{ padding: '1rem' }}>Ingen data</Panel>}
                </Box>
            </div>
        </Box>
    );
}

export default SubmitPreview;
