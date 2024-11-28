import TransactionModal from "@/app/dashboard/v1/wallet_transactions/components/TransactionModal";
import CButton from "@/components/shared/CButton";
import CustomTable from "@/components/shared/CustomTable";
import LabelWithBadge from "@/components/shared/LabelWithBadge";
import Modal from "@/components/shared/Modal/Modal";
import { FourDots } from "@/components/shared/icons";
import { headerCardTransactionData as headerData } from "@/constants/TransactionData";
import { selectCardPayments } from "@/redux/slices/card";
import { setSearchConcern } from "@/redux/slices/search";
import { getFormattedDateTime } from "@/utils/DateFormat";
import { categoryType, getCategoryMode } from "@/utils/graphs";
import { FaLock, FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

type Props = {
	isLoading?:boolean;
	search?:string; 
	setSearch?:(data?:any)=>void;
}
export default function Index({isLoading, search, setSearch}:Props) {
	// const dispatch = useDispatch();
	// dispatch(setSearchConcern('cardPayments'));

	const transactionsData:any = useSelector(selectCardPayments);

  	// const rearrangedTableData = data.filter(item => item.status!== 'accepted' && item.status!== 'rejected').map((item, index) => {
	const rearrangedTableData = transactionsData?.map((item:any, index:any) => {
		const rearrangedItem = {
			serial: index+1,
			type: categoryType[item.category][item.type],
			name: item.merchant?.name,
			card: item.cardDetails?.maskedNumber,			
			country: item.country,
			phone: item.number,
					idTrx: item._id,
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
    <section>
      <CustomTable
        headerData={headerData}
        tableData={rearrangedTableData}
        filter
		threeButtons
		isLoading={isLoading && !transactionsData}
		search={search}
		setSearch={setSearch}
      />
    </section>
  )
}
