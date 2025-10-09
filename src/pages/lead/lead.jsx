import { Helmet } from "react-helmet-async";

import { useParams } from "src/routes/hooks";

import { CONFIG } from "src/global-config";

import { LeadDetail } from "src/sections/lead/view/lead-details";

const metadata = { title: `Lead Detail - ${CONFIG.appName}` };

export default function Page() {
  const { id = "" } = useParams();

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <LeadDetail id={id} />
    </>
  );
}
