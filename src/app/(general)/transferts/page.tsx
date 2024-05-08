"use client"
import Image from "next/image";
import { useTitle } from "@/hooks/useTitle";
import ProductsSection from "@/components/sections/ProductsSection";
import { useQuery } from "react-query";
import { axiosOpenedInstance } from "@/utils/axios";
import toast from "react-hot-toast";
import { Kbd } from "@nextui-org/react";
import { useEffect } from "react";

import SideBar from "@/components/shared/SideBar"
import { RxCaretDown, RxDotsHorizontal } from "react-icons/rx"
import { IoIosDisc, IoIosNotificationsOutline } from "react-icons/io"
import { CgProfile } from "react-icons/cg";
import Navbar from "@/components/shared/Navbar";
import CustomTable from "@/components/shared/CustomTable";
import Layout from "@/components/shared/Layout";
import CustomDropdown from "@/components/shared/CustomDropdown";
import Link from "next/link";
import ButtonFilled from "@/components/shared/ButtonFilled";
import { IGenericRow } from '@/components/AdminTable/Table';
import ActiveYesNo from "@/components/shared/ActiveYesNo";
import ButtonOutlined from "@/components/shared/ButtonOutlined";
import { FourDots } from "@/components/shared/icons";
import { isString } from "@/utils/utils";
import Transfers from "@/components/cards/Transfers";
import TransfersTotal from "@/components/cards/TransfersTotal";
import TransferType from "@/components/cards/TransferType";
import InfoCard, { TDataList } from "@/components/cards/InfoCard";
import AreaChart from "@/components/charts/AreaChart";
import Doughnut from "@/components/charts/Doughnut";
import Title from "@/components/shared/Title";
import { ScriptableContext } from "chart.js";
import LegendItem from "@/components/shared/LegendItem";
import PieChart from "@/components/charts/pieChart/PieChart";
import CButton from "@/components/shared/CButton";
import { FaLock } from "react-icons/fa";
import { 
    headerTransactionData as headerData, tableTransactionData as tableData,
    trxData as data, pieData, pieData2, doughnutData } from "@/constants/Index";

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
  } from '@/constants/Index';

const infoData: TDataList[] = [
    [
        [{
            label:{
                text: transferIconToday,
                tooltip:"Transferts aujourd'hui", 
                fw:"bold", 
                color:"#444"
            },
            value:{text:"1 558 450 XAF", fw:"bold", color:"#444"}
        }],
        [{
            label:{
                text: transferIconAvg,
                tooltip:"Moyenne transferts", 
                color:"#444"
            },
            value:{text:"1 855 950 XAF / jour", fw:"bold", color:"#444"}
        }]
    ],
    [
        [{
            label:{
                text: transferIconTotal, 
                tooltip:"Total transferts", 
                fw:"bold", 
                color:"#444"
            },
            value:{text:"9 850 675 XAF", fw:"bold", color:"#444"}
        }],
        [
            {
                label:{text:checkCircleIcon, tooltip:"Réussis", fw:"", color:"#444", fs:'11px'},
                value:{text:"1399", fw:"bold", color:"#18BC7A", fs:'14px', tooltip:"Réussis",}
            },
            {
                label:{text:ongoingCircleIcon, tooltip:"En cours", fw:"", color:"#444", fs:'11px'},
                value:{text:"577", fw:"bold", color:"#888", fs:'14px', tooltip:"En cours",}
            },
            {
                label:{text:closeCircleIcon, tooltip:"Bloqués", fw:"", color:"#444", fs:'11px'},
                value:{text:"780", fw:"bold", color:"#F85D4B", fs:'14px', tooltip:"Bloqués",}
            },
        ]
    ],
    [
        [{
            label:{
                text: transferIconMomoToday,
                tooltip:"Transferts vers Mobile money aujourd'hui", 
                fw:"bold", 
                color:"#444"},
            value:{text:"2 558 450 XAF", fw:"bold", color:"#444"}
        }],
        [{
            label:{
                text: transferIconMomoTotal,
                tooltip:"Total transferts vers Mobile money", 
                color:"#444"},
            value:{text:"15 855 950 XAF", fw:"bold", color:"#444"}
        }]
    ],
    [
        [{
            label:{
                text: transferIconSekureToday,
                tooltip:"Transferts vers Sekure aujourd'hui", 
                fw:"bold", color:"#444"},
            value:{text:"2 558 450 XAF", fw:"bold", color:"#444"}
        }],
        [{
            label:{
                text: transferIconSekureTotal,
                tooltip:"Total transferts vers Sekure", 
                fw:"", color:"#444"},
            value:{text:"15 855 950 XAF", fw:"bold", color:"#444"}
        }]
    ],
    
];


