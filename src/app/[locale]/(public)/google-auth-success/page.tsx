"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { formatApiErrorMessage } from "@/lib/formatApiError";

// Extended session interface for social auth
interface SocialSession {
  user?: {
    name?: string | null;
    email?: string | null;
  };
  socialId?: string;
}

export default function GoogleAuthSuccessPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { socialLogin } = useAuth();
  const hasProcessedRef = useRef<string | null>(null);
  const socialLoginRef = useRef(socialLogin);

  // Keep the ref updated with the latest socialLogin function
  useEffect(() => {
    socialLoginRef.current = socialLogin;
  }, [socialLogin]);

  useEffect(() => {
    const run = async () => {
      // Prevent multiple executions
      if (!session?.user) return;

      const email = session.user.email;
      if (!email) return;

      // Check if we've already processed this email
      if (hasProcessedRef.current === email) return;

      hasProcessedRef.current = email;

      try {
        const socialSession = session as SocialSession;
        const firstName = (socialSession.user?.name || "").split(" ")[0] || "";
        const lastName =
          (socialSession.user?.name || "").split(" ").slice(1).join(" ") || "";
        const socialId = socialSession.socialId || "";
        
        await socialLoginRef.current({
          first_name: firstName,
          last_name: lastName,
          email,
          social_media_id: socialId,
        });
        
        // Get return URL from sessionStorage, default to /profile
        const returnUrl = 
          typeof window !== "undefined" 
            ? sessionStorage.getItem("authReturnUrl")
            : null;
        
        // Clean up sessionStorage after reading
        // if (typeof window !== "undefined") {
        //   sessionStorage.removeItem("authReturnUrl");
        // }

        // Redirect to return URL or default to profile
        const redirectPath = returnUrl || "/profile";
        
        // Use replace instead of push to prevent back navigation to this page
        router.replace(redirectPath);
      } catch (e: unknown) {
        const errorMessage = formatApiErrorMessage(e) || "Social auth failed";
        setError(errorMessage);
        hasProcessedRef.current = null; // Allow retry on error
        router.replace(`/google-auth-error?message=${encodeURIComponent(errorMessage)}`);
      }
    };
    run();
  }, [session?.user?.email, router]);

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  return (
    <main className="padding-top-100">
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div className="loader" aria-label="Loading" role="status" />
        <div style={{ color: "#666", fontSize: "14px" }}>Signing you in…</div>
      </div>
      <style jsx>{`
        .loader {
          width: 44px;
          height: 44px;
          border: 4px solid rgba(0,0,0,0.1);
          border-top-color: #1f6feb;
          border-radius: 50%;
          animation: spin 0.9s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
}
