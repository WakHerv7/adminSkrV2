"use client";

import { useTitle } from "@/hooks/useTitle";
import Layout from "@/components/shared/Layout";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { transfertsSchema } from "@/validation/FormValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CButton from "@/components/shared/CButton";
import { FourDots } from "@/components/shared/icons";
import Modal from "@/components/shared/Modal/Modal";
import RetraitBJModalForm from "./modals/RetraitBJModalForm";
import RetraitGAAfribapayModalForm from "./modals/RetraitGAAfribapayModalForm";
import RetraitGAIntouchModalForm from "./modals/RetraitGAIntouchModalForm";
import {
	selectCurrentGetSekureApiToken,
	selectCurrentToken,
} from "@/redux/slices/auth";
import { useSelector } from "react-redux";
import { TransactionService } from "@/api/services/transaction";
import { GabonService } from "@/api/services/gabon";
import { useQuery } from "react-query";
import toast from "react-hot-toast";
import { BeninService } from "@/api/services/benin";
import { CameroonService } from "@/api/services/cameroon";
import RetraitCMModalForm from "./modals/RetraitCMModalForm";
import { MidenService } from "@/api/services/v2/miden";
import { NairapayService } from "@/api/services/v2/nairapay";
import RetraitCDModalForm from "./modals/RetraitCDModalForm";
import { RdcService } from "@/api/services/rdc";
import { BurkinaService } from "@/api/services/burkina";
import RetraitBFModalForm from "./modals/RetraitBFModalForm";
import { FaEye, FaPlus } from "react-icons/fa";
import AddOperationModalForm from "./modals/AddOperationModalForm";
import GetOperationModalForm from "./modals/GetOperationModalForm";
import { getAvailableBalance } from "@/utils/utils";
import RetraitCMAfribapayModalForm from "./modals/RetraitCMAfribapayModalForm";

const getGabonBalanceIntouch = async ({ queryKey }: any) => {
	const [_key, token] = queryKey;
	if (token) {
		const response = await GabonService.get_gabon_balance_intouch({
			token,
		});
		const responseJson = await response.json();
		if (!response.ok) {
			throw new Error(
				responseJson.message || "Failed to get Gabon Balance"
			);
		}
		return responseJson.data;
	} else {
		return { data: { message: "No token provided" } };
	}
};
const getGabonBalanceAfribapay = async ({ queryKey }: any) => {
	const [_key, token] = queryKey;
	if (token) {
		const response = await GabonService.get_gabon_balance_afribapay({
			token,
		});
		const responseJson = await response.json();
		if (!response.ok) {
			throw new Error(
				responseJson.message || "Failed to get Gabon Balance"
			);
		}
		console.log("getGabonBalanceAfribapay ::: ", responseJson.data);

		return responseJson.data;
	} else {
		return { data: { message: "No token provided" } };
	}
};

const getBeninBalance = async ({ queryKey }: any) => {
	const [_key, token] = queryKey;
	if (token) {
		const response = await BeninService.get_benin_balance({ token });
		const responseJson = await response.json();
		if (!response.ok) {
			throw new Error(
				responseJson.message || "Failed to get Benin Balance"
			);
		}
		return responseJson.data;
	} else {
		return { data: { message: "No token provided" } };
	}
};

const getBurkinaBalance = async ({ queryKey }: any) => {
	const [_key, token] = queryKey;
	if (token) {
		const response = await BurkinaService.get_burkina_balance({ token });
		const responseJson = await response.json();
		if (!response.ok) {
			throw new Error(
				responseJson.message || "Failed to get Burkina Balance"
			);
		}
		return responseJson.data;
	} else {
		return { data: { message: "No token provided" } };
	}
};

const getRDCBalance = async ({ queryKey }: any) => {
	const [_key, token] = queryKey;
	if (token) {
		const response = await RdcService.get_rdc_balance({ token });
		const responseJson = await response.json();
		if (!response.ok) {
			throw new Error(
				responseJson.message || "Failed to get RDC Balance"
			);
		}
		return responseJson.data;
	} else {
		return { data: { message: "No token provided" } };
	}
};

