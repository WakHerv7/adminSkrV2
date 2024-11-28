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
import { isString, transformArray } from "@/utils/utils";
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
import { FaLock, FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa";
import { headerTransactionData } from '@/constants/Index';
import { 
    tableTransactionData as tableData,
    trxData as data, pieData, pieData2, doughnutData } from "@/constants/Index";
import {
    checkCircleIcon,
    ongoingCircleIcon,
    haltCircleIcon,
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
    transactionIcon,
    transactionIconToday,
    transactionIconAvg,
    transactionIconTotal,
    depositIconToday,
    withdrawalIconToday,
    } from '@/constants/Index';
import { cardDepositIconTotal, cardWithdrawalIconTotal } from "@/constants/icons";
import InfoCardGrid from "@/components/cards/InfoCardGrid";
import TransactionModal from "@/app/dashboard/v1/wallet_transactions/components/TransactionModal";
import Modal from "@/components/shared/Modal/Modal";
import { categoryType, getCategoryMode } from "@/utils/graphs";
import LabelWithBadge from "@/components/shared/LabelWithBadge";
import { getFormattedDateTime } from "@/utils/DateFormat";
import { TransactionService } from "@/api/services/transaction";
import { selectSearchTerm } from "@/redux/slices/search";
import { useSelector } from "react-redux";

const infoData: TDataList[] = [
    [
        [{
            label:{
                text: transactionIconToday,
                tooltip:"Transactions aujourd'hui", 
                fw:"bold", color:"#444"},
            value:{text:"1 558 450 XAF", fw:"bold", color:"#444"}
        }],
        [{
            label:{
                text: transactionIconAvg,
                tooltip:"Moyenne transactions", fw:"", color:"#444"
            },
            value:{text:"1 855 950 XAF / jour", fw:"bold", color:"#444"}
        }]
    ],
    [
        [{
            label:{
                text: transactionIconTotal,
                tooltip: "Total transactions", 
                fw:"bold", color:"#444"},
            value:{text:"9 850 675 XAF", fw:"bold", color:"#444"}
        }],
        [
            {
                label:{text:checkCircleIcon, tooltip:"Réussies", fw:"", color:"#444", fs:'11px'},
                value:{text:"1399", fw:"bold", color:"#18BC7A", fs:'14px', tooltip:"Réussies",}
            },
            {
                label:{text:ongoingCircleIcon, tooltip:"En cours", fw:"", color:"#444", fs:'11px'},
                value:{text:"577", fw:"bold", color:"#888", fs:'14px', tooltip:"En cours",}
            },
            {
                label:{text:haltCircleIcon, tooltip:"Echouées", fw:"", color:"#444", fs:'11px'},
                value:{text:"780", fw:"bold", color:"#F85D4B", fs:'14px', tooltip:"Echouées",}
            },
        ]
    ],
    [
        [{
            label:{text:depositIconToday, tooltip:"Recharges aujourd'hui", fw:"bold", color:"#444"},
            value:{text:"2 558 450 XAF", fw:"bold", color:"#444"}
        }],
        [{
            label:{
                text: cardDepositIconTotal, //"Total recharges", 
                fw:"", color:"#444"},
            value:{text:"15 855 950 XAF", fw:"bold", color:"#444"}
        }]
    ],
    [
        [{
            label:{text: withdrawalIconToday, tooltip:"Retraits aujourd'hui", fw:"bold", color:"#444"},
            value:{text:"2 558 450 XAF", fw:"bold", color:"#444"}
        }],
        [{
            label:{
                text: cardWithdrawalIconTotal, //"Total retraits", 
                fw:"", color:"#444"},
            value:{text:"15 855 950 XAF", fw:"bold", color:"#444"}
        }]
    ],
    
];

infoData[0][0][0].value.text = 0 + "  XAF";
infoData[0][1][0].value.text = 0 + "  XAF/jour";
infoData[1][0][0].value.text = 0 + "  XAF";
infoData[1][1][0].value.text = 0;
infoData[1][1][1].value.text = 0;
infoData[1][1][2].value.text = 0;
infoData[2][0][0].value.text = 0 + "  XAF";
infoData[2][1][0].value.text = 0 + "  XAF";
infoData[3][0][0].value.text = 0 + "  XAF";
infoData[3][1][0].value.text = 0 + "  XAF";


const getWalletsTransactions = async ({queryKey}:any) => {
    const [_key, st] = queryKey;
    let params:any = {category:'solde'};
    // if(st) params.searchTerm = st;
    // console.log("getTransactions searchTerm : ", st, queryKey);
    
    const response = await TransactionService.get_all_transactions(params);
    const responseJson = await response.json();
    if (!response.ok) {
      throw new Error(responseJson.message || 'Failed to get users'); 
    }  
    console.log("responseJson.data : ", responseJson.data);
    
    return responseJson.data; 
};
const getWalletsTransactionsStats = async () => {
    let params:any = {category:'solde'};
    const response = await TransactionService.get_wallets_transactions_stats(params);
    const responseJson = await response.json();
    if (!response.ok) {
      throw new Error(responseJson.message || 'Failed to get users statistics'); 
    }  
    return responseJson.data; 
};


export default function WalletTransactions() {
    useTitle("Sekure | Transactions wallets", true);
    const searchTerm:string = useSelector(selectSearchTerm);

    const allTrxStatsQueryRes = useQuery({
        queryKey: ["allTrxStats"],
        queryFn: getWalletsTransactionsStats,
        onError: (err) => {
          toast.error("Failed to get wallets transactions stats.");
        },
        refetchInterval: 30000, // Fetches data every 30 seconds
    });
    const allTrxQueryRes = useQuery({
        queryKey: ["allTrxs", searchTerm],
        queryFn: getWalletsTransactions,
        onError: (err) => {
          toast.error("Failed to get wallets transactions.");
        },
        // enabled: false,
        refetchInterval: 45000, // Fetches data every 45 seconds
    });

    console.log("allTrxQueryRes.data : ", allTrxQueryRes.data);
    console.log("allTrxStatsQueryRes.data : ", allTrxStatsQueryRes.data);

    let rearrangedTableData:any[] = [];

    if(allTrxStatsQueryRes?.data) {
        const trxPerStatus = transformArray(allTrxStatsQueryRes?.data?.transactionsPerStatusStats ?? []);
        // console.log("trxPerStatus : ", trxPerStatus);
        
        infoData[0][0][0].value.text = (allTrxStatsQueryRes?.data?.totalTransactionsAmountToday?.toLocaleString('fr-FR') ?? 0) + "  XAF";
        infoData[0][1][0].value.text = Math.round(allTrxStatsQueryRes?.data?.avgTransactionsAmountPerDay?? 0)?.toLocaleString('fr-FR')  + " XAF /jour";
        infoData[1][0][0].value.text = (allTrxStatsQueryRes?.data?.totalTransactionsAmount?.toLocaleString('fr-FR') ?? 0) + "  XAF";
        infoData[1][1][0].value.text = trxPerStatus?.['SUCCESS']?.count?.toLocaleString('fr-FR') ?? 0;
        infoData[1][1][1].value.text = trxPerStatus?.['PENDING']?.count?.toLocaleString('fr-FR') ?? 0;
        infoData[1][1][2].value.text = trxPerStatus?.['FAILED']?.count?.toLocaleString('fr-FR') ?? 0;
        infoData[2][0][0].value.text = (allTrxStatsQueryRes?.data?.recharge_solde?.todayTotal[0]?.todayTotalAmount?.toLocaleString('fr-FR') ?? 0) + "  XAF";
        infoData[2][1][0].value.text = (allTrxStatsQueryRes?.data?.recharge_solde?.avgTotal[0]?.totalAmount?.toLocaleString('fr-FR') ?? 0) + "  XAF";
        infoData[3][0][0].value.text = (allTrxStatsQueryRes?.data?.retrait_solde?.todayTotal[0]?.todayTotalAmount?.toLocaleString('fr-FR') ?? 0) + "  XAF";
        infoData[3][1][0].value.text = (allTrxStatsQueryRes?.data?.retrait_solde?.avgTotal[0]?.totalAmount?.toLocaleString('fr-FR') ?? 0) + "  XAF";

        
	    rearrangedTableData = allTrxQueryRes?.data?.map((item:any, index:any) => {
            const rearrangedItem = {
                serial: index+1,
                type: categoryType[item.category][item.type],
                name: item.merchant?.name,			
                country: item.country,
                phone: item.number,
                        idTrx: item._id,
                amount: item.amount?.toLocaleString('fr-FR') ?? 0,
                method: item.method,
                mode: //item.mode, //item.paymentMethod,
                    getCategoryMode(item.category, item.type, item.mode).mode == 'CREDIT'?
                    <LabelWithBadge icon={<FaLongArrowAltDown color={'#18BC7A'} />} className={`text-xs`} label={`${getCategoryMode(item.category, item.type, item.mode).text}`} badgeColor={'#18BC7A'} textColor={'#444'}/>
                    :
                    getCategoryMode(item.category, item.type, item.mode).mode == 'DEBIT'?
                    <LabelWithBadge icon={<FaLongArrowAltUp color={'#F85D4B'} />}className={`text-xs`} label={`${getCategoryMode(item.category, item.type, item.mode).text}`} badgeColor={'#F85D4B'} textColor={'#444'}/>
                    :
                    <>{item.mode}</>
                    ,
                        status: 
                    item.status == 'SUCCESS'?
                    <LabelWithBadge className={`text-xs`} label={'Réussi'} badgeColor={'#18BC7A'} textColor={'#444'}/>
                    :
                    item.status == 'FAILED' ?
                    <LabelWithBadge className={`text-xs`} label={'Echec'} badgeColor={'#F85D4B'} textColor={'#444'}/>
                    :
                    item.status?.toUpperCase() == 'PENDING' ?
                    <LabelWithBadge className={`text-xs`} label={'En cours'} badgeColor={'orange'} textColor={'#444'}/>
                    :
                    item.status == 'INITIATED' ?
                    <LabelWithBadge className={`text-xs`} label={'Initial'} badgeColor={'#007FFF'} textColor={'#444'}/>
                    :
                    (item.status == 'CANCELLED' || item.status == 'CANCELED') ?
                    <LabelWithBadge className={`text-xs`} label={'Suspendu'} badgeColor={'#444'} textColor={'#444'}/>
                    :
                    <></>
                    // <LabelWithBadge className={`text-xs`} label={'En cours'} badgeColor={'#000'} textColor={'#000'}/>
                    // <ActiveYesNo isActive={item.status} label="Réussi"/>
                    // :<ActiveYesNo isActive={item.status} label="Echec"/>
                ,			
                date: getFormattedDateTime(item.createdAt),
                actions: <>
            <div className='flex gap-5'>
            <CButton
            text={'Details'}
            href={`?transaction${index+1}=true`}
            btnStyle={'dark'}
            icon={<FourDots />}              
            />
            <Modal index={index+1} name={'transaction'} modalContent={<TransactionModal customer={item?.userDetails} item={item}/>}/>
                </div>
                </>
            };
            item = rearrangedItem;
            return item;
        });
    }

	return (
		<Layout
		title={"Transactions wallet"}
		>
            <section className='mt-2'>
                {allTrxStatsQueryRes?.status === 'loading' ? 
                    <div className="flex justify-center w-full py-10">
                        <div className={'loadingSpinner'}></div>
                    </div>
                    :
                    <InfoCardGrid infoData={infoData}/>
                }
                {/* <div 
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
                </div> */}
                

                <div className="my-[50px]">
                    <div className="mb-5">
                        <Title 
                        title={"Liste des transactions"}
                        subtitle={"Liste en temps réel des dernières transactions effectuées avec les wallets."}
                        />
                    </div>
                    <CustomTable
                    headerData={headerTransactionData}
                    tableData={rearrangedTableData}
                    threeButtons
                    filter
                    isLoading={allTrxQueryRes.status == 'loading'}
                    />
                </div>
            </section>
			
	  </Layout>
	);
}

