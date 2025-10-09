// ----------------------------------------------------------------------

import { Helmet } from "react-helmet-async";
import { CONFIG } from "src/global-config";
import { TransactionReportListView } from "src/sections/transaction-report/view/transaction-report-list-view";

const metadata = { title: `Transaction Reports - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TransactionReportListView />
    </>
  );
}
