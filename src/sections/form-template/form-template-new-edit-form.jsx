import { useBoolean } from "minimal-shared/hooks";
import { useEffect } from "react";
import { z as zod } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Box, Stack, Card, Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";

import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";

import { fetchValidationRulesRequest } from "src/redux/actions";
import { useAppDispatch, useAppSelector } from "src/redux/hooks";
import { selectFormTemplateState } from "src/redux/selectors";

import { fToFieldName, fBase64 } from "src/utils";

import { toast } from "src/components/snackbar";
import { Form, Field } from "src/components/hook-form";
import { Iconify } from "src/components/iconify";

import { CONFIG } from "src/global-config";

import { createFormTemplate, updateFormTemplate } from "src/api";

import { FormTemplateNewEditFields } from "./form-template-new-edit-fields";
import { ACCEPTED_IMAGE_TYPES, OPTION_BASED_INPUT_TYPES } from "./constant";

// ----------------------------------------------------------------------

const schema = zod.object({
  template_name: zod.string().min(1, { message: "Template name is required!" }),

  template_description: zod
    .string()
    .min(1, { message: "Template description is required!" }),

  featured_image: zod
    .instanceof(File)
    .optional()
    .nullable()
    .refine(
      (file) =>
        file === null ||
        file === undefined ||
        ACCEPTED_IMAGE_TYPES.includes(file.type),
      {
        message: "Only PNG, JPG, JPEG, and WEBP files are allowed",
      }
    ),

  fields: zod.array(
    zod
      .object({
        label: zod.string().min(1, { message: "Label is required!" }),
        name: zod.string().min(1, { message: "Name is required!" }),
        type: zod.string().min(1, { message: "Type is required!" }),
        options: zod
          .array(
            zod.object({
              option: zod.string().optional(),
            })
          )
          .optional(),
        validation_rules: zod.array(zod.string())
        .min(1, { message: "At least one validation rule must be selected" }),
        parameters: zod.string().array().optional(),
        order: zod.number().optional(),
        is_required: zod.boolean().optional(),
      })

      .superRefine((field, ctx) => {
        if (OPTION_BASED_INPUT_TYPES.includes(field.type)) {
          if (Array.isArray(field.options)) {
            field.options.forEach((opt, i) => {
              if (!opt.option.trim()) {
                ctx.addIssue({
                  path: ["options", i, "option"],
                  code: zod.ZodIssueCode.custom,
                  message: "Option is required!",
                });
              }
            });
          }
        }
      })
  ),
});

// ----------------------------------------------------------------------

