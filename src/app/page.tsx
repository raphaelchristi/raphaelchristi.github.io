import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { TypingText } from "@/components/animate-ui/text/typing";
import { ThemeToggleButton } from "@/components/theme-toggle-button";

// --- ShadCN UI Component Imports ---
// Certifique-se de ter adicionado estes componentes ao seu projeto via CLI
// Ex: npx shadcn@latest add card
// import { Button } from "@/components/ui/button"; // Para botões, se necessário

export default function PortfolioPage() {
  return (
    <div className="relative flex min-h-screen flex-col text-foreground font-sans bg-background">
      {/* Cabeçalho Novo */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 max-w-screen-2xl items-center">
          <nav className="flex items-center space-x-4 lg:space-x-6 mr-6">
            <Link href="#about" className="text-sm font-medium text-muted-foreground transition-all duration-200 hover:text-primary hover:-translate-y-0.5">
              About
            </Link>
            <Link href="#projects" className="text-sm font-medium text-muted-foreground transition-all duration-200 hover:text-primary hover:-translate-y-0.5">
              Projects
            </Link>
            <Link href="#contact" className="text-sm font-medium text-muted-foreground transition-all duration-200 hover:text-primary hover:-translate-y-0.5">
              Contact
            </Link>
          </nav>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <ThemeToggleButton />
          </div>
        </div>
      </header>

      {/* Conteúdo Principal agora sobre o fundo animado */}
      <main className="flex-1 w-full z-10">
        {/* Seção Hero - Conforme a nova imagem */}
        <section id="hero" className="w-full py-24 md:py-32 lg:py-40 text-center">
          <div className="container mx-auto px-4 md:px-6 max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-foreground">
              <TypingText text="Raphael Valdetaro" />
            </h1>
            <p className="mt-4 text-lg text-muted-foreground md:text-xl">
              Research Engineer & LLM Developer
            </p>
            {/* Botão de Contato opcional, se quiser manter */}
            {/* 
            <div className="mt-10">
              <Link 
                href="#contact" 
                className="inline-flex h-12 items-center justify-center rounded-md bg-gray-900 px-8 text-base font-medium text-white shadow transition-colors hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50"
              >
                Get in Touch
              </Link>
            </div> 
            */}
          </div>
        </section>

        {/* Seção Sobre Mim */}
        <section id="about" className="w-full py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl">
            <Card className="overflow-hidden shadow-lg border-border bg-card text-card-foreground">
              <div className="md:flex">
                <div className="md:w-1/3 p-6 flex flex-col items-center justify-center">
                  <Avatar className="h-32 w-32 md:h-36 md:w-36 border-4 border-background shadow-md">
                    <AvatarImage src="/profile_disc.png" alt="Raphael Valdetaro" />
                    <AvatarFallback className="text-4xl bg-muted text-muted-foreground">RV</AvatarFallback>
                  </Avatar>
                  <h2 className="mt-5 text-xl font-semibold text-foreground">About Me</h2>
                </div>
                <div className="md:w-2/3 p-8">
                  <p className="text-muted-foreground text-base leading-relaxed">
                    Artificial Intelligence and Large Language Models (LLMs) enthusiast, passionate about research and development of innovative solutions. With strong expertise in Python and Data Science, I use tools like LangChain, LangFlow, LlamaIndex, Pydantic, Crew AI, n8n, and Google AI (adk-google) to build advanced Generative AI applications. My approach is driven by creativity and innovation, always focused on delivering efficient solutions to complex problems.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Seção Habilidades - Conforme a nova imagem */}
        <section id="skills" className="w-full py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6 max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">Skills</h2>
              <p className="mt-3 max-w-xl mx-auto text-md text-muted-foreground">
                Technologies and tools I use to build solutions.
              </p>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
              {[
                "Python", "LangChain", "LangFlow", "LlamaIndex", "Pydantic", "Crew AI",
                "n8n", "Google AI (ADK)", "spaCy", "Git", "GitHub", "Haskell", "C",
                "Linux", "FastAPI", "PostgreSQL", "Shadcn UI"
              ].map((skill) => (
                <div key={skill} className="flex items-center justify-center p-3 bg-card rounded-md shadow-sm border border-border transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-105 hover:-translate-y-1">
                  <p className="text-sm font-medium text-card-foreground text-center">{skill}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Seção Projetos - Conforme a nova imagem */}
        <section id="projects" className="w-full py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6 max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">Projects</h2>
              <p className="mt-3 max-w-xl mx-auto text-md text-muted-foreground">
                Some of the work and contributions I&apos;ve made.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Projeto 1 - Styleflow */}
              <Card className="overflow-hidden shadow-md border-border bg-card text-card-foreground transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Styleflow - 1st Place IA Devs Langflow</h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    AI solution for fashion e-commerce, achieving 1st place and a R$ 50,000 prize in the Langflow IA Devs competition, where it was developed. As the team&apos;s CRO, I contributed to this tool that uses colorimetry and AI to analyze user characteristics and recommend personalized outfits, combating cart abandonment and offering a tailor-made shopping experience. Since the competition, we have enhanced the solution with more efficient AI models and prompts for various occasions.
                  </p>
                  <Link href="https://itforum.com.br/inteligencia-artificial/styleflow-looks-ia-vence-langflow/" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary transition-colors duration-200 hover:text-primary/90">
                     Read Article on IT Forum
                  </Link>
                </CardContent>
              </Card>
              {/* Projeto 2 - Arpa Solutions */}
              <Card className="overflow-hidden shadow-md border-border bg-card text-card-foreground transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Internal CRM/ERP System</h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    During an internship at Arpa Elastic Solution, I developed and implemented an internal CRM and ERP system, using PostgreSQL as the database, Power Apps for the front-end, and Python for CRUD operations, optimizing the company&apos;s internal processes.
                  </p>
                  <Link href="#" className="text-sm font-medium text-primary transition-colors duration-200 hover:text-primary/90">
                     Details (Placeholder)
                  </Link>
                </CardContent>
              </Card>

              {/* Projeto Contribuições Langflow */}
              <Card className="overflow-hidden shadow-md border-border bg-card text-card-foreground transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Contributions to Langflow (Open Source)</h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    Active contributor to Langflow, a leading open-source framework for building LLM applications. My contributions include the development of new components (Regex Pattern Extractors, ArXiv, Git, DeepSeek Models, LLM Routers), xAI integration, addition and updating of language models (Google AI, Groq, Gemini), creation of templates (YouTube Video Analysis), and refactoring/improvement of existing components to optimize performance and usability.
                  </p>
                  <Link href="https://github.com/langflow-ai/langflow/commits?author=raphaelchristi" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary transition-colors duration-200 hover:text-primary/90">
                    View Commits on GitHub
                  </Link>
                </CardContent>
              </Card>

              {/* Projeto NASA Rover Challenge */}
              <Card className="overflow-hidden shadow-md border-border bg-card text-card-foreground transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2">NASA Human Exploration Rover Challenge 2019</h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    In April 2019, I had the honor of being part of the &quot;Alpha Team,&quot; one of four Brazilian teams representing the country in this international NASA competition held in Alabama, USA. Our team secured 13th place overall (out of 100+ international teams) and 2nd place among Brazilian teams. This project involved designing, building, and testing a human-powered rover to traverse a simulated extraterrestrial terrain.
                  </p>
                  <Link href="https://www.osaqua.com.br/2019/05/14/saquarema-presente-na-nasa-human-exploration-rover-challenge-2019/" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary transition-colors duration-200 hover:text-primary/90">
                    Read News Article (Portuguese)
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Seção Contato - Formulário Conforme a Imagem */}
        <section id="contact" className="w-full py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6 max-w-2xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
                Contact Me
              </h2>
              <p className="mt-3 text-md text-muted-foreground">
                Feel free to reach out via the form below or connect with me on social media.
              </p>
            </div>
            
            <form className="space-y-6 bg-card p-8 rounded-lg shadow-xl border-border">
              <div>
                <Label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">Name</Label>
                <Input type="text" name="name" id="name" placeholder="Your Name" className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-ring" />
              </div>
              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">Email</Label>
                <Input type="email" name="email" id="email" placeholder="Your Email" className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-ring" />
              </div>
              <div>
                <Label htmlFor="message" className="block text-sm font-medium text-foreground mb-1">Message</Label>
                <Textarea name="message" id="message" rows={4} placeholder="Your Message" className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-ring" />
              </div>
              <div>
                <Button type="submit" className="w-full bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold transition-colors duration-200">
                  Send Message
                </Button>
              </div>
            </form>
            
            {/* Links de contato social (opcional, se quiser manter abaixo do formulário) */}
            <div className="mt-12 text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Or find me on:
              </p>
              <p className="text-sm text-muted-foreground">
                Email: <Link href="mailto:raphaelvaldetaro@gmail.com" className="hover:underline font-medium text-primary">raphaelvaldetaro@gmail.com</Link>
              </p>
              <p className="text-sm text-muted-foreground">
                LinkedIn: <Link href="https://www.linkedin.com/in/raphael-valdetaro/" target="_blank" rel="noopener noreferrer" className="hover:underline font-medium text-primary">linkedin.com/in/raphael-valdetaro</Link>
              </p>
              <p className="text-sm text-muted-foreground">
                GitHub: <Link href="https://github.com/raphaelchristi" target="_blank" rel="noopener noreferrer" className="hover:underline font-medium text-primary">github.com/raphaelchristi</Link>
              </p>
            </div>
        </div>
        </section>
      </main>

      <footer className="py-8 text-center bg-card">
        <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} Raphael Valdetaro. All rights reserved.</p>
      </footer>
    </div>
  );
}
