"use client";

import Layout from "@/components/shared/Layout";
// import TabsComponent from "@/components/shared/TabsComponent";
import { CustomerService } from "@/api/services/v2/customer";
import { useTitle } from "@/hooks/useTitle";
import { usePathname, useRouter } from "next/navigation";
import { FaYenSign } from "react-icons/fa";
import { FaCreditCard, FaNairaSign } from "react-icons/fa6";
import {
	RiBankCard2Fill,
	RiBankCardFill,
	RiBankCardLine,
} from "react-icons/ri";
import { IoWallet, IoWalletOutline } from "react-icons/io5";

const getAllKYC = async ({ queryKey }: any) => {
	const [_key, filter, st] = queryKey;
	let params: any = {};
	if (st) params.searchTerm = st;
	if (filter?.kyc_result) params.kyc_result = filter?.kyc_result;
	if (filter?.kyc_status) params.kyc_status = filter?.kyc_status;

	const response = await CustomerService.get_all_customers(params);
	const responseJson = await response.json();
	if (!response.ok) {
		throw new Error(responseJson.message || "Failed to get users");
	}

	return responseJson.data;
};
const getKYCStats = async () => {
	const response = await CustomerService.get_kyc_stats();
	const responseJson = await response.json();
	if (!response.ok) {
		throw new Error(
			responseJson.message || "Failed to get users statistics"
		);
	}
	// console.log("getKYCStats.data : ", responseJson.data);
	return responseJson.data;
};

export default function KYC() {
	useTitle("Sekure | ChinPay", true);
	const pathname = usePathname();
	const router = useRouter();

	const paymentServices: any = [
		{
			title: "Prélevements frais de paiement par carte",
			slug: "card-payment_fee",
			icon: <RiBankCard2Fill size={35} color="#18BC7A" />,
		},
		{
			title: "Prélevements dans la CARTE des frais de paiement ECHOUÉS",
			slug: "card-payment_fee_failed",
			icon: <RiBankCardLine size={35} color="#18BC7A" />,
		},
		{
			title: "Prélevements dans la CARTE des frais de paiement REUSSIS",
			slug: "card-payment_fee_success",
			icon: <RiBankCardFill size={35} color="#18BC7A" />,
		},
		{
			title: "Prélevements dans le WALLET des frais de paiement ECHOUÉS",
			slug: "wallet-payment_fee_failed",
			icon: <IoWalletOutline size={35} color="#18BC7A" />,
		},
		{
			title: "Prélevements dans le WALLET des frais de paiement REUSSIS",
			slug: "wallet-payment_fee_success",
			icon: <IoWallet size={35} color="#18BC7A" />,
		},
	];

	const handlePaymentServiceSelect = (payservice: any) => {
		router.push(`${pathname}/${payservice.slug}`);
	};

	return (
		<Layout title={"Gains"}>
			<>
				<section className="px-2">
					<div className="pl-[30px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10">
						{paymentServices.map((paymentService: any) => {
							return (
								<div
									key={paymentService.slug}
									onClick={() =>
										handlePaymentServiceSelect(
											paymentService
										)
									}
									className="flex flex-col justify-center items-center gap-3 w-[200px] cursor-pointer rounded-xl p-[10px] hover:bg-gray-100"
								>
									<div className="img-container bg-white border rounded-lg h-[120px] w-[120px] overflow-hidden flex justify-center items-center">
										{paymentService.icon}
									</div>
									<div className="text-md text-center w-full">
										{paymentService.title}
									</div>
								</div>
							);
						})}
					</div>
				</section>
			</>
		</Layout>
	);
}
