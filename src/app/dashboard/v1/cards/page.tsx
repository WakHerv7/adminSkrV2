"use client";

// import Category, { ICategory } from "@/components/cards/Category";
import Layout from "@/components/shared/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CardList from "./components/Tabs/CardList";
import CardPayments from "./components/Tabs/CardPayments";
import CardPurchases from "./components/Tabs/CardPurchases";
import CardTransactions from "./components/Tabs/CardTransactions";
// import {
//     headerTransactionData as headerData, tableTransactionData as tableData,
//     trxData as data, pieData, pieData2, doughnutData } from "@/constants/Index";

import { CardService } from "@/api/services/card";
import { TransactionService } from "@/api/services/transaction";
import { TDataList } from "@/components/cards/InfoCard";
import InfoCardGrid from "@/components/cards/InfoCardGrid";
import {
	cardDepositIconToday,
	cardDepositIconTotal,
	cardWithdrawalIconToday,
	cardWithdrawalIconTotal,
	closeCircleIcon,
	haltCircleIconGray,
	paymentIconToday,
	paymentIconTotal,
} from "@/constants/icons";
import { checkCircleIcon } from "@/constants/Index";
import { useTitle } from "@/hooks/useTitle";
import {
	setCardList,
	setCardPayments,
	setCardPurchases,
	setCardTransactions,
} from "@/redux/slices/card";
import { selectSearchConcern, selectSearchTerm } from "@/redux/slices/search";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

let infoData: TDataList[] = [
	[
		[
			{
				label: {
					text: "Solde cartes",
					tooltip: "Solde cartes",
					fw: "bold",
					color: "#444",
				},
				value: { text: "9 850 675 XAF", fw: "bold", color: "#444" },
			},
		],
		[
			{
				label: {
					text: checkCircleIcon,
					tooltip: "Actives",
					fw: "",
					color: "#444",
					fs: "11px",
				},
				value: {
					text: "1399",
					fw: "bold",
					color: "#18BC7A",
					fs: "14px",
					tooltip: "Actives",
				},
			},
			{
				label: {
					text: haltCircleIconGray,
					tooltip: "Bloquées",
					fw: "",
					color: "#444",
					fs: "11px",
				},
				value: {
					text: "577",
					fw: "bold",
					color: "#888",
					fs: "14px",
					tooltip: "Bloquées",
				},
			},
			{
				label: {
					text: closeCircleIcon,
					tooltip: "Désactivées",
					fw: "",
					color: "#444",
					fs: "11px",
				},
				value: {
					text: "780",
					fw: "bold",
					color: "#F85D4B",
					fs: "14px",
					tooltip: "Désactivées",
				},
			},
		],
	],
	[
		[
			{
				label: {
					text: cardDepositIconToday,
					tooltip: "Recharges cartes aujourd'hui",
					fw: "bold",
					color: "#444",
				},
				value: { text: "158 450 XAF", fw: "bold", color: "#444" },
			},
		],
		[
			{
				label: {
					text: cardDepositIconTotal,
					tooltip: "Total Recharges cartes",
					color: "#444",
				},
				value: {
					text: "21 855 950 XAF",
					fw: "bold",
					color: "#444",
				},
			},
		],
	],
	[
		[
			{
				label: {
					text: cardWithdrawalIconToday,
					tooltip: "Retraits cartes aujourd'hui",
					fw: "bold",
					color: "#444",
				},
				value: { text: "235 300 XAF", fw: "bold", color: "#444" },
			},
		],
		[
			{
				label: {
					text: cardWithdrawalIconTotal,
					tooltip: "Total Retraits cartes",
					color: "#444",
				},
				value: {
					text: "35 235 300 XAF",
					fw: "bold",
					color: "#444",
				},
			},
		],
	],
	[
		[
			{
				label: {
					text: paymentIconToday,
					tooltip: "Paiements aujourd'hui",
					fw: "bold",
					color: "#444",
				},
				value: { text: "2 558 450 XAF", fw: "bold", color: "#444" },
			},
		],
		[
			{
				label: {
					text: paymentIconTotal,
					tooltip: "Total Paiements",
					fw: "",
					color: "#444",
				},
				value: { text: "15 855 950 XAF", fw: "bold", color: "#444" },
			},
		],
	],
];

