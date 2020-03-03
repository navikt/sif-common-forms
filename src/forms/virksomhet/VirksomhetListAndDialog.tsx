import React from 'react';
import {
    FormikModalFormAndList, FormikValidateFunction, ModalFormAndListLabels
} from '@navikt/sif-common-formik';
import { sortItemsByFom } from '@navikt/sif-common/lib/common/utils/dateUtils';
import { Virksomhet } from './types';
import VirksomhetForm from './VirksomhetForm';
import VirksomhetListe from './VirksomhetListe';

interface Props<FieldNames> {
    name: FieldNames;
    validate?: FormikValidateFunction;
    labels: ModalFormAndListLabels;
}

function VirksomhetListAndDialog<FieldNames>({ name, validate, labels }: Props<FieldNames>) {
    return (
        <FormikModalFormAndList<FieldNames, Virksomhet>
            name={name}
            labels={labels}
            validate={validate}
            dialogWidth="narrow"
            sortFunc={sortItemsByFom}
            formRenderer={({ onSubmit, onCancel, item }) => (
                <VirksomhetForm virksomhet={item} onSubmit={onSubmit} onCancel={onCancel} />
            )}
            listRenderer={({ items, onEdit, onDelete }) => (
                <VirksomhetListe virksomheter={items} onEdit={onEdit} onDelete={onDelete} />
            )}
        />
    );
}

export default VirksomhetListAndDialog;
