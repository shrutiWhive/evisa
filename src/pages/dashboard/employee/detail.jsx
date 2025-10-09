import { Helmet } from "react-helmet-async";

import { useParams } from "src/routes/hooks";

import { CONFIG } from "src/global-config";

import { EmployeeDetailView } from "src/sections/employee/view";

// ----------------------------------------------------------------------

const metadata = { title: `Employee details - ${CONFIG.appName}` };

export default function Page() {
  const { id = "" } = useParams();

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <EmployeeDetailView id={id} />
    </>
  );
}
