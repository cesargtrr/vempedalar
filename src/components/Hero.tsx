import { Link } from "@tanstack/react-router";
import heroAsset from "@/assets/hero-cyclist.jpg.asset.json";

export function Hero() {
  return (
    <section className="relative h-[90vh] w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
      <img 
        src={heroAsset.url} 
        className="h-full w-full object-cover object-center scale-105 animate-in fade-in zoom-in duration-1000" 
        alt="Ciclista na estrada" 
      />
      <div className="container relative z-20 flex h-full flex-col justify-center text-white">
        <h1 className="text-6xl font-black tracking-tighter md:text-9xl uppercase italic drop-shadow-2xl">
          VEM <span className="text-energy-yellow">PEDALAR</span>
        </h1>
        <p className="mt-6 max-w-xl text-xl font-medium md:text-2xl drop-shadow-md">
          Um passeio sobre duas rodas, cercado pela natureza.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            to="/inscricao"
            className="rounded-full bg-energy-yellow px-10 py-5 text-xl font-black text-black transition-all hover:scale-110 hover:rotate-2 active:scale-95 shadow-[0_10px_0_0_oklch(0.7_0.2_90)]"
          >
            INSCREVA-SE
          </Link>
          <a
            href="#sobre"
            className="rounded-full border-2 border-white/50 backdrop-blur-md bg-white/10 px-10 py-5 text-xl font-bold text-white transition-all hover:bg-white/20 active:scale-95"
          >
            SAIBA MAIS
          </a>
        </div>
      </div>
    </section>
  );
}
