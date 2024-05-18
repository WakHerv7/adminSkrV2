import ActiveYesNo from "@/components/shared/ActiveYesNo";
import CButton from "@/components/shared/CButton";
import CustomTable from "@/components/shared/CustomTable";
import LabelWithBadge from "@/components/shared/LabelWithBadge";
import { FourDots } from "@/components/shared/icons";
import { headerCardData, tableCardData as data } from "@/constants/CardData";
import { FaLock, FaTrash } from "react-icons/fa";
import { GrTransaction } from "react-icons/gr";


export default function index() {

  const rearrangedTableData = data.map((item, index) => {
		const rearrangedItem = {
			id: index+1,
			type: item.type,
			regNumber: item.regNumber,
			cardNumber: item.cardNumber,
			name: item.name,
			cardAmount: item.cardAmount,			
			totalPayments: item.totalPayments,
			status: <ActiveYesNo isActive={item.status}/>,
			created: item.date,
			actions: <>
			<div className='flex gap-5'>
			<CButton 
			text={''}
			toolTip={'Transactions'}
			href={`cards/transactions/${index+1}`}
			btnStyle={'dark'}
			icon={<GrTransaction />} 
			/>
			<CButton 
			text={''} 
			toolTip={'Bloquer'} 
			btnStyle={'yellow'}
			icon={<FaLock />} 
			/>
			<CButton 
			text={''} 
			toolTip={'Supprimer'} 
			btnStyle={'red'}
			icon={<FaTrash />} 
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
        headerData={headerCardData}
        tableData={rearrangedTableData}
  		filter
		threeButtons
      />
    </section>
  )
}
