import ActiveYesNo from "@/components/shared/ActiveYesNo";
import CButton from "@/components/shared/CButton";
import { FourDots } from "@/components/shared/icons";
import LabelWithBadge from "@/components/shared/LabelWithBadge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { selectCurrentCustomerDetails } from "@/redux/slices/customer";
import { getFormattedDateTime } from "@/utils/DateFormat";
import Link from "next/link";
import { FaLock } from "react-icons/fa";
import { PiCirclesFourFill } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import RechargeAccountBalanceModalForm from "./modals/RechargeAccountBalanceModalForm";
// import { Modal } from "@mui/material";
import Modal from "@/components/shared/Modal/Modal";
import { useEffect, useState } from "react";
import BlockUserAccountModalForm from "./modals/BlockUserAccountModalForm";
import UnblockUserAccountModalForm from "./modals/UnblockUserAccountModalForm";
import { retrieveUSDAmount } from "@/utils/utils";
import UpdateVerificationStatusModalForm from "./modals/UpdateVerificationStatusModalForm";
import { FaCheck, FaX } from "react-icons/fa6";
import { MdCheck, MdClose } from "react-icons/md";
import ActivateUserAccountModal from "./modals/ActivateUserAccountModal";
import { selectCurrentUser } from "@/redux/slices/auth";
import { KycService } from '@/api/services/v2/kyc';
import { useQuery } from "react-query";
import toast from "react-hot-toast";
import { setKYCWarningsList } from "@/redux/slices_v2/kyc";
import { hasPermission } from "@/utils/permissions";
import { IoIosSend } from "react-icons/io";
import NotificationModalForm from "./modals/NotificationModalForm";
import ReleaseStandByAccountBalanceModalForm from "./modals/ReleaseStandByAccountBalanceModalForm";
import EditRegStatusModalForm from "./modals/EditRegStatusModalForm";


const getKYCWarningsList = async () => {
  const response = await KycService.get_kyc_warnings_list({lang:'fr'});
  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(responseJson.message || 'Failed to get kyc warnings list'); 
  }
  // console.log("getKYCStats.data : ", responseJson.data);
  return responseJson.data; 
};

