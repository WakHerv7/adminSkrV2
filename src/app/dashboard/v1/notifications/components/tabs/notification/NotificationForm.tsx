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
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { PiCirclesFourFill } from "react-icons/pi";
import { Checkbox } from "@/components/ui/checkbox";
import { FaChevronRight, FaEdit, FaLock, FaSave } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentCustomerDetails } from "@/redux/slices/customer";
import Image from "next/image";
import CButton from "@/components/shared/CButton";
import classNames from "classnames";
import { HashLoader } from "react-spinners";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import {Select, SelectItem} from "@nextui-org/select";
import { selectCurrentUser } from "@/redux/slices/auth";
import { useMutation } from "react-query";
import toast from "react-hot-toast";
import { UserService } from "@/api/services/user";
import DialogWrapper from "@/components/shared/DialogWrapper";
import CustomDropdown from "@/components/shared/CustomDropdown";
import { RxDotsHorizontal } from "react-icons/rx";
import Modal from "@/components/shared/Modal/Modal";

import { getFormattedDate, getTextFormattedDate } from "@/utils/DateFormat";
import {parseDate, getLocalTimeZone} from "@internationalized/date";
import {DatePicker} from "@nextui-org/date-picker";
import { getNextUIDatePickerValueStr } from "@/utils/DateFormat";
import cstyles from "./styles/style.module.scss";
import { isExpired, calculateAge } from "@/utils/utils";
import {I18nProvider} from "@react-aria/i18n";
import {DateInput, NextUIProvider} from "@nextui-org/react";
import useTags from "@/hooks/useTagInput";
import { TagField } from "@/components/shared/TagField";
import { NotificationService } from "@/api/services/notification";
import { Textarea } from '@/components/ui/textarea'
import { IoIosSend } from "react-icons/io";
import EmojiPicker from 'emoji-picker-react';
import { FaRegSmile } from "react-icons/fa";
import CustomDropdown2 from "@/components/shared/CustomDropdown2";
import {useClickAway} from 'react-use';

export const formSchema = z.object({
  title: z.string(
      {message:'Entrez un titre'}
  ),
  content: z.string(
      {message:'Entrez un contenu'}
  ),
  target: z.string(
      {message:'Selectionnez une cible'}
  ).optional(),
  users:z.array(z.string()).optional(),
});

const targetData = [
  {key: 'all', label: 'Tous les utilisateurs'},
  {key: 'cameroon', label: 'Tous les utilisateurs du Cameroun'},
  {key: 'gabon', label: 'Tous les utilisateurs du Gabon'},
  {key: 'test', label: 'Utilisateurs tests'},
  // {key: 'active', label: 'Tous les utilisateurs actifs'},
  // {key: 'inactive', label: 'Tous les utilisateurs inactifs'},
  // {key: 'engaged', label: 'Tous les utilisateurs engagés'},
  // {key: 'sms', label: 'Tous les utilisateurs SMS'},
  // {key: 'email', label: 'Tous les utilisateurs Email'},
];


function parseDateStr(dateString:string) {
  return dateString ? dateString.replace(/T.*Z$/, '') : "";
}

function parseDateObject(dateString:string) {
  return dateString ? new Date(dateString.replace(/T.*Z$/, '')) : new Date();
}

const sendNotification = async (queryData:any) => {
  const {cardId, adminUserId, body} = queryData;

  if(!body?.target && (!body?.users || body?.users?.length<=0)) {
    throw new Error("Veuillez selectionner une cible");
  }

  const response = await NotificationService.send_notifcation({
  adminUserId:adminUserId,
  body:body
}); 
  
  if (!response.ok) {
      const responseBody = await response.json();
      throw new Error(responseBody.message);
  }
  const responseJson = await response.json();
  return responseJson;
}