const getCameroonCampayBalance = async ({ queryKey }: any) => {
	const [_key, token] = queryKey;
	if (token) {
		const response = await CameroonService.get_cameroon_campay_balance({
			token,
		});
		const responseJson = await response.json();
		if (!response.ok) {
			throw new Error(
				responseJson.message || "Failed to get Cameroon Campay Balance"
			);
		}
		return responseJson.data;
	} else {
		return { data: { message: "No token provided" } };
	}
};

const getCameroonPawapayBalance = async ({ queryKey }: any) => {
	const [_key, token] = queryKey;
	if (token) {
		const response = await CameroonService.get_cameroon_pawapay_balance({
			token,
		});
		const responseJson = await response.json();
		if (!response.ok) {
			throw new Error(
				responseJson.message || "Failed to get Cameroon Pawapay Balance"
			);
		}
		return responseJson.data;
	} else {
		return { data: { message: "No token provided" } };
	}
};

const getMidenBalance = async ({ queryKey }: any) => {
	const [_key, token] = queryKey;
	if (token) {
		const response = await MidenService.get_miden_balance();
		const responseJson = await response.json();
		if (!response.ok) {
			throw new Error(
				responseJson.message || "Failed to get Midenss Balance"
			);
		}
		return responseJson.data;
	} else {
		return { data: { message: "No token provided" } };
	}
};

const getNairapayMapleradBalance = async ({ queryKey }: any) => {
	const [_key, token] = queryKey;
	if (token) {
		const response = await NairapayService.get_nairapay_maplerad_balance();
		const responseJson = await response.json();
		if (!response.ok) {
			throw new Error(
				responseJson.message || "Failed to get NairapayMaplerad Balance"
			);
		}
		return responseJson.data;
	} else {
		return { data: { message: "No token provided" } };
	}
};

