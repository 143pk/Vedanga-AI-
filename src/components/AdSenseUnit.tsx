import React, { useEffect, useRef } from "react";

interface AdSenseUnitProps {
  slot?: string;
  className?: string;
  style?: React.CSSProperties;
  label?: string;
}

export const AdSenseUnit: React.FC<AdSenseUnitProps> = ({
  slot = "2189033269",
  className = "",
  style = { display: "block" },
  label = "ADVERTISEMENT"
}) => {
  const adRef = useRef<HTMLModElement>(null);
  const pushedRef = useRef(false);

  useEffect(() => {
    if (pushedRef.current) return;
    try {
      if (typeof window !== "undefined") {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        pushedRef.current = true;
      }
    } catch (e) {
      console.warn("AdSense push error:", e);
    }
  }, []);

  return (
    <div className={`my-6 flex flex-col items-center justify-center overflow-hidden w-full max-w-5xl mx-auto rounded-xl border border-amber-900/20 bg-slate-900/60 p-3 shadow-inner ${className}`}>
      {label && (
        <span className="text-[10px] font-semibold tracking-wider text-amber-400/60 uppercase mb-1">
          {label}
        </span>
      )}
      <div className="w-full min-h-[90px] flex justify-center items-center">
        <ins
          ref={adRef as any}
          className="adsbygoogle"
          style={style}
          data-ad-client="ca-pub-6855799245720155"
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
};
