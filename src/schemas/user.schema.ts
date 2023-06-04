import { object, string, TypeOf, z } from "zod";
import { RoleEnumType } from "../entity/user.entity";

const nameRequired = "Name is required",
  emailRequired = "Email address is required",
  emailValid = "Invalid email address",
  passwordRequired = "Password is required",
  minLength = "Password must be more than 8 characters",
  maxLength = "Password must be less than 32 characters",
  confirmPassword = "Please confirm your password",
  passwordNotMatch = "Passwords do not match";

const name = string({
  required_error: nameRequired,
});
const email = string({
  required_error: emailRequired,
}).email(emailValid);

const password = string({
  required_error: passwordRequired,
})
  .min(8, minLength)
  .max(32, maxLength);
const role = z.optional(z.nativeEnum(RoleEnumType));

const schemaCreate = (data:{}) => { 
  return object({
    body: object({
     ...data
    }),
  });
}
export const createUserSchema = schemaCreate({name, email, password, role});
export const loginUserSchema = schemaCreate({ email, password});
export const passwordSchema = object({
  body: object({
    password,
    passwordConfirm: string({
      required_error: confirmPassword,
    }),
  }).refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: passwordNotMatch,
  }),
});
export const updateSchema = schemaCreate({name, email})
export const createSchema = schemaCreate({name, email, role});

