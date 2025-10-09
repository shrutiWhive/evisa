import { Helmet } from "react-helmet-async";

import { CONFIG } from "src/global-config";

import { AppointmentTimeSlotListView } from "src/sections/appointment-time-slot/view";

// ----------------------------------------------------------------------

const metadata = { title: `Appointment Time Slots - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <AppointmentTimeSlotListView />
    </>
  );
}
