import CartesCard from "@/components/cards/CartesCard/CartesCard";
import Doughnut from "@/components/charts/Doughnut";

import { doughnutData } from "@/constants/Index";
import { selectCurrentUser } from "@/redux/slices/auth";
import { selectCurrentCustomerDetails } from "@/redux/slices/customer";
import { getFormattedDateTime } from "@/utils/DateFormat";
import { retrieveUSDAmount } from "@/utils/utils";
import { useSelector } from "react-redux";

type Card = {
  id: number,
  cardNumber: string,
  type: string,
  matricule: string,
  date: string,
  solde: string,
  status: string,
  activateDate: string,
}

const CartesMain = ({cards}:{cards: Card[]}) => {

  const customerDetails:any = useSelector(selectCurrentCustomerDetails);
  
  return (
      <div style={{display:customerDetails?.cards?.data ? 'grid' : 'none'}}className="grid-cols-3 gap-10 mb-[100px]">
        {customerDetails?.cards?.data.map((carte:any, index:number) => {
          const cardXAFAmount = `${carte.amount?.toLocaleString('fr-FR') ?? 0} XAF`;
          const cardUSDAmount = `${retrieveUSDAmount({amount:carte?.amount, amountUSD:carte?.amountUSD})?.toLocaleString('fr-FR')} USD`;
          return <CartesCard
            key={index}
            index={index+1}
            card={carte}
            customer={customerDetails?.customer}
            cardNumber={carte.number}
            type={carte.brand ?? ""}
            matricule={carte.reference ?? ""}
            date={getFormattedDateTime(carte.createdAt) ?? ""}
            solde={cardXAFAmount}
            soldeUSD={cardUSDAmount}
            status={carte.status ?? ""}
            activateDate={getFormattedDateTime(carte.balanceUpdatedAt) ?? ""}
            // color={carte.color ?? "FFDB5A"}
          />
      })}
      </div>
  )
}



export default CartesMain;