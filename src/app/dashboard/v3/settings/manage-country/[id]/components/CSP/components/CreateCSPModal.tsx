"use client";

import React, { useEffect } from "react";
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
import { HashLoader } from "react-spinners";
import classNames from "classnames";
import { useQuery } from "react-query";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";
import { handleGetPaymentProviders } from "@/api/handlers/PaymentProvider.handlers";
import { handleGetServiceProvider } from "@/api/handlers/serviceProvider.handle";
import { ChevronDown, Check } from "lucide-react";
import { handleGetService } from "@/api/handlers/service.handler";

interface CreateCSPModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: FormData) => Promise<void> | void;
	isLoading: boolean;
	initialData?: any;
	isEdit?: boolean;
}

// Schéma de validation Zod pour CSP
const createServiceProviderSchema = z.object({
	countryId: z.string().uuid(),
	serviceId: z.string().uuid("Veuillez sélectionner un service"),
	providerId: z.string().uuid("Veuillez sélectionner un fournisseur"),
	feesRate: z.coerce
		.number()
		.min(0, "Le taux doit être positif")
		.max(100, "Le taux ne peut pas dépasser 100%"),
	configuration: z.object({
		minAmount: z.coerce
			.number()
			.min(0, "Le montant minimum doit être positif"),
		maxAmount: z.coerce
			.number()
			.min(0, "Le montant maximum doit être positif"),
		currency: z.string().length(3, "La devise doit avoir 3 caractères"),
	}),
	serviceProviderFeeRate: z.coerce
		.number()
		.min(0, "Le taux doit être positif")
		.max(100, "Le taux ne peut pas dépasser 100%"),
	regex: z.string().optional().nullable(),
	initialNumberFormat: z
		.string()
		.min(1, "Au moins un format requis")
		.transform((val) =>
			(typeof val === "string" ? val : "")
				.split(",")
				.map((v) => v.trim())
				.filter((v) => v)
		),
	isActive: z.boolean(),
	operator: z.string().min(1, "L'opérateur est requis").max(10),
});

type FormData = z.infer<typeof createServiceProviderSchema>;

