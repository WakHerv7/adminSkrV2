import React, { useState } from "react";
import { usePathname } from "next/navigation";
// import { Link, NavLink } from 'next-link';
import Link from "next/link";
import Logo from "../shared/Logo";
import {
	Accueil,
	Cards,
	Gains,
	Kyc,
	Logout,
	Notifications,
	Parameters,
	Transfert,
	Users,
	UsersV2,
	Wallet,
} from "./icons";
import {
	FaChevronLeft,
	FaChevronRight,
	FaUserCheck,
	FaHandHoldingUsd,
	FaTicketAlt,
} from "react-icons/fa";

import { IoIosSend } from "react-icons/io";
import cstyle from "./styles/sidebar-style.module.scss";
import urls from "@/config/urls";
import urlsV2 from "@/config/urls_v2";
import urlsV1V2 from "@/config/urlsv1v2";
import { hasPermission } from "@/utils/permissions";
import { selectCurrentVersion } from "@/redux/slices_v2/settings";
import { useSelector } from "react-redux";
import { FaFilterCircleDollar } from "react-icons/fa6";
import { HiOutlineMenu } from "react-icons/hi";
import { AiFillBank } from "react-icons/ai";
import { BsBank2 } from "react-icons/bs";
import URLV3Config from "@/config/urls_v2";
import URLConfigV3 from "@/config/urls_v3";

interface ISideBarLinks {
	title: string;
	icon: string;
	path: string;
}

type Props = {
	isExpanded: boolean;
	setIsExpanded: (value: boolean) => void;
	user: any;
};

