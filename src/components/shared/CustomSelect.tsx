import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

interface Option {
	value: string;
	label: string;
}

interface CustomSelectProps {
	options: Option[];
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
	const [isOpen, setIsOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	// Fermer le dropdown quand on clique ailleurs
	useEffect(() => {
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
			{/* Trigger Button */}
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

			{/* Dropdown Menu */}
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

export default CustomSelect;
