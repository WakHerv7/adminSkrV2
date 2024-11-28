import ActiveYesNo from "@/components/shared/ActiveYesNo";
import CButton from "@/components/shared/CButton";
import CustomTable from "@/components/shared/CustomTable";
import LabelWithBadge from "@/components/shared/LabelWithBadge";
import { FourDots } from "@/components/shared/icons";
import { headerCardData, tableCardData as data } from "@/constants/CardData";
import { selectCardList } from "@/redux/slices/card";
import { setSearchConcern } from "@/redux/slices/search";
import { getFormattedDateTime } from "@/utils/DateFormat";
import { FaLock, FaTrash } from "react-icons/fa";
import { GrTransaction } from "react-icons/gr";
import { useDispatch, useSelector } from "react-redux";
import urls from '@/config/urls';
type Props = {
	isLoading?:boolean;
	search?:string; 
	setSearch?:(data?:any)=>void;
}
export default function Index({isLoading, search, setSearch}:Props) {
	// const dispatch = useDispatch();
	// dispatch(setSearchConcern('cardList'));

	const cardList:any = useSelector(selectCardList);
	
	const rearrangedTableData = cardList?.map((item:any, index:number) => {
		const rearrangedItem = {
			serial: index+1,
			type: item.brand,
			cardNumber: item.maskedNumber,
			name: item.name,
			phone: item?.userDetails?.phone,
			cardAmount: item.amount,			
			totalPayments: item.totalPaymentAmount,
			status: 
				item.status == 'ACTIVE'?
				<LabelWithBadge className={`text-xs`} label={'Active'} badgeColor={'#18BC7A'} textColor={'#444'}/>
				:
				item.status == 'DISABLED' ?
				<LabelWithBadge className={`text-xs`} label={'Désactivée'} badgeColor={'#F85D4B'} textColor={'#444'}/>
				:
				item.status == 'FREEZE' ?
				<LabelWithBadge className={`text-xs`} label={'Bloquée'} badgeColor={'#444'} textColor={'#444'}/>
				:
				<></>
				// <LabelWithBadge className={`text-xs`} label={'En cours'} badgeColor={'#000'} textColor={'#000'}/>
				// <ActiveYesNo isActive={item.status} label="Réussi"/>
				// :<ActiveYesNo isActive={item.status} label="Echec"/>
			,			
			date: getFormattedDateTime(item.createdAt),
			actions: <>
				<CButton
                text={'Manager'}
                href={`${urls.cards.manage}/${item._id}`}
                btnStyle={'dark'}
                icon={<FourDots />}              
                />
				</>
		};
		item = rearrangedItem;
		return item;
	});


  return (
    <section>
      <CustomTable
        headerData={headerCardData}
        tableData={rearrangedTableData}
  		filter
		threeButtons
		isLoading={isLoading}
		search={search}
		setSearch={setSearch}
      />
    </section>
  )
}
