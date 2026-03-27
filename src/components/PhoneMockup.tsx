export default function PhoneMockup() {
  return (
    <>
      {/* Keyframes for ripple rings */}
      <style>{`
        @keyframes ripple {
          0% { transform: scale(0.8); opacity: 0.6; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes ripple-delayed {
          0% { transform: scale(0.8); opacity: 0.4; }
          100% { transform: scale(2.6); opacity: 0; }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .ripple-ring-1 {
          animation: ripple 2.5s ease-out infinite;
        }
        .ripple-ring-2 {
          animation: ripple-delayed 2.5s ease-out infinite 0.6s;
        }
        .ripple-ring-3 {
          animation: ripple 3s ease-out infinite 1.2s;
        }
        .pulse-dot {
          animation: pulse-dot 2s ease-in-out infinite;
        }
      `}</style>

      <div className="relative mx-auto w-[280px]">
        {/* Ambient glow */}
        <div className="absolute -inset-6 rounded-[3rem] bg-korvex-accent/8 blur-3xl" />

        {/* Phone frame */}
        <div className="relative rounded-[2.5rem] border-2 border-korvex-border bg-korvex-bg-secondary p-3 shadow-2xl">
          {/* Notch */}
          <div className="absolute left-1/2 top-3 z-10 h-5 w-24 -translate-x-1/2 rounded-b-xl bg-korvex-bg" />

          {/* Screen */}
          <div className="overflow-hidden rounded-[2rem] bg-korvex-bg">
            {/* Status bar */}
            <div className="flex items-center justify-between px-8 pb-1 pt-4 text-[10px] text-korvex-muted">
              <span>9:41</span>
              <div className="flex items-center gap-1.5">
                {/* Signal bars */}
                <div className="flex items-end gap-px">
                  <div className="h-1.5 w-1 rounded-sm bg-korvex-accent" />
                  <div className="h-2.5 w-1 rounded-sm bg-korvex-accent" />
                  <div className="h-3 w-1 rounded-sm bg-korvex-accent" />
                  <div className="h-3.5 w-1 rounded-sm bg-korvex-accent" />
                </div>
                {/* Battery */}
                <svg width="18" height="9" viewBox="0 0 18 9" fill="none">
                  <rect x="0.5" y="0.5" width="15" height="8" rx="1.5" stroke="#4d7a5f" strokeWidth="0.8" />
                  <rect x="2" y="2" width="12" height="5" rx="0.5" fill="#00ff87" />
                  <rect x="16" y="2.5" width="1.5" height="4" rx="0.5" fill="#4d7a5f" />
                </svg>
              </div>
            </div>

            {/* Shield + ripple area */}
            <div className="relative flex flex-col items-center px-5 pb-4 pt-6">
              {/* Ripple rings */}
              <div className="relative flex h-32 w-32 items-center justify-center">
                <div className="ripple-ring-1 absolute inset-0 rounded-full border border-korvex-accent/30" />
                <div className="ripple-ring-2 absolute inset-2 rounded-full border border-korvex-accent/20" />
                <div className="ripple-ring-3 absolute inset-4 rounded-full border border-korvex-accent/10" />

                {/* Shield icon */}
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-korvex-accent/10">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#00ff87"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                  {/* Pulsing dot badge */}
                  <div className="pulse-dot absolute -right-1 -top-1 h-3 w-3 rounded-full bg-korvex-accent shadow-[0_0_8px_rgba(0,255,135,0.6)]" />
                </div>
              </div>

              {/* CONNECTED label */}
              <div className="mt-3 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-korvex-accent shadow-[0_0_6px_rgba(0,255,135,0.5)]" />
                <span className="font-heading text-xs font-bold uppercase tracking-widest text-korvex-accent">
                  Connected
                </span>
              </div>
            </div>

            {/* Server list */}
            <div className="space-y-2 px-4 pb-6">
              {/* NL1 */}
              <div className="flex items-center justify-between rounded-xl border border-korvex-accent/20 bg-korvex-accent/5 px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="text-lg">&#x1F1F3;&#x1F1F1;</span>
                  <div>
                    <p className="text-xs font-medium text-korvex-text">NL1</p>
                    <p className="text-[10px] text-korvex-muted">Amsterdam</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-medium text-korvex-accent">
                    11ms
                  </span>
                  {/* Signal bars */}
                  <div className="flex items-end gap-px">
                    <div className="h-1 w-0.5 rounded-sm bg-korvex-accent" />
                    <div className="h-1.5 w-0.5 rounded-sm bg-korvex-accent" />
                    <div className="h-2 w-0.5 rounded-sm bg-korvex-accent" />
                    <div className="h-2.5 w-0.5 rounded-sm bg-korvex-accent" />
                  </div>
                </div>
              </div>

              {/* DE1 */}
              <div className="flex items-center justify-between rounded-xl bg-korvex-bg-secondary px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="text-lg">&#x1F1E9;&#x1F1EA;</span>
                  <div>
                    <p className="text-xs font-medium text-korvex-text">DE1</p>
                    <p className="text-[10px] text-korvex-muted">Frankfurt</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-medium text-korvex-muted">
                    17ms
                  </span>
                  <div className="flex items-end gap-px">
                    <div className="h-1 w-0.5 rounded-sm bg-korvex-accent" />
                    <div className="h-1.5 w-0.5 rounded-sm bg-korvex-accent" />
                    <div className="h-2 w-0.5 rounded-sm bg-korvex-accent" />
                    <div className="h-2.5 w-0.5 rounded-sm bg-korvex-muted" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
