import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SixInSixty - Support",
  description: "Get help and support for SixInSixty, the quick word game.",
};

export default function SupportPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-serif text-4xl font-bold text-cream">Support</h1>
      <p className="mt-3 text-cream/60">
        Need help with SixInSixty? We&apos;re here for you.
      </p>

      <div className="mt-10 space-y-8">
        <section>
          <h2 className="font-serif text-xl font-semibold text-accent">
            How to Play
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-cream/70">
            You&apos;re given a random letter and 6 categories. Type a word
            starting with that letter for each category before the 60-second
            timer runs out. Earn points for each valid answer, with bonuses for
            longer words and getting all six correct.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-accent">
            Frequently Asked Questions
          </h2>
          <div className="mt-3 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-cream">
                Why was my answer marked invalid?
              </h3>
              <p className="mt-1 text-sm text-cream/70">
                Answers are validated against real-world databases. Make sure
                your answer is a real, correctly-spelled word or name that fits
                the category and starts with the given letter.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-cream">
                How is scoring calculated?
              </h3>
              <p className="mt-1 text-sm text-cream/70">
                Each valid answer earns 10 base points, plus 1 bonus point for
                every character beyond 3 letters. If you get all 6 correct, you
                earn an extra 20-point bonus.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-cream">
                Is my data stored anywhere?
              </h3>
              <p className="mt-1 text-sm text-cream/70">
                Your game history and stats are stored locally on your device.
                We do not collect or store any personal data on our servers.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-cream">
                Can I play as many times as I want?
              </h3>
              <p className="mt-1 text-sm text-cream/70">
                Yes! There&apos;s no limit. Each game gives you a fresh random
                letter and set of categories.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-accent">
            Contact Us
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-cream/70">
            If you have questions, feedback, or need help, reach out to us at:
          </p>
          <a
            href="mailto:support@sixinsixty.com"
            className="mt-2 inline-block text-accent underline underline-offset-2 hover:text-accent/80"
          >
            support@sixinsixty.com
          </a>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-accent">
            Privacy
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-cream/70">
            SixInSixty does not collect personal information. All game data is
            stored locally on your device. Answer validation requests are
            processed without storing any user-identifiable information.
          </p>
        </section>
      </div>

      <div className="mt-12 border-t border-white/10 pt-6">
        <a
          href="/"
          className="text-sm text-accent/70 underline-offset-2 hover:text-accent hover:underline"
        >
          &larr; Back to game
        </a>
      </div>
    </div>
  );
}
