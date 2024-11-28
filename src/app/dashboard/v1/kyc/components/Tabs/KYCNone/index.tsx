import ActiveYesNo from "@/components/shared/ActiveYesNo";
import CButton from "@/components/shared/CButton";
import CustomTable from "@/components/shared/CustomTable";
import LabelWithBadge from "@/components/shared/LabelWithBadge";
import { FourDots } from "@/components/shared/icons";
import { headerKYCData, tableKYCData as data } from "@/constants/KYCData";
import { selectKYCAll, selectKYCNone } from "@/redux/slices/kyc";
import { getFormattedDateTime } from "@/utils/DateFormat";
import { FaLock } from "react-icons/fa";
import { useSelector } from "react-redux";
import urls from '@/config/urls';

type Props = {
	isLoading?:boolean;
	search?:string; 
	setSearch?:(data?:any)=>void;
}
export default function Index({isLoading, search, setSearch}:Props) {

	const kycAll:any = useSelector(selectKYCNone);

  	const rearrangedTableData = kycAll?.map((item:any, index:any) => {
		const rearrangedItem = {
			serial: index+1,
			name: item.name,			
			country: item.pays,
			phone: item.phone,
			email: item.email,
			status: item.kyc_status == 'accepted' 
				?<LabelWithBadge label="Approuvé" badgeColor="#18BC7A"/>
				:item.kyc_status == 'blocked'
				?<LabelWithBadge label="Bloqué" badgeColor="#F85D4B"/>
				:item.kyc_status == 'ongoing'
				?<LabelWithBadge label="En cours" badgeColor="#999"/>
				:<LabelWithBadge label="Aucun" badgeColor="#000"/>,
			created: getFormattedDateTime(item.createdAt),
			actions: <>
			<div className='flex gap-5'>
				<CButton
                text={'Manager'}
                href={`${urls.usersAccounts.manage}/${item._id}`}
                btnStyle={'dark'}
                icon={<FourDots />}              
                />
			  {/* <CButton 
			  text={'Editer'}
			  href={`kyc/edit/${item.id}`}
			  btnStyle={'dark'}
			  icon={<FourDots />} 
			  />
			  <CButton 
			  text={'Valider'} 
			  btnStyle={'yellow'}
			  icon={<FaLock />} 
			  />
			  <CButton 
			  text={'Rejeter'} 
			  btnStyle={'yellow'}
			  icon={<FaLock />} 
			  /> */}
			  </div>
			</>
		};
		item = rearrangedItem;
		return item;
	});


  return (
    <section>
      <CustomTable
        headerData={headerKYCData}
        tableData={rearrangedTableData}
        filter
		threeButtons
		isLoading={isLoading && !kycAll}
		search={search}
		setSearch={setSearch}
      />
    </section>
  )
}
