import React from 'react';
import { sortItemsByFom } from '@navikt/sif-common-core/lib/utils/dateUtils';
import {
    FormikModalFormAndList,
    ModalFormAndListLabels,
    TypedFormInputValidationProps,
} from '@navikt/sif-common-formik';
import TidsperiodeForm from './TidsperiodeForm';
import TidsperiodeList from './TidsperiodeList';
import { DateTidsperiode } from './types';

interface Props<FieldNames> extends TypedFormInputValidationProps<FieldNames> {
    name: FieldNames;
    formTitle?: string;
    minDate?: Date;
    maxDate?: Date;
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
            <FormikModalFormAndList<FieldNames, DateTidsperiode>
                name={name}
                labels={labels}
                dialogWidth="narrow"
                validate={validate}
                sortFunc={sortItemsByFom}
                formRenderer={({ onSubmit, onCancel, item, allItems }) => (
                    <TidsperiodeForm
                        tidsperiode={item}
                        alleTidsperioder={allItems}
                        formLabels={formTitle ? { title: formTitle } : undefined}
                        minDate={minDate}
                        maxDate={maxDate}
                        onSubmit={onSubmit}
                        onCancel={onCancel}
                    />
                )}
                listRenderer={({ items, onEdit, onDelete }) => {
                    return <TidsperiodeList tidsperiode={items} onEdit={onEdit} onDelete={onDelete} />;
                }}
            />
        </>
    );
}

export default TidsperiodeListAndDialog;
