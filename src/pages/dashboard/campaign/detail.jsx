import { Helmet } from "react-helmet-async";

import { useParams } from "src/routes/hooks";

import { CONFIG } from "src/global-config";

import { CampaignDetailView } from "src/sections/campaign/view";

// ----------------------------------------------------------------------

const metadata = { title: `Campaign details - ${CONFIG.appName}` };

export default function Page() {
  const { id = "" } = useParams();

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CampaignDetailView id={id} />
    </>
  );
}
