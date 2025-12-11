import BaseMethods from "@/api/baseMethods";
import { cardsUrlV3 } from "@/api/urlsV3";
import { string } from "zod";

export class CardsServiceV3 {
	static getCards = (
		userId: string,
		params?: { filters?: Record<string, any> }
	) => {
		const filters = params?.filters ?? {};

		const query_params: Record<string, string> = {};
		Object.entries(filters).forEach(([key, value]) => {
			if (value !== undefined && value !== null && value !== "") {
				query_params[key] = String(value);
			}
		});

		return BaseMethods.getRequest(
			cardsUrlV3.GET_CARDS(userId),
			true,
			query_params
		);
	};

	static getCardsDetail = (cardId: string) => {
		return BaseMethods.getRequest(
			cardsUrlV3.GET_CARDS_DETAILS(cardId),
			true
		);
	};

	static getAllCardsTransactions = (
		userId: string,
		params?: { filters?: Record<string, any> }
	) => {
		const filters = params?.filters ?? {};

		const query_params: Record<string, string> = {};
		Object.entries(filters).forEach(([key, value]) => {
			if (value !== undefined && value !== null && value !== "") {
				query_params[key] = String(value);
			}
		});

		return BaseMethods.getRequest(
			cardsUrlV3.ALL_CARDS_TRANSACTION(userId),
			true,
			query_params
		);
	};

	static getCardTransactions = (cardId: string) => {
		console.log("dans le service", cardId);
		return BaseMethods.getRequest(
			cardsUrlV3.CARD_TRANSACTION(cardId),
			true
		);
	};

	static terminateCard = (cardId: string) => {
		return BaseMethods.postRequest(
			cardsUrlV3.TERMINATE_CARD(cardId),
			{},
			true
		);
	};

	static freezeCard = (cardId: string) => {
		return BaseMethods.postRequest(
			cardsUrlV3.FREEZE_CARD(cardId),
			{},
			true
		);
	};

	static unfreezeCard = (cardId: string) => {
		return BaseMethods.postRequest(
			cardsUrlV3.UNFREEZE_CARD(cardId),
			{},
			true
		);
	};
}
