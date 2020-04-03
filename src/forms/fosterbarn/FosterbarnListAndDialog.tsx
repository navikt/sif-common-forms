import React from 'react';
import { FormikModalFormAndList, FormikValidateFunction } from '@navikt/sif-common-formik';
import FosterbarnForm from './FosterbarnForm';
import FosterbarnList from './FosterbarnList';
import { Fosterbarn } from './types';

interface Props<FieldNames> {
    name: FieldNames;
    validate?: FormikValidateFunction;
    texts?: FosterbarnListAndDialogText;
    info?: string;
    includeName?: boolean;
}

function FosterbarnListAndDialog<FieldNames>({ name, validate, texts, info, includeName }: Props<FieldNames>) {
    const txt = { ...defaultText, ...texts };
    return (
        <>
            <FormikModalFormAndList<FieldNames, Fosterbarn>
                name={name}
                labels={{
                    addLabel: txt.liste_legg_til_knapp,
                    modalTitle: txt.modal_tittel,
                    emptyListText: txt.liste_tom_liste_tekst,
                    listTitle: txt.liste_tittel,
                    info
                }}
                dialogWidth="narrow"
                validate={validate}
                formRenderer={({ onSubmit, onCancel, item }) => (
                    <FosterbarnForm
                        fosterbarn={item}
                        onSubmit={onSubmit}
                        onCancel={onCancel}
                        includeName={includeName}
                    />
                )}
                listRenderer={({ items, onEdit, onDelete }) => (
                    <FosterbarnList fosterbarn={items} onEdit={onEdit} onDelete={onDelete} />
                )}
            />
        </>
    );
}

export interface FosterbarnListAndDialogText {
    liste_legg_til_knapp: string;
    liste_tittel?: string;
    liste_tom_liste_tekst?: string;
    modal_tittel: string;
}

export const defaultText: FosterbarnListAndDialogText = {
    liste_legg_til_knapp: 'Legg til fosterbarn',
    liste_tittel: 'Registrerte fosterbarn',
    modal_tittel: 'Fosterbarn'
};

export default FosterbarnListAndDialog;
