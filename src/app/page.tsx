import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin,
  GraduationCap,
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  Trophy,
  Rocket,
  GitPullRequest,
  Server,
  ChevronRight,
  Briefcase,
  Code2,
  Brain,
  Terminal,
  Database,
  Cloud,
  Bot,
} from "lucide-react";
import { TypingText } from "@/components/animate-ui/text/typing";

const skills = [
  { name: "Python", icon: Code2 },
  { name: "LangChain", icon: Brain },
  { name: "LangFlow", icon: Bot },
  { name: "LlamaIndex", icon: Brain },
  { name: "Pydantic", icon: Code2 },
  { name: "Crew AI", icon: Bot },
  { name: "n8n", icon: Server },
  { name: "Google AI (ADK)", icon: Cloud },
  { name: "spaCy", icon: Brain },
  { name: "FastAPI", icon: Terminal },
  { name: "PostgreSQL", icon: Database },
  { name: "Docker", icon: Server },
  { name: "Git", icon: GitPullRequest },
  { name: "Linux", icon: Terminal },
  { name: "Haskell", icon: Code2 },
  { name: "C", icon: Code2 },
  { name: "Azure", icon: Cloud },
  { name: "Selenium", icon: Bot },
];

const projects = [
  {
    title: "Styleflow",
    badge: "1st Place - IA Devs Langflow",
    description:
      "AI-powered fashion e-commerce solution that won 1st place and R$50,000 at the IA Devs Langflow competition. As CRO, I helped build a tool that uses colorimetry and AI to analyze user characteristics and recommend personalized outfits, combating cart abandonment with a tailor-made shopping experience.",
    link: "https://itforum.com.br/inteligencia-artificial/styleflow-looks-ia-vence-langflow/",
    linkText: "Read on IT Forum",
    icon: Trophy,
    gradient: "from-amber-500/20 to-orange-500/20",
    borderGlow: "hover:shadow-amber-500/10",
  },
  {
    title: "Langflow Open Source Contributions",
    badge: "Active Contributor",
    description:
      "Active contributor to Langflow, a leading open-source framework for building LLM applications. Developed new components (Regex Extractors, ArXiv, Git, DeepSeek, LLM Routers), xAI integration, language model updates (Google AI, Groq, Gemini), templates, and component refactoring.",
    link: "https://github.com/langflow-ai/langflow/commits?author=raphaelchristi",
    linkText: "View Commits on GitHub",
    icon: GitPullRequest,
    gradient: "from-emerald-500/20 to-teal-500/20",
    borderGlow: "hover:shadow-emerald-500/10",
  },
  {
    title: "NASA Rover Challenge 2019",
    badge: "13th Overall / 2nd Brazil",
    description:
      'Part of the "Alpha Team," one of four Brazilian teams at the international NASA Human Exploration Rover Challenge in Alabama, USA. Secured 13th place overall (100+ teams) and 2nd among Brazilian teams, designing and building a human-powered rover for simulated extraterrestrial terrain.',
    link: "https://www.osaqua.com.br/2019/05/14/saquarema-presente-na-nasa-human-exploration-rover-challenge-2019/",
    linkText: "Read Article",
    icon: Rocket,
    gradient: "from-blue-500/20 to-cyan-500/20",
    borderGlow: "hover:shadow-blue-500/10",
  },
  {
    title: "Internal CRM/ERP System",
    badge: "Arpa Elastic Solution",
    description:
      "Developed and implemented an internal CRM and ERP system during an internship at Arpa Elastic Solution, using PostgreSQL as the database, Power Apps for the front-end, and Python for CRUD operations, optimizing the company's internal processes.",
    link: "#",
    linkText: "Company Project",
    icon: Server,
    gradient: "from-violet-500/20 to-purple-500/20",
    borderGlow: "hover:shadow-violet-500/10",
  },
];

const experience = [
  {
    role: "AI Engineer & Researcher",
    org: "University of Porto",
    location: "Porto, Portugal",
    period: "Current",
    description:
      "Researching and developing innovative AI solutions with focus on Large Language Models, Generative AI, and multi-agent systems.",
  },
  {
    role: "CRO - Styleflow",
    org: "IA Devs Competition",
    location: "Brazil",
    period: "2024",
    description:
      "Led conversion optimization strategy for the award-winning Styleflow platform, an AI-powered fashion recommendation system.",
  },
  {
    role: "Intern - Software Developer",
    org: "Arpa Elastic Solution",
    location: "Brazil",
    period: "Previous",
    description:
      "Built internal CRM/ERP system using PostgreSQL, Power Apps, and Python, streamlining business operations.",
  },
];

