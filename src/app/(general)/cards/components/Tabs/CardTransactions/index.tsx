import ActiveYesNo from "@/components/shared/ActiveYesNo";
import CButton from "@/components/shared/CButton";
import CustomTable from "@/components/shared/CustomTable";
import LabelWithBadge from "@/components/shared/LabelWithBadge";
import { FourDots } from "@/components/shared/icons";
import { headerKYCData, tableKYCData as data } from "@/constants/KYCData";
import { FaLock } from "react-icons/fa";


export default function index() {

  const rearrangedTableData = data.map((item, index) => {
		const rearrangedItem = {
			id: index+1,
			name: item.name,			
			country: item.country,
			phone: item.phone,
			email: item.email,
			status: item.status == 'accepted' 
				?<LabelWithBadge label="Approuvé" badgeColor="#18BC7A"/>
				:item.status == 'rejected'
				?<LabelWithBadge label="Rejeté" badgeColor="#F85D4B"/>
				:<LabelWithBadge label="En attente" badgeColor="#444"/>,
			created: item.date,
			actions: <>
			<div className='flex gap-5'>
			  <CButton 
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
			  />
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
      />
    </section>
  )
}