export default function Details() {
  const emojiRef1 = useRef(null);
  const emojiRef2 = useRef(null);
  useClickAway(emojiRef1, () => {
    setShowPicker(false);
  });
  useClickAway(emojiRef2, () => {
    setShowPicker2(false);
  });
  const [showPicker, setShowPicker] = useState(false);
  const [showPicker2, setShowPicker2] = useState(false);
  const pathname = usePathname();
  const redirectRef:any = useRef();
  const currentUser = useSelector(selectCurrentUser);
  const customerDetails:any = useSelector(selectCurrentCustomerDetails); 

  const mutation = useMutation({
  mutationFn: (data)=>sendNotification({adminUserId:currentUser?._id, body:data}),
  onError: (err:any) => {
          console.error("onError : ", err.message);
          toast.error(`Echec lors de l'envoi des notifications : ` + err.message);		
  },
  onSuccess: (data) => {
          console.log("onSuccess : ", data);            
          toast.success(`Notifications envoyées avec succes.`);
          // redirectRef.current.href = window.location.pathname;
          // redirectRef.current.click();
  },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: undefined,
      content: undefined,
      target: undefined,
      users:[],
    },
  });


  const onSubmit = (data: any) => {    
    console.log("onSubmit data : ", data);
		mutation.mutate(data);
	};
	const onError = (err: any) => {
		console.error("onError", err);
	};
  

  const handleTargetChange = (data: any) => {
    const value = data.target.value;
    console.log('target', value);
    form.setValue('target', value);
  }

  const handleUsersPhonesChange = (data:any) => {
    const newData = data?.map((item:any) => {
      return item.trim();
    });
    form.setValue('users', newData);
  }

  return (
    
      <div className="flex-1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onError)} 
            className="space-y-3">
              <div className='grid grid-cols-12 items-start gap-4 mt-4'>
                <div className='col-span-9'>
                  <div className="mb-7 w-full flex gap-10 justify-between items-center">
                    <div className="w-full">
                      <h1 className="text-lg text-gray-700 font-bold">
                        {`Creer une campagne`}
                      </h1>
                    </div>
                  </div>
                  <div className="w-full flex flex-col gap-7">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">Titre</FormLabel>
                          <FormControl>
                            <div className="relative bg-[#F4EFE3] pr-3 rounded-md flex gap-3 items-center justify-center">
                            
                              <Input className={`px-6 text-md text-gray-900 font-normal bg-[#F4EFE3]`}
                              value={field.value}
                              onChange={(e)=>form.setValue('title', e.target.value)}
                              />
                              <FaRegSmile size={24} onClick={() => setShowPicker((val) => !val)}/>
                            
                              {showPicker && 
                                <div ref={emojiRef1} className={`shadow-lg`} style={{
                                  position:'absolute',
                                  top:'40px',
                                  right:'0',
                                  zIndex:'1000'
                                }}>
                                  <EmojiPicker
                                  onEmojiClick={(emj)=>{
                                    form.setValue('title', (form.getValues('title') ?? '') +' '+emj.emoji)}}
                                  />
                                </div>
                              }
                            </div>
                            
                            
                          </FormControl>
                          <FormMessage className="text-red-400"/>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">Contenu</FormLabel>
                          <FormControl>
                            <div className="relative bg-[#F4EFE3] pr-3 pt-3 rounded-md flex gap-3 items-start justify-center">
                            
                              <Textarea 
                              id='Texte' 
                              className={`px-6 text-md text-gray-900 font-normal bg-[#F4EFE3]`} 
                              rows={5}
                              value={field.value}
                              onChange={(e)=>form.setValue('content', e.target.value)}
                              />

                              <FaRegSmile size={24} onClick={() => setShowPicker2((val) => !val)}/>
                              {showPicker2 && 
                                <div ref={emojiRef2} className={`shadow-lg`} style={{
                                  position:'absolute',
                                  top:'40px',
                                  right:'0',
                                  zIndex:'1000'
                                }}>
                                  <EmojiPicker
                                  onEmojiClick={(emj)=>{                                    
                                    form.setValue('content', (form.getValues('content') ?? '') +' '+emj.emoji)}}
                                  />
                                </div>
                              }
                            
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-400"/>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className='col-span-3'>
                    <div className="mb-7 w-full flex gap-10 justify-between items-center">
                      <div className="w-full">
                        <h1 className="text-lg text-gray-700 font-bold">
                          {`Cible`}
                        </h1>
                      </div>
                    </div>
                    <div className="w-full flex flex-col gap-7">
                      <FormField
                      control={form.control}
                      name="target"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-900 text-md font-semibold tracking-tight">Groupes</FormLabel>
                          <FormControl>
                            <Select 
                              {...field}
                              placeholder="Sélectionner la cible" 
                              style={{width:'100%', background: '#F4EFE3'}}
                              className={`rounded-xs text-gray-900 text-md font-normal`}
                              defaultSelectedKeys={[field.value ?? ""]}
                              onChange={(data) => handleTargetChange(data)}
                            >
                              {targetData.map((item:any,idx:any) => (
                              <SelectItem key={item.key} value={item.key}>
                                {item.label}
                              </SelectItem>
                              ))}
                            </Select>
                          </FormControl>
                          <FormMessage className="text-red-400"/>
                        </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="users"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-900 text-md font-semibold tracking-tight">{`Personnes (numéros de téléphones)`}</FormLabel>
                            <FormControl>
                                <TagField
                                  field={field}
                                  tags={field?.value ?? []}
                                  onChange={(data) => {                              
                                    handleUsersPhonesChange(data);
                                  }}
                                  max={1000}
                                />
                            </FormControl>
                            <FormMessage className="text-red-400"/>
                          </FormItem>
                        )}
                      />
                      <div className={`mt-[30px]`}>
                        <CButton 
                        text={'Envoyer'} 
                        btnStyle={'green'}
                        type={"submit"}
                        // href={`/`}
                        icon={<IoIosSend/>}
                        width={'100%'}
                        height={"35px"}
                        />
                      </div>
                    </div>
                </div>
              </div>

            </form>
          </Form>
          
          <div
            style={{zIndex:9000}}
              className={classNames(
                  "transition-all invisible z-20 bg-blue-900/30 opacity-0 absolute top-0 left-0 h-full w-full flex items-center justify-center",
                  {
                      "!opacity-100 !visible z-20": mutation.isLoading,
                  }
              )}
          >
              <HashLoader
                  className="shrink-0"
                  size={50}
                  color="#18BC7A"
              />
          </div>
          <a ref={redirectRef} hidden href="#"></a>
      </div>
    
  )
}