// Composant CustomSelect intégré
interface CustomSelectProps {
	options: { value: string; label: string }[];
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	disabled?: boolean;
	error?: boolean;
	isLoading?: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
	options,
	value,
	onChange,
	placeholder = "Sélectionnez une option",
	disabled = false,
	error = false,
	isLoading = false,
}) => {
	const [isOpen, setIsOpen] = React.useState(false);
	const containerRef = React.useRef<HTMLDivElement>(null);

	React.useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const selectedOption = options.find((opt) => opt.value === value);

	const handleSelect = (optionValue: string) => {
		onChange(optionValue);
		setIsOpen(false);
	};

	return (
		<div className="relative w-full" ref={containerRef}>
			<button
				type="button"
				onClick={() => !disabled && setIsOpen(!isOpen)}
				disabled={disabled || isLoading}
				className={`flex h-11 w-full items-center justify-between rounded-lg bg-white px-4 py-2 text-sm shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:shadow-md hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 ${
					error ? "ring-2 ring-red-500/30 shadow-red-100" : ""
				}`}
			>
				<span
					className={
						selectedOption ? "text-gray-900" : "text-gray-500"
					}
				>
					{isLoading
						? "Chargement..."
						: selectedOption
						? selectedOption.label
						: placeholder}
				</span>
				<ChevronDown
					className={`h-4 w-4 text-gray-600 transition-transform duration-200 ${
						isOpen ? "rotate-180" : ""
					}`}
				/>
			</button>

			{isOpen && !disabled && !isLoading && (
				<div className="absolute z-[1000] w-full mt-2 rounded-xl bg-white shadow-lg border-0 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
					<div className="max-h-[300px] overflow-y-auto p-1">
						{options.length === 0 ? (
							<div className="px-4 py-3 text-sm text-gray-500 text-center">
								Aucune option disponible
							</div>
						) : (
							options.map((option) => (
								<button
									key={option.value}
									type="button"
									onClick={() => handleSelect(option.value)}
									className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left rounded-lg transition-all duration-150 ${
										value === option.value
											? "bg-blue-50 text-blue-700 font-medium"
											: "text-gray-700 hover:bg-gray-50"
									}`}
								>
									<span>{option.label}</span>
									{value === option.value && (
										<Check className="h-4 w-4 text-blue-700" />
									)}
								</button>
							))
						)}
					</div>
				</div>
			)}
		</div>
	);
};

const CreateCSPModal: React.FC<CreateCSPModalProps> = ({
	isOpen,
	onClose,
	onSubmit,
	isLoading: parentLoading,
	initialData,
	isEdit = false,
}) => {
	const params = useParams();

	const id = Array.isArray(params.id) ? params.id[0] : params.id;

	// Queries pour les données
	const paymentProviderQuery = useQuery({
		queryKey: ["payment-providers", { active: true }],
		queryFn: handleGetPaymentProviders,
		onError: (err: any) => {
			toast.error(err.message);
		},
	});

	const serviceProviderQuery = useQuery({
		queryKey: ["service-provider"],
		queryFn: handleGetServiceProvider,
		onError: (err: any) => {
			toast.error(err.message);
		},
	});

	const serviceQuery = useQuery({
		queryKey: ["service", { active: true }],
		queryFn: handleGetService,
		onError: (err: any) => {
			toast.error(err.message);
		},
	});

	// Form hook
	const form = useForm<FormData>({
		resolver: zodResolver(createServiceProviderSchema),
		defaultValues: {
			countryId: id,
			serviceId: "",
			providerId: "",
			feesRate: 0,
			configuration: {
				minAmount: 0,
				maxAmount: 1000,
				currency: "XAF",
			},
			serviceProviderFeeRate: 0,
			regex: "",
			initialNumberFormat: ["699"],
			isActive: true,
			operator: "",
		},
	});

	// Mettre à jour le formulaire quand initialData change
	useEffect(() => {
		if (isEdit && initialData) {
			const initialFormat = Array.isArray(initialData.initialNumberFormat)
				? initialData.initialNumberFormat.join(", ")
				: initialData.initialNumberFormat || "699";

			form.reset({
				countryId: initialData.countryId || id,
				serviceId: initialData.serviceId || "",
				providerId: initialData.providerId || "",
				feesRate: initialData.feesRate || 0,
				configuration: {
					minAmount: initialData.configuration?.minAmount || 0,
					maxAmount: initialData.configuration?.maxAmount || 1000,
					currency: initialData.configuration?.currency || "XAF",
				},
				serviceProviderFeeRate: initialData.serviceProviderFeeRate || 0,
				regex: initialData.regex || "",
				initialNumberFormat: initialFormat,
				isActive: initialData.isActive ?? true,
				operator: initialData.operator || "",
			});
		} else {
			form.reset({
				countryId: id,
				serviceId: "",
				providerId: "",
				feesRate: 0,
				configuration: {
					minAmount: 0,
					maxAmount: 1000,
					currency: "XAF",
				},
				serviceProviderFeeRate: 0,
				regex: "",
				initialNumberFormat: ["699"],
				isActive: true,
				operator: "",
			});
		}
	}, [isEdit, initialData, form, id]);

	const handleFormSubmit = (data: FormData) => {
		console.log("Données soumises:", data);

		// Nettoyer les données avant soumission
		const submitData = {
			...data,
			operator: data.operator.trim(),
			regex: data.regex?.trim() || null,
			configuration: {
				...data.configuration,
				currency: data.configuration.currency.trim().toUpperCase(),
			},
			// Assurer que initialNumberFormat est un tableau
			initialNumberFormat: Array.isArray(data.initialNumberFormat)
				? data.initialNumberFormat
				: (typeof data.initialNumberFormat === "string"
						? data.initialNumberFormat
						: ""
				  )
						.split(",")
						.map((v) => v.trim())
						.filter((v) => v),
		};

		onSubmit(submitData);
	};

	const handleClose = () => {
		form.reset();
		onClose();
	};

	const onError = (errors: any) => {
		console.error("Erreurs de validation:", errors);
	};

	// Préparer les options pour les selects
	const serviceOptions =
		serviceQuery.data?.data?.map((service: any) => ({
			value: service.id,
			label: service.name,
		})) || [];

	const providerOptions =
		serviceProviderQuery.data?.data?.map((provider: any) => ({
			value: provider.id,
			label: provider.name,
		})) || [];

	const isLoading =
		parentLoading ||
		paymentProviderQuery.isLoading ||
		serviceProviderQuery.isLoading ||
		serviceQuery.isLoading;

	const modalContent = (
		<div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
			<h3 className="text-lg font-semibold leading-6 text-gray-900 mb-6">
				{isEdit ? "Modifier le CSP" : "Créer un nouveau CSP"}
			</h3>

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(handleFormSubmit, onError)}
					className="space-y-6"
				>
					{/* Champ Opérateur */}
					<FormField
						control={form.control}
						name="operator"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-gray-900 text-sm tracking-tight">
									Opérateur *
								</FormLabel>
								<FormControl>
									<Input
										placeholder="Ex: ORANGE"
										{...field}
										disabled={isLoading}
									/>
								</FormControl>
								<FormMessage className="text-red-400 text-xs" />
							</FormItem>
						)}
					/>

					{/* Champ Service Provider */}
					<FormField
						control={form.control}
						name="serviceId"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-gray-900 text-sm tracking-tight">
									Service *
								</FormLabel>
								<FormControl>
									<CustomSelect
										options={serviceOptions}
										value={field.value}
										onChange={field.onChange}
										placeholder="Sélectionnez un service"
										disabled={isLoading}
										isLoading={serviceQuery.isLoading}
										error={
											!!form.formState.errors.serviceId
										}
									/>
								</FormControl>
								<FormMessage className="text-red-400 text-xs" />
							</FormItem>
						)}
					/>

					{/* Champ Payment Provider */}
					<FormField
						control={form.control}
						name="providerId"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-gray-900 text-sm tracking-tight">
									Provider *
								</FormLabel>
								<FormControl>
									<CustomSelect
										options={providerOptions}
										value={field.value}
										onChange={field.onChange}
										placeholder="Sélectionnez un fournisseur"
										disabled={isLoading}
										isLoading={
											paymentProviderQuery.isLoading
										}
										error={
											!!form.formState.errors.providerId
										}
									/>
								</FormControl>
								<FormMessage className="text-red-400 text-xs" />
							</FormItem>
						)}
					/>

					{/* Taux de frais et Taux du fournisseur */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* Taux de frais */}
						<FormField
							control={form.control}
							name="feesRate"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-gray-900 text-sm tracking-tight">
										Taux de frais (%) *
									</FormLabel>
									<FormControl>
										<Input
											type="number"
											step="0.01"
											min="0"
											max="100"
											placeholder="Ex: 2.5"
											{...field}
											disabled={isLoading}
										/>
									</FormControl>
									<FormMessage className="text-red-400 text-xs" />
								</FormItem>
							)}
						/>

						{/* Taux frais fournisseur */}
						<FormField
							control={form.control}
							name="serviceProviderFeeRate"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-gray-900 text-sm tracking-tight">
										Taux frais fournisseur (%)
									</FormLabel>
									<FormControl>
										<Input
											type="number"
											step="0.01"
											min="0"
											max="100"
											placeholder="Ex: 1.5"
											{...field}
											disabled={isLoading}
										/>
									</FormControl>
									<FormMessage className="text-red-400 text-xs" />
								</FormItem>
							)}
						/>
					</div>

					{/* Section Configuration */}
					<div className="space-y-4 border border-gray-200 p-4 rounded-lg">
						<h4 className="font-semibold text-lg text-gray-900">
							Configuration
						</h4>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							{/* Montant minimum */}
							<FormField
								control={form.control}
								name="configuration.minAmount"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-900 text-sm tracking-tight">
											Montant minimum *
										</FormLabel>
										<FormControl>
											<Input
												type="number"
												step="0.01"
												min="0"
												placeholder="Ex: 100"
												{...field}
												disabled={isLoading}
											/>
										</FormControl>
										<FormMessage className="text-red-400 text-xs" />
									</FormItem>
								)}
							/>

							{/* Montant maximum */}
							<FormField
								control={form.control}
								name="configuration.maxAmount"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-900 text-sm tracking-tight">
											Montant maximum *
										</FormLabel>
										<FormControl>
											<Input
												type="number"
												step="0.01"
												min="0"
												placeholder="Ex: 1000000"
												{...field}
												disabled={isLoading}
											/>
										</FormControl>
										<FormMessage className="text-red-400 text-xs" />
									</FormItem>
								)}
							/>

							{/* Devise */}
							<FormField
								control={form.control}
								name="configuration.currency"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-900 text-sm tracking-tight">
											Devise *
										</FormLabel>
										<FormControl>
											<Input
												placeholder="Ex: XAF"
												maxLength={3}
												{...field}
												disabled={isLoading}
											/>
										</FormControl>
										<FormMessage className="text-red-400 text-xs" />
									</FormItem>
								)}
							/>
						</div>
					</div>

					{/* Regex */}
					<FormField
						control={form.control}
						name="regex"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-gray-900 text-sm tracking-tight">
									Regex (optionnel)
								</FormLabel>
								<FormControl>
									<Input
										placeholder="Ex: ^[0-9]{9}$"
										{...field}
										value={field.value || ""}
										disabled={isLoading}
									/>
								</FormControl>
								<FormMessage className="text-red-400 text-xs" />
							</FormItem>
						)}
					/>

					{/* Initial Number Format */}
					<FormField
						control={form.control}
						name="initialNumberFormat"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-gray-900 text-sm tracking-tight">
									Format initial du numéro *
								</FormLabel>
								<FormControl>
									<Input
										placeholder="Ex: 699, 698, 657 (séparés par des virgules)"
										{...field}
										disabled={isLoading}
									/>
								</FormControl>
								<FormMessage className="text-red-400 text-xs" />
								<p className="text-xs text-gray-500 mt-1">
									Entrez les préfixes séparés par des virgules
									(Ex: 699, 698, 657)
								</p>
							</FormItem>
						)}
					/>

					{/* Champ isActive */}
					<FormField
						control={form.control}
						name="isActive"
						render={({ field }) => (
							<FormItem className="flex items-center space-x-3">
								<FormControl>
									<input
										type="checkbox"
										className="w-4 h-4 text-[#18bc7a] border-gray-300 rounded focus:ring-[#18bc7a] accent-[#18bc7a]"
										checked={field.value}
										onChange={field.onChange}
										disabled={isLoading}
									/>
								</FormControl>
								<FormLabel className="text-gray-900 text-sm tracking-tight !mt-0">
									CSP actif
								</FormLabel>
							</FormItem>
						)}
					/>

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
							className="px-6 py-2 bg-[#18bc7a] text-white rounded-full text-sm hover:bg-[#16a56c] transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
							disabled={isLoading}
						>
							{isLoading
								? isEdit
									? "Mise à jour..."
									: "Création..."
								: isEdit
								? "Mettre à jour"
								: "Créer le CSP"}
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
							color="#18bc7a"
						/>
					</div>
				</form>
			</Form>
		</div>
	);

	return (
		<Modal
			isOpen={isOpen}
			setIsOpen={handleClose}
			modalContent={modalContent}
			name="create-csp"
		/>
	);
};

export default CreateCSPModal;
