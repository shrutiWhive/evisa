import { Helmet } from "react-helmet-async";

import { CONFIG } from "src/global-config";

import { AppointmentListView } from "src/sections/appointment/view";

// ----------------------------------------------------------------------

const metadata = { title: `Appointments - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <AppointmentListView />
    </>
  );
}
