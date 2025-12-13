"use client";

import { useState, useEffect } from "react";
import {
	MapPin,
	Calendar,
	Shield,
	DollarSign,
	Info,
	ChevronLeft,
	Snowflake,
	Play,
	Trash2,
	ArrowRightLeft,
	X,
	Hash,
	FileText,
	User,
	Globe,
	CheckCircle,
	XCircle,
	Clock,
	RefreshCcw,
	CreditCard,
} from "lucide-react";
import { useMutation, useQuery } from "react-query";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
	handleFreezeCard,
	handleGetCardDetail,
	handleGetCardTransactions,
	handleterminateCard,
	handleUnFreezeCard,
} from "@/api/handlers/cards.handler";
import CButton from "@/components/shared/CButton";
import Layout from "@/components/shared/Layout";
import Modal from "@/components/shared/Modal/Modal";
import CustomTable from "@/components/shared/CustomTable";
import { transactionsHeaderData } from "@/constants/v3/cardsDataV3";
import LabelWithBadge from "@/components/shared/LabelWithBadge";

// Composant pour afficher les détails de la transaction
const TransactionDetailsContent: React.FC<{ transaction: any }> = ({
	transaction,
}) => {
	const getStatusBadge = (status: string) => {
		const statusConfig = {
			SUCCESS: {
				icon: CheckCircle,
				bg: "bg-green-100",
				text: "text-green-800",
				border: "border-green-200",
				label: "Réussi",
			},
			FAILED: {
				icon: XCircle,
				bg: "bg-red-100",
				text: "text-red-800",
				border: "border-red-200",
				label: "Échoué",
			},
			PENDING: {
				icon: Clock,
				bg: "bg-yellow-100",
				text: "text-yellow-800",
				border: "border-yellow-200",
				label: "En cours",
			},
			PROCESSING: {
				icon: RefreshCcw,
				bg: "bg-blue-100",
				text: "text-blue-800",
				border: "border-blue-200",
				label: "Traitement",
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

	const getTypeLabel = (type: string) => {
		const typeLabels: Record<string, string> = {
			PAYMENT: "Paiement",
			INITIAL_LOAD: "Chargement initial",
			PURCHASE: "Achat",
			REFUND: "Remboursement",
			TRANSFER: "Transfert",
			WITHDRAWAL: "Retrait",
		};
		return typeLabels[type] || type;
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("fr-FR", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
		});
	};

	return (
		<div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4">
			{/* En-tête du modal */}
			<div className="flex items-center justify-between p-6 border-b border-gray-200">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
						<CreditCard className="w-5 h-5 text-blue-600" />
					</div>
					<div>
						<h2 className="text-xl font-bold text-gray-900">
							Détails de la transaction
						</h2>
						<p className="text-sm text-gray-500">
							Référence : {transaction.reference}
						</p>
					</div>
				</div>
			</div>

			{/* Contenu du modal */}
			<div className="p-6 max-h-[70vh] overflow-y-auto">
				{/* Section principale */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
					{/* Informations de base */}
					<div className="space-y-4">
						<div>
							<h3 className="text-sm font-medium text-gray-500 mb-2">
								Statut
							</h3>
							{getStatusBadge(transaction.status)}
						</div>

						<div>
							<h3 className="text-sm font-medium text-gray-500 mb-2">
								Type
							</h3>
							<p className="text-lg font-semibold text-gray-900">
								{getTypeLabel(transaction.type)}
							</p>
						</div>

						<div>
							<h3 className="text-sm font-medium text-gray-500 mb-2">
								Montant
							</h3>
							<div className="flex items-center gap-2">
								<DollarSign className="w-5 h-5 text-gray-400" />
								<p className="text-2xl font-bold text-gray-900">
									{transaction.amount} {transaction.currency}
								</p>
							</div>
							{transaction.amountUSD !== undefined && (
								<p className="text-sm text-gray-500 mt-1">
									≈ {transaction.amountUSD} USD
								</p>
							)}
						</div>
					</div>

					{/* Dates */}
					<div className="space-y-4">
						<div>
							<h3 className="text-sm font-medium text-gray-500 mb-2">
								Date de création
							</h3>
							<div className="flex items-center gap-2">
								<Calendar className="w-4 h-4 text-gray-400" />
								<p className="text-gray-900">
									{formatDate(transaction.createdAt)}
								</p>
							</div>
						</div>

						{transaction.completedAt && (
							<div>
								<h3 className="text-sm font-medium text-gray-500 mb-2">
									Date de complétion
								</h3>
								<div className="flex items-center gap-2">
									<Calendar className="w-4 h-4 text-gray-400" />
									<p className="text-gray-900">
										{formatDate(transaction.completedAt)}
									</p>
								</div>
							</div>
						)}

						<div>
							<h3 className="text-sm font-medium text-gray-500 mb-2">
								Cross-border
							</h3>
							<div className="flex items-center gap-2">
								<Globe className="w-4 h-4 text-gray-400" />
								<p className="text-gray-900">
									{transaction.isCrossborder ? "Oui" : "Non"}
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Identifiants */}
				<div className="mb-8">
					<h3 className="text-sm font-medium text-gray-500 mb-3">
						Identifiants
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="p-3 bg-gray-50 rounded-lg">
							<p className="text-xs text-gray-500 mb-1">
								ID Transaction
							</p>
							<p className="text-sm font-medium text-gray-900 break-all">
								{transaction.id}
							</p>
						</div>
						<div className="p-3 bg-gray-50 rounded-lg">
							<p className="text-xs text-gray-500 mb-1">
								Référence externe
							</p>
							<p className="text-sm font-medium text-gray-900 break-all">
								{transaction.externalReference || "N/A"}
							</p>
						</div>
						<div className="p-3 bg-gray-50 rounded-lg">
							<p className="text-xs text-gray-500 mb-1">
								ID Carte
							</p>
							<p className="text-sm font-medium text-gray-900 break-all">
								{transaction.cardId}
							</p>
						</div>
						<div className="p-3 bg-gray-50 rounded-lg">
							<p className="text-xs text-gray-500 mb-1">
								ID Utilisateur
							</p>
							<p className="text-sm font-medium text-gray-900 break-all">
								{transaction.userId}
							</p>
						</div>
					</div>
				</div>

				{/* Solde carte */}
				<div className="mb-8">
					<h3 className="text-sm font-medium text-gray-500 mb-3">
						Solde de la carte
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="p-4 bg-blue-50 rounded-lg">
							<p className="text-xs text-blue-600 mb-1">
								Avant transaction
							</p>
							<p className="text-lg font-bold text-gray-900">
								{transaction.cardBalanceBefore}{" "}
								{transaction.currency}
							</p>
						</div>
						<div className="p-4 bg-green-50 rounded-lg">
							<p className="text-xs text-green-600 mb-1">
								Après transaction
							</p>
							<p className="text-lg font-bold text-gray-900">
								{transaction.cardBalanceAfter}{" "}
								{transaction.currency}
							</p>
						</div>
						<div className="p-4 bg-purple-50 rounded-lg">
							<p className="text-xs text-purple-600 mb-1">
								Différence
							</p>
							<p className="text-lg font-bold text-gray-900">
								{(
									transaction.cardBalanceBefore -
									transaction.cardBalanceAfter
								).toFixed(2)}{" "}
								{transaction.currency}
							</p>
						</div>
					</div>
				</div>

				{/* Frais */}
				{transaction.fees && (
					<div className="mb-8">
						<h3 className="text-sm font-medium text-gray-500 mb-3">
							Frais
						</h3>
						<div className="bg-gray-50 rounded-lg p-4">
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
								<div>
									<p className="text-xs text-gray-500 mb-1">
										Total des frais
									</p>
									<p className="font-medium text-gray-900">
										{transaction.fees.totalFees}{" "}
										{transaction.currency}
									</p>
								</div>
								<div>
									<p className="text-xs text-gray-500 mb-1">
										Frais d'échec
									</p>
									<p className="font-medium text-gray-900">
										{transaction.fees.failureFee}{" "}
										{transaction.currency}
									</p>
								</div>
								<div>
									<p className="text-xs text-gray-500 mb-1">
										Frais de succès
									</p>
									<p className="font-medium text-gray-900">
										{transaction.fees.successFee}{" "}
										{transaction.currency}
									</p>
								</div>
								<div>
									<p className="text-xs text-gray-500 mb-1">
										Frais cross-border
									</p>
									<p className="font-medium text-gray-900">
										{transaction.fees.crossborderFee}{" "}
										{transaction.currency}
									</p>
								</div>
							</div>
							{transaction.fees.feesPaidFrom && (
								<div className="mt-3 pt-3 border-t border-gray-200">
									<p className="text-xs text-gray-500 mb-1">
										Frais payés depuis
									</p>
									<p className="font-medium text-gray-900 capitalize">
										{transaction.fees.feesPaidFrom}
									</p>
								</div>
							)}
						</div>
					</div>
				)}

				{/* Métadonnées */}
				{transaction.metadata && (
					<div>
						<h3 className="text-sm font-medium text-gray-500 mb-3">
							Métadonnées
						</h3>
						<div className="bg-gray-50 rounded-lg p-4">
							<pre className="text-sm text-gray-800 whitespace-pre-wrap break-words">
								{JSON.stringify(transaction.metadata, null, 2)}
							</pre>
						</div>
					</div>
				)}
			</div>

			{/* Pied du modal */}
			<div className="p-6 border-t border-gray-200 flex justify-end">
				<button
					onClick={() => {
						const event = new CustomEvent("closeTransactionModal");
						window.dispatchEvent(event);
					}}
					className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition"
				>
					Fermer
				</button>
			</div>
		</div>
	);
};

const CardDetailsPage = () => {
	const params = useParams();
	const router = useRouter();
	const id = params.id;
	const [isProcessing, setIsProcessing] = useState(false);
	const [modalOpen, setModalOpen] = useState(false);
	const [pendingAction, setPendingAction] = useState<
		"freeze" | "unfreeze" | "terminate" | null
	>(null);
	const [filterContent, setFilterContent] = useState();

	// États pour le modal de transaction
	const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
	const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

	const getCardDetails = useQuery({
		queryKey: ["card-details", id],
		queryFn: handleGetCardDetail,
		onError: (err: any) => {
			toast.error(err.message);
		},
	});

	const getCardTransaction = useQuery({
		queryKey: ["card-transaction", id, filterContent],
		queryFn: handleGetCardTransactions,
		onError: (err: any) => {
			toast.error(err.message);
		},
	});

	const freezeMutation = useMutation({
		mutationFn: (cardId: string) => handleFreezeCard(cardId),
		onError: (err: any) => {
			toast.error(err.message);
			setIsProcessing(false);
		},
		onSuccess: () => {
			toast.success("Card freeze successfully");
			setIsProcessing(false);
			setModalOpen(false);
			getCardDetails.refetch();
		},
	});

	const unfreezeMutation = useMutation({
		mutationFn: (cardId: string) => handleUnFreezeCard(cardId),
		onError: (err: any) => {
			toast.error(err.message);
			setIsProcessing(false);
		},
		onSuccess: () => {
			toast.success("Card unfroozed successfully");
			setIsProcessing(false);
			setModalOpen(false);
			getCardDetails.refetch();
		},
	});

	const terminateMutation = useMutation({
		mutationFn: (cardId: string) => handleterminateCard(cardId),
		onError: (err: any) => {
			toast.error(err.message);
			setIsProcessing(false);
		},
		onSuccess: () => {
			toast.success("Card terminated successfully");
			setIsProcessing(false);
			setModalOpen(false);
			getCardDetails.refetch();
		},
	});

	// Fonctions pour ouvrir les modales de carte
	const handleOpenFreezeModal = () => {
		setPendingAction("freeze");
		setModalOpen(true);
	};

	const handleOpenUnfreezeModal = () => {
		setPendingAction("unfreeze");
		setModalOpen(true);
	};

	const handleOpenTerminateModal = () => {
		setPendingAction("terminate");
		setModalOpen(true);
	};

	// Fonction pour ouvrir le modal de transaction
	const handleViewTransactionDetails = (transaction: any) => {
		setSelectedTransaction(transaction);
		setIsTransactionModalOpen(true);
	};

	// Fonction pour fermer le modal de transaction
	const handleCloseTransactionModal = () => {
		setIsTransactionModalOpen(false);
		setSelectedTransaction(null);
	};

	// Écouter l'événement de fermeture du modal de transaction
	useEffect(() => {
		const handleCloseTransactionModalEvent = () => {
			handleCloseTransactionModal();
		};

		window.addEventListener(
			"closeTransactionModal",
			handleCloseTransactionModalEvent
		);

		return () => {
			window.removeEventListener(
				"closeTransactionModal",
				handleCloseTransactionModalEvent
			);
		};
	}, []);

	// Fonction pour confirmer l'action de carte
	const handleConfirmAction = () => {
		if (!pendingAction || !id) return;

		setIsProcessing(true);

		switch (pendingAction) {
			case "freeze":
				freezeMutation.mutate(id as string);
				break;
			case "unfreeze":
				unfreezeMutation.mutate(id as string);
				break;
			case "terminate":
				terminateMutation.mutate(id as string);
				break;
		}
	};

	// Fonction pour fermer la modale de carte
	const handleCloseModal = () => {
		if (!isProcessing) {
			setModalOpen(false);
			setPendingAction(null);
		}
	};

	const formatExpiry = (month: number, year: number): string => {
		if (!month || !year) return "**/**";
		return `${String(month).padStart(2, "0")}/${String(year).slice(-2)}`;
	};

	const formatDate = (dateString: string): string => {
		return new Date(dateString).toLocaleDateString("fr-FR", {
			day: "2-digit",
			month: "long",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	if (getCardDetails.isLoading) {
		return (
			<Layout title="Détails de la Carte">
				<div className="min-h-screen bg-white p-6">
					<div className="max-w-6xl mx-auto">
						<div className="animate-pulse space-y-6">
							<div className="h-8 bg-slate-200 rounded w-48"></div>
							<div className="h-56 bg-slate-200 rounded-2xl max-w-md mx-auto"></div>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{[1, 2, 3, 4].map((i) => (
									<div
										key={i}
										className="h-48 bg-slate-200 rounded-xl"
									></div>
								))}
							</div>
						</div>
					</div>
				</div>
			</Layout>
		);
	}

	if (getCardDetails.isError) {
		return (
			<Layout title="Détails de la Carte">
				<div className="min-h-screen bg-white p-6 flex items-center justify-center">
					<div className="text-center">
						<div className="text-red-500 text-xl mb-2">⚠️</div>
						<p className="text-slate-600">
							{
								"	Erreur lors du chargement des détails de la carte"
							}
						</p>
					</div>
				</div>
			</Layout>
		);
	}

	const cardData = getCardDetails.data?.data;

	if (!cardData) {
		return null;
	}

	// Logique pour afficher les boutons selon le statut
	const showFreezeButton =
		cardData.status === "ACTIVE" || cardData.status === "PENDING";
	const showUnfreezeButton = cardData.status === "FROZEN";
	const showTerminateButton = cardData.status !== "TERMINATED";

	const getStatusColor = (status: string): string => {
		switch (status) {
			case "ACTIVE":
				return "bg-green-400 bg-opacity-30 text-green-100";
			case "FROZEN":
				return "bg-blue-400 bg-opacity-30 text-blue-100";
			case "TERMINATED":
				return "bg-red-400 bg-opacity-30 text-red-100";
			case "PENDING":
				return "bg-yellow-400 bg-opacity-30 text-yellow-100";
			case "FAILED":
				return "bg-gray-400 bg-opacity-30 text-gray-100";
			default:
				return "bg-gray-400 bg-opacity-30 text-gray-100";
		}
	};

	// Contenu de la modale de carte
	const getModalContent = () => {
		if (!pendingAction) return null;

		const getActionConfig = () => {
			switch (pendingAction) {
				case "freeze":
					return {
						title: "Geler la carte",
						description:
							"Vous êtes sur le point de geler cette carte. Une fois gelée, la carte ne pourra plus être utilisée pour effectuer des transactions.",
						confirmText: "Geler la carte",
						confirmColor: "bg-blue-600 hover:bg-blue-700",
					};
				case "unfreeze":
					return {
						title: "Dégeler la carte",
						description:
							"Vous êtes sur le point de dégeler cette carte. Une fois dégelée, la carte pourra à nouveau être utilisée normalement.",
						confirmText: "Dégeler la carte",
						confirmColor: "bg-green-600 hover:bg-green-700",
					};
				case "terminate":
					return {
						title: "Terminer la carte",
						description:
							"Vous êtes sur le point de terminer définitivement cette carte. Cette action est irréversible et la carte ne pourra plus jamais être utilisée.",
						confirmText: "Terminer la carte",
						confirmColor: "bg-red-600 hover:bg-red-700",
					};
			}
		};

		const config = getActionConfig();

		return (
			<div className="bg-white rounded-lg shadow-xl max-w-md w-full">
				<div className="p-6">
					<h3 className="text-lg font-semibold text-gray-900 mb-2">
						{config.title}
					</h3>
					<p className="text-gray-600 mb-4">{config.description}</p>

					<div className="bg-gray-50 p-4 rounded-lg mb-4">
						<p className="text-sm font-medium text-gray-900">
							Carte: {cardData.maskedNumber}
						</p>
						<p className="text-sm text-gray-600 mt-1">
							Titulaire: {cardData.nameOnCard}
						</p>
					</div>

					{pendingAction === "terminate" && (
						<div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
							<p className="text-sm text-red-700">
								<strong>Attention:</strong> Cette action est
								définitive et ne peut pas être annulée.
							</p>
						</div>
					)}

					<div className="flex justify-end gap-3">
						<button
							onClick={handleCloseModal}
							disabled={isProcessing}
							className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
						>
							Annuler
						</button>
						<button
							onClick={handleConfirmAction}
							disabled={isProcessing}
							className={`px-4 py-2 text-sm font-medium text-white rounded-lg ${config.confirmColor} disabled:opacity-50`}
						>
							{isProcessing
								? "Traitement..."
								: config.confirmText}
						</button>
					</div>
				</div>
			</div>
		);
	};

	const getTransactionStatusBadge = (status: string) => {
		switch (status) {
			case "SUCCESS":
				return <LabelWithBadge label="Succès" badgeColor="#18BC7A" />;
			case "PENDING":
				return (
					<LabelWithBadge label="En Attente" badgeColor="#f39c12" />
				);
			case "FAILED":
				return <LabelWithBadge label="Échoué" badgeColor="#F85D4B" />;
			case "CANCELLED":
				return <LabelWithBadge label="Annulé" badgeColor="#95a5a6" />;
			default:
				return <LabelWithBadge label={status} badgeColor="#000" />;
		}
	};

	const transactionTableData =
		getCardTransaction.data?.data?.data?.map(
			(transaction: any, index: number) => {
				return {
					serial: (index + 1).toString(),
					reference: transaction.reference || "N/A",
					type: transaction.type,
					formattedAmount: `${transaction.amount} ${transaction.currency}`,
					status: getTransactionStatusBadge(transaction.status),
					cardBalanceAfter: transaction.cardBalanceAfter.toString(),
					date: new Date(transaction.createdAt).toLocaleDateString(
						"fr-FR"
					),
					actions: (
						<CButton
							text="Détails"
							btnStyle={"dark"}
							icon={<Info className="w-4 h-4" />}
							onClick={() =>
								handleViewTransactionDetails(transaction)
							}
						/>
					),
				};
			}
		) || [];

	return (
		<Layout title="Détails de la Carte">
			<div className="min-h-screen  p-6">
				<div className="max-w-6xl mx-auto space-y-8">
					{/* Header */}
					<div className="flex items-center gap-4">
						<button
							onClick={() => router.back()}
							className="p-2 hover:bg-white rounded-lg transition-colors shadow-sm"
						>
							<ChevronLeft className="w-6 h-6 text-slate-600" />
						</button>
						<div>
							<h1 className="text-2xl font-bold text-slate-800">
								Détails de la Carte
							</h1>
							<p className="text-slate-600 text-sm">
								ID: {cardData.id.slice(0, 8)}...
							</p>
						</div>
					</div>

					{/* Carte bancaire */}
					<div className="relative w-full max-w-md mx-auto">
						<div className="relative w-full h-56 rounded-2xl bg-gradient-to-br from-green-500 via-green-600 to-green-700 p-6 text-white shadow-2xl overflow-hidden">
							<div className="absolute inset-0 opacity-10">
								<div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32"></div>
								<div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24"></div>
							</div>

							<div className="relative h-full flex flex-col justify-between">
								<div className="flex justify-between items-start">
									<div>
										<div className="text-xs font-semibold opacity-80 mb-1">
											{cardData.isVirtual
												? "CARTE VIRTUELLE"
												: "CARTE PHYSIQUE"}
										</div>
										<div
											className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(
												cardData.status
											)}`}
										>
											{cardData.status}
										</div>
									</div>
									<div className="text-2xl font-bold">
										{cardData.brand}
									</div>
								</div>

								<div className="w-12 h-10 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-lg opacity-90"></div>

								<div>
									<div className="text-xl font-mono tracking-wider mb-3">
										{cardData.maskedNumber}
									</div>

									<div className="flex justify-between items-end">
										<div>
											<div className="text-xs opacity-70 mb-1">
												Titulaire
											</div>
											<div className="text-sm font-semibold truncate max-w-[180px]">
												{cardData.nameOnCard}
											</div>
										</div>
										<div className="text-right">
											<div className="text-xs opacity-70 mb-1">
												Expire
											</div>
											<div className="text-sm font-semibold">
												{formatExpiry(
													cardData.expiryMonth,
													cardData.expiryYear
												)}
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Panneau solde */}
						<div className="mt-4 bg-white rounded-xl p-4 shadow-lg border border-slate-200">
							<div className="flex items-center justify-between">
								<div>
									<div className="text-xs text-slate-500 mb-1">
										Solde disponible
									</div>
									<div className="text-2xl font-bold text-slate-800">
										{parseFloat(cardData.balance).toFixed(
											2
										)}{" "}
										{cardData.currency}
									</div>
								</div>
								<DollarSign className="w-8 h-8 text-green-500" />
							</div>
						</div>
					</div>

					{/* Boutons d'action dynamiques */}
					{(showFreezeButton ||
						showUnfreezeButton ||
						showTerminateButton) && (
						<div className="max-w-md mx-auto flex flex-wrap gap-3 justify-center">
							{showFreezeButton && (
								<CButton
									text="Geler"
									btnStyle="outlineDark"
									icon={<Snowflake />}
									onClick={handleOpenFreezeModal}
									disabled={isProcessing}
								/>
							)}

							{showUnfreezeButton && (
								<CButton
									text="Dégeler"
									btnStyle="green"
									icon={<Play />}
									onClick={handleOpenUnfreezeModal}
									disabled={isProcessing}
								/>
							)}

							{showTerminateButton && (
								<CButton
									text="Terminer"
									btnStyle="red"
									icon={<Trash2 />}
									onClick={handleOpenTerminateModal}
									disabled={isProcessing}
								/>
							)}
						</div>
					)}

					{/* Message si carte terminée */}
					{cardData.status === "TERMINATED" && (
						<div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-xl p-4 text-center">
							<p className="text-red-700 font-medium">
								Cette carte a été terminée et ne peut plus être
								utilisée.
							</p>
						</div>
					)}

					{/* Informations détaillées */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* Adresse de facturation */}
						<div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
							<div className="flex items-center gap-3 mb-4">
								<div className="p-2 bg-purple-100 rounded-lg">
									<MapPin className="w-5 h-5 text-purple-600" />
								</div>
								<h3 className="text-lg font-bold text-slate-800">
									Adresse de Facturation
								</h3>
							</div>
							<div className="space-y-2 text-sm">
								<p className="text-slate-700">
									{cardData?.billingAddress?.addressLine1}
								</p>
								{cardData?.billingAddress?.addressLine2 && (
									<p className="text-slate-700">
										{cardData?.billingAddress?.addressLine2}
									</p>
								)}
								<p className="text-slate-700">
									{cardData?.billingAddress?.city},{" "}
									{cardData?.billingAddress?.state}{" "}
									{cardData?.billingAddress?.postalCode}
								</p>
								<p className="text-slate-700 font-semibold">
									{cardData?.billingAddress?.country}
								</p>
							</div>
						</div>

						{/* Informations de sécurité */}
						<div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
							<div className="flex items-center gap-3 mb-4">
								<div className="p-2 bg-orange-100 rounded-lg">
									<Shield className="w-5 h-5 text-orange-600" />
								</div>
								<h3 className="text-lg font-bold text-slate-800">
									Informations de Sécurité
								</h3>
							</div>
							<div className="space-y-3">
								<div className="flex justify-between items-center">
									<span className="text-sm text-slate-600">
										Type de carte
									</span>
									<span className="text-sm font-medium text-slate-800">
										{cardData.metadata.cardType}
									</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-sm text-slate-600">
										Statut
									</span>
									<span
										className={`text-sm font-medium ${
											cardData.status === "ACTIVE"
												? "text-green-600"
												: cardData.status === "FROZEN"
												? "text-blue-600"
												: cardData.status ===
												  "TERMINATED"
												? "text-red-600"
												: cardData.status === "PENDING"
												? "text-yellow-600"
												: "text-gray-600"
										}`}
									>
										{cardData.cartevoStatus}
									</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-sm text-slate-600">
										Créée via
									</span>
									<span className="text-sm font-medium text-slate-800">
										{cardData.metadata.createdVia}
									</span>
								</div>
							</div>
						</div>

						{/* Dates */}
						<div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
							<div className="flex items-center gap-3 mb-4">
								<div className="p-2 bg-blue-100 rounded-lg">
									<Calendar className="w-5 h-5 text-blue-600" />
								</div>
								<h3 className="text-lg font-bold text-slate-800">
									Dates
								</h3>
							</div>
							<div className="space-y-3">
								<div>
									<p className="text-xs text-slate-500 mb-1">
										Créée le
									</p>
									<p className="text-sm text-slate-700">
										{formatDate(cardData.createdAt)}
									</p>
								</div>
								<div>
									<p className="text-xs text-slate-500 mb-1">
										Dernière mise à jour
									</p>
									<p className="text-sm text-slate-700">
										{formatDate(cardData.updatedAt)}
									</p>
								</div>
								<div>
									<p className="text-xs text-slate-500 mb-1">
										Créée sur Cartevo
									</p>
									<p className="text-sm text-slate-700">
										{formatDate(cardData.cartevoCreatedAt)}
									</p>
								</div>
							</div>
						</div>

						{/* Identifiants */}
						<div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
							<div className="flex items-center gap-3 mb-4">
								<div className="p-2 bg-indigo-100 rounded-lg">
									<Info className="w-5 h-5 text-indigo-600" />
								</div>
								<h3 className="text-lg font-bold text-slate-800">
									Identifiants
								</h3>
							</div>
							<div className="space-y-3">
								<div>
									<p className="text-xs text-slate-500 mb-1">
										Card ID
									</p>
									<p className="text-xs font-mono text-slate-700 break-all">
										{cardData.id}
									</p>
								</div>
								<div>
									<p className="text-xs text-slate-500 mb-1">
										Customer ID
									</p>
									<p className="text-xs font-mono text-slate-700 break-all">
										{cardData.customerId}
									</p>
								</div>
								<div>
									<p className="text-xs text-slate-500 mb-1">
										Cartevo Card ID
									</p>
									<p className="text-xs font-mono text-slate-700 break-all">
										{cardData.cartevoCardId}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Section Transactions avec CustomTable */}
				<div className="mt-12">
					<div className="mb-6 flex items-center justify-between">
						<div>
							<h2 className="text-xl font-bold text-slate-800 mb-1">
								{"Historique des Transactions"}
							</h2>
							<p className="text-slate-600 text-sm">
								{getCardTransaction.data?.data?.meta?.total ||
									0}{" "}
								{"transactions récentes"}
							</p>
						</div>
						<div className="flex items-center gap-2 text-slate-600">
							<ArrowRightLeft className="w-5 h-5" />
							<span className="text-sm font-medium">
								{"Transactions"}
							</span>
						</div>
					</div>

					<section>
						<CustomTable
							headerData={transactionsHeaderData}
							tableData={transactionTableData}
							isLoading={
								getCardTransaction.isLoading ||
								getCardTransaction.isFetching
							}
							filter
							filterType={"transactionsV3"}
							filterContent={filterContent}
							setFilterContent={setFilterContent}
						/>
					</section>
				</div>
			</div>

			{/* Modal pour les actions de carte */}
			<Modal
				isOpen={modalOpen}
				setIsOpen={setModalOpen}
				modalContent={getModalContent()}
			/>

			{/* Modal pour les détails de transaction */}
			<Modal
				isOpen={isTransactionModalOpen}
				setIsOpen={setIsTransactionModalOpen}
				modalContent={
					selectedTransaction ? (
						<TransactionDetailsContent
							transaction={selectedTransaction}
						/>
					) : null
				}
			/>
		</Layout>
	);
};

export default CardDetailsPage;
