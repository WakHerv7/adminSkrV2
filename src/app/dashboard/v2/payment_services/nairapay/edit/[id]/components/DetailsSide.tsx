import CButton from "@/components/shared/CButton";
import LabelWithBadge from "@/components/shared/LabelWithBadge";
import { getFormattedDateTime } from "@/utils/DateFormat";
import { useDispatch, useSelector } from "react-redux";
// import { Modal } from "@mui/material";
import { NairapayService } from "@/api/services/v2/nairapay";
import { selectCurrentUser } from "@/redux/slices/auth";
import { selectCurrentNairaPayment } from "@/redux/slices_v2/nairapay";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaCheck, FaX } from "react-icons/fa6";
import { useMutation } from "react-query";
import ConfirmStatusModal from "./modals/ConfirmSubmitModal";
import { selectCurrentChnPayment } from "@/redux/slices_v2/chinpay";


const handleUpdateChnPayment = async (queryData:any) => {
  const {currentUserId, transactionId, body} = queryData;
  // console.log("handleTransaction : ", {currentUserId, customerId, label, body});
  // return {currentUserId, customerId, label, body}
  const response = await NairapayService.update_nairapayment({
      userId:currentUserId,
      transactionId:transactionId,
      body:body
  }); 
  if (!response.ok) {
      const responseBody = await response.json();
      throw new Error(responseBody.message);  
  }
  const responseJson = await response.json();
  return responseJson;
  
}

export default function DetailsSide() {
  const dispatch = useDispatch();
  const redirectRef:any = useRef();
  const [isConfirmStatusModalOpen, setIsConfirmStatusModalOpen] = useState(false);
  const [status, setStatus] = useState<string>('PENDING');
  const nairaPaymentData:any = useSelector(selectCurrentNairaPayment);
  const chnPaymentData = useSelector(selectCurrentChnPayment);
  const currentUser = useSelector(selectCurrentUser);
  
  console.log("chnPaymentData ::: ", chnPaymentData);
  console.log("nairaPaymentData ::: ", nairaPaymentData);
  

  const handleStatus = (value: any) => {
    setStatus(value);
		setIsConfirmStatusModalOpen(true);
  }

  const mutation = useMutation({
		mutationFn: (data)=>handleUpdateChnPayment({currentUserId:currentUser?.id, transactionId:nairaPaymentData?.id, body:data}),
		onError: (err:any) => {
            console.error("onError : ", err.message);
            toast.error(`Erreur lors de la modification : ${err.message}`);		
		},
		onSuccess: (data) => {
            console.log("onSuccess : ", data);
            toast.success(`Modification effectuée avec succès`);
            redirectRef.current.href = '/dashboard/v2/payment_services/nairapay';
            redirectRef.current.click();
        }
	});

  const onSubmit = (data: any) => {
    mutation.mutate(data);
  };


  return (
    <div className="pl-10 py-3 pt-5 w-[300px] grid grid-cols-1 gap-3">
      <div className="flex justify-between items-center w-full">
        <h1 className="flex-1 text-sm font-semibold text-gray-800">Créé le</h1>
        <p className="text-gray-900 text-sm font-semibold">{getFormattedDateTime(nairaPaymentData?.created_at)}</p>
      </div>
      <div className="flex justify-between items-center w-full">
        <span className="text-gray-800 text-sm font-semibold">Statut</span>
        { nairaPaymentData?.status === 'SUCCESS' ?
            <LabelWithBadge className={`text-xs`} label={'Approuvé'} badgeColor={'#18BC7A'} textColor={'#444'}/>
            :
            nairaPaymentData?.status === 'FAILED' ?
            <LabelWithBadge className={`text-xs`} label={'Refusé'} badgeColor={'#F85D4B'} textColor={'#444'}/>
            :
            nairaPaymentData?.status === 'PENDING' ?
            <LabelWithBadge className={`text-xs`} label={'En attente'} badgeColor={'orange'} textColor={'#444'}/>
            :
            <LabelWithBadge className={`text-xs`} label={String(nairaPaymentData?.status)} badgeColor={'#000'} textColor={'#000'}/>
            // :<></>
          }
      </div>
      
      {nairaPaymentData?.status === 'PENDING' ?
      <div className="flex flex-col items-between justify-center gap-3 mt-2">
        
        
        <CButton
        text={'Approuver'} 
        btnStyle={'green'}
        icon={<FaCheck />} 
        onClick={()=>handleStatus('SUCCESS')}
        />
        <CButton 
        text={'Rejeter'} 
        btnStyle={'red'}
        icon={<FaX />} 
        onClick={()=>handleStatus('FAILED')}
        />
        <ConfirmStatusModal
        status={status}
        isOpen={isConfirmStatusModalOpen}
        setIsOpen={setIsConfirmStatusModalOpen}
        onSubmit={()=>onSubmit({status})}
        />
      </div>
      :
      <></>}

      <a ref={redirectRef} hidden href="#"></a>

    </div>
  )
}
