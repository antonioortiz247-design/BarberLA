import { ArrowRight, CheckCircle2, Clock3, ShieldCheck, TrendingUp, Zap } from "lucide-react";
import { Footer } from "@/components/landing/footer";
import { FeatureCard } from "@/components/landing/feature-card";
import { Navbar } from "@/components/landing/navbar";
import { SectionTitle } from "@/components/landing/section-title";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: Clock3,
    title: "Pedido en dos pasos",
    description: "Reduce fricción con una navegación directa y botones claros para avanzar sin dudas.",
  },
  {
    icon: ShieldCheck,
    title: "Flujo confiable",
    description: "Estados visuales consistentes para informar disponibilidad, confirmación y seguimiento.",
  },
  {
    icon: Zap,
    title: "UI de alto contraste",
    description: "Jerarquía visual optimizada para lectura rápida en móviles y pantallas grandes.",
  },
];

const stats = [
  { label: "Conversión media", value: "+34%" },
  { label: "Tiempo por pedido", value: "-22%" },
  { label: "Retención mensual", value: "91%" },
  { label: "Satisfacción", value: "4.8/5" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <Navbar />

      <section className="relative overflow-hidden border-b border-[var(--color-border)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(255,131,66,0.22),transparent_40%),radial-gradient(circle_at_88%_16%,rgba(255,215,101,0.18),transparent_38%)]" />
        <div className="relative mx-auto grid w-full max-w-[1120px] gap-10 px-4 py-20 md:grid-cols-[1.08fr_0.92fr] md:px-8 md:py-28">
          <div className="space-y-7">
            <Badge>Experiencia inspirada en fast-casual</Badge>
            <h1 className="text-balance text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] md:text-6xl">
              Interfaz moderna para pedidos rápidos, clara y lista para escalar.
            </h1>
            <p className="max-w-xl text-pretty text-lg leading-8 text-[var(--color-muted)]">
              Creamos una landing demo con la misma energía visual: colores cálidos, contraste alto, tarjetas suaves y llamadas a la acción directas.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <ButtonLink href="#contacto" size="lg">
                Solicitar propuesta <ArrowRight className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink href="#features" size="lg" variant="outline">Ver componentes</ButtonLink>
            </div>
          </div>

          <Card className="self-center p-6 md:p-8">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]">Resumen visual</p>
            <ul className="space-y-4">
              {[
                "Paleta cálida con fondos oscuros y acentos vibrantes.",
                "Botones redondeados con hover elevando 2px.",
                "Tarjetas con borde translúcido y blur de fondo.",
                "Tipografía sans con títulos densos y copy breve.",
              ].map((item) => (
                <li className="flex items-start gap-3 text-sm text-[var(--color-muted)]" key={item}>
                  <CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 text-[var(--color-primary)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>

      <section className="px-4 py-16 md:px-8 md:py-24" id="features">
        <div className="mx-auto w-full max-w-[1120px]">
          <SectionTitle
            description="Componentes reutilizables y consistentes para mantener una estética homogénea en cada módulo."
            eyebrow="Features"
            title="Bloques listos para construir páginas de alto impacto"
          />
          <div className="grid gap-5 md:grid-cols-3">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--color-border)] bg-[var(--color-surface)]/45 px-4 py-16 md:px-8" id="stats">
        <div className="mx-auto w-full max-w-[1120px]">
          <SectionTitle
            description="Métricas de referencia para mostrar credibilidad y facilitar decisiones de compra."
            eyebrow="Social proof"
            title="Resultados que el usuario entiende de inmediato"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Card className="p-5" key={stat.label}>
                <p className="text-3xl font-bold text-[var(--color-text)]">{stat.value}</p>
                <p className="mt-2 text-sm text-[var(--color-muted)]">{stat.label}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 md:px-8 md:py-24" id="contacto">
        <div className="mx-auto w-full max-w-[880px] rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[linear-gradient(145deg,rgba(255,131,66,0.1),rgba(255,215,101,0.07),rgba(18,19,23,0.7))] p-8 text-center shadow-[var(--shadow-focus)] md:p-12">
          <TrendingUp className="mx-auto mb-4 h-10 w-10 text-[var(--color-primary)]" />
          <h2 className="text-balance text-3xl font-bold tracking-[-0.02em] md:text-4xl">¿Listo para replicar este look & feel en tu proyecto?</h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-[var(--color-muted)]">
            Te entregamos un sistema visual reusable con tokens, componentes y patrones listos para producción en Next.js.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="mailto:hola@urbanbites.studio" size="lg" aria-label="Enviar correo a Urban Bites Studio">
              Agendar llamada
            </ButtonLink>
            <ButtonLink href="#" size="lg" variant="ghost">Descargar guía UI</ButtonLink>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
