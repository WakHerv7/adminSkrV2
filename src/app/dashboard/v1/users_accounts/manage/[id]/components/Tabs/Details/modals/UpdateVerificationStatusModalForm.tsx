
import CButton from '@/components/shared/CButton';
import Title from '@/components/shared/Title';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { FaX } from 'react-icons/fa6';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { loginSchema } from "@/validation/FormValidation";
import { FaChevronRight } from "react-icons/fa";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation } from "react-query";
import { HashLoader } from "react-spinners";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser, setCredentials } from "@/redux/slices/auth";
import { useRouter } from "next/navigation";
import classNames from "classnames";
import { Textarea } from '@/components/ui/textarea';
import { Autocomplete, Box, Chip, MenuItem, OutlinedInput, TextField } from '@mui/material'; 
import _ from 'lodash';
import { TransactionService } from '@/api/services/transaction';
import { selectCurrentCustomerDetails, setCurrentCustomerDetails } from '@/redux/slices/customer';
import { useRef } from 'react';
import { User } from 'lucide-react';
import { UserService } from '@/api/services/user';
import DialogWrapper from '@/components/shared/DialogWrapper';
import { Switch } from "@/components/ui/switch";
import LabelWithBadge from '@/components/shared/LabelWithBadge';
import { MdCheck, MdClose } from 'react-icons/md';


export const formSchema:any = z.object({
    isNumberVerified: z.boolean(),
    isEmailVerified: z.boolean(),
    isPersonVerified: z.boolean(),
    idImagesLength: z.number()
});

    
const handleUpdate = async (queryData:any) => {
    const {currentUserId, customerId, body} = queryData;
    console.log("handleUpdate : ", {currentUserId, customerId, body});
    // return {currentUserId, customerId, body}
    const response = await UserService.update_user_verification_status({
        userId:currentUserId,
        customerId:customerId,
        body:body
    }); 
    if (!response.ok) {
        const responseBody = await response.json();
        throw new Error(responseBody.message);
    }
    const responseJson = await response.json();
    return responseJson;
    
}

interface ModalProps {
    customer?:any;
    isOpen: boolean;
    setIsOpen:(data?:any)=>void;
}
export type Person = {
    id?: number;
    name: string;
    email: string;
    phone?: string;
}

