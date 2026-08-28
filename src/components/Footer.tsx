export function Footer() {
  return (
    <footer className="bg-black text-white py-20">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="text-3xl font-black tracking-tighter uppercase italic">
            VEM <span className="text-primary">PEDALAR</span>
          </div>
          <div className="flex gap-8 text-sm font-bold uppercase tracking-widest text-white/60">
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
            <a href="#" className="hover:text-white transition-colors">Facebook</a>
            <a href="#" className="hover:text-white transition-colors">Strava</a>
          </div>
          <div className="text-sm font-bold uppercase tracking-widest text-white/40">
            © 2026 Todos os direitos reservados.
          </div>
        </div>
      </div>
    </footer>
  );
}
