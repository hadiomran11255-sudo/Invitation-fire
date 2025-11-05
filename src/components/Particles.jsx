// Simple glowing falling balls for the background
export default function Particles({ count = 48 }) {
  return (
    <div className="particles" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => {
        const left = Math.random() * 100;          // %
        const size = 4 + Math.random() * 10;       // px
        const dur  = 6 + Math.random() * 8;        // s
        const delay = Math.random() * 6;           // s
        const blur = Math.random() * 2;            // px
        return (
          <span
            key={i}
            style={{
              "--x": `${left}%`,
              "--sz": `${size}px`,
              "--dur": `${dur}s`,
              "--delay": `${delay}s`,
              "--blur": `${blur}px`,
              width: "var(--sz)",
              height: "var(--sz)",
              animationDuration: "var(--dur)",
              animationDelay: "var(--delay)"
            }}
          />
        );
      })}
    </div>
  );
}
