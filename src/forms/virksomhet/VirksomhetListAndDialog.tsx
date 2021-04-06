import React from 'react';
import { sortItemsByFom } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { FormikModalFormAndList, FormikValidateFunction, ModalFormAndListLabels } from '@navikt/sif-common-formik';
import { Virksomhet } from './types';
import VirksomhetForm from './VirksomhetForm';
import VirksomhetListe from './VirksomhetList';

interface Props<FieldNames> {
    name: FieldNames;
    labels: ModalFormAndListLabels;
    skipOrgNumValidation?: boolean;
    gjelderFlereVirksomheter?: boolean;
    maxItems?: number;
    validate?: FormikValidateFunction;
    onAfterChange?: (virksomheter: Virksomhet[]) => void;
}

function VirksomhetListAndDialog<FieldNames>({
    name,
    labels,
    skipOrgNumValidation,
    gjelderFlereVirksomheter,
    maxItems,
    validate,
    onAfterChange,
}: Props<FieldNames>) {
    return (
        <FormikModalFormAndList<FieldNames, Virksomhet>
            name={name}
            labels={labels}
            validate={validate}
            dialogWidth="narrow"
            maxItems={maxItems}
            sortFunc={sortItemsByFom}
            formRenderer={({ onSubmit, onCancel, item }) => (
                <VirksomhetForm
                    virksomhet={item}
                    gjelderFlereVirksomheter={gjelderFlereVirksomheter}
                    onSubmit={onSubmit}
                    onCancel={onCancel}
                    skipOrgNumValidation={skipOrgNumValidation}
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
