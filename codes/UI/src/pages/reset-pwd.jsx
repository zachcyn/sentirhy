import { Helmet } from 'react-helmet-async';

import { ResetPwdView } from 'src/sections/reset-pwd';

// ----------------------------------------------------------------------

export default function ResetPwdPage() {
  return (
    <>
      <Helmet>
        <title> Reset Password | Sentirhy </title>
      </Helmet>

      <ResetPwdView />
    </>
  );
}
