import { RxArrowLeft, RxCaretDown } from "react-icons/rx";
import { IoIosDisc, IoIosNotificationsOutline } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { FaArrowLeft, FaCalendar } from "react-icons/fa";
import Image from "next/image";
import "./style-navbar.css";
import CustomDropdown from "./CustomDropdown";
import Link from "next/link";
import { BsArrowLeft } from "react-icons/bs";
import {
	useScrollPosition,
	useScrollXPosition,
	useScrollYPosition,
} from "react-use-scroll-position";
import variables from "@/variables.module.scss";
import cstyle from "./styles/navbar-style.module.scss";
import Modal from "./Modal/Modal";
import { useDispatch, useSelector } from "react-redux";
import { logOut, selectCurrentUser } from "@/redux/slices/auth";
import {
	selectCurrentVersion,
	selectLimitDate,
	selectStartDate,
	setVersion,
} from "@/redux/slices_v2/settings";
import CustomDropdown2 from "./CustomDropdown2";
import CButton from "./CButton";
import { usePathname, useRouter } from "next/navigation";
import { AuthService } from "@/api/services/auth";
import toast from "react-hot-toast";
import { useMutation } from "react-query";
import { hasPermission } from "@/utils/permissions";
import { useState } from "react";
import ChangeLimitDateModalForm from "@/app/dashboard/v2/home/modals/ChangeLimitDateModalForm";
import { getTextFormattedDate, parseDateObject } from "@/utils/DateFormat";
import ChangeStartDateModalForm from "@/app/dashboard/v2/home/modals/ChangeStartDateModalForm";
import { UserSearchTags } from "./search/UserSearchTags";
import SearchUserInput from "./search/UserSearchInput";
type Props = {
	title: string | undefined;
	backLink?: string;
	goBack?: (data?: any) => void;
	isExpanded: boolean;
};

let scrollPositionY = 0;

const handleLogout = async (email: string) => {
	const response = await AuthService.logout({ email });
	if (!response.ok) {
		const responseBody = await response.json();
		throw new Error(responseBody.message);
	}
};

