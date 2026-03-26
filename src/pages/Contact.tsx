import { useEffect, useRef, useState } from "react";
import Layout from "@/components/Layout";
import TextReveal from "@/components/TextReveal";
import MagneticButton from "@/components/MagneticButton";
import { Mail, Github, Linkedin, Twitter, Send } from "lucide-react";

const Contact = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  useEffect(() => {
    import("gsap").then(({ default: gsap }) => {
      const ctx = gsap.context(() => {
        // Form slides up with clip-path reveal
        gsap.fromTo(
          ".contact-form",
          { y: 60, opacity: 0, clipPath: "inset(100% 0 0 0)" },
          { y: 0, opacity: 1, clipPath: "inset(0% 0 0 0)", duration: 0.9, ease: "power3.out", delay: 0.4 }
        );

        // Social links stagger with bounce
        gsap.fromTo(
          ".social-link",
          { x: 40, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5, ease: "back.out(1.7)", stagger: 0.1, delay: 0.6 }
        );
      }, ref);
      return () => ctx.revert();
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <Layout>
      <div ref={ref} className="px-6 md:px-0">
        <section className="container max-w-3xl pt-12 md:pt-16">
          <div className="mb-12">
            <TextReveal
              as="h1"
              className="text-3xl md:text-5xl font-bold font-display mb-4"
              delay={0.1}
              stagger={0.08}
            >
              Get in Touch
            </TextReveal>
            <p className="text-muted-foreground text-lg">
              Have a project in mind? Let's build something amazing together.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-8 mb-16">
            <form onSubmit={handleSubmit} className="contact-form opacity-0 md:col-span-3 space-y-4">
              <div>
                <label className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2 block">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2 block">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="you@email.com"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2 block">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-2.5 rounded-lg bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>
              <MagneticButton strength={0.2}>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </MagneticButton>
            </form>

            <div className="md:col-span-2 space-y-6">
              <div>
                <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4">// Connect</h3>
                <div className="space-y-3">
                  {[
                    { icon: Mail, label: "hello@dev.com", href: "mailto:hello@dev.com" },
                    { icon: Github, label: "github.com/dev", href: "#" },
                    { icon: Linkedin, label: "linkedin.com/in/dev", href: "#" },
                    { icon: Twitter, label: "@dev", href: "#" },
                  ].map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className="social-link opacity-0 flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                    >
                      <item.icon className="w-4 h-4 group-hover:text-primary transition-colors" />
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Contact;
