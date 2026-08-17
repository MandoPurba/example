"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import Loading from "../components/Loading";
import PageContent from "./PageContent";

interface PageProps {
  params: Promise<{ [key: string]: any }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const Page: React.FC<PageProps> = ({ params, searchParams }) => {
  const [resolvedParams, setResolvedParams] = useState<any | null>(null);
  const [resolvedSearchParams, setResolvedSearchParams] = useState<any | null>(
    null
  );

  useEffect(() => {
    const resolveParams = async () => {
      try {
        setResolvedParams(await params);
        setResolvedSearchParams(await searchParams);
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error("Error resolving params:", error);
        }
        setResolvedParams({});
        setResolvedSearchParams({});
      }
    };

    resolveParams();
  }, [params, searchParams]);

  const isLoading = useMemo(
    () => !resolvedParams || !resolvedSearchParams,
    [resolvedParams, resolvedSearchParams]
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Suspense fallback={<Loading />}>
      <PageContent />
    </Suspense>
  );
};

export default Page;