export default function RetraitGBPage() {
	const getSekureApiToken = useSelector(selectCurrentGetSekureApiToken);

	// const gabonBalanceIntouchQueryRes = useQuery({
	// 	queryKey: ["gabonIntouch", getSekureApiToken],
	// 	queryFn: getGabonBalanceIntouch,
	// 	onError: (err) => {
	// 		toast.error("Failed to get Gabon balance.");
	// 	},
	// 	// enabled: false,
	// 	refetchInterval: 60000, // Fetches data every 60 seconds
	// });
	const gabonBalanceAfribapayQueryRes = useQuery({
		queryKey: ["gabonAfribapay", getSekureApiToken],
		queryFn: getGabonBalanceAfribapay,
		onError: (err) => {
			toast.error("Failed to get Gabon balance.");
		},
		// enabled: false,
		refetchInterval: 60000, // Fetches data every 60 seconds
	});

	// const beninBalanceQueryRes = useQuery({
	// 	queryKey: ["benin", getSekureApiToken],
	// 	queryFn: getBeninBalance,
	// 	onError: (err) => {
	// 		toast.error("Failed to get Benin balance.");
	// 	},
	// 	// enabled: false,
	// 	refetchInterval: 60000, // Fetches data every 60 seconds
	// });
	const burkinaBalanceQueryRes = useQuery({
		queryKey: ["burkina", getSekureApiToken],
		queryFn: getBurkinaBalance,
		onError: (err) => {
			toast.error("Failed to get Burkina balance.");
		},
		// enabled: false,
		refetchInterval: 60000, // Fetches data every 60 seconds
	});

	const rdcBalanceQueryRes = useQuery({
		queryKey: ["rdc", getSekureApiToken],
		queryFn: getRDCBalance,
		onError: (err) => {
			toast.error("Failed to get RDC balance.");
		},
		// enabled: false,
		refetchInterval: 60000, // Fetches data every 60 seconds
	});

	const cameroonCampayBalanceQueryRes = useQuery({
		queryKey: ["cameroon", getSekureApiToken],
		queryFn: getCameroonCampayBalance,
		onError: (err) => {
			toast.error("Failed to get Cameroon Campay balance.");
		},
		// enabled: false,
		refetchInterval: 60000, // Fetches data every 60 seconds
	});

	// const cameroonPawapayBalanceQueryRes = useQuery({
	// 	queryKey: ["cameroon", getSekureApiToken],
	// 	queryFn: getCameroonPawapayBalance,
	// 	onError: (err) => {
	// 		toast.error("Failed to get Cameroon Pawapay balance.");
	// 	},
	// 	// enabled: false,
	// 	refetchInterval: 60000, // Fetches data every 60 seconds
	// });

	// const MidenBalanceQueryRes = useQuery({
	// 	queryKey: ["miden", getSekureApiToken],
	// 	queryFn: getMidenBalance,
	// 	onError: (err) => {
	// 		toast.error("Failed to get Miden balance.");
	// 	},
	// 	// enabled: false,
	// 	refetchInterval: 60000, // Fetches data every 60 seconds
	// });

	const NairapayMapleradBalanceQueryRes = useQuery({
		queryKey: ["NairapayMaplerad", getSekureApiToken],
		queryFn: getNairapayMapleradBalance,
		onError: (err) => {
			toast.error("Failed to get NairapayMaplerad balance.");
		},
		// enabled: false,
		refetchInterval: 60000, // Fetches data every 60 seconds
	});

	console.log(
		"gabonBalanceAfribapayQueryRes.data : ",
		gabonBalanceAfribapayQueryRes.data
	);
	// console.log(
	// 	"gabonBalanceIntouchQueryRes.data : ",
	// 	gabonBalanceIntouchQueryRes.data
	// );

	// console.log("beninBalanceQueryRes.data : ", beninBalanceQueryRes.data);
	// console.log(
	// 	"cameroonCampayBalanceQueryRes.data : ",
	// 	cameroonCampayBalanceQueryRes.data
	// );
	// console.log(
	// 	"cameroonPawapayBalanceQueryRes.data : ",
	// 	cameroonPawapayBalanceQueryRes.data
	// );
	// console.log("MidenBalanceQueryRes.data : ", MidenBalanceQueryRes.data);
	console.log(
		"NairapayMapleradBalanceQueryRes.data : ",
		NairapayMapleradBalanceQueryRes.data
	);

	useTitle("Sekure | Accueil", true);
	return (
		<Layout title="Balances">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-[50px] gap-[100px]">
				<div className="flex flex-col justify-center items-center">
					<div className="text-xl font-bold mb-3">{`Solde Cameroun Campay (XAF)`}</div>
					<div
						className={`h-10  mb-3 min-w-[300px] text-xl font-bold text-[#18BC7A] border-none bg-gray-100 rounded-md outline-none px-3
          flex justify-center items-center`}
					>
						{Number(
							cameroonCampayBalanceQueryRes?.data
								?.total_balance || 0
						).toLocaleString("fr-FR") ?? 0}
					</div>
					<div className="flex flex-wrap items-center gap-4 mt-3">
						<CButton
							text={""}
							btnStyle={"lightGreen"}
							icon={<FaPlus />}
							href="?addOperationCMCampay=true"
						/>
						<CButton
							text={""}
							btnStyle={"lightGreen"}
							icon={<FaEye />}
							href="?getOperationCMCampay=true"
						/>
					</div>
				</div>
				<Modal
					name={"addOperationCMCampay"}
					modalContent={
						<AddOperationModalForm
							action={"withdrawal"}
							country={"CM"}
							provider={"campay"}
						/>
					}
				/>
				<Modal
					name={"getOperationCMCampay"}
					modalContent={
						<GetOperationModalForm
							category={"wallet"}
							type={"topup"}
							country={"CM"}
							provider={"campay"}
							balance={Number(
								cameroonCampayBalanceQueryRes?.data
									?.total_balance || 0
							)}
						/>
					}
				/>
				<div className="flex flex-col justify-center items-center">
					<div className="text-xl font-bold mb-3">{`Solde Cameroun Afribapay (XAF)`}</div>
					<div
						className={`h-10  mb-3 min-w-[300px] text-xl font-bold text-[#18BC7A] border-none bg-gray-100 rounded-md outline-none px-3
          flex justify-center items-center`}
					>
						{(gabonBalanceAfribapayQueryRes?.data &&
							getAvailableBalance(
								gabonBalanceAfribapayQueryRes?.data,
								"CM",
								"payout"
							)) ||
							0}
					</div>
					<div className="flex flex-wrap justify-center items-center gap-4 mt-3">
						{/* <CButton
							text={""}
							btnStyle={"lightGreen"}
							icon={<FaPlus />}
							href="?addOperationGAIntouch=true"
						/>
						<CButton
							text={""}
							btnStyle={"lightGreen"}
							icon={<FaEye />}
							href="?getOperationGAIntouch=true"
						/> */}
						<CButton
							text={"Retirer"}
							btnStyle={"green"}
							icon={<FourDots />}
							href="?withdrawCMAfribapay=true"
						/>
					</div>
				</div>
				{/* <Modal
					name={"addOperationGAIntouch"}
					modalContent={
						<AddOperationModalForm
							action={"withdrawal"}
							country={"GA"}
							provider={"intouch"}
						/>
					}
				/>
				<Modal
					name={"getOperationGAIntouch"}
					modalContent={
						<GetOperationModalForm
							category={"wallet"}
							type={"topup"}
							country={"GA"}
							provider={"intouch"}
							balance={Number(
								(gabonBalanceAfribapayQueryRes?.data &&
									getAvailableBalance(
										gabonBalanceAfribapayQueryRes?.data,
										"GA",
										"payin"
									)) ||
									0
							)}
						/>
					}
				/> */}

				<div className="flex flex-col justify-center items-center">
					<div className="text-xl font-bold mb-3">{`Solde Gabon Afribapay (XAF)`}</div>
					<div
						className={`h-10  mb-3 min-w-[300px] text-xl font-bold text-[#18BC7A] border-none bg-gray-100 rounded-md outline-none px-3
          flex justify-center items-center`}
					>
						{(gabonBalanceAfribapayQueryRes?.data &&
							getAvailableBalance(
								gabonBalanceAfribapayQueryRes?.data,
								"GA",
								"payin"
							)) ||
							0}
					</div>
					<div className="flex flex-wrap justify-center items-center gap-4 mt-3">
						{/* <CButton
							text={""}
							btnStyle={"lightGreen"}
							icon={<FaPlus />}
							href="?addOperationGAIntouch=true"
						/>
						<CButton
							text={""}
							btnStyle={"lightGreen"}
							icon={<FaEye />}
							href="?getOperationGAIntouch=true"
						/> */}
						<CButton
							text={"Retirer"}
							btnStyle={"green"}
							icon={<FourDots />}
							href="?withdrawGBAfribapay=true"
						/>
					</div>
				</div>
				<Modal
					name={"addOperationGAIntouch"}
					modalContent={
						<AddOperationModalForm
							action={"withdrawal"}
							country={"GA"}
							provider={"intouch"}
						/>
					}
				/>
				<Modal
					name={"getOperationGAIntouch"}
					modalContent={
						<GetOperationModalForm
							category={"wallet"}
							type={"topup"}
							country={"GA"}
							provider={"intouch"}
							balance={Number(
								(gabonBalanceAfribapayQueryRes?.data &&
									getAvailableBalance(
										gabonBalanceAfribapayQueryRes?.data,
										"GA",
										"payin"
									)) ||
									0
							)}
						/>
					}
				/>

				<div className="flex flex-col justify-center items-center">
					<div className="text-xl font-bold mb-3">{`Solde Benin Afribapay (XOF)`}</div>
					<div
						className={`h-10  mb-3 min-w-[300px] text-xl font-bold text-[#18BC7A] border-none bg-gray-100 rounded-md outline-none px-3
          flex justify-center items-center`}
					>
						{(gabonBalanceAfribapayQueryRes?.data &&
							getAvailableBalance(
								gabonBalanceAfribapayQueryRes?.data,
								"BJ",
								"payin"
							)) ||
							0}
					</div>
					<div className="flex flex-wrap justify-center items-center gap-4 mt-3">
						{/* <CButton
							text={""}
							btnStyle={"lightGreen"}
							icon={<FaPlus />}
							href="?addOperationGAIntouch=true"
						/>
						<CButton
							text={""}
							btnStyle={"lightGreen"}
							icon={<FaEye />}
							href="?getOperationGAIntouch=true"
						/> */}
						{/* <CButton
							text={"Retirer"}
							btnStyle={"green"}
							icon={<FourDots />}
							href="?withdrawCMAfribapay=true"
						/> */}
					</div>
				</div>

				{/* <div className="flex flex-col justify-center items-center">
					<div className="text-xl font-bold mb-3">{`Solde Gabon Intouch (XAF)`}</div>
					<div
						className={`h-10  mb-3 min-w-[300px] text-xl font-bold text-[#18BC7A] border-none bg-gray-100 rounded-md outline-none px-3
          flex justify-center items-center`}
					>
						{gabonBalanceIntouchQueryRes?.data?.amount?.toLocaleString(
							"fr-FR"
						) ?? 0}
					</div>
					<div className="flex flex-wrap justify-center items-center gap-4 mt-3">
						<CButton
							text={"Retirer"}
							btnStyle={"green"}
							icon={<FourDots />}
							href="?withdrawGBIntouch=true"
						/>
					</div>
				</div>
				<Modal
					name={"addOperationGAIntouch"}
					modalContent={
						<AddOperationModalForm
							action={"withdrawal"}
							country={"GA"}
							provider={"intouch"}
						/>
					}
				/>
				<Modal
					name={"getOperationGAIntouch"}
					modalContent={
						<GetOperationModalForm
							category={"wallet"}
							type={"topup"}
							country={"GA"}
							provider={"intouch"}
							balance={Number(
								gabonBalanceIntouchQueryRes?.data?.amount || 0
							)}
						/>
					}
				/> */}

				<div className="flex flex-col justify-center items-center">
					<div className="text-xl font-bold mb-3">{`Solde Benin Maplerad (XOF)`}</div>
					<div
						className={`h-10  mb-3 min-w-[300px] text-xl font-bold text-[#18BC7A] border-none bg-gray-100 rounded-md outline-none px-3
          flex justify-center items-center`}
					>
						{NairapayMapleradBalanceQueryRes?.data?.xofWallet?.toLocaleString(
							"fr-FR"
						) ?? 0}
					</div>
					<div className="flex flex-wrap items-center gap-4 mt-3">
						<CButton
							text={""}
							btnStyle={"lightGreen"}
							icon={<FaPlus />}
							href="?addOperationBJMaplerad=true"
						/>
						<CButton
							text={""}
							btnStyle={"lightGreen"}
							icon={<FaEye />}
							href="?getOperationBJMaplerad=true"
						/>
					</div>
				</div>
				<Modal
					name={"addOperationBJMaplerad"}
					modalContent={
						<AddOperationModalForm
							action={"withdrawal"}
							country={"BJ"}
							provider={"maplerad"}
						/>
					}
				/>
				<Modal
					name={"getOperationBJMaplerad"}
					modalContent={
						<GetOperationModalForm
							category={"wallet"}
							type={"topup"}
							country={"BJ"}
							provider={"maplerad"}
							balance={Number(
								NairapayMapleradBalanceQueryRes?.data
									?.xofWallet || 0
							)}
						/>
					}
				/>

				{/* <div className="flex flex-col justify-center items-center">
					<div className="text-xl font-bold mb-3">{`Solde Benin Pawapay (XOF)`}</div>
					<div
						className={`h-10  mb-3 min-w-[300px] text-xl font-bold text-[#18BC7A] border-none bg-gray-100 rounded-md outline-none px-3
          flex justify-center items-center`}
					>
						{Number(
							beninBalanceQueryRes?.data?.balances?.[0]
								?.balance || 0
						).toLocaleString("fr-FR") ?? 0}
					</div>
					<div className="flex flex-wrap items-center gap-y-4 mt-3">
						<CButton
							text={"Retirer"}
							btnStyle={"green"}
							icon={<FourDots />}
							href="?withdrawBJ=true"
						/>
					</div>
				</div> */}

				<div className="flex flex-col justify-center items-center">
					<div className="text-xl font-bold mb-3">{`Solde Burkina Pawapay (XOF)`}</div>
					<div
						className={`h-10  mb-3 min-w-[300px] text-xl font-bold text-[#18BC7A] border-none bg-gray-100 rounded-md outline-none px-3
          flex justify-center items-center`}
					>
						{Number(
							burkinaBalanceQueryRes?.data?.balances?.[0]
								?.balance || 0
						).toLocaleString("fr-FR") ?? 0}
					</div>
					<div className="flex flex-wrap items-center gap-y-4 mt-3">
						<CButton
							text={"Retirer"}
							btnStyle={"green"}
							icon={<FourDots />}
							href="?withdrawBF=true"
						/>
					</div>
				</div>

				<div className="flex flex-col justify-center items-center">
					<div className="text-xl font-bold mb-3">{`Solde RDC Pawapay (CDF)`}</div>
					<div
						className={`h-10  mb-3 min-w-[300px] text-xl font-bold text-[#18BC7A] border-none bg-gray-100 rounded-md outline-none px-3
          flex justify-center items-center`}
					>
						{Number(
							rdcBalanceQueryRes?.data?.balances?.[0]?.balance ||
								0
						).toLocaleString("fr-FR") ?? 0}
					</div>
					<div className="flex flex-wrap items-center gap-y-4 mt-3">
						<CButton
							text={"Retirer"}
							btnStyle={"green"}
							icon={<FourDots />}
							href="?withdrawCD=true"
						/>
					</div>
				</div>

				<div className="flex flex-col justify-center items-center">
					<div className="text-xl font-bold mb-3">{`Solde RDC Pawapay (XAF)`}</div>
					<div
						className={`h-10  mb-3 min-w-[300px] text-xl font-bold text-[#18BC7A] border-none bg-gray-100 rounded-md outline-none px-3
          flex justify-center items-center`}
					>
						{(
							Number(
								rdcBalanceQueryRes?.data?.balances?.[0]
									?.balance || 0
							) / 5
						).toLocaleString("fr-FR") ?? 0}
					</div>
					{/* <div className="flex flex-wrap items-center gap-y-4 mt-3">
						<CButton
							text={"Retirer"}
							btnStyle={"green"}
							icon={<FourDots />}
							href="?withdrawCD=true"
						/>
					</div> */}
				</div>

				{/* <div className="flex flex-col justify-center items-center">
					<div className="text-xl font-bold mb-3">{`Solde Cameroun Pawapay (XAF)`}</div>
					<div
						className={`h-10  mb-3 min-w-[300px] text-xl font-bold text-[#18BC7A] border-none bg-gray-100 rounded-md outline-none px-3
          flex justify-center items-center`}
					>
						{Number(
							cameroonPawapayBalanceQueryRes?.data?.balances?.[0]
								?.balance || 0
						).toLocaleString("fr-FR") ?? 0}
					</div>
					<div className="flex flex-wrap items-center gap-y-4 mt-3">
						<CButton
							text={"Retirer"}
							btnStyle={"green"}
							icon={<FourDots />}
							href="?withdrawCM=true"
						/>
					</div>
				</div> */}

				{/* <div className="flex flex-col justify-center items-center">
					<div className="text-xl font-bold mb-3">{`Solde Miden (USD)`}</div>
					<div
						className={`h-10  mb-3 min-w-[300px] text-xl font-bold text-[#18BC7A] border-none bg-gray-100 rounded-md outline-none px-3
          flex justify-center items-center`}
					>
						{MidenBalanceQueryRes?.data?.toLocaleString("fr-FR") ??
							0}
					</div>
				</div> */}
				<div className="flex flex-col justify-center items-center">
					<div className="text-xl font-bold mb-3">{`Solde Nairapay Maplerad (Naira)`}</div>
					<div
						className={`h-10  mb-3 min-w-[300px] text-xl font-bold text-[#18BC7A] border-none bg-gray-100 rounded-md outline-none px-3
          flex justify-center items-center`}
					>
						{NairapayMapleradBalanceQueryRes?.data?.ngnWallet?.toLocaleString(
							"fr-FR"
						) ?? 0}
					</div>
				</div>
				<div className="flex flex-col justify-center items-center">
					<div className="text-xl font-bold mb-3">{`Solde Nairapay Maplerad (XAF)`}</div>
					<div
						className={`h-10  mb-3 min-w-[300px] text-xl font-bold text-[#18BC7A] border-none bg-gray-100 rounded-md outline-none px-3
          flex justify-center items-center`}
					>
						{(
							NairapayMapleradBalanceQueryRes?.data?.ngnWallet /
							1.86
						)?.toLocaleString("fr-FR") ?? 0}
					</div>
				</div>
			</div>

			{/* <Modal
				name={"withdrawGBIntouch"}
				modalContent={
					<RetraitGAIntouchModalForm
						amount={Number(
							gabonBalanceIntouchQueryRes?.data?.amount || 0
						)}
					/>
				}
			/> */}
			<Modal
				name={"withdrawGBAfribapay"}
				modalContent={
					<RetraitGAAfribapayModalForm
						amount={Number(
							(gabonBalanceAfribapayQueryRes?.data &&
								getAvailableBalance(
									gabonBalanceAfribapayQueryRes?.data,
									"GA",
									"payin"
								)) ||
								0
						)}
					/>
				}
			/>
			{/* <Modal
				name={"withdrawBJ"}
				modalContent={
					<RetraitBJModalForm
						amount={Number(
							beninBalanceQueryRes?.data?.balances?.[0]
								?.balance || 0
						)}
					/>
				}
			/> */}
			<Modal
				name={"withdrawBF"}
				modalContent={
					<RetraitBFModalForm
						amount={Number(
							burkinaBalanceQueryRes?.data?.balances?.[0]
								?.balance || 0
						)}
					/>
				}
			/>
			<Modal
				name={"withdrawCD"}
				modalContent={
					<RetraitCDModalForm
						amount={Number(
							rdcBalanceQueryRes?.data?.balances?.[0]?.balance ||
								0
						)}
					/>
				}
			/>
			{/* <Modal
				name={"withdrawCM"}
				modalContent={
					<RetraitCMModalForm
						amount={Number(
							cameroonPawapayBalanceQueryRes?.data?.balances?.[0]
								?.balance || 0
						)}
					/>
				}
			/> */}
			<Modal
				name={"withdrawCMAfribapay"}
				modalContent={
					<RetraitCMAfribapayModalForm
						amount={Number(
							(gabonBalanceAfribapayQueryRes?.data &&
								getAvailableBalance(
									gabonBalanceAfribapayQueryRes?.data,
									"CM",
									"payout"
								)) ||
								0
						)}
					/>
				}
			/>
		</Layout>
	);
}
