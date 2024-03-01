import { Helmet } from 'react-helmet-async';

import { ActivationView } from 'src/sections/activation';

// ----------------------------------------------------------------------

export default function ActivationPage() {
  return (
    <>
      <Helmet>
        <title> Account Activation | Sentirhy </title>
      </Helmet>

      <ActivationView />
    </>
  );
}
