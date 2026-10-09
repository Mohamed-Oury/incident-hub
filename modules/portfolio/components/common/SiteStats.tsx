import { BookOpen, Code, Calendar, Users } from "lucide-react";

interface SiteStatsProps {
  totalPosts?: number;
  totalProjects?: number;
  yearsExperience?: number;
}

export function SiteStats({ totalPosts = 3, totalProjects = 5, yearsExperience = 5 }: SiteStatsProps) {
  const statsToShow = [
    {
      icon: BookOpen,
      value: totalPosts,
      label: "Articles Publiés",
    },
    {
      icon: Code,
      value: totalProjects,
      label: "Projets Réalisés",
    },
    {
      icon: Calendar,
      value: `${yearsExperience}+`,
      label: "Années d'Expérience",
    },
    {
      icon: Users,
      value: "9+",
      label: "Filiales Accompagnées",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-[#7d1538] to-[#a01e4a] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-3">
            Chiffres Clés
          </h2>
          <p className="text-pink-100 text-base sm:text-lg">
            Quelques statistiques sur mon activité
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {statsToShow.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl sm:text-4xl font-black mb-1">{stat.value}</div>
              <div className="text-pink-100 text-sm sm:text-base font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
