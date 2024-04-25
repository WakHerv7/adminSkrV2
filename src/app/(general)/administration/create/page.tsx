import AdminForm from "./components/AdminForm";
import Layout from "@/components/shared/Layout";

type Params = {
    params: {
        adminId: string
    }
}

export default async function AdminEdit({params: { adminId }}: Params) {
	// useTitle("Sekure | Admin");
	// useEffect(() => {
	// 	toast(<div>press <Kbd keys={["command"]}>K</Kbd> at anytime to make a search</div>)
	// }, []);
	// const categoriesView = useQuery({
	// 	queryKey: ["categories"],
	// 	queryFn: async () => {
	// 		const res = await axiosOpenedInstance.get("/categories");
	// 		return res.data.categories as ICategory[];
	// 	},
	// });

	return (
		<Layout
		title={"Ajouter un administrateur"}
		>
			<>
            <section className="py-3">
                <h1 className="text-lg font-bold">Informations de l'administrateur </h1>
                <p className="text-sm text-gray-600">Informations de l'administrateur</p>
                <div className="flex justify-between gap-6 my-6">
                    <AdminForm data={{title: 'hello world', detail: 'checking for details'}} />
                </div>
                {/* <div>
                    <h1 className="text-lg font-bold font-serif">Recent activities</h1>
                    <p className="text-sm font-thin text-gray-600">List of transactions performed</p>
                    <AdminDetails data={{title: 'hello world', detail: 'checking for details'}} />
                </div> */}
            </section>
            </>
	  </Layout>
	);
}
