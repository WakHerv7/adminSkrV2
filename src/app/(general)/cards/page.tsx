"use client";

// import Category, { ICategory } from "@/components/cards/Category";
import CButton from "@/components/shared/CButton";
import DataCard from "@/components/cards/DataCard/DataCard";
import AreaChart from "@/components/charts/AreaChart";
import Doughnut from "@/components/charts/Doughnut";
import CustomDropdown from "@/components/shared/CustomDropdown";
import Layout from "@/components/shared/Layout";
import LegendItem from "@/components/shared/LegendItem";
import Title from "@/components/shared/Title";
import {
	doughnutData,
	gradientData1,
	gradientData2,
	gradientData3,
	pieData,
	pieDataFour,
	pieDataThree,
	pieDataTwo,
} from "@/constants/graphData";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
  } from "@/components/ui/tabs";
import  CardList from "./components/Tabs/CardList";
import  CardPayments from "./components/Tabs/CardPayments";
import  CardSales from "./components/Tabs/CardSales";
import  CardTransactions from "./components/Tabs/CardTransactions";
import { IoChatbubble } from "react-icons/io5";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { FourDots } from "@/components/shared/icons";
import { FaChevronRight } from "react-icons/fa";
import ChartLabelBox from "@/components/shared/ChartLabelBox";
import PieChart from "@/components/charts/pieChart/PieChart";
import CustomTable from "@/components/shared/CustomTable";
import {
	headerHomeUserAccountData as headerData,
	tableHomeUserAccountData as tableData,
} from "@/constants/Index";
import ActiveYesNo from "@/components/shared/ActiveYesNo";
// import {
//     headerTransactionData as headerData, tableTransactionData as tableData,
//     trxData as data, pieData, pieData2, doughnutData } from "@/constants/Index";

import {
	checkCircleIcon,
	ongoingCircleIcon,
	closeCircleIcon,
	transferIcon,
	calendarIcon,
	transferIconToday,
	transferIconAvg,
	transferIconTotal,
	mobileMoneyIcon,
	sekureIcon,
	transferIconMomoToday,
	transferIconMomoTotal,
	transferIconSekureToday,
	transferIconSekureTotal,
} from "@/constants/Index";
import InfoCard, { TDataList } from "@/components/cards/InfoCard";

const infoData: TDataList[] = [
	[
		[
			{
				label: {
					text: transferIconToday,
					tooltip: "Transferts aujourd'hui",
					fw: "bold",
					color: "#444",
				},
				value: { text: "1 558 450 XAF", fw: "bold", color: "#444" },
			},
		],
		[
			{
				label: {
					text: transferIconAvg,
					tooltip: "Moyenne transferts",
					color: "#444",
				},
				value: {
					text: "1 855 950 XAF / jour",
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
					text: transferIconTotal,
					tooltip: "Total transferts",
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
					tooltip: "Réussis",
					fw: "",
					color: "#444",
					fs: "11px",
				},
				value: {
					text: "1399",
					fw: "bold",
					color: "#18BC7A",
					fs: "14px",
					tooltip: "Réussis",
				},
			},
			{
				label: {
					text: ongoingCircleIcon,
					tooltip: "En cours",
					fw: "",
					color: "#444",
					fs: "11px",
				},
				value: {
					text: "577",
					fw: "bold",
					color: "#888",
					fs: "14px",
					tooltip: "En cours",
				},
			},
			{
				label: {
					text: closeCircleIcon,
					tooltip: "Bloqués",
					fw: "",
					color: "#444",
					fs: "11px",
				},
				value: {
					text: "780",
					fw: "bold",
					color: "#F85D4B",
					fs: "14px",
					tooltip: "Bloqués",
				},
			},
		],
	],
	[
		[
			{
				label: {
					text: transferIconMomoToday,
					tooltip: "Transferts vers Mobile money aujourd'hui",
					fw: "bold",
					color: "#444",
				},
				value: { text: "2 558 450 XAF", fw: "bold", color: "#444" },
			},
		],
		[
			{
				label: {
					text: transferIconMomoTotal,
					tooltip: "Total transferts vers Mobile money",
					color: "#444",
				},
				value: { text: "15 855 950 XAF", fw: "bold", color: "#444" },
			},
		],
	],
	[
		[
			{
				label: {
					text: transferIconSekureToday,
					tooltip: "Transferts vers Sekure aujourd'hui",
					fw: "bold",
					color: "#444",
				},
				value: { text: "2 558 450 XAF", fw: "bold", color: "#444" },
			},
		],
		[
			{
				label: {
					text: transferIconSekureTotal,
					tooltip: "Total transferts vers Sekure",
					fw: "",
					color: "#444",
				},
				value: { text: "15 855 950 XAF", fw: "bold", color: "#444" },
			},
		],
	],
];

