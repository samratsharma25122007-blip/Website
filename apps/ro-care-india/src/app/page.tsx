/**
 * Homepage — DOM baseline.
 *
 * Milestone 0: intentionally no visible UI (per instruction "only build the
 * world"). This carries the accessible, crawlable content that the WebGL layer
 * visually replaces. Visible hero text/CTA arrive in a later milestone.
 */
export default function HomePage() {
  return (
    <main>
      <h1 className="sr-only">
        RO Care India — Pure Water. Protected Family.
      </h1>
      <p className="sr-only">
        India&apos;s most premium RO water-purifier service. Certified,
        background-verified technicians, genuine spare parts, 13+ years of
        experience, 24×7 support, and same-day service across 19,000+ PIN codes.
      </p>
      {/* Full-viewport spacer so the fixed WebGL world is visible on first paint. */}
      <section aria-hidden="true" style={{ height: "100svh" }} />
    </main>
  );
}
