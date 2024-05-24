import AreaChart from "@/components/charts/AreaChart";
import DoughnutSlim from "@/components/charts/DoughnutSlim";
import PieChart from "@/components/charts/pieChart/PieChart";
import ChartLabelBox from "@/components/shared/ChartLabelBox";
import CustomDropdown from "@/components/shared/CustomDropdown";
import LegendItem from "@/components/shared/LegendItem";
import Title from "@/components/shared/Title";
import {
    doughnutData,
	gradientData1,
	gradientData2,
	gradientDualData,
	pieDataFour,
    pieDataNine,
    pieDataSix,
    pieDataThree,
} from "@/constants/graphData";
import React from "react";

const StatisticsData =[
    {label:`Recharge compte`, value:'37%' },
    {label:`Retrait compte`, value:'37%' },
    {label:`Recharge carte`, value:'37%' },
    {label:`Retrait carte`, value:'37%' },
    {label:`Achat carte`, value:'37%' },
    {label:`Paiement en ligne`, value:'37%' },
    {label:`Echec paiements`, value:'37%' },
    {label:`Transferts Sekure`, value:'37%' },
    {label:`Transferts MOMO`, value:'37%' },
]

export default function AccountProfit() {
	return (
		<>
			<div className="flex-1 overflow-hidden">
				{/* <div className="w-full flex justify-between items-start mb-3">
                <Title title="Évolution des transactions " subtitle="visualisez la courbe d’evolution en nombre de cartes parrainées" />
                <div className='flex flex-col gap-2'>
                    <div className='flex justify-between items-center gap-8'>
                        <p className='text-xs'>{`Transactions aujourd'hui`}</p>
                        <h1 className='text-sm font-semibold'>12 542 500 Fcfa</h1>
                    </div>
                    <div className='flex justify-between items-center gap-8'>
                        <p className='text-xs'>Transactions Totales</p>
                        <p className='text-xs text-right'>262 550 000 Fcfa</p>
                    </div>
                </div>
            </div> */}
				<div className="w-full flex justify-center items-center gap-5">
					<ChartLabelBox
						size="14px"
						title="Gains aujourd'hui"
						rate="1 425 000 XAF"
					/>
					<ChartLabelBox
						size="14px"
						title="Total des gains"
						rate="25 570 000 XAF"
					/>
					<ChartLabelBox
						size="14px"
						title="Moyenne par jour"
						rate="2 570 000 XAF/jour"
					/>
				</div>
				<CustomDropdown
					title={"Par jour"}
					cstyle={"outline"}
					iconSize={20}
					items={[
						<div key={"1"} className="flex justify-between gap-2">
							<span className="text-nowrap text-sm ">
								Par jour
							</span>
						</div>,
						<div key={"2"} className="flex justify-between gap-2">
							<span className="text-nowrap text-sm ">
								Par semaine
							</span>
						</div>,
						<div key={"3"} className="flex justify-between gap-2">
							<span className="text-nowrap text-sm ">
								Par mois
							</span>
						</div>,
					]}
				/>

				<AreaChart
					data={gradientDualData}
					legend={[
						{ label: "Recharges de compte", color: "#33E89C" },
						{ label: "Retraits de compte", color: "#FFDB5A" },
					]}
				/>
				<div className="w-full grid grid-cols-3 gap-10 overflow-hidden  mt-10">
					<div>
						<Title title={"Taux global des benefices"} />
						<div className="flex justify-between items-center gap-2 flex-1">
							<div className="flex flex-col justify-start items-start gap-1 w-[200px]">
								<LegendItem
									label={`Benefices`}
									color={`#B8A16B`}
									value={`46%`}
								/>
								<LegendItem
									label={`Gains partenaire`}
									color={`#FFDB5A`}
									value={`46%`}
								/>
								<LegendItem
									label={`Montant utilisateur`}
									color={`#F85D4B`}
									value={`46%`}
								/>
							</div>
							<DoughnutSlim data={pieDataThree} size={150} cutout={'70%'}/>
						</div>
					</div>
					<div>
						<Title title={"Traffic de bénéfices par origine"} />
						<div className="flex justify-between items-center gap-2 flex-1">
							<div className="flex flex-col justify-start items-start gap-1 w-[200px]">
								<LegendItem
									label={`Recharge compte`}
									color={`#33E89C`}
									value={`46%`}
								/>
								<LegendItem
									label={`Retrait compte`}
									color={`#FFDB5A`}
									value={`46%`}
								/>
								<LegendItem
									label={`Recharge carte`}
									color={`#FD8A49`}
									value={`46%`}
								/>
								<LegendItem
									label={`Retrait carte`}
									color={`#6200EE`}
									value={`46%`}
								/>
                                <LegendItem
									label={`Achat carte`}
									color={`#5BCEFF`}
									value={`46%`}
								/>
                                <LegendItem
									label={`Paiement en ligne`}
									color={`#F85D4B`}
									value={`46%`}
								/>
                                <LegendItem
									label={`Echec paiements`}
									color={`#D18E6F`}
									value={`46%`}
								/>
                                <LegendItem
									label={`Transferts Sekure`}
									color={`#FC9F92`}
									value={`46%`}
								/>
                                <LegendItem
									label={`Transferts MOMO`}
									color={`#D0D06F`}
									value={`46%`}
								/>
							</div>
							<DoughnutSlim data={pieDataNine} size={150} cutout={'70%'}/>
						</div>
					</div>
                    <div>
						<Title title={"Traffic de bénéfices par pays"} />
						<div className="flex justify-between items-center gap-2 flex-1">
							<div className="flex flex-col justify-start items-start gap-1 w-[200px]">
                                <LegendItem label={`Cameroun`} color={`#33E89C`} value={`46%`}/>
                                <LegendItem label={`Gabon`} color={`#FFDB5A`} value={`46%`}/>
                                <LegendItem label={`Cote d'ivoire`} color={`#FD8A49`} value={`46%`}/>
                                <LegendItem label={`Mali`} color={`#6200EE`} value={`46%`}/>
                                <LegendItem label={`Senegal`} color={`#5BCEFF`} value={`46%`}/>
                                <LegendItem label={`Autres`} color={`#F85D4B`} value={`46%`}/>
							</div>
							<DoughnutSlim data={pieDataSix} size={150} cutout={'70%'}/>
						</div>
					</div>
				</div>

                <div className="mt-10 flex flex-wrap justify-center gap-x-3 gap-y-1">
                    {StatisticsData.map((item, index) => (
                        <div key={index}>
                        <ChartLabelBox 
                            title={item.label}
                            rate={item.value}
                            size={'14px'}
                            bgColor={index%2 == 0 ? '#B8A16B' : '#18BC7A'}                            
                            textColor={'#fff'}
                        />
                        </div>
                    ))}
                </div>
			</div>
		</>
	);
}
