import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f172a", color: "#fff", flexDirection: "column", gap: "1rem" }}>
      <h1 style={{ fontSize: "3rem", fontWeight: 900, color: "#34d399", margin: 0 }}>404</h1>
      <p style={{ fontSize: "1.1rem", color: "#94a3b8" }}>Page introuvable dans le Payway Incident Hub</p>
      <Link href="/" style={{ background: "#059669", color: "#fff", padding: "0.6rem 1.2rem", borderRadius: "8px", textDecoration: "none", fontWeight: 700 }}>
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
