import React from "react";

interface AdsterraBannerProps {
  className?: string;
  label?: string;
}

export const AdsterraBanner: React.FC<AdsterraBannerProps> = ({
  className = "",
  label = "Sponsored Advertisement"
}) => {
  // Complete HTML document string to isolate Adsterra script inside an iframe
  const adHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          html, body {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            background: transparent;
            overflow: hidden;
          }
        </style>
      </head>
      <body>
        <script type="text/javascript" src="https://pl30651401.effectivecpmnetwork.com/be/07/5a/be075a3bf7dff970686df2c02e309444.js"></script>
      </body>
    </html>
  `;

  return (
    <div className={`my-6 text-center overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 shadow-xs ${className}`}>
      {label && (
        <div className="text-[10px] font-medium tracking-wider uppercase text-slate-400 dark:text-slate-500 mb-1.5">
          {label}
        </div>
      )}
      <div className="flex justify-center items-center min-h-[90px] w-full overflow-hidden">
        <iframe
          title="Adsterra Advertisement"
          srcDoc={adHtml}
          className="w-full max-w-[728px] h-[90px] border-0 overflow-hidden"
          scrolling="no"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        />
      </div>
    </div>
  );
};