const SideBar = (props: Props) => {
	const { isExpanded, setIsExpanded, user } = props;
	const pathname = usePathname();
	console.log("user dans sidebar :: ", user);

	const currentVersion = useSelector(selectCurrentVersion);
	console.log("currentVersion :: ", currentVersion);

	const [isOpen, setIsOpen] = useState(false);

	console.log("window.innerWidth :: ", window.innerWidth);

	const SideBarLinksV1 = [
		{
			title: "Accueil",
			slug: "home",
			canSee: hasPermission(user, "home", "view"),
			path: urls.dashboardHome.root,
			count: null,
			icon: <Accueil />,
		},
		{
			title: "Comptes utilisateurs",
			slug: "usersAccounts",
			canSee: hasPermission(user, "user_accounts", "view"),
			path: urls.usersAccounts.root,
			count: null,
			icon: <Users />,
		},
		{
			title: "Transactions wallet",
			slug: "walletTransactions",
			canSee: hasPermission(user, "wallet_transactions", "view"),
			path: urls.walletTransactions.root,
			count: null,
			icon: <Wallet />,
		},
		{
			title: "Transfert d'argent",
			slug: "transferts",
			canSee: hasPermission(user, "transfers", "view"),
			path: urls.transferts.root,
			count: null,
			icon: <Transfert />,
		},
		{
			title: "Cartes",
			slug: "cards",
			canSee: hasPermission(user, "cards", "view"),
			path: urls.cards.root,
			count: null,
			icon: <Cards />,
		},
		{
			title: "Verifications KYC",
			slug: "kyc",
			canSee: hasPermission(user, "kyc", "view"),
			path: urls.kyc.root,
			count: null,
			icon: <Kyc />,
		},
		{
			title: "Gains",
			slug: "profit",
			canSee: hasPermission(user, "profit", "view"),
			path: urls.profit.root,
			count: null,
			icon: <Gains />,
		},
		{
			title: "Administration",
			slug: "administration",
			canSee: hasPermission(user, "administration", "view"),
			path: urls.administration.root,
			count: null,
			icon: <Notifications />,
		},
		{
			title: "Notifications",
			slug: "notifications",
			canSee: hasPermission(user, "notifications", "view"),
			path: urls.notifications.root,
			count: null,
			icon: <IoIosSend size={18} />,
		},
		{
			title: "Paramètres généraux",
			slug: "generalSettings",
			canSee: hasPermission(user, "general_settings", "view"),
			path: urls.generalSettings.root,
			count: null,
			icon: <Parameters />,
		},
		// {
		//   title: 'Logout',
		//   path: urls.login,
		//   count: null,
		//   icon: <Logout/>,
		// }
	];
	const SideBarLinksV2 = [
		{
			title: "Accueil",
			slug: "home",
			canSee: hasPermission(user, "home", "view"),
			path: urlsV2.dashboardHome.root,
			count: null,
			icon: <Accueil />,
		},
		{
			title: "Comptes utilisateurs",
			slug: "usersAccounts",
			canSee: hasPermission(user, "user_accounts", "view"),
			path: urlsV2.usersAccounts.root,
			count: null,
			icon: <UsersV2 />,
		},
		{
			title: "Verifs KYC",
			slug: "kycV2",
			canSee: hasPermission(user, "kyc_v2", "view"),
			path: urlsV2.kyc.root,
			count: null,
			icon: <FaUserCheck size={18} />,
		},
		{
			title: "Services de paiement",
			slug: "payment_services",
			canSee: hasPermission(user, "payment_services", "view"),
			path: urlsV2.payment_services.root,
			count: null,
			icon: <FaHandHoldingUsd size={20} />,
		},
		{
			title: "Gains",
			slug: "earnings",
			canSee: hasPermission(user, "earnings", "view"),
			path: urlsV2.earnings.root,
			count: null,
			icon: <BsBank2 size={18} />,
		},
		{
			title: "Notifications",
			slug: "notifications",
			canSee: hasPermission(user, "notifications", "view"),
			path: urlsV2.notifications.root,
			count: null,
			icon: <IoIosSend size={18} />,
		},
		{
			title: "Requêtes clients",
			slug: "customer_tickets",
			canSee: true,
			path: urlsV2.customer_tickets.root,
			count: null,
			icon: <FaTicketAlt size={18} />,
		},
		{
			title: "Régularisations",
			slug: "regularisations",
			canSee: true,
			path: urlsV2.regularisations.root,
			count: null,
			icon: <FaFilterCircleDollar size={18} />,
		},
	];

	const SideBarLinksV1V2 = [
		{
			title: "Accueil",
			slug: "home",
			canSee: hasPermission(user, "homev1v2", "view"),
			path: urlsV1V2.dashboardHome.root,
			count: null,
			icon: <Accueil />,
		},
		{
			title: "Comptes utilisateurs",
			slug: "usersAccounts",
			canSee: hasPermission(user, "user_accounts", "view"),
			path: urlsV2.usersAccounts.root,
			count: null,
			icon: <UsersV2 />,
		},
		// {
		// 	title: "Services de paiement",
		// 	slug: "payment_services",
		// 	canSee: hasPermission(user, "payment_services", "view"),
		// 	path: urlsV2.payment_services.root,
		// 	count: null,
		// 	icon: <FaHandHoldingUsd size={20} />,
		// },
		{
			title: "Gains",
			slug: "earnings",
			canSee: hasPermission(user, "earnings", "view"),
			path: urlsV2.earnings.root,
			count: null,
			icon: <BsBank2 size={18} />,
		},
	];

	const sideBarLinkV3 = [
		{
			title: "Acceuil",
			path: URLConfigV3.dashboardHome.root,
			icon: <Accueil />,
		},
		{ title: "KYC", path: URLConfigV3.kyc.root, icon: <Kyc /> },
		{
			title: "Settings",
			path: URLConfigV3.settings.root,
			icon: <Parameters />,
		},
	];

	return (
		<div className="relative">
			<div
				className={`${"absolute z-[2000] w-[50px] h-[30px] top-[15px] right-[0px]"} text-[34px] ml-[15px] mt-[30px] mb-[20px]`}
			>
				<div
					className={`pb-[30px] md:hidden block ${cstyle["hamburger-menu"]}`}
				>
					<input
						id="menuToggle"
						className={`${cstyle["menu__toggle"]}`}
						type="checkbox"
						checked={isOpen}
						onChange={(e) => setIsOpen(e.target.checked)}
					/>
					<label
						className={`${cstyle["menu__btn"]}`}
						htmlFor="menuToggle"
					>
						<span></span>
					</label>
				</div>
			</div>

			{isOpen || window.innerWidth > 760 ? (
				<div
					style={{ zIndex: 10, width: isExpanded ? "250px" : "80px" }}
					className={`${cstyle["sidebar-container"]}`}
				>
					<div
						style={{ width: isExpanded ? "250px" : "80px" }}
						className="fixed pt-[22px] pb-[20px] h-full flex flex-col gap-0 border-t-4 border-r-4 border-gray-200"
					>
						<div>
							<input
								type="checkbox"
								hidden
								checked={isExpanded}
								onChange={(e) =>
									setIsExpanded(e.target.checked)
								}
								id="sidebarToggleInput"
								className={`${cstyle["sidebar-toggle-input"]}`}
							/>
							<label
								className={`${cstyle["sidebar-toggle"]}`}
								htmlFor="sidebarToggleInput"
							>
								<span className={`${cstyle["chevronLeft"]}`}>
									<FaChevronLeft color={"#444"} />
								</span>
								<span className={`${cstyle["chevronRight"]}`}>
									<FaChevronRight color={"#444"} />
								</span>
							</label>
						</div>
						<div
							className={`pl-[20px] mb-[27px] ${cstyle["sidebar-logo"]}`}
						>
							<Logo isExpanded={isExpanded} />
						</div>
						<div className="relative">
							<ul
								className="list-image-none w-full my-0 py-0"
								style={{
									marginBlockStart: 0,
									marginBlockEnd: 0,
									paddingInlineStart: 0,
								}}
							>
								{user?.admin_role === "guest" ? (
									<>
										{SideBarLinksV1V2.map((link) => {
											const isActive =
												pathname?.split("/")[2] ===
													link.path.split("/")[2] &&
												pathname?.split("/")[3] ===
													link.path.split("/")[3];
											const iconColor = isActive
												? "fill-[#fff]"
												: "fill-[#444]";
											if (link.canSee) {
												return (
													<li
														key={link.title}
														className={`relative`}
														style={{
															margin: !isExpanded
																? "5px 0"
																: "",
														}}
													>
														<Link
															href={link.path}
															className={`relative pl-[22px] pr-3 py-3 flex items-center justify-between gap-[15px] group 
									text-gray-700 group hover:bg-[#18BC7A] 
									hover:pl-7 transition-all ${isActive ? "bg-[#18BC7A] pl-7" : ""}
									text-sm group-hover:text-gray-100 transition-all ${
										isActive ? "text-white" : ""
									}`}
														>
															<div className="flex items-center gap-[15px]">
																<div
																	style={{
																		transform:
																			!isExpanded
																				? "scale(1.2)"
																				: "",
																	}}
																>
																	{React.cloneElement(
																		link.icon,
																		{
																			className:
																				iconColor,
																		}
																	)}
																</div>
																{isExpanded ? (
																	<div
																		className={`group-hover:text-gray-100`}
																	>
																		{
																			link.title
																		}
																	</div>
																) : (
																	<div
																		className={`absolute top-0 left-[80px] shadow-lg rounded-md bg-white px-3 py-3 hidden group-hover:block`}
																		style={{
																			zIndex: "1000",
																			color: "#444",
																			whiteSpace:
																				"nowrap",
																		}}
																	>
																		{
																			link.title
																		}
																	</div>
																)}
															</div>
															{link.count && (
																<div className="absolute w-[20px] h-[20px] top-[10px] right-[10px] rounded-full bg-[#444] group-hover:bg-[#fff] text-center flex justify-center items-center text-xs font-bold text-white group-hover:text-[#18BC7A]">
																	<span>
																		14
																	</span>
																</div>
															)}
														</Link>
													</li>
												);
											}
										})}
									</>
								) : user?.roles?.includes("ADMIN") ? (
									//  version 3 pour admin
									sideBarLinkV3.map((link) => {
										const isActive = pathname?.startsWith(
											link.path
										);
										const iconColor = isActive
											? "fill-[#fff]"
											: "fill-[#444]";
										return (
											<li
												key={link.title}
												className="relative"
											>
												<Link
													href={link.path}
													className={`relative pl-[22px] pr-3 py-3 flex items-center justify-between gap-[15px] group 
							text-gray-700 hover:bg-[#18BC7A] hover:pl-7 transition-all ${
								isActive ? "bg-[#18BC7A] pl-7 text-white" : ""
							} text-sm`}
												>
													<div className="flex items-center gap-[15px]">
														{React.cloneElement(
															link.icon,
															{
																className:
																	iconColor,
															}
														)}
														{isExpanded && (
															<div>
																{link.title}
															</div>
														)}
													</div>
												</Link>
											</li>
										);
									})
								) : (
									<>
										{(currentVersion == 2
											? SideBarLinksV2
											: SideBarLinksV1
										).map((link) => {
											const isActive =
												pathname?.split("/")[2] ===
													link.path.split("/")[2] &&
												pathname?.split("/")[3] ===
													link.path.split("/")[3];
											const iconColor = isActive
												? "fill-[#fff]"
												: "fill-[#444]";
											if (link.canSee) {
												return (
													<li
														key={link.title}
														className={`relative`}
														style={{
															margin: !isExpanded
																? "5px 0"
																: "",
														}}
													>
														<Link
															href={link.path}
															className={`relative pl-[22px] pr-3 py-3 flex items-center justify-between gap-[15px] group 
									text-gray-700 group hover:bg-[#18BC7A] 
									hover:pl-7 transition-all ${isActive ? "bg-[#18BC7A] pl-7" : ""}
									text-sm group-hover:text-gray-100 transition-all ${
										isActive ? "text-white" : ""
									}`}
														>
															<div className="flex items-center gap-[15px]">
																<div
																	style={{
																		transform:
																			!isExpanded
																				? "scale(1.2)"
																				: "",
																	}}
																>
																	{React.cloneElement(
																		link.icon,
																		{
																			className:
																				iconColor,
																		}
																	)}
																</div>
																{isExpanded ? (
																	<div
																		className={`group-hover:text-gray-100`}
																	>
																		{
																			link.title
																		}
																	</div>
																) : (
																	<div
																		className={`absolute top-0 left-[80px] shadow-lg rounded-md bg-white px-3 py-3 hidden group-hover:block`}
																		style={{
																			zIndex: "1000",
																			color: "#444",
																			whiteSpace:
																				"nowrap",
																		}}
																	>
																		{
																			link.title
																		}
																	</div>
																)}
															</div>
															{link.count && (
																<div className="absolute w-[20px] h-[20px] top-[10px] right-[10px] rounded-full bg-[#444] group-hover:bg-[#fff] text-center flex justify-center items-center text-xs font-bold text-white group-hover:text-[#18BC7A]">
																	<span>
																		14
																	</span>
																</div>
															)}
														</Link>
													</li>
												);
											}
										})}
									</>
								)}
							</ul>
						</div>
					</div>
				</div>
			) : (
				<></>
			)}
		</div>
	);
};

export default SideBar;
