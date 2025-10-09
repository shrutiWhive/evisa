import { Helmet } from "react-helmet-async";

import { CONFIG } from "src/global-config";

import { AppView } from "src/sections/app/view";

// ----------------------------------------------------------------------

const metadata = { title: `Dashboard - ${CONFIG.appName}` };

export default function AppPage() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <AppView />
    </>
  );
}
