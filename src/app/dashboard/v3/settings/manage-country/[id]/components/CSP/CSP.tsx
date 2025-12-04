"use client";

import { CSP_ServiceV3 } from "@/api/services/v3/CSP_service";
import CButton from "@/components/shared/CButton";
import CustomTable from "@/components/shared/CustomTable";
import { FourDots } from "@/components/shared/icons";
import { cspHeaderDataV3 } from "@/constants/v3/KYCDataV3";
import { useParams, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "react-query";
import CSPDetails from "./components/CSPDetailsModal";
import CreateCSPModal from "./components/CreateCSPModal";

import {
	handleCreateCSP,
	handleUpdateCSP,
} from "@/api/handlers/country_service_provider.handler";
import EditCSPModal from "./components/EditCSPModal";

const handleGetCSP = async ({ queryKey }: any) => {
	const [_key, countryCode] = queryKey;

	const response = await CSP_ServiceV3.getByCountry({ countryCode });
	const responseJson = await response.json();

	if (!response.ok) {
		throw new Error(
			responseJson.error || "Failed to fetch country service provider"
		);
	}

	return responseJson;
};

const CSP = () => {
	const queryClient = useQueryClient();
	const params = useParams();
	const searchParams = useSearchParams();

	// États
	const [selectedCSP, setSelectedCSP] = useState<any>(null);
	const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

	const id = params.id;
	const code = searchParams.get("code");

	const cspQuery = useQuery({
		queryKey: ["get-csp", code],
		queryFn: handleGetCSP,
		onError: (err: any) => {
			toast.error(err.message);
		},
	});

	// Mutation pour créer un CSP
	const createMutation = useMutation({
		mutationFn: handleCreateCSP,
		onError: (err: any) => {
			toast.error(err.message);
		},
		onSuccess: () => {
			toast.success("CSP créé avec succès");
			setIsCreateModalOpen(false);
			queryClient.invalidateQueries({ queryKey: ["get-csp"] });
		},
	});

	// Mutation pour mettre à jour un CSP
	const updateMutation = useMutation({
		mutationFn: handleUpdateCSP,
		onError: (err: any) => {
			toast.error(err.message);
		},
		onSuccess: () => {
			toast.success("CSP mis à jour avec succès");
			setIsEditModalOpen(false);
			setSelectedCSP(null);
			queryClient.invalidateQueries({ queryKey: ["get-csp"] });
		},
	});

	// Mutation pour supprimer un CSP
	// const deleteMutation = useMutation({
	// 	mutationFn: handleDeleteCSP,
	// 	onError: (err: any) => {
	// 		toast.error(err.message);
	// 	},
	// 	onSuccess: () => {
	// 		toast.success("CSP supprimé avec succès");
	// 		setIsDeleteModalOpen(false);
	// 		setSelectedCSP(null);
	// 		queryClient.invalidateQueries({ queryKey: ["get-csp"] });
	// 	},
	// });

	// Fonctions pour gérer les actions
	const createCSP = async (data: any) => {
		try {
			await createMutation.mutateAsync(data);
		} catch (error) {
			console.error("Erreur lors de la création:", error);
		}
	};

	const updateCSP = async (data: any) => {
		if (!selectedCSP?.id) {
			toast.error("Aucun CSP sélectionné");
			return;
		}

		try {
			await updateMutation.mutateAsync({
				id: selectedCSP.id,
				data: data,
			});
		} catch (error) {
			console.error("Erreur lors de la mise à jour:", error);
		}
	};

	// const deleteCSP = async () => {
	// 	if (!selectedCSP?.id) {
	// 		toast.error("Aucun CSP sélectionné");
	// 		return;
	// 	}

	// 	try {
	// 		await deleteMutation.mutateAsync(selectedCSP.id);
	// 	} catch (error) {
	// 		console.error("Erreur lors de la suppression:", error);
	// 	}
	// };

	// Handlers pour ouvrir les modales
	const openDetailsModal = (cspData: any) => {
		console.log("Opening CSP details modal:", cspData);
		setSelectedCSP(cspData);
		setIsDetailsModalOpen(true);
	};

	const openEditModal = (cspData: any) => {
		console.log("Opening CSP edit modal:", cspData);
		setSelectedCSP(cspData);
		setIsEditModalOpen(true);
	};

	const openDeleteModal = (cspData: any) => {
		console.log("Opening CSP delete modal:", cspData);
		setSelectedCSP(cspData);
		setIsDeleteModalOpen(true);
	};

	const closeDetailsModal = () => {
		console.log("Closing CSP details modal");
		setSelectedCSP(null);
		setIsDetailsModalOpen(false);
	};

	const closeEditModal = () => {
		setSelectedCSP(null);
		setIsEditModalOpen(false);
	};

	const closeDeleteModal = () => {
		setSelectedCSP(null);
		setIsDeleteModalOpen(false);
	};

	const openCreateModal = () => {
		setIsCreateModalOpen(true);
	};

	const closeCreateModal = () => {
		setIsCreateModalOpen(false);
	};

	// Préparer les données pour le tableau
	const cspTableData = cspQuery.data?.data?.map(
		(item: any, index: number) => ({
			serial: index + 1,
			operator: item.operator?.toUpperCase(),
			service: item.serviceProvided?.service?.name ?? "",
			feesRate: `${item.feesRate}%`,
			fees: item.fees,
			minAmount: `${item.configuration?.minAmount} ${item.configuration?.currency}`,
			maxAmount: `${item.configuration?.maxAmount} ${item.configuration?.currency}`,
			currency: item.configuration?.currency,
			isActive: item.isActive ? (
				<span className="text-green-600 font-medium">Actif</span>
			) : (
				<span className="text-red-600 font-medium">Inactif</span>
			),
			createdAt: new Date(item.createdAt).toLocaleDateString(),
			actions: (
				<div className="flex gap-2 items-center">
					<CButton
						text={"Voir plus"}
						onClick={() => openDetailsModal(item)}
						btnStyle={"dark"}
						icon={<FourDots />}
						disabled={
							createMutation.isLoading || updateMutation.isLoading
							// deleteMutation.isLoading
						}
					/>
					<button
						className="px-4 py-2 bg-[#ffd83c] text-black rounded hover:bg-[#e6c335] transition disabled:opacity-50 disabled:cursor-not-allowed"
						onClick={() => openEditModal(item)}
						disabled={
							createMutation.isLoading || updateMutation.isLoading
						}
					>
						Éditer
					</button>
					<button
						className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
						onClick={() => openDeleteModal(item)}
						disabled={
							createMutation.isLoading || updateMutation.isLoading
						}
					>
						Supprimer
					</button>
				</div>
			),
		})
	);

	const isLoading = createMutation.isLoading || updateMutation.isLoading;

	return (
		<section>
			{/* Bouton pour créer un nouveau CSP */}
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-2xl font-bold">
					Gestion des Country Service Providers
				</h2>
				<CButton
					text="Créer un nouveau CSP"
					btnStyle="green"
					onClick={openCreateModal}
					height="40px"
					disabled={isLoading}
				/>
			</div>

			<div className="mt-8">
				<h3 className="text-lg font-semibold mb-4">
					Liste des Country Service Providers
				</h3>
				<CustomTable
					headerData={{
						...cspHeaderDataV3,
						actions: "Actions",
					}}
					tableData={cspTableData || []}
					isLoading={cspQuery.isLoading || cspQuery.isFetching}
					threeButtons={true}
				/>
			</div>

			{/* Modale de création */}
			<CreateCSPModal
				isOpen={isCreateModalOpen}
				onClose={closeCreateModal}
				onSubmit={createCSP}
				isLoading={createMutation.isLoading}
			/>

			{/* Modale d'édition */}
			<EditCSPModal
				isOpen={isEditModalOpen}
				onClose={closeEditModal}
				onSubmit={updateCSP}
				isLoading={updateMutation.isLoading}
				initialData={selectedCSP}
			/>

			{/* Modale de confirmation de suppression */}
			{/* <DeleteConfirmationModal
				isOpen={isDeleteModalOpen}
				onClose={closeDeleteModal}
				onConfirm={deleteCSP}
				isLoading={deleteMutation.isLoading}
				itemName={selectedCSP?.operator || ""}
			/> */}

			{/* Modale de détails */}
			{selectedCSP && (
				<CSPDetails
					data={selectedCSP}
					isOpen={isDetailsModalOpen}
					onClose={closeDetailsModal}
				/>
			)}
		</section>
	);
};

export default CSP;
