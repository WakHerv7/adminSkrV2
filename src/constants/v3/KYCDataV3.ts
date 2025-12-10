import { ITableHeader } from "@/components/AdminTable/Table";

export const headerKYCDataV3: ITableHeader = {
	serial: "S/N",
	name: "Nom",
	email: "Email",
	phone: "Numero",
	// country: "Pays",
	status: "KycStatut",
	date: "Date de création",
	action: "",
};

export const headerCountriesDataV3: ITableHeader = {
	serial: "S/N",
	name: "Nom",
	flag: "flag",
	currency: "Currency",
	dialCode: "Dial code",
	code: "Code",
	codeIso3: "Code ISO3",
	phoneLength: "Phone Length",
	actions: "",
};

export const headerSpDataV3: ITableHeader = {
	serial: "S/N",
	name: "Name",
	logo: "Logo",
	description: "Description",
	paymentProvider: "Payment Provider",
	createdAt: "Created At",
	actions: "",
};

export const headerPaymentProviderV3: ITableHeader = {
	serial: "S/N",
	name: "Nom",
	code: "Code",
	logo: "Logo",
	isActive: "Statut",
	createdAt: "Créé le",
	actions: "",
};

export const cspHeaderDataV3: ITableHeader = {
	serial: "S/N",
	operator: "Opérateur",
	service: "Service",
	feesRate: "Taux (%)",
	fees: "Frais Fixes",
	minAmount: "Montant Min",
	maxAmount: "Montant Max",
	currency: "Devise",
	isActive: "Statut",
	createdAt: "Créé le",
	actions: "",
};

export const serviceHeaderDataV3: ITableHeader = {
	serial: "S/N",
	name: "Name",
	sens: "Sens",
	description: "Description",
	createdAt: "Créé le",
	actions: "",
};
