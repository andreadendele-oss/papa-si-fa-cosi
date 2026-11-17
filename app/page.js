'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Camera, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Bookmark, 
  Trash2, 
  Save, 
  Check, 
  RefreshCw,
  Palette,
  ShieldCheck,
  Dices
} from 'lucide-react';

// PALETTE COLORI GUARDAROBA
const PALETTE_COLORI = [
  { id: 'bianco', nome: 'Bianco Ottico', hex: '#FFFFFF', bordo: true },
  { id: 'panna', nome: 'Bianco Panna / Avorio', hex: '#FAF3E0', bordo: true },
  { id: 'nero', nome: 'Nero Notte', hex: '#1C1917' },
  { id: 'blu_navy', nome: 'Blu Scuro / Navy', hex: '#101D38' },
  { id: 'blu_reale', nome: 'Blu Reale', hex: '#1D4ED8' },
  { id: 'celeste', nome: 'Celeste Camicia', hex: '#93C5FD' },
  { id: 'jeans_chiaro', nome: 'Jeans Denim Chiaro', hex: '#60A5FA' },
  { id: 'jeans_scuro', nome: 'Jeans Denim Scuro', hex: '#1E3A8A' },
  { id: 'beige', nome: 'Beige Sabbia', hex: '#D2B48C' },
  { id: 'cammello', nome: 'Cammello / Corda', hex: '#C19A6B' },
  { id: 'marrone', nome: 'Marrone Cuoio', hex: '#633B23' },
  { id: 'marrone_scuro', nome: 'Testa di Moro', hex: '#3B2314' },
  { id: 'grigio_chiaro', nome: 'Grigio Perla', hex: '#CBD5E1' },
  { id: 'antracite', nome: 'Grigio Antracite', hex: '#334155' },
  { id: 'verde_oliva', nome: 'Verde Oliva / Cargo', hex: '#556B2F' },
  { id: 'verde_salvia', nome: 'Verde Salvia Chiaro', hex: '#8A9A86' },
  { id: 'verde_bosco', nome: 'Verde Bosco Scuro', hex: '#19381F' },
  { id: 'bordeaux', nome: 'Bordeaux / Vinaccia', hex: '#581825' },
  { id: 'terracotta', nome: 'Ruggine / Terracotta', hex: '#9C4123' },
  { id: 'senape', nome: 'Giallo Senape', hex: '#CA8A04' },
  { id: 'rosa_chiaro', nome: 'Rosa Pastello', hex: '#F9A8D4' }
];

// OUTFIT PERFETTI PER LA ROULETTE
const OUTFIT_ROULETTE = [
  { sopra: 'Blu Scuro / Navy', sotto: 'Beige Sabbia', scarpe: 'Marrone Cuoio', giacca: 'Giacca Blu scuro' },
  { sopra: 'Bianco Ottico', sotto: 'Jeans Denim Chiaro', scarpe: 'Bianco Ottico', giacca: 'Giubbotto Marrone' },
  { sopra: 'Celeste Camicia', sotto: 'Grigio Antracite', scarpe: 'Testa di Moro', giacca: 'Cappotto Scuro' },
  { sopra: 'Bianco Panna / Avorio', sotto: 'Verde Oliva / Cargo', scarpe: 'Marrone Cuoio', giacca: 'Cardigan Beige' },
  { sopra: 'Bordeaux / Vinaccia', sotto: 'Beige Sabbia', scarpe: 'Marrone Cuoio', giacca: 'Blazer Blu' },
  { sopra: 'Grigio Perla', sotto: 'Blu Scuro / Navy', scarpe: 'Marrone Cuoio', giacca: 'Giacca Grigia' }
];

