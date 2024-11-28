"use client"
import { useTitle } from "@/hooks/useTitle";
import toast from "react-hot-toast";
import { useQuery } from "react-query";

import { TDataList } from "@/components/cards/InfoCard";
import CButton from "@/components/shared/CButton";
import CustomTable from "@/components/shared/CustomTable";
import { FourDots } from "@/components/shared/icons";
import Layout from "@/components/shared/Layout";
import Title from "@/components/shared/Title";
import {
    headerTransferData as headerData
} from "@/constants/Index";
import { transformArray } from "@/utils/utils";
import { FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa";

import { TransactionService } from "@/api/services/transaction";
import InfoCardGrid from "@/components/cards/InfoCardGrid";
import LabelWithBadge from "@/components/shared/LabelWithBadge";
import Modal from "@/components/shared/Modal/Modal";
import {
    checkCircleIcon,
    haltCircleIcon,
    ongoingCircleIcon,
    transferIconAvg,
    transferIconMomoToday,
    transferIconMomoTotal,
    transferIconSekureToday,
    transferIconSekureTotal,
    transferIconToday,
    transferIconTotal
} from '@/constants/Index';
import { selectSearchTerm } from "@/redux/slices/search";
import { getFormattedDateTime } from "@/utils/DateFormat";
import { categoryType, getCategoryMode } from "@/utils/graphs";
import { useSelector } from "react-redux";
import TransactionModal from "../wallet_transactions/components/TransactionModal";

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
                label:{text:haltCircleIcon, tooltip:"Bloqués", fw:"", color:"#444", fs:'11px'},
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


const getTransfers = async ({queryKey}:any) => {
    const [_key, st] = queryKey;
    let params:any = {category:'transfert', type:'transfert'};
    // if(st) params.searchTerm = st;
    // console.log("getTransactions searchTerm : ", st, queryKey);
    const response = await TransactionService.get_all_transactions(params);
    const responseJson = await response.json();
    if (!response.ok) {
      throw new Error(responseJson.message || 'Failed to get tranfers'); 
    }  
    console.log("responseJson.data : ", responseJson.data);
    return responseJson.data; 
};
const getTransfersStats = async () => {
    let params:any = {};
    const response = await TransactionService.get_transfers_stats(params);
    const responseJson = await response.json();
    if (!response.ok) {
      throw new Error(responseJson.message || 'Failed to get tranfers statistics'); 
    }  
    return responseJson.data; 
};


export default function AllTransfers() {
    useTitle("Sekure | Transferts", true);
    const searchTerm:string = useSelector(selectSearchTerm);

    const allTrxStatsQueryRes = useQuery({
        queryKey: ["allTrxStats"],
        queryFn: getTransfersStats,
        onError: (err) => {
          toast.error("Failed to get tranfers stats.");
        },
        refetchInterval: 30000, // Fetches data every 30 seconds
    });
    const allTrxQueryRes = useQuery({
        queryKey: ["allTrxs", searchTerm],
        queryFn: getTransfers,
        onError: (err) => {
          toast.error("Failed to get tranfers.");
        },
        // enabled: false,
        refetchInterval: 45000, // Fetches data every 45 seconds
    });

    console.log("allTrxQueryRes.data : ", allTrxQueryRes.data);
    console.log("allTrxStatsQueryRes.data : ", allTrxStatsQueryRes.data);

    let rearrangedTableData:any[] = [];

    if(allTrxStatsQueryRes?.data) {
        const trxPerStatus = transformArray(allTrxStatsQueryRes?.data?.transactionsPerStatusStats ?? []);
        console.log("trxPerStatus : ", trxPerStatus);
        
        infoData[0][0][0].value.text = (allTrxStatsQueryRes?.data?.totalTransactionsAmountToday?.toLocaleString('fr-FR') ?? 0) + "  XAF";
        infoData[0][1][0].value.text = Math.round(allTrxStatsQueryRes?.data?.avgTransactionsAmountPerDay?? 0)?.toLocaleString('fr-FR')  + " XAF /jour";
        infoData[1][0][0].value.text = (allTrxStatsQueryRes?.data?.totalTransactionsAmount?.toLocaleString('fr-FR') ?? 0) + "  XAF";
        infoData[1][1][0].value.text = trxPerStatus?.['null']?.count?.toLocaleString('fr-FR') ?? 0;
        infoData[1][1][1].value.text = trxPerStatus?.['PENDING']?.count?.toLocaleString('fr-FR') ?? 0;
        infoData[1][1][2].value.text = trxPerStatus?.['FAILED']?.count?.toLocaleString('fr-FR') ?? 0;
        infoData[2][0][0].value.text = (allTrxStatsQueryRes?.data?.retrait_solde?.todayTotal?.[0]?.todayTotalAmount?.toLocaleString('fr-FR') ?? 0) + "  XAF";
        infoData[2][1][0].value.text = (allTrxStatsQueryRes?.data?.retrait_solde?.avgTotal?.[0]?.totalAmount?.toLocaleString('fr-FR') ?? 0) + "  XAF";
        infoData[3][0][0].value.text = (allTrxStatsQueryRes?.data?.transfert_solde?.todayTotal?.[0]?.todayTotalAmount?.toLocaleString('fr-FR') ?? 0) + "  XAF";
        infoData[3][1][0].value.text = (allTrxStatsQueryRes?.data?.transfert_solde?.avgTotal?.[0]?.totalAmount?.toLocaleString('fr-FR') ?? 0) + "  XAF";

        
	    rearrangedTableData = allTrxQueryRes?.data?.map((item:any, index:any) => {
            const rearrangedItem = {
                serial: index+1,
                type: categoryType[item.category][item.type],
                expeditor: item.userDetails?.phone,			
                countryExp: item.userDetails?.pays,
                recipient: item.recipientDetails?.phone,
                countryRec: item.recipientDetails?.pays,
                idTrx: item._id,
                amount: item.amount?.toLocaleString('fr-FR') ?? 0,
                // method: item.method,
                // mode: //item.mode, //item.paymentMethod,
                //     getCategoryMode(item.category, item.type, item.mode).mode == 'CREDIT'?
                //     <LabelWithBadge icon={<FaLongArrowAltDown color={'#18BC7A'} />} className={`text-xs`} label={`${getCategoryMode(item.category, item.type, item.mode).text}`} badgeColor={'#18BC7A'} textColor={'#444'}/>
                //     :
                //     getCategoryMode(item.category, item.type, item.mode).mode == 'DEBIT'?
                //     <LabelWithBadge icon={<FaLongArrowAltUp color={'#F85D4B'} />}className={`text-xs`} label={`${getCategoryMode(item.category, item.type, item.mode).text}`} badgeColor={'#F85D4B'} textColor={'#444'}/>
                //     :
                //     <>{item.mode}</>
                //     ,
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
                        <Modal index={index+1} name={'transaction'} modalContent={<TransactionModal customer={item?.userDetails} recipient={item?.recipientDetails} item={item}/>}/>
                    </div>
                </>
            };
            item = rearrangedItem;
            return item;
        });
    }

	return (
		<Layout
		title={"Transferts d'argent"}
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
                </div> */}
                

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
                    isLoading={allTrxQueryRes.status == 'loading'}
                    />
                </div>
            </section>
			
	  </Layout>
	);
}

