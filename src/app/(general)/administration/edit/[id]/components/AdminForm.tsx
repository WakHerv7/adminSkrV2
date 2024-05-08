"use client"
import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { adminSchema } from "@/validation/FormValidation";

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RxCaretRight } from "react-icons/rx";
import { FaCircle } from 'react-icons/fa';
import { IoLockClosed } from 'react-icons/io5';

import './style.css';

interface IData {
    title: string;
    detail: string;
}

const accessLevels = [
    'Voir tous les details',
    'Supprimer',
    'Envoyer des emails et notificstions',
    'Ajouter un admin',
    'Acceder aux parametres généraux',
    'Acces au donées sensibles des utilisateurs',
    'Voir les transactions',
    'Donnees utilisateurs',
    
]


export default function AdminForm({ data }: { data: IData }) {
    const form = useForm<z.infer<typeof adminSchema>>({
        resolver: zodResolver(adminSchema),
        defaultValues: {
          fullname: "",
          email: "",
          date: "", 
        },
      });
    
      const onSubmit = (data: z.infer<typeof adminSchema>) => {
        console.log(data);
      };
    
      return (
        <>
        <Form {...form}>
            
          <form onSubmit={form.handleSubmit(onSubmit)} className="justify-between items-start w-full">
            <h1 className="text-lg font-bold">{`Informations de l'administrateur`} </h1>
            <p className="text-sm text-gray-600">{`Informations de l'administrateur`}</p>
            <div className="my-6 w-full flex flex-col gap-4">
              <FormField
                control={form.control}
                name="fullname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-400 text-sm tracking-tight">Nom</FormLabel>
                    <FormControl>
                      <Input className="space-y-0 px-6 text-gray-900 font-normal bg-[#f2f2f2] border-none outline-none" {...field} />
                    </FormControl>
                  </FormItem>
                )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-400 text-sm tracking-tight">Email</FormLabel>
                      <FormControl>
                        <Input className="px-6 text-gray-900 font-normal bg-[#f2f2f2] border-none outline-none" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-400 text-sm tracking-tight">Date of completion</FormLabel>
                      <FormControl>
                        <Input className="px-6 text-gray-900 font-thin bg-[#f2f2f2] border-none outline-none" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
            </div>
            {/* <Link href="#" className="text-gray-800 font-semibold text-righttext-sm">Forgotten Password?</Link> */}
            <div className='pt-[20px]'>
                <h1 className="text-lg font-bold">{`Niveau d'accès`}</h1>
                <p className="text-sm text-gray-600">{`Choisir les niveaux d'accès`}</p>            
                <section className="grid grid-cols-2 w-[100%]">
                    {accessLevels.map((item, idx) =>  {
                        return (
                            <label key={idx} htmlFor={`customCheckbox${idx}`} className="flex items-center cursor-pointer">                
                                <div className="relative">                
                                    <input type="checkbox" defaultChecked id={`customCheckbox${idx}`} className="customCheckbox sr-only"/>                
                                    <div className="checkboxContainer block p-[3px] border border-solid border-1 border-gray-300 bg-[#f2f2f2] rounded-full flex items-center text-xs">
                                        <FaCircle className='checkboxContentTransparent' color="transparent" size={12} />
                                        <FaCircle className='checkboxContentGreen' color="#18BC7A" size={12} />
                                    </div>
                                    

                                    {/* <div className="dot absolute left-1 top-[1px] bg-[#18BC7A] w-[28px] h-[28px] 
                                    rounded-full transition flex justify-center items-center">
                                        <span className="w-[14px] h-[14px] rounded-[5px] border border-solid border-4 border-white"></span>
                                    </div> */}
                                </div>
                                <div className='pl-3 py-4 text-sm'>
                                        {item}
                                </div>
                            </label>
                    )})}
                </section>
                <div className="flex justify-start items-center gap-4 mt-10">
                    <Button className="ring-2 ring-black bg-black  hover:bg-black/70 px-16 text-white rounded-full">
                    Enregistrer
                    </Button>
                    <Button type="submit" className="ring-2 ring-black bg-transparent  hover:bg-black/10 px-16 text-black rounded-full">
                    Annuler
                    </Button>                    
                </div>
            </div>
          </form>
        </Form>

        <div className='flex justify-center w-[300px]'>
            
            <div className="flex flex-col gap-4">
                <div className='flex justify-between  items-center w-full'>
                    <div className='text-nowrap text-sm font-semibold'>
                        Etat du compte
                    </div>
                    <div className="relative pl-4 text-sm">
                        <div className='absolute top-[5px] left-0 w-[10px] h-[10px] bg-[#18BC7A] rounded-full 
                         text-center flex justify-center items-center text-[10px]'>                
                        </div>
                        <span>Actif</span>
                    </div>
                </div>
                <Button type="submit" className="ring-2 ring-black bg-transparent hover:bg-black/10 px-16 text-black rounded-full">
                    <div className='flex justify-between gap-2'>
                        <IoLockClosed size={15}/>
                        <span className=''>
                        Bloquer
                        </span>
                    </div>
                </Button>
                <Button className="ring-2 ring-black bg-black hover:bg-black/70 px-16 text-white rounded-full">
                Supprimer
                </Button>
            </div>
        </div>
        </>
      )
}
