import { Helmet } from 'react-helmet-async';

import { ForgotPwdView } from 'src/sections/forgot-pwd';

// ----------------------------------------------------------------------

export default function ForgotPwdPage() {
  return (
    <>
      <Helmet>
        <title> Forgot Password | Sentirhy </title>
      </Helmet>

      <ForgotPwdView />
    </>
  );
}
