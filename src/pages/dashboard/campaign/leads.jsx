import { Helmet } from "react-helmet-async";

import { useParams } from "src/routes/hooks";

import { CONFIG } from "src/global-config";

import { CampaignDetailLeadsView } from "src/sections/campaign/view";

// ----------------------------------------------------------------------

const metadata = { title: `Campaign detail leads - ${CONFIG.appName}` };

export default function Page() {
  const { id = "" } = useParams();

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CampaignDetailLeadsView id={id} />
    </>
  );
}
