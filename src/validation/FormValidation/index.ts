import { z } from "zod"

export const formSchema = z.object({
  email: z.string().min(10, {
    message: 'Email must be at least 10 characters long'
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters long'
  }),
});

export const adminSchema = z.object({
  fullname: z.string().min(10),
  email: z.string().min(8),
  date: z.string(),
});


export const switchSchema = z.object({
  Inscriptions: z.boolean().default(false).optional(),
  Recharges_de_solde: z.boolean().default(false).optional(),
  Retraits_de_solde: z.boolean().default(false).optional(),
  Frais_de_recharge: z.number().default(0),
  Frais_de_retraits: z.number().default(0),
  Rémunération_parrainage: z.number().default(0),
})

export const carteSchema = z.object({
  Achat_de_carte: z.boolean().default(false).optional(),
  Recharges_de_carte: z.boolean().default(false).optional(),
  Retraits_de_carte: z.boolean().default(false).optional(),
  Cout_du_dollar: z.number().default(0),
  Prix_de_la_carte: z.number().default(0),
  Recharge: z.number().default(0),
  Retraits: z.number().default(0),
  Echec_de_paiement: z.number().default(0),
})

export const transfertsSchema = z.object({
  Transferts_sekure: z.boolean().default(false).optional(),
  Transferts_Mobile_Money : z.boolean().default(false).optional(),
  Frais_de_transfert_ver_Mobile_Money: z.number().default(0),
  Frais_de_transfert_vers_sekure: z.number().default(0),
})

export const detailsSchema = z.object({
  name: z.string(),
  email : z.string(),
  country: z.string(),
  gender: z.string(),
  phone: z.string(),
  city: z.string(),
})