import { Helmet } from "react-helmet-async";

import { CONFIG } from "src/global-config";

import { FormTemplateListView } from "src/sections/form-template/view";

// ----------------------------------------------------------------------

const metadata = { title: `Form Template - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <FormTemplateListView />
    </>
  );
}
