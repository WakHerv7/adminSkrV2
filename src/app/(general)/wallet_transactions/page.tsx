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

const infoData: TDataList[] = [
    [
        [{
            label:{text:"Transactions aujourd'hui", fw:"bold", color:"#444"},
            value:{text:"1 558 450 F", fw:"bold", color:"#444"}
        }],
        [{
            label:{text:"Moy. transactions", fw:"", color:"#444"},
            value:{text:"1 855 950 F / jour", fw:"bold", color:"#444"}
        }]
    ],
    [
        [{
            label:{text:"Total transactions", fw:"bold", color:"#444"},
            value:{text:"9 850 675 F", fw:"bold", color:"#444"}
        }],
        [
            {
                label:{text:"Réussis", fw:"", color:"#444", fs:'11px'},
                value:{text:"1399", fw:"bold", color:"#18BC7A", fs:'14px'}
            },
            {
                label:{text:"En cours", fw:"", color:"#444", fs:'11px'},
                value:{text:"577", fw:"bold", color:"#888", fs:'14px'}
            },
            {
                label:{text:"Bloqués", fw:"", color:"#444", fs:'11px'},
                value:{text:"780", fw:"bold", color:"#F85D4B", fs:'14px'}
            },
        ]
    ],
    [
        [{
            label:{text:"Recharges aujourd'hui", fw:"bold", color:"#444"},
            value:{text:"2 558 450 XAF", fw:"bold", color:"#444"}
        }],
        [{
            label:{text:"Total recharges", fw:"", color:"#444"},
            value:{text:"15 855 950 F", fw:"bold", color:"#444"}
        }]
    ],
    [
        [{
            label:{text:"Retraits aujourd'hui", fw:"bold", color:"#444"},
            value:{text:"2 558 450 XAF", fw:"bold", color:"#444"}
        }],
        [{
            label:{text:"Total retraits", fw:"", color:"#444"},
            value:{text:"15 855 950 F", fw:"bold", color:"#444"}
        }]
    ],
    
];

const dualData = {
    labels: ['Mon1', 'Mon2', 'Mon3', 'Mon4', 'Mon5', 'Mon6', 'Mon7', 'Mon8', 'Mon9', 'Mon10', 'Mon11', 'Mon12'],
    datasets: [
      {
        label: 'Total Transactions',
        data: [410, 300, 200, 400, 400, 300, 210, 100, 300, 200, 120, 100], // Example data for total transactions
        backgroundColor: '#18BC7Ac3',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        fill: true,
        pointStyle: false
      },
      {
        label: 'Failed Transactions',
        data: [310, 200, 100, 40, 100, 100, 400, 190, 210, 300, 210, 180], // Example data for total transactions
        backgroundColor: '#FFDB5A',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        fill: true,
        pointStyle: false
      }
    ]
};
  
const data = {
    labels: ['J1', 'J2', 'J3', 'J4', 'J5', 'J6', 'J7', 'J8', 'J9', 'J10', 
            'J11', 'J12', 'J13', 'J14', 'J15', 'J16', 'J17', 'J18', 'J19', 'J20',
            'J21', 'J22', 'J23', 'J24', 'J25', 'J26', 'J27', 'J28', 'J29', 'J30'],
    datasets: [
      
      
      {
        label: 'Total Transactions',
        data: Array.from({length: 30}, () => Math.floor(Math.random() * 301) + 100),        
        backgroundColor: '#FFDB5Aaa',
        borderColor: '#FFDB5Aaa',
        borderWidth: 1,
        fill: true,
        pointStyle: false,
      },
      {
        label: 'Total Transactions',
        data: Array.from({length: 30}, () => Math.floor(Math.random() * 301) + 100),        
        backgroundColor: '#3870C0aa',
        borderColor: '#3870C0aa',
        borderWidth: 1,
        fill: true,
        pointStyle: false,
      },
      {
        label: 'Total Transactions',
        data: Array.from({length: 30}, () => Math.floor(Math.random() * 301) + 100),        
        backgroundColor: '#33E89Caa',
        borderColor: '#33E89Caa',
        borderWidth: 1,
        fill: true,
        pointStyle: false,
      },
    ]
};
  
const doughnutData = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: 'My First Dataset',
        // data: [300, 50, 100, 40, 120, 80],
        data: Array.from({length: 6}, () => Math.floor(Math.random() * 301) + 100),
        backgroundColor: [
          '#FFDB5A',
          '#F85D4B',
          '#6200EE',
          '#FD8A49',
          '#33E89C',
          '#5BCEFF',
        ],
        hoverOffset: 4,
      },
    ],
};

const pieData = {
    labels: ['Red', 'Blue', 'Yellow', 'Green'],
    datasets: [
       {
         label: '# of Votes',
        //  data: [9, 10, 17, 5],
        data: Array.from({length: 4}, () => Math.floor(Math.random() * 301) + 100),
        backgroundColor: [
           '#33E89C',
           '#FFDB5A',
           '#FD8A49',
           '#6200EE',
         ],
         borderColor: [
            '#33E89C',
            '#FFDB5A',
            '#FD8A49',
            '#6200EE',
         ],
         borderWidth: 1
       }
    ]
}; 

