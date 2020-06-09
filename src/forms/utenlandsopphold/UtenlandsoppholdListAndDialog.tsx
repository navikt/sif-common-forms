import React from 'react';
import { sortItemsByFom } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { FormikModalFormAndList, FormikValidateFunction, ModalFormAndListLabels } from '@navikt/sif-common-formik';
import { Utenlandsopphold } from './types';
import UtenlandsoppholdForm from './UtenlandsoppholdForm';
import UtenlandsoppholdListe from './UtenlandsoppholdList';

interface Props<FieldNames> {
    name: FieldNames;
    validate?: FormikValidateFunction;
    minDate: Date;
    maxDate: Date;
    labels: ModalFormAndListLabels;
}

function UtenlandsoppholdListAndDialog<FieldNames>({ name, minDate, maxDate, validate, labels }: Props<FieldNames>) {
    return (
        <FormikModalFormAndList<FieldNames, Utenlandsopphold>
            name={name}
            labels={labels}
            validate={validate}
            dialogWidth="narrow"
            sortFunc={sortItemsByFom}
            formRenderer={({ onSubmit, onCancel, item }) => (
                <UtenlandsoppholdForm
                    opphold={item}
                    minDate={minDate}
                    maxDate={maxDate}
                    onSubmit={onSubmit}
                    onCancel={onCancel}
                />
            )}
            listRenderer={({ items, onEdit, onDelete }) => (
                <UtenlandsoppholdListe utenlandsopphold={items} onEdit={onEdit} onDelete={onDelete} />
            )}
        />
    );
}

export default UtenlandsoppholdListAndDialog;
