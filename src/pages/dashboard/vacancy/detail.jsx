import { Helmet } from "react-helmet-async";

import { useParams } from "src/routes/hooks";

import { CONFIG } from "src/global-config";

import { VacancyDetailView } from "src/sections/vacancy/view";

// ----------------------------------------------------------------------

const metadata = { title: `Vacancy details - ${CONFIG.appName}` };

export default function Page() {
  const { id = "" } = useParams();

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <VacancyDetailView id={id} />
    </>
  );
}
