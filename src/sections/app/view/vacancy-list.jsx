import { Box } from "@mui/material";
import { VacancyItem } from "./vacancy-item";

export function VacancyList({ vacancyList }) {
    console.log("this is vacancy list", vacancyList);
  //   const handleDelete = useCallback((id) => {
  //     console.info('DELETE', id);
  //   }, []);

  return (
    <>
      <Box
        sx={{
          gap: 3,
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
        }}
      >
        {vacancyList.map((job) => (
          <VacancyItem
            key={job.id}
            job={job}
            // editHref={paths.dashboard.job.edit(job.id)}
            // detailsHref={paths.dashboard.job.details(job.id)}
            // onDelete={() => handleDelete(job.id)}
          />
        ))}
      </Box>

      {/* {jobs.length > 8 && (
        <Pagination
          count={8}
          sx={{
            mt: { xs: 8, md: 8 },
            [`& .${paginationClasses.ul}`]: { justifyContent: 'center' },
          }}
        />
      )} */}
    </>
  );
}
