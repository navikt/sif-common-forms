import React from 'react';
import { sortItemsByFom } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { FormikModalFormAndList, FormikValidateFunction, ModalFormAndListLabels } from '@navikt/sif-common-formik';
import TidsperiodeForm from './TidsperiodeForm';
import TidsperiodeList from './TidsperiodeList';
import { Tidsperiode } from './types';

interface Props<FieldNames> {
    name: FieldNames;
    validate?: FormikValidateFunction;
    formTitle?: string;
    minDate: Date;
    maxDate: Date;
    labels: ModalFormAndListLabels;
}

function TidsperiodeListAndDialog<FieldNames>({
    name,
    minDate,
    maxDate,
    validate,
    labels,
    formTitle,
}: Props<FieldNames>) {
    return (
        <>
            <FormikModalFormAndList<FieldNames, Tidsperiode>
                name={name}
                labels={labels}
                dialogWidth="narrow"
                validate={validate}
                sortFunc={sortItemsByFom}
                formRenderer={({ onSubmit, onCancel, item }) => (
                    <TidsperiodeForm
                        tidsperiode={item}
                        formLabels={{ title: formTitle }}
                        minDate={minDate}
                        maxDate={maxDate}
                        onSubmit={onSubmit}
                        onCancel={onCancel}
                    />
                )}
                listRenderer={({ items, onEdit, onDelete }) => (
                    <TidsperiodeList tidsperiode={items} onEdit={onEdit} onDelete={onDelete} />
                )}
            />
        </>
    );
}

export default TidsperiodeListAndDialog;