export default function DetailsSide() {
  const dispatch = useDispatch();
  const customerDetails:any = useSelector(selectCurrentCustomerDetails);
  const [isUpdateVerificationStatusModalFormOpen, setIsUpdateVerificationStatusModalFormOpen] = useState(false);
  const [isNotificationModalFormOpen, setIsNotificationModalFormOpen] = useState(false);
  
  const [isActivateModalOpen, setIsActivateModalOpen] = useState(false);

  const currentUser = useSelector(selectCurrentUser);
  
  const allKYCWarningsListRes = useQuery({
    queryKey: ["allKYCWarningsList"],
    queryFn: getKYCWarningsList,
    onError: (err) => {
      toast.error("Failed to get KYC warnings list.");
      console.log("Failed to get KYC warnings list : ", err);
    },
  });
  dispatch(setKYCWarningsList(allKYCWarningsListRes.data));
  
  return (
    <div className="w-full md:w-64 flex flex-col gap-y-[25px]">
        
        <div>
          <h1 className="text-lg text-gray-700 font-bold">Informations de compte</h1>
          {/* <p className="text-xs text-gray-500">liste en temps réel des dernieres transactions effectuées avec les cartes</p> */}
        </div>

        <div className="flex justify-between items-center w-full">
            {/* <p className="text-gray-800 text-sm font-normal tracking-tight">Statut</p> */}
            { customerDetails?.customer?.is_from_v1 ?
              <LabelWithBadge className={`text-sm`} label={'Ancien'} badgeColor={'#000'} textColor={'#000'}/>              
              :
              <LabelWithBadge className={`text-sm`} label={'Nouveau'} badgeColor={'#18BC7A'} textColor={'#444'}/>              
            }
        </div>
        
        <div>
          <p className="text-gray-800 text-sm font-normal tracking-tight">
            Compte créé le
          </p>
          <span className="">{getFormattedDateTime(customerDetails?.customer?.created_at)}</span>
        </div>
            {(customerDetails?.customer?.regularisation_status) ?
            <>
            <div>
              <p className="text-gray-800 text-sm font-normal tracking-tight">
                Methode regularisation
              </p>
              <span className="">{customerDetails?.customer?.regularisation_method}</span>
            </div>

            <div>
              <p className="text-gray-800 text-sm font-normal tracking-tight">
                Numero telephone regularisation
              </p>
              <span className="">{customerDetails?.customer?.regularisation_phone}</span>
            </div>

            <div>
              <p className="text-gray-800 text-sm font-normal tracking-tight">
                Statut regularisation
              </p>
              <span className="">{customerDetails?.customer?.regularisation_status}</span>
            </div>
            
            { hasPermission(currentUser, 'user_account_details:details', 'edit') &&
              (customerDetails?.customer?.regularisation_status!=='PAID') ?
            <>
              <CButton
              text={`Modifier statut regularisation`} //{'Reverser vers solde actif'}
              href={`?editRegStatus=true`}
              btnStyle={'dark'}
              icon={<FourDots />}
              width={'100%'}            
              />
              <Modal name={'editRegStatus'} modalContent={<EditRegStatusModalForm customer={customerDetails?.customer}/>}/>
            </>
            :
            <>
            </>}
            
            </>
          :<></>}
        
        
        <div className="">
          <p className="text-gray-800 text-sm font-normal tracking-tight">
            {`Total solde courant `}
            <span className="font-bold">{`($ ${retrieveUSDAmount({amount:customerDetails?.customer?.balance_xaf, amountUSD:customerDetails?.customer?.balance_usd})?.toLocaleString('fr-FR')})`}</span>
          </p>
          <p className="text-[#18BC7A] text-2xl font-bold tracking-tight my-1">
            {`${customerDetails?.customer?.balance_xaf?.toLocaleString('fr-FR') ?? 0} XAF `}
          </p>

          { hasPermission(currentUser, 'user_account_details:details', 'edit') ?
            <>
            <div className="flex justify-between items-center gap-3">
              <CButton
              text={'Recharger'}
              href={`?rechargeAccount=true`}
              btnStyle={'dark'}
              icon={<FourDots />}
              width={'100%'}            
              />
              {/* <Modal component={<RechargeAccountBalanceModalForm customer={customerDetails?.customer}/>}/> */}
              <Modal name={'rechargeAccount'} modalContent={<RechargeAccountBalanceModalForm customer={customerDetails?.customer}/>}/>
              <div style={{display:(customerDetails?.customer?.balance_xaf && customerDetails?.customer?.balance_xaf>0) ? 'block':'none'}}>
              <CButton
              text={'Retirer'}
              href={`?withdrawAccount=true`}
              btnStyle={'dark'}
              icon={<FourDots />}
              width={'100%'}              
              />
              </div>
              <Modal name={'withdrawAccount'} modalContent={<RechargeAccountBalanceModalForm customer={customerDetails?.customer}/>}/>
            </div>
            </>
          : <></> }
        </div>

        <div className="">
          <p className="text-gray-800 text-sm font-normal tracking-tight">
            {`Total solde en verification `}
            <span className="font-bold">{`($ ${retrieveUSDAmount({amount:customerDetails?.customer?.balance_xaf, amountUSD:customerDetails?.customer?.balance_usd})?.toLocaleString('fr-FR')})`}</span>
          </p>
          <p className="text-gray-500 text-xl font-bold tracking-tight my-1">
            {`${customerDetails?.customer?.old_balance_xaf?.toLocaleString('fr-FR') ?? 0} XAF `}
          </p>
          { hasPermission(currentUser, 'user_account_details:details', 'edit') &&
          (customerDetails?.customer?.old_balance_xaf || 0)>0 ?
          <>
            {customerDetails?.customer?.regularisation_status==='PROCESSING' ?
            <>
            <CButton
            text={`Regulariser`} //{'Reverser vers solde actif'}
            href={`?releaseStandByAccount=true`}
            btnStyle={'red'}
            icon={<FourDots />}
            width={'100%'}            
            />
            <Modal name={'releaseStandByAccount'} modalContent={<ReleaseStandByAccountBalanceModalForm customer={customerDetails?.customer}/>}/>
            </>
            :
            <>
            <CButton
            text={`Regulariser`}
            btnStyle={'grey'}
            icon={<FourDots />}
            width={'100%'}            
            />
            </>}
          </>
          : <></> }
        </div>

        <div className="">
          {/* <p className="text-gray-800 text-sm font-normal tracking-tight">Total solde parrainage</p> */}
          <p className="text-gray-800 text-sm font-normal tracking-tight">
            {`Total solde parrainage `}
            <span className="font-bold">{`($ ${retrieveUSDAmount({amount:customerDetails?.customer?.balance_sponsorship_xaf, amountUSD:customerDetails?.customer?.balance_sponsorship_usd})?.toLocaleString('fr-FR')})`}</span>
          </p>
          <p className="text-[#18BC7A] text-2xl font-bold tracking-tight my-1">{customerDetails?.customer?.balance_sponsorship_xaf?.toLocaleString('fr-FR') ?? 0} XAF</p>
          
          {hasPermission(currentUser, 'user_account_details:details', 'edit') ?
          <>
          <div className="flex justify-between items-center gap-3">
            <CButton
            text={'Recharger'}
            href={`?rechargeSponsorshipAccount=true`}
            btnStyle={'dark'}
            icon={<FourDots />}
            width={'100%'}            
            />
            <Modal name={'rechargeSponsorshipAccount'} modalContent={<RechargeAccountBalanceModalForm customer={customerDetails?.customer}/>}/>
            <div style={{display:(customerDetails?.customer?.balance_sponsorship_xaf && customerDetails?.customer?.balance_sponsorship_xaf>0) ? 'block':'none'}}>
            <CButton
            text={'Retirer'}
            href={`?withdrawSponsorshipAccount=true`}
            btnStyle={'dark'}
            icon={<FourDots />}
            width={'100%'}              
            />
            </div>
            <Modal name={'withdrawSponsorshipAccount'} modalContent={<RechargeAccountBalanceModalForm customer={customerDetails?.customer}/>}/>
          </div>
          </>
          : <></> }
        </div>

        <div className="flex flex-col justify-start gap-2">
          
          <div className="flex justify-between items-center w-full">
            <p className="text-gray-800 text-sm font-normal tracking-tight">Etat du KYC</p>
            { customerDetails?.customer?.kyc_result === 'APPROVED' ?
              <LabelWithBadge className={`text-xs`} label={'Approuvé'} badgeColor={'#18BC7A'} textColor={'#444'}/>
              :
              customerDetails?.customer?.kyc_result === 'DECLINED' ?
              <LabelWithBadge className={`text-xs`} label={'Refusé'} badgeColor={'#F85D4B'} textColor={'#444'}/>
              :
              customerDetails?.customer?.kyc_status === 'PENDING' ?
              <LabelWithBadge className={`text-xs`} label={'En cours'} badgeColor={'#777'} textColor={'#444'}/>
              :
              customerDetails?.customer?.kyc_status === 'NOT_STARTED' ?
              <LabelWithBadge className={`text-xs`} label={'Aucun'} badgeColor={'#000'} textColor={'#000'}/>
              :
              <LabelWithBadge className={`text-xs`} label={String(customerDetails?.customer?.kyc_result)} badgeColor={'#000'} textColor={'#000'}/>
              // :<></>
            }
          </div>
          {hasPermission(currentUser, 'user_account_details:details', 'edit_kyc') ?
          <div>
            <CButton 
            onClick={()=>setIsUpdateVerificationStatusModalFormOpen(true)}
            text={'Modifier'}
            btnStyle={'yellow'}
            icon={<FourDots />}
            width={'100%'}
            />
            <UpdateVerificationStatusModalForm
            isOpen={isUpdateVerificationStatusModalFormOpen}
            setIsOpen={setIsUpdateVerificationStatusModalFormOpen}
            customer={customerDetails?.customer}
            />
            {/* <Modal name={'blockUserAccount'} modalContent={<BlockUserAccountModalForm customer={customerDetails?.customer}/>}/> */}
          </div>
          : <></> }
          <div className="flex justify-between items-center w-full mt-3">
            <span className="text-gray-800 text-sm font-normal">Etat du compte</span>
            { 
              customerDetails?.customer?.blocked ?
              <LabelWithBadge className={`text-xs`} label={'Bloqué'} badgeColor={'#F85D4B'} textColor={'#444'}/>
              :
              customerDetails?.customer?.active ?
              <LabelWithBadge className={`text-xs`} label={'Actif'} badgeColor={'#18BC7A'} textColor={'#444'}/>
              :
              <LabelWithBadge className={`text-xs`} label={'Inactif'} badgeColor={'#000'} textColor={'#000'}/>
              
            }
          </div>
          <div className=" mt-3 mb-2">
            <>
            <CButton
            icon={<IoIosSend/>}
            onClick={()=>setIsNotificationModalFormOpen(true)}
            text={'Envoyer une notification'}
            btnStyle={'green'}
            width={'100%'}
            />
            <NotificationModalForm
            isOpen={isNotificationModalFormOpen}
            setIsOpen={setIsNotificationModalFormOpen}
            customer={customerDetails?.customer}
            />
            </>
          {customerDetails?.customer?.blocked ?
            <>
            {/* <CButton 
            text={'Débloquer'} 
            href={`?unblockUserAccount=true`}
            btnStyle={'lightYellow'}
            icon={<FaLock />}
            width={'100%'}
            />
            <Modal name={'unblockUserAccount'} modalContent={<UnblockUserAccountModalForm customer={customerDetails?.customer}/>}/> */}
            </>
            :
            <>
            {/* <CButton 
            text={'Bloquer'} 
            href={`?blockUserAccount=true`}
            btnStyle={'yellow'}
            icon={<FaLock />}
            width={'100%'}
            />
            <Modal name={'blockUserAccount'} modalContent={<BlockUserAccountModalForm customer={customerDetails?.customer}/>}/> */}
            </>
          }
          </div>
          {/* <div>
            <CButton 
            text={customerDetails?.customer?.active ? 'Désactiver' : 'Activer'} 
            btnStyle={'outlineDark'}
            icon={customerDetails?.customer?.active ? <MdClose size={24} /> : <MdCheck size={24} />}
            width={'100%'}
            onClick={()=>setIsActivateModalOpen(true)}
            />
            <ActivateUserAccountModal
            isOpen={isActivateModalOpen}
            setIsOpen={setIsActivateModalOpen}
            customer={customerDetails?.customer}
            activate={!customerDetails?.customer?.active}
            />
          </div> */}
        </div>


        {/* <div className="flex flex-col justify-start gap-2">
          <div className="flex justify-between items-center w-full">
            <p className="text-gray-800 text-sm font-normal tracking-tight">Etat du KYC</p>
            { customerDetails?.customer?.kyc_status === 'verified' ?
              <LabelWithBadge className={`text-xs`} label={'Vérifié'} badgeColor={'#18BC7A'} textColor={'#444'}/>
              :
              customerDetails?.customer?.blocked ?
              <LabelWithBadge className={`text-xs`} label={'Bloqué'} badgeColor={'#F85D4B'} textColor={'#444'}/>
              :
              customerDetails?.customer?.kyc_status === 'ongoing' ?
              <LabelWithBadge className={`text-xs`} label={'En cours'} badgeColor={'#777'} textColor={'#444'}/>
              :customerDetails?.customer?.kyc_status === 'none' ?
              <LabelWithBadge className={`text-xs`} label={'Aucun'} badgeColor={'#000'} textColor={'#000'}/>
              :<></>
            }
          </div> 
          <CButton
            text={'Voir details KYC'}
            href={`#`}
            btnStyle={'dark'}
            width={'100%'}              
            />
        </div> */}


      </div>
  )
}
