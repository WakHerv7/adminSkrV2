import React from "react";
import CButton from "@/components/shared/CButton";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@radix-ui/react-label";
import { DropdownMenu } from "@nextui-org/react";
import CustomDropdown from "@/components/shared/CustomDropdown";
import SelectComponent from "@/components/shared/SelectComponent";

const NotificationsDropdown = () => {
	return (
		<div className="w-[356px]">
			<div className="flex justify-between items-center">
				<h1 className="text-base font-bold leading-6">Cible</h1>
				<CButton text="importer un csv" btnStyle="green" />
			</div>
			<p className="text-[10px] text-gray-400 w-full tracking-tight leading-3 ">
				cibler un comportement precis des utilisateurs
			</p>
			<div className="flex items-center">
				<div className="rounded-lg p-1 flex justify-center items-center bg-gray-100 border-none outline-none">
					<Checkbox
						id="Cibler Tous les utilisateurs"
						className="bg-[#33E89C] rounded-full border-none outline-none"
					/>
				</div>
				<Label
					htmlFor="Cibler Tous les utilisateurs"
					className="text-[10px] text-gray-700 leading-[34.5px] ml-3"
				>
					Cibler Tous les utilisateurs
				</Label>
			</div>
			<div className="w-full mt-3 flex flex-col gap-3">
				<Label
					htmlFor="compte sekure"
					className="text-[10px] text-gray-400 leading-3 tracking-wide"
				>
					compte sekure
				</Label>
				<SelectComponent />
			</div>
			<div className="w-full mt-3 flex flex-col gap-3">
				<Label
					htmlFor="compte sekure"
					className="text-[10px] text-gray-400 leading-3 tracking-wide"
				>
					Verificatoin
				</Label>
				<SelectComponent />
			</div>
			<div className="w-full mt-3 flex flex-col gap-3">
				<Label
					htmlFor="compte sekure"
					className="text-[10px] text-gray-400 leading-3 tracking-wide"
				>
					Carte
				</Label>
				<SelectComponent />
			</div>
			<div className="w-full mt-3 flex flex-col gap-3">
				<Label
					htmlFor="compte sekure"
					className="text-[10px] text-gray-400 leading-3 tracking-wide"
				>
					Transferts
				</Label>
				<SelectComponent />
			</div>
		</div>
	);
};

export default NotificationsDropdown;
