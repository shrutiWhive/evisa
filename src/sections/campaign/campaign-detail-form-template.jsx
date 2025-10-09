// import { z as zod } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";

// import {
//   Stack,
//   Card,
//   Box,
//   Typography,
//   Button,
//   Divider,
//   MenuItem,
// } from "@mui/material";

// import { useAppSelector } from "src/redux/hooks";
// import { selectFormTemplateState } from "src/redux/selectors";

// import { Form, Field } from "src/components/hook-form";

// import { constructSchema, constructDefaultValues } from "./utils";
// import { CONFIG } from "src/global-config";

// export function CampaignDetailFormTemplate() {
//   const { formTemplateDetail, isLoading } = useAppSelector(
//     selectFormTemplateState
//   );

//   const { fields } = formTemplateDetail;

//   const schema = constructSchema(fields || []);

//   const defaultValues = constructDefaultValues(fields || []);

//   const methods = useForm({
//     resolver: zodResolver(schema),
//     defaultValues,
//   });

//   const { handleSubmit, setValue, reset } = methods;

//   const onSubmit = handleSubmit((data) => {
//     reset();
//   });

//   const renderFormFields = () => (
//     <Stack spacing={2}>
//       {fields?.slice(0, 7)?.map((field) => {
//         const { name, type, label, options } = field;

//         // const parsedOptions = JSON.parse(options);

//         // const inputOptions = parsedOptions?.map((option) => ({
//         //   label: option,
//         //   value: option?.toLowerCase(),
//         // }));

//         let parsedOptions = [];

//         try {
//           parsedOptions =
//             options && options !== "null" ? JSON.parse(options) : [];
//         } catch (error) {
//           console.error("Failed to parse options for field:", name, error);
//           parsedOptions = [];
//         }

//         const inputOptions = parsedOptions?.map((option) => ({
//           label: option,
//           value: option?.toLowerCase(),
//         }));

//         switch (type) {
//           case "text":
//           case "email":
//           case "url":
//             return <Field.Text key={name} name={name} label={label} />;

//           case "number":
//           case "password":
//             return (
//               <Field.Text key={name} type={type} name={name} label={label} />
//             );

//           case "textarea":
//             return (
//               <Field.Text
//                 key={name}
//                 name={name}
//                 label={label}
//                 multiline
//                 rows={3}
//               />
//             );

//           case "select":
//             return (
//               <Field.Select key={name} name={name} label={label}>
//                 <MenuItem value="">None</MenuItem>

//                 <Divider sx={{ borderStyle: "dashed" }} />

//                 {parsedOptions?.map((option) => (
//                   <MenuItem key={option.value} value={option.label}>
//                     {option.label}
//                   </MenuItem>
//                 ))}
//               </Field.Select>
//             );

//           case "radio":
//             return (
//               <Field.RadioGroup
//                 key={name}
//                 name={name}
//                 label={label}
//                 options={inputOptions}
//                 sx={{ gap: 0.75 }}
//               />
//             );

//           case "checkbox":
//             return (
//               <Field.MultiCheckbox
//                 key={name}
//                 name={name}
//                 label={label}
//                 options={inputOptions}
//                 sx={{ gap: 2 }}
//               />
//             );

//           case "date":
//             return <Field.DatePicker key={name} name={name} label={label} />;

//           case "file":
//             return (
//               <Stack key={name} spacing={1}>
//                 <Typography variant="subtitle1"> {label} </Typography>

//                 <Field.Upload
//                   name={name}
//                   onDelete={() =>
//                     setValue(name, null, { shouldValidate: true })
//                   }
//                 />
//               </Stack>
//             );
//           default:
//             return null;
//         }
//       })}
//     </Stack>
//   );

//   return (
//     <Form methods={methods} onSubmit={onSubmit}>
//       <Stack spacing={3}>
//         {formTemplateDetail?.featured_image && (
//           <Box
//             sx={{
//               width: "100%",
//               maxHeight: 250,
//               overflow: "hidden",
//               borderRadius: 2,
//               border: "1px solid",
//               borderColor: "divider",
//             }}
//           >
//             <img
//               src={`${CONFIG.assetsDir}${formTemplateDetail.featured_image}`}
//               alt={formTemplateDetail.name}
//               style={{
//                 width: "100%",
//                 height: "auto",
//                 objectFit: "cover",
//               }}
//             />
//           </Box>
//         )}

//         {renderFormFields()}
//       </Stack>
//     </Form>
//   );
// }

import {
  Stack,
  Box,
  Typography,
  Divider,
  MenuItem,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
} from "@mui/material";

import { useAppSelector } from "src/redux/hooks";
import { selectFormTemplateState } from "src/redux/selectors";
import { CONFIG } from "src/global-config";

export function CampaignDetailFormTemplate() {
  const { formTemplateDetail, isLoading } = useAppSelector(
    selectFormTemplateState
  );

  const { fields } = formTemplateDetail;

  const renderFormFields = () => (
    <Stack spacing={2}>
      {fields?.slice(0, 7)?.map((field) => {
        const { name, type, label, options } = field;

        let parsedOptions = [];

        try {
          parsedOptions =
            options && options !== "null" ? JSON.parse(options) : [];
        } catch (error) {
          console.error("Failed to parse options for field:", name, error);
          parsedOptions = [];
        }

        const inputOptions = parsedOptions?.map((option) => ({
          label: option,
          value: option?.toLowerCase(),
        }));

        switch (type) {
          case "text":
          case "email":
          case "url":
          case "number":
          case "password":
            return (
              <TextField
                key={name}
                label={label}
                fullWidth
                type={type}
                variant="outlined"
              />
            );

          case "textarea":
            return (
              <TextField
                key={name}
                label={label}
                fullWidth
                multiline
                rows={3}
                variant="outlined"
              />
            );

          case "select":
            return (
              <TextField
                key={name}
                label={label}
                fullWidth
                select
                variant="outlined"
              >
                <MenuItem value="">None</MenuItem>
                <Divider sx={{ borderStyle: "dashed" }} />
                {inputOptions?.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            );

          case "radio":
            return (
              <FormControl key={name}>
                <FormLabel>{label}</FormLabel>
                <RadioGroup column>
                  {inputOptions?.map((option) => (
                    <FormControlLabel
                      key={option.value}
                      value={option.value}
                      control={<Radio />}
                      label={option.label}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            );

          case "checkbox":
            return (
              <FormControl key={name}>
                <FormLabel>{label}</FormLabel>
                <Stack direction="column" spacing={2}>
                  {inputOptions?.map((option) => (
                    <FormControlLabel
                      key={option.value}
                      control={<Checkbox />}
                      label={option.label}
                    />
                  ))}
                </Stack>
              </FormControl>
            );

          case "date":
            return (
              <TextField
                key={name}
                label={label}
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            );

          case "file":
            return (
              <Stack key={name} spacing={1}>
                <Typography variant="subtitle1">{label}</Typography>
                <input type="file" />
              </Stack>
            );

          default:
            return null;
        }
      })}
    </Stack>
  );

  if (isLoading || !fields) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Stack spacing={3}>
      {formTemplateDetail?.featured_image && (
        <Box
          sx={{
            width: "100%",
            maxHeight: 250,
            overflow: "hidden",
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <img
            src={`${CONFIG.assetsDir}${formTemplateDetail.featured_image}`}
            alt={formTemplateDetail.name}
            style={{
              width: "100%",
              height: "auto",
              objectFit: "cover",
            }}
          />
        </Box>
      )}

      {renderFormFields()}
    </Stack>
  );
}
