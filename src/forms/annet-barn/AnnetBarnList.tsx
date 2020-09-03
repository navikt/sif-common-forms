import React from 'react';
import ActionLink from '@navikt/sif-common-core/lib/components/action-link/ActionLink';
import ItemList from '@navikt/sif-common-core/lib/components/item-list/ItemList';
import { prettifyDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import { AnnetBarn } from './types';
import './annetBarnList.less';

interface Props {
    annetBarn: AnnetBarn[];
    onEdit?: (annetBarn: AnnetBarn) => void;
    onDelete?: (annetBarn: AnnetBarn) => void;
}

const bem = bemUtils('annetBarnList');

const AnnetBarnList = ({ annetBarn = [], onDelete, onEdit }: Props) => {
    const intl = useIntl();
    const renderAnnetBarnLabel = (annetBarn: AnnetBarn): React.ReactNode => {
        return (
            <div className={bem.element('label')}>
                <span className={bem.element('dato')}>
                    {intlHelper(intl, 'annetBarn.list.født')} {prettifyDate(annetBarn.fødselsdato)}
                </span>
                <span className={bem.element('land')}>
                    {onEdit && <ActionLink onClick={() => onEdit(annetBarn)}>{annetBarn.navn}</ActionLink>}
                    {!onEdit && <span>{annetBarn.navn}</span>}
                </span>
            </div>
        );
    };
    /* const getAnnetBarnTitleString = (annetBarn: AnnetBarn) =>
        `${intlHelper(intl, 'annetbarn.list.født')} ${prettifyDate(annetBarn.fødselsdato)} ${annetBarn.navn}`;

    /*const renderAnnetBarnLabel = (annetBarn: AnnetBarn): React.ReactNode => {
        const title = getAnnetBarnTitleString(annetBarn);
        return (
            <>
                {onEdit && <ActionLink onClick={() => onEdit(annetBarn)}>{title}</ActionLink>}
                {!onEdit && <span>{title}</span>}
            </>
        );
    };*/

    return (
        <ItemList<AnnetBarn>
            getItemId={(annetBarn) => annetBarn.id}
            // getItemTitle={(annetBarn) => getAnnetBarnTitleString(annetBarn)}
            getItemTitle={(annetBarn) => annetBarn.navn}
            onDelete={onDelete}
            onEdit={onEdit}
            labelRenderer={renderAnnetBarnLabel}
            items={annetBarn.filter((annetBarn) => annetBarn.id !== undefined)}
        />
    );
};

export default AnnetBarnList;