export default function Home() {

	const rearrangedTableData = tableData.map((item:any, index:any) => {
		const rearrangedItem = {
			index: index+1,
			type: item.type,
            name: item.name,			
            country: item.country,
            phone: item.phone,
			idTrx: item.idTrx,
            amount: item.amount,
            paymentMethod: item.paymentMethod,
			status: 
                item.status ?
                <ActiveYesNo isActive={item.status} activeLabel="Réussi"/>
                :<ActiveYesNo isActive={item.status} inactiveLabel="Echec"/>
            ,			
			date: item.date,
			actions: <>
			<div className='flex gap-5'>
             <CButton
			  text={'Details'}
			  href={item.edit}
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
		title={"Transferts d'argent"}
		>
            <section className='mt-2'>
                <div className='mb-10 grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1' style={{gap:'20px'}}>
                    {infoData.map((data, index) => (
                        <InfoCard key={index} data={data} />
                    ))}
                </div>

                <div 
                style={{width:'calc(100vw - 350px)', overflowX:'auto'}}
                className={`relative flex flex-row w-full items-start mt-6 gap-16`}>
                    <div className='flex flex-col justify-between items-start gap-2'>
                        <div className='w-full flex justify-between items-center'>
                            <Title 
                            title={"Évolution des transferts"}
                            subtitle={"Visualisez la courbe d'évolution en nombre de transferts"}
                            />
                            <CustomDropdown
                            title={'Par jour'}			
                            cstyle={'outline'}
                            iconSize={20}
                            items={[
                                <div key={'1'} className='flex justify-between gap-2'>            
                                    <span className='text-nowrap text-sm '>
                                    Par jour
                                    </span>
                                </div>,
                                <div key={'2'} className='flex justify-between gap-2'>            
                                    <span className='text-nowrap text-sm '>
                                    Par semaine
                                    </span>
                                </div>,
                                <div key={'3'} className='flex justify-between gap-2'>            
                                    <span className='text-nowrap text-sm '>
                                    Par mois
                                    </span>
                                </div>,
                            ]}
                            />
                        </div>
                        <div className="relative mt-5 w-[810px]">                        
                            <AreaChart 
                            data={data}
                            legend={[
                                {label:'Total', color:'#33E89C'},
                                {label:'Transferts vers Sekure', color:'#FFDB5A'},
                                {label:'Transferts vers Mobile money', color:'#3870C0'},
                            ]}
                            />
                        </div>
                    </div>          
                    <div>
                        <div className="relative  h-80 overflow-hidden">
                            <Title title={"Traffic de transferts par pays"} />
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
                    <div>
                        <div>
                            <Title title={"Opérateurs"} />
                            <div className='flex justify-between items-center gap-2 flex-1'>
                                <div className='flex flex-col justify-start items-start gap-1 w-[120px]'>
                                    {/* <Title title={"Etat des comptes créés"} /> */}
                                    {/* <h1 className='text-[14px] font-semibold w-full'>Etat des comptes créés</h1> */}
                                    <LegendItem  label={`Orange`} color={`#33E89C`} value={`46%`}/>
                                    <LegendItem  label={`MTN`} color={`#FFDB5A`} value={`46%`}/>
                                    <LegendItem  label={`Airtel`} color={`#FD8A49`} value={`46%`}/>
                                    <LegendItem  label={`Moov`} color={`#6200EE`} value={`46%`}/>
                                </div>
                                <PieChart data={pieData} size={150}/>
                            </div>
                        </div>
                        <div>
                            <Title title={"Ratios transferts"} />
                            <div className='flex justify-between items-center gap-2 flex-1'>
                                <div className='flex flex-col justify-start items-start gap-1 w-[120px]'>                                    
                                    <LegendItem  label={`Transferts vers Sekure`} color={`#33E89C`} value={`46%`}/>
                                    <LegendItem  label={`Transferts vers Mobile money`} color={`#6200EE`} value={`46%`}/>
                                </div>
                                <PieChart data={pieData2} size={150}/>
                            </div>
                        </div>
                    </div>
                </div>
                

                <div className="my-[50px]">
                    <div className="mb-5">
                        <Title 
                        title={"Liste des transferts"}
                        subtitle={"Liste en temps réel des derniers transferts effectués."}
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

