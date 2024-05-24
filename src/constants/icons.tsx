import { MdCheckCircle, MdChangeCircle, MdRemoveCircle } from "react-icons/md"
import { IoIosCloseCircle } from "react-icons/io";
import { IoEllipsisHorizontalCircleSharp } from "react-icons/io5";
import { BiTransferAlt } from "react-icons/bi";
import { MdOutlinePhoneIphone } from "react-icons/md";
import { MdAttachMoney } from "react-icons/md";
import { FaFolder, FaLock, FaRegCalendarCheck } from "react-icons/fa";
import { GrTransaction } from "react-icons/gr";
import { BsFillBookmarkCheckFill } from "react-icons/bs";
import { FaRegCreditCard } from "react-icons/fa6";
import { TbSum } from "react-icons/tb";
// import { PiHandWithdraw } from "react-icons/pi";
// import { PiHandDeposit } from "react-icons/pi";

export const checkCircleIcon = <MdCheckCircle size={24} color={"#18BC7A"} />;
export const folderIcon = <FaFolder size={24} color={"#777"} />;
export const lockedIcon = <FaLock size={20} color={"#777"} />;
export const verifiedIcon = <BsFillBookmarkCheckFill size={20} color={"#777"} />;
export const ongoingCircleIcon = <MdChangeCircle size={24} color={"#777"} />;
export const waitCircleIcon = <IoEllipsisHorizontalCircleSharp size={24} color={"#777"} />;
export const haltCircleIcon = <MdRemoveCircle size={24} color={"#F85D4B"} />;
export const haltCircleIconGray = <MdRemoveCircle size={24} color={"#777"} />;
export const closeCircleIcon = <IoIosCloseCircle size={24} color={"#F85D4B"} />;
export const calendarIcon = <FaRegCalendarCheck size={20} color={"#444"} />;
export const creditCardIcon = <FaRegCreditCard size={20} color={"#444"} />;
export const totalIcon = <TbSum size={20} color={"#444"} />;




export const transferIcon = <BiTransferAlt size={24} color={"#444"} />;
export const transferIconToday = <span className="flex gap-1">{transferIcon} {calendarIcon}</span>;  // aujourd'hui
export const transferIconAvg = <span className="flex gap-1">Moy. {transferIcon}</span>;
export const transferIconTotal = <span className="flex gap-1">{totalIcon} {transferIcon}</span>;

export const mobileMoneyIcon = <span className="relative">
    <MdOutlinePhoneIphone size={24}/>
    <span style={{position:`absolute`, top:'3px', right:'4px', background:'white'}}>
        <MdAttachMoney size={16} />
    </span>
</span>

