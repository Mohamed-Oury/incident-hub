import Link from "next/link";
import {
  ArrowRight,
  Calculator,
  TrendingUp,
  Cpu,
  ShieldCheck,
  Brain,
  Sparkles,
} from "lucide-react";

export function AboutSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white via-gray-50/50 to-gray-50 border-b border-gray-100 relative overflow-hidden">
      {/* Arrière-plan décoratif */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 -right-20 w-72 h-72 bg-[#7d1538]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 -left-20 w-80 h-80 bg-[#7d1538]/3 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* CÔTÉ GAUCHE - Carte Visuelle & Badges Flottants (5 cols sur lg) */}
          <div className="lg:col-span-5 relative order-2 lg:order-1">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Carte Centrale Illustrée */}
              <div className="relative z-10 bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100 backdrop-blur-sm">
                <div className="bg-gradient-to-br from-[#7d1538]/5 via-rose-50/40 to-amber-50/30 rounded-2xl p-6 text-center border border-rose-100/60 flex flex-col items-center justify-center min-h-[260px] sm:min-h-[300px]">
                  
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#7d1538] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-[#7d1538]/20 mb-4 transform group-hover:scale-105 transition-transform">
                    <Brain className="w-9 h-9 sm:w-11 sm:h-11" />
                  </div>

                  <h3 className="font-black text-gray-900 text-lg sm:text-xl tracking-tight">
                    Mathématiques &amp; Ingénierie Bancaire
                  </h3>
                  
                  <div className="flex items-center justify-center space-x-1.5 mt-2">
                    <span className="w-2 h-2 rounded-full bg-[#7d1538] animate-pulse"></span>
                    <p className="text-xs sm:text-sm font-bold text-[#7d1538]">
                      CBS Amplitude, 4GL &amp; Monétique
                    </p>
                  </div>

                  <p className="text-xs text-gray-500 mt-3 max-w-xs leading-relaxed">
                    Spécialisé dans les algorithmes décisionnels, le Core Banking et les systèmes de paiement interbancaires.
                  </p>
                </div>
              </div>

              {/* Badge Flottant Supérieur Gauche */}
              <div className="absolute -top-5 -left-4 sm:-top-6 sm:-left-6 z-20 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-3.5 sm:p-4 border border-gray-200/80 hover:scale-105 transition-transform duration-300">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                    <TrendingUp className="w-5 h-5 text-blue-700" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-gray-900">CBS Amplitude &amp; Flex</div>
                    <div className="text-[11px] text-gray-500 font-medium">Core Banking Systems</div>
                  </div>
                </div>
              </div>

              {/* Badge Flottant Inférieur Droit */}
              <div className="absolute -bottom-5 -right-4 sm:-bottom-6 sm:-right-6 z-20 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-3.5 sm:p-4 border border-gray-200/80 hover:scale-105 transition-transform duration-300">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-[#7d1538]" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-gray-900">Monétique Payway &amp; Powercard</div>
                    <div className="text-[11px] text-gray-500 font-medium">ISO 8583 &amp; Flux Monétiques</div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* CÔTÉ DROIT - Titre & Grille 2x2 des 4 Piliers (7 cols sur lg) */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-8">
            
            {/* Header du bloc */}
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#7d1538]/10 text-[#7d1538] text-xs sm:text-sm font-bold tracking-wide">
                <Sparkles className="w-4 h-4 mr-1" />
                <span>Présentation &amp; Expertise Métier</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-tight tracking-tight">
                Allier <span className="text-[#7d1538]">Rigueur Mathématique</span> et <span className="text-[#7d1538]">Systèmes Bancaires</span>
              </h2>

              <p className="text-base sm:text-lg text-gray-600 leading-relaxed font-medium">
                🎓 Diplômé d’un Master en Mathématiques (Optimisation &amp; Analyse Numérique), je traduis la précision des modèles théoriques en solutions logicielles critiques pour la banque et la monétique.
              </p>
            </div>

            {/* GRILLE 2x2 DES 4 PILIERS DE L'EXPERTISE (DESIGN HAUT DE GAMME) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              
              {/* Pilier 1: Mathématiques */}
              <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-purple-300 transition-all duration-200 group flex flex-col justify-between space-y-3">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-purple-200 transition-colors">
                    <Calculator className="w-5 h-5 text-purple-700" />
                  </div>
                  <span className="px-2 py-0.5 bg-purple-50 text-purple-700 text-[10px] font-bold rounded-md border border-purple-200">
                    Master &amp; Quant
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base">1. Mathématiques</h3>
                  <p className="text-xs text-gray-600 leading-relaxed mt-1">
                    Optimisation sous contraintes, modélisation stochastique &amp; analyse numérique.
                  </p>
                </div>
              </div>

              {/* Pilier 2: CBS Amplitude & Flex */}
              <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 group flex flex-col justify-between space-y-3">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-blue-200 transition-colors">
                    <TrendingUp className="w-5 h-5 text-blue-700" />
                  </div>
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-md border border-blue-200">
                    Core Banking
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base">2. CBS Amplitude &amp; Flex</h3>
                  <p className="text-xs text-gray-600 leading-relaxed mt-1">
                    Sopra Banking Amplitude (v10-v13) &amp; Oracle FlexCube (comptes, arrêté EOD).
                  </p>
                </div>
              </div>

              {/* Pilier 3: Informix 4GL & Genero */}
              <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-amber-300 transition-all duration-200 group flex flex-col justify-between space-y-3">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-amber-200 transition-colors">
                    <Cpu className="w-5 h-5 text-amber-700" />
                  </div>
                  <span className="px-2 py-0.5 bg-amber-50 text-amber-800 text-[10px] font-bold rounded-md border border-amber-200">
                    4GL &amp; Batch
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base">3. Informix 4GL &amp; Genero</h3>
                  <p className="text-xs text-gray-600 leading-relaxed mt-1">
                    Développement de programmes 4GL Core Banking, masques .per &amp; batchs lourds.
                  </p>
                </div>
              </div>

              {/* Pilier 4: Monétique Payway & Powercard */}
              <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-rose-300 transition-all duration-200 group flex flex-col justify-between space-y-3">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-rose-200 transition-colors">
                    <ShieldCheck className="w-5 h-5 text-[#7d1538]" />
                  </div>
                  <span className="px-2 py-0.5 bg-rose-50 text-[#7d1538] text-[10px] font-bold rounded-md border border-rose-200">
                    ISO 8583 &amp; EMV
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base">4. Monétique Payway &amp; Powercard</h3>
                  <p className="text-xs text-gray-600 leading-relaxed mt-1">
                    Incidents monétiques, décodage trames ISO 8583, EMV TLV &amp; systèmes Powercard.
                  </p>
                </div>
              </div>

            </div>

            {/* Boutons d'Action */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/a-propos" className="text-decoration-none w-full sm:w-auto">
                <button className="w-full sm:w-auto bg-[#7d1538] hover:bg-[#63102c] text-white px-8 py-3.5 rounded-full font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center justify-center border-0 cursor-pointer">
                  Découvrir mon parcours complet
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </Link>

              <Link href="/projets" className="text-decoration-none w-full sm:w-auto">
                <button className="w-full sm:w-auto border-2 border-[#7d1538] text-[#7d1538] hover:bg-[#7d1538] hover:text-white px-8 py-3.5 rounded-full font-bold text-sm sm:text-base transition-all duration-300 inline-flex items-center justify-center bg-transparent cursor-pointer">
                  Voir les projets &amp; solutions
                </button>
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
