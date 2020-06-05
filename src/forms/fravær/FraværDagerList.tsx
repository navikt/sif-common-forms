import React from 'react';
import ActionLink from '@navikt/sif-common-core/lib/components/action-link/ActionLink';
import ItemList from '@navikt/sif-common-core/lib/components/item-list/ItemList';
import { prettifyDateExtended } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { FraværDag } from './types';
import { timeText } from './fraværUtilities';

interface Props {
    fraværDager: FraværDag[];
    onEdit?: (fraværDag: FraværDag) => void;
    onDelete?: (fraværDag: FraværDag) => void;
}

const FraværDagerList: React.FC<Props> = ({ fraværDager = [], onDelete, onEdit }) => {
    const getFraværDagListItemTitle = (fraværDag: FraværDag) =>
        `${prettifyDateExtended(fraværDag.dato)}: 
        Skulle jobbet ${fraværDag.timerArbeidsdag} ${timeText(fraværDag.timerArbeidsdag)}. 
        Borte fra jobb ${fraværDag.timerFravær}  ${timeText(fraværDag.timerFravær)}.`;

    const renderFraværDagLabel = (fraværDag: FraværDag): React.ReactNode => {
        const title = getFraværDagListItemTitle(fraværDag);
        return (
            <>
                {onEdit && <ActionLink onClick={() => onEdit(fraværDag)}>{title}</ActionLink>}
                {!onEdit && <span>{title}</span>}
            </>
        );
    };

    return (
        <ItemList<FraværDag>
            getItemId={(fraværDag) => fraværDag.id}
            getItemTitle={(fraværDag) => getFraværDagListItemTitle(fraværDag)}
            onDelete={onDelete}
            onEdit={onEdit}
            labelRenderer={renderFraværDagLabel}
            items={fraværDager.filter((fraværDag) => fraværDag.id !== undefined)}
        />
    );
};

export default FraværDagerList;
