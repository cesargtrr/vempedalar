import { Calendar, Clock, MapPin, Route as RouteIcon } from "lucide-react";
import bikeLiftAsset from "@/assets/bike-lift.jpg.asset.json";

export function EventInfo() {
  return (
    <section id="evento" className="py-32 bg-muted/30">
      <div className="container">
        <div className="grid gap-16 lg:grid-cols-2">
          <div className="space-y-12">
            <h2 className="text-4xl font-black tracking-tight md:text-6xl uppercase italic">
              Informações do <span className="text-primary">Evento</span>
            </h2>
            
            <div className="grid gap-8 sm:grid-cols-2">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-xl text-primary shrink-0">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg uppercase tracking-wider">Data</h4>
                  <p className="text-muted-foreground">Em breve</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-xl text-primary shrink-0">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg uppercase tracking-wider">Horário</h4>
                  <p className="text-muted-foreground">Em breve</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-xl text-primary shrink-0">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg uppercase tracking-wider">Local</h4>
                  <p className="text-muted-foreground">Em breve</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-xl text-primary shrink-0">
                  <RouteIcon className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg uppercase tracking-wider">Percurso</h4>
                  <p className="text-muted-foreground">Em breve</p>
                </div>
              </div>
            </div>
            
            <div className="pt-8">
              <a 
                href="/inscricao"
                className="inline-block rounded-full bg-primary px-12 py-5 text-xl font-black text-primary-foreground transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary/20"
              >
                QUERO PARTICIPAR
              </a>
            </div>
          </div>
          
          <div className="relative rounded-3xl overflow-hidden shadow-2xl rotate-2">
             <img 
              src={bikeLiftAsset.url} 
              alt="Ciclista com bike" 
              className="h-full w-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700" 
            />
          </div>
        </div>
      </div>
    </section>
  );
}
