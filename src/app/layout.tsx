// "use client";
import React from "react";
import "./globals.css";
import { NextUIProvider } from "@nextui-org/react";
// import { useRouter } from "next/navigation";
import Header from "@/components/containers/header";
import Footer from "@/components/containers/footer";
import { QueryClient, QueryClientProvider } from "react-query";
import { Toaster } from "react-hot-toast";
// import Wrapper from "@/context/ApplicationContext";
import Search from "@/components/Search";
import type { Metadata } from "next";
import Head from 'next/head';


export const metadata: Metadata = {
	title: "Sekure admin",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	// const router = useRouter();
	// const queryClient = new QueryClient();

	return (
		<html lang="en" className={""}>
			{/* <link rel="icon" href="/favicon.ico" type="image/ico" sizes="32x32" /> */}
			{/* <QueryClientProvider client={queryClient}> */}
				{/* <Wrapper> */}
					<body className="">
						{/* <NextUIProvider navigate={router.push}> */}
							{/* <Header /> */}
							{children}
							{/* <Footer /> */}
							<Toaster position="top-right" />
							{/* <Search /> */}
						{/* </NextUIProvider> */}
					</body>
				{/* </Wrapper> */}
			{/* </QueryClientProvider> */}
		</html>
	);
}
