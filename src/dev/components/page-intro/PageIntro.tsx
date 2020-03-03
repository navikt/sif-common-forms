import React from 'react';
import { Ingress, Undertittel } from 'nav-frontend-typografi';
import Box from '@navikt/sif-common/lib/common/components/box/Box';

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
