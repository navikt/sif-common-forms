import React from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { Ingress, Undertittel } from 'nav-frontend-typografi';

interface Props {
    title: string;
}

const PageIntro: React.FunctionComponent<Props> = ({ title, children }) => (
    <>
        <Box padBottom="xl" margin="m">
            <Box padBottom={children ? 'm' : 'none'}>
                <Undertittel>{title}</Undertittel>
            </Box>
            {children && <Ingress tag="div">{children}</Ingress>}
        </Box>
    </>
);

export default PageIntro;
