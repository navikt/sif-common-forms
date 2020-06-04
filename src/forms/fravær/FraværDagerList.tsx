import React from 'react';
import ActionLink from '@navikt/sif-common-core/lib/components/action-link/ActionLink';
import ItemList from '@navikt/sif-common-core/lib/components/item-list/ItemList';
import { prettifyDateExtended } from '@navikt/sif-common-core/lib/utils/dateUtils';
import {FraværDag} from './types';

interface Props {
    fraværDager: FraværDag[];
    onEdit?: (fraværDag: FraværDag) => void;
    onDelete?: (fraværDag: FraværDag) => void;
}

const FraværDagerList: React.FC<Props> = ({ fraværDager = [], onDelete, onEdit }) => {
    const getDateTitleString = (uttak: FraværDag) =>
        `${prettifyDateExtended(uttak.dato)} - TODO: n timer arbeidsdag, n timer fravær`; // TODO

    const renderFraværDagLabel = (fraværDag: FraværDag): React.ReactNode => {
        const title = getDateTitleString(fraværDag);
        return (
            <>
                {onEdit && <ActionLink onClick={() => onEdit(fraværDag)}>{title}</ActionLink>}
                {!onEdit && <span>{title}</span>}
            </>
        );
    };

    return (
        <ItemList<FraværDag>
            getItemId={(uttak) => uttak.id}
            getItemTitle={(uttak) => getDateTitleString(uttak)}
            onDelete={onDelete}
            onEdit={onEdit}
            labelRenderer={renderFraværDagLabel}
            items={fraværDager.filter((fraværDag) => fraværDag.id !== undefined)}
        />
    );
};

export default FraværDagerList;
