import { Helmet } from "react-helmet-async";

import { CONFIG } from "src/global-config";

import { TransactionListView } from "src/sections/transaction/view";

// ----------------------------------------------------------------------

const metadata = { title: `Transaction - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TransactionListView />
    </>
  );
}
