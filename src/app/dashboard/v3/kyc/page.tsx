"use client";

import { UserManagementServiceV3 } from "@/api/services/v3/userManagement";
import Layout from "@/components/shared/Layout";
import React from "react";
import { useQuery } from "react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import KycPendingV3 from "./components/KYCPending";
import { useDispatch } from "react-redux";
import { setKYCDeclined, setKYCPending } from "@/redux/slices_v2/kyc";
import { setKYCAccepted } from "@/redux/slices/kyc";
import { KYCServiceV3 } from "@/api/services/v3/kyc";
import DeclinedKYC from "./components/declinedKYC/DeclinedKYC";

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

const Kyc = () => {
	const dispatch = useDispatch();

	const pendingKyc = useQuery({
		queryKey: ["pendingKyc"],
		queryFn: handleGetUsers,
		onError: (err: any) => {
			console.error("Pending Kyc onError", err.message);
		},
	});
	dispatch(setKYCPending(pendingKyc.data?.data));

	const allKyc = useQuery({
		queryKey: ["allKYC"],
		queryFn: handleGetUsers,
		onError: (err: any) => {
			console.error("KYC onError : ", err.message);
		},
	});
	// dispatch(setKYC)

	return (
		<Layout title="Validation KYC v3">
			<section>
				<Tabs defaultValue="pending">
					<div className="border-b-0 md:border-b-1">
						<TabsList className="TabsList grid grid-cols-2 md:flex mb-[200px] md:mb-0">
							<TabsTrigger
								className="TabsTrigger border-b-1 md:border-b-0"
								value="pending"
							>
								KYC en cours
							</TabsTrigger>
							<TabsTrigger
								className="TabsTrigger border-b-1 md:border-b-0"
								value="accepted"
							>
								KYC approuvés
							</TabsTrigger>
							<TabsTrigger
								className="TabsTrigger border-b-1 md:border-b-0"
								value="declined"
							>
								<DeclinedKYC />
							</TabsTrigger>
							<TabsTrigger
								className="TabsTrigger border-b-1 md:border-b-0"
								value="none"
							>
								Pas de KYC
							</TabsTrigger>
							<TabsTrigger
								className="TabsTrigger border-b-1 md:border-b-0"
								value="all"
							>
								Tous les KYC
							</TabsTrigger>
						</TabsList>
					</div>
					<div className={`mt-5`}>
						<TabsContent value="all">
							<p>All KYC content</p>
						</TabsContent>
						<TabsContent value="pending">
							<KycPendingV3 isLoading={allKyc.isLoading} />
						</TabsContent>
					</div>
				</Tabs>
			</section>
		</Layout>
	);
};

export default Kyc;
