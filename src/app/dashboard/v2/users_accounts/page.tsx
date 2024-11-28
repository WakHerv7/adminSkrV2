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
import InfoCardGrid from "@/components/cards/InfoCardGrid";
import Modal from "@/components/shared/Modal/Modal";
import { UserService } from "@/api/services/user";
import { getFormattedDate, getFormattedDateTime } from "@/utils/DateFormat";
import { useDispatch, useSelector } from "react-redux";
import urlsV2 from '@/config/urls_v2';
import { selectSearchTerm, setSearchTerm } from "@/redux/slices/search";
import LabelWithBadge from "@/components/shared/LabelWithBadge";

let infoData: TDataList[] = [
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

infoData[0][0][0].value.text = 0;
infoData[0][1][0].value.text = 0 + "  /jour";
infoData[1][0][0].value.text = 0;
infoData[1][1][0].value.text = 0;
infoData[1][1][1].value.text = 0;
infoData[2][0][0].value.text = 0 + "  XAF";
infoData[3][0][0].value.text = 0;
infoData[3][1][0].value.text = 0;
infoData[3][1][1].value.text = 0;
infoData[3][1][2].value.text = 0;



const getAllCustomers = async ({queryKey}:any) => {
    const [_key, st] = queryKey;
    let params:any = {};
    if(st) params.searchTerm = st;
    // console.log("getCustomers searchTerm : ", st, queryKey);
    
    const response = await UserService.get_all_customers(params);
    const responseJson = await response.json();
    if (!response.ok) {
      throw new Error(responseJson.message || 'Failed to get users'); 
    }  
    console.log("responseJson.data : ", responseJson.data);
    
    return responseJson.data; 
};
const getCustomersStats = async () => {
    const response = await UserService.get_customers_stats();
    const responseJson = await response.json();
    if (!response.ok) {
      throw new Error(responseJson.message || 'Failed to get users statistics'); 
    }  
    return responseJson.data; 
};

export default function Home() {
    useTitle("Sekure | Comptes utilisateurs", true);
    const dispatch = useDispatch();
    // dispatch(setSearchTerm(''));
    const searchTerm:string = useSelector(selectSearchTerm);

    const allUsersStatsQueryRes = useQuery({
        queryKey: ["allUsersStats"],
        queryFn: getCustomersStats,
        onError: (err) => {
          toast.error("Failed to get users stats.");
        },
        refetchInterval: 30000, // Fetches data every 30 seconds
    });
    const allUsersQueryRes = useQuery({
        queryKey: ["allCustomers", searchTerm],
        queryFn: getAllCustomers,
        onError: (err) => {
          toast.error("Failed to get users.");
        },
        // enabled: false,
        // refetchInterval: 50000, // Fetches data every 60 seconds
    });

    console.log("allUsersQueryRes.data : ", allUsersQueryRes.data);
    console.log("allUsersStatsQueryRes.data : ", allUsersStatsQueryRes.data);

    let rearrangedTableData:any[] = [];

    // if(allUsersQueryRes?.data) {
    //     
    // }
    
    if(allUsersStatsQueryRes?.data) {

        infoData[0][0][0].value.text = allUsersStatsQueryRes?.data?.stats.todayTotal?.toLocaleString('fr-FR') ?? 0;
        infoData[0][1][0].value.text = Math.round(allUsersStatsQueryRes?.data?.stats.avg ?? 0) + "  /jour";
        infoData[1][0][0].value.text = allUsersStatsQueryRes?.data?.stats.total?.toLocaleString('fr-FR') ?? 0;
        infoData[1][1][0].value.text = allUsersStatsQueryRes?.data?.stats.totalActives ?.toLocaleString('fr-FR')?? 0;
        infoData[1][1][1].value.text = allUsersStatsQueryRes?.data?.stats.totalBlocked?.toLocaleString('fr-FR') ?? 0;
        infoData[2][0][0].value.text = (allUsersStatsQueryRes?.data?.stats.totalSolde?.toLocaleString('fr-FR') ?? 0) + "  XAF";
        infoData[3][0][0].value.text = allUsersStatsQueryRes?.data?.stats.totalKYC?.toLocaleString('fr-FR') ?? 0;
        infoData[3][1][0].value.text = allUsersStatsQueryRes?.data?.stats.totalVerificationPending?.toLocaleString('fr-FR') ?? 0;
        infoData[3][1][1].value.text = allUsersStatsQueryRes?.data?.stats.totalVerified?.toLocaleString('fr-FR') ?? 0;
        infoData[3][1][2].value.text = allUsersStatsQueryRes?.data?.stats.totalVerificationBlocked?.toLocaleString('fr-FR') ?? 0;

        rearrangedTableData = allUsersQueryRes?.data?.data?.map((item:any, index:any) => {
            const rearrangedItem = {
                serial: index+1,
                name: item.name,			
                country: item.pays,
                phone: item.country_code ? `${item.country_code} ${item.phone}` : item.phone,
                email: item.email,        
                solde: item.soldeCourant.toLocaleString('fr-FR'),
                // nbCartes: item.numberOfCards, //index%3 + 1,
                totalTrx: item.totalTransactionAmount.toLocaleString('fr-FR'),
                avgTrx: item.avgTransactionAmount ? Math.round(item.avgTransactionAmount).toLocaleString('fr-FR') : 0,
                kyc: item.kyc_status == 'accepted' 
                        ?<LabelWithBadge label="Approuvé" badgeColor="#18BC7A"/>
                        :item.kyc_status == 'blocked'
                        ?<LabelWithBadge label="Bloqué" badgeColor="#F85D4B"/>
                        :item.kyc_status == 'ongoing'
                        ?<LabelWithBadge label="En cours" badgeColor="#999"/>
                        :<LabelWithBadge label="Aucun" badgeColor="#000"/>,
                status: <ActiveYesNo isActive={item.active}/>,
                locked: <ActiveYesNo isActive={item.blocked} colorActive={"#F85D4B"} labelActive={'Bloqué'} labelInactive={'Non'}/>,
                date: getFormattedDateTime(item.createdAt), //item.date,
                actionst: <>
                <div className='flex gap-5'>
                <CButton
                text={'Manager'}
                href={`${urlsV2.usersAccounts.manage}/${item._id}`}
                btnStyle={'dark'}
                icon={<FourDots />}              
                />
                
                {/* {item.locked ?
                <CButton 
                text={'Debloquer'} 
                btnStyle={'lightYellow'}
                icon={<FaLock />}
                width={'100%'}
                />
                :
                <CButton 
                text={'Bloquer'} 
                btnStyle={'yellow'}
                icon={<FaLock />}
                width={'100%'}
                />
                } */}
                
                
                </div>
                </>
            };
            item = rearrangedItem;
            return item;
        });
    }

	return (
		<Layout
		title={"Comptes utilisateurs"}
		>
            <section className='mt-2'>
                {allUsersStatsQueryRes?.status === 'loading' ? 
                    <div className="flex justify-center w-full py-10">
                        <div className={'loadingSpinner'}></div>
                    </div>
                    :
                    <InfoCardGrid infoData={infoData}/>
                }
                
                {/* <div className='mb-10 grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1' style={{gap:'20px'}}>
                    {infoData.map((data, index) => (
                        <InfoCard key={index} data={data} />
                    ))}
                </div> */}

                {/* <div 
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
                                    <LegendItem  label={`0`} color={`#33E89C`} value={`46%`}/>
                                    <LegendItem  label={`1`} color={`#FFDB5A`} value={`46%`}/>
                                    <LegendItem  label={`2`} color={`#FD8A49`} value={`46%`}/>
                                    <LegendItem  label={`3 et plus`} color={`#6200EE`} value={`46%`}/>
                                </div>
                                <PieChart data={pieData} size={150}/>
                            </div>
                        </div>
                    </div>
                </div> */}
                

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
                    isLoading={allUsersQueryRes.status == 'loading'}
                    threeButtons
                    />
                </div>
            </section>
			
	  </Layout>
	);
}

