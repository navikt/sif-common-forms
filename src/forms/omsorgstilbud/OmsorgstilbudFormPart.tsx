import React from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { FormikYesOrNoQuestion } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import OmsorgstilbudInfoAndDialog from './OmsorgstilbudInfoAndDialog';
import { OmsorgstilbudFormField, OmsorgstilbudPeriodeFormValue } from './types';

interface Props {
    omsorgstilbud: OmsorgstilbudPeriodeFormValue[];
    fieldName: string;
}

const OmsorgstilbudFormPart: React.FunctionComponent<Props> = ({ omsorgstilbud = [], fieldName }) => {
    const getFieldName = (field: OmsorgstilbudFormField, index: number): string => `${fieldName}.${index}.${field}`;
    return (
        <>
            {omsorgstilbud.map((m, index) => {
                const { from, to } = m.periode;
                const mndOgÅr = dayjs(from).format('MMMM YYYY');
                const skalIOmsorgstilbud = omsorgstilbud[index]?.skalHaOmsorgstilbud === YesOrNo.YES;
                return (
                    <Box key={dayjs(from).format('MM.YYYY')} margin="xl">
                        <FormikYesOrNoQuestion
                            name={getFieldName(OmsorgstilbudFormField.skalHaOmsorgstilbud, index)}
                            legend={`Skal barnet i omsorgstilbud ${mndOgÅr}?`}
                        />
                        {skalIOmsorgstilbud && (
                            <FormBlock margin="l">
                                <ResponsivePanel className={'omsorgstilbudInfoDialogWrapper'}>
                                    <OmsorgstilbudInfoAndDialog
                                        name={getFieldName(OmsorgstilbudFormField.omsorgsdager, index)}
                                        fraDato={from}
                                        tilDato={to}
                                        labels={{
                                            addLabel: `Legg til timer`,
                                            deleteLabel: `Fjern alle timer`,
                                            editLabel: `Endre`,
                                            modalTitle: `Omsorgstilbud - ${mndOgÅr}`,
                                        }}
                                    />
                                </ResponsivePanel>
                            </FormBlock>
                        )}
                    </Box>
                );
            })}
        </>
    );
};

export default OmsorgstilbudFormPart;
