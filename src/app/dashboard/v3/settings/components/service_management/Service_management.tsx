// app/service_management/page.tsx
"use client";

import {
	handleCreateService,
	handleDeleteService,
	handleGetService,
	handleRestoreService,
	handleUpdateService,
} from "@/api/handlers/service.handler";
import CButton from "@/components/shared/CButton";
import CustomTable from "@/components/shared/CustomTable";
import { serviceHeaderDataV3 } from "@/constants/v3/KYCDataV3";
import { getFormattedDateTime } from "@/utils/DateFormat";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "react-query";
import CreateServiceModal from "./components/CreateServiceModal";
import EditServiceModal from "./components/EditServiceModal";
import DeleteConfirmationModal from "./components/DeleteConfirmationModal";
import RestoreConfirmationModal from "./components/RestoreConfirmationModal";

const Service_management = () => {
	const queryClient = useQueryClient();

	// États pour les modales
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);

	// Service sélectionné
	const [selectedService, setSelectedService] = useState<any>(null);

	// Query pour récupérer les services
	const getServicesQuery = useQuery({
		queryKey: ["service"],
		queryFn: handleGetService,
		onError: (err: any) => {
			toast.error(err.message);
		},
	});

	// Mutation pour créer un service
	const createServiceMutation = useMutation({
		mutationFn: handleCreateService,
		onSuccess: () => {
			toast.success("Service créé avec succès");
			setIsCreateModalOpen(false);
			queryClient.invalidateQueries({ queryKey: ["service"] });
		},
		onError: (err: any) => {
			toast.error(err.message || "Erreur lors de la création du service");
		},
	});

	const updateServiceMutationV3 = useMutation({
		mutationFn: handleUpdateService,
		onSuccess: () => {
			toast.success("Service updated successfully");
		},
		onError: (err: any) => {
			toast.error(err.message);
		},
	});

	const deleteServiceMutationV3 = useMutation({
		mutationFn: handleDeleteService,
		onSuccess: () => {
			toast.success("Service deleted successfully");
		},
		onError: (err: any) => {
			toast.error(err.message);
		},
	});

	const restoreServiceMutationV3 = useMutation({
		mutationFn: handleRestoreService,
		onSuccess: () => {
			toast.success("Service restored successfully");
		},
		onError: (err: any) => {
			toast.error(err.message);
		},
	});

	// Mutation pour mettre à jour un service
	const updateServiceMutation = useMutation({
		mutationFn: ({ id, data }: { id: string; data: any }) =>
			updateServiceMutationV3.mutateAsync({ id, data }),
		onSuccess: () => {
			toast.success("Service mis à jour avec succès");
			setIsEditModalOpen(false);
			setSelectedService(null);
			queryClient.invalidateQueries({ queryKey: ["service"] });
		},
		onError: (err: any) => {
			toast.error(
				err.message || "Erreur lors de la mise à jour du service"
			);
		},
	});

	// Mutation pour supprimer un service
	const deleteServiceMutation = useMutation({
		mutationFn: (id: string) => deleteServiceMutationV3.mutateAsync(id),
		onSuccess: () => {
			toast.success("Service supprimé avec succès");
			setIsDeleteModalOpen(false);
			setSelectedService(null);
			queryClient.invalidateQueries({ queryKey: ["service"] });
		},
		onError: (err: any) => {
			toast.error(
				err.message || "Erreur lors de la suppression du service"
			);
		},
	});

	// Mutation pour restaurer un service
	const restoreServiceMutation = useMutation({
		mutationFn: (id: string) => restoreServiceMutationV3.mutateAsync(id),
		onSuccess: () => {
			toast.success("Service restauré avec succès");
			setIsRestoreModalOpen(false);
			setSelectedService(null);
			queryClient.invalidateQueries({ queryKey: ["service"] });
		},
		onError: (err: any) => {
			toast.error(
				err.message || "Erreur lors de la restauration du service"
			);
		},
	});

	// Handler pour créer un service
	const handleCreateSubmit = async (data: any) => {
		try {
			const serviceData = {
				name: data.name,
				sens: data.sens,
				description: data.description,
				transactionType: data.transactionType,
			};
			await createServiceMutation.mutateAsync(serviceData);
		} catch (error) {
			console.error("Erreur dans handleCreateSubmit:", error);
		}
	};

	// Handler pour mettre à jour un service
	const handleUpdateSubmit = async (data: any) => {
		try {
			const serviceData = {
				name: data.name,
				sens: data.sens,
				description: data.description,
				transactionType: data.transactionType,
			};
			await updateServiceMutation.mutateAsync({
				id: selectedService.id,
				data: serviceData,
			});
		} catch (error) {
			console.error("Erreur dans handleUpdateSubmit:", error);
		}
	};

	// Handler pour supprimer un service
	const handleDeleteConfirm = async () => {
		if (selectedService) {
			await deleteServiceMutation.mutateAsync(selectedService.id);
		}
	};

	// Handler pour restaurer un service
	const handleRestoreConfirm = async () => {
		if (selectedService) {
			await restoreServiceMutation.mutateAsync(selectedService.id);
		}
	};

	// Fonctions pour ouvrir les modales
	const handleEditClick = (service: any) => {
		setSelectedService(service);
		setIsEditModalOpen(true);
	};

	const handleDeleteClick = (service: any) => {
		setSelectedService(service);
		setIsDeleteModalOpen(true);
	};

	const handleRestoreClick = (service: any) => {
		setSelectedService(service);
		setIsRestoreModalOpen(true);
	};

	// Données formatées pour le tableau
	const rearrangedServiceTableData = getServicesQuery.data?.data?.map(
		(item: any, index: number) => ({
			serial: index + 1,
			name: item.name,
			sens: (
				<span
					className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
						item.sens === "IN"
							? "bg-green-100 text-green-800"
							: item.sens === "OUT"
							? "bg-red-100 text-red-800"
							: "bg-gray-100 text-gray-800"
					}`}
				>
					{item.sens}
				</span>
			),
			description: item.description || (
				<span className="text-gray-400 text-sm">
					Aucune description
				</span>
			),
			createdAt: getFormattedDateTime(item.createdAt),
			actions: (
				<div className="flex gap-2 items-center">
					<button
						className="px-4 py-2 bg-[#ffd83c] text-black rounded hover:bg-[#e6c335] transition"
						onClick={() => handleEditClick(item)}
						disabled={
							createServiceMutation.isLoading ||
							updateServiceMutation.isLoading ||
							deleteServiceMutation.isLoading ||
							restoreServiceMutation.isLoading
						}
					>
						Éditer
					</button>

					<button
						className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
						onClick={() => handleDeleteClick(item)}
						disabled={
							createServiceMutation.isLoading ||
							updateServiceMutation.isLoading ||
							deleteServiceMutation.isLoading ||
							restoreServiceMutation.isLoading
						}
					>
						Supprimer
					</button>

					{/* Si vous voulez aussi un bouton Restaurer */}
					{/* <button
						className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
						onClick={() => handleRestoreClick(item)}
					>
						Restaurer
					</button> */}
				</div>
			),
		})
	);

	const isLoading =
		createServiceMutation.isLoading ||
		updateServiceMutation.isLoading ||
		deleteServiceMutation.isLoading ||
		restoreServiceMutation.isLoading;

	return (
		<section>
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-2xl font-bold">Gestion des services</h2>
				<CButton
					text="Créer un nouveau service"
					btnStyle="green"
					onClick={() => setIsCreateModalOpen(true)}
					height="40px"
					disabled={isLoading}
				/>
			</div>

			<div className="mt-8">
				<h3 className="text-lg font-semibold mb-4">
					Liste des Services
				</h3>
				<CustomTable
					headerData={serviceHeaderDataV3}
					tableData={rearrangedServiceTableData}
					threeButtons
					isLoading={
						getServicesQuery.isLoading && !getServicesQuery.data
					}
				/>
			</div>

			{/* Modale de création */}
			<CreateServiceModal
				isOpen={isCreateModalOpen}
				onClose={() => setIsCreateModalOpen(false)}
				onSubmit={handleCreateSubmit}
				isLoading={createServiceMutation.isLoading}
			/>

			{/* Modale d'édition */}
			<EditServiceModal
				isOpen={isEditModalOpen}
				onClose={() => {
					setIsEditModalOpen(false);
					setSelectedService(null);
				}}
				onSubmit={handleUpdateSubmit}
				isLoading={updateServiceMutation.isLoading}
				initialData={selectedService}
			/>

			{/* Modale de confirmation de suppression */}
			<DeleteConfirmationModal
				isOpen={isDeleteModalOpen}
				onClose={() => {
					setIsDeleteModalOpen(false);
					setSelectedService(null);
				}}
				onConfirm={handleDeleteConfirm}
				isLoading={deleteServiceMutation.isLoading}
				serviceName={selectedService?.name || ""}
			/>

			{/* Modale de confirmation de restauration */}
			<RestoreConfirmationModal
				isOpen={isRestoreModalOpen}
				onClose={() => {
					setIsRestoreModalOpen(false);
					setSelectedService(null);
				}}
				onConfirm={handleRestoreConfirm}
				isLoading={restoreServiceMutation.isLoading}
				serviceName={selectedService?.name || ""}
			/>
		</section>
	);
};

export default Service_management;
