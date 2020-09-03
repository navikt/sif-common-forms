import React from 'react';
import { FormikModalFormAndList, FormikValidateFunction, ModalFormAndListLabels } from '@navikt/sif-common-formik';
import AnnetBarnForm from './AnnetBarnForm';
import AnnetBarnList from './AnnetBarnList';
import { AnnetBarn } from './types';

interface Props<FieldNames> {
    name: FieldNames;
    validate?: FormikValidateFunction;
    labels: ModalFormAndListLabels;
}

function AnnetBarnListAndDialog<FieldNames>({ name, validate, labels }: Props<FieldNames>) {
    return (
        <>
            <FormikModalFormAndList<FieldNames, AnnetBarn>
                name={name}
                labels={labels}
                dialogWidth="narrow"
                validate={validate}
                formRenderer={({ onSubmit, onCancel, item }) => (
                    <AnnetBarnForm annetBarn={item} onSubmit={onSubmit} onCancel={onCancel} />
                )}
                listRenderer={({ items, onEdit, onDelete }) => (
                    <AnnetBarnList annetBarn={items} onEdit={onEdit} onDelete={onDelete} />
                )}
            />
        </>
    );
}

export default AnnetBarnListAndDialog;
