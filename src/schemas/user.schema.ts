import { object, string, TypeOf, z } from "zod";
import { RoleEnumType } from "../entity/user.entity";

const nameRequired = "Name is required",
  emailRequired = "Email address is required",
  emailValid = "Invalid email address",
  passwordRequired = "Password is required",
  minLength = "Password must be more than 8 characters",
  maxLength = "Password must be less than 32 characters",
  passwordInvalid = "Invalid email or password",
  confirmPassword = "Please confirm your password",
  passwordNotMatch = "Passwords do not match";

export const createUserSchema = object({
  body: object({
    name: string({
      required_error: nameRequired,
    }),
    email: string({
      required_error: emailRequired,
    }).email(emailValid),
    password: string({
      required_error: passwordRequired,
    })
      .min(8, minLength)
      .max(32, maxLength),
    role: z.optional(z.nativeEnum(RoleEnumType)),
  }),
});

export const loginUserSchema = object({
  body: object({
    email: string({
      required_error: emailRequired,
    }).email(emailValid),
    password: string({
      required_error: passwordRequired,
    }).min(8, passwordInvalid),
  }),
});

export const passwordSchema = object({
  body: object({
    password: string({
      required_error: passwordRequired,
    })
      .min(8, minLength)
      .max(32, maxLength),
    passwordConfirm: string({
      required_error: confirmPassword,
    }),
  }).refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: passwordNotMatch,
  }),
});

export const updateSchema = object({
  body: object({
    name: string({
      required_error: nameRequired,
    }),
    email: string({
      required_error: emailRequired,
    }).email(emailValid),
  }),
});


export const createSchema = object({
    body: object({
      name: string({
        required_error: nameRequired,
      }),
      email: string({
        required_error: emailRequired,
      }).email(emailValid),
    }),
    role: z.optional(z.nativeEnum(RoleEnumType)),
  });