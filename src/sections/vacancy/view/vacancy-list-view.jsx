import { useEffect } from "react";
import { useGetVacancy } from "src/api/vacancy";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";
import { DashboardContent } from "src/layouts/dashboard";
import { fetchVacancyRequest } from "src/redux/actions/vacancy-actions";
import { useAppDispatch, useAppSelector } from "src/redux/hooks";
import { paths } from "src/routes/paths";
import { VacancyList } from "src/sections/app/view/vacancy-list";

export function VacancyListView() {
  const dispatch = useAppDispatch();

  const { vacancy, isLoading } = useAppSelector((state) => state.vacancy);

  useEffect(() => {
    dispatch(fetchVacancyRequest());
  }, [dispatch]);
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
