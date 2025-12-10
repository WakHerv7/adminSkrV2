"use client";

import CButton from "@/components/shared/CButton";
import CustomTable from "@/components/shared/CustomTable";
import { headerSpDataV3 } from "@/constants/v3/KYCDataV3";
import { getFormattedDateTime } from "@/utils/DateFormat";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "react-query";
import CreateSPModal from "./components/CreateSPModal";
import EditSPModal from "./components/EditSPModal";
import DeleteConfirmationModal from "./components/DeleteConfirmationModal";
import {
	handleCreateSp,
	handleDeleteServiceProvider,
	handleGetSPs,
	handleUpdateServiceProvider,
} from "@/api/handlers/serviceProvider.handle";
import { PaymentProviderServiceV3 } from "@/api/services/v3/Payment_Provider";

const handleGetPaymentProviders = async ({ queryKey }: any) => {
	const [_key] = queryKey;

	const response = await PaymentProviderServiceV3.getAll();
	const responseJson = await response.json();

	if (!response.ok) {
		throw new Error(
			responseJson.message || "Failed to fetch Payment Providers"
		);
	}

	return responseJson;
};
const ServiceProvider = () => {
	const queryClient = useQueryClient();
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [selectedServiceProvider, setSelectedServiceProvider] =
		useState<any>(null);

	const SPQuery = useQuery({
		queryKey: ["service-provider"],
		queryFn: handleGetSPs,
		onError: (err: any) => {
			toast.error(err.message);
		},
	});

	const paymentProviderQuery = useQuery({
		queryKey: ["payment-providers"],
		queryFn: handleGetPaymentProviders,
		onError: (err: any) => {
			console.error("Erreur lors du chargement:", err);
			toast.error(err.message);
		},
	});

	const createMutation = useMutation({
		mutationFn: handleCreateSp,
		onError: (err: any) => {
			toast.error(err.message || "Erreur lors de la création");
		},
		onSuccess: () => {
			toast.success("Service provider créé avec succès");
			setIsCreateModalOpen(false);
			queryClient.invalidateQueries({ queryKey: ["service-provider"] });
		},
	});

	const updateMutation = useMutation({
		mutationFn: ({ id, data }: { id: string; data: any }) =>
			handleUpdateServiceProvider(id, data),
		onError: (err: any) => {
			toast.error(err.message || "Erreur lors de la mise à jour");
		},
		onSuccess: () => {
			toast.success("Service provider mis à jour avec succès");
			setIsEditModalOpen(false);
			setSelectedServiceProvider(null);
			queryClient.invalidateQueries({ queryKey: ["service-provider"] });
		},
	});

	const deleteMutation = useMutation({
		mutationFn: handleDeleteServiceProvider,
		onError: (err: any) => {
			toast.error(err.message || "Erreur lors de la suppression");
		},
		onSuccess: () => {
			toast.success("Service provider supprimé avec succès");
			setIsDeleteModalOpen(false);
			setSelectedServiceProvider(null);
			queryClient.invalidateQueries({ queryKey: ["service-provider"] });
		},
	});

	const createServiceProvider = async (data: any) => {
		try {
			await createMutation.mutateAsync(data);
		} catch (error) {
			console.error("Erreur lors de la création:", error);
		}
	};

	const updateServiceProvider = async (data: any) => {
		if (!selectedServiceProvider?.id) {
			toast.error("Aucun service provider sélectionné");
			return;
		}

		try {
			await updateMutation.mutateAsync({
				id: selectedServiceProvider.id,
				data: data,
			});
		} catch (error) {
			console.error("Erreur lors de la mise à jour:", error);
		}
	};

	const deleteServiceProvider = async () => {
		if (!selectedServiceProvider?.id) {
			toast.error("Aucun service provider sélectionné");
			return;
		}

		try {
			await deleteMutation.mutateAsync(selectedServiceProvider.id);
		} catch (error) {
			console.error("Erreur lors de la suppression:", error);
		}
	};

	const handleEditClick = (item: any) => {
		setSelectedServiceProvider(item);
		setIsEditModalOpen(true);
	};

	const handleDeleteClick = (item: any) => {
		setSelectedServiceProvider(item);
		setIsDeleteModalOpen(true);
	};

	const rearrangedServiceProviderData = SPQuery.data?.data?.map(
		(item: any, index: number) => ({
			serial: index + 1,
			name: item.name,
			logo: item.logo ? (
				// eslint-disable-next-line @next/next/no-img-element
				<img
					src={item.logo}
					alt={item.name}
					className="w-10 h-10 object-contain rounded"
				/>
			) : (
				<span className="text-gray-400 text-sm">Aucun</span>
			),
			description: item.description || (
				<span className="text-gray-400 text-sm">
					Aucune description
				</span>
			),
			paymentProvider: item.paymentProvider?.name || (
				<span className="text-gray-400 text-sm">Non défini</span>
			),
			createdAt: getFormattedDateTime(item.createdAt),
			actions: (
				<div className="flex gap-2 items-center">
					<button
						className="px-4 py-2 bg-[#ffd83c] text-black rounded hover:bg-[#e6c335] transition disabled:opacity-50 disabled:cursor-not-allowed"
						onClick={() => handleEditClick(item)}
						disabled={
							createMutation.isLoading ||
							updateMutation.isLoading ||
							deleteMutation.isLoading
						}
					>
						Éditer
					</button>

					<button
						className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
						onClick={() => handleDeleteClick(item)}
						disabled={
							createMutation.isLoading ||
							updateMutation.isLoading ||
							deleteMutation.isLoading
						}
					>
						Supprimer
					</button>
				</div>
			),
		})
	);

	const isLoading =
		createMutation.isLoading ||
		updateMutation.isLoading ||
		deleteMutation.isLoading;

	return (
		<section>
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-2xl font-bold">
					Gestion des Services Provider
				</h2>
				<CButton
					text="Créer un nouveau provider"
					btnStyle="green"
					onClick={() => setIsCreateModalOpen(true)}
					height="40px"
					disabled={isLoading}
				/>
			</div>

			<div className="mt-8">
				<h3 className="text-lg font-semibold mb-4">
					Liste des Services provider
				</h3>
				<CustomTable
					headerData={headerSpDataV3}
					tableData={rearrangedServiceProviderData}
					threeButtons
					isLoading={SPQuery.isLoading && !SPQuery.data}
				/>
			</div>

			{/* Modale de création */}
			<CreateSPModal
				isOpen={isCreateModalOpen}
				onClose={() => setIsCreateModalOpen(false)}
				isLoading={createMutation.isLoading}
				onSubmit={createServiceProvider}
			/>

			{/* Modale d'édition */}
			<EditSPModal
				isOpen={isEditModalOpen}
				onClose={() => {
					setIsEditModalOpen(false);
					setSelectedServiceProvider(null);
				}}
				paymentProviders={paymentProviderQuery.data?.data}
				onSubmit={updateServiceProvider}
				isLoading={updateMutation.isLoading}
				initialData={selectedServiceProvider}
			/>

			{/* Modale de confirmation de suppression */}
			<DeleteConfirmationModal
				isOpen={isDeleteModalOpen}
				onClose={() => {
					setIsDeleteModalOpen(false);
					setSelectedServiceProvider(null);
				}}
				onConfirm={deleteServiceProvider}
				isLoading={deleteMutation.isLoading}
				itemName={selectedServiceProvider?.name || ""}
			/>
		</section>
	);
};

export default ServiceProvider;
