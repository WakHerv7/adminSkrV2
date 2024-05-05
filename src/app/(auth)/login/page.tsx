"use client";
import { context } from "@/context/ApplicationContext";
import { axiosOpenedInstance } from "@/utils/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Chip, Input } from "@nextui-org/react";
import classNames from "classnames";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaEyeSlash } from "react-icons/fa";
import { FaEnvelope, FaEye, FaLock } from "react-icons/fa6";
import { useMutation } from "react-query";
import { HashLoader } from "react-spinners";
import { z } from "zod";
import Link from 'next/link'

//---------------------------------------
import LoginForm from "./components/form/Form";
import { FaUserCircle } from "react-icons/fa";
import Image from "next/image";
import { useTitle } from "@/hooks/useTitle";
//---------------------------------------

const schema = z.object({
	email: z.string().email("Invalid email"),
	password: z
		.string()
		.min(6, "Password too short - should be more than 6 chars"),
});

const login = async ({
	email,
	password,
}: {
	email: string;
	password: string;
}) => {
	const loginRes = await axiosOpenedInstance.post("/users/auth/login", {
		email,
		password,
	});
	return loginRes.data;
};

const LoginPage = () => {
	useTitle("Sekure | Login");
	// const { dispatch } = useContext(context);
	// const router = useRouter();

	
	// const {
	// 	register,
	// 	formState: { errors },
	// 	handleSubmit,
	// } = useForm({
	// 	defaultValues: {
	// 		email: "",
	// 		password: "",
	// 	},
	// 	resolver: zodResolver(schema),
	// });
	// const [isVisible, setIsVisible] = useState(false);

	// const mutation = useMutation({
	// 	mutationFn: login,
	// 	onError: () => {
	// 		toast.error("Login failed. Check your email and password");
	// 	},
	// 	onSuccess: (data) => {
	// 		toast.success("Login successful! Redirecting...");
	// 		localStorage.setItem("user", JSON.stringify(data.user));
	// 		localStorage.setItem("token", data.token);
	// 		dispatch({ type: "set_user", payload: data.user });
	// 		router.push("/");
	// 	},
	// });

	// const onSubmit = (data: any) => {
	// 	mutation.mutate(data);
	// };
	// const onError = (err: any) => {
	// 	console.error("any", err);
	// };

	// const toggleVisibility = () => setIsVisible(!isVisible);


	return (
		// <div className="md:flex items-center gap-3 relative overflow-hidden">
		<section className="flex mt-0 h-screen w-full">
			<div className="absolute inset-0 -z-10">
				<div style={{width: '100%', height: '100%', position: 'relative'}}>
					<Image
						alt='vector background'
						src="/assets/Vector.png"
						layout='fill'
						objectFit='contain'
					/>
				</div>
			</div>
			<div className="min-w-[397px] flex justify-end h-full">
				<div className="flex flex-col justify-between items-start h-screen px-10 py-20 basis-1/3">
					<div className="flex justify-start items-start w-[180px] h-[24px] mb-[10vh]">
						<img
							src="/assets/LogoSekure.png"
							alt="logo"
							className="w-[121px] h-full"
						/>
						<img
							src='/assets/Admin-logo.png'
							alt="admin logo"
							className="w-[56px] h-[19px] ml-1"
						/>
					</div>
					<div className="flex flex-col items-start">
						<Image
						src="/assets/user-icon.png"
						alt="User Logo"
						className="rounded-full mb-[10px]"
						width={34}
						height={34}
						priority
						/>
						{/* <div className="bg-[#18BC7A] rounded-full">
							<FaUserCircle color="#FFDB5A" size={70} />
						</div> */}
						<h1 className="text-[25px] font-semibold text-gray-900">Connexion</h1>
						<p className="text-gray-600 font-thin text-sm mb-[30px]">{`Visualisez la courbe d'evolution en nom`}</p>
						<div className="mb-[7vh]">
							<LoginForm />
						</div>
					</div>
				</div>
			</div>
			
			<div className="w-full h-full hidden md:block bg-gray-100 relative">
				<div className="absolute inset-0 z-1 bg-gradient-to-b from-[#FFDB5A33] to-[#18BC7A] opacity-75"></div>
				<img
				src="/assets/Rectangle.png"
				className="object-cover w-full h-screen"
				alt="login logo"
				/>
			</div>
		
		</section>
		// </div>


		// <div
		// 	className={
		// 		"mx-4 md:mx-auto w-[70%] space-y-8 rounded-lg bg-white/5 px-12 py-12 relative overflow-hidden"
		// 	}
		// >
		// 	<h2 className="text-4xl  text-center">Welcome Back!</h2>
		// 	<p className={"text-center"}>We are glad to see you here</p>
		// 	<form
		// 		className="space-y-6"
		// 		onSubmit={handleSubmit(onSubmit, onError)}
		// 	>
		// 		<div
		// 			className={classNames(
		// 				"transition-all invisible z-0 bg-blue-900/30 opacity-0 absolute top-0 left-0 h-full w-full flex items-center justify-center",
		// 				{
		// 					"!opacity-100 !visible z-20": mutation.isLoading,
		// 				}
		// 			)}
		// 		>
		// 			<HashLoader
		// 				className="shrink-0"
		// 				size={50}
		// 				color="#4285F4"
		// 			/>
		// 		</div>
		// 		<div>
		// 			<Input
		// 				size={"lg"}
		// 				startContent={
		// 					<FaEnvelope className="text-xl text-default-400 pointer-events-none flex-shrink-0" />
		// 				}
		// 				type="email"
		// 				label="Email"
		// 				placeholder="Enter your email"
		// 				{...register("email")}
		// 				isInvalid={errors.email ? true : false}
		// 				errorMessage={
		// 					errors.email
		// 						? "Please fill here a valid email address"
		// 						: undefined
		// 				}
		// 			/>
		// 		</div>
		// 		<div className={'flex items-center justify-between'}>
		// 			<span>forgotten password ? </span>
		// 			<div className={'text-blue-500 cursor-not-allowed relative mr-5'} >
		// 				Retrieve password
		// 				<div className={"absolute -top-5 -right-5"}>
        //                     <Chip size={'sm'} >SOON</Chip>
		// 				</div>
		// 			</div>
		// 		</div>
		// 		<div>
		// 			<Input
		// 				size={"lg"}
		// 				startContent={
		// 					<FaLock className="text-xl text-default-400 pointer-events-none flex-shrink-0" />
		// 				}
		// 				endContent={
		// 					<button
		// 						className="focus:outline-none"
		// 						type="button"
		// 						onClick={toggleVisibility}
		// 					>
		// 						{isVisible ? (
		// 							<FaEyeSlash className="text-2xl text-default-400 pointer-events-none" />
		// 						) : (
		// 							<FaEye className="text-2xl text-default-400 pointer-events-none" />
		// 						)}
		// 					</button>
		// 				}
		// 				type={isVisible ? "text" : "password"}
		// 				label="Password"
		// 				placeholder="Enter your password"
		// 				{...register("password")}
		// 				isInvalid={errors.password ? true : false}
		// 				errorMessage={
		// 					errors.password
		// 						? "Please fill here a valid password, it should have at least 6 characters"
		// 						: undefined
		// 				}
		// 			/>
		// 		</div>
		// 		<div>
		// 			<Button
		// 				color="primary"
		// 				type="submit"
		// 				variant="flat"
		// 				className="w-full h-[60px]"
		// 			>
		// 				LOG IN
		// 			</Button>
		// 		</div>
		// 		<p className={'flex items-center justify-between'}>
		// 			<span>You don&apos;t have an account ? </span>
        //             <Link className={'text-blue-500'} href={'/auth/register'} >Sign up</Link>
		// 		</p>
		// 	</form>
		// </div>
	);
};

export default LoginPage;
