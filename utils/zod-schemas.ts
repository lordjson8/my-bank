import z from "zod/v3";

const SignupSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  phoneNumber: z.string().min(9, "Le numéro de téléphone est requis"),
  acceptedTerms: z.literal(true, {
    errorMap: () => ({
      message: "Vous devez accepter les termes et conditions",
    }),
  }),
});

export type SignupFormData = z.infer<typeof SignupSchema>;

export { SignupSchema };


const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const PHONE_REGEX = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;

// ============================================
// LOGIN SCHEMA
// ============================================
export const LoginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email address")
    .min(1, "Email is required"),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().default(false).optional(),
});

export type LoginFormType = z.infer<typeof LoginSchema>;

export const SignupVerifySchema = z.object({
  code: z
    .string({ required_error: "Verification code is required" })
    .min(6, "Code must be 6 digits")
    .max(6, "Code must be 6 digits")
    .regex(/^\d+$/, "Code must contain only numbers"),
});

export type SignupVerifyType = z.infer<typeof SignupVerifySchema>;

// Step 3: Password Creation
export const SignupPasswordSchema = z
  .object({
    password: z
      .string({ required_error: "Password is required" })
      .min(8, "Password must be at least 8 characters")
      .regex(
        PASSWORD_REGEX,
        "Password must contain uppercase, lowercase, number, and special character"
      ),
    confirmPassword: z.string({
      required_error: "Password confirmation is required",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignupPasswordType = z.infer<typeof SignupPasswordSchema>;

// Step 4: Personal Information
export const SignupInfoSchema = z.object({
  firstName: z
    .string({ required_error: "First name is required" })
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "First name can only contain letters, spaces, hyphens, and apostrophes"),
  lastName: z
    .string({ required_error: "Last name is required" })
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Last name can only contain letters, spaces, hyphens, and apostrophes"),
  phoneNumber: z
    .string({ required_error: "Phone number is required" })
    .regex(PHONE_REGEX, "Invalid phone number format"),
  dateOfBirth: z
    .string({ required_error: "Date of birth is required" })
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
});

export type SignupInfoType = z.infer<typeof SignupInfoSchema>;

// Step 5: Address Information
export const SignupAddressSchema = z.object({
  streetAddress: z
    .string({ required_error: "Street address is required" })
    .min(5, "Street address must be at least 5 characters")
    .max(100, "Street address must be less than 100 characters"),
  city: z
    .string({ required_error: "City is required" })
    .min(2, "City must be at least 2 characters")
    .max(50, "City must be less than 50 characters"),
  state: z
    .string({ required_error: "State/Province is required" })
    .min(2, "State/Province must be at least 2 characters"),
  postalCode: z
    .string({ required_error: "Postal code is required" })
    .min(3, "Postal code must be at least 3 characters")
    .max(20, "Postal code must be less than 20 characters"),
  country: z
    .string({ required_error: "Country is required" })
    .min(2, "Country must be at least 2 characters"),
});

export type SignupAddressType = z.infer<typeof SignupAddressSchema>;

// Step 6: Terms & Conditions
export const SignupTermsSchema = z.object({
  agreeToTerms: z
    .boolean()
    .refine((val) => val === true, {
      message: "You must agree to the terms and conditions",
    }),
  agreeToPrivacy: z
    .boolean()
    .refine((val) => val === true, {
      message: "You must agree to the privacy policy",
    }),
  agreeToMarketing: z.boolean().default(false).optional(),
});

export type SignupTermsType = z.infer<typeof SignupTermsSchema>;



export type CompleteSignupType = z.infer<typeof CompleteSignupSchema>;

// ============================================
// PASSWORD RESET
// ============================================
export const PasswordResetSchema = z
  .object({
    newPassword: z
      .string({ required_error: "New password is required" })
      .min(8, "Password must be at least 8 characters")
      .regex(
        PASSWORD_REGEX,
        "Password must contain uppercase, lowercase, number, and special character"
      ),
    confirmPassword: z.string({
      required_error: "Password confirmation is required",
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type PasswordResetType = z.infer<typeof PasswordResetSchema>;

// ============================================
// LEGACY SCHEMAS (For backward compatibility)
// ============================================
export const InfoFormSchema = z.object({
  name: z.string(),
  surname: z.string(),
  dateOfBirth: z.string(),
  address: z.string(),
});

export type InfoFormType = z.infer<typeof InfoFormSchema>;

export const emailType = z.object({
  email: z
    .string({
      required_error: "L'adresse e-mail est obligatoire.",
    })
    .email("Le format de l'e-mail est invalide."),
});

export type emailSchema = z.infer<typeof emailType>;
