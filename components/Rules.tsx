"use client";

interface RulesProps {
  onClose: () => void;
}

export default function Rules({ onClose }: RulesProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl border border-white/10 bg-navy p-6 shadow-2xl sm:p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-cream/40 transition-colors hover:text-cream"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <h2 className="font-serif text-2xl font-bold text-cream">
          How to Play
        </h2>

        <div className="mt-5 space-y-5">
          <section>
            <h3 className="text-sm font-semibold tracking-wider text-accent uppercase">
              Gameplay
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-cream/70">
              You get a random letter and 6 categories. Fill in a word starting
              with that letter for each category within{" "}
              <strong className="text-cream">60 seconds</strong>.
            </p>
          </section>

          <section>
            <h3 className="text-sm font-semibold tracking-wider text-accent uppercase">
              Scoring
            </h3>
            <ul className="mt-1.5 space-y-1.5 text-sm leading-relaxed text-cream/70">
              <li className="flex gap-2">
                <span className="text-green-400">+10</span>
                <span>Base points for each valid answer</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-400">+1</span>
                <span>Bonus per character beyond 3 letters</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent">+20</span>
                <span>Bonus for getting all 6 correct</span>
              </li>
              <li className="flex gap-2">
                <span className="text-red-400">0</span>
                <span>Invalid or empty answers score nothing</span>
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-sm font-semibold tracking-wider text-accent uppercase">
              Tips
            </h3>
            <ul className="mt-1.5 space-y-1.5 text-sm leading-relaxed text-cream/70">
              <li>
                Press <strong className="text-cream">Enter</strong> to move to
                the next field.
              </li>
              <li>
                Answers are validated against real databases &mdash; common
                misspellings may not count.
              </li>
              <li>Longer words earn more points!</li>
            </ul>
          </section>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-accent px-6 py-3 font-serif text-lg font-semibold text-navy transition-all active:scale-[0.98]"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
