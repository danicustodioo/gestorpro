// ─── CAPTIONS ────────────────────────────────────────────────────────────────
// Timed subtitle lines for the talking-head reel.
//
// ⚠️ PLACEHOLDER TEXT: these lines are NOT a transcript of the clip — they are
// stand-ins so the styling/timing is visible. Replace `text` with what is
// actually said, and adjust `startSec`/`endSec` to match. `highlight` (optional)
// is a substring rendered in the Veritas gold accent.
//
// Timing is written in seconds for readability and converted to frames at
// render time using the composition fps.

export type CaptionInput = {
  text: string;
  startSec: number;
  endSec: number;
  highlight?: string;
};

export const CAPTIONS: CaptionInput[] = [
  { text: "Você sabe pra onde vai o dinheiro da sua empresa?", startSec: 0.4, endSec: 3.4, highlight: "o dinheiro" },
  { text: "A maioria dos empresários não tem essa clareza.", startSec: 3.5, endSec: 6.6, highlight: "clareza" },
  { text: "É aí que entra a Veritas Hub.", startSec: 6.7, endSec: 9.2, highlight: "Veritas Hub" },
  { text: "Cuidamos do seu financeiro de ponta a ponta.", startSec: 9.3, endSec: 12.4, highlight: "ponta a ponta" },
  { text: "Com segurança, organização e transparência.", startSec: 12.5, endSec: 15.6, highlight: "transparência" },
  { text: "Pra você focar no que faz a empresa crescer.", startSec: 15.7, endSec: 18.8, highlight: "crescer" },
  // … continue adding lines through the full 2m41s clip …
];

// A caption resolved to absolute frame numbers for a given fps.
export type Caption = {
  text: string;
  from: number;
  durationInFrames: number;
  highlight?: string;
};

export const resolveCaptions = (input: CaptionInput[], fps: number): Caption[] =>
  input.map((c) => ({
    text: c.text,
    highlight: c.highlight,
    from: Math.round(c.startSec * fps),
    durationInFrames: Math.max(1, Math.round((c.endSec - c.startSec) * fps)),
  }));
