"use client";

import React from "react";
import {
	X,
	Calendar,
	CreditCard,
	DollarSign,
	Hash,
	FileText,
	User,
	Globe,
	CheckCircle,
	XCircle,
	Clock,
	RefreshCcw,
} from "lucide-react";

interface TransactionDetailsModalProps {
	transaction: any;
	isOpen: boolean;
	onClose: () => void;
}

const TransactionDetailsModal: React.FC<TransactionDetailsModalProps> = ({
	transaction,
	isOpen,
	onClose,
}) => {
	if (!isOpen || !transaction) return null;

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
		<dialog
			style={{ zIndex: "9000" }}
			className="fixed left-0 top-0 w-full h-full bg-black bg-opacity-50 overflow-auto backdrop-blur flex justify-center items-center"
		>
			<div
				className="z-0 absolute w-full h-full top-0 left-0"
				onClick={onClose}
			></div>

			<div className="z-[10] bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4">
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
					<button
						onClick={onClose}
						className="p-2 hover:bg-gray-100 rounded-lg transition"
					>
						<X className="w-5 h-5 text-gray-500" />
					</button>
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
										{transaction.amount}{" "}
										{transaction.currency}
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
											{formatDate(
												transaction.completedAt
											)}
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
										{transaction.isCrossborder
											? "Oui"
											: "Non"}
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
									{transaction.cardBalanceAfter -
										transaction.cardBalanceBefore}{" "}
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
									{JSON.stringify(
										transaction.metadata,
										null,
										2
									)}
								</pre>
							</div>
						</div>
					)}
				</div>

				{/* Pied du modal */}
				<div className="p-6 border-t border-gray-200 flex justify-end">
					<button
						onClick={onClose}
						className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition"
					>
						Fermer
					</button>
				</div>
			</div>
		</dialog>
	);
};

export default TransactionDetailsModal;
