import CartesCard from "@/components/cards/CartesCard/CartesCard";
import Doughnut from "@/components/charts/Doughnut";

import { doughnutData } from "@/constants/Index";

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
  return (
      <div className="grid grid-cols-3 gap-10 mb-[100px]">
        {cards.map((carte) => (
          <CartesCard
            key={carte.id}
            cardNumber={carte.cardNumber}
            type={carte.type}
            matricule={carte.matricule}
            date={carte.date}
            solde={carte.solde}
            status={carte.status}
            activateDate={carte.activateDate}
          />
        ))}
      </div>
  )
}

export default CartesMain;