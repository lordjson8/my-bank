import * as z from "zod";

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
      required_error: "L'adresse e-mail est obligatoire.", // Message for when the field is completely missing/undefined
    })
    .email("Le format de l'e-mail est invalide."),
});

export type emailSchema = z.infer<typeof emailType>;
