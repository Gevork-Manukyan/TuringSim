/**
 * Turing Sim logo — a finite-state-machine motif:
 * a filled "start" state on the left, a transition arrow, and a
 * double-ring "accept" state on the right.
 *
 * Draws with `currentColor`, so it inherits the accent token from CSS
 * and adapts automatically between the light and dark themes.
 */
export default function Logo({ size = 30 }: { size?: number }) {
  return (
    <svg
      className="Navbar__logo"
      width={(size * 44) / 28}
      height={size}
      viewBox="0 0 44 28"
      role="img"
      aria-label="Turing Sim"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Turing Sim</title>

      {/* start state — filled node */}
      <circle cx="8" cy="14" r="6" fill="currentColor" />
      {/* start marker — little entry stub into the first state */}
      <path
        d="M1 14h1"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* transition arrow, gently arced from start to accept state */}
      <path
        d="M14.5 12.4C18 9.6 22.5 9.6 26 12.4"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M26.4 8.6l0.4 4.2-4 -1.4"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* accept state — double ring */}
      <circle cx="35" cy="14" r="7" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="35" cy="14" r="3" fill="currentColor" />
    </svg>
  )
}
