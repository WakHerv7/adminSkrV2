import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { loginSchema } from "@/validation/FormValidation";
import { FaChevronRight } from "react-icons/fa";
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
import CButton from "@/components/shared/CButton";
import { AuthService } from "@/api/services/auth";
import { useMutation } from "react-query";
import { HashLoader } from "react-spinners";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/redux/slices/auth";
import { useRouter } from "next/navigation";
import classNames from "classnames";
import urls from "@/config/urls"
import urlsV2 from "@/config/urls_v2";

const handleLogin = async (data: z.infer<typeof loginSchema>) => {
  const response = await AuthService.login(data); 
  if (!response.ok) {
    const responseBody = await response.json();
    // console.error(response); 
    if (response.status === 403) {
      throw new Error(responseBody.message);
    } else {
      throw new Error("Echec authentification. Veuillez indiquer votre email et votre mot de passe !");
    }      
  }
  const responseJson = await response.json();
  return responseJson;  
};

export default function LogiForm() {
  const previousUrl = window.sessionStorage.getItem('previousUrl');
  const router = useRouter();
  const dispatch = useDispatch();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "", 
    },
  });

  

  const mutation = useMutation({
		mutationFn: handleLogin,
		onError: (err:any) => {
      console.error("Login onError : ", err.message);
      toast.error(err.message);		
		},
		onSuccess: (data) => {
      console.log("Login onSuccess : ", data);      
      const token = data.token;
      const getSekureApiToken = data.getSekureApiToken;
      const user = data.data.user;
      localStorage.setItem('sktoken', token);
      toast.success("Login successful! Redirecting..."); 
      dispatch(setCredentials({ token, getSekureApiToken, user}));
			router.push(previousUrl || urlsV2.dashboardHome.root);
		},
	});

	const onSubmit = (data: any) => {
		mutation.mutate(data);
	};
	const onError = (err: any) => {
		console.error("any", err);
	};

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onError)}>
        <div className="space-y-[20px]">
            <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
                <FormItem>
                <FormLabel className="text-gray-900 text-sm tracking-tight">Adresse email</FormLabel>
                <FormControl>
                    <Input className="px-6 w-[272px] bg-[#F4EFE3]" {...field} />
                </FormControl>
                <FormMessage className="text-red-400"/>
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
                    <Input type="password" className="px-6 w-full bg-[#F4EFE3]" {...field} />
                </FormControl>
                <FormMessage className="text-red-400"/>
                </FormItem>
            )}
            />
        </div>
        
        <div className="text-right">
          <a href="#" className="inline-block w-[272px] text-sm font-[400]">Mot de passe oublié ?</a>
        </div>
        {/* <Link href="#" className="text-gray-800 font-semibold text-righttext-sm">Forgotten Password?</Link> */}
        <div className={`mt-[10vh]`}>
          <CButton 
          text={'Connexion'} 
          btnStyle={'green'}
          type={"submit"}
          // href={`/`}
          iconLeft={<FaChevronRight />}
          width={'100%'}
          height={"35px"}
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
  )
}

