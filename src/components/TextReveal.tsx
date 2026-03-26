import { useEffect, useRef } from "react";

interface TextRevealProps {
  children: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  delay?: number;
  stagger?: number;
  splitBy?: "words" | "chars";
}

const TextReveal = ({
  children,
  className = "",
  as: Tag = "h1",
  delay = 0,
  stagger = 0.04,
  splitBy = "words",
}: TextRevealProps) => {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    import("gsap").then(({ default: gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);

        const items = el.querySelectorAll(".reveal-item");

        gsap.set(items, { y: "100%", opacity: 0 });

        gsap.to(items, {
          y: "0%",
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger,
          delay,
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      });
    });
  }, [delay, stagger]);

  const parts = splitBy === "words" ? children.split(" ") : children.split("");

  return (
    <Tag ref={containerRef as any} className={`${className}`}>
      {parts.map((part, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <span className="reveal-item inline-block">
            {part}
            {splitBy === "words" && i < parts.length - 1 ? "\u00A0" : ""}
          </span>
        </span>
      ))}
    </Tag>
  );
};

export default TextReveal;
