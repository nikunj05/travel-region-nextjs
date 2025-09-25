"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "@/i18/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function FacebookAuthSuccessPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { socialLogin } = useAuth();

  useEffect(() => {
    const run = async () => {
      if (!session?.user) return;
      try {
        const firstName = (session.user.name || "").split(" ")[0] || "";
        const lastName =
          (session.user.name || "").split(" ").slice(1).join(" ") || "";
        const email = session.user.email || "";
        const socialId = (session as any).socialId || "";
        await socialLogin({
          first_name: firstName,
          last_name: lastName,
          email,
          social_media_id: socialId,
        });
        router.push("/profile");
      } catch (e: any) {
        const msg = e?.response?.data?.message || e?.message || "Social auth failed";
        setError(msg);
        router.replace(`/facebook-auth-error?message=${encodeURIComponent(msg)}`);
      }
    };
    run();
  }, [session, router]);

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


