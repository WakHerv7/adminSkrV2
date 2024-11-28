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
import { IGenericRow, ITableHeader } from '@/components/AdminTable/Table';
import ActiveYesNo from "@/components/shared/ActiveYesNo";
import ButtonOutlined from "@/components/shared/ButtonOutlined";
import { FourDots } from "@/components/shared/icons";
import { isString } from "@/utils/utils";
import CButton from "@/components/shared/CButton";
const headerData: ITableHeader =
{
	"serial": "S/N",
	"name": "Nom",
	"email": "Email",
	"status": "Statut",
	"access": "Accès",
	"date": "Date de création",
	"edit": "",
}

const tableData: IGenericRow[] = [
  {
    name: 'John Doe',
    email: 'abc123@xyz.com',
    status: true,
    access: 'Admin',
    date: '12/03/2024',
    edit: '/administration/edit/1',
  },
  {
    name: 'John Doe',
    email: 'abc123@xyz.com',
    status: false,
    access: 'Manager',
    date: '12/03/2024',
    edit: '/administration/edit/2',
  },
  {
    name: 'John Doe',
    email: 'abc123@xyz.com',
    status: true,
    access: 'Visitor',
    date: '12/03/2024',
    edit: '/administration/edit/3',
  },
];

export default function Home() {

	const rearrangedTableData = tableData.map((item, index) => {
		const rearrangedItem = {
			serial: index+1,
			name: item.name,			
			email: item.email,
			status: <ActiveYesNo isActive={item.status}/>,
			access: item.access,
			date: item.date,
			actions: <>
			<div className='flex gap-5'>
			  <CButton 
			  text={'Editer'}
			  href={item.edit}
			  btnStyle={'outlineGreen'}
			  icon={<FourDots />} 
			  />
			  <CButton 
			  text={'Supprimer'} 
			  btnStyle={'outlineDark'}
			  icon={<FourDots />} 
			  />
			  </div>
			</>
		};
		item = rearrangedItem;
		return item;
	});

	return (
		<Layout
		title={"Administration"}
		>
			<CustomTable
			headerData={headerData}
			tableData={rearrangedTableData}
			btn={<CButton
				text={'Ajouter un Admin'}
				btnStyle={'green'}
				href={'/administration/create'}
			   />}
			/>
	  </Layout>
	);
}