export const sekureIcon = <svg width="17" height="18" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0 15.2849H3.76171C3.76171 16.7444 4.92183 17.9278 6.35581 17.9278C7.59312 17.9278 8.62632 17.0472 8.88772 15.8684C8.95992 15.5281 9.25617 15.2857 9.59973 15.2857C10.7599 15.2849 13.115 15.2849 13.6577 15.2849C13.6876 15.2849 13.715 15.2971 13.7374 15.3189C13.7573 15.3407 13.7697 15.3701 13.7697 15.4008C13.7299 18.1002 12.2984 20.4564 10.1748 21.7592H2.53687C1.49872 21.1218 0.624879 20.2322 0 19.1736V15.2849ZM14.437 21.7592V17.9278C15.8709 17.9278 17.0335 16.7444 17.0335 15.2849C17.0335 14.0257 16.1672 12.9721 15.0096 12.7066C14.676 12.6313 14.4394 12.3293 14.4394 11.9809C14.437 10.8003 14.437 8.40156 14.437 7.84879C14.437 7.8181 14.4494 7.78895 14.4718 7.76739C14.4917 7.74584 14.5216 7.73392 14.5515 7.73417C17.2029 7.775 19.5156 9.23225 20.7953 11.3962V19.1736C20.1679 20.2325 19.2941 21.122 18.2559 21.7592H14.437ZM6.35581 0.578766V4.41016C4.92183 4.41016 3.76171 5.59356 3.76171 7.05309C3.76171 8.3123 4.62557 9.36588 5.78322 9.63162C6.11682 9.70667 6.35581 10.0087 6.35581 10.3573C6.35581 11.5377 6.35581 13.9364 6.35581 14.4892C6.35581 14.5199 6.3434 14.5493 6.32348 14.5706C6.30107 14.5922 6.27118 14.6041 6.2413 14.6038C3.59241 14.563 1.27714 13.1057 0 10.9418V3.16439C0.624879 2.10575 1.49872 1.21598 2.53687 0.578766H6.35581ZM12.2237 10.673C12.2237 10.2754 12.0669 9.89431 11.793 9.61311C11.5167 9.33216 11.1408 9.17418 10.7524 9.17418H9.57979C9.18893 9.17418 8.81553 9.33216 8.53919 9.61311C8.26285 9.89431 8.10847 10.2754 8.10847 10.673V11.8658C8.10847 12.2631 8.26285 12.6445 8.53919 12.9255C8.81553 13.2067 9.18893 13.3646 9.57979 13.3646H10.7524C11.1408 13.3646 11.5167 13.2067 11.793 12.9255C12.0669 12.6445 12.2237 12.2631 12.2237 11.8658V10.673ZM18.2559 0.578766C19.2941 1.21623 20.1679 2.10575 20.7953 3.16439V7.05309H17.0335C17.0335 5.59356 15.8709 4.41016 14.437 4.41016C13.2021 4.41016 12.1665 5.2908 11.9051 6.46963C11.8329 6.81017 11.5366 7.05233 11.193 7.05233C10.0354 7.0531 7.68027 7.05309 7.13755 7.05309C7.10767 7.05309 7.07782 7.04092 7.0579 7.01912C7.03549 6.99731 7.02303 6.9679 7.02552 6.93721C7.06535 4.23774 8.49436 1.88159 10.6204 0.578766H18.2559Z" fill="#18BC7A"/>
<path d="M0 15.2849H3.76171C3.76171 16.7444 4.92183 17.9278 6.35581 17.9278C7.59312 17.9278 8.62632 17.0472 8.88772 15.8684C8.95992 15.5281 9.25617 15.2857 9.59973 15.2857C10.7599 15.2849 13.115 15.2849 13.6577 15.2849C13.6876 15.2849 13.715 15.2971 13.7374 15.3189C13.7573 15.3407 13.7697 15.3701 13.7697 15.4008C13.7299 18.1002 12.2984 20.4564 10.1748 21.7592H2.53687C1.49872 21.1218 0.624879 20.2322 0 19.1736V15.2849ZM14.437 21.7592V17.9278C15.8709 17.9278 17.0335 16.7444 17.0335 15.2849C17.0335 14.0257 16.1672 12.9721 15.0096 12.7066C14.676 12.6313 14.4394 12.3293 14.4394 11.9809C14.437 10.8003 14.437 8.40156 14.437 7.84879C14.437 7.8181 14.4494 7.78895 14.4718 7.76739C14.4917 7.74584 14.5216 7.73392 14.5515 7.73417C17.2029 7.775 19.5156 9.23225 20.7953 11.3962V19.1736C20.1679 20.2325 19.2941 21.122 18.2559 21.7592H14.437ZM6.35581 0.578766V4.41016C4.92183 4.41016 3.76171 5.59356 3.76171 7.05309C3.76171 8.3123 4.62557 9.36588 5.78322 9.63162C6.11682 9.70667 6.35581 10.0087 6.35581 10.3573C6.35581 11.5377 6.35581 13.9364 6.35581 14.4892C6.35581 14.5199 6.3434 14.5493 6.32348 14.5706C6.30107 14.5922 6.27118 14.6041 6.2413 14.6038C3.59241 14.563 1.27714 13.1057 0 10.9418V3.16439C0.624879 2.10575 1.49872 1.21598 2.53687 0.578766H6.35581ZM12.2237 10.673C12.2237 10.2754 12.0669 9.89431 11.793 9.61311C11.5167 9.33216 11.1408 9.17418 10.7524 9.17418H9.57979C9.18893 9.17418 8.81553 9.33216 8.53919 9.61311C8.26285 9.89431 8.10847 10.2754 8.10847 10.673V11.8658C8.10847 12.2631 8.26285 12.6445 8.53919 12.9255C8.81553 13.2067 9.18893 13.3646 9.57979 13.3646H10.7524C11.1408 13.3646 11.5167 13.2067 11.793 12.9255C12.0669 12.6445 12.2237 12.2631 12.2237 11.8658V10.673ZM18.2559 0.578766C19.2941 1.21623 20.1679 2.10575 20.7953 3.16439V7.05309H17.0335C17.0335 5.59356 15.8709 4.41016 14.437 4.41016C13.2021 4.41016 12.1665 5.2908 11.9051 6.46963C11.8329 6.81017 11.5366 7.05233 11.193 7.05233C10.0354 7.0531 7.68027 7.05309 7.13755 7.05309C7.10767 7.05309 7.07782 7.04092 7.0579 7.01912C7.03549 6.99731 7.02303 6.9679 7.02552 6.93721C7.06535 4.23774 8.49436 1.88159 10.6204 0.578766H18.2559Z" fill="#18BC7A"/>
<path d="M12.2232 10.6731C12.2232 10.2755 12.0663 9.89442 11.7925 9.61321C11.5161 9.33226 11.1402 9.17429 10.7519 9.17429H9.57923C9.18837 9.17429 8.81496 9.33226 8.53862 9.61321C8.26228 9.89442 8.10791 10.2755 8.10791 10.6731V11.8659C8.10791 12.2632 8.26228 12.6446 8.53862 12.9256C8.81496 13.2068 9.18837 13.3647 9.57923 13.3647H10.7519C11.1402 13.3647 11.5161 13.2068 11.7925 12.9256C12.0663 12.6446 12.2232 12.2632 12.2232 11.8659V10.6731Z" fill="#FFDB5A"/>
</svg>

