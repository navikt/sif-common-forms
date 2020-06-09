import React from 'react';
import ActionLink from '@navikt/sif-common-core/lib/components/action-link/ActionLink';
import ItemList from '@navikt/sif-common-core/lib/components/item-list/ItemList';
import { prettifyDateExtended } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { Tidsperiode } from './types';

interface Props {
    tidsperiode: Tidsperiode[];
    onEdit?: (opphold: Tidsperiode) => void;
    onDelete?: (opphold: Tidsperiode) => void;
}

const TidsperiodeList = ({ tidsperiode = [], onDelete, onEdit }: Props) => {
    const getDateTitleString = (uttak: Tidsperiode) =>
        `${prettifyDateExtended(uttak.fom)} - ${prettifyDateExtended(uttak.tom)}`;

    const renderTidsperiodeLabel = (uttak: Tidsperiode): React.ReactNode => {
        const title = getDateTitleString(uttak);
        return (
            <>
                {onEdit && <ActionLink onClick={() => onEdit(uttak)}>{title}</ActionLink>}
                {!onEdit && <span>{title}</span>}
            </>
        );
    };

    return (
        <ItemList<Tidsperiode>
            getItemId={(uttak) => uttak.id}
            getItemTitle={(uttak) => getDateTitleString(uttak)}
            onDelete={onDelete}
            onEdit={onEdit}
            labelRenderer={renderTidsperiodeLabel}
            items={tidsperiode.filter((uttak) => uttak.id !== undefined)}
        />
    );
};

export default TidsperiodeList;
