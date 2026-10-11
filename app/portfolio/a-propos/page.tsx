import { PortfolioHeader } from "@/modules/portfolio/components/layout/PortfolioHeader";
import { PortfolioFooter } from "@/modules/portfolio/components/layout/PortfolioFooter";
import { CallToAction } from "@/modules/portfolio/components/common/CallToAction";
import { prisma } from "@/lib/prisma";
import { Award, GraduationCap, Code, Briefcase, Calculator, TrendingUp, Cpu, ShieldCheck } from "lucide-react";
import Link from "next/link";

export const revalidate = 60;

export default async function AboutPage() {
  const about = await prisma.about.findFirst({ where: { id: "main-about" } });

  const skillsList = about?.skills ? JSON.parse(about.skills) : [];
  const experiencesList = about?.experiences ? JSON.parse(about.experiences) : [];
  const educationList = about?.education ? JSON.parse(about.education) : [];

  return (
    <div className="bg-white text-gray-900 min-h-screen font-sans">
      <PortfolioHeader />

      <main className="py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header section */}
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#7d1538]/10 text-[#7d1538] text-xs sm:text-sm font-semibold mb-4">
              Mathématiques, CBS &amp; Monétique
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight">
              {about?.title || "Ingénieur Logiciel & Mathématicien"}
            </h1>
            <p className="text-lg text-gray-600 mt-4 leading-relaxed font-medium">
              Spécialisé en Mathématiques Appliquées, CBS Amplitude &amp; FlexCube, Informix 4GL et Monétique Payway &amp; Powercard.
            </p>
          </div>

          {/* 4 Piliers d'expertise majeure */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Calculator className="w-6 h-6 text-purple-800" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">1. Mathématiques</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Master en Mathématiques, spécialisé en Optimisation, Analyse Numérique &amp; Algorithmes de décision.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-blue-800" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">2. CBS Amplitude &amp; Flex</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Expertise approfondie sur Sopra Banking Amplitude (v10 à v13) et Oracle FlexCube (Core Banking &amp; EOD).
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                <Cpu className="w-6 h-6 text-amber-800" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">3. Informix 4GL &amp; Genero</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Conception et maintenance de programmes Informix 4GL, masques graphiques .per, triggers et scripts Unix.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6 text-[#7d1538]" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">4. Monétique Payway &amp; Powercard</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Analyse de trames ISO 8583, EMV TLV, compensation monétique, supervision GAB/ATM et hubs de paiement.
              </p>
            </div>
          </div>

          {/* Description principale */}
          <div className="bg-gray-50 border border-gray-200 rounded-3xl p-8 md:p-12 shadow-sm mb-16 leading-relaxed text-gray-700 text-base md:text-lg">
            <div className="prose prose-lg max-w-none space-y-4">
              <p className="font-semibold text-gray-900">
                🎓 Diplômé d’un Master en Mathématiques (Optimisation &amp; Analyse Numérique), j'allie la rigueur scientifique théorique à une maîtrise concrète des systèmes financiers et bancaires.
              </p>
              <p>
                💻 Mon intervention s'étend du développement d'applications logicielles modernes au paramétrage et au support des Core Banking Systems (**Sopra Amplitude**, **Oracle FlexCube**), à la programmation spécialisée en **Informix 4GL** et à la gestion de la monétique bancaire (**Payway**, **HPS Powercard**, normes **ISO 8583** et **EMV**).
              </p>
              <p>
                ✍️ À travers mon portfolio, ma plateforme Hub et mes articles, je mets cette double compétence mathématique et bancaire au service d'entreprises et d'institutions financières.
              </p>
            </div>
          </div>

          {/* Timeline des Expériences */}
          <div className="mb-16">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-2 h-7 bg-[#7d1538] rounded-full"></div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 flex items-center">
                <Briefcase className="w-6 h-6 mr-3 text-[#7d1538]" />
                Expériences Professionnelles
              </h2>
            </div>

            <div className="space-y-6">
              {experiencesList.map((exp: { company: string; position: string; period: string; description: string }) => (
                <div
                  key={exp.company + exp.position}
                  className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow border-l-8 border-l-[#7d1538]"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                    <h3 className="text-xl font-bold text-gray-900">
                      {exp.position} <span className="text-[#7d1538]">@ {exp.company}</span>
                    </h3>
                    <span className="inline-block px-3 py-1 bg-[#7d1538]/10 text-[#7d1538] font-bold text-xs rounded-full">
                      {exp.period}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Formation & Diplômes */}
          <div className="mb-16">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-2 h-7 bg-[#7d1538] rounded-full"></div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 flex items-center">
                <GraduationCap className="w-6 h-6 mr-3 text-[#7d1538]" />
                Formation &amp; Diplômes
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {educationList.map((edu: { degree: string; school: string; specialization: string; year: string }) => (
                <div
                  key={edu.degree + edu.year}
                  className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <span className="text-xs font-bold text-[#7d1538] bg-[#7d1538]/10 px-2.5 py-1 rounded-full">{edu.year}</span>
                  <h3 className="text-lg font-bold text-gray-900 mt-3 mb-1">{edu.degree}</h3>
                  <div className="text-sm font-semibold text-gray-700">{edu.school}</div>
                  <div className="text-xs text-gray-500 mt-1">{edu.specialization}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Grille des Compétences */}
          <div className="mb-16">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-2 h-7 bg-[#7d1538] rounded-full"></div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                Compétences &amp; Expertises Techniques
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skillsList.map((group: { category: string; items: string[] }) => (
                <div key={group.category} className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-base font-bold text-[#7d1538] mb-4 pb-2 border-b border-gray-200 uppercase tracking-wider">
                    {group.category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((item: string) => (
                      <span
                        key={item}
                        className="px-3 py-1 bg-white border border-gray-200 text-gray-800 text-xs font-semibold rounded-full shadow-2xs"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <CallToAction />
      <PortfolioFooter />
    </div>
  );
}
