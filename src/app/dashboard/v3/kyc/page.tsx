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
import ApprovedKyc from "./components/approvedKyc/ApprovedKyc";
import AllKyc from "./components/AllKyc/AllKyc";

const Kyc = () => {
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
								value="approved"
							>
								KYC approuvés
							</TabsTrigger>
							<TabsTrigger
								className="TabsTrigger border-b-1 md:border-b-0"
								value="declined"
							>
								KYC Rejetés
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
						<TabsContent value="pending">
							<KycPendingV3 />
						</TabsContent>
						<TabsContent value="approved">
							<ApprovedKyc />
						</TabsContent>
						<TabsContent value="declined">
							<DeclinedKYC />
						</TabsContent>

						<TabsContent value="all">
							<AllKyc />
						</TabsContent>
					</div>
				</Tabs>
			</section>
		</Layout>
	);
};

export default Kyc;
