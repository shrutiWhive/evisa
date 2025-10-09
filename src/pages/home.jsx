import { Helmet } from "react-helmet-async";

import { HomeView } from "src/sections/home";

// ----------------------------------------------------------------------

const metadata = {
  title: "EB3 Visa",
  description: "Smart Enrollment",
};

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </Helmet>

      <HomeView />
    </>
  );
}
