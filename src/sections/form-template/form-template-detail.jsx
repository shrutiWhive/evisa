import { z as zod } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Stack,
  Card,
  Box,
  Typography,
  Button,
  Divider,
  MenuItem,
} from "@mui/material";

import { Form, Field } from "src/components/hook-form";
import { CONFIG } from "src/global-config";

function constructSchema(fields) {
  const shape = {};

  fields.forEach((field) => {
    const { name, type } = field;

    let schema;

    switch (type) {
      case "number":
        schema = zod.coerce.number();
        break;
      case "checkbox":
        schema = zod.array(zod.string());
        break;
      case "email":
      case "url":
      case "text":
      case "textarea":
      case "password":
      case "select":
      case "radio":
      case "date":
        schema = zod.string();
        break;
      default:
        schema = zod.any();
    }

    shape[name] = schema;
  });

  return zod.object(shape);
}

function constructDefaultValues(fields) {
  const defaultValues = {};

  fields.forEach((field) => {
    switch (field.type) {
      case "checkbox":
        defaultValues[field.name] = [];
        break;

      case "date":
      case "file":
        defaultValues[field.name] = null;
        break;

      case "radio":
      case "select":
      case "text":
      case "textarea":
      case "email":
      case "number":
      case "url":
      case "password":
      default:
        defaultValues[field.name] = "";
        break;
    }
  });

  return defaultValues;
}

export function FormTemplateDetail({ description, fields, featuredImage }) {
  const schema = constructSchema(fields);

  const defaultValues = constructDefaultValues(fields);

  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const { handleSubmit, setValue, reset } = methods;

  const onSubmit = handleSubmit((data) => {
    reset();
  });

  const renderFormFields = () => (
    <Stack spacing={2}>
      {fields.map((field) => {
        const { name, type, label, options } = field;

        // const parsedOptions = JSON.parse(options);
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
            return <Field.Text key={name} name={name} label={label} />;

          case "number":
          case "password":
            return (
              <Field.Text key={name} type={type} name={name} label={label} />
            );

          case "textarea":
            return (
              <Field.Text
                key={name}
                name={name}
                label={label}
                multiline
                rows={3}
              />
            );

          case "select":
            return (
              <Field.Select key={name} name={name} label={label}>
                <MenuItem value="">None</MenuItem>

                <Divider sx={{ borderStyle: "dashed" }} />

                {inputOptions.map((option) => (
                  <MenuItem key={option.value} value={option.label}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>
            );

          case "radio":
            return (
              <Field.RadioGroup
                key={name}
                name={name}
                label={label}
                options={inputOptions}
                sx={{ gap: 0.75 }}
              />
            );

          case "checkbox":
            return (
              <Field.MultiCheckbox
                key={name}
                name={name}
                label={label}
                options={inputOptions}
                sx={{ gap: 2 }}
              />
            );

          case "date":
            return <Field.DatePicker key={name} name={name} label={label} />;

          case "file":
            return (
              <Stack key={name} spacing={1}>
                <Typography variant="subtitle1"> {label} </Typography>

                <Field.Upload
                  name={name}
                  onDelete={() =>
                    setValue(name, null, { shouldValidate: true })
                  }
                />
              </Stack>
            );
          default:
            return null;
        }
      })}
    </Stack>
  );

  const renderActions = () => (
    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
      <Button color="primary" type="submit" variant="contained">
        Submit
      </Button>
    </Box>
  );

  return (
    <Stack spacing={3}>
      <Card sx={{ p: 3, gap: 1, display: "flex", flexDirection: "column" }}>
        <Typography variant="h6"> Description </Typography>

        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {description}
        </Typography>

        {featuredImage && (
          <Box
            component="img"
            src={`${CONFIG.assetsDir}${featuredImage}`}
            alt="Featured"
            sx={{
              mt: 2,
              maxWidth: 400,
              width: "100%",
              borderRadius: 2,
              objectFit: "cover",
            }}
          />
        )}
      </Card>

      <Card sx={{ p: 3, gap: 2, display: "flex", flexDirection: "column" }}>
        <Typography variant="h6"> Template Showcase </Typography>

        <Form methods={methods} onSubmit={onSubmit}>
          <Stack spacing={3}>
            {renderFormFields()}

            {renderActions()}
          </Stack>
        </Form>
      </Card>
    </Stack>
  );
}
