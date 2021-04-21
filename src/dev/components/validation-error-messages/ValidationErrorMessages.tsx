import React from 'react';
import { MessageFileFormat } from '@navikt/sif-common-core/lib/dev-utils/intl/devIntlUtils';
import MessagesPreview from '@navikt/sif-common-core/lib/dev-utils/intl/messages-preview/MessagesPreview';
import { createFieldErrorIntlKey } from '@navikt/sif-common-formik/lib/utils/formikErrorRenderUtils';

export type ValidationErrorMessagesDocType = {
    fields: { [key: string]: string[] };
};

interface Props {
    formName: string;
    validationErrors: ValidationErrorMessagesDocType;
    intlMessages: MessageFileFormat;
}

const FormValidationErrorMessages: React.FunctionComponent<Props> = ({ validationErrors, formName, intlMessages }) => {
    const validationeMessages: MessageFileFormat = {
        nb: {},
        nn: {},
    };

    const fields = validationErrors.fields;

    Object.keys(fields).forEach((field) =>
        Object.keys(fields[field]).forEach((errorKey) => {
            const error = fields[field][errorKey];
            const intlKey = createFieldErrorIntlKey(error, field, formName);
            validationeMessages['nb'][intlKey] = intlMessages['nb'][intlKey];
            validationeMessages['nn'][intlKey] = intlMessages['nn'][intlKey];
        })
    );

    return (
        <MessagesPreview
            title="Feilmeldinger"
            messages={validationeMessages}
            showExplanation={false}
            showMissingTextSummary={false}
        />
    );
};

export default FormValidationErrorMessages;