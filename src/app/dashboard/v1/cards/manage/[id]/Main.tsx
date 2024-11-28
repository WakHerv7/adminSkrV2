"use client"
import TransactionModal from "@/app/dashboard/v1/wallet_transactions/components/TransactionModal";
import ActiveYesNo from "@/components/shared/ActiveYesNo";
import CButton from "@/components/shared/CButton";
import CustomTable from "@/components/shared/CustomTable";
import LabelWithBadge from "@/components/shared/LabelWithBadge";
import Modal from "@/components/shared/Modal/Modal";
import Title from "@/components/shared/Title";
import { FourDots } from "@/components/shared/icons";
import { headerCardTransactionData2 as headerData } from "@/constants/TransactionData";
import { selectCardTransactions, selectCurrentCard } from "@/redux/slices/card";
import { getFormattedDateTime } from "@/utils/DateFormat";
import { categoryType, getCategoryMode } from "@/utils/graphs";
import { FaCheckCircle, FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import { IoEllipsisHorizontalCircleSharp } from "react-icons/io5";
import { useSelector } from "react-redux";

type Props = {
	isLoading?:boolean;
	isLoadingStats?:boolean;
	search?:string; 
	setSearch?:(data?:any)=>void;
  // card:any;
  // transactions:any;
}

export default function Main({isLoading, isLoadingStats, search, setSearch}:Props) {
	const currentCardData:any = useSelector(selectCurrentCard);
  
  	const transactionsData:any = useSelector(selectCardTransactions);

  	const rearrangedTableData = transactionsData?.map((item:any, index:any) => {
		const rearrangedItem = {
			serial: index+1,
			type: categoryType[item.category][item.type],
			name: item.merchant?.name,
			// card: item.cardDetails?.maskedNumber,			
			// country: item.country,
			// phone: item.number,
			// idTrx: item._id,
			amount: item.amount?.toLocaleString('fr-FR') ?? 0,
			method: item.method,
			mode: 
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

  return (
    <>
	{isLoadingStats ? 
        <div className="flex justify-center w-full py-10">
            <div className={'loadingSpinner'}></div>
        </div>
        :
		<div className="w-full flex justify-start items-center">
			<div className="pr-10">
				<h1 className="text-sm font-semibold mb-2">Nombre de paiements<span className="text-base font-semibold text-[#18BC7A] ml-5">{currentCardData?.paymentStats?.totalCount ?? 0}</span></h1>
				<div className="flex justify-start items-center gap-10 w-full">
				<p title="Réussis" className=" flex items-center gap-2 text-sm font-normal">
					{/* Actives  */}
					<FaCheckCircle size={24} color="#18BC7A"/>
					<span className="ml-1 font-bold">{currentCardData?.paymentStats?.totalSuccessCount ?? 0}</span>
				</p>
				<p title="En cours" className=" flex items-center gap-2 text-sm font-normal">
					<IoEllipsisHorizontalCircleSharp size={24} color="#777"/>
					<span className="ml-1 font-bold">{currentCardData?.paymentStats?.totalPendingCount ?? 0}</span>
				</p>
				<p title="Echoués" className=" flex items-center gap-2 text-sm font-normal">
					<IoMdCloseCircle size={24} color="#F85D4B"/>
					<span className="ml-1 font-bold">{currentCardData?.paymentStats?.totalFailedCount ?? 0}</span>
				</p>
				</div>
			</div>
			{/* <Separator orientation="vertical" className="h-10 mr-10" /> */}
			<div className="h-full pt-2 border-l-1 px-10">
				<h1 className="text-sm font-bold mb-2">Total paiements réussis</h1>
				<p className="text-xl font-bold text-[#18BC7A]">{currentCardData?.paymentStats?.totalSuccessAmount?.toLocaleString('fr-FR') ?? 0} XAF</p>
			</div>
			{/* <Separator orientation="vertical" className="h-10 mr-10" /> */}
			<div className="h-full border-l-1 px-10">
				<h1 className="text-sm font-bold mb-2">moyenne paiements par semaine</h1>
				<p className="text-xl font-bold text-[#18BC7A]">{Math.round(currentCardData?.paymentStats?.averageTransactionsPerWeek?.amount ?? 0)?.toLocaleString('fr-FR') ?? 0} XAF / sem</p>
			</div>
		</div>
	}
    <div className="mt-[70px]">
      <div className="mb-3">
        <Title title={"Liste des transactions effectuées sur la carte"} />
      </div>
      <CustomTable
        headerData={headerData}
        tableData={rearrangedTableData}
        filter
        // threeButtons
        isLoading={isLoading && !transactionsData}
        search={search}
		setSearch={setSearch}
      />
    </div>
    </>
  )
}