infoData[0][0][0].value.text = 0 + "  XAF";
infoData[0][1][0].value.text = 0;
infoData[0][1][1].value.text = 0;
infoData[0][1][2].value.text = 0;
infoData[1][0][0].value.text = 0 + "  XAF";
infoData[1][1][0].value.text = 0 + "  XAF";
infoData[2][0][0].value.text = 0 + "  XAF";
infoData[2][1][0].value.text = 0 + "  XAF";
infoData[3][0][0].value.text = 0 + "  XAF";
infoData[3][1][0].value.text = 0 + "  XAF";

const getAllCards = async ({ queryKey }: any) => {
	const [_key, st] = queryKey;
	let params: any = {};
	if (st) params.searchTerm = st;
	// console.log("getCustomers searchTerm : ", st, queryKey);
	const response = await CardService.get_all_cards(params);
	const responseJson = await response.json();
	if (!response.ok) {
		throw new Error(responseJson.message || "Failed to get users");
	}
	console.log("responseJson.data : ", responseJson.data);

	return responseJson.data;
};
const getCardsStats = async () => {
	const response = await CardService.get_cards_stats();
	const responseJson = await response.json();
	if (!response.ok) {
		throw new Error(
			responseJson.message || "Failed to get users statistics"
		);
	}
	return responseJson.data;
};

const getTransactions = async ({ queryKey }: any) => {
	const [_key, category, type, st] = queryKey;
	let params: any = { category, type };
	if (st) params.searchTerm = st;
	// console.log("getTransactions searchTerm : ", st, queryKey);
	const response = await TransactionService.get_all_transactions(params);
	const responseJson = await response.json();
	if (!response.ok) {
		throw new Error(responseJson.message || "Failed to get tranfers");
	}
	console.log("responseJson.data : ", responseJson.data);
	return responseJson.data;
};

