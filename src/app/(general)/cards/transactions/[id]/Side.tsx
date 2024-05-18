import CartesCard from "@/components/cards/CartesCard/CartesCard";
import ActiveYesNo from "@/components/shared/ActiveYesNo";
import CButton from "@/components/shared/CButton";
import { FourDots } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { FaLock } from "react-icons/fa";
import { PiCirclesFourFill } from "react-icons/pi";

const cardOne = {
  id: 5,
  cardNumber: '1234 5678 9101 2345',
  type: "visa",
  matricule: 'skrcV55871327',
  date: '14 / 01 / 2024',
  solde: '215 000 Fcfa',
  status: 'Active',
  activateDate: 'il y a 02 mois'
};

export default function Side() {

  return (
    <div className="w-[300px] flex flex-col gap-y-[25px]  pr-5 border-r-1">
        
        <CartesCard
          key={cardOne.id}
          title={'Informations de carte'}
          cardNumber={cardOne.cardNumber}
          type={cardOne.type}
          matricule={cardOne.matricule}
          date={cardOne.date}
          solde={cardOne.solde}
          status={cardOne.status}
          activateDate={cardOne.activateDate}
          expanded
          nbPayments={'88'}
          nbPaymentsSuccess={'70'}
          nbPaymentsFailed={'18'}
          cardBalance={' 580 760'}
          totalBalance={'2 500 750'}
          average={'45 450'}
        />
      </div>
  )
}
