"use client";

import { KYCServiceV3 } from "@/api/services/v3/kyc";
import Layout from "@/components/shared/Layout";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "react-query";
import {
	User,
	FileText,
	Calendar,
	MapPin,
	Phone,
	Mail,
	CheckCircle,
	XCircle,
	Clock,
	ChevronRight,
	Plus,
	Trash2,
	Check,
	X,
	ChevronDown,
} from "lucide-react";
import { KYCRaisonRejectServiceV3 } from "@/api/services/v3/kycRaisonReject";
import { kycRejectReasonsEN } from "@/constants/v3/kycRejectReasons";
import { Search } from "lucide-react";

const handleGetKyc = async ({ queryKey }: any) => {
	const [_key, userId] = queryKey;
	const response = await KYCServiceV3.getKycDetailsByUserId(userId);
	const responseJson = await response.json();

	if (!response.ok) {
		throw new Error(
			responseJson.message ||
				"Erreur lors de la récupération des détails KYC"
		);
	}

	return responseJson.data;
};

const handleUpdateKyc = async (kycId: string, data: any) => {
	const response = await KYCServiceV3.updateKyc(kycId, data);
	const responseJson = await response.json();
	if (!response.ok) {
		throw new Error(
			responseJson.message || "Erreur lors de la mise à jour du KYC"
		);
	}

	return responseJson.data;
};

const handleGetReasonRejects = async () => {
	const response = await KYCRaisonRejectServiceV3.getRaisonRejects();
	const responseJson = await response.json();
	if (!response.ok) {
		throw new Error(
			responseJson.message ||
				"Erreur lors de la récupération des raisons de rejet"
		);
	}
	return responseJson.data;
};

