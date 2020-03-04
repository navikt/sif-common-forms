import React from 'react';
import ActionLink from '@navikt/sif-common-core/lib/components/action-link/ActionLink';
import ItemList from '@navikt/sif-common-core/lib/components/item-list/ItemList';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import { Virksomhet } from './types';
import './virksomhetList.less';

interface Props {
    virksomheter: Virksomhet[];
    onEdit?: (virksomhet: Virksomhet) => void;
    onDelete?: (virksomhet: Virksomhet) => void;
}

const bem = bemUtils('virksomhetList');

const VirksomhetList: React.FunctionComponent<Props> = ({ virksomheter = [], onDelete, onEdit }) => {
    const næringLabel = (næring: Virksomhet): React.ReactNode => {
        return (
            <div className={bem.element('label')}>
                <span className={bem.element('navn')}>
                    {onEdit && <ActionLink onClick={() => onEdit(næring)}>{næring.navnPåVirksomheten}</ActionLink>}
                    {!onEdit && <span>{næring.navnPåVirksomheten}</span>}
                </span>
            </div>
        );
    };

    return (
        <ItemList<Virksomhet>
            getItemId={(næring) => næring.organisasjonsnummer}
            getItemTitle={(næring) => næring.navnPåVirksomheten}
            onDelete={onDelete}
            onEdit={onEdit}
            labelRenderer={næringLabel}
            items={virksomheter.filter((næring) => næring.id !== undefined)}
        />
    );
};

export default VirksomhetList;
