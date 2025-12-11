"use client";

import {
	handleGetUsersDetails,
	handleUpdateUser,
} from "@/api/handlers/user.handler";
import Layout from "@/components/shared/Layout";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Details from "./components/details/Details";
import Cards from "./components/cards/Cards";
import Transactions from "./components/transactions/Transactions";
import { useSelector } from "react-redux";
import { selectUserV3 } from "@/redux/slices_v3/userV3";
import toast from "react-hot-toast";
import { UserIcon } from "lucide-react";

const Page = () => {
	const params = useParams();
	const id = params.id;
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState<any>({});
	const currentUser = useSelector(selectUserV3);

	const getUserDetails = useQuery({
		queryKey: ["user-details", id],
		queryFn: handleGetUsersDetails,
		onSuccess: (data) => {
			if (data?.data) {
				setFormData(data.data);
			}
		},
	});

	const { data: userData, isLoading, isError } = getUserDetails;

	const handleInputChange = (field: string, value: any) => {
		setFormData((prev: any) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleSave = () => {
		console.log("Données à sauvegarder:", formData);
		setIsEditing(false);
		// Ajoutez votre mutation API ici
	};

	const handleCancel = () => {
		if (userData?.data) {
			setFormData(userData.data);
		}
		setIsEditing(false);
	};

	if (isLoading) {
		return (
			<Layout title="Gérer le compte utilisateur">
				<div className="flex items-center justify-center h-screen">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#18bc7a]"></div>
				</div>
			</Layout>
		);
	}

	if (isError || !userData?.data) {
		return (
			<Layout title="Gérer le compte utilisateur">
				<div className="flex items-center justify-center h-screen">
					<div className="text-center">
						<p className="text-gray-600">
							{`Impossible de charger les données de l'utilisateur`}
						</p>
					</div>
				</div>
			</Layout>
		);
	}

	return (
		<Layout title="Gérer le compte utilisateur">
			{/* Section Current User en haut */}
			{currentUser && (
				<div className="mb-8 bg-white   p-4 md:p-6">
					<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
						<div className="flex items-center gap-4">
							{/* Photo de profil ou initiales */}
							<div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-[#18bc7a] to-emerald-400 rounded-full flex items-center justify-center shadow">
								{currentUser.firstName ? (
									<span className="text-white text-xl md:text-2xl font-bold">
										{currentUser.firstName.charAt(0)}
										{currentUser.lastName?.charAt(0)}
									</span>
								) : (
									<UserIcon className="w-8 h-8 text-white" />
								)}
							</div>

							<div>
								<h2 className="text-lg md:text-xl font-bold text-gray-900">
									{currentUser.firstName}{" "}
									{currentUser.lastName}
								</h2>
								<p className="text-sm text-gray-500 mt-1">
									{currentUser.email}
								</p>
								<div className="flex flex-wrap gap-2 mt-2">
									<span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
										{currentUser.roles?.join(", ")}
									</span>
									<span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200 font-mono">
										ID: {currentUser.id.substring(0, 8)}...
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}

			<section>
				<Tabs defaultValue="details">
					<div className="border-b-0 md:border-b-1">
						<TabsList className="TabsList grid grid-cols-2 md:flex mb-[200px] md:mb-0">
							<TabsTrigger
								className="TabsTrigger border-b-1 md:border-b-0"
								value="details"
							>
								Details
							</TabsTrigger>
							<TabsTrigger
								className="TabsTrigger border-b-1 md:border-b-0"
								value="cards"
							>
								Cards
							</TabsTrigger>
							<TabsTrigger
								className="TabsTrigger border-b-1 md:border-b-0"
								value="transactions"
							>
								Transactions
							</TabsTrigger>
						</TabsList>
					</div>
					<div className={`mt-5`}>
						<TabsContent value="details">
							<Details />
						</TabsContent>
						<TabsContent value="cards">
							<Cards />
						</TabsContent>
						<TabsContent value="transactions">
							<Transactions />
						</TabsContent>
					</div>
				</Tabs>
			</section>
		</Layout>
	);
};

export default Page;
