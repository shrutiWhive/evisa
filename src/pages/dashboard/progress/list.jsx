import { Helmet } from "react-helmet-async";
import { CONFIG } from "src/global-config";
import { ProgressStatus } from "src/sections/progress/view/progress-step";

const metadata = { title: `Progress - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ProgressStatus />
    </>
  );
}
