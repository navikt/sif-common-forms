import React from 'react';
import ActionLink from '@navikt/sif-common-core/lib/components/action-link/ActionLink';
import ItemList from '@navikt/sif-common-core/lib/components/item-list/ItemList';
import { prettifyDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import { AnnetBarn } from './types';
import './annetBarnList.less';

interface Props {
    annetBarn: AnnetBarn[];
    includeFødselsdato: boolean;
    onEdit?: (annetBarn: AnnetBarn) => void;
    onDelete?: (annetBarn: AnnetBarn) => void;
}

const bem = bemUtils('annetBarnList');

const AnnetBarnList = ({ annetBarn = [], includeFødselsdato, onDelete, onEdit }: Props) => {
    const renderAnnetBarnLabel = (annetBarn: AnnetBarn): React.ReactNode => {
        return (
            <div className={bem.element('label')}>
                {includeFødselsdato && annetBarn.fødselsdato && (
                    <span className={bem.element('dato')}>{prettifyDate(annetBarn.fødselsdato)}</span>
                )}
                <span className={bem.element('land')}>
                    {onEdit && <ActionLink onClick={() => onEdit(annetBarn)}>{annetBarn.navn}</ActionLink>}
                    {!onEdit && <span>{annetBarn.navn}</span>}
                </span>
            </div>
        );
    };

    return (
        <ItemList<AnnetBarn>
            getItemId={(annetBarn) => annetBarn.id}
            getItemTitle={(annetBarn) => annetBarn.navn}
            onDelete={onDelete}
            onEdit={onEdit}
            labelRenderer={renderAnnetBarnLabel}
            items={annetBarn.filter((annetBarn) => annetBarn.id !== undefined)}
        />
    );
};

export default AnnetBarnList;
