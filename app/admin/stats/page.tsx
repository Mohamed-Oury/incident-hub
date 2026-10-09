"use client";

import { useState, useEffect } from "react";
import { BarChart3, Save, RefreshCw, CheckCircle2 } from "lucide-react";

interface StatsData {
  id?: string;
  totalViews: number;
  yearsExperience: number;
  customStat1Label?: string | null;
  customStat1Value?: number | null;
  customStat2Label?: string | null;
  customStat2Value?: number | null;
}

export default function AdminStatsPage() {
  const [stats, setStats] = useState<StatsData>({
    totalViews: 15000,
    yearsExperience: 5,
    customStat1Label: "Missions CBS",
    customStat1Value: 12,
    customStat2Label: "Incidents Monétiques Capitalisés",
    customStat2Value: 1000,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Erreur lors de la récupération des statistiques:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/stats", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stats),
      });

      if (res.ok) {
        const updated = await res.json();
        setStats(updated);
        setMessage({ type: "success", text: "Statistiques enregistrées avec succès !" });
      } else {
        setMessage({ type: "error", text: "Erreur lors de la sauvegarde." });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Erreur serveur." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-gray-500 font-semibold">Chargement des statistiques...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Statistiques du Site</h1>
          <p className="text-gray-600 text-sm mt-1">
            Gérez les chiffres clés affichés sur la page d&apos;accueil du Portfolio.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center px-6 py-3 bg-[#7d1538] hover:bg-[#a01e4a] text-white font-bold rounded-full shadow-md transition-all text-sm cursor-pointer border-0"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Sauvegarde..." : "Sauvegarder"}
        </button>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl flex items-center ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          <CheckCircle2 className="w-5 h-5 mr-2 flex-shrink-0" />
          <span className="text-sm font-semibold">{message.text}</span>
        </div>
      )}

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center pb-3 border-b border-gray-100">
          <BarChart3 className="w-5 h-5 mr-2 text-[#7d1538]" />
          Statistiques Principales
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Nombre total de Lecteurs / Vues</label>
            <input
              type="number"
              value={stats.totalViews}
              onChange={(e) => setStats({ ...stats, totalViews: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-[#7d1538] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Années d&apos;expérience</label>
            <input
              type="number"
              value={stats.yearsExperience}
              onChange={(e) => setStats({ ...stats, yearsExperience: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-[#7d1538] outline-none"
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-gray-900 pb-3 border-b border-gray-100">
          Statistiques Personnalisées
        </h2>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Libellé Statistique 1</label>
              <input
                type="text"
                value={stats.customStat1Label || ""}
                onChange={(e) => setStats({ ...stats, customStat1Label: e.target.value })}
                placeholder="Ex: Missions CBS"
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Valeur Statistique 1</label>
              <input
                type="number"
                value={stats.customStat1Value || 0}
                onChange={(e) => setStats({ ...stats, customStat1Value: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Libellé Statistique 2</label>
              <input
                type="text"
                value={stats.customStat2Label || ""}
                onChange={(e) => setStats({ ...stats, customStat2Label: e.target.value })}
                placeholder="Ex: Incidents Capitalisés"
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Valeur Statistique 2</label>
              <input
                type="number"
                value={stats.customStat2Value || 0}
                onChange={(e) => setStats({ ...stats, customStat2Value: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
