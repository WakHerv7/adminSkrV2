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
    headerUserAccountData as headerData, tableUserAccountData as tableData,
    trxData as data, pieData, pieData2, doughnutData } from "@/constants/Index";
import { waitCircleIcon,
    checkCircleIcon,
    ongoingCircleIcon,
    haltCircleIcon,
 } from "@/constants/icons";


const infoData: TDataList[] = [
    [
        [{
            label:{text:"Comptes créés aujourd'hui", fw:"bold", color:"#444"},
            value:{text:"42", fw:"bold", color:"#444"}
        }],
        [{
            label:{text:"Moyenne de création", fw:"", color:"#444"},
            value:{text:"80 / jour", fw:"bold", color:"#444"}
        }]
    ],
    [
        [{
            label:{text:"Comptes créés ", fw:"bold", color:"#444"},
            value:{text:"1456", fw:"bold", color:"#444"}
        }],
        [
            {
                label:{text:checkCircleIcon, tooltip:"Actifs", fw:"", color:"#444"},
                value:{text:"1399", fw:"bold", color:"#18BC7A"}
            },
            {
                label:{text:haltCircleIcon, tooltip:"Bloqués", fw:"", color:"#444"},
                value:{text:"57", fw:"bold", color:"#F85D4B"}
            },
        ]
    ],
    [
        [{
            label:{text:"Total solde SEKURE ", fw:"bold", color:"#444"},
            value:{text:"24 558 450 XAF", fw:"bold", color:"#444"}
        }],
    ],
    [
        [{
            label:{text:"Verifications KYC ", fw:"bold", color:"#444"},
            value:{text:"1456", fw:"bold", color:"#444"}
        }],
        [
            {
                label:{text:waitCircleIcon, tooltip:"En attente", fw:"", color:"#444", fs:'11px'},
                value:{text:"1399", fw:"bold", color:"#888", fs:'14px'}
            },
            {
                label:{text:checkCircleIcon, tooltip:"Validés", fw:"", color:"#444", fs:'11px'},
                value:{text:"443", fw:"bold", color:"#18BC7A", fs:'14px'}
            },
            {
                label:{text:haltCircleIcon, tooltip:"Bloqués", fw:"", color:"#444", fs:'11px'},
                value:{text:"57", fw:"bold", color:"#F85D4B", fs:'14px'}
            },
        ]
    ]
];


// const headerData: string[] = [
//     "S/N", "Nom", "Pays", 
//     "Telephone", "Email", "Solde Cpt.", 
//     "Total Trans.", "Moy. Trans.", "Statut",
//      "Date de création", ""
// ]
// const tableData: IGenericRow[] = [
//   {
//     name: 'John Doe',
//     country: 'Cameroun',
//     phone: '+237 688 777 999',
//     email: 'abc123@xyz.com',
//     solde: '2 455 000F',
//     totalTrx: '44 250 000F',
//     avgTrx: '250 000F',
//     status: true,
//     locked: false,
//     date: '12/03/2024',
//     edit: '#',
//   },
//   {
//     name: 'John Doe',
//     country: 'Cameroun',
//     phone: '+237 688 777 999',
//     email: 'abc123@xyz.com',
//     solde: '2 455 000F',
//     totalTrx: '44 250 000F',
//     avgTrx: '250 000F',
//     status: true,
//     locked: false,
//     date: '12/03/2024',
//     edit: '#',
//   },
//   {
//     name: 'John Doe',
//     country: 'Cameroun',
//     phone: '+237 688 777 999',
//     email: 'abc123@xyz.com',
//     solde: '2 455 000F',
//     totalTrx: '44 250 000F',
//     avgTrx: '250 000F',
//     status: true,
//     locked: false,
//     date: '12/03/2024',
//     edit: '#',
//   },
//   {
//     name: 'John Doe',
//     country: 'Cameroun',
//     phone: '+237 688 777 999',
//     email: 'abc123@xyz.com',
//     solde: '2 455 000F',
//     totalTrx: '44 250 000F',
//     avgTrx: '250 000F',
//     status: false,
//     locked: true,    
//     date: '12/03/2024',
//     edit: '#',
//   },
//   {
//     name: 'John Doe',
//     country: 'Cameroun',
//     phone: '+237 688 777 999',
//     email: 'abc123@xyz.com',
//     solde: '2 455 000F',
//     totalTrx: '44 250 000F',
//     avgTrx: '250 000F',
//     status: false,
//     locked: true,    
//     date: '12/03/2024',
//     edit: '#',
//   },
//   {
//     name: 'John Doe',
//     country: 'Cameroun',
//     phone: '+237 688 777 999',
//     email: 'abc123@xyz.com',
//     solde: '2 455 000F',
//     totalTrx: '44 250 000F',
//     avgTrx: '250 000F',
//     status: true,
//     locked: false,
//     date: '12/03/2024',
//     edit: '#',
//   },
//   {
//     name: 'John Doe',
//     country: 'Cameroun',
//     phone: '+237 688 777 999',
//     email: 'abc123@xyz.com',
//     solde: '2 455 000F',
//     totalTrx: '44 250 000F',
//     avgTrx: '250 000F',
//     status: true,
//     locked: false,
//     date: '12/03/2024',
//     edit: '#',
//   },
//   {
//     name: 'John Doe',
//     country: 'Cameroun',
//     phone: '+237 688 777 999',
//     email: 'abc123@xyz.com',
//     solde: '2 455 000F',
//     totalTrx: '44 250 000F',
//     avgTrx: '250 000F',
//     status: true,
//     locked: false,
//     date: '12/03/2024',
//     edit: '#',
//   },
// ];

