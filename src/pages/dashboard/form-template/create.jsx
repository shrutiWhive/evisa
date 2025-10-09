import { Helmet } from "react-helmet-async";

import { CONFIG } from "src/global-config";

import { FormTemplateCreateView } from "src/sections/form-template/view";

// ----------------------------------------------------------------------

const metadata = {
  title: `Create a new form template - ${CONFIG.appName}`,
};

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <FormTemplateCreateView />
    </>
  );
}
