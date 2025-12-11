import { TransactionsServiceV3, TransactionFilters } from "../services/v3/transactions";

export const handleGetUserWallets = async ({ queryKey }: any) => {
	const [_key, userId] = queryKey;
	const response = await TransactionsServiceV3.getUserWallets(userId);
	const responseJson = await response.json();

	if (!response.ok) {
		throw new Error(responseJson.message || "Failed to fetch user wallets");
	}

	return responseJson;
};

export const handleGetUserDefaultWallet = async ({ queryKey }: any) => {
	const [_key, userId] = queryKey;
	const response = await TransactionsServiceV3.getUserDefaultWallet(userId);
	const responseJson = await response.json();

	if (!response.ok) {
		throw new Error(
			responseJson.message || "Failed to fetch user default wallet"
		);
	}

	return responseJson;
};

export const handleGetUserBalance = async ({ queryKey }: any) => {
	const [_key, userId] = queryKey;
	const response = await TransactionsServiceV3.getUserBalance(userId);
	const responseJson = await response.json();

	if (!response.ok) {
		throw new Error(responseJson.message || "Failed to fetch user balance");
	}

	return responseJson;
};

export const handleGetUserTransactions = async ({ queryKey }: any) => {
	const [_key, userId, filters] = queryKey;
	const response = await TransactionsServiceV3.getUserTransactions(
		userId,
		filters as TransactionFilters
	);
	const responseJson = await response.json();

	if (!response.ok) {
		throw new Error(
			responseJson.message || "Failed to fetch user transactions"
		);
	}

	return responseJson;
};

export const handleGetTransactionDetails = async ({ queryKey }: any) => {
	const [_key, transactionId] = queryKey;
	const response =
		await TransactionsServiceV3.getTransactionDetails(transactionId);
	const responseJson = await response.json();

	if (!response.ok) {
		throw new Error(
			responseJson.message || "Failed to fetch transaction details"
		);
	}

	return responseJson;
};

export const handleGetAllTransactions = async ({ queryKey }: any) => {
	const [_key, filters] = queryKey;
	const response = await TransactionsServiceV3.getAllTransactions(filters);
	const responseJson = await response.json();

	if (!response.ok) {
		throw new Error(responseJson.message || "Failed to fetch transactions");
	}

	return responseJson;
};

export const handleAdjustWalletBalance = async (data: {
	walletId: string;
	newBalance: number;
	reason: string;
	internalReference?: string;
}) => {
	const response = await TransactionsServiceV3.adjustWalletBalance(data);
	const responseJson = await response.json();

	if (!response.ok) {
		throw new Error(responseJson.message || "Failed to adjust wallet balance");
	}

	return responseJson;
};

export const handleCreateDebt = async (data: {
	userId: string;
	amount: number;
	currency?: string;
	reason: string;
	internalReference?: string;
	attemptImmediatePayment?: boolean;
}) => {
	const response = await TransactionsServiceV3.createDebt(data);
	const responseJson = await response.json();

	if (!response.ok) {
		throw new Error(responseJson.message || "Failed to create debt");
	}

	return responseJson;
};
