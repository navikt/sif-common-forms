import React from 'react';
import { useIntl } from 'react-intl';
import { getCountryName } from '@navikt/sif-common-formik';
import ActionLink from '@navikt/sif-common/lib/common/components/action-link/ActionLink';
import ItemList from '@navikt/sif-common/lib/common/components/item-list/ItemList';
import bemUtils from '@navikt/sif-common/lib/common/utils/bemUtils';
import { prettifyDateExtended } from '@navikt/sif-common/lib/common/utils/dateUtils';
import { Utenlandsopphold } from './types';
import './utenlandsoppholdListe.less';

interface Props {
    utenlandsopphold: Utenlandsopphold[];
    onEdit?: (opphold: Utenlandsopphold) => void;
    onDelete?: (opphold: Utenlandsopphold) => void;
}

const bem = bemUtils('utenlandsoppholdListe');

const UtenlandsoppholdListe: React.FunctionComponent<Props> = ({ utenlandsopphold, onDelete, onEdit }) => {
    const intl = useIntl();
    const renderUtenlandsoppholdLabel = (opphold: Utenlandsopphold): React.ReactNode => {
        const navn = getCountryName(opphold.landkode, intl.locale);
        return (
            <div className={bem.element('label')}>
                <span className={bem.element('land')}>
                    {onEdit && <ActionLink onClick={() => onEdit(opphold)}>{navn}</ActionLink>}
                    {!onEdit && <span>{navn}</span>}
                </span>
                <span className={bem.element('dato')}>
                    {prettifyDateExtended(opphold.fom)} - {prettifyDateExtended(opphold.tom)}
                </span>
            </div>
        );
    };

    return (
        <ItemList<Utenlandsopphold>
            getItemId={(opphold) => opphold.id}
            getItemTitle={(opphold) => getCountryName(opphold.landkode, intl.locale)}
            onDelete={onDelete}
            onEdit={onEdit}
            labelRenderer={renderUtenlandsoppholdLabel}
            items={utenlandsopphold}
        />
    );
};

export default UtenlandsoppholdListe;
