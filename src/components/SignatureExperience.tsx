import React from 'react';
import { useStore } from '../context/StoreContext';
import { Flame, Sparkles, HeartHandshake, Wine } from 'lucide-react';

export const SignatureExperience: React.FC = () => {
  const { t } = useStore();

  const features = [
    {
      icon: Flame,
      title: t.feature1Title,
      desc: t.feature1Desc,
    },
    {
      icon: Sparkles,
      title: t.feature2Title,
      desc: t.feature2Desc,
    },
    {
      icon: HeartHandshake,
      title: t.feature3Title,
      desc: t.feature3Desc,
    },
    {
      icon: Wine,
      title: t.feature4Title,
      desc: t.feature4Desc,
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#08201a] text-[#fdfbf7] relative border-t border-[#c5a059]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold tracking-widest text-[#c5a059] uppercase block mb-2">
            {t.experienceTitle}
          </span>
          <h2 className="font-serif-title text-2xl sm:text-4xl font-bold text-[#fdfbf7]">
            {t.experienceSubtitle}
          </h2>
          <div className="w-16 h-[2px] bg-[#c5a059] mx-auto mt-4" />
        </div>

        {/* 4 Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div
                key={idx}
                className="bg-[#0c342b]/60 border border-[#c5a059]/25 hover:border-[#c5a059] p-6 sm:p-8 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40 flex flex-col items-center text-center group"
              >
                {/* Icon Circle */}
                <div className="w-14 h-14 rounded-full bg-[#08201a] border border-[#c5a059]/40 group-hover:border-[#c5a059] group-hover:bg-[#c5a059]/20 flex items-center justify-center text-[#c5a059] mb-5 transition-all">
                  <Icon className="w-6 h-6" />
                </div>

                {/* Title */}
                <h3 className="font-serif-title text-lg font-bold text-[#fdfbf7] group-hover:text-[#c5a059] transition-colors mb-3">
                  {f.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-[#e4ded6] leading-relaxed">
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