export default function Home() {

	const rearrangedTableData = tableData.map((item, index) => {
		const rearrangedItem = {
			index: index+1,
			name: item.name,			
            country: item.country,
            phone: item.phone,
			email: item.email,
            solde: item.solde,
            totalTrx: item.totalTrx,
            avgTrx: item.avgTrx,
			status: <ActiveYesNo isActive={item.status}/>,			
			date: item.date,
			actions: <>
			<div className='flex gap-5'>
             <CButton
			  text={'Manager'}
			  href={`users_accounts/manage/${index+1}`}
			  btnStyle={'dark'}
			  icon={<FourDots />}              
			  />
              {item.locked ?
              <CButton 
			  text={'Debloquer'} 
			  btnStyle={'lightYellow'}
			  icon={<FaLock />} 
			  />
              :
              <CButton 
			  text={'Bloquer'} 
			  btnStyle={'yellow'}
			  icon={<FaLock />}
              width={'100%'}
			  />
              }
			  
              
			  </div>
			</>
		};
		item = rearrangedItem;
		return item;
	});

	return (
		<Layout
		title={"Comptes utilisateurs"}
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
                            title={"Évolution des utilisateurs"}
                            subtitle={"Visualisez la courbe d'évolution en nombre de cartes parrainées"}
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
                            <AreaChart data={data} />
                        </div>
                    </div>          
                    <div>
                        <div className="relative  h-80 overflow-hidden">
                            <Title title={"Traffic de paiements"} />
                            {/* <h1 className='text-md lg:text-lg font-semibold text-black text-left '>Traffic de paiements</h1> */}
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
                    <div>
                        <div>
                            <Title title={"Etat des comptes créés"} />
                            <div className='flex justify-between items-center gap-2 flex-1'>
                                <div className='flex flex-col justify-start items-start gap-1 w-[120px]'>
                                    {/* <Title title={"Etat des comptes créés"} /> */}
                                    {/* <h1 className='text-[14px] font-semibold w-full'>Etat des comptes créés</h1> */}
                                    <LegendItem  label={`Vérifiés`} color={`#33E89C`} value={`46%`}/>
                                    <LegendItem  label={`En attente`} color={`#FFDB5A`} value={`46%`}/>
                                    <LegendItem  label={`Bloqués`} color={`#FD8A49`} value={`46%`}/>
                                    <LegendItem  label={`No KYC`} color={`#6200EE`} value={`46%`}/>
                                </div>
                                <PieChart data={pieData} size={150}/>
                            </div>
                        </div>
                        <div>
                            <Title title={"Nombre de cartes par compte"} />
                            <div className='flex justify-between items-center gap-2 flex-1'>
                                <div className='flex flex-col justify-start items-start gap-1 w-[120px]'>
                                    {/* <Title title={"Etat des comptes créés"} /> */}
                                    {/* <h1 className='text-[14px] font-semibold w-full'>Etat des comptes créés</h1> */}
                                    <LegendItem  label={`0`} color={`#33E89C`} value={`46%`}/>
                                    <LegendItem  label={`1`} color={`#FFDB5A`} value={`46%`}/>
                                    <LegendItem  label={`2`} color={`#FD8A49`} value={`46%`}/>
                                    <LegendItem  label={`3 et plus`} color={`#6200EE`} value={`46%`}/>
                                </div>
                                <PieChart data={pieData} size={150}/>
                            </div>
                        </div>
                    </div>
                </div>
                

                <div className="my-[50px]">
                    <div className="mb-5">
                        <Title 
                        title={"Liste des utilisateurs"}
                        subtitle={"Liste en temps réel des derniers utilisateurs inscrits"}
                        />
                    </div>
                    <CustomTable
                    headerData={headerData}
                    tableData={rearrangedTableData}
                    threeButtons
                    />
                </div>
            </section>
			
	  </Layout>
	);
}

