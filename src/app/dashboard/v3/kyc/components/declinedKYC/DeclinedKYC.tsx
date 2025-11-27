import { UserManagementServiceV3 } from "@/api/services/v3/userManagement";
import React from "react";
import { useQuery } from "react-query";

const handleGetUsers = async ({ queryKey }: any) => {
	const [_key, kycStatus] = queryKey;

	const response = await UserManagementServiceV3.getUsers({
		kycStatus: kycStatus,
	});

	const responseJson = await response.json();

	if (!response.ok) {
		throw new Error(
			responseJson.message ||
				"Erreur lors de la récupération des utilisateurs"
		);
	}

	return responseJson.data;
};

const DeclinedKYC = () => {
	const pendingKyc = useQuery({
		queryKey: ["delinedKyc", "Declined"],
		queryFn: handleGetUsers,
		onError: (err: any) => {
			console.error("Pending Kyc onError", err.message);
		},
	});
	return <div>DeclinedKYC</div>;
};

export default DeclinedKYC;
