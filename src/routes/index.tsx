import { createFileRoute } from "@tanstack/react-router";
import { RegistrationForm } from "@/components/RegistrationForm";
import { Trees, Zap, Flame, Users } from "lucide-react";

// Importações diretas das imagens
import heroImg from "@/assets/desktop.png";
import img6382 from "@/assets/IMG_6382.JPG.jpeg";
import img6371 from "@/assets/IMG_6371.JPG.jpeg";
import img6372 from "@/assets/IMG_6372.JPG.jpeg";
import img6380 from "@/assets/IMG_6380.JPG.jpeg";
import img6373 from "@/assets/IMG_6373.JPG.jpeg";
import img6370 from "@/assets/IMG_6370.JPG.jpeg";
import img6374 from "@/assets/IMG_6374.JPG.jpeg";
import img6377 from "@/assets/IMG_6377.JPG.jpeg";
import img6378 from "@/assets/IMG_6378.JPG.jpeg";
import img6381 from "@/assets/IMG_6381.JPG.jpeg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    title: "VEM PEDALAR | Trilha • Aventura • Superação",
    meta: [
      {
        name: "description",
        content: "Mais que um percurso, uma experiência que fica. Garanta sua vaga e encare a trilha com a gente.",
      },
      { property: "og:title", content: "VEM PEDALAR" },
      { property: "og:image", content: heroImg },
      { name: "twitter:image", content: heroImg },
    ],
  }),
});

function Header() {
  return (
    <header 
      className="sticky top-0 z-50 w-full flex items-center justify-between py-2 overflow-visible border-b border-white/10 bg-[#0c0f08]/90 px-4 backdrop-blur-md md:px-6" 
      style={{ height: '3.3rem' }}
    >
      <div 
        className="font-['Anton'] text-2xl uppercase tracking-wider text-[#f2efe2] select-none ml-[3px]" 
        style={{ marginLeft: '1rem' }}
      >
        VEM <span className="text-[#c6ff1e]">PEDALAR</span>
      </div>

      <button 
        onClick={() => document.getElementById('registration-form')?.scrollIntoView({ behavior: 'smooth' })}
        className="uppercase border-none cursor-pointer no-underline" 
        style={{
          fontFamily: "'Oswald', sans-serif",
          fontWeight: 600,
          letterSpacing: '1px',
          fontSize: '13px',
          textTransform: 'uppercase',
          background: '#c6ff1e',
          color: '#0c0f08',
          padding: '10px 18px',
          clipPath: 'polygon(6% 0, 100% 0, 94% 100%, 0 100%)',
          marginRight: '1rem'
        }}
      >
        INSCREVA-SE
      </button>
    </header>
  );
}