const pieData2 = {
    labels: ['Red', 'Blue', 'Yellow', 'Green'],
    datasets: [
       {
         label: '# of Votes',
        //  data: [9, 10, 17, 5],
        data: Array.from({length: 2}, () => Math.floor(Math.random() * 301) + 100),
        backgroundColor: [
           '#33E89C',
           '#FFDB5A',
         ],
         borderColor: [
            '#33E89C',
            '#FFDB5A',
         ],
         borderWidth: 1
       }
    ]
};


const headerData: string[] = [
    "S/N", "Type", "Nom", "Pays", 
    "Telephone", "ID Transaction", "Montant", 
    "Mode paiement", "Statut",
     "Date de création", ""
]
const tableData: IGenericRow[] = [
  {
    type: 'Recharge',
    name: 'John Doe',
    country: 'Cameroun',
    phone: '+237 688 777 999',
    idTrx: 'H6G96Y2SB3HJ6KS3',
    amount: '2 455 000F',
    paymentMethod: 'Mobile money',
    status: true,
    date: '12/03/2024',
    edit: '#',
  },
  {
    type: 'Recharge',
    name: 'John Doe',
    country: 'Cameroun',
    phone: '+237 688 777 999',
    idTrx: 'H6G96Y2SB3HJ6KS3',
    amount: '2 455 000F',
    paymentMethod: 'Mobile money',
    status: true,
    date: '12/03/2024',
    edit: '#',
  },
  {
    type: 'Recharge',
    name: 'John Doe',
    country: 'Cameroun',
    phone: '+237 688 777 999',
    idTrx: 'H6G96Y2SB3HJ6KS3',
    amount: '2 455 000F',
    paymentMethod: 'Mobile money',
    status: true,
    date: '12/03/2024',
    edit: '#',
  },
  {
    type: 'Retrait',
    name: 'John Doe',
    country: 'Cameroun',
    phone: '+237 688 777 999',
    idTrx: 'H6G96Y2SB3HJ6KS3',
    amount: '2 455 000F',
    paymentMethod: 'Mobile money',
    status: false,
    date: '12/03/2024',
    edit: '#',
  },
  {
    type: 'Retrait',
    name: 'John Doe',
    country: 'Cameroun',
    phone: '+237 688 777 999',
    idTrx: 'H6G96Y2SB3HJ6KS3',
    amount: '2 455 000F',
    paymentMethod: 'Mobile money',
    status: false,
    date: '12/03/2024',
    edit: '#',
  },
  {
    type: 'Recharge',
    name: 'John Doe',
    country: 'Cameroun',
    phone: '+237 688 777 999',
    idTrx: 'H6G96Y2SB3HJ6KS3',
    amount: '2 455 000F',
    paymentMethod: 'Mobile money',
    status: true,
    date: '12/03/2024',
    edit: '#',
  },
  {
    type: 'Recharge',
    name: 'John Doe',
    country: 'Cameroun',
    phone: '+237 688 777 999',
    idTrx: 'H6G96Y2SB3HJ6KS3',
    amount: '2 455 000F',
    paymentMethod: 'Mobile money',
    status: true,
    date: '12/03/2024',
    edit: '#',
  },
  {
    type: 'Recharge',
    name: 'John Doe',
    country: 'Cameroun',
    phone: '+237 688 777 999',
    idTrx: 'H6G96Y2SB3HJ6KS3',
    amount: '2 455 000F',
    paymentMethod: 'Mobile money',
    status: true,
    date: '12/03/2024',
    edit: '#',
  },
];

export default function Home() {

	const rearrangedTableData = tableData.map((item, index) => {
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
		title={"Transactions wallet"}
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
                            title={"Évolution des transactions"}
                            subtitle={"Visualisez la courbe d'évolution en nombre de transactions"}
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
                                {label:'Recharges', color:'#FFDB5A'},
                                {label:'Retraits', color:'#3870C0'},
                            ]}
                            />
                        </div>
                    </div>          
                    <div>
                        <div className="relative  h-80 overflow-hidden">
                            <Title title={"Traffic de transactions par pays"} />
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
                            <Title title={"Ratios recharges / retraits"} />
                            <div className='flex justify-between items-center gap-2 flex-1'>
                                <div className='flex flex-col justify-start items-start gap-1 w-[120px]'>                                    
                                    <LegendItem  label={`Recharges`} color={`#33E89C`} value={`46%`}/>
                                    <LegendItem  label={`Retraits`} color={`#FFDB5A`} value={`46%`}/>
                                </div>
                                <PieChart data={pieData2} size={150}/>
                            </div>
                        </div>
                    </div>
                </div>
                

                <div className="my-[50px]">
                    <div className="mb-5">
                        <Title 
                        title={"Liste des transactions"}
                        subtitle={"Liste en temps réel des dernières transactions effectuées avec les cartes."}
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

