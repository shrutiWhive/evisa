import { Helmet } from "react-helmet-async";

import { CONFIG } from "src/global-config";
import { VacancyListView } from "src/sections/vacancy/view/vacancy-list-view";


// ----------------------------------------------------------------------

const metadata = { title: `Job - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <VacancyListView />
    </>
  );
}