export const transferIconMomoToday = <span className="flex gap-1">{transferIcon} vers {mobileMoneyIcon} {calendarIcon}</span>;
export const transferIconMomoTotal = <span className="flex gap-1">{totalIcon} {transferIcon} vers {mobileMoneyIcon}</span>;

export const transferIconSekureToday = <span className="flex gap-1">{transferIcon} vers {sekureIcon} {calendarIcon}</span>;
export const transferIconSekureTotal = <span className="flex gap-1">{totalIcon} {transferIcon} vers {sekureIcon}</span>;






export const transactionIcon = <GrTransaction size={20} color={"#444"} />;
// export const depositIcon = <PiHandWithdraw size={24} color={"#444"} />;
// export const withdrawalIcon = <PiHandDeposit size={24} color={"#444"} />;

export const transactionIconToday = <span className="flex gap-1">{transactionIcon} {calendarIcon}</span>;  // aujourd'hui
export const transactionIconAvg = <span className="flex gap-1">Moy. {transactionIcon}</span>;
export const transactionIconTotal = <span className="flex gap-1">{totalIcon} {transactionIcon}</span>;
export const depositIconToday = <span className="flex gap-1">Recharges {calendarIcon}</span>;  // aujourd'hui
export const withdrawalIconToday = <span className="flex gap-1">Retraits {calendarIcon}</span>;  // aujourd'hui

export const cardDepositIconToday = <span className="flex gap-1">Recharges {creditCardIcon} {calendarIcon}</span>;  // aujourd'hui
export const cardWithdrawalIconToday = <span className="flex gap-1">Retraits {creditCardIcon} {calendarIcon}</span>;
export const cardDepositIconTotal = <span className="flex gap-1">{totalIcon} Recharges</span>;  // aujourd'hui
export const cardWithdrawalIconTotal = <span className="flex gap-1">{totalIcon} Retraits</span>;

export const paymentIconToday = <span className="flex gap-1">Paiements {calendarIcon}</span>;
export const paymentIconTotal = <span className="flex gap-1">{totalIcon} Paiements</span>;

