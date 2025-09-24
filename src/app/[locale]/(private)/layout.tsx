"use client";

import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "@/i18/navigation";
import { useEffect, ReactNode } from "react";

const PrivateLayout = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, token, isInitialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if auth is initialized and user is not authenticated
    if (isInitialized && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isInitialized, router]);

  // Show loading while auth is initializing
  if (!isInitialized) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "1.2rem",
        }}
      >
        Loading...
      </div>
    );
  }

  // If not authenticated after initialization, don't render children
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};

export default PrivateLayout;
