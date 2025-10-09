export const INPUT_TYPES = [
  { value: "text", label: "Text" },
  { value: "email", label: "Email" },
  { value: "textarea", label: "Textarea" },
  { value: "number", label: "Number" },
  { value: "select", label: "Select" },
  { value: "radio", label: "Radio" },
  { value: "checkbox", label: "Checkbox" },
  { value: "date", label: "Date" },
  { value: "file", label: "File" },
  { value: "url", label: "URL" },
  { value: "password", label: "Password" },
];

export const VALIDATION_RULE_MAP = {
  text: ["required", "nullable", "string"],
  number: ["required", "nullable", "integer", "numeric", "min", "max"],
  email: ["required", "nullable", "email"],
  select: ["required", "nullable", "in"],
  radio: ["required", "nullable", "in"],
  checkbox: ["required", "nullable", "boolean", "in"],
  textarea: ["required", "nullable", "string"],
  date: ["required", "nullable", "date", "before", "after"],
  file: ["required", "nullable"],
  url: ["required", "nullable", "url"],
  password: ["required", "nullable", "confirmed"],
};

export const PHONE_NUMBER_INPUT_NAME = "phone_number";
export const NAME_INPUT_NAME = "name";
export const EMAIL_INPUT_NAME = "email";

export const VALIDATION_RULE_IDS = {
  required: "1",
  nullable: "2",
  in: "12",
  before: "16",
  after: "17",
};

export const ACCEPTED_IMAGE_TYPES = [
  "image/png",
  "image/webp",
  "image/jpg",
  "image/jpeg",
];

export const OPTION_BASED_INPUT_TYPES = ["select", "radio", "checkbox"];
