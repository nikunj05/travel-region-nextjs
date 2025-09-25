"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function FacebookAuthErrorPage() {
  const params = useSearchParams();
  const error = params.get("error");
  const message = params.get("message");

  return (
    <main className="padding-top-100">
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "12px",
          textAlign: "center",
          padding: "0 16px",
        }}
      >
        <h2 style={{ margin: 0 }}>Facebook sign-in failed</h2>
        <p style={{ color: "#666", maxWidth: 520 }}>
          {message || "Something went wrong while signing you in with Facebook."}
        </p>
        {error && (
          <code style={{ background: "#f3f4f6", padding: "6px 8px", borderRadius: 6 }}>
            {error}
          </code>
        )}
        <Link href="/login" style={{ marginTop: 8 }} className="button-primary">
          Back to login
        </Link>
      </div>
    </main>
  );
}


