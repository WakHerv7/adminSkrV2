"use client"
import ActiveYesNo from "@/components/shared/ActiveYesNo";
import CButton from "@/components/shared/CButton";
import CustomTable from "@/components/shared/CustomTable";
import Title from "@/components/shared/Title";
import { FourDots } from "@/components/shared/icons";
import {
  headerTransactionData as headerData, tableTransactionData as tableData
} from "@/constants/Index";
  

export default function Main() {
  const rearrangedTableData = tableData.map((item:any, index:any) => {
		const rearrangedItem = {
			serial: index+1,
			type: item.type,
            name: item.name,			
            country: item.country,
            phone: item.phone,
			idTrx: item.idTrx,
            amount: item.amount,
            paymentMethod: item.paymentMethod,
			status: 
                item.status ?
                <ActiveYesNo isActive={item.status} label="Réussi"/>
                :<ActiveYesNo isActive={item.status} label="Echec"/>
            ,			
			date: item.date,
			actions: <>
			
			</>
		};
		item = rearrangedItem;
		return item;
	});

  return (
    <>
    <div className="">
      <div className="mb-5">
        <Title title={"Liste des transactions effectuées sur la carte"} />
      </div>
      <CustomTable
        headerData={headerData}
        tableData={rearrangedTableData}
        threeButtons
      />
    </div>
    </>
  )
}
