import { Helmet } from "react-helmet-async";
import { EligibilityFormView } from "src/auth/view/eligibility-form";
import { CONFIG } from "src/global-config";

const metadata = { title: `Sign up step form - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <EligibilityFormView />
    </>
  );
}
