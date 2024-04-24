
import { useQuery } from "react-query";
import { axiosOpenedInstance } from "@/utils/axios";
import Category, { ICategory } from "@/components/cards/Category";

export default function getAllCategories() {
    const categoriesView = useQuery({
		queryKey: ["categories"],
		queryFn: async () => {
			const res = await axiosOpenedInstance.get("/categories");
			return res.data.categories as ICategory[];
		},
	});
  return categoriesView
}