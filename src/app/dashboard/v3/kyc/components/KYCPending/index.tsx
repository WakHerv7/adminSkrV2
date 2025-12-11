import { KYCServiceV3 } from "@/api/services/v3/kyc";
import CButton from "@/components/shared/CButton";
import CustomTable from "@/components/shared/CustomTable";
import { FourDots } from "@/components/shared/icons";
import LabelWithBadge from "@/components/shared/LabelWithBadge";
import URLConfigV3 from "@/config/urls_v3";
import { headerKYCDataV3 } from "@/constants/v3/KYCDataV3";
import { selectKYCPending } from "@/redux/slices_v2/kyc";
import { getFormattedDateTime } from "@/utils/DateFormat";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { QueryFunctionContext, useQuery } from "react-query";
import { useSelector } from "react-redux";

type Props = {
	isLoading?: boolean;
	search?: string;
	setSearch?: (data?: any) => void;
};

const handleGetKycs = async (
	context: QueryFunctionContext<[string, any]>
) => {
	const [_key, params] = context.queryKey;

	const response = await KYCServiceV3.getkycs(params);
	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message || "Failed to get Kycs");
	}

	return data;
};

const KycPendingV3 = ({ isLoading, search, setSearch }: Props) => {
	const kycPending = useSelector(selectKYCPending);
	const [filterContent, setFilterContent] = useState<any>({});

	// Construire les paramètres de requête avec le statut par défaut et les filtres
	const queryParams = {
		status: ["PENDING", "IN_PROGRESS"],
		...filterContent,
	};

	const pendingKycQuery = useQuery({
		queryKey: ["pending-kyc", queryParams],
		queryFn: handleGetKycs,
		onError: (err: any) => toast.error(err.message),
	});

	// Handle both paginated response (data.data.data) and direct array (data.data)
	const kycData = Array.isArray(pendingKycQuery.data?.data)
		? pendingKycQuery.data?.data
		: pendingKycQuery.data?.data?.data || [];

	const rearrangedTableData = kycData?.map((item: any, index: number) => {
			return {
				serial: index + 1,
				name: item.user.fullName,
				email: item.user.email,
				phone: item.user.phoneNumber,
				status:
					item.status === "Approved" ? (
						<LabelWithBadge label="Approuvé" badgeColor="#18BC7A" />
					) : item.status === "Declined" ? (
						<LabelWithBadge label="Refusé" badgeColor="#F85D4B" />
					) : item.status === "PENDING" ? (
						<LabelWithBadge label="En Attente" badgeColor="#999" />
					) : item.status === "IN_PROGRESS" ? (
						<LabelWithBadge label="En Cours" badgeColor="#FFA500" />
					) : (
						<LabelWithBadge label="Aucun" badgeColor="#000" />
					),
				created: getFormattedDateTime(item.createdAt),
				actions: (
					<div className="flex gap-2 items-center">
						<CButton
							text={"Manager"}
							href={`${URLConfigV3.kyc.manage}/${item.userId}`}
							btnStyle={"dark"}
							icon={<FourDots />}
						/>
					</div>
				),
			};
		}
	);

	return (
		<section>
			<CustomTable
				headerData={headerKYCDataV3}
				tableData={rearrangedTableData}
				threeButtons
				filter
				filterType="kycV3"
				filterContent={filterContent}
				setFilterContent={setFilterContent}
				hideStatusFilter
				isLoading={pendingKycQuery.isLoading && !kycPending}
				search={search}
				setSearch={setSearch}
			/>
		</section>
	);
};

export default KycPendingV3;
