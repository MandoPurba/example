"use client";

import React from "react";
import Loading from "../components/Loading";
import { useSession } from "next-auth/react";
import SignInForm from "@/components/auth/SignInForm";
import Panel from "./(panel)/page";
import PanelLayout from "./(panel)/layout";
// import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";

const PageContent: React.FC = () => {
  const { data: session, status } = useSession();

  if (status === "loading") return <Loading />;

  if (session) return <PanelLayout> <Panel /> </PanelLayout>

  return <SignInForm />;
};

export default PageContent;