import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  value: string;
  className?: string;
  duration?: number;
}

const CountUp = ({ value, className = "", duration = 2 }: CountUpProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayValue, setDisplayValue] = useState("0");
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Extract numeric part and suffix (e.g., "25+" → 25, "+")
    const match = value.match(/^(\$?)(\d+)(.*)$/);
    if (!match) {
      setDisplayValue(value);
      return;
    }

    const prefix = match[1];
    const numericTarget = parseInt(match[2], 10);
    const suffix = match[3];

    import("gsap").then(({ default: gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);

        ScrollTrigger.create({
          trigger: el,
          start: "top 90%",
          once: true,
          onEnter: () => {
            if (hasAnimated.current) return;
            hasAnimated.current = true;

            const obj = { val: 0 };
            gsap.to(obj, {
              val: numericTarget,
              duration,
              ease: "power2.out",
              onUpdate: () => {
                setDisplayValue(`${prefix}${Math.floor(obj.val)}${suffix}`);
              },
            });
          },
        });
      });
    });
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {displayValue}
    </span>
  );
};

export default CountUp;
