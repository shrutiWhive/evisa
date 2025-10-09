import { Helmet } from "react-helmet-async";

import { CONFIG } from "src/global-config";

import { CampaignCreateView } from "src/sections/campaign/view";

// ----------------------------------------------------------------------

const metadata = {
  title: `Create a new campaign - ${CONFIG.appName}`,
};

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CampaignCreateView />
    </>
  );
}
