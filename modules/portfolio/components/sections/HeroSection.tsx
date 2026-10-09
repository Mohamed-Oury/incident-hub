import Link from "next/link";
import { ArrowRight, Code, Calculator, TrendingUp, Brain, ShieldCheck, Cpu } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center bg-white overflow-hidden py-16 lg:py-24 border-b border-gray-100">
      {/* Éléments géométriques décoratifs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#7d1538]/5 rounded-full blur-xl"></div>
        <div className="absolute top-1/4 -left-20 w-32 h-32 bg-[#7d1538]/3 rounded-full blur-xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-[#7d1538]/4 rounded-full blur-lg"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Contenu principal */}
          <div className="text-center lg:text-left space-y-6 md:space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#7d1538]/10 text-[#7d1538] text-xs md:text-sm font-semibold shadow-sm">
              <Brain className="w-4 h-4 mr-2" />
              <span>Mathématicien &amp; Expert CBS / Monétique</span>
            </div>

            {/* Titre principal */}
            <div className="space-y-3 md:space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-tight tracking-tight">
                Bonjour,
                <br />
                je suis <span className="text-[#7d1538]">Mr.Oury</span>
              </h1>
              <p className="text-gray-600 text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
                Ingénieur Logiciel &amp; Mathématicien spécialisé dans l&apos;ingénierie bancaire. Mon expertise s&apos;articule autour de 4 piliers d&apos;excellence  <strong className="text-gray-900 font-semibold">Mathématiques</strong>, <strong className="text-gray-900 font-semibold">CBS Amplitude &amp; Flex</strong>, <strong className="text-gray-900 font-semibold">Informix 4GL</strong> et <strong className="text-gray-900 font-semibold">Monétique Payway &amp; Powercard</strong>.
              </p>
            </div>

            {/* Sous-description */}
            <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed">
              De l&apos;optimisation mathématique à la conception de modules 4GL complexes et la supervision monétique bancaire ISO 8583 / Powercard / Payway.
            </p>

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
              <Link href="/projets" className="text-decoration-none">
                <button className="bg-[#7d1538] hover:bg-[#a01e4a] text-white px-8 py-3.5 rounded-full font-bold text-base shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto inline-flex items-center justify-center border-0 cursor-pointer">
                  Découvrir les solutions &amp; projets
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </Link>

              <Link href="/hub" className="text-decoration-none">
                <button className="border-2 border-[#7d1538] text-[#7d1538] hover:bg-[#7d1538] hover:text-white px-8 py-3.5 rounded-full font-bold text-base transition-all duration-300 w-full sm:w-auto inline-flex items-center justify-center bg-transparent cursor-pointer">
                  💳 Explorer la plateforme Hub
                </button>
              </Link>
            </div>
          </div>

          {/* Section droite - 4 Piliers d'expertise */}
          <div className="space-y-4 lg:order-last">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6 text-center lg:text-left">
              Piliers d&apos;Expertise Majeurs
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 1. Mathématiques */}
              <div className="p-5 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md hover:border-[#7d1538]/40 transition-all duration-300 group">
                <div className="flex items-center space-x-3.5">
                  <div className="w-11 h-11 bg-purple-50 rounded-xl flex items-center justify-center shrink-0">
                    <Calculator className="w-5 h-5 text-purple-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base">Mathématiques</h3>
                    <p className="text-gray-500 text-xs mt-0.5">Optimisation &amp; Analyse Numérique</p>
                  </div>
                </div>
              </div>

              {/* 2. CBS Amplitude & Flex */}
              <div className="p-5 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md hover:border-[#7d1538]/40 transition-all duration-300 group">
                <div className="flex items-center space-x-3.5">
                  <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                    <TrendingUp className="w-5 h-5 text-blue-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base">CBS Amplitude &amp; Flex</h3>
                    <p className="text-gray-500 text-xs mt-0.5">Sopra Amplitude &amp; Oracle FlexCube</p>
                  </div>
                </div>
              </div>

              {/* 3. 4GL */}
              <div className="p-5 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md hover:border-[#7d1538]/40 transition-all duration-300 group">
                <div className="flex items-center space-x-3.5">
                  <div className="w-11 h-11 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
                    <Cpu className="w-5 h-5 text-amber-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base">Informix 4GL &amp; Genero</h3>
                    <p className="text-gray-500 text-xs mt-0.5">Form-4GL, Masques .per &amp; Batch</p>
                  </div>
                </div>
              </div>

              {/* 4. Monétique Payway & Powercard */}
              <div className="p-5 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md hover:border-[#7d1538]/40 transition-all duration-300 group">
                <div className="flex items-center space-x-3.5">
                  <div className="w-11 h-11 bg-rose-50 rounded-xl flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-[#7d1538]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base">Monétique Payway &amp; Powercard</h3>
                    <p className="text-gray-500 text-xs mt-0.5">ISO 8583, EMV &amp; Clearing</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
