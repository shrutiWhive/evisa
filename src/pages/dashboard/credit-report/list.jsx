// ----------------------------------------------------------------------

import { Helmet } from "react-helmet-async";
import { CONFIG } from "src/global-config";
import { CreditReportListView } from "src/sections/credit-report/view/credit-report-list-view";

const metadata = { title: `Credit Reports - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CreditReportListView />
    </>
  );
}
