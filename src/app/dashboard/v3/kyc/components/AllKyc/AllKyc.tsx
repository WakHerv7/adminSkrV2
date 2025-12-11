import { KYCServiceV3 } from "@/api/services/v3/kyc";
import CButton from "@/components/shared/CButton";
import CustomTable from "@/components/shared/CustomTable";
import { FourDots } from "@/components/shared/icons";
import LabelWithBadge from "@/components/shared/LabelWithBadge";
import URLConfigV3 from "@/config/urls_v3";
import { headerKYCDataV3 } from "@/constants/v3/KYCDataV3";
import { getFormattedDateTime } from "@/utils/DateFormat";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { QueryFunctionContext, useQuery } from "react-query";

const handleGetKycs = async (
	context: QueryFunctionContext<[string, any]>
) => {
	const [_key, params] = context.queryKey;

	const response = await KYCServiceV3.getkycs(params);
	const responseJson = await response.json();

	if (!response.ok) {
		throw new Error(responseJson.message || "Failed to get Kycs");
	}

	return responseJson;
};

const AllKyc = () => {
	const [filterContent, setFilterContent] = useState<any>({});
	const [search, setSearch] = useState<string>("");

	// Construire les paramètres de requête avec les filtres
	const queryParams = {
		...filterContent,
	};

	const allKycQuery = useQuery({
		queryKey: ["all-kyc", queryParams],
		queryFn: handleGetKycs,
		onError: (err: any) => {
			toast.error(err.message);
		},
	});

	// --------------------------------
	//  Remplissage tableau
	// --------------------------------
	// Handle both paginated response (data.data.data) and direct array (data.data)
	const kycData = Array.isArray(allKycQuery.data?.data)
		? allKycQuery.data?.data
		: allKycQuery.data?.data?.data || [];

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
				filter
				filterType="kycV3"
				filterContent={filterContent}
				setFilterContent={setFilterContent}
				threeButtons
				isLoading={allKycQuery.isLoading && allKycQuery.isFetching}
				search={search}
				setSearch={setSearch}
			/>
		</section>
	);
};

export default AllKyc;