export default function PortfolioPage() {
  return (
    <div className="relative flex min-h-screen flex-col text-foreground font-sans bg-background">
      {/* Noise texture overlay */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.015]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")", backgroundRepeat: "repeat" }} />

      {/* Gradient orbs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-[40%] -left-[20%] h-[80vh] w-[80vh] rounded-full bg-primary/[0.03] blur-[120px]" />
        <div className="absolute -bottom-[20%] -right-[20%] h-[60vh] w-[60vh] rounded-full bg-chart-4/[0.04] blur-[100px]" />
      </div>

      {/* Header */}
      <header className="glass sticky top-0 z-50 w-full border-b border-border/50 bg-background/70">
        <div className="container mx-auto flex h-16 max-w-screen-xl items-center justify-between px-6">
          <span className="text-sm font-semibold tracking-tight text-foreground">
            RV<span className="text-primary">.</span>
          </span>
          <nav className="hidden sm:flex items-center gap-8">
            {["About", "Skills", "Projects", "Experience", "Contact"].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
              >
                {item}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link href="https://github.com/raphaelchristi" target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-foreground">
              <Github className="h-[18px] w-[18px]" />
            </Link>
            <Link href="https://www.linkedin.com/in/raphael-valdetaro/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-foreground">
              <Linkedin className="h-[18px] w-[18px]" />
            </Link>
            <Link href="mailto:raphaelvaldetaro@gmail.com" className="text-muted-foreground transition-colors hover:text-foreground">
              <Mail className="h-[18px] w-[18px]" />
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full z-10">
        {/* Hero */}
        <section id="hero" className="w-full py-28 md:py-40 lg:py-52">
          <div className="container mx-auto px-6 max-w-screen-xl">
            <div className="max-w-3xl">
              <div className="mb-6 flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Porto, Portugal</span>
                <span className="text-border">|</span>
                <GraduationCap className="h-4 w-4" />
                <span>University of Porto</span>
              </div>
              <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
                <TypingText text="Raphael Valdetaro" cursor cursorClassName="!h-12 md:!h-16 lg:!h-20 !bg-primary" />
              </h1>
              <p className="mt-6 text-xl md:text-2xl text-gradient font-medium">
                AI Engineer & Research Developer
              </p>
              <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
                Building the future with Large Language Models, Generative AI, and multi-agent systems.
                Passionate about transforming complex problems into elegant, intelligent solutions.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="#projects"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all duration-200 hover:opacity-90 glow-sm"
                >
                  View Projects
                  <ChevronRight className="h-4 w-4" />
                </Link>
                <Link
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3 text-sm font-medium text-foreground transition-all duration-200 hover:bg-accent"
                >
                  Get in Touch
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" className="w-full py-20 md:py-28">
          <div className="container mx-auto px-6 max-w-screen-xl">
            <div className="grid md:grid-cols-[280px_1fr] gap-12 items-start">
              <div className="flex flex-col items-center md:items-start gap-5">
                <Avatar className="h-40 w-40 border-2 border-border glow">
                  <AvatarImage src="/profile_disc.png" alt="Raphael Valdetaro" />
                  <AvatarFallback className="text-5xl bg-muted text-muted-foreground">RV</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-center md:items-start gap-1">
                  <h2 className="text-xl font-semibold">Raphael Valdetaro</h2>
                  <p className="text-sm text-muted-foreground">AI Engineer from Brazil</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">About Me</p>
                <h3 className="text-3xl font-bold tracking-tight mb-6">
                  Coding my way through the<br />labyrinth of numbers
                </h3>
                <p className="text-muted-foreground text-base leading-relaxed mb-4">
                  Artificial Intelligence and Large Language Models enthusiast, passionate about research and development of innovative solutions. Currently based in Porto, Portugal, at the University of Porto.
                </p>
                <p className="text-muted-foreground text-base leading-relaxed">
                  With strong expertise in Python and Data Science, I use tools like LangChain, LangFlow, LlamaIndex, Pydantic, Crew AI, n8n, and Google AI (ADK) to build advanced Generative AI applications. My approach is driven by creativity and innovation, always focused on delivering efficient solutions to complex problems.
                </p>
                <div className="mt-8 grid grid-cols-3 gap-6">
                  <div className="text-center md:text-left">
                    <p className="text-2xl font-bold text-foreground">33+</p>
                    <p className="text-sm text-muted-foreground">Public Repos</p>
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-2xl font-bold text-foreground">50k+</p>
                    <p className="text-sm text-muted-foreground">Lines of AI Code</p>
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-2xl font-bold text-foreground">R$50k</p>
                    <p className="text-sm text-muted-foreground">Prize Won</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills */}
        <section id="skills" className="w-full py-20 md:py-28">
          <div className="container mx-auto px-6 max-w-screen-xl">
            <div className="mb-14">
              <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">Expertise</p>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Skills & Technologies</h2>
              <p className="mt-3 text-muted-foreground max-w-lg">
                The tools and technologies I use daily to build intelligent systems and AI-powered applications.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {skills.map((skill) => {
                const Icon = skill.icon;
                return (
                  <div
                    key={skill.name}
                    className="group flex items-center gap-3 rounded-lg border border-border/50 bg-card p-3.5 transition-all duration-300 hover:border-primary/30 hover:bg-accent/50 hover:glow-sm"
                  >
                    <Icon className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                    <span className="text-sm font-medium text-card-foreground">{skill.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Projects */}
        <section id="projects" className="w-full py-20 md:py-28">
          <div className="container mx-auto px-6 max-w-screen-xl">
            <div className="mb-14">
              <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">Portfolio</p>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Featured Projects</h2>
              <p className="mt-3 text-muted-foreground max-w-lg">
                Highlights from competitions, open-source contributions, and professional work.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {projects.map((project) => {
                const Icon = project.icon;
                return (
                  <Card
                    key={project.title}
                    className={`group overflow-hidden border-border/50 bg-card transition-all duration-500 hover:border-border ${project.borderGlow} hover:shadow-xl`}
                  >
                    <CardContent className="p-0">
                      <div className={`bg-gradient-to-br ${project.gradient} px-6 pt-6 pb-4 border-b border-border/30`}>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background/80 border border-border/50">
                              <Icon className="h-5 w-5 text-foreground" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-foreground">{project.title}</h3>
                              <span className="text-xs font-medium text-primary">{project.badge}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                          {project.description}
                        </p>
                        {project.link !== "#" ? (
                          <Link
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-all duration-200 hover:gap-2.5"
                          >
                            {project.linkText}
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>
                        ) : (
                          <span className="text-sm text-muted-foreground/60">{project.linkText}</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Experience */}
        <section id="experience" className="w-full py-20 md:py-28">
          <div className="container mx-auto px-6 max-w-screen-xl">
            <div className="mb-14">
              <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">Career</p>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Experience</h2>
              <p className="mt-3 text-muted-foreground max-w-lg">
                My professional journey in AI engineering and software development.
              </p>
            </div>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-0 md:left-8 top-0 bottom-0 w-px bg-border/60" />

              <div className="space-y-10">
                {experience.map((exp, index) => (
                  <div key={index} className="relative pl-8 md:pl-20">
                    {/* Timeline dot */}
                    <div className="absolute left-0 md:left-8 top-1 -translate-x-1/2 h-3 w-3 rounded-full border-2 border-primary bg-background" />

                    <div className="rounded-lg border border-border/50 bg-card p-6 transition-all duration-300 hover:border-border hover:shadow-md">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                        <div>
                          <h3 className="text-base font-semibold text-foreground">{exp.role}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Briefcase className="h-3.5 w-3.5 text-primary" />
                            <span className="text-sm text-primary">{exp.org}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5" />
                            {exp.location}
                          </span>
                          <span className="rounded-full bg-accent px-3 py-0.5 text-xs font-medium">
                            {exp.period}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{exp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="w-full py-20 md:py-28">
          <div className="container mx-auto px-6 max-w-screen-xl">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">Contact</p>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                Let&apos;s Work Together
              </h2>
              <p className="text-muted-foreground mb-10">
                Interested in collaborating on AI projects, open-source contributions, or just want to connect? Reach out through any of the channels below.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link
                  href="mailto:raphaelvaldetaro@gmail.com"
                  className="group flex flex-col items-center gap-3 rounded-lg border border-border/50 bg-card p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent transition-colors group-hover:bg-primary/10">
                    <Mail className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Email</p>
                    <p className="text-xs text-muted-foreground mt-0.5">raphaelvaldetaro@gmail.com</p>
                  </div>
                </Link>

                <Link
                  href="https://www.linkedin.com/in/raphael-valdetaro/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center gap-3 rounded-lg border border-border/50 bg-card p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent transition-colors group-hover:bg-primary/10">
                    <Linkedin className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">LinkedIn</p>
                    <p className="text-xs text-muted-foreground mt-0.5">raphael-valdetaro</p>
                  </div>
                </Link>

                <Link
                  href="https://github.com/raphaelchristi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center gap-3 rounded-lg border border-border/50 bg-card p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent transition-colors group-hover:bg-primary/10">
                    <Github className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">GitHub</p>
                    <p className="text-xs text-muted-foreground mt-0.5">raphaelchristi</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-6 max-w-screen-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Raphael Valdetaro. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with Next.js, Tailwind CSS & ShadCN
          </p>
        </div>
      </footer>
    </div>
  );
}
