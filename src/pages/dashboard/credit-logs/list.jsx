import { Helmet } from "react-helmet-async";

import { CONFIG } from "src/global-config";
import { CreditLogView } from "src/sections/credit-logs/credit-logs";

// ----------------------------------------------------------------------

const metadata = { title: `Credit logs - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CreditLogView />
    </>
  );
}
