import { Box, Pagination, paginationClasses } from "@mui/material";

import { paths } from "src/routes/paths";

import { FormTemplateItemSkeleton } from "./form-template-skeleton";
import { FormTemplateItem } from "./form-template-item";
import { RouterLink } from "src/routes/components";

// ----------------------------------------------------------------------

export function FormTemplateList({ formTemplates, loading }) {
  const renderLoading = () => <FormTemplateItemSkeleton />;
  const newLeadBoxHeight = formTemplates.length === 0 ? 150 : "auto";
  const renderList = () => [
    <Box
      key="add-template"
      component={RouterLink}
      href={paths.dashboard.formTemplate.create}
      sx={{
        height: newLeadBoxHeight,
        border: "2px dashed",
        borderColor: "primary.main",
        borderRadius: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textDecoration: "none",
        color: "primary.main",
        typography: "subtitle1",
        "&:hover": {
          bgcolor: "action.hover",
        },
      }}
      // onClick={() => {
      //   window.location.href = paths.dashboard.formTemplate.create;
      // }}
    >
      + New Form Template
    </Box>,
    formTemplates.map((template, index) => (
      <FormTemplateItem
        key={template.id}
        index={index}
        formTemplate={template}
        detailsHref={paths.dashboard.formTemplate.detail(template.id)}
        editHref={paths.dashboard.formTemplate.edit(template.id)}
      />
    )),
  ];

  return (
    <>
      <Box
        sx={{
          gap: 3,
          display: "grid",
          gridTemplateColumns: { xs: "repeat(1, 1fr)", md: "repeat(2, 1fr)" },
        }}
      >
        {loading ? renderLoading() : renderList()}
      </Box>

      {/* {formTemplates.length > 8 && (
        <Pagination
          count={8}
          sx={{
            mt: { xs: 5, md: 8 },
            [`& .${paginationClasses.ul}`]: { justifyContent: "center" },
          }}
        />
      )} */}
    </>
  );
}
