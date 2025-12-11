"use client";

import {
	handleAdjustWalletBalance,
	handleCreateDebt,
	handleGetTransactionDetails,
	handleGetUserDefaultWallet,
	handleGetUserTransactions,
	handleGetUserWallets,
} from "@/api/handlers/transactions.handler";
import LabelWithBadge from "@/components/shared/LabelWithBadge";
import { getFormattedDateTime } from "@/utils/DateFormat";
import {
	AlertTriangle,
	ArrowDownLeft,
	ArrowRightLeft,
	ArrowUpRight,
	Banknote,
	CheckCircle,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	ChevronUp,
	Clock,
	Edit3,
	Eye,
	Filter,
	Plus,
	RefreshCw,
	Star,
	TrendingDown,
	TrendingUp,
	Wallet,
	X,
	XCircle,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { HashLoader } from "react-spinners";

// Types
interface WalletData {
	id: string;
	userId: string;
	currency: string;
	accountType: string;
	status: string;
	isDefault: boolean;
	balance: number;
	formattedBalance: string;
	availableBalance: number;
	totalHolds: number;
}

interface TransactionStats {
	totalCount: number;
	totalSuccessCount: number;
	totalPendingCount: number;
	totalFailedCount: number;
	totalSuccessAmount: number;
	totalDeposits: number;
	totalWithdrawals: number;
	totalTransfersSent: number;
	totalTransfersReceived: number;
}

interface Transaction {
	id: string;
	userId: string;
	type: string;
	status: string;
	category: string;
	currency: string;
	amount: number;
	netAmount: number;
	feeAmount: number;
	reference: string;
	formattedAmount: string;
	createdAt: Date;
	metadata?: Record<string, any>;
}

interface TransactionFilters {
	page: number;
	limit: number;
	type?: string;
	status?: string;
	category?: string;
	currency?: string;
	startDate?: string;
	endDate?: string;
}

const Transactions = () => {
	const params = useParams();
	const userId = params.id as string;
	const queryClient = useQueryClient();

	// State
	const [filters, setFilters] = useState<TransactionFilters>({
		page: 1,
		limit: 10,
	});
	const [showFilters, setShowFilters] = useState(false);
	const [selectedTransaction, setSelectedTransaction] = useState<
		string | null
	>(null);
	const [expandedWallet, setExpandedWallet] = useState<string | null>(null);
	const [showAllWallets, setShowAllWallets] = useState(false);
	const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);

	// Balance adjustment modal state
	const [showAdjustBalanceModal, setShowAdjustBalanceModal] = useState(false);
	const [adjustBalanceForm, setAdjustBalanceForm] = useState({
		newBalance: "",
		reason: "",
		internalReference: "",
	});
	const [adjustBalanceError, setAdjustBalanceError] = useState<string | null>(null);

	// Debt creation modal state
	const [showCreateDebtModal, setShowCreateDebtModal] = useState(false);
	const [createDebtForm, setCreateDebtForm] = useState({
		amount: "",
		currency: "",
		reason: "",
		internalReference: "",
		attemptImmediatePayment: true,
	});
	const [createDebtError, setCreateDebtError] = useState<string | null>(null);

	// Fetch default wallet
	const walletQuery = useQuery({
		queryKey: ["user-default-wallet", userId],
		queryFn: handleGetUserDefaultWallet,
		enabled: !!userId,
	});

	// Fetch all wallets
	const walletsQuery = useQuery({
		queryKey: ["user-wallets", userId],
		queryFn: handleGetUserWallets,
		enabled: !!userId,
	});

	// Fetch transactions
	const transactionsQuery = useQuery({
		queryKey: ["user-transactions", userId, filters],
		queryFn: handleGetUserTransactions,
		enabled: !!userId,
	});

	// Fetch transaction details
	const transactionDetailsQuery = useQuery({
		queryKey: ["transaction-details", selectedTransaction],
		queryFn: handleGetTransactionDetails,
		enabled: !!selectedTransaction,
	});

	// Balance adjustment mutation
	const adjustBalanceMutation = useMutation({
		mutationFn: handleAdjustWalletBalance,
		onSuccess: () => {
			// Invalidate queries to refresh wallet data
			queryClient.invalidateQueries(["user-default-wallet", userId]);
			queryClient.invalidateQueries(["user-wallets", userId]);
			queryClient.invalidateQueries(["user-transactions", userId]);
			// Close modal and reset form
			setShowAdjustBalanceModal(false);
			setAdjustBalanceForm({
				newBalance: "",
				reason: "",
				internalReference: "",
			});
			setAdjustBalanceError(null);
		},
		onError: (error: Error) => {
			setAdjustBalanceError(error.message);
		},
	});

	// Create debt mutation
	const createDebtMutation = useMutation({
		mutationFn: handleCreateDebt,
		onSuccess: () => {
			// Invalidate queries to refresh wallet and transaction data
			queryClient.invalidateQueries(["user-default-wallet", userId]);
			queryClient.invalidateQueries(["user-wallets", userId]);
			queryClient.invalidateQueries(["user-transactions", userId]);
			// Close modal and reset form
			setShowCreateDebtModal(false);
			setCreateDebtForm({
				amount: "",
				currency: "",
				reason: "",
				internalReference: "",
				attemptImmediatePayment: true,
			});
			setCreateDebtError(null);
		},
		onError: (error: Error) => {
			setCreateDebtError(error.message);
		},
	});

	// Handle balance adjustment form submission
	const handleAdjustBalanceSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setAdjustBalanceError(null);

		if (!wallet?.id) {
			setAdjustBalanceError("Aucun wallet selectionne");
			return;
		}

		const newBalance = parseFloat(adjustBalanceForm.newBalance);
		if (isNaN(newBalance)) {
			setAdjustBalanceError("Veuillez entrer un montant valide");
			return;
		}

		if (!adjustBalanceForm.reason.trim()) {
			setAdjustBalanceError("La raison est obligatoire");
			return;
		}

		adjustBalanceMutation.mutate({
			walletId: wallet.id,
			newBalance: newBalance,
			reason: adjustBalanceForm.reason,
			internalReference: adjustBalanceForm.internalReference || undefined,
		});
	};

	// Open adjust balance modal with current balance pre-filled
	const openAdjustBalanceModal = () => {
		setAdjustBalanceForm({
			newBalance: wallet?.availableBalance?.toString() || "",
			reason: "",
			internalReference: "",
		});
		setAdjustBalanceError(null);
		setShowAdjustBalanceModal(true);
	};

	// Handle debt creation form submission
	const handleCreateDebtSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setCreateDebtError(null);

		const amount = parseFloat(createDebtForm.amount);
		if (isNaN(amount) || amount <= 0) {
			setCreateDebtError("Veuillez entrer un montant valide superieur a 0");
			return;
		}

		if (!createDebtForm.reason.trim()) {
			setCreateDebtError("La raison est obligatoire");
			return;
		}

		createDebtMutation.mutate({
			userId: userId,
			amount: amount,
			currency: createDebtForm.currency || undefined,
			reason: createDebtForm.reason,
			internalReference: createDebtForm.internalReference || undefined,
			attemptImmediatePayment: createDebtForm.attemptImmediatePayment,
		});
	};

	// Open create debt modal
	const openCreateDebtModal = () => {
		setCreateDebtForm({
			amount: "",
			currency: wallet?.currency || "",
			reason: "",
			internalReference: "",
			attemptImmediatePayment: true,
		});
		setCreateDebtError(null);
		setShowCreateDebtModal(true);
	};

	// Unwrap gateway response: {status, data, message, statusCode}
	const walletResponse = walletQuery.data;
	const defaultWallet: WalletData | null = walletResponse?.data || null;

	const walletsResponse = walletsQuery.data;
	const wallets: WalletData[] = walletsResponse?.data || [];

	// Selected wallet: either manually selected or default wallet
	const wallet: WalletData | null = selectedWalletId
		? wallets.find(w => w.id === selectedWalletId) || defaultWallet
		: defaultWallet;

	// Handle wallet selection
	const handleWalletSelect = (walletId: string) => {
		setSelectedWalletId(walletId);
		// Also filter transactions by the selected wallet's currency
		handleFilterChange("currency", wallets.find(w => w.id === walletId)?.currency || undefined);
	};

	const transactionsResponse = transactionsQuery.data;
	// transactionsResponse.data contains: {data: [], total, page, limit, totalPages, stats}
	const transactionsData = transactionsResponse?.data;
	const transactions: Transaction[] = transactionsData?.data || [];

	const stats: TransactionStats = transactionsData?.stats || {
		totalCount: 0,
		totalSuccessCount: 0,
		totalPendingCount: 0,
		totalFailedCount: 0,
		totalSuccessAmount: 0,
		totalDeposits: 0,
		totalWithdrawals: 0,
		totalTransfersSent: 0,
		totalTransfersReceived: 0,
	};
	const totalPages = transactionsData?.totalPages || 1;
	const totalTransactions = transactionsData?.total || 0;

	// Unwrap transaction details
	const transactionDetailsResponse = transactionDetailsQuery.data;
	const transactionDetails: Transaction | null =
		transactionDetailsResponse?.data || null;

	// Handlers
	const handleFilterChange = (key: keyof TransactionFilters, value: any) => {
		setFilters((prev) => ({
			...prev,
			[key]: value,
			page: key !== "page" ? 1 : value, // Reset page when filter changes
		}));
	};

	const handlePageChange = (newPage: number) => {
		if (newPage >= 1 && newPage <= totalPages) {
			handleFilterChange("page", newPage);
		}
	};

	const clearFilters = () => {
		setFilters({ page: 1, limit: 10 });
	};

	// Wallet status badge
	const getWalletStatusBadge = (status: string) => {
		switch (status) {
			case "ACTIVE":
				return (
					<span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
						Actif
					</span>
				);
			case "FROZEN":
				return (
					<span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
						Gelé
					</span>
				);
			case "CLOSED":
				return (
					<span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
						Fermé
					</span>
				);
			default:
				return (
					<span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
						{status}
					</span>
				);
		}
	};

	// Status badge renderer
	const getStatusBadge = (status: string) => {
		switch (status) {
			case "SUCCESS":
				return (
					<LabelWithBadge
						label="Réussi"
						badgeColor="#18BC7A"
						textColor="#444"
					/>
				);
			case "PENDING":
				return (
					<LabelWithBadge
						label="En cours"
						badgeColor="#f39c12"
						textColor="#444"
					/>
				);
			case "FAILED":
				return (
					<LabelWithBadge
						label="Échoué"
						badgeColor="#F85D4B"
						textColor="#444"
					/>
				);
			case "CANCELLED":
			case "CANCELED":
				return (
					<LabelWithBadge
						label="Annulé"
						badgeColor="#6c757d"
						textColor="#444"
					/>
				);
			case "EXPIRED":
				return (
					<LabelWithBadge
						label="Expiré"
						badgeColor="#95a5a6"
						textColor="#444"
					/>
				);
			default:
				return (
					<LabelWithBadge
						label={status}
						badgeColor="#95a5a6"
						textColor="#444"
					/>
				);
		}
	};

	// Type badge renderer
	const getTypeBadge = (type: string, category: string) => {
		const isCard = category === "CARD";
		const prefix = isCard ? "Carte - " : "";

		switch (type) {
			case "DEPOSIT":
				return (
					<div className="flex items-center gap-2">
						<div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
							<ArrowDownLeft className="w-4 h-4 text-green-600" />
						</div>
						<span className="text-sm font-medium">
							{prefix}Dépôt
						</span>
					</div>
				);
			case "WITHDRAWAL":
				return (
					<div className="flex items-center gap-2">
						<div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
							<ArrowUpRight className="w-4 h-4 text-red-600" />
						</div>
						<span className="text-sm font-medium">
							{prefix}Retrait
						</span>
					</div>
				);
			case "TRANSFER":
				return (
					<div className="flex items-center gap-2">
						<div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
							<ArrowRightLeft className="w-4 h-4 text-blue-600" />
						</div>
						<span className="text-sm font-medium">Transfert</span>
					</div>
				);
			case "EXCHANGE":
				return (
					<div className="flex items-center gap-2">
						<div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
							<RefreshCw className="w-4 h-4 text-purple-600" />
						</div>
						<span className="text-sm font-medium">Change</span>
					</div>
				);
			default:
				return (
					<div className="flex items-center gap-2">
						<div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
							<Banknote className="w-4 h-4 text-gray-600" />
						</div>
						<span className="text-sm font-medium">{type}</span>
					</div>
				);
		}
	};

	const formatCurrency = (amount: number, currency: string) => {
		return new Intl.NumberFormat("fr-FR", {
			minimumFractionDigits: 0,
			maximumFractionDigits: 2,
		}).format(amount);
	};

	return (
		<div className="min-h-screen bg-gray-50 p-4">
			<div className="flex flex-col lg:flex-row gap-6">
				{/* Main Content - Left side */}
				<div className="lg:w-2/3 space-y-6">
					{/* Statistics Section */}
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
						<h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
							Statistiques des transactions
						</h2>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							<div className="bg-gray-50 rounded-lg p-4">
								<div className="flex items-center gap-2 mb-2">
									<div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
										<Banknote className="w-4 h-4 text-blue-600" />
									</div>
									<span className="text-sm text-gray-600">
										Total
									</span>
								</div>
								<p className="text-2xl font-bold text-gray-900">
									{stats.totalCount}
								</p>
							</div>

							<div className="bg-gray-50 rounded-lg p-4">
								<div className="flex items-center gap-2 mb-2">
									<div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
										<CheckCircle className="w-4 h-4 text-green-600" />
									</div>
									<span className="text-sm text-gray-600">
										Réussies
									</span>
								</div>
								<p className="text-2xl font-bold text-green-600">
									{stats.totalSuccessCount}
								</p>
							</div>

							<div className="bg-gray-50 rounded-lg p-4">
								<div className="flex items-center gap-2 mb-2">
									<div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
										<Clock className="w-4 h-4 text-yellow-600" />
									</div>
									<span className="text-sm text-gray-600">
										En cours
									</span>
								</div>
								<p className="text-2xl font-bold text-yellow-600">
									{stats.totalPendingCount}
								</p>
							</div>

							<div className="bg-gray-50 rounded-lg p-4">
								<div className="flex items-center gap-2 mb-2">
									<div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
										<XCircle className="w-4 h-4 text-red-600" />
									</div>
									<span className="text-sm text-gray-600">
										Échouées
									</span>
								</div>
								<p className="text-2xl font-bold text-red-600">
									{stats.totalFailedCount}
								</p>
							</div>
						</div>

						{/* Amount Stats */}
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-100">
							<div className="text-center">
								<p className="text-sm text-gray-600">
									Total succès
								</p>
								<p className="text-lg font-bold text-[#18bc7a]">
									{formatCurrency(
										stats.totalSuccessAmount,
										wallet?.currency || "XAF"
									)}{" "}
									<span className="text-xs text-gray-500">
										{wallet?.currency || "XAF"}
									</span>
								</p>
							</div>
							<div className="text-center">
								<p className="text-sm text-gray-600">Dépôts</p>
								<p className="text-lg font-bold text-green-600">
									{formatCurrency(
										stats.totalDeposits,
										wallet?.currency || "XAF"
									)}{" "}
									<span className="text-xs text-gray-500">
										{wallet?.currency || "XAF"}
									</span>
								</p>
							</div>
							<div className="text-center">
								<p className="text-sm text-gray-600">
									Retraits
								</p>
								<p className="text-lg font-bold text-red-600">
									{formatCurrency(
										stats.totalWithdrawals,
										wallet?.currency || "XAF"
									)}{" "}
									<span className="text-xs text-gray-500">
										{wallet?.currency || "XAF"}
									</span>
								</p>
							</div>
							<div className="text-center">
								<p className="text-sm text-gray-600">
									Transferts envoyés
								</p>
								<p className="text-lg font-bold text-blue-600">
									{formatCurrency(
										stats.totalTransfersSent,
										wallet?.currency || "XAF"
									)}{" "}
									<span className="text-xs text-gray-500">
										{wallet?.currency || "XAF"}
									</span>
								</p>
							</div>
						</div>
					</div>

					{/* Filters Section */}
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
						<div className="flex flex-wrap items-center justify-between gap-4">
							<h3 className="text-md font-semibold text-gray-900">
								Liste des transactions
							</h3>
							<div className="flex items-center gap-2">
								<button
									onClick={() => setShowFilters(!showFilters)}
									className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition ${
										showFilters
											? "bg-[#18bc7a] text-white border-[#18bc7a]"
											: "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
									}`}
								>
									<Filter className="w-4 h-4" />
									Filtres
								</button>
								{(filters.type ||
									filters.status ||
									filters.category ||
									filters.currency ||
									filters.startDate ||
									filters.endDate) && (
									<button
										onClick={clearFilters}
										className="text-sm text-[#18bc7a] hover:underline"
									>
										Effacer
									</button>
								)}
							</div>
						</div>

						{showFilters && (
							<div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
								<select
									value={filters.type || ""}
									onChange={(e) =>
										handleFilterChange(
											"type",
											e.target.value || undefined
										)
									}
									className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#18bc7a]"
								>
									<option value="">Tous les types</option>
									<option value="DEPOSIT">Dépôt</option>
									<option value="WITHDRAWAL">Retrait</option>
									<option value="TRANSFER">Transfert</option>
									<option value="EXCHANGE">Change</option>
								</select>

								<select
									value={filters.status || ""}
									onChange={(e) =>
										handleFilterChange(
											"status",
											e.target.value || undefined
										)
									}
									className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#18bc7a]"
								>
									<option value="">Tous les statuts</option>
									<option value="SUCCESS">Réussi</option>
									<option value="PENDING">En cours</option>
									<option value="FAILED">Échoué</option>
									<option value="CANCELLED">Annulé</option>
								</select>

								<select
									value={filters.category || ""}
									onChange={(e) =>
										handleFilterChange(
											"category",
											e.target.value || undefined
										)
									}
									className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#18bc7a]"
								>
									<option value="">Toutes catégories</option>
									<option value="WALLET">Wallet</option>
									<option value="CARD">Carte</option>
								</select>

								<select
									value={filters.currency || ""}
									onChange={(e) =>
										handleFilterChange(
											"currency",
											e.target.value || undefined
										)
									}
									className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#18bc7a]"
								>
									<option value="">Tous les wallets</option>
									{wallets.map((w) => (
										<option key={w.id} value={w.currency}>
											{w.currency} - {formatCurrency(w.availableBalance, w.currency)}
											{w.isDefault ? " (défaut)" : ""}
										</option>
									))}
								</select>

								<input
									type="date"
									value={filters.startDate || ""}
									onChange={(e) =>
										handleFilterChange(
											"startDate",
											e.target.value || undefined
										)
									}
									className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#18bc7a]"
									placeholder="Date début"
								/>

								<input
									type="date"
									value={filters.endDate || ""}
									onChange={(e) =>
										handleFilterChange(
											"endDate",
											e.target.value || undefined
										)
									}
									className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#18bc7a]"
									placeholder="Date fin"
								/>
							</div>
						)}
					</div>

					{/* Transactions List */}
					<div className="bg-white rounded-lg shadow-sm border border-gray-200">
						{transactionsQuery.isLoading ? (
							<div className="flex items-center justify-center py-12">
								<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#18bc7a]"></div>
							</div>
						) : transactions.length === 0 ? (
							<div className="flex flex-col items-center justify-center py-12">
								<Banknote className="w-12 h-12 text-gray-300 mb-4" />
								<p className="text-gray-500">
									Aucune transaction trouvée
								</p>
							</div>
						) : (
							<>
								<div className="overflow-x-auto">
									<table className="w-full">
										<thead className="bg-gray-50 border-b border-gray-200">
											<tr>
												<th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
													Type
												</th>
												<th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
													Montant
												</th>
												<th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
													Frais
												</th>
												<th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
													Statut
												</th>
												<th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
													Date
												</th>
												<th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
													Référence
												</th>
												<th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
													Actions
												</th>
											</tr>
										</thead>
										<tbody className="divide-y divide-gray-200">
											{transactions.map((tx) => (
												<tr
													key={tx.id}
													className="hover:bg-gray-50 transition"
												>
													<td className="px-4 py-4">
														{getTypeBadge(
															tx.type,
															tx.category
														)}
													</td>
													<td className="px-4 py-4">
														<div className="flex flex-col">
															<span
																className={`font-semibold ${
																	tx.type ===
																		"DEPOSIT" ||
																	tx.type ===
																		"TRANSFER_IN"
																		? "text-green-600"
																		: tx.type ===
																				"WITHDRAWAL" ||
																		  tx.type ===
																				"TRANSFER"
																		? "text-red-600"
																		: "text-gray-900"
																}`}
															>
																{tx.type ===
																	"DEPOSIT" ||
																tx.type ===
																	"TRANSFER_IN"
																	? "+"
																	: tx.type ===
																			"WITHDRAWAL" ||
																	  tx.type ===
																			"TRANSFER"
																	? "-"
																	: ""}
																{formatCurrency(
																	tx.amount,
																	tx.currency
																)}{" "}
																{tx.currency}
															</span>
															{tx.netAmount !==
																tx.amount && (
																<span className="text-xs text-gray-500">
																	Net:{" "}
																	{formatCurrency(
																		tx.netAmount,
																		tx.currency
																	)}{" "}
																	{
																		tx.currency
																	}
																</span>
															)}
														</div>
													</td>
													<td className="px-4 py-4">
														<span className="text-sm text-gray-600">
															{formatCurrency(
																tx.feeAmount,
																tx.currency
															)}{" "}
															{tx.currency}
														</span>
													</td>
													<td className="px-4 py-4">
														{getStatusBadge(
															tx.status
														)}
													</td>
													<td className="px-4 py-4">
														<span className="text-sm text-gray-600">
															{getFormattedDateTime(
																tx.createdAt
															)}
														</span>
													</td>
													<td className="px-4 py-4">
														<span className="text-xs font-mono text-gray-500">
															{tx.reference.slice(
																0,
																12
															)}
															...
														</span>
													</td>
													<td className="px-4 py-4 text-center">
														<button
															onClick={() =>
																setSelectedTransaction(
																	selectedTransaction ===
																		tx.id
																		? null
																		: tx.id
																)
															}
															className="p-2 hover:bg-gray-100 rounded-lg transition"
															title="Voir les détails"
														>
															<Eye className="w-4 h-4 text-gray-600" />
														</button>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>

								{/* Pagination */}
								<div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
									<div className="text-sm text-gray-600">
										Page {filters.page} sur {totalPages} (
										{totalTransactions} transactions)
									</div>
									<div className="flex items-center gap-2">
										<button
											onClick={() =>
												handlePageChange(
													filters.page - 1
												)
											}
											disabled={filters.page <= 1}
											className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
										>
											<ChevronLeft className="w-4 h-4" />
										</button>
										<span className="px-4 py-2 text-sm">
											{filters.page}
										</span>
										<button
											onClick={() =>
												handlePageChange(
													filters.page + 1
												)
											}
											disabled={
												filters.page >= totalPages
											}
											className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
										>
											<ChevronRight className="w-4 h-4" />
										</button>
									</div>
								</div>
							</>
						)}
					</div>
				</div>

				{/* Right Side - Wallet Balance Card */}
				<div className="lg:w-1/3 space-y-6">
					{/* Wallet Balance Card */}
					<div className="bg-gradient-to-br from-[#18bc7a] to-emerald-600 rounded-2xl shadow-lg p-6 text-white">
						<div className="flex items-center justify-between mb-6">
							<div className="flex items-center gap-3">
								<div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
									<Wallet className="w-6 h-6 text-white" />
								</div>
								<div>
									<p className="text-sm text-white/80">
										{wallet?.isDefault ? "Wallet par défaut" : "Wallet"} - {wallet?.currency || "XAF"}
									</p>
									<p className="text-xs text-white/60">
										{wallet?.accountType || "USER"} • {wallet?.status || "ACTIVE"}
									</p>
								</div>
							</div>
							<div className="flex items-center gap-2">
							{wallet?.isDefault && (
								<span className="px-2 py-1 bg-white/20 rounded-full text-xs">
									<Star className="w-3 h-3 inline mr-1" />
									Défaut
								</span>
							)}
							{wallet && (
								<>
									<button
										onClick={openCreateDebtModal}
										className="p-2 bg-red-500/80 hover:bg-red-500 rounded-lg transition"
										title="Creer une dette"
									>
										<AlertTriangle className="w-4 h-4 text-white" />
									</button>
									<button
										onClick={openAdjustBalanceModal}
										className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition"
										title="Modifier le solde"
									>
										<Edit3 className="w-4 h-4 text-white" />
									</button>
								</>
							)}
						</div>
						</div>

						{walletQuery.isLoading ? (
							<div className="flex items-center justify-center py-4">
								<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
							</div>
						) : walletQuery.isError ? (
							<div className="text-center py-4">
								<p className="text-white/80">
									Erreur de chargement
								</p>
							</div>
						) : wallet ? (
							<>
								<div className="mb-6">
									<p className="text-sm text-white/70 mb-1">
										Solde disponible
									</p>
									<div className="flex items-baseline gap-2">
										<span className="text-4xl font-bold">
											{formatCurrency(
												wallet.availableBalance,
												wallet.currency
											)}
										</span>
										<span className="text-xl text-white/80">
											{wallet.currency}
										</span>
									</div>
								</div>

								<div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
									<div>
										<p className="text-xs text-white/60 mb-1">
											Solde total
										</p>
										<p className="text-lg font-semibold">
											{formatCurrency(
												wallet.balance,
												wallet.currency
											)}{" "}
											<span className="text-xs text-white/70">
												{wallet.currency}
											</span>
										</p>
									</div>
									<div>
										<p className="text-xs text-white/60 mb-1">
											En attente
										</p>
										<p className="text-lg font-semibold">
											{formatCurrency(
												wallet.totalHolds,
												wallet.currency
											)}{" "}
											<span className="text-xs text-white/70">
												{wallet.currency}
											</span>
										</p>
									</div>
								</div>
							</>
						) : (
							<div className="text-center py-4">
								<p className="text-white/80">
									Aucun wallet par défaut
								</p>
							</div>
						)}
					</div>

					{/* All Wallets List */}
					{wallets.length > 1 && (
						<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
							<div className="flex items-center justify-between mb-3">
								<h3 className="text-sm font-semibold text-gray-900">
									Tous les wallets ({wallets.length})
								</h3>
								<button
									onClick={() => {
										setSelectedWalletId(null);
										handleFilterChange("currency", undefined);
									}}
									className="text-xs text-[#18bc7a] hover:underline"
								>
									Réinitialiser
								</button>
							</div>
							<div className="space-y-2">
								{wallets.map((w) => (
									<button
										key={w.id}
										onClick={() => handleWalletSelect(w.id)}
										className={`w-full flex items-center justify-between p-3 rounded-lg border transition ${
											wallet?.id === w.id
												? "bg-[#18bc7a]/10 border-[#18bc7a] ring-1 ring-[#18bc7a]"
												: "bg-gray-50 border-gray-200 hover:bg-gray-100"
										}`}
									>
										<div className="flex items-center gap-3">
											<div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
												wallet?.id === w.id
													? "bg-[#18bc7a] text-white"
													: "bg-gray-200 text-gray-600"
											}`}>
												<Wallet className="w-4 h-4" />
											</div>
											<div className="text-left">
												<div className="flex items-center gap-2">
													<span className={`text-sm font-medium ${
														wallet?.id === w.id ? "text-[#18bc7a]" : "text-gray-900"
													}`}>
														{w.currency}
													</span>
													{w.isDefault && (
														<Star className="w-3 h-3 text-amber-500 fill-amber-500" />
													)}
													{getWalletStatusBadge(w.status)}
												</div>
												<p className="text-xs text-gray-500">
													{w.accountType}
												</p>
											</div>
										</div>
										<div className="text-right">
											<p className={`text-sm font-bold ${
												wallet?.id === w.id ? "text-[#18bc7a]" : "text-gray-900"
											}`}>
												{formatCurrency(w.availableBalance, w.currency)}
											</p>
											{w.totalHolds > 0 && (
												<p className="text-xs text-gray-500">
													En attente: {formatCurrency(w.totalHolds, w.currency)}
												</p>
											)}
										</div>
									</button>
								))}
							</div>
						</div>
					)}

					{/* Quick Stats Card */}
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
							Activité récente
						</h3>
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
										<TrendingUp className="w-5 h-5 text-green-600" />
									</div>
									<div>
										<p className="text-sm font-medium text-gray-700">
											Entrées
										</p>
										<p className="text-xs text-gray-500">
											Dépôts + Reçus
										</p>
									</div>
								</div>
								<p className="text-lg font-bold text-green-600">
									+
									{formatCurrency(
										stats.totalDeposits +
											stats.totalTransfersReceived,
										wallet?.currency || "XAF"
									)}
								</p>
							</div>

							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
										<TrendingDown className="w-5 h-5 text-red-600" />
									</div>
									<div>
										<p className="text-sm font-medium text-gray-700">
											Sorties
										</p>
										<p className="text-xs text-gray-500">
											Retraits + Envoyés
										</p>
									</div>
								</div>
								<p className="text-lg font-bold text-red-600">
									-
									{formatCurrency(
										stats.totalWithdrawals +
											stats.totalTransfersSent,
										wallet?.currency || "XAF"
									)}
								</p>
							</div>
						</div>
					</div>

					{/* Transaction Details Modal */}
					{selectedTransaction && transactionDetails && (
						<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
							<div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
								<h3 className="text-lg font-semibold text-gray-900">
									Détails transaction
								</h3>
								<button
									onClick={() => setSelectedTransaction(null)}
									className="text-gray-400 hover:text-gray-600"
								>
									<XCircle className="w-5 h-5" />
								</button>
							</div>

							{transactionDetailsQuery.isLoading ? (
								<div className="flex items-center justify-center py-8">
									<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#18bc7a]"></div>
								</div>
							) : (
								<div className="space-y-3">
									<div>
										<p className="text-xs text-gray-500">
											ID
										</p>
										<p className="text-sm font-mono">
											{transactionDetails.id}
										</p>
									</div>
									<div>
										<p className="text-xs text-gray-500">
											Référence
										</p>
										<p className="text-sm font-mono break-all">
											{transactionDetails.reference}
										</p>
									</div>
									<div className="grid grid-cols-2 gap-4">
										<div>
											<p className="text-xs text-gray-500">
												Type
											</p>
											<p className="text-sm font-medium">
												{transactionDetails.type}
											</p>
										</div>
										<div>
											<p className="text-xs text-gray-500">
												Catégorie
											</p>
											<p className="text-sm font-medium">
												{transactionDetails.category}
											</p>
										</div>
									</div>
									<div className="grid grid-cols-2 gap-4">
										<div>
											<p className="text-xs text-gray-500">
												Montant
											</p>
											<p className="text-sm font-semibold">
												{formatCurrency(
													transactionDetails.amount,
													transactionDetails.currency
												)}{" "}
												{transactionDetails.currency}
											</p>
										</div>
										<div>
											<p className="text-xs text-gray-500">
												Frais
											</p>
											<p className="text-sm font-medium text-gray-600">
												{formatCurrency(
													transactionDetails.feeAmount,
													transactionDetails.currency
												)}{" "}
												{transactionDetails.currency}
											</p>
										</div>
									</div>
									<div>
										<p className="text-xs text-gray-500">
											Statut
										</p>
										<div className="mt-1">
											{getStatusBadge(
												transactionDetails.status
											)}
										</div>
									</div>
									<div>
										<p className="text-xs text-gray-500">
											Date
										</p>
										<p className="text-sm">
											{getFormattedDateTime(
												transactionDetails.createdAt
											)}
										</p>
									</div>

									{/* Failure Reason - Show for FAILED/CANCELLED transactions */}
									{(transactionDetails.status === "FAILED" ||
										transactionDetails.status ===
											"CANCELLED") &&
										transactionDetails.metadata
											?.failureReason && (
											<div className="bg-red-50 border border-red-200 rounded-lg p-3">
												<p className="text-xs text-red-600 font-medium mb-1">
													Raison de l&apos;échec
												</p>
												<p className="text-sm text-red-700">
													{
														transactionDetails
															.metadata
															.failureReason
													}
												</p>
											</div>
										)}

									{/* Ledger Entries */}
									{(transactionDetails as any)
										.ledgerEntries &&
										(transactionDetails as any)
											.ledgerEntries.length > 0 && (
											<div className="mt-4 pt-4 border-t border-gray-200">
												<p className="text-xs text-gray-500 mb-2">
													Écritures comptables
												</p>
												<div className="space-y-2">
													{(
														transactionDetails as any
													).ledgerEntries.map(
														(
															entry: any,
															idx: number
														) => (
															<div
																key={idx}
																className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded"
															>
																<span
																	className={`font-medium ${
																		entry.entryType ===
																		"CREDIT"
																			? "text-green-600"
																			: "text-red-600"
																	}`}
																>
																	{
																		entry.entryType
																	}
																</span>
																<span>
																	{formatCurrency(
																		entry.amount,
																		entry.currency
																	)}{" "}
																	{
																		entry.currency
																	}
																</span>
															</div>
														)
													)}
												</div>
											</div>
										)}
								</div>
							)}
						</div>
					)}
				</div>
			</div>

			{/* Balance Adjustment Modal */}
			{showAdjustBalanceModal && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
					<div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
						<div className="flex items-center justify-between p-6 border-b border-gray-200">
							<h3 className="text-lg font-semibold text-gray-900">
								Modifier le solde
							</h3>
							<button
								onClick={() => setShowAdjustBalanceModal(false)}
								className="p-2 hover:bg-gray-100 rounded-lg transition"
							>
								<X className="w-5 h-5 text-gray-500" />
							</button>
						</div>

						<form
							onSubmit={handleAdjustBalanceSubmit}
							className="p-6 space-y-4"
						>
							{/* Current Balance Info */}
							<div className="bg-gray-50 rounded-lg p-4">
								<p className="text-sm text-gray-600 mb-1">
									Solde actuel
								</p>
								<p className="text-2xl font-bold text-gray-900">
									{formatCurrency(
										wallet?.availableBalance || 0,
										wallet?.currency || "XAF"
									)}{" "}
									<span className="text-sm text-gray-500">
										{wallet?.currency || "XAF"}
									</span>
								</p>
							</div>

							{/* New Balance Input */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Nouveau solde ({wallet?.currency || "XAF"})
								</label>
								<input
									type="number"
									step="0.01"
									value={adjustBalanceForm.newBalance}
									onChange={(e) =>
										setAdjustBalanceForm((prev) => ({
											...prev,
											newBalance: e.target.value,
										}))
									}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18bc7a] focus:border-transparent"
									placeholder="Entrez le nouveau solde"
									required
								/>
							</div>

							{/* Reason Input */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Raison de l&apos;ajustement *
								</label>
								<textarea
									value={adjustBalanceForm.reason}
									onChange={(e) =>
										setAdjustBalanceForm((prev) => ({
											...prev,
											reason: e.target.value,
										}))
									}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18bc7a] focus:border-transparent resize-none"
									placeholder="Ex: Correction de solde, remboursement..."
									rows={3}
									required
								/>
							</div>

							{/* Internal Reference Input */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Reference interne (optionnel)
								</label>
								<input
									type="text"
									value={adjustBalanceForm.internalReference}
									onChange={(e) =>
										setAdjustBalanceForm((prev) => ({
											...prev,
											internalReference: e.target.value,
										}))
									}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18bc7a] focus:border-transparent"
									placeholder="Ex: TICKET-12345"
								/>
							</div>

							{/* Adjustment Preview */}
							{adjustBalanceForm.newBalance && (
								<div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
									<p className="text-xs text-blue-600 font-medium mb-1">
										Apercu de l&apos;ajustement
									</p>
									<div className="flex items-center justify-between">
										<span className="text-sm text-blue-700">
											{parseFloat(
												adjustBalanceForm.newBalance
											) > (wallet?.availableBalance || 0)
												? "CREDIT"
												: parseFloat(
														adjustBalanceForm.newBalance
												  ) <
												  (wallet?.availableBalance ||
														0)
												? "DEBIT"
												: "Aucun changement"}
										</span>
										<span
											className={`text-sm font-bold ${
												parseFloat(
													adjustBalanceForm.newBalance
												) >
												(wallet?.availableBalance || 0)
													? "text-green-600"
													: parseFloat(
															adjustBalanceForm.newBalance
													  ) <
													  (wallet?.availableBalance ||
															0)
													? "text-red-600"
													: "text-gray-600"
											}`}
										>
											{parseFloat(
												adjustBalanceForm.newBalance
											) > (wallet?.availableBalance || 0)
												? "+"
												: ""}
											{formatCurrency(
												parseFloat(
													adjustBalanceForm.newBalance
												) -
													(wallet?.availableBalance ||
														0),
												wallet?.currency || "XAF"
											)}{" "}
											{wallet?.currency || "XAF"}
										</span>
									</div>
								</div>
							)}

							{/* Error Message */}
							{adjustBalanceError && (
								<div className="bg-red-50 border border-red-200 rounded-lg p-3">
									<p className="text-sm text-red-600">
										{adjustBalanceError}
									</p>
								</div>
							)}

							{/* Action Buttons */}
							<div className="flex gap-3 pt-2">
								<button
									type="button"
									onClick={() =>
										setShowAdjustBalanceModal(false)
									}
									className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
								>
									Annuler
								</button>
								<button
									type="submit"
									disabled={adjustBalanceMutation.isLoading}
									className="flex-1 px-4 py-2 bg-[#18bc7a] text-white rounded-lg hover:bg-emerald-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
								>
									{adjustBalanceMutation.isLoading ? (
										<>
											<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
											Traitement...
										</>
									) : (
										"Confirmer"
									)}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* Create Debt Modal */}
			{showCreateDebtModal && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
					<div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
						<div className="flex items-center justify-between p-6 border-b border-gray-200">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
									<AlertTriangle className="w-5 h-5 text-red-600" />
								</div>
								<h3 className="text-lg font-semibold text-gray-900">
									Creer une dette
								</h3>
							</div>
							<button
								onClick={() => setShowCreateDebtModal(false)}
								className="p-2 hover:bg-gray-100 rounded-lg transition"
							>
								<X className="w-5 h-5 text-gray-500" />
							</button>
						</div>

						<form onSubmit={handleCreateDebtSubmit} className="p-6 space-y-4">
							{/* Amount Input */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Montant de la dette *
								</label>
								<input
									type="number"
									step="1"
									min="1"
									value={createDebtForm.amount}
									onChange={(e) =>
										setCreateDebtForm((prev) => ({
											...prev,
											amount: e.target.value,
										}))
									}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
									placeholder="Entrez le montant"
									required
								/>
							</div>

							{/* Currency Select */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Devise
								</label>
								<select
									value={createDebtForm.currency}
									onChange={(e) =>
										setCreateDebtForm((prev) => ({
											...prev,
											currency: e.target.value,
										}))
									}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
								>
									<option value="">Devise par defaut du wallet</option>
									{wallets.map((w) => (
										<option key={w.id} value={w.currency}>
											{w.currency} - Solde: {formatCurrency(w.availableBalance, w.currency)}
										</option>
									))}
								</select>
							</div>

							{/* Reason Input */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Raison de la dette *
								</label>
								<textarea
									value={createDebtForm.reason}
									onChange={(e) =>
										setCreateDebtForm((prev) => ({
											...prev,
											reason: e.target.value,
										}))
									}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
									placeholder="Ex: Echec paiement carte virtuelle, dette suite a..."
									rows={3}
									required
								/>
							</div>

							{/* Internal Reference Input */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Reference interne (optionnel)
								</label>
								<input
									type="text"
									value={createDebtForm.internalReference}
									onChange={(e) =>
										setCreateDebtForm((prev) => ({
											...prev,
											internalReference: e.target.value,
										}))
									}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
									placeholder="Ex: TICKET-12345"
								/>
							</div>

							{/* Immediate Payment Option */}
							<div className="flex items-center gap-3">
								<input
									type="checkbox"
									id="attemptImmediatePayment"
									checked={createDebtForm.attemptImmediatePayment}
									onChange={(e) =>
										setCreateDebtForm((prev) => ({
											...prev,
											attemptImmediatePayment: e.target.checked,
										}))
									}
									className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
								/>
								<label htmlFor="attemptImmediatePayment" className="text-sm text-gray-700">
									Tenter le prelevement immediat si solde suffisant
								</label>
							</div>

							{/* Warning Info */}
							<div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
								<div className="flex items-start gap-2">
									<AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
									<div className="text-xs text-amber-700">
										<p className="font-medium mb-1">Important</p>
										<p>Cette action va creer une transaction de dette pour cet utilisateur. Si le solde est insuffisant, la dette restera en attente et sera automatiquement prelevee lors du prochain depot.</p>
									</div>
								</div>
							</div>

							{/* Error Message */}
							{createDebtError && (
								<div className="bg-red-50 border border-red-200 rounded-lg p-3">
									<p className="text-sm text-red-600">{createDebtError}</p>
								</div>
							)}

							{/* Action Buttons */}
							<div className="flex gap-3 pt-2">
								<button
									type="button"
									onClick={() => setShowCreateDebtModal(false)}
									className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
								>
									Annuler
								</button>
								<button
									type="submit"
									disabled={createDebtMutation.isLoading}
									className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
								>
									{createDebtMutation.isLoading ? (
										<>
											<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
											Traitement...
										</>
									) : (
										"Creer la dette"
									)}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default Transactions;
