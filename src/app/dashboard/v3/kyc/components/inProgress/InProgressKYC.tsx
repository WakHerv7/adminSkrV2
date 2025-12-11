import { KYCServiceV3 } from "@/api/services/v3/kyc";
import CButton from "@/components/shared/CButton";
import CustomTable from "@/components/shared/CustomTable";
import { FourDots } from "@/components/shared/icons";
import LabelWithBadge from "@/components/shared/LabelWithBadge";
import URLConfigV3 from "@/config/urls_v3";
import { headerKYCDataV3 } from "@/constants/v3/KYCDataV3";
import { getFormattedDateTime } from "@/utils/DateFormat";
import React from "react";
import toast from "react-hot-toast";
import { useQuery } from "react-query";

const handleGetKycs = async ({ queryKey }: any) => {
	const [_key, status, page, limit] = queryKey;
	console.log("status dans la page", status);

	const response = await KYCServiceV3.getkycs({ status, page, limit });

	const responseJson = await response.json();

	if (!response.ok) {
		throw new Error(responseJson.message || "Failed to get Kycs");
	}

	return responseJson;
};
const InProgressKYC = () => {
	const inProgressKycQuery = useQuery({
		queryKey: ["inProgress-kyc", "IN_PROGRESS"],
		queryFn: handleGetKycs,
		onError: (err: any) => {
			toast.error(err.message);
		},
	});

	// Handle both paginated response (data.data.data) and direct array (data.data)
	const kycData = Array.isArray(inProgressKycQuery.data?.data)
		? inProgressKycQuery.data?.data
		: inProgressKycQuery.data?.data?.data || [];

	const rearrangedTableData = kycData?.map((item: any, index: number) => {
			return {
				serial: index + 1,

				// Suppression de la logique d'édition
				name: item.user.fullName,

				email: item.user.email,

				phone: item.user.phoneNumber,

				status:
					item.status === "COMPLETED" ? (
						<LabelWithBadge
							label="Completed"
							badgeColor="#18BC7A"
						/>
					) : item.status === "REJECTED" ? (
						<LabelWithBadge label="Refusé" badgeColor="#F85D4B" />
					) : item.status === "PENDING" ? (
						<LabelWithBadge label="En Attente" badgeColor="#999" />
					) : item.status === "IN_PROGRESS" ? (
						<LabelWithBadge label="En cours" badgeColor="#3498DB" />
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
				// filter
				threeButtons
				isLoading={inProgressKycQuery.isLoading && inProgressKycQuery.isFetching}
				// search={search}
				// setSearch={setSearch}
			/>
		</section>
	);
};

export default InProgressKYC;
