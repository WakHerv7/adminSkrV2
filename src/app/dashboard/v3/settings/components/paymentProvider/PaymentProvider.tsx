"use client";

import { PaymentProviderServiceV3 } from "@/api/services/v3/Payment_Provider";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "react-query";
import CustomTable from "@/components/shared/CustomTable";
import { getFormattedDateTime } from "@/utils/DateFormat";
import { headerPaymentProviderV3 } from "@/constants/v3/KYCDataV3";
import CreatePaymentProviderModal from "./components/CreatePaymentProviderModal";
import DeleteConfirmationModal from "./components/DeleteConfirmationModal";
import ActivateConfirmationModal from "./components/ActivateConfirmationModal";
import CButton from "@/components/shared/CButton";
import { handleToggleActivePaymentpoviders } from "@/api/handlers/PaymentProvider.handlers";

const handleGetPaymentProviders = async ({ queryKey }: any) => {
	const [_key, filterContent] = queryKey;
	console.log("contenu du filtre", filterContent);

	const response = await PaymentProviderServiceV3.getAll({
		filters: filterContent,
	});
	const responseJson = await response.json();

	if (!response.ok) {
		throw new Error(
			responseJson.message || "Failed to fetch Payment Providers"
		);
	}

	return responseJson;
};

const handleCreatePaymentProvider = async (data: any) => {
	const response = await PaymentProviderServiceV3.create(data);
	const responseJson = await response.json();

	if (!response.ok) {
		throw new Error(
			responseJson.message || "Failed to create payment provider"
		);
	}

	return responseJson;
};

const handleUpdatePaymentProvider = async ({ id, data }: any) => {
	console.log("Mise à jour du provider:", id, data);

	const response = await PaymentProviderServiceV3.update(id, data);
	const responseJson = await response.json();

	if (!response.ok) {
		throw new Error(responseJson.error);
	}

	return responseJson;
};

const handleDeletePaymentProvider = async (id: string) => {
	console.log("Suppression du provider:", id);

	const response = await PaymentProviderServiceV3.delete(id);
	// Gérer le cas 204 No Content
	if (response.status === 204) {
		return { success: true, message: "Payment provider supprimé avec succès" };
	}

	// Gérer les erreurs
	if (!response.ok) {
		let errorMessage = "Erreur lors de la suppression du parment privider";
		try {
			const errorData = await response.json();
			errorMessage = errorData.message || errorMessage;
		} catch {
			errorMessage = `Erreur ${response.status}: ${response.statusText}`;
		}
		throw new Error(errorMessage);
	}

	// Gérer les autres réponses réussies
	try {
		return await response.json();
	} catch {
		return { success: true, message: "Suppression réussie" };
	}
};

