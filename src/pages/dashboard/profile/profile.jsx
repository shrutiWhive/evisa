import { Helmet } from "react-helmet-async";

import { CONFIG } from "src/global-config";

import { ProfileView } from "src/sections/profile/view";

// ----------------------------------------------------------------------

const metadata = { title: `Organization profile - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ProfileView />
    </>
  );
}
