"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Modal from "@/components/shared/Modal/Modal";
import { ChevronDown, Check, Search } from "lucide-react";
import classNames from "classnames";
import { PaymentProviderServiceV3 } from "@/api/services/v3/Payment_Provider";
import { useQuery } from "react-query";
import toast from "react-hot-toast";
import { HashLoader } from "react-spinners";

// Schéma de validation Zod
const serviceProviderSchema = z.object({
	name: z
		.string()
		.min(2, "Le nom doit contenir au moins 2 caractères")
		.max(50, "Le nom ne peut pas dépasser 50 caractères"),
	description: z
		.string()
		.max(255, "La description ne peut pas dépasser 255 caractères")
		.optional(),
	paymentProviderId: z
		.string()
		.uuid("Veuillez sélectionner un payment provider valide")
		.nonempty("Le payment provider est requis"),
});

type ServiceProviderFormData = z.infer<typeof serviceProviderSchema>;

interface CreateServiceProviderModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: ServiceProviderFormData) => void;
	isLoading: boolean;
}

const handleGetPaymentProviders = async ({ queryKey }: any) => {
	const [_key] = queryKey;

	const response = await PaymentProviderServiceV3.getAll();
	const responseJson = await response.json();

	if (!response.ok) {
		throw new Error(
			responseJson.message || "Failed to fetch Payment Providers"
		);
	}

	return responseJson;
};

