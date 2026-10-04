'use client';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Une erreur s'est produite</h2>
      <p>{error?.message || "Erreur inconnue"}</p>
      <button onClick={() => reset()} style={{ padding: "0.5rem 1rem", marginTop: "1rem" }}>
        Réessayer
      </button>
    </div>
  );
}
