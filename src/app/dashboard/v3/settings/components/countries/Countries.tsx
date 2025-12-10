"use client";

import CButton from "@/components/shared/CButton";
import CustomTable from "@/components/shared/CustomTable";
import { headerCountriesDataV3 } from "@/constants/v3/KYCDataV3";
import React, { useState } from "react";
import { useQuery, useMutation } from "react-query";
import toast from "react-hot-toast";
import { CountriesServiceV3 } from "@/api/services/v3/countries";
import CreateCountryModal from "./components/CreateCountryModal";
import EditCountryModal from "./components/EditCountryModal";
import DeleteConfirmationModal from "./components/DeleteConfirmationModal";
import { useRouter } from "next/navigation";
import { FourDots } from "@/components/shared/icons";

type Props = {
	isLoading?: boolean;
	search?: string;
	setSearch?: (data?: any) => void;
};

// Service pour créer un pays
const handleCreateCountry = async (countryData: any) => {
	const response = await CountriesServiceV3.createCountry(countryData);
	const responseJson = await response.json();
	if (!response.ok) {
		throw new Error(
			responseJson.message || "Erreur lors de la création du pays"
		);
	}
	return responseJson;
};

// Service pour récupérer les pays
const handleGetCountries = async () => {
	const response = await CountriesServiceV3.getCountries();
	const responseJson = await response.json();
	if (!response.ok) {
		throw new Error(
			responseJson.message || "Erreur lors de la récupération des pays"
		);
	}
	return responseJson.data;
};

// Service pour modifier un pays
const handleUpdateCountry = async ({ id, data }: { id: string; data: any }) => {
	const response = await CountriesServiceV3.updateCountry(id, data);
	const responseJson = await response.json();
	if (!response.ok) {
		throw new Error(
			responseJson.message || "Erreur lors de la modification du pays"
		);
	}
	return responseJson;
};

// Service pour supprimer un pays
const handleDeleteCountry = async (id: string) => {
	const response = await CountriesServiceV3.deleteCountry(id);
	const responseJson = await response.json();
	if (!response.ok) {
		throw new Error(
			responseJson.message || "Erreur lors de la suppression du pays"
		);
	}
	return responseJson;
};

// Composant Dropdown pour les actions
const ActionsDropdown = ({
	country,
	onEdit,
	onDelete,
	disabled,
}: {
	country: any;
	onEdit: () => void;
	onDelete: () => void;
	disabled: boolean;
}) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="relative">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="px-4 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium transition flex items-center gap-2"
				disabled={disabled}
			>
				Actions
				<svg
					className={`w-4 h-4 transition-transform ${
						isOpen ? "rotate-180" : ""
					}`}
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M19 9l-7 7-7-7"
					/>
				</svg>
			</button>

			{isOpen && (
				<>
					{/* Overlay pour fermer le dropdown */}
					<div
						className="fixed inset-0 z-10"
						onClick={() => setIsOpen(false)}
					/>

					{/* Menu dropdown */}
					<div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
						<button
							onClick={() => {
								onEdit();
								setIsOpen(false);
							}}
							className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm font-medium text-gray-700 flex items-center gap-2 rounded-t-lg transition"
							disabled={disabled}
						>
							<svg
								className="w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
								/>
							</svg>
							Éditer
						</button>

						<button
							onClick={() => {
								onDelete();
								setIsOpen(false);
							}}
							className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm font-medium text-red-600 flex items-center gap-2 rounded-b-lg transition"
							disabled={disabled}
						>
							<svg
								className="w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
								/>
							</svg>
							Supprimer
						</button>
					</div>
				</>
			)}
		</div>
	);
};