// REGOLE DI ABBINAMENTO
const REGOLE_ABBINAMENTO = {
  'Beige Sabbia': {
    sopra: ['Blu Scuro / Navy', 'Bianco Ottico', 'Celeste Camicia', 'Verde Salvia Chiaro', 'Bordeaux / Vinaccia'],
    scarpe: ['Marrone Cuoio', 'Bianco Ottico', 'Testa di Moro'],
    giacca: 'Blazer Blu Scuro o Camoscio Marrone',
    consiglio: 'Il beige con il blu scuro è il massimo della classe. Evita maglie dello stesso beige dei pantaloni!',
    look1: { tipo: 'Casual Pulito', top: 'Blu Scuro / Navy', scarpe: 'Bianco Ottico' },
    look2: { tipo: 'Elegante Domenica', top: 'Celeste Camicia', scarpe: 'Marrone Cuoio' }
  },
  'Blu Scuro / Navy': {
    sopra: ['Bianco Ottico', 'Celeste Camicia', 'Grigio Perla', 'Beige Sabbia', 'Bordeaux / Vinaccia'],
    scarpe: ['Marrone Cuoio', 'Testa di Moro', 'Bianco Ottico'],
    giacca: 'Giacca Grigio Chiaro o Cardigan Beige',
    consiglio: 'Il blu scuro predilige sempre scarpe color cuoio o cognac. Niente scarpe nere!',
    look1: { tipo: 'Casual Giovanile', top: 'Bianco Ottico', scarpe: 'Bianco Ottico' },
    look2: { tipo: 'Signore a Cena', top: 'Celeste Camicia', scarpe: 'Marrone Cuoio' }
  },
  'Nero Notte': {
    sopra: ['Bianco Ottico', 'Grigio Perla', 'Grigio Antracite', 'Bordeaux / Vinaccia'],
    scarpe: ['Nero Notte', 'Bianco Ottico'],
    giacca: 'Giacca Nera o Cappotto Grigio',
    consiglio: 'ATTENZIONE: Non mettere mai maglia o giacca blu scuro sui pantaloni neri!',
    look1: { tipo: 'Total Black', top: 'Nero Notte', scarpe: 'Nero Notte' },
    look2: { tipo: 'Classico Bianco/Nero', top: 'Bianco Ottico', scarpe: 'Bianco Ottico' }
  },
  'Jeans Denim Chiaro': {
    sopra: ['Bianco Ottico', 'Blu Scuro / Navy', 'Grigio Antracite', 'Bordeaux / Vinaccia', 'Verde Bosco Scuro'],
    scarpe: ['Bianco Ottico', 'Marrone Cuoio'],
    giacca: 'Giacca Sportiva Blu o Giubbotto Marrone',
    consiglio: 'Con il jeans chiaro la camicia bianca o la polo blu navy non sbagliano mai.',
    look1: { tipo: 'Sportivo', top: 'Bianco Ottico', scarpe: 'Bianco Ottico' },
    look2: { tipo: 'Aperitivo', top: 'Blu Scuro / Navy', scarpe: 'Marrone Cuoio' }
  },
  'Jeans Denim Scuro': {
    sopra: ['Bianco Ottico', 'Grigio Perla', 'Cammello / Corda', 'Bordeaux / Vinaccia', 'Verde Oliva / Cargo'],
    scarpe: ['Marrone Cuoio', 'Bianco Ottico'],
    giacca: 'Blazer Grigio o Cardigan Cammello',
    consiglio: 'Il jeans scuro è versatile come un pantalone sartoriale!',
    look1: { tipo: 'Casual Smart', top: 'Cammello / Corda', scarpe: 'Marrone Cuoio' },
    look2: { tipo: 'Semplice & Top', top: 'Bianco Ottico', scarpe: 'Bianco Ottico' }
  },
  'Verde Oliva / Cargo': {
    sopra: ['Beige Sabbia', 'Bianco Panna / Avorio', 'Blu Scuro / Navy', 'Nero Notte'],
    scarpe: ['Marrone Cuoio', 'Bianco Ottico'],
    giacca: 'Giubbotto Marrone o Maglia Beige',
    consiglio: 'Il verde oliva è moderno: abbinalo a toni terra (beige, panna, marrone).',
    look1: { tipo: 'Weekend', top: 'Beige Sabbia', scarpe: 'Marrone Cuoio' },
    look2: { tipo: 'Città', top: 'Bianco Panna / Avorio', scarpe: 'Bianco Ottico' }
  },
  'Grigio Antracite': {
    sopra: ['Bianco Ottico', 'Celeste Camicia', 'Rosa Pastello', 'Bordeaux / Vinaccia', 'Nero Notte'],
    scarpe: ['Nero Notte', 'Testa di Moro', 'Bianco Ottico'],
    giacca: 'Giacca Nera o Blu Notte',
    consiglio: 'I pantaloni antracite sono perfetti per le occasioni formali o cene fuori.',
    look1: { tipo: 'Elegante', top: 'Celeste Camicia', scarpe: 'Testa di Moro' },
    look2: { tipo: 'Moderno', top: 'Bianco Ottico', scarpe: 'Nero Notte' }
  }
};

