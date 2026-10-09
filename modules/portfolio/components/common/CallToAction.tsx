import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";

interface CallToActionProps {
  title?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonHref?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
}

export function CallToAction({
  title = "Envie de collaborer sur un projet ?",
  description = "Je suis toujours ouvert aux nouvelles opportunités de collaboration, que ce soit pour des projets techniques, des recherches ou des échanges d'idées.",
  primaryButtonText = "Discutons de votre projet",
  primaryButtonHref = "/contact",
  secondaryButtonText = "Voir mes projets",
  secondaryButtonHref = "/projets",
}: CallToActionProps) {
  return (
    <section className="py-20 bg-gradient-to-br from-[#7d1538] via-[#a01e4a] to-[#5c0f28] text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm shadow-md">
          <Mail className="w-8 h-8 text-white" />
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-6 leading-tight">
          {title}
        </h2>

        <p className="text-pink-100 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
          {description}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={primaryButtonHref} className="text-decoration-none">
            <button className="bg-white text-[#7d1538] hover:bg-gray-100 px-8 py-4 rounded-full font-bold text-base shadow-xl transition-all duration-300 inline-flex items-center justify-center cursor-pointer border-0 w-full sm:w-auto">
              {primaryButtonText}
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </Link>

          <Link href={secondaryButtonHref} className="text-decoration-none">
            <button className="border-2 border-white text-white hover:bg-white hover:text-[#7d1538] px-8 py-4 rounded-full font-bold text-base transition-all duration-300 inline-flex items-center justify-center bg-transparent cursor-pointer w-full sm:w-auto">
              {secondaryButtonText}
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
