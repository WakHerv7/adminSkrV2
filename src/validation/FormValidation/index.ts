import { z } from "zod"

export const loginSchema = z.object({
  email: z.string(
    {message:'Entrez un email valide'}
  ).email({message:'Entrez un email valide'}),
  password: z.string(
    {message:'Entrez un mot de passe'}
  ),
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
  // gender: z.string(),
  phone: z.string(),
  country_code: z.string(),
  city: z.string(),  
  address: z.string(),
  birthday: z.string(),
  age: z.string(),
  job: z.string(),
  sex: z.string(),
  income: z.string(),
  idExpDate: z.string(),
  codeParrain: z.string(),
  codeParrainage: z.string(),
  deviceModel: z.string(),
  deviceID: z.string(),
  idNumber: z.string(),
  idPaper: z.string(),
  tags:z.array(z.string()),
  additionalPhoneNumbers:z.array(z.string()),
})

export const detailsSchemaV2 = z.object({
  first_name: z.string(),
  last_name: z.string(),
  email : z.string(),
  country: z.string(),
  // gender: z.string(),
  phone: z.string(),
  country_code: z.string(),
  city: z.string(),  
  address: z.string(),
  birthday: z.string(),
  age: z.string(),
  job: z.string(),
  sex: z.string(),
  income: z.string(),
  idExpDate: z.string(),
  codeParrain: z.string(),
  codeParrainage: z.string(),
  deviceModel: z.string(),
  deviceID: z.string(),
  idNumber: z.string(),
  idPaper: z.string(),
  tags:z.array(z.string()),
  additionalPhoneNumbers:z.array(z.string()),
})