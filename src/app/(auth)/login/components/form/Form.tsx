import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "@/validation/FormValidation";

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

export default function LogiForm() {
  // ...
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "", 
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-[20px]">
            <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
                <FormItem>
                <FormLabel className="text-gray-900 text-sm tracking-tight">Adresse email</FormLabel>
                <FormControl>
                    <Input className="px-6 w-[272px] text-gray-900 font-thin bg-[#F4EFE3]" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
                <FormItem>
                <FormLabel className="text-gray-900 text-sm font-[500] tracking-tight">Mot de passe</FormLabel>
                <FormControl>
                    <Input className="px-6 w-full text-gray-900 font-thin bg-[#F4EFE3]" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        
        <div className="text-right">
          <a href="#" className="inline-block w-[272px] text-sm font-[400]">Mot de passe oublié ?</a>
        </div>
        {/* <Link to="#" className="text-gray-800 font-semibold text-righttext-sm">Forgotten Password?</Link> */}
        <Button type="submit" className="w-[272px] mt-[10vh] bg-[#18BC7A] hover:bg-[#FFDB5A] hover:text-[#18BC7A] rounded-full">Connexion</Button>
      </form>
    </Form>
  )
}