const Countries = ({ search, setSearch }: Props) => {
	const router = useRouter();

	// États pour les modales
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [selectedCountry, setSelectedCountry] = useState<any>(null);

	// Query pour récupérer les pays
	const countriesQuery = useQuery({
		queryKey: ["countries"],
		queryFn: handleGetCountries,
		onError: (err: any) => {
			toast.error(`Erreur lors du chargement des pays: ${err.message}`);
		},
	});

	// Mutation pour créer un pays
	const createMutation = useMutation({
		mutationFn: handleCreateCountry,
		onError: (err: any) => {
			toast.error(`Erreur: ${err.message}`);
		},
		onSuccess: (data) => {
			toast.success("Pays créé avec succès !");
			setIsCreateModalOpen(false);
			countriesQuery.refetch();
		},
	});

	// Mutation pour modifier un pays
	const updateMutation = useMutation({
		mutationFn: handleUpdateCountry,
		onError: (err: any) => {
			toast.error(`Erreur: ${err.message}`);
		},
		onSuccess: (data) => {
			toast.success("Pays modifié avec succès !");
			setIsEditModalOpen(false);
			setSelectedCountry(null);
			countriesQuery.refetch();
		},
	});

	// Mutation pour supprimer un pays
	const deleteMutation = useMutation({
		mutationFn: handleDeleteCountry,
		onError: (err: any) => {
			toast.error(`Erreur: ${err.message}`);
		},
		onSuccess: (data) => {
			toast.success("Pays supprimé avec succès !");
			setIsDeleteModalOpen(false);
			setSelectedCountry(null);
			countriesQuery.refetch();
		},
	});

	// --------------------------------
	// Handler pour créer un nouveau pays
	// --------------------------------
	const CreateCountry = async (countryData: any) => {
		createMutation.mutate(countryData);
	};

	// --------------------------------
	// Handler pour éditer un pays
	// --------------------------------
	const handleEditCountry = async (countryData: any) => {
		updateMutation.mutate({
			id: selectedCountry.id,
			data: countryData,
		});
	};

	// --------------------------------
	// Handler pour supprimer un pays
	// --------------------------------
	const DeleteCountry = async () => {
		deleteMutation.mutate(selectedCountry.id);
	};

	// --------------------------------
	// Ouvrir modale d'édition
	// --------------------------------
	const openEditModal = (country: any) => {
		setSelectedCountry(country);
		setIsEditModalOpen(true);
	};

	// --------------------------------
	// Ouvrir modale de suppression
	// --------------------------------
	const openDeleteModal = (country: any) => {
		setSelectedCountry(country);
		setIsDeleteModalOpen(true);
	};

	// --------------------------------
	// Naviguer vers la page de gestion
	// --------------------------------
	const navigateToManage = (country: any) => {
		router.push(
			`settings/manage-country/${country.id}?code=${country.code}`
		);
	};

	// --------------------------------
	//  Tableau des pays avec actions
	// --------------------------------
	const countriesTableData = countriesQuery.data?.map(
		(country: any, index: number) => ({
			serial: index + 1,
			name: country.name,
			flag: (
				<img
					src={country.flag}
					alt={country.name}
					className="w-8 h-6 object-cover rounded"
				/>
			),
			currency: country.currency,
			dialCode: country.dialCode,
			code: country.code,
			codeIso3: country.codeIso3,
			phoneLength: country.phoneLength,
			actions: (
				<div className="flex gap-2 items-center">
					<ActionsDropdown
						country={country}
						onEdit={() => openEditModal(country)}
						onDelete={() => openDeleteModal(country)}
						disabled={
							updateMutation.isLoading || deleteMutation.isLoading
						}
					/>

					{/* Bouton Gérer séparé */}

					<CButton
						text={"Manage"}
						onClick={() => navigateToManage(country)}
						btnStyle={"dark"}
						icon={<FourDots />}
					/>
					{/* <button
						onClick={() => navigateToManage(country)}
						className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition font-medium flex items-center gap-2"
						disabled={
							updateMutation.isLoading || deleteMutation.isLoading
						}
					>
						<svg
							className="w-4 h-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
							/>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
							/>
						</svg>
						Gérer
					</button> */}
				</div>
			),
		})
	);

	return (
		<section>
			{/* Bouton pour créer un nouveau pays */}
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-2xl font-bold">Gestion des Pays</h2>
				<CButton
					text="Créer un nouveau pays"
					btnStyle="green"
					onClick={() => setIsCreateModalOpen(true)}
					height="40px"
					disabled={createMutation.isLoading}
				/>
			</div>

			<div className="mt-8">
				<h3 className="text-lg font-semibold mb-4">
					Liste des pays disponibles
				</h3>
				<CustomTable
					headerData={{
						...headerCountriesDataV3,
						actions: "Actions",
					}}
					tableData={countriesTableData || []}
					isLoading={countriesQuery.isLoading}
					search={search}
					setSearch={setSearch}
					threeButtons={true}
				/>
			</div>

			{/* Modale de création de pays */}
			<CreateCountryModal
				isOpen={isCreateModalOpen}
				onClose={() => setIsCreateModalOpen(false)}
				onSubmit={CreateCountry}
				isLoading={createMutation.isLoading}
			/>

			{/* Modale d'édition de pays */}
			<EditCountryModal
				isOpen={isEditModalOpen}
				onClose={() => {
					setIsEditModalOpen(false);
					setSelectedCountry(null);
				}}
				onSubmit={handleEditCountry}
				isLoading={updateMutation.isLoading}
				country={selectedCountry}
			/>

			{/* Modale de confirmation de suppression */}
			<DeleteConfirmationModal
				isOpen={isDeleteModalOpen}
				onClose={() => {
					setIsDeleteModalOpen(false);
					setSelectedCountry(null);
				}}
				onConfirm={DeleteCountry}
				isLoading={deleteMutation.isLoading}
				countryName={selectedCountry?.name}
			/>
		</section>
	);
};

export default Countries;
