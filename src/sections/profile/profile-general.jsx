import { z as zod } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Box, Button, Card, Stack, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

import { useAppDispatch, useAppSelector } from "src/redux/hooks";
import { selectProfileState } from "src/redux/selectors";

import { toast } from "src/components/snackbar";
import { Form, Field } from "src/components/hook-form";
import Grid from "@mui/material/Grid2";
import { fData } from "src/utils";
import { updateProfileSchema } from "./profile-scheme";
import { updateOrganization } from "src/api";
import { fetchProfileRequest, updateOrg } from "src/redux/actions";
import SecondaryColorPicker from "src/components/color/secondary-color";
import { CONFIG } from "src/global-config";
import PrimaryColorPicker from "src/components/color/primary-color";
import { useRouter } from "src/routes/hooks";
import { paths } from "src/routes/paths";

// ----------------------------------------------------------------------

export function ProfileGeneral() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { profile } = useAppSelector(selectProfileState);
  const {
    name,
    email,
    contact_number,
    address,
    // credit,
    logo,
    // primary_color,
    // secondary_color,
  } = profile || {};
  // console.log("this is profile", profile);
  const currentOrganization = {
    name,
    email,
    contact_number,
    address,
    // credit,
    logo: CONFIG.assetsDir + logo,
    // primary_color:
    //   typeof primary_color === "string"
    //     ? JSON.parse(primary_color)
    //     : primary_color || undefined,
    // secondary_color:
    //   typeof secondary_color === "string"
    //     ? JSON.parse(secondary_color)
    //     : secondary_color || undefined,
  };

  const defaultValues = {
    name: "",
    email: "",
    contact_number: "",
    address: "",
    // balance: "",
    logo: "",
    // primary_color: null,
    // secondary_color: null,
  };

  const methods = useForm({
    mode: "all",
    resolver: zodResolver(updateProfileSchema),
    defaultValues,
    values: currentOrganization,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const convertFileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      if (!(file instanceof File)) {
        reject(new Error("Invalid file input"));
        return;
      }

      const reader = new FileReader();

      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });

  const onSubmit = handleSubmit(async (data) => {
    try {
      const updatedData = { ...data };

      if (updatedData.logo instanceof File) {
        updatedData.logo = await convertFileToBase64(updatedData.logo);
      } else {
        delete updatedData.logo;
      }

      // updatedData.primary_color = updatedData.primary_color || {};
      // updatedData.secondary_color = updatedData.secondary_color || {};
      // if (!updatedData.primary_color?.main) {
      //   updatedData.primary_color = undefined;
      // }

      // if (!updatedData.secondary_color?.main) {
      //   updatedData.secondary_color = undefined;
      // }
      const response = await updateOrganization(updatedData);

      dispatch(updateOrg(response[0]));
      dispatch(fetchProfileRequest());

      toast.success(response.message || "Organization updated successfully!");
      router.push(paths.dashboard.root);
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(error.message || "Couldn't update organization! Try again.");
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              pt: 10,
              pb: 5,
              px: 3,
              textAlign: "center",
            }}
          >
            <Field.UploadAvatar
              name="logo"
              // maxSize={3145728}
              helperText={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 3,
                    mx: "auto",
                    display: "block",
                    textAlign: "center",
                    color: "text.disabled",
                  }}
                >
                  Allowed *.jpeg, *.jpg, *.png
                  <br /> max size of {fData(3145728)}
                </Typography>
              }
            />
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Box
                sx={{
                  rowGap: 3,
                  columnGap: 2,
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "repeat(1, 1fr)",
                    sm: "repeat(2, 1fr)",
                  },
                }}
              >
                <Field.Text name="name" label="Name" />
                <Field.Text name="email" label="Company Email address" />
                <Field.Text name="contact_number" label="Contact number" />
              </Box>
              <Field.Text name="address" label="Address" />
              {/* <Box
                sx={{
                  rowGap: 3,
                  columnGap: 2,
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "repeat(1, 1fr)",
                    sm: "repeat(2, 1fr)",
                  },
                }}
              >
                <PrimaryColorPicker
                  primary_color="primary_color"
                  label="Primary Color"
                />
                <SecondaryColorPicker
                  secondary_color="secondary_color"
                  label="Secondary Color"
                />
              </Box> */}
            </Stack>
            <Stack spacing={3} sx={{ mt: 3, alignItems: "flex-end" }}>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
              >
                Save changes
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
