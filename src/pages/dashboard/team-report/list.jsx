// ----------------------------------------------------------------------

import { Helmet } from "react-helmet-async";
import { CONFIG } from "src/global-config";
import { TeamReportListView } from "src/sections/documents/view/team-report-list-view";

const metadata = { title: `Team Reports - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TeamReportListView />
    </>
  );
}