const ManageKyc = () => {
	const params = useParams();
	const userId = params.id;
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const [showRejectModal, setShowRejectModal] = useState(false);
	const [showApproveModal, setShowApproveModal] = useState(false);
	const [rejectReasons, setRejectReasons] = useState<string[]>([""]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [selectedPredefinedReasons, setSelectedPredefinedReasons] = useState<
		string[]
	>([]);
	const [customRejectReasons, setCustomRejectReasons] = useState<string[]>([
		"",
	]);

	const [additionalReason, setAdditionalReason] = useState("");
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [selectedRejectReasons, setSelectedRejectReasons] = useState<
		string[]
	>([]);
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
	const [customReason, setCustomReason] = useState("");
	const [searchQuery, setSearchQuery] = useState("");

	// Fonctions pour gérer les raisons personnalisées
	const addCustomRejectReason = () => {
		setCustomRejectReasons([...customRejectReasons, ""]);
	};

	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setDropdownOpen(false);
			}
		};

		if (dropdownOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [dropdownOpen]);

	// Ajoutez la ref au container
	<div className="relative" ref={dropdownRef}>
		{/* Votre dropdown */}
	</div>;

	const removeCustomRejectReason = (index: number) => {
		if (customRejectReasons.length > 1) {
			const newReasons = [...customRejectReasons];
			newReasons.splice(index, 1);
			setCustomRejectReasons(newReasons);
		}
	};

	const updateCustomRejectReason = (index: number, value: string) => {
		const newReasons = [...customRejectReasons];
		newReasons[index] = value;
		setCustomRejectReasons(newReasons);
	};

	const kycQuery = useQuery({
		queryKey: ["kyc-details", userId],
		queryFn: handleGetKyc,
		onError: (err: any) => {
			toast.error(`Erreur: ${err.message}`);
		},
	});

	const updateKyc = useMutation({
		mutationFn: ({ kycId, data }: { kycId: string; data: any }) =>
			handleUpdateKyc(kycId, data),
		onMutate: () => {
			setIsSubmitting(true);
		},
		onSuccess: (res: any) => {
			console.log("KYC mis à jour avec succès :", res);
			toast.success("KYC mis à jour avec succès");
			refetch();
			setShowApproveModal(false);
			setShowRejectModal(false);
			setRejectReasons([""]);
		},
		onError: (error: any) => {
			console.error(
				"Erreur lors de la mise à jour du KYC :",
				error.message
			);
			toast.error(`Erreur: ${error.message}`);
		},
		onSettled: () => {
			setIsSubmitting(false);
		},
	});

	const getReasonRejectQuery = useQuery({
		queryKey: ["kyc-reason-rejects"],
		queryFn: handleGetReasonRejects,
		onError: (err: any) => {
			toast.error(`Erreur: ${err.message}`);
		},
	});

	const { data: kycData, isLoading, isError, refetch } = kycQuery;

	// Fonctions pour gérer les raisons de rejet
	const addRejectReason = () => {
		setRejectReasons([...rejectReasons, ""]);
	};

	const removeRejectReason = (index: number) => {
		if (rejectReasons.length > 1) {
			const newReasons = rejectReasons.filter((_, i) => i !== index);
			setRejectReasons(newReasons);
		}
	};

	const updateRejectReason = (index: number, value: string) => {
		const newReasons = [...rejectReasons];
		newReasons[index] = value;
		setRejectReasons(newReasons);
	};

	const getStatusBadge = (status: string) => {
		const statusConfig = {
			COMPLETED: {
				icon: CheckCircle,
				bg: "bg-green-50",
				text: "text-[#18bc7a]",
				border: "border-[#18bc7a]",
				label: "Completed",
			},
			PENDING: {
				icon: Clock,
				bg: "bg-yellow-50",
				text: "text-yellow-700",
				border: "border-yellow-300",
				label: "En attente",
			},
			REJECTED: {
				icon: XCircle,
				bg: "bg-red-50",
				text: "text-red-700",
				border: "border-red-300",
				label: "Rejeté",
			},
		};

		const config =
			statusConfig[status as keyof typeof statusConfig] ||
			statusConfig.PENDING;
		const Icon = config.icon;

		return (
			<span
				className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${config.bg} ${config.text} ${config.border} border font-medium`}
			>
				<Icon className="w-4 h-4" />
				{config.label}
			</span>
		);
	};

	const handleAction = async (action: string) => {
		switch (action) {
			case "approve":
				setShowApproveModal(true);
				break;
			case "reject":
				setShowRejectModal(true);
				break;
			case "view-history":
				toast.success("Fonctionnalité d'historique à venir...");
				break;
			case "download-docs":
				toast.success("Téléchargement des documents...");
				break;
			case "contact-user":
				toast.success("Ouverture de la messagerie...");
				break;
			default:
				toast.success(`Action "${action}" en cours...`);
		}
	};

	if (isLoading) {
		return (
			<Layout title="Manage KYC">
				<div className="flex items-center justify-center h-64">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#18bc7a]"></div>
				</div>
			</Layout>
		);
	}

	if (isError || !kycData) {
		return (
			<Layout title="Manage KYC">
				<div className="flex items-center justify-center h-64">
					<div className="text-center">
						<XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
						<p className="text-gray-600">
							Impossible de charger les détails KYC
						</p>
					</div>
				</div>
			</Layout>
		);
	}

	return (
		<Layout title="Manage KYC">
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Section principale - Détails KYC */}
				<div className="lg:col-span-2 space-y-6">
					{/* En-tête utilisateur */}
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
						<div className="flex items-start justify-between mb-6">
							<div className="flex items-center gap-4">
								<div className="w-16 h-16 bg-[#18bc7a] rounded-full flex items-center justify-center shadow-lg">
									<User className="w-8 h-8 text-white" />
								</div>
								<div>
									<h2 className="text-2xl font-bold text-gray-900">
										{kycData.user.fullName ||
											kycData.user.firstName ||
											"Utilisateur"}
									</h2>
									<p className="text-gray-500 text-sm">
										ID: {kycData.user.userId}
									</p>
								</div>
							</div>
							{getStatusBadge(kycData.status)}
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="flex items-center gap-3 text-gray-700">
								<Phone className="w-5 h-5 text-[#18bc7a]" />
								<div>
									<p className="text-xs text-gray-500">
										Téléphone
									</p>
									<p className="font-medium">
										{kycData.user.phoneNumber ||
											"Non renseigné"}
									</p>
								</div>
							</div>
							<div className="flex items-center gap-3 text-gray-700">
								<Mail className="w-5 h-5 text-[#18bc7a]" />
								<div>
									<p className="text-xs text-gray-500">
										Email
									</p>
									<p className="font-medium">
										{kycData.user.email || "Non renseigné"}
									</p>
								</div>
							</div>
							<div className="flex items-center gap-3 text-gray-700">
								<MapPin className="w-5 h-5 text-[#18bc7a]" />
								<div>
									<p className="text-xs text-gray-500">
										Ville
									</p>
									<p className="font-medium">
										{kycData.user.city || "Non renseigné"}
									</p>
								</div>
							</div>
							<div className="flex items-center gap-3 text-gray-700">
								<MapPin className="w-5 h-5 text-[#18bc7a]" />
								<div>
									<p className="text-xs text-gray-500">
										État/Région
									</p>
									<p className="font-medium">
										{kycData.user.state || "Non renseigné"}
									</p>
								</div>
							</div>
							<div className="flex items-center gap-3 text-gray-700">
								<Calendar className="w-5 h-5 text-[#18bc7a]" />
								<div>
									<p className="text-xs text-gray-500">
										Date de naissance
									</p>
									<p className="font-medium">
										{kycData.user.dateOfBirth
											? new Date(
													kycData.user.dateOfBirth
											  ).toLocaleDateString()
											: "Non renseigné"}
									</p>
								</div>
							</div>
							<div className="flex items-center gap-3 text-gray-700">
								<User className="w-5 h-5 text-[#18bc7a]" />
								<div>
									<p className="text-xs text-gray-500">
										Genre
									</p>
									<p className="font-medium">
										{kycData.user.gender || "Non renseigné"}
									</p>
								</div>
							</div>
							<div className="flex items-center gap-3 text-gray-700">
								<MapPin className="w-5 h-5 text-[#18bc7a]" />
								<div>
									<p className="text-xs text-gray-500">
										Adresse
									</p>
									<p className="font-medium">
										{kycData.user.address ||
											"Non renseigné"}
									</p>
								</div>
							</div>
						</div>

						{/* Statut du compte */}
						<div className="mt-6 pt-6 border-t border-gray-200">
							<h4 className="text-sm font-semibold text-gray-700 mb-3">
								Statut du compte
							</h4>
							<div className="flex items-center gap-4">
								<div className="flex items-center gap-2">
									<div
										className={`w-3 h-3 rounded-full ${
											kycData.user.isActive
												? "bg-[#18bc7a]"
												: "bg-gray-300"
										}`}
									></div>
									<span className="text-sm text-gray-600">
										{kycData.user.isActive
											? "Actif"
											: "Inactif"}
									</span>
								</div>
								<div className="flex items-center gap-2">
									<div
										className={`w-3 h-3 rounded-full ${
											!kycData.user.isDeleted
												? "bg-[#18bc7a]"
												: "bg-red-500"
										}`}
									></div>
									<span className="text-sm text-gray-600">
										{!kycData.user.isDeleted
											? "Non supprimé"
											: "Supprimé"}
									</span>
								</div>
							</div>
							<div className="mt-3 text-xs text-gray-500">
								<p>
									Compte créé le:{" "}
									{new Date(
										kycData.user.created_at
									).toLocaleDateString("fr-FR", {
										year: "numeric",
										month: "long",
										day: "numeric",
									})}
								</p>
								<p>
									Dernière mise à jour:{" "}
									{new Date(
										kycData.user.updated_at
									).toLocaleDateString("fr-FR", {
										year: "numeric",
										month: "long",
										day: "numeric",
									})}
								</p>
							</div>
						</div>
					</div>

					{/* Informations du document */}
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
							<FileText className="w-5 h-5 text-[#18bc7a]" />
							Informations du Document
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<p className="text-sm text-gray-500 mb-1">
									Type de document
								</p>
								<p className="font-medium text-gray-900">
									{kycData.documentType || "Non spécifié"}
								</p>
							</div>
							<div>
								<p className="text-sm text-gray-500 mb-1">
									Numéro de document
								</p>
								<p className="font-medium text-gray-900">
									{kycData.documentNumber || "Non renseigné"}
								</p>
							</div>
							<div>
								<p className="text-sm text-gray-500 mb-1">
									{`Date d'émission`}
								</p>
								<p className="font-medium text-gray-900">
									{kycData.documentIssueDate
										? new Date(
												kycData.documentIssueDate
										  ).toLocaleDateString()
										: "Non renseignée"}
								</p>
							</div>
							<div>
								<p className="text-sm text-gray-500 mb-1">
									{`Date d'expiration`}
								</p>
								<p className="font-medium text-gray-900">
									{kycData.documentDueDate
										? new Date(
												kycData.documentDueDate
										  ).toLocaleDateString()
										: "Non renseignée"}
								</p>
							</div>
							<div>
								<p className="text-sm text-gray-500 mb-1">
									{`Pays d'émission`}
								</p>
								<p className="font-medium text-gray-900">
									{kycData.documentIssuingCountry ||
										"Non renseigné"}
								</p>
							</div>
							<div>
								<p className="text-sm text-gray-500 mb-1">
									Créé le
								</p>
								<p className="font-medium text-gray-900">
									{new Date(
										kycData.created_at
									).toLocaleDateString()}
								</p>
							</div>
						</div>
					</div>

					{/* Images des documents */}
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">
							Documents
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
							{kycData.documentFrontImage && (
								<div className="space-y-2">
									<p className="text-sm font-medium text-gray-700">
										Document (Recto)
									</p>
									<img
										src={kycData.documentFrontImage}
										alt="Document recto"
										className="w-full h-48 object-cover rounded-lg border-2 border-gray-200 cursor-pointer hover:border-[#18bc7a] transition"
										onClick={() =>
											setSelectedImage(
												kycData.documentFrontImage
											)
										}
									/>
								</div>
							)}
							{kycData.documentBackImage && (
								<div className="space-y-2">
									<p className="text-sm font-medium text-gray-700">
										Document (Verso)
									</p>
									<img
										src={kycData.documentBackImage}
										alt="Document verso"
										className="w-full h-48 object-cover rounded-lg border-2 border-gray-200 cursor-pointer hover:border-[#18bc7a] transition"
										onClick={() =>
											setSelectedImage(
												kycData.documentBackImage
											)
										}
									/>
								</div>
							)}
							{kycData.selfieImage && (
								<div className="space-y-2">
									<p className="text-sm font-medium text-gray-700">
										Selfie
									</p>
									<img
										src={kycData.selfieImage}
										alt="Selfie"
										className="w-full h-48 object-cover rounded-lg border-2 border-gray-200 cursor-pointer hover:border-[#18bc7a] transition"
										onClick={() =>
											setSelectedImage(
												kycData.selfieImage
											)
										}
									/>
								</div>
							)}
							{kycData.userPortraitImage && (
								<div className="space-y-2">
									<p className="text-sm font-medium text-gray-700">
										Portrait utilisateur
									</p>
									<img
										src={kycData.userPortraitImage}
										alt="Portrait utilisateur"
										className="w-full h-48 object-cover rounded-lg border-2 border-gray-200 cursor-pointer hover:border-[#18bc7a] transition"
										onClick={() =>
											setSelectedImage(
												kycData.userPortraitImage
											)
										}
									/>
								</div>
							)}
						</div>
						{!kycData.documentFrontImage &&
							!kycData.documentBackImage &&
							!kycData.selfieImage &&
							!kycData.userPortraitImage && (
								<p className="text-gray-500 text-center py-8">
									Aucun document disponible
								</p>
							)}
					</div>
				</div>

				{/* Section Actions */}
				{kycData.status !== "COMPLETED" && (
					<div className="lg:col-span-1">
						<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-4">
								Actions
							</h3>
							<div className="space-y-3">
								<>
									<button
										onClick={() => handleAction("approve")}
										className="w-full flex items-center justify-between px-4 py-3 bg-[#18bc7a] hover:bg-[#15a669] text-white rounded-lg transition font-medium"
									>
										<span className="flex items-center gap-2">
											<CheckCircle className="w-5 h-5" />
											Approuver
										</span>
										<ChevronRight className="w-5 h-5" />
									</button>
									<button
										onClick={() => handleAction("reject")}
										className="w-full flex items-center justify-between px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-medium"
									>
										<span className="flex items-center gap-2">
											<XCircle className="w-5 h-5" />
											Rejeter
										</span>
										<ChevronRight className="w-5 h-5" />
									</button>
								</>
							</div>

							{kycData.rejectionReasonCodes &&
								kycData.rejectionReasonCodes.length > 0 && (
									<div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
										<p className="text-sm font-medium text-red-800 mb-2">
											Raisons du rejet:
										</p>
										<ul className="text-sm text-red-700 space-y-1">
											{kycData.rejectionReasonCodes.map(
												(
													reason: string,
													index: number
												) => (
													<li key={index}>
														• {reason}
													</li>
												)
											)}
										</ul>
									</div>
								)}
						</div>
					</div>
				)}
			</div>

			{/* Modal pour agrandir les images */}
			{selectedImage && (
				<div
					className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[1000] p-4"
					onClick={() => setSelectedImage(null)}
				>
					<div className="relative max-w-4xl max-h-full">
						<img
							src={selectedImage}
							alt="Document agrandi"
							className="max-w-full max-h-[90vh] object-contain rounded-lg"
						/>
						<button
							onClick={() => setSelectedImage(null)}
							className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100 transition"
						>
							<XCircle className="w-6 h-6 text-gray-700" />
						</button>
					</div>
				</div>
			)}

			{/* Modal de chargement pendant la mutation */}
			{updateKyc.isLoading && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
					<div className="bg-white rounded-lg shadow-xl p-8 flex flex-col items-center">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#18bc7a] mb-4"></div>
						<p className="text-gray-700 font-medium">
							Traitement en cours...
						</p>
					</div>
				</div>
			)}

			{/* Modal de confirmation d'approbation */}
			{showApproveModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] p-4">
					<div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
						<div className="flex items-center gap-3 mb-4">
							<div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
								<CheckCircle className="w-6 h-6 text-[#18bc7a]" />
							</div>
							<h3 className="text-xl font-bold text-gray-900">
								Approuver le KYC
							</h3>
						</div>
						<p className="text-gray-600 mb-6">
							Êtes-vous sûr de vouloir approuver le KYC de cet
							utilisateur ? Cette action validera son identité.
						</p>
						<div className="flex gap-3">
							<button
								onClick={() => setShowApproveModal(false)}
								disabled={updateKyc.isLoading}
								className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
							>
								Annuler
							</button>
							<button
								onClick={() =>
									updateKyc.mutate({
										kycId: kycData.id,
										data: { status: "COMPLETED" },
									})
								}
								disabled={updateKyc.isLoading}
								className="flex-1 px-4 py-2 bg-[#18bc7a] hover:bg-[#15a669] text-white rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
							>
								{updateKyc.isLoading ? (
									<>
										<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
										Traitement...
									</>
								) : (
									"Confirmer"
								)}
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Modal de rejet avec plusieurs raisons */}
			{showRejectModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] p-4 ">
					<div className="bg-white   rounded-lg shadow-xl max-w-2xl w-full p-6 min-h-[80vh] overflow-y-auto">
						<div className="flex items-center gap-3 mb-4">
							<div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
								<XCircle className="w-6 h-6 text-red-600" />
							</div>
							<h3 className="text-xl font-bold text-gray-900">
								Rejeter le KYC
							</h3>
						</div>
						<p className="text-gray-600 mb-6">
							Veuillez sélectionner les raisons du rejet de ce KYC
							:
						</p>

						{/* VRAIE LISTE DÉROULANTE PERSONNALISÉE AVEC RECHERCHE */}
						<div className="mb-6">
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Sélectionnez les raisons :
							</label>

							{/* Bouton qui ouvre la liste déroulante */}
							<div className="relative">
								<button
									type="button"
									onClick={() =>
										setDropdownOpen(!dropdownOpen)
									}
									className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-left flex justify-between items-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#18bc7a] focus:border-transparent"
									disabled={updateKyc.isLoading}
								>
									<span className="truncate">
										{selectedReasons.length === 0
											? "Cliquez pour sélectionner les raisons"
											: `${selectedReasons.length} raison(s) sélectionnée(s)`}
									</span>
									<ChevronDown
										className={`w-5 h-5 text-gray-500 transition-transform ${
											dropdownOpen
												? "transform rotate-180"
												: ""
										}`}
									/>
								</button>

								{/* Liste déroulante qui s'ouvre au clic */}
								{dropdownOpen && (
									<div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
										{/* Container avec hauteur fixe et scroll */}
										<div className="max-h-80 overflow-y-auto">
											<div className="p-2">
												{/* Barre de recherche */}
												<div className="sticky top-0 bg-white z-20 pb-2">
													<div className="relative">
														<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
														<input
															type="text"
															value={searchQuery}
															onChange={(e) =>
																setSearchQuery(
																	e.target
																		.value
																)
															}
															placeholder="Rechercher une raison..."
															className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#18bc7a] focus:border-transparent text-sm"
															onClick={(e) =>
																e.stopPropagation()
															}
														/>
														{searchQuery && (
															<button
																type="button"
																onClick={() =>
																	setSearchQuery(
																		""
																	)
																}
																className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
															>
																<X className="w-4 h-4" />
															</button>
														)}
													</div>

													{/* Option pour tout sélectionner */}
													<div
														className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded cursor-pointer border-b border-gray-200 mt-2"
														onClick={() => {
															const filteredKeys =
																Object.entries(
																	kycRejectReasonsEN
																)
																	.filter(
																		([
																			key,
																			value,
																		]) =>
																			value
																				.toLowerCase()
																				.includes(
																					searchQuery.toLowerCase()
																				) ||
																			key
																				.toLowerCase()
																				.includes(
																					searchQuery.toLowerCase()
																				)
																	)
																	.map(
																		([
																			key,
																		]) =>
																			key
																	);

															if (
																filteredKeys.length ===
																0
															)
																return;

															// Vérifier si tous les éléments filtrés sont déjà sélectionnés
															const allFilteredSelected =
																filteredKeys.every(
																	(key) =>
																		selectedReasons.includes(
																			key
																		)
																);

															if (
																allFilteredSelected
															) {
																// Désélectionner les éléments filtrés
																setSelectedReasons(
																	(prev) =>
																		prev.filter(
																			(
																				item
																			) =>
																				!filteredKeys.includes(
																					item
																				)
																		)
																);
															} else {
																// Sélectionner les éléments filtrés qui ne le sont pas déjà
																setSelectedReasons(
																	(prev) => {
																		const newSelection =
																			[
																				...prev,
																			];
																		filteredKeys.forEach(
																			(
																				key
																			) => {
																				if (
																					!newSelection.includes(
																						key
																					)
																				) {
																					newSelection.push(
																						key
																					);
																				}
																			}
																		);
																		return newSelection;
																	}
																);
															}
														}}
													>
														<div className="w-5 h-5 border-2 rounded flex items-center justify-center">
															{(() => {
																const filteredKeys =
																	Object.entries(
																		kycRejectReasonsEN
																	)
																		.filter(
																			([
																				key,
																				value,
																			]) =>
																				value
																					.toLowerCase()
																					.includes(
																						searchQuery.toLowerCase()
																					) ||
																				key
																					.toLowerCase()
																					.includes(
																						searchQuery.toLowerCase()
																					)
																		)
																		.map(
																			([
																				key,
																			]) =>
																				key
																		);

																if (
																	filteredKeys.length ===
																	0
																)
																	return null;

																const allFilteredSelected =
																	filteredKeys.every(
																		(key) =>
																			selectedReasons.includes(
																				key
																			)
																	);

																if (
																	allFilteredSelected
																) {
																	return (
																		<Check className="w-3 h-3 text-[#18bc7a]" />
																	);
																} else if (
																	filteredKeys.some(
																		(key) =>
																			selectedReasons.includes(
																				key
																			)
																	)
																) {
																	return (
																		<div className="w-3 h-3 bg-[#18bc7a] rounded-sm" />
																	);
																}
																return null;
															})()}
														</div>
														<span className="font-medium text-gray-700">
															{(() => {
																const filteredKeys =
																	Object.entries(
																		kycRejectReasonsEN
																	)
																		.filter(
																			([
																				key,
																				value,
																			]) =>
																				value
																					.toLowerCase()
																					.includes(
																						searchQuery.toLowerCase()
																					) ||
																				key
																					.toLowerCase()
																					.includes(
																						searchQuery.toLowerCase()
																					)
																		)
																		.map(
																			([
																				key,
																			]) =>
																				key
																		);

																if (
																	filteredKeys.length ===
																	0
																)
																	return "Aucun résultat";

																const selectedFilteredCount =
																	filteredKeys.filter(
																		(key) =>
																			selectedReasons.includes(
																				key
																			)
																	).length;

																if (
																	selectedFilteredCount ===
																	0
																)
																	return "Tout sélectionner (filtré)";
																if (
																	selectedFilteredCount ===
																	filteredKeys.length
																)
																	return "Tout désélectionner (filtré)";
																return `Sélectionner tout (${selectedFilteredCount}/${filteredKeys.length})`;
															})()}
														</span>
													</div>
												</div>

												{/* Liste des raisons filtrées */}
												<div className="mt-2">
													{(() => {
														const filteredReasons =
															Object.entries(
																kycRejectReasonsEN
															).filter(
																([
																	key,
																	value,
																]) =>
																	value
																		.toLowerCase()
																		.includes(
																			searchQuery.toLowerCase()
																		) ||
																	key
																		.toLowerCase()
																		.includes(
																			searchQuery.toLowerCase()
																		)
															);

														if (
															filteredReasons.length ===
															0
														) {
															return (
																<div className="text-center py-8 text-gray-500">
																	<Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
																	<p>
																		Aucune
																		raison
																		trouvée
																	</p>
																	<p className="text-sm mt-1">
																		{`Essayez
																		d'autres
																		mots-clés`}
																	</p>
																</div>
															);
														}

														return filteredReasons.map(
															([key, value]) => (
																<div
																	key={key}
																	className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded cursor-pointer"
																	onClick={() => {
																		if (
																			selectedReasons.includes(
																				key
																			)
																		) {
																			setSelectedReasons(
																				(
																					prev
																				) =>
																					prev.filter(
																						(
																							item
																						) =>
																							item !==
																							key
																					)
																			);
																		} else {
																			setSelectedReasons(
																				(
																					prev
																				) => [
																					...prev,
																					key,
																				]
																			);
																		}
																	}}
																>
																	<div
																		className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
																			selectedReasons.includes(
																				key
																			)
																				? "bg-[#18bc7a] border-[#18bc7a]"
																				: "border-gray-300"
																		}`}
																	>
																		{selectedReasons.includes(
																			key
																		) && (
																			<Check className="w-3 h-3 text-white" />
																		)}
																	</div>
																	<div className="flex-1">
																		<span className="text-gray-700 block">
																			{
																				value
																			}
																		</span>
																		<span className="text-xs text-gray-500 mt-0.5">
																			{
																				key
																			}
																		</span>
																	</div>
																</div>
															)
														);
													})()}
												</div>
											</div>
										</div>
									</div>
								)}
							</div>

							{/* Affichage des raisons sélectionnées */}
							{selectedReasons.length > 0 && (
								<div className="mt-3">
									<div className="flex items-center justify-between mb-2">
										<p className="text-sm font-medium text-gray-700">
											Raisons sélectionnées :
										</p>
										<button
											type="button"
											onClick={() =>
												setSelectedReasons([])
											}
											className="text-sm text-red-600 hover:text-red-800"
										>
											Tout effacer
										</button>
									</div>
									<div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 bg-gray-50 rounded-lg">
										{selectedReasons.map((key) => (
											<div
												key={key}
												className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-3 py-2 rounded-lg shadow-sm"
											>
												<span className="text-sm">
													{kycRejectReasonsEN[key]}
												</span>
												<button
													type="button"
													onClick={() =>
														setSelectedReasons(
															(prev) =>
																prev.filter(
																	(item) =>
																		item !==
																		key
																)
														)
													}
													className="text-gray-400 hover:text-red-600"
												>
													<X className="w-4 h-4" />
												</button>
											</div>
										))}
									</div>
								</div>
							)}
						</div>

						{/* Champ pour raison personnalisée supplémentaire */}
						<div className="mb-6">
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Raison supplémentaire (optionnelle) :
							</label>
							<textarea
								value={customReason}
								onChange={(e) =>
									setCustomReason(e.target.value)
								}
								placeholder="Ajoutez une raison personnalisée si nécessaire..."
								className="w-full h-24 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#18bc7a] focus:border-transparent resize-none"
								disabled={updateKyc.isLoading}
							/>
						</div>

						{/* Boutons d'action */}
						<div className="flex gap-3">
							<button
								onClick={() => {
									setShowRejectModal(false);
									setSelectedReasons([]);
									setCustomReason("");
									setDropdownOpen(false);
									setSearchQuery("");
								}}
								disabled={updateKyc.isLoading}
								className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
							>
								Annuler
							</button>
							<button
								onClick={() => {
									if (
										selectedReasons.length === 0 &&
										customReason.trim() === ""
									) {
										toast.error(
											"Veuillez sélectionner au moins une raison"
										);
										return;
									}

									// Préparer les raisons pour l'API
									const reasons = selectedReasons.map(
										(key) =>
											`${key}: ${kycRejectReasonsEN[key]}`
									);

									// Ajouter la raison personnalisée si remplie
									if (customReason.trim() !== "") {
										reasons.push(
											`CUSTOM: ${customReason.trim()}`
										);
									}

									updateKyc.mutate({
										kycId: kycData.id,
										data: {
											status: "REJECTED",
											raisonsRejectCodes: reasons,
										},
									});
								}}
								disabled={
									updateKyc.isLoading ||
									(selectedReasons.length === 0 &&
										customReason.trim() === "")
								}
								className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
							>
								{updateKyc.isLoading ? (
									<>
										<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
										Traitement...
									</>
								) : (
									"Rejeter"
								)}
							</button>
						</div>
					</div>
				</div>
			)}
		</Layout>
	);
};

export default ManageKyc;