// COMPONENTE: BOLLINO COLORE VISIVO
function BollinoColore({ nome, misura = 'normale', mostraNome = true }) {
  const c = PALETTE_COLORI.find(item => item.nome === nome) || { hex: '#9CA3AF', bordo: false };
  const dim = misura === 'piccolo' ? 'w-3.5 h-3.5' : misura === 'grande' ? 'w-6 h-6' : 'w-4 h-4';

  return (
    <div className="inline-flex items-center gap-1.5 align-middle">
      <span 
        className={`${dim} rounded-full shrink-0 shadow-sm ${c.bordo ? 'border border-stone-300' : 'border border-black/10'}`}
        style={{ backgroundColor: c.hex }}
      />
      {mostraNome && <span className="text-xs font-bold text-stone-800">{nome}</span>}
    </div>
  );
}

// COMPONENTE: BOTTONE SARTORIALE
function BottoneSartoriale({ onClick, attivo = false, children, variante = 'corno', className = '' }) {
  const stili = {
    corno: attivo 
      ? 'bg-[#3E2723] text-amber-50 border-[#22130C] ring-2 ring-[#795548] shadow-md' 
      : 'bg-[#53382C] text-[#F5EBE1] border-[#3E2723] hover:bg-[#432A20] shadow-sm',
    avorio: attivo 
      ? 'bg-[#F2ECE4] text-[#2B1B17] border-[#BCAAA4] ring-2 ring-[#8D6E63] shadow-md' 
      : 'bg-white text-[#4E342E] border-[#E6DCD1] hover:bg-[#F9F6F0] shadow-sm',
    viola: 'bg-[#6B21A8] text-white border-[#581C87] hover:bg-[#7E22CE] shadow-md'
  };

  return (
    <button
      onClick={onClick}
      className={`relative inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border text-xs sm:text-sm font-bold transition-all active:scale-95 ${stili[variante]} ${className}`}
    >
      <span className="w-2 h-2 rounded-full bg-black/20 shrink-0 border border-white/20" />
      <span>{children}</span>
    </button>
  );
}

