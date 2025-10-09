import { z as zod } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useAppSelector } from "src/redux/hooks";
import { selectFormTemplateState } from "src/redux/selectors";

import {
  Box,
  Stack,
  Typography,
  Divider,
  MenuItem,
  Button,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

import { Form, Field } from "src/components/hook-form";
import { toast } from "src/components/snackbar";

import { createLead } from "src/api";
import { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useDeviceIdentifier } from "src/helper/user-unique";
// import { decrypt } from "src/helper/encrypt";
import { Markdown } from "src/components/markdown";
import { Iconify } from "src/components/iconify";

const handleError = (error) => {
  const msg = error?.message;

  if (typeof msg === "string") {
    toast.error(msg);
  } else if (typeof msg === "object" && msg !== null) {
    const firstKey = Object.keys(msg)[0];
    const firstMsg = msg[firstKey];

    toast.error(Array.isArray(firstMsg) ? firstMsg[0] : firstMsg);
  } else {
    toast.error("Something went wrong");
  }
};

function constructSchema(fields, parameterRequiredRules) {
  const shape = {};
  // const ntcRegex = /^98[45][0-9]{7}$/;
  // const ncellRegex = /^98[012][0-9]{7}$/;

  const mobRegex = /^9[7-8][0-9]{8}$/;

  fields.forEach((field) => {
    const {
      name,
      type,
      label,
      is_required,
      validation_rules = [],
      parameters = [],
    } = field;
    let schema;

    switch (type) {
      case "number":
        schema = zod.number();
        break;
      case "checkbox":
        schema = zod.string().array();

        break;
      case "email":
        schema = zod.string().email("Invalid email format");
        break;
      case "url":
        schema = zod.string().url("Invalid URL");
        break;
      case "text":
      case "textarea":
      case "password":
      case "select":
      case "radio":
        schema = zod.string();
        break;
      case "date":
        schema = zod.string();
        break;
      default:
        schema = zod.any();
    }

    // Special case for phone_number
    if (name === "phone_number") {
      schema = zod
        .string()
        .length(10, { message: `${label} must be exactly 10 digits` })
        .refine((val) => mobRegex.test(val), {
          message: `${label} must be a valid NTC or Ncell number`,
        });
    }

    let paramIndex = 0;

    validation_rules.forEach((ruleId) => {
      const rule = parameterRequiredRules.find((r) => r.id === ruleId);

      if (!rule) return;

      const param = parameters[paramIndex] ?? [];

      switch (rule.name) {
        case "min":
          schema =
            type === "number"
              ? schema.min(+param[0])
              : schema.min(+param[0], {
                  message: `${label} must be at least ${param[0]} characters`,
                });
          paramIndex++;

          break;

        case "max":
          schema =
            type === "number"
              ? schema.max(+param[0])
              : schema.max(+param[0], {
                  message: `${label} must be at most ${param[0]} characters`,
                });
          paramIndex++;
          break;

        case "between":
          if (param.length >= 2) {
            schema =
              type === "number"
                ? schema.min(+param[0]).max(+param[1])
                : schema.min(+param[0]).max(+param[1]);
          }
          paramIndex++;
          break;

        case "in":
          schema = schema.refine((val) => param.includes(val), {
            message: `${label} must be one of: ${param.join(", ")}`,
          });
          paramIndex++;
          break;

        case "numeric":
          schema = zod.coerce.number();
          break;

        case "integer":
          schema = zod.coerce.number().int();
          break;

        case "boolean":
          schema = zod.boolean();
          break;

        case "email":
          schema = zod.string().email("Invalid email");
          break;

        case "url":
          schema = zod.string().url("Invalid URL");
          break;

        case "before":
        case "after":
          // custom validation or use `.refine` with provided date
          paramIndex++;
          break;
        default:
          break;
      }
    });

    if (is_required) {
      schema = schema.refine(
        (val) => {
          if (Array.isArray(val)) return val.length > 0;
          return val !== undefined && val !== null && val !== "";
        },
        {
          message: `${label} is required`,
        }
      );
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

export function CampaignLeadForm({
  campaignId,
  fields,
  termsAndConditions,
  organization,
}) {
  const { validationRules } = useAppSelector(selectFormTemplateState);
  const { device_uuid, fingerprint } = useDeviceIdentifier();

  const parameterRequiredRules = validationRules?.filter(
    (rule) => rule.has_parameters === 1
  );

  const schema = constructSchema(fields, parameterRequiredRules);

  const defaultValues = constructDefaultValues(fields);

  const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
  const [captchaToken, setCaptchaToken] = useState(null);
  const recaptchaRef = useRef(null);

  const termsHtml = termsAndConditions;

  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting, errors },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    if (!captchaToken) {
      toast.error("Please complete the CAPTCHA.");
      return;
    }

    // if (!device_uuid || !fingerprint) {
    //   toast.error("Device identification in progress, please wait...");
    //   return;
    // }

    const { phone_number, ...rest } = data;

    try {
      // const decryptedCampaignId = await decrypt(campaignId);

      const leadData = {
        campaign_id: campaignId,
        phone_number: data.phone_number,
        // topup_status: "PENDING",
        meta_data: {
          ...rest,
        },
        captcha: captchaToken,
        device_uuid,
        fingerprint,
        termsAndConditions,
      };

      const response = await createLead(leadData);

      reset();
      recaptchaRef.current?.reset(); // reset captcha
      setCaptchaToken(null);

      toast.success(response?.message || "Thank you for your submission!");
    } catch (error) {
      console.error(error);
      // toast.error(
      //   error?.message || "Could not submit the form! Please try again."
      // );
      handleError(error);
    }
  });

  const renderFormFields = () => (
    <Stack spacing={2}>
      {fields.map((field) => {
        const { name, type, label, options } = field;

        const parsedOptions = JSON.parse(options);

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
      <LoadingButton
        color="primary"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Submit..."
      >
        Submit
      </LoadingButton>
    </Box>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3}>
        {renderFormFields()}

        {/* <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={SITE_KEY}
          onChange={(token) => setCaptchaToken(token)}
        /> */}

        <Stack direction="row" alignItems="center" spacing={2}>
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={SITE_KEY}
            onChange={(token) => setCaptchaToken(token)}
          />

          <LoadingButton
            variant="outlined"
            onClick={() => {
              recaptchaRef.current?.reset();
              setCaptchaToken(null);
            }}
            size="small"
            startIcon={<Iconify icon="mdi:refresh" />}
          >
            Refresh
          </LoadingButton>
        </Stack>

        <Box sx={{ mt: 2 }}>
          <Typography variant="h6">Terms and Conditions</Typography>

          <Box
            sx={{ mt: 1, p: 2 }}
            // dangerouslySetInnerHTML={{ __html: termsHtml }}
          >
            <Markdown children={termsAndConditions} />
          </Box>
        </Box>

        {renderActions()}
      </Stack>
    </Form>
  );
}
