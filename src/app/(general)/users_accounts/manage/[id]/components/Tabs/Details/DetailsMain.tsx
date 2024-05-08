"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { adminSchema, detailsSchema } from "@/validation/FormValidation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { PiCirclesFourFill } from "react-icons/pi";
import { Checkbox } from "@/components/ui/checkbox";
import { FaLock } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Details() {
  // ...
  const form = useForm<z.infer<typeof detailsSchema>>({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      email: "abc@123.xyz",
      phone: "1234567890",
    },
  });

  const onSubmit = (data: z.infer<typeof detailsSchema>) => {
    console.log(data);
  };

  return (
    <div className="flex-1">
        <h1 className="text-lg text-gray-700 font-bold">{`Informations personnelles de l'utilisateur`}</h1>
        <p className="text-xs text-gray-500">liste en temps réel des dernieres transactions effectuées avec les cartes</p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} 
          className="space-y-3 mt-3  ">
            <div className="w-full flex flex-col gap-7">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">Nom complet</FormLabel>
                    <FormControl>
                      <Input className="px-6 text-gray-900 font-normal bg-gray-200" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-x-7 gap-y-7">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">Email</FormLabel>
                    <FormControl>
                      <Input placeholder="abc@sekure.xyz" className="px-6 text-gray-900 font-normal bg-gray-200" {...field} />
                    </FormControl>
                  </FormItem>
                )}
                />
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">Pays de résidence</FormLabel>
                    <FormControl>
                      <Input className="px-6 text-gray-900 font-thin bg-gray-200" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">Sexe</FormLabel>
                    <FormControl>
                      <Input className="px-6 text-gray-900 font-thin bg-gray-200" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">téléphone</FormLabel>
                    <FormControl>
                      <Input className="px-6 text-gray-900 font-thin bg-gray-200" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              </div>
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">Ville de residence</FormLabel>
                    <FormControl>
                      <Input className="px-6 text-gray-900 font-thin bg-gray-200" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </div>
  )
}