export default function Home() {
	const rearrangedTableData = tableData.map((item, index) => {
		const rearrangedItem = {
			index: index + 1,
			name: item.name,
			country: item.country,
			phone: item.phone,
			email: item.email,
			soldeCompte: item.solde,
			nbCartes: (index % 3) + 1,
			soldeCarte: item.solde,
			totalTrx: item.totalTrx,
			avgTrx: item.avgTrx,
			status: <ActiveYesNo isActive={item.status} />,
			date: item.date,
			// actions: <>
			// <div className='flex gap-5'>
			//       <CButton
			//   text={'Manager'}
			//   href={`users_accounts/manage/${index+1}`}
			//   btnStyle={'dark'}
			//   icon={<FourDots />}
			//   />
			//         {item.locked ?
			//         <CButton
			//   text={'Debloquer'}
			//   btnStyle={'lightYellow'}
			//   icon={<FaLock />}
			//   />
			//         :
			//         <CButton
			//   text={'Bloquer'}
			//   btnStyle={'yellow'}
			//   icon={<FaLock />}
			//         width={'100%'}
			//   />
			// }

			//   </div>
			// </>
		};
		item = rearrangedItem;
		return item;
	});

	return (
		<Layout title="Cartes">
			<section className="w-full">
				<div
					className="mb-10 grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1"
					style={{ gap: "20px" }}
				>
					{infoData.map((data, index) => (
						<InfoCard key={index} data={data} />
					))}
				</div>
			</section>

			<section>
				{/* <div className='w-full my-[50px] border border-gray-800'/> */}
				<div className="grid grid-cols-2 gap-x-10 w-full mt-6">
					<div className="flex flex-col gap-2 overflow-hidden">
						<div className="flex justify-between items-center">
							<Title title={"Évolution des achats des cartes"} />
							<CustomDropdown
								title={"Par jour"}
								cstyle={"outline"}
								iconSize={20}
								items={[
									<div
										key={"1"}
										className="flex justify-between gap-2"
									>
										<span className="text-nowrap text-sm ">
											Par jour
										</span>
									</div>,
									<div
										key={"2"}
										className="flex justify-between gap-2"
									>
										<span className="text-nowrap text-sm ">
											Par semaine
										</span>
									</div>,
									<div
										key={"3"}
										className="flex justify-between gap-2"
									>
										<span className="text-nowrap text-sm ">
											Par mois
										</span>
									</div>,
								]}
							/>
						</div>
						<AreaChart data={gradientData2} />
						<div className="grid grid-cols-2 gap-10 overflow-hidden  mt-10">
							<div>
								<div className="relative  overflow-hidden">
									<Title title={"Traffic de paiements"} />
									<Doughnut data={doughnutData} />
									<div className='grid grid-cols-2 gap-x-10 gap-3'>
										<LegendItem  label={`Facebook.com`} color={`#33E89C`} value={`46%`}/>
										<LegendItem  label={`Amazon.com`} color={`#FFDB5A`} value={`46%`}/>
										<LegendItem  label={`Tinder.com`} color={`#FD8A49`} value={`46%`}/>
										<LegendItem  label={`Alibaba.com`} color={`#6200EE`} value={`46%`}/>
										<LegendItem  label={`Google ads`} color={`#5BCEFF`} value={`46%`}/>
										<LegendItem  label={`Autres`} color={`#F85D4B`} value={`46%`}/>
									</div>
								</div>
							</div>
							<div className="flex flex-col gap-20">
								<div>
									<Title title={"Etat des cartes créés"} />
									<div className="flex justify-between items-center gap-2">
										<PieChart data={pieDataFour} size={90} />
										<div className="flex flex-col justify-start items-start gap-1 ">
											<LegendItem
												label={`Verifiés`}
												color={`#33E89C`}
												value={`46%`}
											/>
											<LegendItem
												label={`En attente`}
												color={`#FFDB5A`}
												value={`46%`}
											/>
											<LegendItem
												label={`No KYC`}
												color={`#F85D4B`}
												value={`46%`}
											/>
											<LegendItem
												label={`Bloqués`}
												color={`#B8A16B`}
												value={`46%`}
											/>
										</div>
									</div>
								</div>
								<div>
									<Title title={"Etat des paiements"} />
									<div className="flex justify-between items-center gap-2 flex-1">
										<PieChart data={pieDataThree} size={90} />
										<div className="flex flex-col justify-start items-start gap-1 ">
											<LegendItem
												label={`Réussis`}
												color={`#B8A16B`}
												value={`46%`}
											/>
											<LegendItem
												label={`Echoués pour insuff.`}
												color={`#FFDB5A`}
												value={`46%`}
											/>
											<LegendItem
												label={`Echoués pour limite`}
												color={`#F85D4B`}
												value={`46%`}
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="flex flex-col gap-2 overflow-hidden">
						<div className="flex justify-between items-center">
							<Title
								title={"Évolution des montants de paiement"}
							/>
							<CustomDropdown
								title={"Par jour"}
								cstyle={"outline"}
								iconSize={20}
								items={[
									<div
										key={"1"}
										className="flex justify-between gap-2"
									>
										<span className="text-nowrap text-sm ">
											Par jour
										</span>
									</div>,
									<div
										key={"2"}
										className="flex justify-between gap-2"
									>
										<span className="text-nowrap text-sm ">
											Par semaine
										</span>
									</div>,
									<div
										key={"3"}
										className="flex justify-between gap-2"
									>
										<span className="text-nowrap text-sm ">
											Par mois
										</span>
									</div>,
								]}
							/>
						</div>
						<AreaChart data={gradientData3} />
						<div className="grid grid-cols-2 gap-10 overflow-hidden  mt-10">
							
							<div className="flex flex-col gap-20">
							<div>
									<Title title={"Etat des paiements"} />
									<div className="flex justify-between items-center gap-2 flex-1">
										<PieChart data={pieDataThree} size={90} />
										<div className="flex flex-col justify-start items-start gap-1 ">
											<LegendItem
												label={`Réussis`}
												color={`#B8A16B`}
												value={`46%`}
											/>
											<LegendItem
												label={`Echoués pour insuff.`}
												color={`#FFDB5A`}
												value={`46%`}
											/>
											<LegendItem
												label={`Echoués pour limite`}
												color={`#F85D4B`}
												value={`46%`}
											/>
										</div>
									</div>
								</div>
								<div>
									<Title title={"Nbre de cartes par compte"} />
									<div className="flex justify-between items-center gap-2 flex-1">
									<PieChart data={pieDataFour} size={90} />
										<div className="flex flex-col justify-start items-start gap-1">
											<LegendItem
												label={`0 - 10k`}
												color={`#33E89C`}
												value={`46%`}
											/>
											<LegendItem
												label={`10k - 100k`}
												color={`#FFDB5A`}
												value={`46%`}
											/>
											<LegendItem
												label={`100k - 1M`}
												color={`#F85D4B`}
												value={`46%`}
											/>
											<LegendItem
												label={`plus de 1M`}
												color={`#B8A16B`}
												value={`46%`}
											/>
										</div>
										
									</div>
								</div>
							</div>

							<div>
								<div className="relative ">
									<Title title={"Origine des paiements"} />
									{/* <h1 className='text-md lg:text-lg font-semibold text-black text-left '>Traffic de paiements</h1> */}
									<Doughnut data={doughnutData} />
									<div className='grid grid-cols-2 gap-x-10 gap-3'>
										<LegendItem  label={`Cameroun`} color={`#33E89C`} value={`46%`}/>
										<LegendItem  label={`Gabon`} color={`#FFDB5A`} value={`46%`}/>
										<LegendItem  label={`Cote d'ivoire`} color={`#FD8A49`} value={`46%`}/>
										<LegendItem  label={`Mali`} color={`#6200EE`} value={`46%`}/>
										<LegendItem  label={`Senegal`} color={`#5BCEFF`} value={`46%`}/>
										<LegendItem  label={`Autres`} color={`#F85D4B`} value={`46%`}/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* <section className="mt-20">
				
				<div className="">
					<div className="mb-5">
						<Title title={"Liste des meilleurs utilisateurs"} />
					</div>
					<CustomTable
						headerData={headerData}
						tableData={rearrangedTableData}
						threeButtons
					/>
				</div>
			</section> */}

			<section className="my-10">
				<Tabs defaultValue="01" className="w-full">
					<div className="border-b-1">
					<TabsList className="TabsList">
					<TabsTrigger className="TabsTrigger" value="01">Liste des cartes</TabsTrigger>
					<TabsTrigger className="TabsTrigger" value="02">transactions de cartes</TabsTrigger>
					<TabsTrigger className="TabsTrigger" value="03">Achats de cartes</TabsTrigger>
					<TabsTrigger className="TabsTrigger" value="04">Paiements de cartes</TabsTrigger>
					
					</TabsList>
					</div>
					<div className={`mt-5`}>
					<TabsContent value="01">
						<CardList/>
					</TabsContent>
					<TabsContent value="02">
						<CardTransactions />
					</TabsContent>
					<TabsContent value="03">
						<CardSales />
					</TabsContent>
					<TabsContent value="04">
						<CardPayments />
					</TabsContent>
					</div>
				</Tabs>
			</section>
		</Layout>
	);
}
