"use client";

// import Category, { ICategory } from "@/components/cards/Category";
import CButton from "@/components/shared/CButton";
import DataCard from "@/components/cards/DataCard/DataCard";
import AreaChart from "@/components/charts/AreaChart";
import Doughnut from '@/components/charts/Doughnut';
import CustomDropdown from "@/components/shared/CustomDropdown";
import Layout from "@/components/shared/Layout";
import LegendItem from "@/components/shared/LegendItem";
import Title from "@/components/shared/Title";
import { doughnutData, gradientData1, gradientData2, gradientData3, pieData, pieDataFour, pieDataThree, pieDataTwo } from "@/constants/graphData";
import { IoChatbubble } from "react-icons/io5";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { FourDots } from "@/components/shared/icons";
import { FaChevronRight } from "react-icons/fa";
import ChartLabelBox from "@/components/shared/ChartLabelBox";
import PieChart from "@/components/charts/pieChart/PieChart";
import CustomTable from "@/components/shared/CustomTable";
import { 
  headerProfitData as headerData, 
  tableProfitData as tableData } from "@/constants/Index";
import ActiveYesNo from "@/components/shared/ActiveYesNo";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
  } from "@/components/ui/tabs";
import AccountProfit from "./components/tabs/AccountProfit";


export default function Profit() {
	
    const rearrangedTableData = tableData.map((item, index) => {
      const rearrangedItem = {
        index: index+1,
		type: item.type,
		reference: item.reference,
		amount: item.amount,
		profit: item.profit,
		date: item.date,		
        actions: <>
        <div className='flex gap-5'>
            <CButton
			text={'Voir la transaction'}
			href={`#`}
			btnStyle={'dark'}
			icon={<FourDots />}              
			/>
        </div>
        </>
      };
      item = rearrangedItem;
      return item;
    });
	
	return (
		<Layout
			title="Accueil et visualisation globale"
		>

		<section>			
			<div className='grid grid-flow-row grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-col-5 w-full gap-5'>
			{Array.from({length: 10}, (_, i) => i).map((item, index) => (
				<div key={index}>
				<DataCard 
					title="Recharges de compte"
					change_per="24%"
					chartData={{
					labels: ['Mon1', 'Mon2', 'Mon3', 'Mon4', 'Mon5', 'Mon6', 'Mon7', 'Mon8', 'Mon9', 'Mon10', 'Mon11', 'Mon12'],
					datasets: [{
						label: '',
						// data: [20, 32, 11, 29, 10, 25, 30, 27, 100, 320, 28, 100],
						data: Array.from({length: 12}, () => Math.floor(Math.random() * 100)),
						borderColor: index%2 == 0 ? '#FFDB5A' : '#18BC7A',
						borderWidth: 2,
						pointStyle: false
					}]
					}}
					data={{
					today: "12 542 500 Fcfa",
					total: "262 550 000 Fcfa",
					average: "550 000 Fcfa"
					}}
				/>
				</div>
			))}
			</div>
		</section>

		<section className="mt-20  items-start gap-10 w-full">
			<Title title="Évolution des gains"/>
			<Tabs defaultValue="Details" className="w-full mt-2">
				<div className="border-b-1">
				<TabsList className="TabsList">
				<TabsTrigger className="TabsTrigger" value="Details">Total</TabsTrigger>
				<TabsTrigger className="TabsTrigger" value="Cartes">Comptes</TabsTrigger>
				<TabsTrigger className="TabsTrigger" value="Transferts">Cartes</TabsTrigger>
				<TabsTrigger className="TabsTrigger" value="Transactions">Transferts</TabsTrigger>
				</TabsList>
				</div>
				<div className={`mt-5`}>
				<TabsContent value="Details">
					<AccountProfit/>
				</TabsContent>
				<TabsContent value="Cartes">
					<AccountProfit />
				</TabsContent>
				<TabsContent value="Transferts">
					<AccountProfit />
				</TabsContent>
				<TabsContent value="Transactions">
					<AccountProfit />
				</TabsContent>
				</div>
			</Tabs>
			
      	</section>
      

      <section>
        <div className='w-full my-[50px] border border-gray-800'/>
        <div className="">
            <div className="mb-5">
                <Title 
                title={"Liste des bénéfices par transaction"}
				subtitle={"Liste des dernieres transactions effectuées par carte."}
                />
            </div>
            <CustomTable
            headerData={headerData}
            tableData={rearrangedTableData}
            threeButtons
			filter
            />
        </div>
      </section>
		</Layout>
	);
}
