import { Helmet } from "react-helmet-async";

import { CONFIG } from "src/global-config";

import { AppointmentCategoryListView } from "src/sections/appointment-category/view";

// ----------------------------------------------------------------------

const metadata = { title: `Appointment Categories - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <AppointmentCategoryListView />
    </>
  );
}
