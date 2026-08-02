import React, { useEffect, useRef } from "react";

interface AdsterraBannerProps {
  className?: string;
  label?: string;
}

export const AdsterraBanner: React.FC<AdsterraBannerProps> = ({
  className = "",
  label = "Sponsored Advertisement"
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear existing children to prevent duplication on re-render
    containerRef.current.innerHTML = "";

    // 1. Create the container div required by Adsterra
    const adContainer = document.createElement("div");
    adContainer.id = "container-8ef7c0e19eea537e1fffd24867dc378a";
    containerRef.current.appendChild(adContainer);

    // 2. Create the async script tag provided by Adsterra
    const script = document.createElement("script");
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src = "https://pl30651403.effectivecpmnetwork.com/8ef7c0e19eea537e1fffd24867dc378a/invoke.js";

    containerRef.current.appendChild(script);
  }, []);

  return (
    <div className={`my-6 text-center overflow-hidden rounded-xl bg-amber-50/50 dark:bg-slate-900/60 border border-amber-200/60 dark:border-amber-900/40 p-3 shadow-xs ${className}`}>
      {label && (
        <div className="text-[10px] font-medium tracking-wider uppercase text-amber-700/60 dark:text-amber-400/50 mb-2">
          {label}
        </div>
      )}
      <div ref={containerRef} className="min-h-[90px] flex items-center justify-center min-w-[300px]">
        {/* Adsterra script will inject ad container here */}
      </div>
    </div>
  );
};
