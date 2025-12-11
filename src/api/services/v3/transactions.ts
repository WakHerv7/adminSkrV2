import BaseMethods from "@/api/baseMethods";
import { transactionsUrlV3 } from "@/api/urlsV3";

export interface TransactionFilters {
	page?: number;
	limit?: number;
	type?: string;
	status?: string;
	category?: string;
	startDate?: string;
	endDate?: string;
}

export class TransactionsServiceV3 {
	/**
	 * Get all wallets for a user with balances
	 */
	static getUserWallets = (userId: string) => {
		return BaseMethods.getRequest(
			transactionsUrlV3.GET_USER_WALLETS(userId),
			true
		);
	};

	/**
	 * Get user's default wallet with balance
	 */
	static getUserDefaultWallet = (userId: string) => {
		return BaseMethods.getRequest(
			transactionsUrlV3.GET_USER_DEFAULT_WALLET(userId),
			true
		);
	};

	/**
	 * Get balance for all user accounts
	 */
	static getUserBalance = (userId: string) => {
		return BaseMethods.getRequest(
			transactionsUrlV3.GET_USER_BALANCE(userId),
			true
		);
	};

	/**
	 * Get user transactions with stats and pagination
	 */
	static getUserTransactions = (
		userId: string,
		filters?: TransactionFilters
	) => {
		const queryParams: Record<string, string> = {};

		if (filters) {
			Object.entries(filters).forEach(([key, value]) => {
				if (value !== undefined && value !== null && value !== "") {
					queryParams[key] = String(value);
				}
			});
		}

		return BaseMethods.getRequest(
			transactionsUrlV3.GET_USER_TRANSACTIONS(userId),
			true,
			queryParams
		);
	};

	/**
	 * Get detailed transaction info with ledger entries
	 */
	static getTransactionDetails = (transactionId: string) => {
		return BaseMethods.getRequest(
			transactionsUrlV3.GET_TRANSACTION_DETAILS(transactionId),
			true
		);
	};

	/**
	 * Get all transactions (admin)
	 */
	static getAllTransactions = (filters?: TransactionFilters & { userId?: string }) => {
		const queryParams: Record<string, string> = {};

		if (filters) {
			Object.entries(filters).forEach(([key, value]) => {
				if (value !== undefined && value !== null && value !== "") {
					queryParams[key] = String(value);
				}
			});
		}

		return BaseMethods.getRequest(
			transactionsUrlV3.GET_ALL_TRANSACTIONS,
			true,
			queryParams
		);
	};

	/**
	 * Adjust wallet balance (admin)
	 * Creates accounting entries to adjust wallet balance to a specific value
	 */
	static adjustWalletBalance = (data: {
		walletId: string;
		newBalance: number;
		reason: string;
		internalReference?: string;
	}) => {
		return BaseMethods.postRequest(
			transactionsUrlV3.ADJUST_WALLET_BALANCE,
			data,
			true
		);
	};

	/**
	 * Create debt for a user (admin)
	 * Creates a DEBT transaction that can be immediately collected if balance is sufficient
	 */
	static createDebt = (data: {
		userId: string;
		amount: number;
		currency?: string;
		reason: string;
		internalReference?: string;
		attemptImmediatePayment?: boolean;
	}) => {
		return BaseMethods.postRequest(
			transactionsUrlV3.CREATE_DEBT,
			data,
			true
		);
	};

	/**
	 * Transfer between user wallets (admin - no fees)
	 * Transfers funds between wallets applying only exchange rate (no fees)
	 */
	static walletTransfer = (data: {
		sourceWalletId: string;
		destinationWalletId: string;
		amount: number;
		reason: string;
		internalReference?: string;
	}) => {
		return BaseMethods.postRequest(
			transactionsUrlV3.WALLET_TRANSFER,
			data,
			true
		);
	};
}
