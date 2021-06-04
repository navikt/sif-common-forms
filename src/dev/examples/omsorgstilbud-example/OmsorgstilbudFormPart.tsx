import React from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { FormikYesOrNoQuestion } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import { OmsorgstilbudInfo } from './OmsorgstilbudExample';
import { OmsorgstilbudInlineForm } from '../../../forms/omsorgstilbud/OmsorgstilbudForm';
import { getMonthsInDateRange } from '../../../forms/omsorgstilbud/omsorgstilbudUtils';
import OmsorgstilbudInfoAndDialog from '../../../forms/omsorgstilbud/OmsorgstilbudInfoAndDialog';
import { SkalHaOmsorgstilbudFormField } from '../../../forms/omsorgstilbud/types';
import { OmsorgstilbudFormField } from './OmsorgstilbudExample';

interface Props {
    info: OmsorgstilbudInfo;
    søknadsperiode: DateRange;
}

const OmsorgstilbudFormPart: React.FunctionComponent<Props> = ({ info, søknadsperiode }) => {
    const måneder = info.måneder || [];
    const søknadsperiodeVarighet = dayjs(søknadsperiode.to).diff(søknadsperiode.from, 'days');

    if (søknadsperiodeVarighet < 20) {
        return (
            <OmsorgstilbudInlineForm fieldName={OmsorgstilbudFormField.enkeltdager} søknadsperiode={søknadsperiode} />
        );
    }
    return (
        <>
            {getMonthsInDateRange(søknadsperiode).map((periode, index) => {
                const { from, to } = periode;
                const mndOgÅr = dayjs(from).format('MMMM YYYY');
                const skalIOmsorgstilbud = måneder[index]?.skalHaOmsorgstilbud === YesOrNo.YES;
                return (
                    <Box key={dayjs(from).format('MM.YYYY')} margin="xl">
                        <FormikYesOrNoQuestion
                            name={`${OmsorgstilbudFormField.måneder}.${index}.${SkalHaOmsorgstilbudFormField.skalHaOmsorgstilbud}`}
                            legend={`Skal barnet i omsorgstilbud ${mndOgÅr}?`}
                        />
                        {skalIOmsorgstilbud && (
                            <FormBlock margin="l">
                                <ResponsivePanel className={'omsorgstilbudInfoDialogWrapper'}>
                                    <OmsorgstilbudInfoAndDialog
                                        name={OmsorgstilbudFormField.enkeltdager}
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