const CreateSPModal: React.FC<CreateServiceProviderModalProps> = ({
	isOpen,
	onClose,
	onSubmit,
	isLoading,
}) => {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedProvider, setSelectedProvider] = useState<any>(null);

	const paymentProviderQuery = useQuery({
		queryKey: ["payment-providers"],
		queryFn: handleGetPaymentProviders,
		onError: (err: any) => {
			console.error("Erreur lors du chargement:", err);
			toast.error(err.message);
		},
	});

	const form = useForm<ServiceProviderFormData>({
		resolver: zodResolver(serviceProviderSchema),
		defaultValues: {
			name: "",
			description: "",
			paymentProviderId: "",
		},
	});

	const handleFormSubmit = (data: ServiceProviderFormData) => {
		onSubmit(data);
		form.reset();
		setSelectedProvider(null);
		setSearchQuery("");
	};

	const handleClose = () => {
		form.reset();
		setSelectedProvider(null);
		setSearchQuery("");
		onClose();
	};

	const onError = (errors: any) => {
		console.error("Erreurs de validation:", errors);
	};

	// Données des payment providers
	const paymentProviders = paymentProviderQuery.data?.data || [];

	// Filtrer les providers par recherche
	const filteredProviders = paymentProviders.filter(
		(provider: any) =>
			provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			provider.code.toLowerCase().includes(searchQuery.toLowerCase())
	);

	// Fonction pour sélectionner un provider
	const handleSelectProvider = (provider: any) => {
		setSelectedProvider(provider);
		form.setValue("paymentProviderId", provider.id);
		setIsDropdownOpen(false);
		setSearchQuery("");
	};

	// Formater le nom pour affichage : "Nom (Code)"
	const formatProviderName = (provider: any) => {
		return `${provider.name} (${provider.code})`;
	};

	const modalContent = (
		<div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
			<h3 className="text-lg font-semibold leading-6 text-gray-900 mb-6">
				Créer un nouveau Provider
			</h3>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleFormSubmit, onError)}>
					<div className="space-y-6">
						{/* Champ Nom */}
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-gray-900 text-sm tracking-tight">
										Nom du SP *
									</FormLabel>
									<FormControl>
										<Input
											placeholder="Ex: MTN"
											{...field}
											className="rounded-lg border-gray-300 focus:border-[#18BC7A] focus:ring-[#18BC7A] transition-colors"
										/>
									</FormControl>
									<FormMessage className="text-red-400 text-xs" />
								</FormItem>
							)}
						/>

						{/* Champ Description */}
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-gray-900 text-sm tracking-tight">
										Description
									</FormLabel>
									<FormControl>
										<Input
											placeholder="Ex: Service Cartevo MTN"
											{...field}
											className="rounded-lg border-gray-300 focus:border-[#18BC7A] focus:ring-[#18BC7A] transition-colors"
										/>
									</FormControl>
									<FormMessage className="text-red-400 text-xs" />
								</FormItem>
							)}
						/>

						{/* Custom Select pour Payment Provider */}
						<FormField
							control={form.control}
							name="paymentProviderId"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-gray-900 text-sm tracking-tight">
										Payment Provider *
									</FormLabel>
									<FormControl>
										<div className="relative">
											{paymentProviderQuery.isLoading ? (
												<div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-white">
													<HashLoader
														size={18}
														color="#18BC7A"
													/>
													<span className="text-sm text-gray-500">
														Chargement...
													</span>
												</div>
											) : paymentProviderQuery.isError ? (
												<div className="p-3 border border-red-200 rounded-lg bg-white">
													<p className="text-sm text-red-500">
														Erreur de chargement
													</p>
												</div>
											) : (
												<>
													{/* Bouton principal */}
													<button
														type="button"
														onClick={() =>
															setIsDropdownOpen(
																!isDropdownOpen
															)
														}
														className={`w-full flex items-center justify-between p-3 text-left rounded-lg border bg-white transition-colors ${
															isDropdownOpen
																? "border-gray-900"
																: "border-gray-200 hover:border-gray-300"
														}`}
														disabled={isLoading}
													>
														<span
															className={
																selectedProvider
																	? "text-gray-900"
																	: "text-gray-400"
															}
														>
															{selectedProvider
																? formatProviderName(
																		selectedProvider
																  )
																: "Sélectionnez un provider"}
														</span>
														<ChevronDown
															className={`w-4 h-4 text-gray-400 transition-transform ${
																isDropdownOpen
																	? "rotate-180"
																	: ""
															}`}
														/>
													</button>

													{/* Menu dropdown */}
													{isDropdownOpen && (
														<div className="absolute z-10 w-full mt-1 bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden">
															{/* Recherche */}
															<div className="p-2 border-b border-gray-100">
																<div className="relative">
																	<Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
																	<input
																		type="text"
																		placeholder="Rechercher..."
																		className="w-full pl-9 pr-3 py-2 text-sm border-0 bg-gray-50 rounded focus:outline-none focus:bg-white focus:ring-1 focus:ring-gray-900"
																		value={
																			searchQuery
																		}
																		onChange={(
																			e
																		) =>
																			setSearchQuery(
																				e
																					.target
																					.value
																			)
																		}
																		onClick={(
																			e
																		) =>
																			e.stopPropagation()
																		}
																	/>
																</div>
															</div>

															{/* Liste */}
															<div className="max-h-60 overflow-y-auto p-1">
																{filteredProviders.length >
																0 ? (
																	filteredProviders.map(
																		(
																			provider: any
																		) => (
																			<button
																				type="button"
																				key={
																					provider.id
																				}
																				onClick={() =>
																					handleSelectProvider(
																						provider
																					)
																				}
																				className={`w-full flex items-center justify-between px-3 py-2 rounded hover:bg-gray-50 transition-colors text-left ${
																					selectedProvider?.id ===
																					provider.id
																						? "bg-gray-100"
																						: ""
																				}`}
																			>
																				<span
																					className={
																						selectedProvider?.id ===
																						provider.id
																							? "text-gray-900 font-medium"
																							: "text-gray-700"
																					}
																				>
																					{formatProviderName(
																						provider
																					)}
																				</span>
																				{selectedProvider?.id ===
																					provider.id && (
																					<Check className="w-4 h-4 text-gray-900" />
																				)}
																			</button>
																		)
																	)
																) : (
																	<div className="px-3 py-8 text-center text-sm text-gray-400">
																		Aucun
																		provider
																		trouvé
																	</div>
																)}
															</div>
														</div>
													)}
												</>
											)}
										</div>
									</FormControl>
									<FormMessage className="text-red-400 text-xs" />
								</FormItem>
							)}
						/>
					</div>

					<div className="flex gap-3 justify-end mt-8">
						<button
							type="button"
							onClick={handleClose}
							className="px-6 py-2 border border-gray-500 text-gray-700 bg-transparent rounded-full text-sm hover:bg-gray-50 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
							disabled={isLoading}
						>
							Annuler
						</button>

						<button
							type="submit"
							className="px-6 py-2 bg-[#18BC7A] text-white rounded-full text-sm hover:bg-[#16a56c] transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
							disabled={isLoading}
						>
							{isLoading ? "Création..." : "Créer le provider"}
						</button>
					</div>

					{/* Loader */}
					<div
						className={classNames(
							"transition-all invisible z-20 bg-blue-900/30 opacity-0 absolute top-0 left-0 h-full w-full flex items-center justify-center rounded-lg",
							{
								"!opacity-100 !visible z-20": isLoading,
							}
						)}
					>
						<HashLoader
							className="shrink-0"
							size={40}
							color="#18BC7A"
						/>
					</div>
				</form>
			</Form>
		</div>
	);

	// Fermer le dropdown quand on clique en dehors
	React.useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (!(event.target as Element).closest(".relative")) {
				setIsDropdownOpen(false);
			}
		};

		if (isDropdownOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isDropdownOpen]);

	return (
		<Modal
			isOpen={isOpen}
			setIsOpen={handleClose}
			modalContent={modalContent}
			name="create-service-provider"
		/>
	);
};

export default CreateSPModal;
