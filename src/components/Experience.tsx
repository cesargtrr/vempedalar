import adventureAsset from "@/assets/adventure-group.jpg.asset.json";
import communityAsset from "@/assets/community-group.jpg.asset.json";

export function Experience() {
  return (
    <section className="py-24 bg-background">
      <div className="container">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl">
            <img 
              src={adventureAsset.url} 
              alt="Ciclistas na trilha" 
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-110" 
            />
          </div>
          <div className="space-y-12">
            <div className="space-y-4">
              <h2 className="text-4xl font-black tracking-tight md:text-6xl uppercase italic text-nature-green">
                Aventura & Natureza
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Explore caminhos, trilhas e paisagens que só o pedal proporciona. Conecte-se com o que há de mais puro no esporte ao ar livre.
              </p>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="p-8 rounded-3xl bg-sky-blue/10 border border-sky-blue/20">
                <div className="text-3xl mb-4">🚴</div>
                <h3 className="text-xl font-bold mb-2">PEDAL</h3>
                <p className="text-muted-foreground">Movimente-se, desafie seus limites e aproveite cada quilômetro.</p>
              </div>
              <div className="p-8 rounded-3xl bg-nature-green/10 border border-nature-green/20">
                <div className="text-3xl mb-4">🌿</div>
                <h3 className="text-xl font-bold mb-2">NATUREZA</h3>
                <p className="text-muted-foreground">Explore caminhos, trilhas e paisagens incríveis.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-32 grid gap-16 lg:grid-cols-2 lg:items-center">
          <div className="order-2 lg:order-1 space-y-8">
            <h2 className="text-4xl font-black tracking-tight md:text-6xl uppercase italic text-sky-blue">
              Pedalar junto é melhor
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              O VEM PEDALAR é sobre comunidade. Conheça pessoas, compartilhe histórias e viva a experiência de pedalar em grupo.
            </p>
            <div className="p-8 rounded-3xl bg-energy-yellow/10 border border-energy-yellow/20">
              <div className="text-3xl mb-4">🤝</div>
              <h3 className="text-xl font-bold mb-2">COMUNIDADE</h3>
              <p className="text-muted-foreground">Conheça pessoas e compartilhe a experiência inesquecível.</p>
            </div>
          </div>
          <div className="order-1 lg:order-2 relative aspect-video overflow-hidden rounded-3xl shadow-2xl">
            <img 
              src={communityAsset.url} 
              alt="Grupo de ciclistas" 
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-110" 
            />
          </div>
        </div>
      </div>
    </section>
  );
}
