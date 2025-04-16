import { z } from "zod";

export const schoolFormSchema = z.object({
  name: z.string().min(3, { message: "O nome da escola deve ter pelo menos 3 caracteres." }).max(100),
  slug: z.string()
    .min(3, { message: "O identificador deve ter pelo menos 3 caracteres." })
    .max(50)
    .regex(/^[a-z0-9-]+$/, { message: "O identificador pode conter apenas letras minúsculas, números e hífens." })
    .refine(slug => !slug.startsWith('-') && !slug.endsWith('-'), { message: "O identificador não pode começar ou terminar com hífen."}),
  logo: z.instanceof(File).optional(),
});

export type SchoolFormData = z.infer<typeof schoolFormSchema>; 