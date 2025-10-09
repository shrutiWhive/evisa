import { z as zod } from "zod";

export const updateProfileSchema = zod.object({
    name: zod.string().min(1, { message: "Name is required!" }),

    email: zod
    .string()
    .min(1, { message: "Email is required!" })
    .email({ message: "Email must be a valid email address!" }),

    contact_number: zod
    .string()
    .min(1, { message: "Contact number is required!" })
    .regex(/^\d{10}$/, {
      message: "Contact number must be exactly 10 digits!",
    }),

    address: zod.string().min(1, { message: "Address is required!" }),
    
    logo: zod
    .custom()
    .optional()
    .transform((data, ctx) => {
      if (!data) return data;

      const hasFile =
        data instanceof File || (typeof data === "string" && !!data.length);

      if (!hasFile) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: "Logo is required!",
        });

        return null;
      }

      return data;
    }),

//     primary_color: zod
//     .object({
//       lighter: zod.string(),
//       light: zod.string(),
//       main: zod.string().regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/),
//       dark: zod.string(),
//       darker: zod.string(),
//     })
//     .optional(),

//     secondary_color: zod
//   .object({
//     lighter: zod.string(),
//     light: zod.string(),
//     main: zod.string().regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/),
//     dark: zod.string(),
//     darker: zod.string(),
//   })
//   .optional(),
   

  
// });

primary_color: zod.object({
  lighter: zod.string(),
  light: zod.string(),
  main: zod.string(),
  dark: zod.string(),
  darker: zod.string(),
}).partial().optional(),

secondary_color: zod.object({
  lighter: zod.string(),
  light: zod.string(),
  main: zod.string(),
  dark: zod.string(),
  darker: zod.string(),
}).partial().optional(),
    // .refine((val) => !!val.main, { message: "Please select secondary color" }),
});