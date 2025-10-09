import { Helmet } from "react-helmet-async";

import { useParams } from "src/routes/hooks";

import { CONFIG } from "src/global-config";

import { CampaignEditView } from "src/sections/campaign/view";

// ----------------------------------------------------------------------

const metadata = { title: `Campaign edit - ${CONFIG.appName}` };

export default function Page() {
  const { id = "" } = useParams();

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CampaignEditView id={id} />
    </>
  );
}
