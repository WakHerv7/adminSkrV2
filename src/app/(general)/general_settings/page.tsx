"use client"
import Image from "next/image";
import { useTitle } from "@/hooks/useTitle";
import ProductsSection from "@/components/sections/ProductsSection";
import { useQuery } from "react-query";
import { axiosOpenedInstance } from "@/utils/axios";
import toast from "react-hot-toast";
import { Kbd } from "@nextui-org/react";
import { useEffect } from "react";

import SideBar from "@/components/shared/SideBar"
import { RxCaretDown, RxDotsHorizontal } from "react-icons/rx"
import { IoIosDisc, IoIosNotificationsOutline } from "react-icons/io"
import { CgProfile } from "react-icons/cg";
import Navbar from "@/components/shared/Navbar";
import CustomTable from "@/components/shared/CustomTable";
import Layout from "@/components/shared/Layout";
import CustomDropdown from "@/components/shared/CustomDropdown";
import Link from "next/link";
import ButtonFilled from "@/components/shared/ButtonFilled";
import { IGenericRow } from '@/components/AdminTable/Table';
import ActiveYesNo from "@/components/shared/ActiveYesNo";
import ButtonOutlined from "@/components/shared/ButtonOutlined";
import { FourDots } from "@/components/shared/icons";
import { isString } from "@/utils/utils";
import CButton from "@/components/shared/CButton";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import Flag from "@/components/shared/Flag";
import CompteForm from "@/components/shared/Compte/CompteForm/CompteForm";
import CarteForm from "@/components/shared/Compte/CarteForm/CarteForm";
import TransfertsForm from "@/components/shared/Compte/TransfertsForm/TransfertsForm";
import Title from "@/components/shared/Title";
import ReactCountryFlag from "react-country-flag";


export default function GeneralSettings() {

	

	return (
		<Layout
		title={"Paramètres généraux"}
		>
			<>
			<Accordion type="single" defaultValue="item-1" collapsible>
				<AccordionItem value="item-1">
					<AccordionTrigger>
					<div className="flex items-center gap-3">
						<Title title={`Paramètres du Cameroun`}/>
						<ReactCountryFlag countryCode="CM"/>
					</div>
					</AccordionTrigger>
					<AccordionContent className="flex flex-wrap py-5 gap-x-[50px] gap-y-10">
					<div className="flex flex-col justify-start items-start">
						<h1 className="text-[15px] font-bold text-gray-900">Compte</h1>
						<p className="text-xs text-gray-500">cibler un comportement precis des utilisateurs</p>
						<div className="flex items-center space-x-3 mt-4">
						<CompteForm />
						</div>
					</div>
					<div className="flex flex-col justify-start items-start">
						<h1 className="text-[15px] font-bold text-gray-900">Carte</h1>
						<p className="text-xs text-gray-500">cibler un comportement precis des utilisateurs</p>
						<div className="flex items-center space-x-3 mt-4">
						<CarteForm />
						</div>
					</div>
					<div className="flex flex-col justify-start items-start">
						<h1 className="text-[15px] font-bold text-gray-900">Transferts</h1>
						<p className="text-xs text-gray-500">cibler un comportement precis des utilisateurs</p>
						<div className="flex items-center space-x-3 mt-4">
						<TransfertsForm />
						</div>
					</div>
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="item-2">
					<AccordionTrigger>
					<div className="flex items-center gap-3">
						<Title title={`Paramètres du Gabon`}/>
						<ReactCountryFlag countryCode="GA"/>
					</div>
					</AccordionTrigger>
					<AccordionContent className="flex flex-row justify-between items-start">
					<div className="flex flex-col justify-start items-start">
						<h1 className="text-[15px] font-bold text-gray-900">Compte</h1>
						<p className="text-xs text-gray-500">cibler un comportement precis des utilisateurs</p>
						<div className="flex items-center space-x-3 mt-4">
						<CompteForm />
						</div>
					</div>
					<div className="flex flex-col justify-start items-start">
						<h1 className="text-[15px] font-bold text-gray-900">Carte</h1>
						<p className="text-xs text-gray-500">cibler un comportement precis des utilisateurs</p>
						<div className="flex items-center space-x-3 mt-4">
						<CarteForm />
						</div>
					</div>
					<div className="flex flex-col justify-start items-start">
						<h1 className="text-[15px] font-bold text-gray-900">Transferts</h1>
						<p className="text-xs text-gray-500">cibler un comportement precis des utilisateurs</p>
						<div className="flex items-center space-x-3 mt-4">
						<TransfertsForm />
						</div>
					</div>        
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="item-3">
					<AccordionTrigger>
					<div className="flex items-center gap-3">
						<Title title={`Paramètres du Sénégal`}/>
						<ReactCountryFlag countryCode="SN"/>
					</div>
					</AccordionTrigger>
					<AccordionContent className="flex flex-row justify-between items-start">
					<div className="flex flex-col justify-start items-start">
						<h1 className="text-[15px] font-bold text-gray-900">Compte</h1>
						<p className="text-xs text-gray-500">cibler un comportement precis des utilisateurs</p>
						<div className="flex items-center space-x-1 mt-4">
						<CompteForm />
						</div>
					</div>
					<div className="flex flex-col justify-start items-start">
						<h1 className="text-[15px] font-bold text-gray-900">Carte</h1>
						<p className="text-xs text-gray-500">cibler un comportement precis des utilisateurs</p>
						<div className="flex items-center space-x-3 mt-4">
						<CarteForm />
						</div>
					</div>
					<div className="flex flex-col justify-start items-start">
						<h1 className="text-[15px] font-bold text-gray-900">Transferts</h1>
						<p className="text-xs text-gray-500">cibler un comportement precis des utilisateurs</p>
						<div className="flex items-center space-x-3 mt-4">
						<TransfertsForm />
						</div>
					</div>
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="item-4">
					<AccordionTrigger>
					<div className="flex items-center gap-3">
					<Title title={`Paramètres de Cote d'ivoire`}/>
						<ReactCountryFlag countryCode="CI"/>
					</div>
					</AccordionTrigger>
					<AccordionContent className="flex flex-row justify-between items-start">
					<div className="flex flex-col justify-start items-start">
						<h1 className="text-[15px] font-bold text-gray-900">Compte</h1>
						<p className="text-xs text-gray-500">cibler un comportement precis des utilisateurs</p>
						<div className="flex items-center space-x-3 mt-4">
						<CompteForm />
						</div>
					</div>
					<div className="flex flex-col justify-start items-start">
						<h1 className="text-[15px] font-bold text-gray-900">Carte</h1>
						<p className="text-xs text-gray-500">cibler un comportement precis des utilisateurs</p>
						<div className="flex items-center space-x-3 mt-4">
						<CarteForm />
						</div>
					</div>
					<div className="flex flex-col justify-start items-start">
						<h1 className="text-[15px] font-bold text-gray-900">Transferts</h1>
						<p className="text-xs text-gray-500">cibler un comportement precis des utilisateurs</p>
						<div className="flex items-center space-x-3 mt-4">
						<TransfertsForm />
						</div>
					</div>
					</AccordionContent>
				</AccordionItem>
				</Accordion>
			</>
	  </Layout>
	);
}
