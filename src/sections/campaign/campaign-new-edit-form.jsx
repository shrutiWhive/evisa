import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useEffect } from "react";
import { z as zod } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";

import {
  Box,
  Stack,
  Divider,
  MenuItem,
  Typography,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";

import { useAppDispatch, useAppSelector } from "src/redux/hooks";
import { fetchFormTemplatesRequest } from "src/redux/actions";
import { selectFormTemplateState } from "src/redux/selectors";

import { toast } from "src/components/snackbar";
import { Form, Field, schemaHelper } from "src/components/hook-form";

import {
  createCampaign,
  updateCampaign,
  useGetRewardTypes,
  useGetTelecommunicationProviders,
  useGetNcellDataPacks,
  useGetNtcDataPacks,
  useGetTopUpAmounts,
} from "src/api";
import dayjs from "dayjs";
import { MobileDatePicker } from "@mui/x-date-pickers";
import { formatPatterns } from "src/utils";

// ----------------------------------------------------------------------

const rewardTypeOptions = [
  { id: 1, label: "None" },
  { id: 2, label: "Data" },
  { id: 3, label: "TopUp" },
];

// const schema = rewardSchema;
const baseSchema = {
  form_template_id: zod.number().min(1, "Form template is required!"),
  name: zod.string().min(1, "Name is required!"),
  description: zod.string().min(1, "Description is required!"),
  terms_and_conditions: zod
    .string()
    .min(1, "Terms and conditions are required"),
  ntc_reward_type: zod.number().min(1).max(3),
  ncell_reward_type: zod.number().min(1).max(3),
  total_leads: zod.coerce
    .number({
      invalid_type_error: "Limited Rewards number must be a number",
      required_error: "Limited Rewards number is required",
    })

    .optional()
    .nullable(),

  ntc_topup_amount: zod.string().optional().nullable(),
  ncell_topup_amount: zod.string().optional().nullable(),
  ntc_data_product_code: zod.string().optional().nullable(),
  ncell_data_product_code: zod.string().optional().nullable(),
  start_date: zod
    .string()
    .min(1, "Start date is required")
    .optional()
    .nullable(),
  end_date: zod.string().min(1, "End date is required").optional().nullable(),
  // is_active: zod.boolean(),
  is_active: zod.coerce.number().refine((val) => val === 0 || val === 1),
  sms_message: zod.string().optional().nullable(),
};

const campaignSchema = zod.object(baseSchema).superRefine((data, ctx) => {
  // ntc_reward_type validations
  if (data.ntc_reward_type === 2) {
    // Data
    if (
      !data.ntc_data_product_code ||
      data.ntc_data_product_code.trim() === ""
    ) {
      ctx.addIssue({
        code: "custom",
        message: "NTC Data Pack is required",
        path: ["ntc_data_product_code"],
      });
    }
  } else if (data.ntc_reward_type === 3) {
    // TopUp
    if (!data.ntc_topup_amount || data.ntc_topup_amount.trim() === "") {
      ctx.addIssue({
        code: "custom",
        message: "NTC Topup Amount is required",
        path: ["ntc_topup_amount"],
      });
    }
  }

  // ncell_reward_type validations
  if (data.ncell_reward_type === 2) {
    // Data
    if (
      !data.ncell_data_product_code ||
      data.ncell_data_product_code.trim() === ""
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Ncell Data Pack is required",
        path: ["ncell_data_product_code"],
      });
    }
  } else if (data.ncell_reward_type === 3) {
    // TopUp
    if (!data.ncell_topup_amount || data.ncell_topup_amount.trim() === "") {
      ctx.addIssue({
        code: "custom",
        message: "Ncell Topup Amount is required",
        path: ["ncell_topup_amount"],
      });
    }
  }

  // If either reward_type 2 or 3 is selected, total_leads should be required
  // if (data.ntc_reward_type !== 1 || data.ncell_reward_type !== 1) {
  //   if (
  //     data.total_leads === undefined ||
  //     data.total_leads === null ||
  //     data.total_leads <= 0
  //   ) {
  //     ctx.addIssue({
  //       code: "custom",
  //       message: "Limited Rewards number is required",
  //       path: ["total_leads"],
  //     });
  //   }
  // }
  if (
    [2, 3].includes(data.ntc_reward_type) ||
    [2, 3].includes(data.ncell_reward_type)
  ) {
    if (
      data.total_leads === undefined ||
      data.total_leads === null ||
      data.total_leads <= 0
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Limited Rewards number is required",
        path: ["total_leads"],
      });
    }
  }
  if (data.start_date && data.end_date) {
    const start = dayjs(data.start_date);
    const end = dayjs(data.end_date);
    if (!start.isValid()) {
      ctx.addIssue({
        code: "custom",
        message: "Start date is invalid",
        path: ["start_date"],
      });
    }
    if (!end.isValid()) {
      ctx.addIssue({
        code: "custom",
        message: "End date is invalid",
        path: ["end_date"],
      });
    }
    if (end.isBefore(start)) {
      ctx.addIssue({
        code: "custom",
        message: "End date must be after start date",
        path: ["end_date"],
      });
    }
  }
});

