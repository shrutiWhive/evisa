import { Helmet } from "react-helmet-async";
import { CONFIG } from "src/global-config";
import { PlanList } from "src/sections/app/plan/plan-view";
import { DocumentList } from "src/sections/document/view/document-list";

const metadata = { title: `Document - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <DocumentList />
    </>
  );
}
