import { Helmet } from "react-helmet-async";

import { useParams } from "src/routes/hooks";

import { CONFIG } from "src/global-config";

import { FormTemplateDetailView } from "src/sections/form-template/view";

// ----------------------------------------------------------------------

const metadata = { title: `Form template details - ${CONFIG.appName}` };

export default function Page() {
  const { id = "" } = useParams();

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <FormTemplateDetailView id={id} />
    </>
  );
}
