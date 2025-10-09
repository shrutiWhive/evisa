import { Helmet } from "react-helmet-async";

import { CONFIG } from "src/global-config";

import { useParams } from "src/routes/hooks";

import { CampaignLeadFormView } from "src/sections/campaign/view";

// ----------------------------------------------------------------------

const metadata = { title: `Campaign form - ${CONFIG.appName}` };

export default function Page() {
  const { id = "" } = useParams();
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CampaignLeadFormView id={id} />
    </>
  );
}
