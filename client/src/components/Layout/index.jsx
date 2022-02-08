import Header from "./Header";
import Head from "next/head";
import Sidebar from "./Sidebar";
import { useState } from "react";
export default function Layout(props) {
  const [isSidebar, setIsSidebar] = useState(false);
  const links = [
    { title: "Current Stats", to: "/" },
    { title: "Claim OCT", to: "/claim" },
    { title: "Staking Soon", to: "#" },
    { title: "Farming Soon", to: "#" },
    { title: "Reflinks", to: "/reflinks" },
    { title: "FAQs", to: "/faqs" },
  ];
  return (
    <>
      <Head>
        <title>{props.title}</title>
      </Head>
      <Sidebar
        sidebarData={{
          isSidebar,
          setIsSidebar,
        }}
        links={links}
      />
      <Header
        sidebarData={{
          isSidebar,
          setIsSidebar,
        }}
        links={links}
      />
      {props.children}
    </>
  );
}
