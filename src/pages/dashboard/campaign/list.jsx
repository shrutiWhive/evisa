import { Helmet } from "react-helmet-async";

import { CONFIG } from "src/global-config";

import { CampaignListView } from "src/sections/campaign/view";

// ----------------------------------------------------------------------

const metadata = { title: `Campaign - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CampaignListView />
    </>
  );
}
