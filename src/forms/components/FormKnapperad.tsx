import React from 'react';
import { Knapp } from 'nav-frontend-knapper';
import Knapperad from '@navikt/sif-common/lib/common/components/knapperad/Knapperad';

interface Props {
    onSubmitClick: () => void;
    onCancelClick: () => void;
}

const FormKnapperad: React.FunctionComponent<Props> = ({ onSubmitClick, onCancelClick }) => (
    <Knapperad layout="stretch">
        <Knapp type="hoved" htmlType="button" onClick={onSubmitClick}>
            Ok
        </Knapp>
        <Knapp type="flat" htmlType="button" onClick={onCancelClick}>
            Avbryt
        </Knapp>
    </Knapperad>
);

export default FormKnapperad;
