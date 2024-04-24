"use client";
import Image from "next/image";
import { useTitle } from "@/hooks/useTitle";
import ProductsSection from "@/components/sections/ProductsSection";
import { useQuery } from "react-query";
import { axiosOpenedInstance } from "@/utils/axios";
import Category, { ICategory } from "@/components/cards/Category";
import toast from "react-hot-toast";
import { Kbd } from "@nextui-org/react";
import { useEffect } from "react";

import SideBar from "@/components/shared/SideBar"
import { RxCaretDown } from "react-icons/rx"
import { IoIosDisc, IoIosNotificationsOutline } from "react-icons/io"
import { CgProfile } from "react-icons/cg";
import Navbar from "@/components/shared/Navbar";
import CustomTable from "@/components/shared/CustomTable";


export default function Home() {
	// useTitle("Sekure | Admin");
	// useEffect(() => {
	// 	toast(<div>press <Kbd keys={["command"]}>K</Kbd> at anytime to make a search</div>)
	// }, []);
	// const categoriesView = useQuery({
	// 	queryKey: ["categories"],
	// 	queryFn: async () => {
	// 		const res = await axiosOpenedInstance.get("/categories");
	// 		return res.data.categories as ICategory[];
	// 	},
	// });

	return (
		<main className="flex">
			<SideBar/>
			<div className="flex flex-col w-full">
			<Navbar title={"Administration"}/>
			<div className="px-10">
				<CustomTable/>	
			</div>
			</div>
				
		</main>
		
	);
}
