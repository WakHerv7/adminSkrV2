"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { adminSchema, detailsSchema } from "@/validation/FormValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const DetailsForm = () => {
  const form = useForm<z.infer<typeof detailsSchema>>({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      Email: "abc@@123.xyz",
      téléphone: "1234567890",
    },
  });
  
  const onSubmit = (data: z.infer<typeof detailsSchema>) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 mt-3  ">
        <div className="w-full">
          <FormField
            control={form.control}
            name="Nom_complet"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300 text-sm font-semibold tracking-tight">Nom complet</FormLabel>
                <FormControl>
                  <Input className="px-6 text-gray-900 font-normal bg-gray-200" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="Email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300 text-sm font-semibold tracking-tight">Email</FormLabel>
                  <FormControl>
                    <Input className="px-6 text-gray-900 font-normal bg-gray-200" {...field} />
                  </FormControl>
                </FormItem>
              )}
              />
            <FormField
              control={form.control}
              name="Pays_de_rsidence"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300 text-sm font-semibold tracking-tight">Pays de rsidence</FormLabel>
                  <FormControl>
                    <Input className="px-6 text-gray-900 font-thin bg-gray-200" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Sexe"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300 text-sm font-semibold tracking-tight">Sexe</FormLabel>
                  <FormControl>
                    <Input className="px-6 text-gray-900 font-thin bg-gray-200" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="téléphone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300 text-sm font-semibold tracking-tight">téléphone</FormLabel>
                  <FormControl>
                    <Input className="px-6 text-gray-900 font-thin bg-gray-200" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="Ville_de_residence"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300 text-sm font-semibold tracking-tight">Ville de residence</FormLabel>
                <FormControl>
                  <Input className="px-6 text-gray-900 font-thin bg-gray-200" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  )
}

export default DetailsForm;
