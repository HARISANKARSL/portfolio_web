import { useEffect, useRef, useState } from "react";
import Layout from "@/components/Layout";
import { Mail, Github, Linkedin, Twitter, Send } from "lucide-react";

const Contact = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  useEffect(() => {
    import("gsap").then(({ default: gsap }) => {
      const ctx = gsap.context(() => {
        gsap.fromTo(".contact-title", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.2 });
        gsap.fromTo(".contact-form", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0.4 });
        gsap.fromTo(".contact-info", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0.5 });
      }, ref);
      return () => ctx.revert();
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Backend integration ready
    console.log("Form submitted:", formData);
  };

  return (
    <Layout>
      <div ref={ref} className="px-6 md:px-0">
        <section className="container max-w-3xl pt-12 md:pt-16">
          <div className="contact-title opacity-0 mb-12">
            <h1 className="text-3xl md:text-5xl font-bold font-display mb-4">
              Get in <span className="gradient-text">Touch</span>
            </h1>
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
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
              >
                <Send className="w-4 h-4" />
                Send Message
              </button>
            </form>

            <div className="contact-info opacity-0 md:col-span-2 space-y-6">
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
                      className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors group"
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
