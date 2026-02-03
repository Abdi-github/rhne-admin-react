import { z } from 'zod';

export const translatedFieldSchema = z.object({
  fr: z.string().min(1, { message: 'Le français est requis' }),
  en: z.string().default(''),
  de: z.string().default(''),
  it: z.string().default(''),
});

export const optionalTranslatedFieldSchema = z.object({
  fr: z.string().default(''),
  en: z.string().default(''),
  de: z.string().default(''),
  it: z.string().default(''),
});

export const emailSchema = z.string().email('Email invalide');

export const postalCodeSchema = z.string().regex(/^\d{4}$/, 'Code postal: 4 chiffres');

export const phoneSchema = z.string().min(1, 'Téléphone requis');

export const passwordSchema = z
  .string()
  .min(8, 'Minimum 8 caractères')
  .regex(/[A-Z]/, 'Au moins une majuscule')
  .regex(/[a-z]/, 'Au moins une minuscule')
  .regex(/\d/, 'Au moins un chiffre')
  .regex(/[!@#$%^&*]/, 'Au moins un caractère spécial');