export default function Cards() {
	useTitle("Sekure | Cartes", true);
	const dispatch = useDispatch();
	const searchTerm: string = useSelector(selectSearchTerm);
	const searchConcern: string = useSelector(selectSearchConcern);
	const [searchCardList, setSearchCardList] = useState("");
	const [searchCardTransactions, setSearchCardTransactions] = useState("");
	const [searchCardPurchases, setSearchCardPurchases] = useState("");
	const [searchCardPayments, setSearchCardPayments] = useState("");

	const allCardsStatsQueryRes = useQuery({
		queryKey: ["allCardsStats"],
		queryFn: getCardsStats,
		onError: (err) => {
			toast.error("Failed to get cards stats.");
		},
		refetchInterval: 30000, // Fetches data every 30 seconds
	});
	const allCardsQueryRes = useQuery({
		queryKey: ["allCards", searchCardList],
		queryFn: getAllCards,
		onError: (err) => {
			toast.error("Failed to get cards.");
		},
		// enabled: false,
		refetchInterval: 30000, // Fetches data every 45 seconds
	});
	dispatch(setCardList(allCardsQueryRes.data));
	const allTrxCardQueryRes = useQuery({
		queryKey: ["allTrxCards", "carte", "", searchCardTransactions],
		queryFn: getTransactions,
		onError: (err) => {
			toast.error("Failed to get tranfers.");
		},
		// enabled: false,
		refetchInterval: 30000, // Fetches data every 45 seconds
	});
	dispatch(setCardTransactions(allTrxCardQueryRes.data));
	const allCardPurchasesQueryRes = useQuery({
		queryKey: ["allTrxCards", "carte", "achat", searchCardPurchases],
		queryFn: getTransactions,
		onError: (err) => {
			toast.error("Failed to get tranfers.");
		},
		// enabled: false,
		refetchInterval: 30000, // Fetches data every 45 seconds
	});
	dispatch(setCardPurchases(allCardPurchasesQueryRes.data));
	const allCardPaymentsQueryRes = useQuery({
		queryKey: ["allTrxCards", "carte", "authorization", searchCardPayments],
		queryFn: getTransactions,
		onError: (err) => {
			toast.error("Failed to get tranfers.");
		},
		// enabled: false,
		refetchInterval: 30000, // Fetches data every 45 seconds
	});
	dispatch(setCardPayments(allCardPaymentsQueryRes.data));

	if (allCardsStatsQueryRes?.data) {
		infoData[0][0][0].value.text =
			(allCardsStatsQueryRes?.data?.totalAmount?.[0]?.totalAmount?.toLocaleString(
				"fr-FR"
			) ?? 0) + "  XAF";
		infoData[0][1][0].value.text =
			allCardsStatsQueryRes?.data?.statuses?.[
				"ACTIVE"
			]?.count?.toLocaleString("fr-FR") ?? 0;
		infoData[0][1][1].value.text =
			allCardsStatsQueryRes?.data?.statuses?.[
				"FREEZE"
			]?.count?.toLocaleString("fr-FR") ?? 0;
		infoData[0][1][2].value.text =
			allCardsStatsQueryRes?.data?.statuses?.[
				"DISABLED"
			]?.count?.toLocaleString("fr-FR") ?? 0;
		infoData[1][0][0].value.text =
			(allCardsStatsQueryRes?.data?.recharge_carte?.todayTotal?.[0]?.todayTotalAmount?.toLocaleString(
				"fr-FR"
			) ?? 0) + "  XAF";
		infoData[1][1][0].value.text =
			(allCardsStatsQueryRes?.data?.recharge_carte?.avgTotal?.[0]?.totalAmount?.toLocaleString(
				"fr-FR"
			) ?? 0) + "  XAF";
		infoData[2][0][0].value.text =
			(allCardsStatsQueryRes?.data?.retrait_carte?.todayTotal?.[0]?.todayTotalAmount?.toLocaleString(
				"fr-FR"
			) ?? 0) + "  XAF";
		infoData[2][1][0].value.text =
			(allCardsStatsQueryRes?.data?.retrait_carte?.avgTotal?.[0]?.totalAmount?.toLocaleString(
				"fr-FR"
			) ?? 0) + "  XAF";
		infoData[3][0][0].value.text =
			(allCardsStatsQueryRes?.data?.payments?.todayTotal?.[0]?.todayTotalAmount?.toLocaleString(
				"fr-FR"
			) ?? 0) + "  XAF";
		infoData[3][1][0].value.text =
			(allCardsStatsQueryRes?.data?.payments?.avgTotal?.[0]?.totalAmount?.toLocaleString(
				"fr-FR"
			) ?? 0) + "  XAF";
	}

	return (
		<Layout title="Cartes">
			<section className="w-full">
				{allCardsStatsQueryRes?.status === "loading" ? (
					<div className="flex justify-center w-full py-10">
						<div className={"loadingSpinner"}></div>
					</div>
				) : (
					<InfoCardGrid infoData={infoData} />
				)}
			</section>

			<section>
				<div className="grid grid-cols-2 gap-x-10 w-full mt-6">
					<div className="flex flex-col gap-2 overflow-hidden"></div>

					<div className="flex flex-col gap-2 overflow-hidden"></div>
				</div>
			</section>

			<section className="my-10">
				<Tabs defaultValue="01" className="w-full">
					<div className="border-b-1">
						<TabsList className="TabsList">
							<TabsTrigger className="TabsTrigger" value="01">
								Liste des cartes
							</TabsTrigger>
							<TabsTrigger className="TabsTrigger" value="02">
								Transactions de cartes
							</TabsTrigger>
							<TabsTrigger className="TabsTrigger" value="03">
								Achats de cartes
							</TabsTrigger>
							<TabsTrigger className="TabsTrigger" value="04">
								Paiements de cartes
							</TabsTrigger>
						</TabsList>
					</div>
					<div className={`mt-5`}>
						<TabsContent value="01">
							<CardList
								isLoading={allCardsQueryRes.status == "loading"}
								search={searchCardList}
								setSearch={setSearchCardList}
							/>
						</TabsContent>
						<TabsContent value="02">
							<CardTransactions
								isLoading={
									allTrxCardQueryRes.status == "loading"
								}
								search={searchCardTransactions}
								setSearch={setSearchCardTransactions}
							/>
						</TabsContent>
						<TabsContent value="03">
							<CardPurchases
								isLoading={
									allCardPurchasesQueryRes.status == "loading"
								}
								search={searchCardPurchases}
								setSearch={setSearchCardPurchases}
							/>
						</TabsContent>
						<TabsContent value="04">
							<CardPayments
								isLoading={
									allCardPaymentsQueryRes.status == "loading"
								}
								search={searchCardPayments}
								setSearch={setSearchCardPayments}
							/>
						</TabsContent>
					</div>
				</Tabs>
			</section>
		</Layout>
	);
}
