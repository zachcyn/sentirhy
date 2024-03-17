import { Helmet } from 'react-helmet-async';

import { SettingsView } from 'src/sections/settings';

// ----------------------------------------------------------------------

export default function ActivationPage() {
  return (
    <>
      <Helmet>
        <title> Profile Settings | Sentirhy </title>
      </Helmet>

      <SettingsView />
    </>
  );
}
