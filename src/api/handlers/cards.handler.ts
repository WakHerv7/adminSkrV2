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
