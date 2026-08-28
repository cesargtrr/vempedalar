export function About() {
  return (
    <section id="sobre" className="py-32 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-nature-green/5 -skew-x-12 translate-x-1/2" />
      <div className="container relative z-10">
        <div className="max-w-3xl">
          <h2 className="text-4xl font-black tracking-tight md:text-7xl uppercase italic mb-8">
            Mais que um pedal. <span className="text-nature-green">Uma experiência.</span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-medium">
            O VEM PEDALAR reúne pessoas que compartilham a paixão pelo ciclismo, pela natureza e por novas experiências. Um momento para sair da rotina, conhecer novos caminhos e aproveitar o percurso ao lado de outras pessoas.
          </p>
        </div>
      </div>
    </section>
  );
}
