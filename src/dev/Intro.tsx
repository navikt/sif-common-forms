import React from 'react';
import PageIntro from './components/page-intro/PageIntro';

interface Props {}

const Intro: React.FunctionComponent<Props> = (props) => (
    <>
        <PageIntro title="SIF-common guide">
            Dette er starten på en enkel guide til komponenter og konsepter i SIF-common, og som kan brukes i
            søknadsapplikasjonene til kapittel 9. Vi legger det vi trenger, etter hvert som vi ser at vi trenger det :)
        </PageIntro>
    </>
);

export default Intro;
