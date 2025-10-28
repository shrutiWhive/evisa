import { Helmet } from "react-helmet-async";
import { CONFIG } from "src/global-config";
import { ContractList } from "src/sections/contract/view/contract-list-view";

const metadata = { title: `Contract - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ContractList />
    </>
  );
}