export default function UpdateVerificationStatusModalForm({isOpen, setIsOpen, customer}:ModalProps) {
    const pathname = usePathname();
    const redirectRef:any = useRef();
    
    const handleClose = ()=> {
        setIsOpen(false);
    }
    
    const searchParams = useSearchParams();
    const router = useRouter();
    // const navigate = useNavigate();
    const dispatch = useDispatch();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            isNumberVerified: customer?.isNumberVerified ?? false,
            isEmailVerified: customer?.isEmailVerified ?? false,
            isPersonVerified: customer?.isPersonVerified ?? false,
            isProfileVerified: customer?.isProfileVerified ?? false,
            idImagesLength: customer?.idImages?.length ?? 0,
        }
    });

    const currentUser = useSelector(selectCurrentUser);
    // const customerDetails:any = useSelector(selectCurrentCustomerDetails);

    const mutation = useMutation({
		mutationFn: (data)=>handleUpdate({currentUserId:currentUser?._id, customerId:customer?._id, body:data}),
		onError: (err:any) => {
            console.error("onError : ", err.message);
            toast.error(`Erreur mise a jour du statut de verification : ` + err.message);		
		},
		onSuccess: (data) => {
            console.log("onSuccess : ", data);
            toast.success(`Le statut de verification a été mis à jour avec succès.`);
            redirectRef.current.href = window.location.pathname;
            redirectRef.current.click();
		},
	});

    const onSubmit = (data: any) => {
        // console.log("pathname : ", pathname);
		mutation.mutate(data);
	};
	const onError = (err: any) => {
		console.error("onError : ", err);
	};

    // user.isNumberVerified &&
    // user.isEmailVerified &&
    // user.isPersonVerified &&
    // user.idImages.length > 0

    return (
        <DialogWrapper
        open={isOpen}
        handleClose={handleClose}
        title={`Mise à jour du statut de verification de`}
        titleLine2={`${customer?.name}`}
        >
            <div className="min-w-[350px] max-w-[700px]">
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit, onError)}>
                    <div className="space-y-[20px]">
                        <FormField
                        control={form.control}
                        name="isNumberVerified"
                        render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between">
                            <FormLabel className="text-sm font-semibold">Vérification numéro de téléphone</FormLabel>
                            <FormControl>
                            <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="data-[state=checked]:bg-[#18BC7A]"
                            />
                            </FormControl>
                        </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="isEmailVerified"
                        render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between">
                            <FormLabel className="text-sm font-semibold">Vérification email</FormLabel>
                            <FormControl>
                            <Switch
                                checked={field.value}
                                // onChange={(e)=>field.onChange(e.target.checked)}
                                onCheckedChange={field.onChange}
                                className="data-[state=checked]:bg-[#18BC7A]"
                            />
                            </FormControl>
                        </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="isPersonVerified"
                        render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between">
                            <FormLabel className="text-sm font-semibold">Vérification identité</FormLabel>
                            <FormControl>
                            <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="data-[state=checked]:bg-[#18BC7A]"
                            />
                            </FormControl>
                        </FormItem>
                        )}
                        />
                        <FormItem>
                        <FormLabel className="text-gray-900 text-sm font-[500] tracking-tight">{`Documents d'identité`}</FormLabel>
                        <div>
                        {
                            form.getValues('idImagesLength')>=1 ?
                            <LabelWithBadge icon={<MdCheck color={'#18BC7A'} />} className={`text-sm`} label={`Recto`} badgeColor={'#18BC7A'} textColor={'#444'}/>
                            :
                            <LabelWithBadge icon={<MdClose color={'#F85D4B'} />}className={`text-sm`} label={`Recto`} badgeColor={'#F85D4B'} textColor={'#444'}/>
                        }
                        {
                            form.getValues('idImagesLength')>=2 ?
                            <LabelWithBadge icon={<MdCheck color={'#18BC7A'} />}className={`text-sm`} label={`Verso`} badgeColor={'#18BC7A'} textColor={'#444'}/>
                            :
                            <LabelWithBadge icon={<MdClose color={'#F85D4B'} />}className={`text-sm`} label={`Verso`} badgeColor={'#F85D4B'} textColor={'#444'}/>
                        }
                        </div>
                        </FormItem>
                        <FormItem>
                        <FormLabel className="text-gray-900 text-sm font-[500] tracking-tight">{`KYC validé`}</FormLabel>
                        <div>
                        {
                            form.getValues('isProfileVerified') ?
                            <LabelWithBadge icon={<MdCheck color={'#18BC7A'} />} className={`text-sm`} label={`Oui`} badgeColor={'#18BC7A'} textColor={'#444'}/>
                            :
                            <LabelWithBadge icon={<MdClose color={'#F85D4B'} />}className={`text-sm`} label={`Non`} badgeColor={'#F85D4B'} textColor={'#444'}/>
                        }
                        {
                            !form.getValues('isProfileVerified') &&
                            form.getValues('idImagesLength')>=2 &&                            
                            form.getValues('isNumberVerified') &&
                            form.getValues('isEmailVerified') &&
                            form.getValues('isPersonVerified') ?
                            <div className='text-gray-500 text-sm mt-3'>
                                {`Pour valider le KYC, cliquez simplement sur "Enregistrer"`}
                            </div>
                            :<></>
                        }
                        </div>
                        </FormItem>
                        {/* <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel className="text-gray-900 text-sm font-[500] tracking-tight">Mot de passe</FormLabel>
                            <FormControl>
                                <Input className="px-2 w-full bg-[#F4EFE3]" {...field} />
                            </FormControl>
                            <FormMessage className="text-red-400"/>
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="passwordConfirm"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel className="text-gray-900 text-sm font-[500] tracking-tight">Confirmation du mot de passe</FormLabel>
                            <FormControl>
                                <Input className="px-2 w-full bg-[#F4EFE3]" {...field} />
                            </FormControl>
                            <FormMessage className="text-red-400"/>
                            </FormItem>
                        )}
                        /> */}
                    </div>
                    
                    <div className={`mt-[10vh]`}>
                    <CButton 
                    text={`Enregistrer`}
                    btnStyle="green"
                    type={"submit"}
                    width={'100%'}
                    />
                    </div>
                    <div
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
                    {/* <Button type="submit" className="w-[272px] mt-[10vh] bg-[#18BC7A] hover:bg-[#FFDB5A] hover:text-[#18BC7A] rounded-full">Connexion</Button> */}
                </form>
                </Form>
                <a ref={redirectRef} hidden href="#"></a>
            </div>
        </DialogWrapper>
  )
}
