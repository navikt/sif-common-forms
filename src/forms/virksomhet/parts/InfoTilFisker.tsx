import React from 'react';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import { VirksomhetTextNB } from '../i18n/virksomhetForm.texts';

interface Props {
    navnPåVirksomhet: string;
}

const txt = VirksomhetTextNB;

const InfoTilFisker = ({ navnPåVirksomhet }: Props) => (
    <CounsellorPanel>{txt.veielder_fisker(navnPåVirksomhet)}</CounsellorPanel>
);

export default InfoTilFisker;
