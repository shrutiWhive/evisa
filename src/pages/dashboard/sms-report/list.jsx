// ----------------------------------------------------------------------

import { Helmet } from "react-helmet-async";
import { CONFIG } from "src/global-config";
import { SmsReportListView } from "src/sections/sms-report/view/sms-report-list-vew";

const metadata = { title: `SMS Reports - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <SmsReportListView />
    </>
  );
}
