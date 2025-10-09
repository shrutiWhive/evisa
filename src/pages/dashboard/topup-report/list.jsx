// ----------------------------------------------------------------------

import { Helmet } from "react-helmet-async";
import { CONFIG } from "src/global-config";
import { TopupReportListView } from "src/sections/topup-report/view/topup-report-list-view";

const metadata = { title: `Topup Reports - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TopupReportListView />
    </>
  );
}
