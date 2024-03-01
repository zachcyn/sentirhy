import { Helmet } from 'react-helmet-async';

import { EmotionView } from 'src/sections/emotion/';

// ----------------------------------------------------------------------

export default function EmotionPage() {
  return (
    <>
      <Helmet>
        <title> Emotion | Sentirhy </title>
      </Helmet>

      <EmotionView />
    </>
  );
}
