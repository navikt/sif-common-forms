import React from 'react';
import { sortItemsByFom } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { FormikModalFormAndList, FormikValidateFunction, ModalFormAndListLabels } from '@navikt/sif-common-formik';
import { Virksomhet, VirksomhetHideFields } from './types';
import VirksomhetForm from './VirksomhetForm';
import VirksomhetListe from './VirksomhetList';

interface Props<FieldNames> {
    name: FieldNames;
    validate?: FormikValidateFunction;
    labels: ModalFormAndListLabels;
    hideFormFields?: VirksomhetHideFields;
    skipOrgNumValidation?: boolean;
    onAfterChange?: (virksomheter: Virksomhet[]) => void;
}

function VirksomhetListAndDialog<FieldNames>({
    name,
    validate,
    labels,
    hideFormFields,
    skipOrgNumValidation,
    onAfterChange,
}: Props<FieldNames>) {
    return (
        <FormikModalFormAndList<FieldNames, Virksomhet>
            name={name}
            labels={labels}
            validate={validate}
            dialogWidth="narrow"
            maxItems={1}
            sortFunc={sortItemsByFom}
            formRenderer={({ onSubmit, onCancel, item }) => (
                <VirksomhetForm
                    virksomhet={item}
                    onSubmit={onSubmit}
                    onCancel={onCancel}
                    skipOrgNumValidation={skipOrgNumValidation}
                    hideFormFields={hideFormFields}
                />
            )}
            listRenderer={({ items, onEdit, onDelete }) => (
                <VirksomhetListe virksomheter={items} onEdit={onEdit} onDelete={onDelete} />
            )}
            onAfterChange={onAfterChange}
        />
    );
}

export default VirksomhetListAndDialog;