export { campaignSchema };

// ----------------------------------------------------------------------

export function CampaignNewEditForm({ currentCampaign }) {
  const {
    id,
    form_template_id,
    name,
    description,
    terms_and_conditions,
    start_date,
    end_date,
    is_active,
  } = currentCampaign || {};
  const router = useRouter();

  const dispatch = useAppDispatch();

  const { formTemplates } = useAppSelector(selectFormTemplateState);

  const { rewardTypes } = useGetRewardTypes();

  const { telecommunicationProviders } = useGetTelecommunicationProviders();

  const { ncellDataPacks } = useGetNcellDataPacks();

  const { ntcDataPacks } = useGetNtcDataPacks();

  const { topUpAmounts } = useGetTopUpAmounts();

  const defaultValues = {
    form_template_id: "",
    name: "",
    description: "",
    ntc_reward_type: 1,
    ncell_reward_type: 1,
    ntc_topup_amount: "",
    ncell_topup_amount: "",
    ntc_data_product_code: "",
    ncell_data_product_code: "",
    total_leads: "",
    start_date: "",
    end_date: "",
    is_active: 1,
    send_sms: 0,
    sms_message: "",
    terms_and_conditions: "",
  };
  const methods = useForm({
    mode: "all",
    resolver: zodResolver(campaignSchema),
    defaultValues,
    // values: {
    //   name,
    //   description,
    //   form_template_id: form_template_id ?? "",
    //   // reward_type: currentCampaign?.reward_type ?? 1,
    //   ntc_reward_type: 1,
    //   ncell_reward_type: 1,
    //   start_date: start_date ?? "",
    //   end_date: end_date ?? "",
    //   is_active: 1,
    //   send_sms: 0,
    //   sms_message: "",
    //   terms_and_conditions,
    // },
  });
  const {
    reset,
    control,
    resetField,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  useEffect(() => {
    if (currentCampaign) {
      reset({
        name: currentCampaign.name || "",
        description: currentCampaign.description || "",
        form_template_id: currentCampaign.form_template_id || "",
        // reward_type: currentCampaign.reward_type || "",
        // reward_type: Number(currentCampaign?.reward_type) || 1,
        ntc_reward_type: Number(currentCampaign.ntc_reward_type_id || ""),
        ncell_reward_type: Number(currentCampaign.ncell_reward_type_id || ""),
        ntc_topup_amount: currentCampaign.ntc_topup_amount || "",
        ncell_topup_amount: currentCampaign.ncell_topup_amount || "",
        ntc_data_product_code: currentCampaign.ntc_data_product_code || "",
        ncell_data_product_code: currentCampaign.ncell_data_product_code || "",
        total_leads: currentCampaign.total_leads || null,
        start_date: currentCampaign.start_date
          ? dayjs(currentCampaign.start_date).format("YYYY-MM-DD")
          : "",
        end_date: currentCampaign.end_date
          ? dayjs(currentCampaign.end_date).format("YYYY-MM-DD")
          : "",
        is_active: currentCampaign?.is_active || "",
        send_sms: currentCampaign?.send_sms || "",
        sms_message: currentCampaign?.sms_message || "",
        terms_and_conditions: currentCampaign.terms_and_conditions || "",
      });
    }
  }, [currentCampaign, reset]);

  const rewardType = Number(useWatch({ control, name: "reward_type" }));

  const ncellId = telecommunicationProviders.find(
    (provider) => provider.name === "Ncell"
  )?.id;

  const ntcId = telecommunicationProviders.find(
    (provider) => provider.name === "NTC"
  )?.id;

  const ntcTopUpAmounts = topUpAmounts.filter(
    (amount) => amount.telco_id === ntcId
  );

  const ncellTopUpAmounts = topUpAmounts.filter(
    (amount) => amount.telco_id === ncellId
  );

  const ntcRewardType = Number(useWatch({ control, name: "ntc_reward_type" }));
  const ncellRewardType = Number(
    useWatch({ control, name: "ncell_reward_type" })
  );

  const shouldShowNcell = [2, 3].includes(Number(ncellRewardType));
  const shouldShowNtc = [2, 3].includes(Number(ntcRewardType));
  const shouldShowLeads = shouldShowNcell || shouldShowNtc;

  const endDateValue = useWatch({ control, name: "end_date" });
  const isExpired =
    endDateValue && dayjs().isBefore(dayjs(endDateValue), "day") === false;
  console.log("thisi s curre", errors);

  useEffect(() => {
    dispatch(fetchFormTemplatesRequest());
  }, [dispatch]);

  // useEffect(() => {
  //   // Reset dependent fields when reward type changes
  //   if (rewardType) {
  //     resetField("total_leads");
  //     resetField("ncell_topup_amount");
  //     resetField("ntc_topup_amount");
  //     resetField("ncell_data_product_code");
  //     resetField("ntc_data_product_code");
  //   }
  // }, [rewardType, resetField]);

  useEffect(() => {
    resetField("total_leads");
    resetField("ncell_topup_amount");
    resetField("ntc_topup_amount");
    resetField("ncell_data_product_code");
    resetField("ntc_data_product_code");
  }, [ntcRewardType, ncellRewardType, resetField]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const cleanedData = {
        ...data,
        is_active: data.is_active ? 1 : 0,
        send_sms: data.send_sms ? 0 : 1,
      };

      // List all fields you want to remove if empty
      [
        "ncell_data_product_code",
        "ntc_data_product_code",
        "ncell_topup_amount",
        "ntc_topup_amount",
      ].forEach((field) => {
        if (!cleanedData[field] || cleanedData[field] === "") {
          delete cleanedData[field];
        }
      });

      const response = currentCampaign
        ? await updateCampaign(id, cleanedData)
        : await createCampaign(cleanedData);
      toast.success(
        response?.message ||
          `Campaign ${currentCampaign ? "updated" : "created"} successfully!`
      );

      reset();

      router.push(
        currentCampaign
          ? paths.dashboard.campaign.detail(id)
          : paths.dashboard.campaign.root
      );
    } catch (error) {
      // toast.success(
      //   error.message ||
      //     `Couldn't ${
      //       currentCampaign ? "update" : "create"
      //     } campaign. Please try again!`
      // );

      let message = "Something went wrong";

      if (error?.message) {
        if (typeof error.message === "string") {
          message = error.message;
        } else if (typeof error.message === "object") {
          const firstKey = Object.keys(error.message)[0];
          const firstMessage = error.message[firstKey]?.[0];
          message = firstMessage || message;
        }
      }

      toast.error(message);
    }
  });

  const renderFields = () => (
    <Stack spacing={3}>
      <Field.Text name="name" label="Name" />

      <Field.Text name="description" label="Description" />

      <Box
        sx={{
          display: "flex",
          gap: { xs: 3, sm: 2 },
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <Field.Select
          name="form_template_id"
          label="Form Template"
          disabled={Boolean(currentCampaign)}
          sabled
        >
          <MenuItem
            value=""
            sx={{ fontStyle: "italic", color: "text.secondary" }}
          >
            None
          </MenuItem>

          <Divider sx={{ borderStyle: "dashed" }} />

          {formTemplates.map((template) => (
            <MenuItem key={template.id} value={Number(template.id)}>
              {template.name}
            </MenuItem>
          ))}
        </Field.Select>

        {/* <Field.Select
          name="reward_type"
          label="Reward Type"
          disabled={Boolean(currentCampaign)}
        >
          {rewardTypes.map((type) => (
            <MenuItem key={type.id} value={type.id}>
              {type.name}
            </MenuItem>
          ))}
        </Field.Select> */}
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: { xs: 3, sm: 2 },
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <Field.Select
          name="ntc_reward_type"
          label="NTC Reward Type"
          disabled={Boolean(currentCampaign)}
        >
          {rewardTypes.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.name}
            </MenuItem>
          ))}
        </Field.Select>
        <Field.Select
          name="ncell_reward_type"
          label="Ncell Reward Type"
          disabled={Boolean(currentCampaign)}
        >
          {rewardTypes.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.name}
            </MenuItem>
          ))}
        </Field.Select>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 2,
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        {/* NTC LEFT */}
        {shouldShowNtc && (
          <Box sx={{ flex: 1 }}>
            {ntcRewardType === 2 && (
              <Field.Select
                name="ntc_data_product_code"
                label="NTC Data Pack"
                disabled={Boolean(currentCampaign)}
              >
                {ntcDataPacks.map((pack) => (
                  <MenuItem
                    key={pack.package_id}
                    value={String(pack.package_id)}
                  >
                    {`${pack.product_name} (${pack.short_detail}) - Rs. ${pack.amount}`}
                  </MenuItem>
                ))}
              </Field.Select>
            )}
            {ntcRewardType === 3 && (
              <Field.Select
                name="ntc_topup_amount"
                label="NTC Topup Amount"
                disabled={Boolean(currentCampaign)}
              >
                {ntcTopUpAmounts.map((amount) => (
                  <MenuItem key={amount.id} value={String(amount.amount)}>
                    {amount.amount}
                  </MenuItem>
                ))}
              </Field.Select>
            )}
          </Box>
        )}

        {/* NCELL RIGHT */}
        {shouldShowNcell && (
          <Box sx={{ flex: 1 }}>
            {ncellRewardType === 2 && (
              <Field.Select
                name="ncell_data_product_code"
                label="Ncell Data Pack"
                disabled={Boolean(currentCampaign)}
              >
                {ncellDataPacks.map((pack) => (
                  <MenuItem
                    key={pack.product_code}
                    value={String(pack.product_code)}
                  >
                    {`${pack.product_name} (${pack.description}) - Rs. ${pack.amount}`}
                  </MenuItem>
                ))}
              </Field.Select>
            )}
            {ncellRewardType === 3 && (
              <Field.Select
                name="ncell_topup_amount"
                label="Ncell Topup Amount"
                disabled={Boolean(currentCampaign)}
              >
                {ncellTopUpAmounts.map((amount) => (
                  <MenuItem key={amount.id} value={String(amount.amount)}>
                    {amount.amount}
                  </MenuItem>
                ))}
              </Field.Select>
            )}
          </Box>
        )}
      </Box>

      {shouldShowLeads && (
        <Box
          sx={{
            display: "flex",
            gap: { xs: 3, sm: 2 },
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Field.Text
              type="number"
              name="total_leads"
              label="Limited Rewards number"
              disabled={Boolean(currentCampaign)}
            />

            <Typography
              variant="body2"
              color="success.main"
              sx={{ mt: 0.5, display: "block", textAlign: "left", ml: 1 }}
            >
              Hints
            </Typography>
          </Box>
        </Box>
      )}
      <Box sx={{ display: "flex", gap: 2 }}>
        <Controller
          name="start_date"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <MobileDatePicker
              {...field}
              label="Start Date"
              value={field.value ? dayjs(field.value) : null}
              onChange={(newValue) =>
                field.onChange(dayjs(newValue).format("YYYY-MM-DD"))
              }
              format={formatPatterns.date}
              disabled={Boolean(currentCampaign)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!error,
                  helperText: error?.message,
                },
              }}
            />
          )}
        />

        <Controller
          name="end_date"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <MobileDatePicker
              {...field}
              label="End Date"
              value={field.value ? dayjs(field.value) : null}
              onChange={(newValue) =>
                field.onChange(dayjs(newValue).format("YYYY-MM-DD"))
              }
              format={formatPatterns.date}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!error,
                  helperText: error?.message,
                },
              }}
            />
          )}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          Campaign Status
        </Typography>

        <Controller
          name="is_active"
          control={control}
          render={({ field: { value, onChange } }) => (
            <FormControlLabel
              control={
                <Switch
                  // checked={value}
                  // onChange={(e) => onChange(e.target.checked)}
                  checked={value === 1}
                  onChange={(e) => onChange(e.target.checked ? 1 : 0)}
                  disabled={isExpired}
                  color="primary"
                />
              }
              // label={
              //   isExpired ? " (Campaign End)" : value ? "Active" : "Inactive"
              // }
              label={
                isExpired
                  ? " (Campaign End)"
                  : value === 1
                  ? "Active"
                  : "Inactive"
              }
            />
          )}
        />
      </Box>

      <Field.Text name="sms_message" label="SMS Message" />

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          Send SMS
        </Typography>

        <Controller
          name="send_sms"
          control={control}
          render={({ field: { value, onChange } }) => (
            <FormControlLabel
              control={
                <Switch
                  // checked={value}
                  // onChange={(e) => onChange(e.target.checked)}
                  checked={value === 1}
                  onChange={(e) => onChange(e.target.checked ? 1 : 0)}
                  disabled={isSubmitting}
                  color="primary"
                />
              }
            />
          )}
        />
      </Box>
      <Controller
        name="terms_and_conditions"
        control={control}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <div>
            <label style={{ fontWeight: 600 }}>Terms and Conditions</label>
            <CKEditor
              editor={ClassicEditor}
              data={value || ""}
              onChange={(_, editor) => {
                const data = editor.getData();
                onChange(data);
              }}
            />
            {error && (
              <p
                style={{
                  color: "red",
                  fontSize: "0.8rem",
                  marginTop: "0.25rem",
                }}
              >
                {error.message}
              </p>
            )}
          </div>
        )}
      />
    </Stack>
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
        {currentCampaign ? "Update campaign" : "Create campaign"}
      </LoadingButton>
    </Box>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3}>
        {renderFields()}

        {renderActions()}
      </Stack>
    </Form>
  );
}
