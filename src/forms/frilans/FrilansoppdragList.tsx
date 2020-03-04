import React from 'react';
import ActionLink from '@navikt/sif-common/lib/common/components/action-link/ActionLink';
import ItemList from '@navikt/sif-common/lib/common/components/item-list/ItemList';
import bemUtils from '@navikt/sif-common/lib/common/utils/bemUtils';
import { prettifyDateExtended } from '@navikt/sif-common/lib/common/utils/dateUtils';
import { Frilansoppdrag } from './types';
import './frilansoppdragList.less';

interface Props {
    oppdrag: Frilansoppdrag[];
    onEdit?: (opphold: Frilansoppdrag) => void;
    onDelete?: (opphold: Frilansoppdrag) => void;
}

const bem = bemUtils('frilansoppdragList');

const FrilansoppdragList: React.FunctionComponent<Props> = ({ oppdrag, onDelete, onEdit }) => {
    const renderOppdragLabel = (o: Frilansoppdrag): React.ReactNode => {
        return (
            <div className={bem.element('label')}>
                <span className={bem.element('navn')}>
                    {onEdit && <ActionLink onClick={() => onEdit(o)}>{o.arbeidsgiverNavn}</ActionLink>}
                    {!onEdit && <span>{o.arbeidsgiverNavn}</span>}
                </span>
                <span className={bem.element('dato')}>
                    {prettifyDateExtended(o.fom)}
                    {`${o.tom ? `- ${prettifyDateExtended(o.tom)}` : ''}`}
                </span>
            </div>
        );
    };

    return (
        <ItemList<Frilansoppdrag>
            getItemId={(o) => o.id}
            getItemTitle={(o) => o.arbeidsgiverNavn}
            onDelete={onDelete}
            onEdit={onEdit}
            labelRenderer={renderOppdragLabel}
            items={oppdrag.filter((o) => o.id !== undefined)}
        />
    );
};

export default FrilansoppdragList;
