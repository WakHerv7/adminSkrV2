import { CardService } from "../services/card";
import { CardsServiceV3 } from "../services/v3/cards";

export const handleGetCards = async ({ queryKey }: any) => {
	const [_key, userId, filters] = queryKey;

	const response = await CardsServiceV3.getCards(userId, { filters });
	const responseJson = await response.json();

	if (!response.ok) {
		throw new Error(responseJson.message || "Failed to fetch cards");
	}

	return responseJson;
};

export const handleGetAllCardsTransations = async ({ queryKey }: any) => {
	const [_key, userId, filters] = queryKey;

	const response = await CardsServiceV3.getAllCardsTransactions(userId, {
		filters,
	});

	const responseJson = await response.json();

	if (!response.ok) {
		throw new Error(
			responseJson.message || "Failed to fetch cards transactions"
		);
	}

	return responseJson;
};

export const handleGetCardDetail = async ({ queryKey }: any) => {
	const [_key, cardId] = queryKey;

	const response = await CardsServiceV3.getCardsDetail(cardId);

	const responseJson = await response.json();

	if (!response.ok) {
		throw new Error(responseJson.message || "Failed to fetch card details");
	}

	return responseJson;
};

export const handleGetCardTransactions = async ({ queryKey }: any) => {
	const [_key, cardId] = queryKey;
	console.log("card id", cardId);

	const response = await CardsServiceV3.getCardTransactions(cardId);

	const responseJson = await response.json();

	if (!response.ok) {
		throw new Error(
			responseJson.message || "Failed to fetch card transaction"
		);
	}

	return responseJson;
};

export const handleFreezeCard = async (cardId: string) => {
	const response = await CardsServiceV3.freezeCard(cardId);

	const responseJson = await response.json();

	if (!response.ok) {
		throw new Error(responseJson.message || "Failed to freeze card");
	}

	return responseJson;
};

export const handleUnFreezeCard = async (cardId: string) => {
	const response = await CardsServiceV3.unfreezeCard(cardId);

	const responseJson = await response.json();

	if (!response.ok) {
		throw new Error(responseJson.message || "Failed to unfreeze card");
	}

	return responseJson;
};

export const handleterminateCard = async (cardId: string) => {
	const response = await CardsServiceV3.terminateCard(cardId);

	const responseJson = await response.json();

	if (!response.ok) {
		throw new Error(responseJson.message || "Failed to terminate card");
	}

	return responseJson;
};
