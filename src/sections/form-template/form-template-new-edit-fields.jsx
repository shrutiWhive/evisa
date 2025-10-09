import { useEffect } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";

import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  useSensor,
  DndContext,
  useSensors,
  MouseSensor,
  TouchSensor,
  closestCenter,
  KeyboardSensor,
} from "@dnd-kit/core";

import {
  Card,
  Box,
  MenuItem,
  Divider,
  Stack,
  Button,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";

import { fCapitalizeLabel } from "src/utils";

import { useAppSelector } from "src/redux/hooks";
import { selectFormTemplateState } from "src/redux/selectors";

import { Field } from "src/components/hook-form";
import { Iconify } from "src/components/iconify";
import { toast } from "src/components/snackbar";

import { coordinateGetter } from "./utils";
import {
  INPUT_TYPES,
  VALIDATION_RULE_MAP,
  PHONE_NUMBER_INPUT_NAME,
  VALIDATION_RULE_IDS,
  OPTION_BASED_INPUT_TYPES,
} from "./constant";
import { useBoolean } from "minimal-shared/hooks";

// ----------------------------------------------------------------------

const getFieldNames = (index) => ({
  label: `fields[${index}].label`,
  name: `fields[${index}].name`,
  type: `fields[${index}].type`,
  options: `fields[${index}].options`,
  order: `fields[${index}].order`,
  is_required: `fields[${index}].is_required`,
  validation_rules: `fields[${index}].validation_rules`,
  parameters: `fields[${index}].parameters`,
});

const defaultOptionItem = {
  option: "",
};

export const defaultItem = {
  label: "",
  name: "",
  type: "",
  options: [defaultOptionItem],
  validation_rules: [],
  parameters: [],
  order: 0,
  is_required: false,
};

// ----------------------------------------------------------------------

export function FormTemplateNewEditFields() {
  const { control, getValues } = useFormContext();

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "fields",
  });

  const sensors = useSensors(
    useSensor(MouseSensor, {
      // Require the mouse to move by 3px pixels before activating
      activationConstraint: { distance: 3 },
    }),
    useSensor(TouchSensor, {
      // Press delay of 250ms, with tolerance of 5px of movement
      activationConstraint: { delay: 250, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, { coordinateGetter })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = fields.findIndex((field) => field.id === active.id);
    const newIndex = fields.findIndex((field) => field.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      move(oldIndex, newIndex);
    }
  };

  const handleDuplicateField = (index) => {
    const currentFields = getValues("fields");

    const newItem = currentFields[index];

    append(newItem);
  };

  return (
    <Stack spacing={3}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={fields.map((field) => field.id)}
          strategy={verticalListSortingStrategy}
        >
          {fields.map((field, index) => (
            <FieldItem
              key={field.id}
              id={field.id}
              fieldNames={getFieldNames(index)}
              //
              onDuplicateField={() => handleDuplicateField(index)}
              onRemoveField={() => remove(index)}
            />
          ))}
        </SortableContext>
      </DndContext>

      <Button
        size="small"
        variant="soft"
        color="primary"
        startIcon={<Iconify icon="mingcute:add-line" />}
        onClick={() => append(defaultItem)}
        sx={{ flexShrink: 0, ml: "auto" }}
      >
        Add Field
      </Button>
    </Stack>
  );
}

// ----------------------------------------------------------------------

function FieldItem({ id, fieldNames, onDuplicateField, onRemoveField }) {
  const { validationRules } = useAppSelector(selectFormTemplateState);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const validationFieldClicked = useBoolean();

  const { control, setValue } = useFormContext();

  const {
    fields: optionsFields,
    append: appendOption,
    remove: removeOption,
  } = useFieldArray({
    control,
    name: fieldNames.options,
  });

  const [
    // nameField,
    // typeField,
    // isRequiredField,
    // optionsField,
    // validationRuleField,
    nameField = "",
    typeField = "",
    isRequiredField = false,
    optionsField = [],
    validationRuleField = [],
  ] = useWatch({
    control,
    name: [
      fieldNames.name,
      fieldNames.type,
      fieldNames.is_required,
      fieldNames.options,
      fieldNames.validation_rules,
    ],
  });

  useEffect(() => {
    // if (validationRuleField.includes(VALIDATION_RULE_IDS.required)) {
    if (
      Array.isArray(validationRuleField) &&
      validationRuleField.includes(VALIDATION_RULE_IDS.required)
    ) {
      setValue(fieldNames.is_required, true);
    } else {
      setValue(fieldNames.is_required, false);
    }
  }, [validationFieldClicked.value]);

  useEffect(() => {
    // const currentRules = validationRuleField || [];
    const currentRules = Array.isArray(validationRuleField)
      ? validationRuleField
      : [];

    if (isRequiredField) {
      let updatedRules = currentRules.includes(VALIDATION_RULE_IDS.required)
        ? [...currentRules]
        : [...currentRules, VALIDATION_RULE_IDS.required];

      updatedRules = updatedRules.filter(
        (rule) => rule !== VALIDATION_RULE_IDS.nullable
      );

      setValue(fieldNames.validation_rules, updatedRules);
    } else {
      const filteredRules = currentRules.filter(
        (rule) => rule !== VALIDATION_RULE_IDS.required
      );

      setValue(fieldNames.validation_rules, filteredRules);
    }
  }, [isRequiredField]);

  const isInputPhoneNumber = nameField === PHONE_NUMBER_INPUT_NAME;

  const isOptionInputType = OPTION_BASED_INPUT_TYPES.includes(typeField);

  // const parameterRequiredRules = validationRuleField
  //   .map((ruleId) => validationRules.find((rule) => rule.id == ruleId))
  //   .filter((rule) => rule && rule.has_parameters === 1);

  const parameterRequiredRules = (validationRuleField || [])
    .map((ruleId) => validationRules.find((rule) => rule.id == ruleId))
    .filter((rule) => rule && rule.has_parameters === 1);

  const allowedRuleNames = VALIDATION_RULE_MAP[typeField] || [];

  const inputTypeBasedValidationRules = validationRules?.filter((rule) =>
    allowedRuleNames.includes(rule.name)
  );

  const selectedRuleNames = validationRuleField.map((ruleId) => {
    const rule = inputTypeBasedValidationRules.find((r) => r.id == ruleId);
    return rule?.name;
  });

  const filteredInputTypeBasedValidationRules =
    inputTypeBasedValidationRules?.filter((rule) => {
      const isRequiredSelected = selectedRuleNames.includes("required");
      const isNullableSelected = selectedRuleNames.includes("nullable");

      if (isRequiredSelected && rule.name === "nullable") {
        return false;
      }

      if (isNullableSelected && rule.name === "required") {
        return false;
      }

      return true;
    });

  const optionsValues = optionsField.map((opt) => opt.option).join(",");

  useEffect(() => {
    if (isOptionInputType) {
      const inParameterIndex = parameterRequiredRules.findIndex(
        (parameterRule) => parameterRule.id == VALIDATION_RULE_IDS.in
      );

      setValue(`${fieldNames.parameters}[${inParameterIndex}]`, optionsValues);
    }
  }, [optionsField, parameterRequiredRules]);

  const handleSelectType = () => {
    setValue(fieldNames.validation_rules, []); // reset selected validation rules
  };

  const renderOptionsInput = () => {
    if (!isOptionInputType) {
      return null;
    }

    const handleAppendOption = () => {
      const lastOption = optionsField[optionsField.length - 1].option.trim();

      if (!lastOption) {
        toast.error("Please fill the last option before adding a new one.");

        return;
      }

      appendOption(defaultOptionItem);
    };

    const handleRemoveOption = (index) => {
      if (index === 0) {
        toast.error(
          "Cannot delete the last option. At least one option is required."
        );

        return;
      }

      removeOption(index);
    };

    return (
      <Stack spacing={2}>
        {optionsFields.map((field, index) => (
          <Box
            sx={{ gap: 2, display: "flex", alignItems: "center" }}
            key={field.id}
          >
            <Iconify icon="solar:round-alt-arrow-right-bold" />

            <Field.Text
              name={`${fieldNames.options}[${index}].option`}
              label={`Option ${index + 1}`}
            />

            <Tooltip title="Remove option">
              <IconButton onClick={() => handleRemoveOption(index)}>
                <Iconify icon="solar:trash-bin-trash-bold" />
              </IconButton>
            </Tooltip>
          </Box>
        ))}

        <Box sx={{ gap: 2, display: "flex", alignItems: "center" }}>
          <Iconify icon="solar:round-alt-arrow-right-bold" />

          <Button
            size="small"
            variant="soft"
            onClick={handleAppendOption}
            sx={{ mr: "auto" }}
          >
            Add option
          </Button>
        </Box>
      </Stack>
    );
  };

  return (
    <Card ref={setNodeRef} style={style} sx={{ p: 3 }}>
      <Stack spacing={3}>
        <Stack spacing={1}>
          <Box
            sx={{
              gap: 2,
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
              },
            }}
          >
            <Field.Text
              name={fieldNames.label}
              label="Label"
              fullWidth
              disabled={isInputPhoneNumber}
            />

            <Field.Text
              name={fieldNames.name}
              label="Name"
              disabled={isInputPhoneNumber}
            />

            {!isInputPhoneNumber && (
              <>
                <Field.Select
                  name={fieldNames.type}
                  label="Type"
                  disabled={isInputPhoneNumber}
                >
                  <MenuItem
                    value=""
                    onClick={handleSelectType}
                    sx={{ fontStyle: "italic", color: "text.secondary" }}
                  >
                    None
                  </MenuItem>

                  <Divider sx={{ borderStyle: "dashed" }} />

                  {INPUT_TYPES.map((type) => (
                    <MenuItem
                      key={type.value}
                      value={type.value}
                      onClick={handleSelectType}
                    >
                      {type.label}
                    </MenuItem>
                  ))}
                </Field.Select>

                <Field.MultiSelect
                  chip
                  checkbox
                  name={fieldNames.validation_rules}
                  label="Validation Rule"
                  options={filteredInputTypeBasedValidationRules.map(
                    (rule) => ({
                      value: String(rule.id),
                      label: rule.description,
                    })
                  )}
                  onClick={validationFieldClicked.onToggle}
                  disabled={isInputPhoneNumber}
                />
              </>
            )}

            {parameterRequiredRules?.map((rule, index) => {
              if (
                rule.id == VALIDATION_RULE_IDS.before ||
                rule.id == VALIDATION_RULE_IDS.after
              ) {
                return (
                  <Field.DatePicker
                    key={rule.id}
                    name={`${fieldNames.parameters}[${index}]`}
                    label={fCapitalizeLabel(rule.name)}
                  />
                );
              }

              return (
                <Field.Text
                  key={rule.id}
                  name={`${fieldNames.parameters}[${index}]`}
                  label={fCapitalizeLabel(rule.name)}
                />
              );
            })}
          </Box>

          {!typeField && !isInputPhoneNumber && (
            <Typography
              variant="caption"
              sx={{ ml: "auto", color: "text.secondary" }}
            >
              Please select type to choose validation rules
            </Typography>
          )}

          {isInputPhoneNumber && (
            <Typography
              variant="caption"
              mt={2}
              sx={{ color: "red", fontStyle: "italic" }}
            >
              Hints : This is a default form, and you can also drag and drop
              fields to reorder them.
            </Typography>
          )}
        </Stack>

        {renderOptionsInput()}

        <Box
          sx={{
            gap: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          {!isInputPhoneNumber && (
            <>
              <Field.Checkbox
                name={fieldNames.is_required}
                label="Required"
                disabled={isInputPhoneNumber}
              />

              <Divider orientation="vertical" flexItem />

              <Button
                size="small"
                variant="soft"
                startIcon={<Iconify icon="solar:copy-bold" />}
                onClick={onDuplicateField}
                disabled={isInputPhoneNumber}
              >
                Duplicate
              </Button>
            </>
          )}

          {!isInputPhoneNumber && (
            <Button
              size="small"
              variant="soft"
              color="error"
              startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
              onClick={onRemoveField}
            >
              Remove
            </Button>
          )}

          <Button
            size="small"
            variant="soft"
            color="primary"
            startIcon={<Iconify icon="nimbus:drag-dots" />}
            {...attributes}
            {...listeners}
          >
            Drag
          </Button>
        </Box>
      </Stack>
    </Card>
  );
}