function Index() {
  return (
    <div className="min-h-screen selection:bg-[#c6ff1e]/30">
      <Header />

      {/* Hero Section Container */}
      <section 
        className="relative w-full h-[100dvh] bg-cover bg-no-repeat bg-[center_35%] md:bg-center overflow-hidden" 
        style={{ backgroundImage: `url(${heroImg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-0" />

        <div className="relative z-10 flex flex-col justify-between h-full container mx-auto px-4 pt-16 pb-6">
          <div 
            className="max-w-4xl md:max-w-[50%] mt-auto mb-4 space-y-3" 
            style={{ padding: '15px' }}
          >
            <h1 
              className="font-anton text-white uppercase italic break-words font-black tracking-tight leading-[0.85] block w-full my-4"
              style={{ fontSize: 'clamp(60px, 8vw, 150px)' }}
            >
              VEM <span className="text-[#c6ff1e]">PEDALAR</span>
            </h1>

            <div className="tagline-bar">
              Trilha · Aventura · Superação
            </div>

            <p className="hero-sub text-sm md:text-base leading-relaxed">
              Mais que um percurso, <strong>uma experiência que fica</strong>. Garanta sua vaga e encare a trilha com a gente — do início ao fim.
            </p>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mt-4" style={{ marginTop: '1.5rem' }}>
              <a href="#inscricao" className="btn-primary">Fazer inscrição</a>
            </div>
          </div>

          <div className="mt-0 pt-2 border-t border-white/10 w-full">
            <div className="grid grid-cols-3 gap-2 w-full text-xs md:text-sm hero-meta">
              <div><b>Data</b>18.10.26</div>
              <div><b>Local</b>Trilha do Arraial</div>
              <div><b>Vagas</b>Limitadas</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Highlights Section */}
      <section className="w-full bg-[#1c130d] z-10 relative">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center w-full items-center">
            
            <div className="feature p-0 text-center flex flex-col items-center justify-center transition-all hover:bg-black/10 md:border-r md:border-white/10 border-r border-white/10 md:border-r-0">
              <Trees className="w-9 h-9 text-[var(--acid)] mb-3 stroke-[2] overflow-visible mx-auto" aria-hidden="true" />
              <div className="space-y-1">
                <h3 className="f-title font-['Oswald'] font-bold text-sm uppercase text-[#ffffff] leading-none">Natureza</h3>
                <p className="f-sub font-['Oswald'] text-xs uppercase text-[var(--acid)] tracking-widest">De verdade</p>
              </div>
            </div>

            <div className="feature p-0 text-center flex flex-col items-center justify-center transition-all hover:bg-black/10 md:border-r md:border-white/10">
              <Zap className="w-9 h-9 text-[var(--acid)] mb-3 stroke-[2] overflow-visible mx-auto" aria-hidden="true" />
              <div className="space-y-1">
                <h3 className="f-title font-['Oswald'] font-bold text-sm uppercase text-[#ffffff] leading-none">Desafios</h3>
                <p className="f-sub font-['Oswald'] text-xs uppercase text-[var(--acid)] tracking-widest">Que movem</p>
              </div>
            </div>

            <div className="feature p-0 text-center flex flex-col items-center justify-center transition-all hover:bg-black/10 md:border-r md:border-white/10 border-r border-white/10 md:border-r-0">
              <Flame className="w-9 h-9 text-[var(--acid)] mb-3 stroke-[2] overflow-visible mx-auto" aria-hidden="true" />
              <div className="space-y-1">
                <h3 className="f-title font-['Oswald'] font-bold text-sm uppercase text-[#ffffff] leading-none">Adrenalina</h3>
                <p className="f-sub font-['Oswald'] text-xs uppercase text-[var(--acid)] tracking-widest">Início ao fim</p>
              </div>
            </div>

            <div className="feature p-0 text-center flex flex-col items-center justify-center transition-all hover:bg-black/10">
              <Users className="w-9 h-9 text-[var(--acid)] mb-3 stroke-[2] overflow-visible mx-auto" aria-hidden="true" />
              <div className="space-y-1">
                <h3 className="f-title font-['Oswald'] font-bold text-sm uppercase text-[#ffffff] leading-none">Amigos</h3>
                <p className="f-sub font-['Oswald'] text-xs uppercase text-[var(--acid)] tracking-widest">Boas histórias</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section 
        style={{
          backgroundColor: '#0c0f08',
          paddingTop: '1.5rem',
          paddingBottom: '2.5rem',
          paddingLeft: '1rem',
          paddingRight: '1rem'
        }}
      >
        <div className="container mx-auto" style={{ maxWidth: '1200px' }}>
          
          <div style={{ marginBottom: '1.25rem' }}>
            <span 
              className="font-['Oswald'] uppercase tracking-widest font-bold block" 
              style={{ color: '#c6ff1e', fontSize: '0.8rem', marginBottom: '0.25rem' }} 
            >
              ÚLTIMA EDIÇÃO
            </span>
            
            <h2 
              className="font-['Anton'] uppercase block" 
              style={{ 
                color: '#f2efe2', 
                fontSize: 'clamp(1.8rem, 4vw, 3.2rem)', 
                marginTop: '0.2rem',
                marginBottom: '0.4rem',
                lineHeight: '1.1',
                fontStyle: 'normal' 
              }} 
            >
              QUEM JÁ PEDALOU, JÁ SABE
            </h2>
            
            <p 
              className="font-['Inter'] max-w-xl block" 
              style={{ 
                color: '#c9c6b7', 
                fontSize: '0.95rem', 
                lineHeight: '1.4',
                fontStyle: 'normal' 
              }} 
            >
              Registros da última edição do Vem Pedalar — trilha, grupo e muita história pra contar.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-12">

            <div className="col-span-1 md:col-span-2 row-span-2 relative overflow-hidden rounded-xl shadow-md group">
              <img 
                src={img6382} 
                className="w-full h-full object-cover object-bottom group-hover:scale-105 transition-transform duration-500" 
                alt="Grupo de Ciclistas na Praia" 
              />
            </div>

            <div className="col-span-1 relative overflow-hidden rounded-xl shadow-md aspect-square md:aspect-auto group">
              <img 
                src={img6371} 
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" 
                alt="Pedal na areia" 
              />
            </div>

            <div className="col-span-1 relative overflow-hidden rounded-xl shadow-md aspect-square md:aspect-auto group">
              <img 
                src={img6372} 
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" 
                alt="Ciclista na trilha" 
              />
            </div>

            <div className="col-span-1 relative overflow-hidden rounded-xl shadow-md aspect-square md:aspect-auto group">
              <img 
                src={img6380} 
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" 
                alt="Grupo na mata" 
              />
            </div>

            <div className="col-span-1 relative overflow-hidden rounded-xl shadow-md aspect-square md:aspect-auto group">
              <img 
                src={img6373} 
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" 
                alt="Dupla de ciclistas" 
              />
            </div>

            <div className="col-span-1 relative overflow-hidden rounded-xl shadow-md aspect-square group">
              <img 
                src={img6370} 
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" 
                alt="Ciclista solo em ação" 
              />
            </div>

            <div className="col-span-1 relative overflow-hidden rounded-xl shadow-md aspect-square group">
              <img 
                src={img6374} 
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" 
                alt="Concentração na trilha" 
              />
            </div>

            <div className="col-span-2 relative overflow-hidden rounded-xl shadow-md aspect-[16/9] group">
              <img 
                src={img6377} 
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" 
                alt="Desafio na mata" 
              />
            </div>

            <div className="col-span-1 relative overflow-hidden rounded-xl shadow-md aspect-square group">
              <img 
                src={img6378} 
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" 
                alt="Superação com a bike" 
              />
            </div>

            <div className="col-span-1 relative overflow-hidden rounded-xl shadow-md aspect-square group">
              <img 
                src={img6381} 
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" 
                alt="Pedal técnico" 
              />
            </div>

          </div>
        </div>
      </section>

      {/* Registration Form Section */}
      <section id="inscricao" className="py-24 bg-[#2c1c10] relative">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#c6ff1e 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            <RegistrationForm />
          </div>
        </div>
      </section>

      {/* Soon Banner */}
      <section className="bg-[#c6ff1e] relative overflow-hidden h-20 md:h-24 flex items-center">
        <div className="absolute inset-0 flex items-center overflow-hidden pointer-events-none opacity-10">
          <div className="whitespace-nowrap font-anton text-[32px] md:text-[48px] uppercase italic text-[#0c0f08] animate-infinite-scroll">
            VEM PEDALAR VEM PEDALAR VEM PEDALAR VEM PEDALAR VEM PEDALAR
          </div>
        </div>
        <div className="container mx-auto px-6 text-center relative z-10 flex justify-center items-center">
          <div className="inline-block border-2 md:border-4 border-[#0c0f08] px-6 py-2 md:px-12 md:py-4 transform -rotate-1 bg-[#c6ff1e]">
            <h2 className="text-3xl md:text-6xl font-anton text-[#0c0f08] uppercase italic leading-none">18.10.2026!</h2>
            <p className="font-oswald text-xs md:text-xl font-bold text-[#0c0f08] uppercase tracking-[0.2em] md:tracking-[0.3em] mt-0.5 md:mt-1 italic">» Fique ligado «</p>
          </div>
        </div>
      </section>

      <footer className="bg-[#0c0f08] py-12 border-t border-[#c6ff1e]/5">
        <div className="container mx-auto px-6 text-center space-y-4">
          <div className="font-anton text-4xl uppercase tracking-tighter italic text-[#f2efe2]">
            VEM <span className="text-[#c6ff1e]">PEDALAR</span>
          </div>
          <p className="font-oswald text-[#c9c6b7] uppercase tracking-widest text-sm">
            Trilha • Aventura • Superação
          </p>
          <div className="pt-8 text-[#c9c6b7]/30 text-xs font-inter">
            © 2026 VEM PEDALAR. TODOS OS DIREITOS RESERVADOS.
          </div>
        </div>
      </footer>
    </div>
  );
}