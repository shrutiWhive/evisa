import { Helmet } from "react-helmet-async";
import { CONFIG } from "src/global-config";
import { PlanList } from "src/sections/app/plan/plan-view";

const metadata = { title: `Plan Policy - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <PlanList />
    </>
  );
}
