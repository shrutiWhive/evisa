import { useGetVacancy } from "src/api/vacancy";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";
import { DashboardContent } from "src/layouts/dashboard";
import { paths } from "src/routes/paths";
import { VacancyList } from "src/sections/app/view/vacancy-list";

export function VacancyListView() {
  const { vacancy } = useGetVacancy();
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        links={[
          { name: "Dashboard", href: paths.dashboard.root },
          {
            name: "Vacancy",
            href: paths.dashboard.vacancy.root,
          },
          { name: "List" },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <VacancyList vacancyList={vacancy} />
    </DashboardContent>
  );
}
