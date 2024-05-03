import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { transfertsSchema } from "@/validation/FormValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CButton from "../../CButton";

const TransfertsForm = () => {
  const form = useForm<z.infer<typeof transfertsSchema>>({
    resolver: zodResolver(transfertsSchema),
    defaultValues: {
      Transferts_sekure: false,
      Transferts_Mobile_Money: false,
    },
  })

  function onSubmit(data: z.infer<typeof transfertsSchema>) {
    console.log(JSON.stringify(data));
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <div className="space-y-4 w-80">
          <FormField
            control={form.control}
            name="Transferts_sekure"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between">
                <div className="space-y-0.5 flex justify-between items-center w-full mr-4">
                  <FormLabel className="text-xs font-semibold">Inscriptions</FormLabel>
                  <FormLabel className="text-xs font-semibold">Activé</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    aria-readonly
                    className="data-[state=checked]:bg-[#18BC7A]"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="Transferts_Mobile_Money"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between">
                <div className="space-y-0.5 flex justify-between items-center w-full mr-4">
                  <FormLabel className="text-xs font-semibold">Recharges de solde</FormLabel>  
                  <FormLabel className="text-xs font-semibold">Activé</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={true}
                    onCheckedChange={field.onChange}
                    aria-readonly
                    className="data-[state=checked]:bg-[#18BC7A]"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="Frais_de_transfert_vers_sekure"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start justify-between">  
              <FormLabel className="text-xs text-gray-300">Frais de recharge</FormLabel>
              <FormControl>
                <Input type="text" className="w-80 h-10 text-gray-700 border-none bg-gray-100 rounded-md outline-none px-3" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="Frais_de_transfert_ver_Mobile_Money"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start justify-between">
              <FormLabel className="text-xs text-gray-300">Frais de retraits</FormLabel>
              <FormControl>
                <Input type="text" className="w-80 h-10 text-gray-700 border-none bg-gray-100 rounded-md outline-none px-3" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex items-center gap-4">
          <CButton
          type="submit"
          text={"Appliquer les modifications"}
          btnStyle={"green"}/>
          <CButton
          text={"Retablir"}
          btnStyle={"outlineDark"}/>
          {/* <Button type="submit" className="flex-1 basis-2/3 bg-faded-green/80 hover:bg-faded-green outline-none border-none rounded-full">Appliquer les modifications</Button>
          <Button className="flex-1 basis-1/3 border border-black bg-transparent text-black outline-1 rounded-full">Retablir</Button> */}
        </div>
      </form>
    </Form>
  )
}

export default TransfertsForm;
