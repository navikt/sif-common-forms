import React from 'react';
import ActionLink from '@navikt/sif-common-core/lib/components/action-link/ActionLink';
import ItemList from '@navikt/sif-common-core/lib/components/item-list/ItemList';
import { prettifyDateExtended } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { FraværPeriode } from './types';

interface Props {
    fraværPerioder: FraværPeriode[];
    onEdit?: (fraværPeriode: FraværPeriode) => void;
    onDelete?: (fraværPeriode: FraværPeriode) => void;
}

const FraværPerioderList: React.FunctionComponent<Props> = ({ fraværPerioder = [], onDelete, onEdit }) => {
    const getDateTitleString = (fraværPeriode: FraværPeriode) =>
        `${prettifyDateExtended(fraværPeriode.fom)} - ${prettifyDateExtended(fraværPeriode.tom)}`;

    const renderFraværPeriodeLabel = (fraværPeriode: FraværPeriode): React.ReactNode => {
        const title = getDateTitleString(fraværPeriode);
        return (
            <>
                {onEdit && <ActionLink onClick={() => onEdit(fraværPeriode)}>{title}</ActionLink>}
                {!onEdit && <span>{title}</span>}
            </>
        );
    };

    return (
        <ItemList<FraværPeriode>
            getItemId={(fraværPeriode) => fraværPeriode.id}
            getItemTitle={(fraværPeriode) => getDateTitleString(fraværPeriode)}
            onDelete={onDelete}
            onEdit={onEdit}
            labelRenderer={renderFraværPeriodeLabel}
            items={fraværPerioder.filter((fraværPeriode) => fraværPeriode.id !== undefined)}
        />
    );
};

export default FraværPerioderList;
