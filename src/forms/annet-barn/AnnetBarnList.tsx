import React from 'react';
import ActionLink from '@navikt/sif-common-core/lib/components/action-link/ActionLink';
import ItemList from '@navikt/sif-common-core/lib/components/item-list/ItemList';
import { AnnetBarn } from './types';

interface Props {
    annetBarn: AnnetBarn[];
    onEdit?: (annetBarn: AnnetBarn) => void;
    onDelete?: (annetBarn: AnnetBarn) => void;
}

const AnnetBarnList = ({ annetBarn = [], onDelete, onEdit }: Props) => {
    const getAnnetBarnTitleString = (annetBarn: AnnetBarn) => `${annetBarn.navn}`;

    const renderAnnetBarnLabel = (annetBarn: AnnetBarn): React.ReactNode => {
        const title = getAnnetBarnTitleString(annetBarn);
        return (
            <>
                {onEdit && <ActionLink onClick={() => onEdit(annetBarn)}>{title}</ActionLink>}
                {!onEdit && <span>{title}</span>}
            </>
        );
    };

    return (
        <ItemList<AnnetBarn>
            getItemId={(annetBarn) => annetBarn.id}
            getItemTitle={(annetBarn) => getAnnetBarnTitleString(annetBarn)}
            onDelete={onDelete}
            onEdit={onEdit}
            labelRenderer={renderAnnetBarnLabel}
            items={annetBarn.filter((annetBarn) => annetBarn.id !== undefined)}
        />
    );
};

export default AnnetBarnList;