export default function Navbar(props: Props) {
	const router = useRouter();
	const pathname = usePathname();
	const dispatch = useDispatch();
	const { title, backLink, goBack, isExpanded } = props;
	const classNames = (...classes: string[]): string =>
		classes.filter(Boolean).join(" ");

	const currentUser = useSelector(selectCurrentUser);
	const currentVersion = useSelector(selectCurrentVersion);
	const currentStartDate = useSelector(selectStartDate);
	const currentLimitDate = useSelector(selectLimitDate);

	const [isChangeLimitDateModalFormOpen, setIsChangeLimitDateModalFormOpen] =
		useState(false);
	const [isChangeStartDateModalFormOpen, setIsChangeStartDateModalFormOpen] =
		useState(false);

	const mutation = useMutation({
		mutationFn: async () => handleLogout(currentUser.email),
		onError: (err: any) => {
			if (err.message == "Compte inexistant") {
				toast.success("A bientot! Redirecting...");
				dispatch(logOut());
				router.push("/login");
			} else {
				console.error("Logout onError : ", err.message);
				toast.error(err.message);
			}
		},
		onSuccess: (data) => {
			toast.success("A bientot! Redirecting...");
			dispatch(logOut());
			router.push("/login");
		},
	});

	const onLogout = () => {
		console.log("ON_LOGOUT");

		mutation.mutate();
	};

	const handleVersion = (e: any) => {
		if (e.target.checked) {
			dispatch(setVersion(2));
		} else {
			dispatch(setVersion(1));
		}
	};

	// Use the useScrollPosition hook to get the current scroll position
	scrollPositionY = useScrollYPosition();

	return (
		<div
			className={`w-full pl-0 md:pl-[25px] md:pl-0 ${cstyle["navbar-container"]}`}
		>
			<div
				style={{
					width: isExpanded
						? "calc(100% - 250px)"
						: "calc(100% - 80px)",
					zIndex: "1000",
					boxShadow: `${
						scrollPositionY > 0
							? "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
							: ""
					}`,
				}}
				className={`fixed w-full bg-white flex justify-between items-center h-fit pl-[60px] md:pl-0 px-5 md:px-10 py-5 ${cstyle["navbar-subcontainer"]}`}
			>
				<div className="relative w-full flex justify-start items-center gap-3">
					{backLink ? (
						<Link
							href={backLink}
							className="absolute top-1 left-[-23px] hidden md:block"
						>
							<FaArrowLeft color="#000" size={20} />
						</Link>
					) : goBack ? (
						<div
							onClick={goBack}
							className="absolute top-1 left-[-23px] cursor-pointer hidden md:block"
						>
							<FaArrowLeft color="#000" size={20} />
						</div>
					) : (
						<></>
					)}

					<h1 className="font-semibold text-xl md:text-2xl pl-1 py-0">
						{title}
					</h1>
				</div>
				<div className="flex justify-between items-center gap-3">
					{/* <button className="bg-[#F3FFF8] rounded-full pl-5 pr-3 py-2 text-sm font-[500] text-gray-700 flex justify-between items-center gap-5">ce jour <RxCaretDown color="#33E89C" size={24} /></button> */}
					{/* <CustomDropdown
            title={'Ce jour'}			
            cstyle={'light-green'}
            iconSize={20}
            items={[
                <div key={'1'} className='flex justify-between gap-2'>            
                    <span className='text-nowrap text-sm text-[#18BC7A]'>
                    Ce jour
                    </span>
                </div>,
                <div key={'2'} className='flex justify-between gap-2'>            
                    <span className='text-nowrap text-sm text-[#18BC7A]'>
                    Cette semaine
                    </span>
                </div>,
                <div key={'3'} className='flex justify-between gap-2'>            
                    <span className='text-nowrap text-sm text-[#18BC7A]'>
                    Ce mois
                    </span>
                </div>,
            ]}
            /> */}

					<div className="flex justify-between items-center gap-[0px]">
						{/* <Link href="?modal=true">
                    <button type="button" className="bg-blue-500 text-white p-2">Open Modal</button>
                </Link> */}
						{/* <div className="relative w-[30px] h-[30px] flex justify-center items-center rounded-full bg-[#F4EFE3]">
                    <IoIosNotificationsOutline color="#18BC7A" size={22}  />
                    <div className='absolute bottom-[-8px] right-[-8px] w-[18px] h-[18px] bg-[#18BC7A] rounded-full 
                    text-center flex justify-center items-center text-[10px] font-bold text-white'>
                    14
                    </div>
                </div> */}
						<div className="relative hidden md:flex mr-10 w-[300px]">
							<SearchUserInput
								onSelected={(data) =>
									router.push(
										`/dashboard/v2/users_accounts/manage/${data.id}`
									)
								}
							/>
						</div>

						{currentUser.admin_role === "owner" ||
						currentUser.admin_role === "manager" ? (
							<div className="flex gap-7">
								<div className="relative hidden md:flex mr-10 w-[100px]">
									<span className="absolute top-[-20px] left-0 text-xs font-bold">
										Debut
									</span>
									<div
										className="flex gap-3 text-xs items-center cursor-pointer hover:text-[#18BC7A]"
										onClick={() =>
											setIsChangeStartDateModalFormOpen(
												true
											)
										}
									>
										<FaCalendar size={14} />
										<span>
											{getTextFormattedDate(
												parseDateObject(
													currentStartDate
												)
											)}
										</span>
									</div>
									<ChangeStartDateModalForm
										isOpen={isChangeStartDateModalFormOpen}
										setIsOpen={
											setIsChangeStartDateModalFormOpen
										}
										customer={currentUser}
									/>
								</div>
								<div className="relative hidden md:flex mr-10 w-[100px]">
									<span className="absolute top-[-20px] left-0 text-xs font-bold">
										Fin
									</span>
									<div
										className="flex gap-3 text-xs items-center cursor-pointer hover:text-[#18BC7A]"
										onClick={() =>
											setIsChangeLimitDateModalFormOpen(
												true
											)
										}
									>
										<FaCalendar size={14} />
										<span>
											{getTextFormattedDate(
												parseDateObject(
													currentLimitDate
												)
											)}
										</span>
									</div>
									<ChangeLimitDateModalForm
										isOpen={isChangeLimitDateModalFormOpen}
										setIsOpen={
											setIsChangeLimitDateModalFormOpen
										}
										customer={currentUser}
									/>
								</div>
							</div>
						) : (
							<></>
						)}

						<div className="text-xs">
							{currentUser?.last_name?.split(" ")[0]}
						</div>

						<CustomDropdown2
							btnChild={
								<div
									style={{
										width: 30,
										height: 30,
										borderRadius: "50%",
										position: "relative",
									}}
								>
									<Image
										alt="vector background"
										src="/assets/user-icon.png"
										layout="fill"
										objectFit="contain"
									/>
									<div
										className="absolute bottom-[-8px] right-[-8px]
                        text-center flex justify-center items-center text-[10px] font-bold text-white"
									>
										<svg
											width="19"
											height="19"
											viewBox="0 0 13 13"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M5.71404 1.82088C6.33845 1.09319 7.46454 1.09319 8.08895 1.82088C8.41345 2.19907 8.8987 2.40006 9.39557 2.3621C10.3517 2.28907 11.1479 3.08534 11.0749 4.04142C11.0369 4.53829 11.2379 5.02354 11.6161 5.34804C12.3438 5.97245 12.3438 7.09854 11.6161 7.72295C11.2379 8.04746 11.0369 8.5327 11.0749 9.02958C11.1479 9.98565 10.3517 10.7819 9.39557 10.7089C8.8987 10.6709 8.41345 10.8719 8.08895 11.2501C7.46454 11.9778 6.33845 11.9778 5.71404 11.2501C5.38953 10.8719 4.90429 10.6709 4.40741 10.7089C3.45134 10.7819 2.65507 9.98565 2.7281 9.02958C2.76606 8.5327 2.56506 8.04746 2.18688 7.72295C1.45919 7.09854 1.45919 5.97245 2.18688 5.34804C2.56506 5.02354 2.76606 4.53829 2.7281 4.04142C2.65507 3.08534 3.45134 2.28907 4.40741 2.3621C4.90429 2.40006 5.38953 2.19907 5.71404 1.82088Z"
												fill="#18BC7A"
											/>
											<path
												d="M3.9975 6.24499L5.73992 7.98741L9.51517 4.21216"
												stroke="white"
											/>
										</svg>
									</div>
								</div>
							}
							cstyle={""}
							iconSize={20}
							items={[
								<div
									key={"1"}
									className="flex justify-center w-full px-3 gap-2"
								>
									<span className="text-nowrap text-md ">
										<div
											style={{
												width: 80,
												height: 80,
												borderRadius: "50%",
												position: "relative",
											}}
										>
											<Image
												alt="vector background"
												src={
													currentUser?.selfie ??
													"/assets/user-icon.png"
												}
												layout="fill"
												objectFit="contain"
											/>
										</div>
									</span>
								</div>,
								<div
									key={"2"}
									className="flex justify-center w-full px-3 gap-2"
								>
									<span className="text-nowrap text-sm ">
										{currentUser?.last_name}
									</span>
								</div>,
								<div
									key={"3"}
									className="flex justify-center w-full px-3 gap-2"
								>
									<span className="text-nowrap text-sm ">
										{currentUser?.email}
									</span>
								</div>,
								// <div
								//     key={"3"}
								//     className="flex justify-center w-full px-3 gap-2"
								// >
								//     <span className="text-nowrap text-sm ">
								//     {currentUser?._id}
								//     </span>
								// </div>,
								<>
									{hasPermission(
										currentUser,
										"retrait_gb",
										"view"
									) ? (
										<div
											key={"4"}
											className="flex justify-center w-full px-3 gap-2 py-3"
										>
											<CButton
												text={"Balances"}
												btnStyle={"lightGreen"}
												href={"/retrait-gb"}
											/>
										</div>
									) : (
										<></>
									)}
								</>,
								<>
									{currentUser.admin_role === "owner" ||
									currentUser.admin_role === "manager" ? (
										<div
											key={"5"}
											className="flex justify-center w-full px-3 gap-2"
										>
											<CButton
												text={"Dashboard V1V2"}
												btnStyle={"outlineGreen"}
												href={"/dashboard/v1v2/home"}
												// icon={<FourDots />}
											/>
										</div>
									) : (
										<></>
									)}
								</>,
								<div
									key={"6"}
									className="flex justify-center w-full px-3 gap-2"
								>
									<CButton
										text={"Deconnexion"}
										btnStyle={"outlineDark"}
										onClick={onLogout}
										// icon={<FourDots />}
									/>
								</div>,
							]}
						/>
					</div>

					{/* {currentUser.admin_role === "owner" ||
					currentUser.admin_role === "manager" ? (
						<div className="hidden md:block pl-2">
							{pathname?.includes("v1v2") ? (
								<>
									<div className="switchbar block bg-gray-100 w-fit h-[33px] rounded-full flex items-center px-4 text-xs">
										<span className="testMode font-bold text-[18px] text-gray-600">
											V1V2
										</span>
									</div>
								</>
							) : (
								<>
									<label
										htmlFor="modeToggle"
										className="flex items-center cursor-pointer"
									>
										<div className="relative">
											<input
												type="checkbox"
												defaultChecked={
													currentVersion == 2
												}
												onChange={(e) =>
													handleVersion(e)
												}
												id="modeToggle"
												className="sr-only"
											/>
											<div className="switchbar block bg-gray-100 w-[70px] h-[33px] rounded-full flex items-center px-2 text-xs">
												<span className="testMode font-bold text-[18px] text-gray-600">
													V2
												</span>
												<span className="proMode font-bold text-[18px] text-gray-600">
													V1
												</span>
											</div>

											<div
												className="dot absolute left-1 top-[1px] bg-[#18BC7A] w-[28px] h-[28px] 
                        rounded-full transition flex justify-center items-center"
											>
												<span className="w-[14px] h-[14px] rounded-[5px] border border-solid border-4 border-white"></span>
											</div>
										</div>
									</label>
								</>
							)}
						</div>
					) : (
						<></>
					)} */}
				</div>
			</div>
			{/* <Modal/>  */}
		</div>
	);
}
