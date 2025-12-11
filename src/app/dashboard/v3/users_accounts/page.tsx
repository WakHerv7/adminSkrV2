"use client";

import { handleGetUsers } from "@/api/handlers/user.handler";

import Layout from "@/components/shared/Layout";
import { userHeaderDataV3 } from "@/constants/v3/userDataV3";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import { getFormattedDateTime } from "@/utils/DateFormat";
import LabelWithBadge from "@/components/shared/LabelWithBadge";
import CButton from "@/components/shared/CButton";
import { FourDots } from "@/components/shared/icons";
import URLConfigV3 from "@/config/urls_v3";
import { FlagIcon } from "@/components/shared/FlagIcon";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { setUserV3 } from "@/redux/slices_v3/userV3";
import CustomTable from "@/components/shared/CustomTable";

const page = () => {
	const [filterContent, setFilterContent] = useState<any>();
	const [search, setSearch] = useState();
	const dispatch = useDispatch();
	const router = useRouter();

	const usersQuery = useQuery({
		queryKey: ["users", { ...filterContent, limit: 1000, search }],
		queryFn: handleGetUsers,
		onError: (err: any) => {
			toast.error(err.message);
		},
	});

	const getTransactionStatusBadge = (status: string) => {
		switch (status) {
			case "ENABLED":
				return <LabelWithBadge label="Activé" badgeColor="#18BC7A" />;
			case "DISABLED":
				return (
					<LabelWithBadge label="Désactivé" badgeColor="#F85D4B" />
				);
			case "IN_PROGRESS":
				return (
					<LabelWithBadge
						label="En progression"
						badgeColor="#3498db"
					/>
				);
			case "ALMOST_ENABLED":
				return (
					<LabelWithBadge
						label="Presque activé"
						badgeColor="#f39c12"
					/>
				);
			default:
				return <LabelWithBadge label="Inconnu" badgeColor="#95a5a6" />;
		}
	};

	const handleManageClick = (user: any) => {
		// 1. Stocker l'utilisateur dans Redux
		dispatch(setUserV3(user));
		console.log("Utilisateur stocké dans Redux:", user);

		// 2. Naviguer vers la page de gestion
		router.push(`${URLConfigV3.usersAccounts.manage}/${user.id}`);
	};

	const tableData =
		usersQuery.data?.data?.data?.map((user: any, index: number) => ({
			serail: (index + 1).toString(),
			firtsName: user.firstName || "N/A",
			lastName: user.lastName || "N/A",

			country: user.countryCode ? (
				<div className="flex items-center gap-2">
					<FlagIcon countryCode={user.countryCode} />
					<span>{user.countryCode}</span>
				</div>
			) : (
				"N/A"
			),

			phone: user.phoneNumber || "N/A",
			roles: user.roles?.join(", ") || "N/A",

			active: user.isActive ? (
				<LabelWithBadge label="Actif" badgeColor="#18BC7A" />
			) : (
				<LabelWithBadge label="Inactif" badgeColor="#F85D4B" />
			),

			kycStatus:
				user.kycStatus === "COMPLETED" ? (
					<LabelWithBadge label="Completé" badgeColor="#18BC7A" />
				) : user.kycStatus === "IN_PROGRESS" ? (
					<LabelWithBadge
						label="En progression"
						badgeColor="#3498db"
					/>
				) : user.kycStatus === "PENDING" ? (
					<LabelWithBadge label="En Attente" badgeColor="#f39c12" />
				) : user.kycStatus === "REJECTED" ? (
					<LabelWithBadge label="Rejeté" badgeColor="#F85D4B" />
				) : (
					<LabelWithBadge label="Non Soumis" badgeColor="#95a5a6" />
				),
			transactionEnabled: getTransactionStatusBadge(
				user.transactionEnableStatus
			),

			date: getFormattedDateTime(user.createdAt),

			action: (
				<div className="flex gap-2 items-center">
					<CButton
						text={"Manage"}
						// href={`${URLConfigV3.usersAccounts.manage}/${user.id}`}
						btnStyle={"dark"}
						icon={<FourDots />}
						onClick={() => handleManageClick(user)}
					/>
				</div>
			),
		})) || [];

	return (
		<Layout title="Users management">
			<section>
				<CustomTable
					headerData={userHeaderDataV3}
					tableData={tableData}
					isLoading={usersQuery.isLoading || usersQuery.isFetching}
					filter
					filterType="usersV3"
					filterContent={filterContent}
					setFilterContent={setFilterContent}
					search={search}
					setSearch={setSearch}
				/>
			</section>
		</Layout>
	);
};

export default page;
