import { KYCServiceV3 } from "@/api/services/v3/kyc";
import { UserManagementServiceV3 } from "@/api/services/v3/userManagement";
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

const DeclinedKYC = () => {
	const declinedKycQuery = useQuery({
		queryKey: ["declined-kyc", "REJECTED"],
		queryFn: handleGetKycs,
		onError: (err: any) => {
			toast.error(err.message);
		},
	});

	// --------------------------------
	//  Remplissage tableau
	// --------------------------------
	const rearrangedTableData = declinedKycQuery.data?.data?.map(
		(item: any, index: number) => {
			return {
				serial: index + 1,

				// Suppression de la logique d'édition
				name: item.user.fullName,

				email: item.user.email,

				phone: item.user.phoneNumber,

				status:
					item.status === "Approved" ? (
						<LabelWithBadge label="Approuvé" badgeColor="#18BC7A" />
					) : item.status === "REJECTED" ? (
						<LabelWithBadge label="Refusé" badgeColor="#F85D4B" />
					) : item.status === "PENDDING" ? (
						<LabelWithBadge label="En Attente" badgeColor="#999" />
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
				isLoading={
					declinedKycQuery.isLoading && declinedKycQuery.isFetching
				}
			/>
		</section>
	);
};

export default DeclinedKYC;
