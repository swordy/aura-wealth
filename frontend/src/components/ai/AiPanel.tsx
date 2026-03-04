import { useAi } from "./AiContext";

export default function AiPanel() {
  const { state, toggle } = useAi();

  return (
    <>
      {/* FAB */}
      <button
        onClick={toggle}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gold-gradient flex items-center justify-center transition-transform hover:scale-110"
        style={{ boxShadow: "0 0 20px rgba(212,175,55,0.4)" }}
      >
        <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>

      {/* Panel */}
      {state.open && (
        <div
          className="fixed bottom-24 right-6 z-50 w-[90vw] md:w-96 glass-panel rounded-2xl overflow-hidden"
          style={{
            height: "384px",
            borderColor: "rgba(212,175,55,0.4)",
            animation: "slideUp 0.35s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          {/* Header */}
          <div className="px-4 py-3 flex items-center justify-between bg-[--surface-overlay] border-b border-[--border-section]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gold-gradient" />
              <span className="text-sm font-medium text-[--text-primary] font-display">{state.title}</span>
            </div>
            <button onClick={toggle} className="text-[--text-muted] hover:text-[--text-primary] transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages area */}
          <div className="p-4 overflow-y-auto" style={{ height: "calc(100% - 112px)" }}>
            {state.loading ? (
              <div className="flex items-center gap-2 text-sm text-[--text-muted]">
                <div className="w-4 h-4 border-2 border-[--border-section] border-t-gold rounded-full animate-spin" />
                Analyse en cours…
              </div>
            ) : state.message ? (
              <div className="glass-panel-inner p-3 rounded-lg text-sm text-[--text-secondary] leading-relaxed">
                {state.message}
              </div>
            ) : (
              <p className="text-sm text-[--text-faint] text-center mt-8">
                Cliquez sur un bouton ✦ pour obtenir une analyse contextuelle.
              </p>
            )}
          </div>

          {/* Input bar */}
          <div className="px-4 py-3 border-t border-[--border-section]">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Posez une question…"
                className="flex-1 bg-[--input-bg] border border-[--border-section] rounded-full px-4 py-2 text-sm text-[--text-primary] placeholder-[--input-placeholder] outline-none focus:border-[--border-strong] transition-colors"
              />
              <button className="w-8 h-8 rounded-full bg-gold-gradient flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
