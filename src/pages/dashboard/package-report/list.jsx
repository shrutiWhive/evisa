// ----------------------------------------------------------------------

import { Helmet } from "react-helmet-async";
import { CONFIG } from "src/global-config";
import { PackageReportListView } from "src/sections/package-report/view/package-report-list-view";

const metadata = { title: `Package Reports - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <PackageReportListView />
    </>
  );
}
