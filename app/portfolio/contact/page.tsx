"use client";

import { PortfolioHeader } from "@/modules/portfolio/components/layout/PortfolioHeader";
import { PortfolioFooter } from "@/modules/portfolio/components/layout/PortfolioFooter";
import { useState } from "react";
import { Mail, Send, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", content: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/portfolio/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur lors de l'envoi");
      }

      setSuccess(true);
      setFormData({ name: "", email: "", subject: "", content: "" });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur est survenue.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white text-gray-900 min-h-screen font-sans">
      <PortfolioHeader />

      <main className="py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#7d1538]/10 text-[#7d1538] text-xs sm:text-sm font-semibold mb-4">
              <Mail className="w-4 h-4 mr-2" />
              Prenons Contact
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight">
              Discutons de votre <span className="text-[#7d1538]">Projet</span>
            </h1>
            <p className="text-lg text-gray-600 mt-4 leading-relaxed">
              Vous avez un projet bancaire, une question technique ou une opportunité de collaboration ? Envoyez-moi un message.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {/* Infos de contact */}
            <div className="space-y-6">
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm flex items-start space-x-4">
                <div className="w-12 h-12 bg-[#7d1538]/10 rounded-xl flex items-center justify-center text-[#7d1538] shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Email</h3>
                  <a href="mailto:ourykohkoun@gmail.com" className="text-sm text-[#7d1538] font-semibold text-decoration-none hover:underline">
                    ourykohkoun@gmail.com
                  </a>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm flex items-start space-x-4">
                <div className="w-12 h-12 bg-[#7d1538]/10 rounded-xl flex items-center justify-center text-[#7d1538] shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Localisation</h3>
                  <p className="text-sm text-gray-600 font-medium">Abidjan, Côte d&apos;Ivoire</p>
                </div>
              </div>
            </div>

            {/* Formulaire */}
            <div className="lg:col-span-2 bg-gray-50 border border-gray-200 rounded-3xl p-8 shadow-sm">
              {success && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-sm font-semibold mb-6">
                  ✅ Votre message a été envoyé avec succès ! Je vous répondrai dans les plus brefs délais.
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl text-sm font-semibold mb-6">
                  ⚠️ {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Votre nom"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-[#7d1538] focus:ring-2 focus:ring-[#7d1538]/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">
                    Adresse email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="votre.email@exemple.com"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-[#7d1538] focus:ring-2 focus:ring-[#7d1538]/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">
                    Sujet
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Objet de votre message"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-[#7d1538] focus:ring-2 focus:ring-[#7d1538]/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Rédigez votre message ici..."
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-[#7d1538] focus:ring-2 focus:ring-[#7d1538]/20 font-sans"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#7d1538] hover:bg-[#a01e4a] text-white py-3.5 px-6 rounded-full font-bold text-base shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center border-0 cursor-pointer"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {loading ? "Envoi en cours..." : "Envoyer le message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <PortfolioFooter />
    </div>
  );
}
