import React from 'react';
import { FormikModalFormAndList, FormikValidateFunction } from '@navikt/sif-common-formik';
import FosterbarnForm from './FosterbarnForm';
import FosterbarnList from './FosterbarnList';
import { FosterbarnTextsNb } from './i18n/fosterbarnText';
import { FosterbarnTextKeys } from './i18n/fosterbarnTextKeys';
import { Fosterbarn } from './types';

interface Props<FieldNames> {
    name: FieldNames;
    validate?: FormikValidateFunction;
    texts?: FosterbarnTextKeys;
    info?: string;
}

function FosterbarnListAndDialog<FieldNames>({ name, validate, texts, info }: Props<FieldNames>) {
    const txt = { ...FosterbarnTextsNb, ...texts };
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
                    <FosterbarnForm fosterbarn={item} onSubmit={onSubmit} onCancel={onCancel} />
                )}
                listRenderer={({ items, onEdit, onDelete }) => (
                    <FosterbarnList fosterbarn={items} onEdit={onEdit} onDelete={onDelete} />
                )}
            />
        </>
    );
}

export default FosterbarnListAndDialog;