export function FormTemplateNewEditForm({ currentFormTemplate }) {
  const hasExistingImage = Boolean(currentFormTemplate?.featured_image);
  const existingImageUrl = hasExistingImage
    ? `${CONFIG.assetsDir}${currentFormTemplate.featured_image}`
    : null;

  const router = useRouter();

  const addBannerImage = useBoolean();

  const dispatch = useAppDispatch();

  const { validationRules } = useAppSelector(selectFormTemplateState);

  const parameterRequiredRules = validationRules?.filter(
    (rule) => rule.has_parameters === 1
  );

  const defaultValues = {
    template_name: currentFormTemplate?.name || "",
    template_description: currentFormTemplate?.description || "",
    featured_image: null,
    fields: [
      {
        label: "Phone Number",
        name: "phone_number",
        type: "text",
        options: [
          {
            option: "",
          },
        ],
        validation_rules: ["1"],
        parameters: [],
        order: 1,
        is_required: true,
      },
    ],
  };

  const methods = useForm({
    mode: "all",
    resolver: zodResolver(schema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = methods;

  useEffect(() => {
    if (currentFormTemplate) {
      const transformedFields =
        currentFormTemplate.fields?.map((field, index) => ({
          label: field.label || "",
          name: field.name || "",
          type: field.type || "",
          options:
            field.options && typeof field.options === "string"
              ? JSON.parse(field.options)?.map((opt) => ({ option: opt })) || [
                  { option: "" },
                ]
              : Array.isArray(field.options)
              ? field.options.map((opt) => ({ option: opt }))
              : [{ option: "" }],
          validation_rules:
            field.validation_rules?.map((rule) =>
              rule.validation_rule_id.toString()
            ) || [],
          parameters: [], // your backend sends null — so default to empty array
          order: field.order ?? index + 1,
          is_required: field.is_required === 1, // convert 1/0 to boolean
        })) || [];

      reset({
        template_name: currentFormTemplate.name || "",
        template_description: currentFormTemplate.description || "",
        featured_image: null,
        fields: transformedFields,
      });
    }
  }, [currentFormTemplate, reset]);

  useEffect(() => {
    dispatch(fetchValidationRulesRequest());
  }, [dispatch]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const { featured_image, fields, ...restData } = data;

      const nameList = fields.map((field) => fToFieldName(field.name));
      const nameSet = new Set(nameList);

      if (nameList.length !== nameSet.size) {
        toast.error(
          "Each field must have a unique name. Please check for duplicates."
        );

        return;
      }

      const formTemplateData = {
        ...restData,
        fields: [],
      };

      if (featured_image instanceof File) {
        formTemplateData.featured_image = await fBase64(featured_image);
      }

      formTemplateData.fields = data.fields.map(
        ({ parameters, options, ...field }, index) => {
          let paramIndex = 0;

          const mappedField = {
            ...field,
            order: index + 1, // order of input fields
            name: fToFieldName(field.name),
            validation_rules: field.validation_rules.map((ruleId) => {
              const matchedRule = parameterRequiredRules.find(
                (r) => r.id == ruleId
              );

              const ruleObj = {
                validation_rule_id: ruleId,
                ...(matchedRule
                  ? { parameters: parameters[paramIndex] ?? [] }
                  : {}),
              };

              if (matchedRule) {
                paramIndex += 1;
              }

              return ruleObj;
            }),
          };

          if (options.some((o) => o.option?.trim() !== "")) {
            mappedField.options = options.map((option) => option.option);
          }

          return mappedField;
        }
      );

      const response = currentFormTemplate
        ? await updateFormTemplate(currentFormTemplate.id, formTemplateData)
        : await createFormTemplate(formTemplateData);

      toast.success(response?.message);

      reset();

      addBannerImage.onFalse();

      const path = currentFormTemplate
        ? paths.dashboard.formTemplate.detail(currentFormTemplate?.id)
        : paths.dashboard.formTemplate.root;

      router.push(path);
    } catch (error) {
      toast.error(
        error?.message || "Couldn't create campaign. Please try again!"
      );
    }
  });

  const renderHeader = () => (
    <Card
      sx={{
        p: 3,
        gap: 3,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: { xs: 3, sm: 2 },
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <Field.Text name="template_name" label="Template Name" />

        <Field.Text name="template_description" label="Template Description" />
      </Box>

      {/* {addBannerImage.value ? (
        <Field.Upload
          name="featured_image"
          onDelete={() => setValue("featured_image", null)}
          existingImage={existingImageUrl}
        />
      ) : (
        <Button
          color="primary"
          variant="contained"
          startIcon={<Iconify icon="eva:image-fill" />}
          onClick={addBannerImage.onTrue}
          sx={{ ml: "auto" }}
        >
          Add Banner Image
        </Button>
      )} */}

      {/* {currentFormTemplate?.featured_image && !addBannerImage.value ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <img
            src={`${CONFIG.assetsDir}${currentFormTemplate.featured_image}`}
            alt="Featured"
            style={{ maxWidth: 300, borderRadius: 8, border: "1px solid #ccc" }}
          />

          <Button
            color="error"
            variant="text"
            size="small"
            sx={{ mt: 1 }}
            onClick={() => {
              // Remove the image and show "Add Banner Image" button
              setValue("featured_image", null);
              addBannerImage.onTrue();
            }}
          >
            Remove Image
          </Button>
        </Box>
      ) : addBannerImage.value ? (
        // Show the upload field after clicking "Add Banner Image" or removing image
        <Field.Upload
          name="featured_image"
          onDelete={() => {
            setValue("featured_image", null);
            addBannerImage.onFalse();
          }}
        />
      ) : (
        <Button
          color="primary"
          variant="contained"
          startIcon={<Iconify icon="eva:image-fill" />}
          onClick={addBannerImage.onTrue}
          sx={{ ml: "auto" }}
        >
          Add Banner Image
        </Button>
      )} */}

      {currentFormTemplate?.featured_image && !addBannerImage.value ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <img
            src={`${CONFIG.assetsDir}${currentFormTemplate.featured_image}`}
            alt="Featured"
            style={{ maxWidth: 300, borderRadius: 8, border: "1px solid #ccc" }}
          />

          <Button
            color="error"
            variant="text"
            size="small"
            sx={{ mt: 1 }}
            onClick={() => {
              setValue("featured_image", null);
              addBannerImage.onTrue();
            }}
          >
            Remove Image
          </Button>
        </Box>
      ) : addBannerImage.value ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {/* Dismiss button at top-left */}
          <Button
            size="small"
            color="error"
            onClick={() => {
              setValue("featured_image", null);
              addBannerImage.onFalse();
            }}
            sx={{ alignSelf: "flex-start" }}
          >
            Dismiss
          </Button>

          {/* File upload field */}
          <Field.Upload
            name="featured_image"
            onDelete={() => {
              setValue("featured_image", null);
              addBannerImage.onFalse();
            }}
          />
        </Box>
      ) : (
        <Button
          color="primary"
          variant="contained"
          startIcon={<Iconify icon="eva:image-fill" />}
          onClick={addBannerImage.onTrue}
          sx={{ ml: "auto" }}
        >
          Add Banner Image
        </Button>
      )}
    </Card>
  );

  const renderActions = () => (
    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
      <LoadingButton
        type="submit"
        variant="contained"
        size="large"
        loading={isSubmitting}
        sx={{ ml: 2 }}
      >
        {currentFormTemplate ? "Update form template" : "Create form template"}
      </LoadingButton>
    </Box>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3}>
        {renderHeader()}

        <FormTemplateNewEditFields />

        {renderActions()}
      </Stack>
    </Form>
  );
}