const PaymentProvider = () => {
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isActivateModalOpen, setIsActivateModalOpen] = useState(false);
	const [selectedProvider, setSelectedProvider] = useState<any>(null);
	const [filterContent, setFilterContent] = useState<any>({});

	const paymentProviderQuery = useQuery({
		queryKey: ["payment-providers", filterContent],
		queryFn: handleGetPaymentProviders,
		onError: (err: any) => {
			console.error("Erreur lors du chargement:", err);
			toast.error(err.message);
		},
	});

	const createMutation = useMutation({
		mutationFn: handleCreatePaymentProvider,
		onError: (err: any) => {
			console.error("Erreur lors de la création:", err);
			toast.error(err.message || "Erreur lors de la création");
		},
		onSuccess: (data) => {
			console.log("Provider créé avec succès:", data);
			toast.success("Payment provider créé avec succès");
			setIsCreateModalOpen(false);
			paymentProviderQuery.refetch();
		},
	});

	const updateMutation = useMutation({
		mutationFn: handleUpdatePaymentProvider,
		onError: (err: any) => {
			console.error("Erreur lors de la mise à jour:", err);
			toast.error(err.message || "Erreur lors de la mise à jour");
		},
		onSuccess: (data) => {
			console.log("Provider mis à jour avec succès:", data);
			toast.success("Payment provider mis à jour avec succès");
			setIsEditModalOpen(false);
			setSelectedProvider(null);
			paymentProviderQuery.refetch();
		},
	});

	const deleteMutation = useMutation({
		mutationFn: handleDeletePaymentProvider,
		onError: (err: any) => {
			console.error("Erreur lors de la suppression:", err);
			toast.error(err.message || "Erreur lors de la suppression");
		},
		onSuccess: (data) => {
			console.log("Provider supprimé avec succès:", data);
			toast.success("Payment provider supprimé avec succès");
			setIsDeleteModalOpen(false);
			setSelectedProvider(null);
			paymentProviderQuery.refetch();
		},
	});

	const toggleActiveMutation = useMutation({
		mutationFn: handleToggleActivePaymentpoviders,
		onError: (err: any) => {
			toast.error(err.message);
		},
		onSuccess: () => {
			toast.success("Payment provider activé avec succès");
			setIsActivateModalOpen(false);
			setSelectedProvider(null);
			paymentProviderQuery.refetch();
		},
	});

	const createPaymentProvider = async (data: any) => {
		console.log("Données reçues du formulaire:", data);

		if (!data || typeof data !== "object") {
			toast.error("Format de données invalide");
			return;
		}

		const payloadData = {
			name: data.name,
			code: data.code,
			description: data.description,
			isActive: data.isActive ?? true,
		};

		console.log("Données préparées pour l'API:", payloadData);

		try {
			await createMutation.mutateAsync(payloadData);
		} catch (error) {
			console.error("Erreur capturée:", error);
		}
	};

	const updatePaymentProvider = async (data: any) => {
		console.log("Données de mise à jour reçues:", data);

		if (!selectedProvider?.id) {
			toast.error("Aucun provider sélectionné");
			return;
		}

		if (!data || typeof data !== "object") {
			toast.error("Format de données invalide");
			return;
		}

		const payloadData = {
			id: selectedProvider.id,
			data: {
				name: data.name,
				code: data.code,
				description: data.description,
				isActive: data.isActive ?? true,
			},
		};

		console.log("Données préparées pour la mise à jour:", payloadData);

		try {
			await updateMutation.mutateAsync(payloadData);
		} catch (error) {
			console.error("Erreur capturée:", error);
		}
	};

	const deletePaymentProvider = async () => {
		if (!selectedProvider?.id) {
			toast.error("Aucun provider sélectionné");
			return;
		}

		try {
			await deleteMutation.mutateAsync(selectedProvider.id);
		} catch (error) {
			console.error("Erreur capturée:", error);
		}
	};

	const activatePaymentProvider = async () => {
		if (!selectedProvider?.id) {
			toast.error("Aucun provider sélectionné");
			return;
		}

		try {
			await toggleActiveMutation.mutateAsync(selectedProvider.id);
		} catch (error) {
			console.error("Erreur lors de l'activation:", error);
		}
	};

	const handleEditClick = (item: any) => {
		setSelectedProvider(item);
		setIsEditModalOpen(true);
	};

	const handleDeleteClick = (item: any) => {
		setSelectedProvider(item);
		setIsDeleteModalOpen(true);
	};

	const handleActivateClick = (item: any) => {
		setSelectedProvider(item);
		setIsActivateModalOpen(true);
	};

	const rearrangedPaymentProviderData = paymentProviderQuery.data?.data?.map(
		(item: any, index: number) => ({
			serial: index + 1,
			name: item.name,
			code: item.code,
			logo: item.logo ? (
				<img
					src={item.logo}
					alt={item.name}
					className="w-10 h-10 object-contain rounded"
				/>
			) : (
				<span className="text-gray-400 text-sm">Aucun</span>
			),
			isActive: item.isActive ? (
				<span className="text-green-600 font-medium">Actif</span>
			) : (
				<span className="text-red-600 font-medium">Inactif</span>
			),
			createdAt: getFormattedDateTime(item.createdAt),
			actions: (
				<div className="flex gap-2 items-center">
					{item.isActive ? (
						// Boutons pour les providers actifs
						<>
							<button
								className="px-4 py-2 bg-[#ffd83c] text-black rounded hover:bg-[#e6c335] transition disabled:opacity-50 disabled:cursor-not-allowed"
								onClick={() => handleEditClick(item)}
								disabled={
									createMutation.isLoading ||
									updateMutation.isLoading ||
									deleteMutation.isLoading ||
									toggleActiveMutation.isLoading
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
									deleteMutation.isLoading ||
									toggleActiveMutation.isLoading
								}
							>
								Supprimer
							</button>
						</>
					) : (
						// Bouton pour les providers inactifs
						<button
							className="px-4 py-2 bg-[#18BC7A] text-white rounded hover:bg-[#16a56c] transition disabled:opacity-50 disabled:cursor-not-allowed"
							onClick={() => handleActivateClick(item)}
							disabled={toggleActiveMutation.isLoading}
						>
							Activer
						</button>
					)}
				</div>
			),
		})
	);

	const isLoading =
		createMutation.isLoading ||
		updateMutation.isLoading ||
		deleteMutation.isLoading ||
		toggleActiveMutation.isLoading;

	return (
		<section>
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-2xl font-bold">
					Gestion des Payment Providers
				</h2>
				<CButton
					text="Créer un nouveau Payment Provider"
					btnStyle="green"
					onClick={() => setIsCreateModalOpen(true)}
					height="40px"
					disabled={isLoading}
				/>
			</div>

			<div className="mt-8">
				<h3 className="text-lg font-semibold mb-4">
					Liste des Payment Providers
				</h3>
				<CustomTable
					headerData={headerPaymentProviderV3}
					tableData={rearrangedPaymentProviderData}
					threeButtons
					isLoading={
						paymentProviderQuery.isLoading &&
						!paymentProviderQuery.data
					}
					filter
					filterContent={filterContent}
					setFilterContent={setFilterContent}
					filterType="payment-provider-v3"
				/>
			</div>

			{/* Modale de création */}
			<CreatePaymentProviderModal
				isOpen={isCreateModalOpen}
				onClose={() => setIsCreateModalOpen(false)}
				isLoading={createMutation.isLoading}
				onSubmit={createPaymentProvider}
			/>

			{/* Modale d'édition */}
			<CreatePaymentProviderModal
				isOpen={isEditModalOpen}
				onClose={() => {
					setIsEditModalOpen(false);
					setSelectedProvider(null);
				}}
				isLoading={updateMutation.isLoading}
				onSubmit={updatePaymentProvider}
				initialData={selectedProvider}
				isEdit={true}
			/>

			{/* Modale de confirmation de suppression */}
			<DeleteConfirmationModal
				isOpen={isDeleteModalOpen}
				onClose={() => {
					setIsDeleteModalOpen(false);
					setSelectedProvider(null);
				}}
				onConfirm={deletePaymentProvider}
				isLoading={deleteMutation.isLoading}
				itemName={selectedProvider?.name || ""}
			/>

			{/* Modale de confirmation d'activation */}
			<ActivateConfirmationModal
				isOpen={isActivateModalOpen}
				onClose={() => {
					setIsActivateModalOpen(false);
					setSelectedProvider(null);
				}}
				onConfirm={activatePaymentProvider}
				isLoading={toggleActiveMutation.isLoading}
				providerName={selectedProvider?.name || ""}
			/>
		</section>
	);
};

export default PaymentProvider;
