import { notFound } from "next/navigation";
import { root } from "postcss";
import { string } from "zod";

export type URLType = { [key: string]: string };

export const rootUrl = "/";
export const dashboardRootUrlV3 = "/dashboard/v3";

const URLConfigV3 = {
	root: rootUrl,
	notFound: "/not-found",
	dashboard: dashboardRootUrlV3,

	dashboardHome: {
		...dashboardHome(),
	},
	kyc: {
		...kyc(),
	},
	usersAccounts: {
		...usersAccounts(),
	},
};

export default URLConfigV3;

function dashboardHome(prefix: string = "") {
	const PATH = `${dashboardRootUrlV3}/home`;
	return {
		root: PATH,
		manage: `${PATH}/manage`,
	};
}

function kyc(prefix: string = "") {
	const PATH = `${dashboardRootUrlV3}/kyc`;

	return {
		root: PATH,
		manage: `${PATH}/manage`,
	};
}

function usersAccounts(orefix: string = "") {
	const PATH = `${dashboardRootUrlV3}/users_accounts`;
	return {
		root: PATH,
		manage: `${PATH}/manage`,
	};
}
