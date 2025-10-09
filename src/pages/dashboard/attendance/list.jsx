import { Helmet } from "react-helmet-async";
import { CONFIG } from "src/global-config";
import { AttendanceListView } from "src/sections/attendance/view/attendance-list-view";

const metadata = { title: `Attendance - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <AttendanceListView />
    </>
  );
}