export default function Home() {
  const [tab, setTab] = useState('consigli');
  const [coloreScelto, setColoreScelto] = useState('Beige Sabbia');

  // Scanner Fotocamera
  const fileInputRef = useRef(null);
  const [coloreRilevato, setColoreRilevato] = useState(null);
  const [fotoCaricata, setFotoCaricata] = useState(null);
  const [inAnalisi, setInAnalisi] = useState(false);

  // Semaforo & Roulette
  const [semSopra, setSemSopra] = useState('Blu Scuro / Navy');
  const [semSotto, setSemSotto] = useState('Beige Sabbia');
  const [semScarpe, setSemScarpe] = useState('Marrone Cuoio');
  const [daRoulette, setDaRoulette] = useState(false);
  const [inGiroRoulette, setInGiroRoulette] = useState(false);

  // Supabase
  const [completi, setCompleti] = useState([]);
  const [salvato, setSalvato] = useState(false);
  const [inSalvataggio, setInSalvataggio] = useState(false);

  async function caricaCompleti() {
    try {
      const { data, error } = await supabase
        .from('papa_outfits')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Errore lettura completi:', error);
      } else if (data) {
        setCompleti(data);
      }
    } catch (e) {
      console.error('Catch caricaCompleti:', e);
    }
  }

  useEffect(() => {
    caricaCompleti();
  }, []);

  // SALVATAGGIO ROBUSTO CON GESTIONE ERRORI
  async function salvaCompleto(top, bot, shoes, note) {
    try {
      setInSalvataggio(true);
      const nuovoOutfit = {
        title: `Completo ${bot}`,
        top_piece: top,
        bottom_piece: bot,
        shoes_piece: shoes,
        notes: note || 'Consigliato'
      };

      const { data, error } = await supabase
        .from('papa_outfits')
        .insert([nuovoOutfit])
        .select();

      if (error) {
        console.error('Errore salvataggio:', error);
        alert(`Errore Supabase: ${error.message} (Codice: ${error.code})`);
      } else {
        setSalvato(true);
        setTimeout(() => setSalvato(false), 2500);
        await caricaCompleti();
      }
    } catch (err) {
      console.error('Catch salvataggio:', err);
      alert(`Errore di connessione: ${err.message}`);
    } finally {
      setInSalvataggio(false);
    }
  }

  async function eliminaCompleto(id) {
    const { error } = await supabase.from('papa_outfits').delete().eq('id', id);
    if (!error) caricaCompleti();
  }

  // FOTOCAMERA SCANNER
  function analizzaFoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setInAnalisi(true);
    const imageUrl = URL.createObjectURL(file);
    setFotoCaricata(imageUrl);

    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 100;
      canvas.height = 100;
      ctx.drawImage(img, 0, 0, 100, 100);

      const pixel = ctx.getImageData(45, 45, 10, 10).data;
      let r = 0, g = 0, b = 0, count = 0;
      for (let i = 0; i < pixel.length; i += 4) {
        r += pixel[i];
        g += pixel[i + 1];
        b += pixel[i + 2];
        count++;
      }
      r = Math.round(r / count);
      g = Math.round(g / count);
      b = Math.round(b / count);

      let minDistance = Infinity;
      let match = PALETTE_COLORI[0];

      PALETTE_COLORI.forEach((col) => {
        const hex = col.hex.replace('#', '');
        const cr = parseInt(hex.substring(0, 2), 16);
        const cg = parseInt(hex.substring(2, 4), 16);
        const cb = parseInt(hex.substring(4, 6), 16);
        const dist = Math.sqrt((r - cr) ** 2 + (g - cg) ** 2 + (b - cb) ** 2);
        if (dist < minDistance) {
          minDistance = dist;
          match = col;
        }
      });

      setColoreRilevato(match);
      setInAnalisi(false);
    };
  }

  // GIRA LA ROULETTE DI PAPÀ
  function giraRoulette() {
    setInGiroRoulette(true);
    setDaRoulette(false);

    let count = 0;
    const intervallo = setInterval(() => {
      const randomLook = OUTFIT_ROULETTE[Math.floor(Math.random() * OUTFIT_ROULETTE.length)];
      setSemSopra(randomLook.sopra);
      setSemSotto(randomLook.sotto);
      setSemScarpe(randomLook.scarpe);
      count++;

      if (count > 8) {
        clearInterval(intervallo);
        const scelto = OUTFIT_ROULETTE[Math.floor(Math.random() * OUTFIT_ROULETTE.length)];
        setSemSopra(scelto.sopra);
        setSemSotto(scelto.sotto);
        setSemScarpe(scelto.scarpe);
        setDaRoulette(true);
        setInGiroRoulette(false);
      }
    }, 100);
  }

  // Valutazione Semaforo
  function calcolaSemaforo() {
    if ((semSopra.includes('Blu') && semSotto.includes('Nero')) || (semSopra.includes('Nero') && semSotto.includes('Blu'))) {
      return {
        colore: 'rosso',
        titolo: 'PAPÀ, FERMATI! QUESTO NO! 🚨',
        testo: 'Blu Scuro e Nero insieme sono severamente vietati nel guardaroba di un gentiluomo!',
        voto: '3 / 10'
      };
    }
    if (semSotto.includes('Nero') && semScarpe.includes('Marrone')) {
      return {
        colore: 'rosso',
        titolo: 'ERRORE DI SCARPA! ❌',
        testo: 'Sotto il pantalone nero la scarpa marrone stona. Metti scarpa nera o sneaker bianca!',
        voto: '4 / 10'
      };
    }
    if ((semSotto.includes('Beige') && semSopra.includes('Blu')) || (semSotto.includes('Jeans') && semSopra.includes('Bianco'))) {
      return {
        colore: 'verde',
        titolo: 'FIGURINO SARTORIALE! 👑',
        testo: 'Abbinamento perfetto! Sei pronto per qualsiasi occasione e farai un figurone.',
        voto: '10 / 10'
      };
    }
    return {
      colore: 'verde',
      titolo: 'PROMOSSO DAL FIGLIO! 👍',
      testo: 'Colori equilibrati e sobri. Look approvato!',
      voto: '8 / 10'
    };
  }

  const verdetto = calcolaSemaforo();
  const info = REGOLE_ABBINAMENTO[coloreScelto] || REGOLE_ABBINAMENTO['Beige Sabbia'];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2B1B17] font-sans pb-16">
      
      {/* HEADER */}
      <header className="bg-white border-b border-[#E8DFC8] p-4 sm:p-5 sticky top-0 z-20 shadow-sm">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">👔</span>
            <div>
              <h1 className="text-xl sm:text-2xl font-serif font-black tracking-wide text-[#2B1B17]">
                PAPÀ, SI FA COSÌ!
              </h1>
              <p className="text-xs text-[#7A695C] font-semibold uppercase tracking-wider">
                Sartoria e Abbinamenti dal Vivo
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* NAVIGAZIONE */}
      <nav className="max-w-2xl mx-auto w-full px-4 pt-4">
        <div className="grid grid-cols-4 gap-1.5 bg-[#EFE6DC] p-1.5 rounded-full border border-[#DFD5C6]">
          <BottoneSartoriale onClick={() => setTab('consigli')} attivo={tab === 'consigli'} variante="corno">
            <Palette className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Palette</span>
          </BottoneSartoriale>

          <BottoneSartoriale onClick={() => setTab('scanner')} attivo={tab === 'scanner'} variante="corno">
            <Camera className="w-3.5 h-3.5" />
            <span>Foto</span>
          </BottoneSartoriale>

          <BottoneSartoriale onClick={() => setTab('semaforo')} attivo={tab === 'semaforo'} variante="corno">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Semaforo</span>
          </BottoneSartoriale>

          <BottoneSartoriale onClick={() => setTab('salvati')} attivo={tab === 'salvati'} variante="corno">
            <Bookmark className="w-3.5 h-3.5" />
            <span>Salvati ({completi.length})</span>
          </BottoneSartoriale>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto w-full px-4 pt-5">
        
        {/* ========================================================= */}
        {/* TAB 1: PALETTE E VARIANTI                                 */}
        {/* ========================================================= */}
        {tab === 'consigli' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-3xl border border-[#E8DFC8] shadow-sm">
              <label className="text-xs font-bold uppercase tracking-wider text-[#7A695C] block mb-3">
                1. Scegli il colore del tuo pantalone:
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-64 overflow-y-auto p-1 pr-2">
                {PALETTE_COLORI.map((c) => {
                  const attivo = coloreScelto === c.nome;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setColoreScelto(c.nome)}
                      className={`flex items-center gap-2.5 p-2.5 rounded-2xl border text-left transition-all ${
                        attivo 
                          ? 'bg-[#F2ECE4] border-[#795548] ring-2 ring-[#795548] shadow-sm' 
                          : 'bg-[#FAF8F5] border-[#E8DFC8] hover:bg-white'
                      }`}
                    >
                      <span 
                        className={`w-6 h-6 rounded-full shrink-0 shadow-sm ${c.bordo ? 'border border-stone-300' : 'border border-black/10'}`}
                        style={{ backgroundColor: c.hex }}
                      />
                      <span className={`text-xs font-bold truncate ${attivo ? 'text-[#3E2723]' : 'text-stone-700'}`}>
                        {c.nome}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CONSIGLIO */}
            <div className="bg-[#FAF4EB] border-2 border-dashed border-[#D2B48C] p-4 rounded-3xl flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-[#B45309] shrink-0" />
              <p className="text-xs sm:text-sm text-[#4E342E] font-medium leading-relaxed italic">
                "{info.consiglio}"
              </p>
            </div>

            {/* ABBINAMENTI VISIVI */}
            <div className="bg-white p-5 rounded-3xl border border-[#E8DFC8] shadow-sm space-y-4">
              <h3 className="font-serif font-extrabold text-base text-[#2B1B17] flex items-center gap-2">
                <span>Abbinamenti per:</span>
                <BollinoColore nome={coloreScelto} />
              </h3>

              <div>
                <p className="text-xs font-bold text-[#7A695C] uppercase tracking-wider mb-2">
                  👕 Sopra consigliati:
                </p>
                <div className="flex flex-wrap gap-2">
                  {info.sopra.map((nomeColore) => (
                    <div key={nomeColore} className="bg-[#FAF8F5] border border-[#E8DFC8] px-3 py-1.5 rounded-xl shadow-sm">
                      <BollinoColore nome={nomeColore} />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-[#7A695C] uppercase tracking-wider mb-2">
                  👞 Scarpe consigliate:
                </p>
                <div className="flex flex-wrap gap-2">
                  {info.scarpe.map((nomeColore) => (
                    <div key={nomeColore} className="bg-[#FAF8F5] border border-[#E8DFC8] px-3 py-1.5 rounded-xl shadow-sm">
                      <BollinoColore nome={nomeColore} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* VARIANTI CON TASTO SALVA FUNZIONANTE */}
            <div className="space-y-3">
              <h4 className="text-xs font-serif font-black uppercase tracking-wider text-[#7A695C]">
                Look pronti da indossare:
              </h4>

              {[info.look1, info.look2].map((look, idx) => (
                <div key={idx} className="bg-white border border-[#E8DFC8] p-4 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                  <div>
                    <span className="text-[11px] font-black uppercase text-[#78350F] bg-[#F5ECE0] px-2.5 py-0.5 rounded-full border border-[#E2D2BE]">
                      {look.tipo}
                    </span>
                    <div className="mt-2.5 flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-stone-500">Sopra:</span>
                        <BollinoColore nome={look.top} />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-stone-500">Pantaloni:</span>
                        <BollinoColore nome={coloreScelto} />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-stone-500">Scarpe:</span>
                        <BollinoColore nome={look.scarpe} />
                      </div>
                    </div>
                  </div>

                  <BottoneSartoriale
                    onClick={() => salvaCompleto(look.top, coloreScelto, look.scarpe, look.tipo)}
                    variante="avorio"
                    className="self-start sm:self-center shrink-0"
                  >
                    <Save className="w-3.5 h-3.5 text-[#78350F]" />
                    <span>{inSalvataggio ? 'Salvataggio...' : 'Salva Completo'}</span>
                  </BottoneSartoriale>
                </div>
              ))}
            </div>

            {salvato && (
              <div className="bg-[#2E7D32] text-white font-bold p-3.5 rounded-2xl text-center text-sm flex items-center justify-center gap-2 shadow-lg animate-bounce">
                <Check className="w-5 h-5" />
                <span>Completo salvato con successo nel tuo armadio!</span>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: FOTOCAMERA                                         */}
        {/* ========================================================= */}
        {tab === 'scanner' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-[#E8DFC8] text-center shadow-sm space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#FAF4EB] text-[#78350F] flex items-center justify-center mx-auto border border-[#E2D2BE]">
                <Camera className="w-8 h-8" />
              </div>

              <div>
                <h3 className="font-serif font-extrabold text-lg text-[#2B1B17]">
                  Fotocamera Riconosci-Capo 📸
                </h3>
                <p className="text-xs text-[#7A695C] max-w-sm mx-auto mt-1">
                  Scatta una foto a una maglia o a un pantalone ben illuminato!
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={analizzaFoto}
                className="hidden"
              />

              <div className="flex justify-center gap-3">
                <BottoneSartoriale
                  onClick={() => fileInputRef.current?.click()}
                  variante="corno"
                  className="px-6 py-3"
                >
                  <Camera className="w-5 h-5" />
                  <span>Scatta Foto al Vestito</span>
                </BottoneSartoriale>
              </div>

              {inAnalisi && (
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#78350F] pt-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analisi in corso...</span>
                </div>
              )}
            </div>

            {coloreRilevato && (
              <div className="bg-white p-6 rounded-3xl border border-[#795548] shadow-md space-y-4">
                <div className="flex items-center gap-4">
                  {fotoCaricata && (
                    <img
                      src={fotoCaricata}
                      alt="Capo"
                      className="w-16 h-16 rounded-2xl object-cover border border-[#DFD5C6] shadow-sm"
                    />
                  )}
                  <div>
                    <span className="text-[11px] font-bold text-[#78350F] uppercase tracking-wider block">
                      Colore Rilevato:
                    </span>
                    <div className="mt-1">
                      <BollinoColore nome={coloreRilevato.nome} misura="grande" />
                    </div>
                  </div>
                </div>

                <BottoneSartoriale
                  onClick={() => {
                    setColoreScelto(coloreRilevato.nome);
                    setTab('consigli');
                  }}
                  variante="avorio"
                  className="w-full"
                >
                  <span>Guarda gli abbinamenti completi ➔</span>
                </BottoneSartoriale>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: IL SEMAFORO CON LA ROULETTE VIOLA 🎲💜             */}
        {/* ========================================================= */}
        {tab === 'semaforo' && (
          <div className="space-y-5">
            
            {/* TASTO ROULETTE DI PAPÀ IN PRIMO PIANO */}
            <div className="bg-gradient-to-r from-[#FAF5FF] via-white to-[#FAF5FF] p-4 rounded-3xl border-2 border-purple-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <h4 className="font-serif font-black text-sm text-purple-900 flex items-center gap-1.5">
                  <Dices className="w-4 h-4 text-purple-600" />
                  <span>Non hai voglia di pensare all'outfit?</span>
                </h4>
                <p className="text-xs text-purple-700">Fai girare la Roulette e lascia fare all'app!</p>
              </div>

              <BottoneSartoriale
                onClick={giraRoulette}
                variante="viola"
                className="w-full sm:w-auto shrink-0"
              >
                <Dices className={`w-4 h-4 ${inGiroRoulette ? 'animate-spin' : ''}`} />
                <span>{inGiroRoulette ? 'Scelta in corso...' : 'Gira la Roulette! 🎲'}</span>
              </BottoneSartoriale>
            </div>

            {/* SELETTORI MANUALI */}
            <div className="bg-white border border-[#E8DFC8] p-5 rounded-3xl shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-base text-[#2B1B17]">
                Oppure componi tu l'outfit:
              </h3>

              {/* Sopra */}
              <div>
                <label className="text-xs font-bold text-[#7A695C] block mb-2 uppercase">1. Colore Sopra:</label>
                <div className="flex flex-wrap gap-2">
                  {['Blu Scuro / Navy', 'Bianco Ottico', 'Nero Notte', 'Grigio Perla', 'Celeste Camicia', 'Bordeaux / Vinaccia'].map(c => (
                    <button
                      key={c}
                      onClick={() => { setSemSopra(c); setDaRoulette(false); }}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition ${
                        semSopra === c ? 'bg-[#3E2723] text-white border-[#2A1810]' : 'bg-[#FAF8F5] border-[#E8DFC8]'
                      }`}
                    >
                      <BollinoColore nome={c} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Pantaloni */}
              <div>
                <label className="text-xs font-bold text-[#7A695C] block mb-2 uppercase">2. Colore Pantaloni:</label>
                <div className="flex flex-wrap gap-2">
                  {['Beige Sabbia', 'Jeans Denim Chiaro', 'Nero Notte', 'Blu Scuro / Navy', 'Verde Oliva / Cargo'].map(c => (
                    <button
                      key={c}
                      onClick={() => { setSemSotto(c); setDaRoulette(false); }}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition ${
                        semSotto === c ? 'bg-[#3E2723] text-white border-[#2A1810]' : 'bg-[#FAF8F5] border-[#E8DFC8]'
                      }`}
                    >
                      <BollinoColore nome={c} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Scarpe */}
              <div>
                <label className="text-xs font-bold text-[#7A695C] block mb-2 uppercase">3. Colore Scarpe:</label>
                <div className="flex flex-wrap gap-2">
                  {['Marrone Cuoio', 'Bianco Ottico', 'Nero Notte'].map(c => (
                    <button
                      key={c}
                      onClick={() => { setSemScarpe(c); setDaRoulette(false); }}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition ${
                        semScarpe === c ? 'bg-[#3E2723] text-white border-[#2A1810]' : 'bg-[#FAF8F5] border-[#E8DFC8]'
                      }`}
                    >
                      <BollinoColore nome={c} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* BOX VERDETTO: SE VIENE DALLA ROULETTE DIVENTA VIOLA CON LA TUA FRASE! */}
            {daRoulette ? (
              <div className="p-6 rounded-3xl border-2 border-purple-400 bg-gradient-to-br from-[#FAF5FF] via-[#F3E8FF] to-[#EDE9FE] shadow-lg animate-fadeIn text-purple-950">
                <div className="flex items-start gap-3.5">
                  <span className="text-3xl">🎲</span>
                  <div className="flex-1">
                    <span className="text-[11px] font-black uppercase tracking-wider bg-purple-200 text-purple-900 px-2.5 py-0.5 rounded-full">
                      Scelto dalla Roulette
                    </span>
                    <h4 className="text-lg font-serif font-black text-purple-900 mt-1">
                      (Non ti andava eh... faccio io questa volta 😉)
                    </h4>
                    <p className="text-xs sm:text-sm text-purple-800 mt-1.5 font-medium leading-relaxed">
                      Tranquillo papà, ti ho scelto una combinazione garantita al 100%: <b>{semSopra}</b> sopra, <b>{semSotto}</b> sotto e <b>{semScarpe}</b> ai piedi. Vai sereno che fai figurone!
                    </p>

                    <div className="mt-4 pt-3 border-t border-purple-300/60 flex justify-end">
                      <BottoneSartoriale
                        onClick={() => salvaCompleto(semSopra, semSotto, semScarpe, 'Scelto dalla Roulette')}
                        variante="viola"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Salva questo completo fortunato</span>
                      </BottoneSartoriale>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`p-6 rounded-3xl border-2 shadow-sm ${verdetto.colore === 'verde' ? 'bg-[#F1F8E9] border-[#689F38]' : 'bg-[#FFEBEE] border-[#D32F2F] animate-pulse'}`}>
                <div className="flex items-start gap-3">
                  {verdetto.colore === 'verde' ? <CheckCircle2 className="w-8 h-8 text-[#2E7D32] shrink-0" /> : <XCircle className="w-8 h-8 text-[#C62828] shrink-0" />}
                  <div>
                    <h4 className={`text-base font-serif font-black ${verdetto.colore === 'verde' ? 'text-[#2E7D32]' : 'text-[#C62828]'}`}>
                      {verdetto.titolo}
                    </h4>
                    <p className="text-xs sm:text-sm text-[#3E2723] mt-1 font-medium">{verdetto.testo}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: COMPLETI SALVATI                                   */}
        {/* ========================================================= */}
        {tab === 'salvati' && (
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#2B1B17]">I Completi Salvati di Papà</h3>

            {completi.length === 0 ? (
              <div className="text-center py-12 bg-white border border-[#E8DFC8] rounded-3xl p-6">
                <p className="text-[#5D4037] font-bold">Nessun completo ancora salvato nell'armadio.</p>
                <p className="text-xs text-[#8D6E63] mt-1">Salva un completo dalla Palette o dalla Roulette!</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {completi.map((c) => (
                  <div key={c.id} className="p-4 bg-white border border-[#E8DFC8] rounded-3xl flex items-center justify-between gap-3 shadow-sm">
                    <div>
                      <h4 className="font-serif font-extrabold text-base text-[#3E2723]">{c.title}</h4>
                      <div className="mt-1.5 space-y-1">
                        <div className="text-xs text-[#5D4037] flex items-center gap-1.5">
                          <span>👕 Sopra:</span> <BollinoColore nome={c.top_piece} misura="piccolo" />
                        </div>
                        <div className="text-xs text-[#5D4037] flex items-center gap-1.5">
                          <span>👖 Pantaloni:</span> <BollinoColore nome={c.bottom_piece} misura="piccolo" />
                        </div>
                        <div className="text-xs text-[#5D4037] flex items-center gap-1.5">
                          <span>👞 Scarpe:</span> <BollinoColore nome={c.shoes_piece} misura="piccolo" />
                        </div>
                      </div>
                      {c.notes && (
                        <span className="inline-block mt-2 text-[10px] bg-[#F5ECE0] text-[#78350F] px-2.5 py-0.5 rounded-full font-bold">
                          {c.notes}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => eliminaCompleto(c.id)}
                      className="p-2.5 text-stone-400 hover:text-rose-500 rounded-full hover:bg-rose-50 transition"
                      title="Elimina"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}