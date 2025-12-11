"use client";

import {
	handleActivateUser,
	handleGetUsersDetails,
	handleUpdateUser,
	hanldeDeactivateUser,
} from "@/api/handlers/user.handler";
import { UserManagementServiceV3 } from "@/api/services/v3/userManagement";
import URLConfigV3 from "@/config/urls_v3";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
	Phone,
	Mail,
	MapPin,
	Flag,
	CheckCircle,
	XCircle,
	Clock,
	User as UserIcon,
	Save,
	Edit,
	X,
	CreditCard,
	UserCheck,
	Shield,
	Activity,
	Globe,
	Key,
	CalendarDays,
	RefreshCw,
	LogIn,
	Eye,
	EyeOff,
	ToggleLeft,
	ToggleRight,
	Hash,
	Calendar,
	FileText,
	ExternalLink,
	Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

const Details = () => {
	const params = useParams();
	const router = useRouter();
	const queryClient = useQueryClient();
	const id = params.id as string;
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState<any>({});

	// Query pour récupérer les détails de l'utilisateur
	const getUserDetails = useQuery({
		queryKey: ["user-details", id],
		queryFn: handleGetUsersDetails,
		onSuccess: (data) => {
			if (data?.data) {
				setFormData(data.data);
			}
		},
	});

	// Mutation pour mettre à jour l'utilisateur
	const updateMutation = useMutation({
		mutationFn: handleUpdateUser,
		onError: (err: any) => {
			toast.error(`Erreur: ${err.message}`);
		},
		onSuccess: (data) => {
			toast.success("Utilisateur modifié avec succès !");
			setIsEditing(false);
			getUserDetails.refetch();
		},
	});

	// Mutation pour désactiver l'utilisateur
	const deactivateMutation = useMutation({
		mutationFn: hanldeDeactivateUser,
		onError: (err: any) => {
			toast.error(`Erreur: ${err.message}`);
		},
		onSuccess: (data) => {
			toast.success("Utilisateur désactivé avec succès !");
			getUserDetails.refetch();
		},
	});

	// Mutation pour réactiver l'utilisateur
	const reactivateMutation = useMutation({
		mutationFn: handleActivateUser,
		onError: (err: any) => {
			toast.error(`Erreur: ${err.message}`);
		},
		onSuccess: (data) => {
			toast.success("Utilisateur réactivé avec succès !");
			getUserDetails.refetch();
		},
	});

	const { data: userData, isLoading, isError } = getUserDetails;

	// Mutation pour activer/désactiver les transactions
	const toggleTransactionStatus = useMutation({
		mutationFn: async () => {
			const newStatus =
				formData.transactionEnableStatus === "ENABLED"
					? "DISABLED"
					: "ENABLED";
			const response = await UserManagementServiceV3.updateTransactionStatus(
				id,
				newStatus
			);
			const responseJson = await response.json();
			if (!response.ok) {
				throw new Error(
					responseJson.message ||
						"Erreur lors de la mise à jour du statut des transactions"
				);
			}
			return responseJson;
		},
		onSuccess: () => {
			toast.success(
				formData.transactionEnableStatus === "ENABLED"
					? "Transactions désactivées"
					: "Transactions activées"
			);
			queryClient.invalidateQueries(["user-details", id]);
		},
		onError: (error: any) => {
			toast.error(error.message || "Une erreur est survenue");
		},
	});

	// Navigation vers la page KYC
	const navigateToKyc = () => {
		if (formData.kycId) {
			router.push(`${URLConfigV3.kyc.manage}/${id}`);
		} else {
			toast.error("Aucune demande KYC pour cet utilisateur");
		}
	};

	const handleInputChange = (field: string, value: any) => {
		setFormData((prev: any) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleEdit = () => {
		setIsEditing(true);
	};

	// Handler pour sauvegarder les modifications
	const handleSave = () => {
		const dataToSend = {
			firstName: formData.firstName,
			lastName: formData.lastName,
			email: formData.email,
			city: formData.city,
			gender: formData.gender,
			dateOfBirth: formData.dateOfBirth,
		};
		console.log("donnees soumise", dataToSend);

		updateMutation.mutate({ id, data: dataToSend });
	};

	const handleCancel = () => {
		if (userData?.data) {
			setFormData(userData.data);
		}
		setIsEditing(false);
	};

	// Handler pour activer/désactiver le compte
	const handleToggleAccountStatus = () => {
		if (formData.isActive) {
			deactivateMutation.mutate(id);
		} else {
			reactivateMutation.mutate(id);
		}
	};

	const handleSendEmail = () => {
		if (formData.email) {
			window.open(`mailto:${formData.email}`, "_blank");
			toast.success("Ouverture de l'application email");
		} else {
			toast.error("Email non disponible");
		}
	};

	const handleCallUser = () => {
		if (formData.phoneNumber) {
			window.open(`tel:${formData.phoneNumber}`, "_blank");
			toast.success("Ouverture de l'application téléphone");
		} else {
			toast.error("Numéro de téléphone non disponible");
		}
	};

	const getStatusBadge = (status: string) => {
		const statusConfig = {
			COMPLETED: {
				icon: CheckCircle,
				bg: "bg-green-50",
				text: "text-green-700",
				border: "border-green-200",
				label: "Completé",
			},
			PENDING: {
				icon: Clock,
				bg: "bg-yellow-50",
				text: "text-yellow-700",
				border: "border-yellow-200",
				label: "En attente",
			},
			REJECTED: {
				icon: XCircle,
				bg: "bg-red-50",
				text: "text-red-700",
				border: "border-red-200",
				label: "Rejeté",
			},
		};

		const config =
			statusConfig[status as keyof typeof statusConfig] ||
			statusConfig.PENDING;
		const Icon = config.icon;

		return (
			<span
				className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bg} ${config.text} ${config.border} border text-sm font-medium`}
			>
				<Icon className="w-4 h-4" />
				{config.label}
			</span>
		);
	};

	const getTransactionStatusBadge = (status: string) => {
		const statusConfig = {
			ENABLED: {
				bg: "bg-green-50",
				text: "text-green-700",
				border: "border-green-200",
				label: "Activé",
				icon: ToggleRight,
			},
			DISABLED: {
				bg: "bg-red-50",
				text: "text-red-700",
				border: "border-red-200",
				label: "Désactivé",
				icon: ToggleLeft,
			},
		};

		const config =
			statusConfig[status as keyof typeof statusConfig] ||
			statusConfig.DISABLED;
		const Icon = config.icon;

		return (
			<span
				className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bg} ${config.text} ${config.border} border text-sm font-medium`}
			>
				<Icon className="w-4 h-4" />
				{config.label}
			</span>
		);
	};

	// Fonction pour obtenir le badge de genre
	const getGenderBadge = (gender: string | undefined) => {
		if (!gender) {
			return (
				<span className="inline-flex px-3 py-1.5 rounded-full text-sm font-medium bg-gray-50 text-gray-700 border border-gray-200">
					Non spécifié
				</span>
			);
		}

		const genderConfig = {
			M: {
				bg: "bg-blue-50",
				text: "text-blue-700",
				border: "border-blue-200",
				label: "Masculin",
			},
			F: {
				bg: "bg-pink-50",
				text: "text-pink-700",
				border: "border-pink-200",
				label: "Féminin",
			},
		};

		const config =
			genderConfig[gender as keyof typeof genderConfig] ||
			genderConfig.M;

		return (
			<span
				className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bg} ${config.text} ${config.border} border text-sm font-medium`}
			>
				{config.label}
			</span>
		);
	};

	// Fonction pour formater la date de naissance
	const formatBirthDate = (dateString: string | undefined) => {
		if (!dateString) return "Non renseigné";

		try {
			const date = new Date(dateString);
			return date.toLocaleDateString("fr-FR", {
				year: "numeric",
				month: "long",
				day: "numeric",
			});
		} catch (error) {
			return dateString;
		}
	};

	// Calculer l'âge à partir de la date de naissance
	const calculateAge = (dateString: string | undefined) => {
		if (!dateString) return null;

		try {
			const birthDate = new Date(dateString);
			const today = new Date();
			let age = today.getFullYear() - birthDate.getFullYear();
			const monthDiff = today.getMonth() - birthDate.getMonth();

			if (
				monthDiff < 0 ||
				(monthDiff === 0 && today.getDate() < birthDate.getDate())
			) {
				age--;
			}

			return age;
		} catch (error) {
			return null;
		}
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#18bc7a]"></div>
			</div>
		);
	}

	if (isError || !userData?.data) {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="text-center">
					<p className="text-gray-600">
						{`Impossible de charger les données de l'utilisateur`}
					</p>
					<Button
						onClick={() => getUserDetails.refetch()}
						className="mt-4"
						variant="outline"
					>
						<RefreshCw className="w-4 h-4 mr-2" />
						Réessayer
					</Button>
				</div>
			</div>
		);
	}

	const age = calculateAge(formData.dateOfBirth);

	return (
		<div className="min-h-screen bg-gray-50 p-4">
			{/* Header avec boutons d'action */}
			<div className="mb-6 flex justify-between items-center">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">
						{`Détails de l'utilisateur`}
					</h1>
					<p className="text-gray-600 mt-1">
						{`Code utilisateur: ${
							formData.userReferenceCode || "N/A"
						}`}
					</p>
				</div>

				<div className="flex gap-3">
					{!isEditing ? (
						<>
							<Button
								onClick={handleEdit}
								className="flex items-center gap-2 bg-[#18bc7a] hover:bg-[#15a669]"
								disabled={getUserDetails.isRefetching}
							>
								<Edit className="w-4 h-4" />
								Modifier
							</Button>
							<Button
								onClick={handleToggleAccountStatus}
								variant="outline"
								className={`flex items-center gap-2 ${
									formData.isActive
										? "border-red-300 text-red-600 hover:bg-red-50"
										: "border-green-300 text-green-600 hover:bg-green-50"
								}`}
								disabled={
									deactivateMutation.isLoading ||
									reactivateMutation.isLoading ||
									getUserDetails.isRefetching
								}
							>
								{deactivateMutation.isLoading ||
								reactivateMutation.isLoading ? (
									<>
										<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
										{formData.isActive
											? "Désactivation..."
											: "Activation..."}
									</>
								) : formData.isActive ? (
									<>
										<EyeOff className="w-4 h-4" />
										Désactiver le compte
									</>
								) : (
									<>
										<Eye className="w-4 h-4" />
										Activer le compte
									</>
								)}
							</Button>
						</>
					) : (
						<>
							<Button
								onClick={handleSave}
								className="flex items-center gap-2 bg-[#18bc7a] hover:bg-[#15a669]"
								disabled={updateMutation.isLoading}
							>
								{updateMutation.isLoading ? (
									<>
										<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
										Sauvegarde...
									</>
								) : (
									<>
										<Save className="w-4 h-4" />
										Sauvegarder
									</>
								)}
							</Button>
							<Button
								onClick={handleCancel}
								variant="outline"
								className="flex items-center gap-2"
								disabled={updateMutation.isLoading}
							>
								<X className="w-4 h-4" />
								Annuler
							</Button>
						</>
					)}
				</div>
			</div>

			<div className="flex flex-col lg:flex-row gap-6">
				{/* Colonne gauche - Informations détaillées */}
				<div className="lg:w-2/3 space-y-6">
					{/* Section Informations personnelles */}
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
						<div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
							<h2 className="text-lg font-semibold text-gray-900">
								{`Informations personnelles`}
							</h2>
							{isEditing && (
								<span className="text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
									Mode édition activé
								</span>
							)}
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
									<UserIcon className="w-4 h-4 text-[#18bc7a]" />
									{`Prénom`}
								</label>
								{isEditing ? (
									<Input
										value={formData.firstName || ""}
										onChange={(e) =>
											handleInputChange(
												"firstName",
												e.target.value
											)
										}
										className="w-full"
										placeholder="Entrez le prénom"
										disabled={updateMutation.isLoading}
									/>
								) : (
									<div className="text-base font-medium text-gray-900 bg-gray-50 p-3 rounded border border-gray-200">
										{formData.firstName || "Non renseigné"}
									</div>
								)}
							</div>
							<div>
								<label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
									<UserIcon className="w-4 h-4 text-[#18bc7a]" />
									{`Nom`}
								</label>
								{isEditing ? (
									<Input
										value={formData.lastName || ""}
										onChange={(e) =>
											handleInputChange(
												"lastName",
												e.target.value
											)
										}
										className="w-full"
										placeholder="Entrez le nom"
										disabled={updateMutation.isLoading}
									/>
								) : (
									<div className="text-base font-medium text-gray-900 bg-gray-50 p-3 rounded border border-gray-200">
										{formData.lastName || "Non renseigné"}
									</div>
								)}
							</div>
							<div>
								<label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
									<Calendar className="w-4 h-4 text-[#18bc7a]" />
									{`Date de naissance`}
								</label>
								{isEditing ? (
									<Input
										value={formData.dateOfBirth || ""}
										onChange={(e) =>
											handleInputChange(
												"dateOfBirth",
												e.target.value
											)
										}
										className="w-full"
										type="date"
										placeholder="JJ/MM/AAAA"
										disabled={updateMutation.isLoading}
									/>
								) : (
									<div className="space-y-1">
										<div className="text-base font-medium text-gray-900 bg-gray-50 p-3 rounded border border-gray-200">
											{formatBirthDate(formData.dateOfBirth)}
										</div>
										{age !== null && (
											<p className="text-sm text-gray-500">
												{`(${age} ans)`}
											</p>
										)}
									</div>
								)}
							</div>
							<div>
								<label className="text-sm font-medium text-gray-700 mb-2">
									{`Genre`}
								</label>
								{isEditing ? (
									<select
										value={formData.gender || ""}
										onChange={(e) =>
											handleInputChange(
												"gender",
												e.target.value
											)
										}
										className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#18bc7a] focus:border-transparent"
										disabled={updateMutation.isLoading}
									>
										<option value="">Sélectionnez un genre</option>
										<option value="M">Masculin</option>
										<option value="F">Féminin</option>
									</select>
								) : (
									<div className="mt-1">
										{getGenderBadge(formData.gender)}
									</div>
								)}
							</div>
						</div>
					</div>

					{/* Section Contact */}
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
						<h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
							{`Informations de contact`}
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
									<Phone className="w-4 h-4 text-[#18bc7a]" />
									{`Téléphone`}
								</label>
								{isEditing ? (
									<Input
										value={formData.phoneNumber || ""}
										onChange={(e) =>
											handleInputChange(
												"phoneNumber",
												e.target.value
											)
										}
										className="w-full"
										placeholder="Entrez le numéro de téléphone"
										disabled={updateMutation.isLoading}
									/>
								) : (
									<div className="text-base font-medium text-gray-900 bg-gray-50 p-3 rounded border border-gray-200">
										{formData.phoneNumber ||
											"Non renseigné"}
									</div>
								)}
							</div>
							<div>
								<label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
									<Mail className="w-4 h-4 text-[#18bc7a]" />
									{`Email`}
								</label>
								{isEditing ? (
									<Input
										value={formData.email || ""}
										onChange={(e) =>
											handleInputChange(
												"email",
												e.target.value
											)
										}
										className="w-full"
										type="email"
										placeholder="Entrez l'email"
										disabled={updateMutation.isLoading}
									/>
								) : (
									<div className="text-base font-medium text-gray-900 bg-gray-50 p-3 rounded border border-gray-200">
										{formData.email || "Non renseigné"}
									</div>
								)}
							</div>
						</div>
					</div>

					{/* Section Localisation */}
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
						<h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
							{`Localisation`}
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
									<Flag className="w-4 h-4 text-[#18bc7a]" />
									{`Pays`}
								</label>
								<div className="text-base font-medium text-gray-900 bg-gray-50 p-3 rounded border border-gray-200">
									{formData.countryName || "Non renseigné"}
								</div>
							</div>
							<div>
								<label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
									<MapPin className="w-4 h-4 text-[#18bc7a]" />
									{`Ville`}
								</label>
								{isEditing ? (
									<Input
										value={formData.city || ""}
										onChange={(e) =>
											handleInputChange(
												"city",
												e.target.value
											)
										}
										className="w-full"
										placeholder="Entrez la ville"
										disabled={updateMutation.isLoading}
									/>
								) : (
									<div className="text-base font-medium text-gray-900 bg-gray-50 p-3 rounded border border-gray-200">
										{formData.city || "Non renseigné"}
									</div>
								)}
							</div>
						</div>
					</div>
				</div>

				{/* Colonne droite - Informations importantes */}
				<div className="lg:w-1/3 space-y-6">
					{/* Carte d'information rapide */}
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
						<h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
							<Activity className="w-5 h-5 text-[#18bc7a]" />
							{`Statut du compte`}
						</h2>
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
										<CalendarDays className="w-5 h-5 text-blue-600" />
									</div>
									<div>
										<p className="text-sm font-medium text-gray-700">
											Date de création
										</p>
										<p className="text-sm text-gray-500">
											{formData.createdAt
												? new Date(
														formData.createdAt
												  ).toLocaleDateString("fr-FR")
												: "Non disponible"}
										</p>
									</div>
								</div>
							</div>

							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
										<UserCheck className="w-5 h-5 text-green-600" />
									</div>
									<div>
										<p className="text-sm font-medium text-gray-700">
											Statut KYC
										</p>
										<div className="mt-1">
											{getStatusBadge(formData.kycStatus)}
										</div>
									</div>
								</div>
							</div>

							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
										<CreditCard className="w-5 h-5 text-purple-600" />
									</div>
									<div>
										<p className="text-sm font-medium text-gray-700">
											Transactions
										</p>
										<div className="mt-1">
											{getTransactionStatusBadge(
												formData.transactionEnableStatus
											)}
										</div>
									</div>
								</div>
							</div>

							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
										<Shield className="w-5 h-5 text-amber-600" />
									</div>
									<div>
										<p className="text-sm font-medium text-gray-700">
											Statut compte
										</p>
										<div className="mt-1">
											<span
												className={`inline-flex px-3 py-1.5 rounded-full text-sm font-medium ${
													formData.isActive
														? "bg-green-50 text-green-700 border border-green-200"
														: "bg-red-50 text-red-700 border border-red-200"
												}`}
											>
												{formData.isActive
													? "Actif"
													: "Inactif"}
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Informations système */}
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
						<h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
							<Globe className="w-5 h-5 text-[#18bc7a]" />
							{`Informations système`}
						</h2>
						<div className="space-y-4">
							<div className="space-y-2">
								<label className="text-sm font-medium text-gray-700 flex items-center gap-2">
									<Key className="w-4 h-4 text-gray-400" />
									{`Code utilisateur`}
								</label>
								<div className="text-sm font-mono font-medium text-gray-900 bg-gray-50 p-3 rounded border border-gray-200">
									{formData.userReferenceCode ||
										"Non renseigné"}
								</div>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-medium text-gray-700 flex items-center gap-2">
									<UserCheck className="w-4 h-4 text-gray-400" />
									{`Rôle`}
								</label>
								<div className="text-sm font-medium text-gray-900 bg-gray-50 p-3 rounded border border-gray-200">
									{formData.roles?.join(", ") || "CUSTOMER"}
								</div>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-medium text-gray-700 flex items-center gap-2">
									<Calendar className="w-4 h-4 text-gray-400" />
									{`Date de naissance`}
								</label>
								<div className="text-sm font-medium text-gray-900 bg-gray-50 p-3 rounded border border-gray-200">
									{formatBirthDate(formData.dateOfBirth)}
									{age !== null && (
										<span className="text-gray-500 ml-2">
											({age} ans)
										</span>
									)}
								</div>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-medium text-gray-700">
									{`Genre`}
								</label>
								<div className="mt-1">
									{getGenderBadge(formData.gender)}
								</div>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-medium text-gray-700 flex items-center gap-2">
									<RefreshCw className="w-4 h-4 text-gray-400" />
									{`Dernière mise à jour`}
								</label>
								<div className="text-sm font-medium text-gray-900 bg-gray-50 p-3 rounded border border-gray-200">
									{formData.updatedAt
										? new Date(
												formData.updatedAt
										  ).toLocaleDateString("fr-FR", {
												year: "numeric",
												month: "short",
												day: "numeric",
												hour: "2-digit",
												minute: "2-digit",
										  })
										: "Non renseigné"}
								</div>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-medium text-gray-700 flex items-center gap-2">
									<LogIn className="w-4 h-4 text-gray-400" />
									{`Première connexion`}
								</label>
								<div className="text-sm font-medium text-gray-900 bg-gray-50 p-3 rounded border border-gray-200">
									{formData.firstLoginAt
										? new Date(
												formData.firstLoginAt
										  ).toLocaleDateString("fr-FR", {
												year: "numeric",
												month: "short",
												day: "numeric",
										  })
										: "Jamais connecté"}
								</div>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-medium text-gray-700 flex items-center gap-2">
									<Hash className="w-4 h-4 text-gray-400" />
									{`Code de parrainage`}
								</label>
								<div className="text-sm font-mono font-medium text-gray-900 bg-gray-50 p-3 rounded border border-gray-200">
									{formData.referralCode || "Aucun"}
								</div>
							</div>
						</div>
					</div>

						{/* Actions rapides */}
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
						<h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
							{`Actions rapides`}
						</h2>
						<div className="space-y-3">
							{/* Bouton Activer/Désactiver les transactions */}
							<button
								onClick={() => toggleTransactionStatus.mutate()}
								disabled={toggleTransactionStatus.isLoading}
								className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition disabled:opacity-50 ${
									formData.transactionEnableStatus === "ENABLED"
										? "border border-orange-300 text-orange-700 hover:bg-orange-50"
										: "border border-blue-300 text-blue-700 hover:bg-blue-50"
								}`}
							>
								{toggleTransactionStatus.isLoading ? (
									<Loader2 className="w-4 h-4 animate-spin" />
								) : formData.transactionEnableStatus === "ENABLED" ? (
									<>
										<ToggleLeft className="w-4 h-4" />
										{`Désactiver les transactions`}
									</>
								) : (
									<>
										<ToggleRight className="w-4 h-4" />
										{`Activer les transactions`}
									</>
								)}
							</button>

							{/* Bouton Voir la demande KYC */}
							{formData.kycStatus &&
								formData.kycStatus !== "PENDING" && (
									<button
										onClick={navigateToKyc}
										className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#18bc7a] text-white rounded-lg hover:bg-[#15a669] transition"
									>
										<FileText className="w-4 h-4" />
										{`Voir la demande KYC`}
										<ExternalLink className="w-3 h-3" />
									</button>
								)}

							{/* Afficher le KYC ID si disponible */}
							{formData.kycId && (
								<div className="text-xs text-gray-500 text-center mt-2">
									KYC ID: {formData.kycId.substring(0, 8)}...
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Details;