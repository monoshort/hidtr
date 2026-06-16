import React, { useState } from "react";

/**
 * Leerdiagram: de mens volgens Johan O. Smith
 * Bron: Gods woord maakt scheiding (1922), De ziel (psyche) en haar functie (1927),
 * Het vergankelijke lichaam (1915), Ik zie een andere wet in mijn leden (1914)
 */

type View = "structuur" | "proces";

export default function JOSStickmanDiagram() {
  const [view, setView] = useState<View>("structuur");

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 font-sans text-slate-800">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            De mens volgens Johan O. Smith
          </h1>
          <p className="text-slate-500 mt-2 text-sm max-w-xl mx-auto">
            Drie delen: geest, ziel en lichaam. Met onderscheid tussen lichaamsbegrippen,
            werkingen en het hart. Hebr. 4:12
          </p>
          <div className="flex justify-center gap-2 mt-5">
            <TabButton active={view === "structuur"} onClick={() => setView("structuur")}>
              Bouw (structuur)
            </TabButton>
            <TabButton active={view === "proces"} onClick={() => setView("proces")}>
              Verloop (proces)
            </TabButton>
          </div>
        </header>

        {view === "structuur" ? <StructuurView /> : <ProcesView />}

        <footer className="mt-10 text-center text-xs text-slate-400">
          Bron: J.O. Smith ù Verborgen Schatten / Verzamelde Werken
        </footer>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        active
          ? "bg-slate-900 text-white"
          : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
      }`}
    >
      {children}
    </button>
  );
}

/* ??? STRUCTUUR: gelaagd overzicht ??? */

function StructuurView() {
  return (
    <div className="space-y-0">
      {/* GOD */}
      <Layer
        color="god"
        title="GOD"
        subtitle="Bron van leven en licht"
        className="rounded-t-2xl"
      />

      <Connector label="verbinding via de geest" color="blue" />

      {/* GEEST */}
      <Layer
        color="geest"
        title="GEEST (pneuma)"
        subtitle="Godsbewustzijn ù menselijke geest ù contact met de geestelijke wereld"
        refs="1 Kor. 2:11 ù Ef. 4:18"
      >
        <p className="text-sm text-blue-800/80 mt-2">
          Het <strong>hogere deel</strong> van de mens. Na de val: verduisterd, dood voor God,
          open voor boze geesten. Na verlossing: dagelijks vernieuwd door Gods Geest.
        </p>
      </Layer>

      <Connector label="geest en lichaam ontmoeten elkaar via de ziel" color="slate" />

      {/* ZIEL */}
      <Layer
        color="ziel"
        title="ZIEL (psyche)"
        subtitle="Zelfbewustzijn ù zetel van de persoonlijkheid ù ontmoetingsplaats"
        refs="De ziel (psyche) en haar functie, 1927"
      >
        <div className="grid gap-3 mt-4 sm:grid-cols-3">
          <SubBlock
            title="Verstand"
            desc="Verwerkt indrukken van de 5 zintuigen. Dient Gods wet (Rom. 7:25). Hier binnenkomt verzoeking."
            accent="border-t-amber-400"
          />
          <SubBlock
            title="Hart"
            desc="Overleggingen en gedachten des harten. Diepste binnenste. Woord dringt hier door."
            accent="border-t-red-500"
            highlight
          />
          <SubBlock
            title="Wil / gezindheid"
            desc="Kiest wie regeert: geest of vlees. Instemt of weerstaat. Bepaalt of zonde volgroeit."
            accent="border-t-violet-500"
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {["Zien", "Horen", "Ruiken", "Proeven", "Voelen"].map((z) => (
            <span
              key={z}
              className="text-xs bg-white/60 border border-slate-200 rounded-full px-3 py-1 text-slate-600"
            >
              {z}
            </span>
          ))}
          <span className="text-xs text-slate-400 self-center">? zintuigen (lichaam)</span>
        </div>
      </Layer>

      <Connector label="ziel verbindt geest met lichaam ù direct contact is onmogelijk" color="slate" />

      {/* LICHAAM */}
      <Layer
        color="lichaam"
        title="LICHAAM (soma / sarx)"
        subtitle="Zintuiglijk bewustzijn ù contact met de buitenwereld"
        refs="Gods woord maakt scheiding, 1922"
        className="rounded-b-none"
      >
        <div className="grid gap-3 mt-4">
          <BodyRow
            color="red"
            title="Lichaam des vlezes"
            ref_="Kol. 2:11"
            desc="Het lichaam dat zich als werktuig voor de zonde stelde. Afgelegd / afgesneden in de besnijdenis van Christus."
            status="afgelegd bij bekering"
          />
          <BodyRow
            color="purple"
            title="Lichaam der zonde"
            ref_="Rom. 6:6"
            desc="Inwonende zonde verbonden met het lichaam. Moet teniet gedaan worden. Oude mens gekruisigd."
            status="strijd ù teniet doen"
          />
          <BodyRow
            color="slate"
            title="Lichaam des doods"
            ref_="Rom. 7:24"
            desc="Het sterfelijke vlees en bloed dat wij nu dragen zolang wij in het lichaam zijn."
            status="dragen tot de dood"
          />
        </div>
        <div className="mt-4 p-3 bg-white/50 rounded-lg border border-orange-200 text-sm">
          <strong>Leden</strong> ù &quot;Ik zie een andere wet in mijn leden&quot; (Rom. 7:23).
          Aangeboren wet in de menselijke natuur; verdwijnt niet zolang we in het lichaam zijn.
        </div>
      </Layer>

      {/* WERKINGEN */}
      <div className="grid sm:grid-cols-2 gap-0 sm:gap-4 mt-0">
        <div className="bg-amber-50 border border-amber-200 border-t-0 sm:border-t sm:rounded-bl-2xl p-5">
          <h3 className="font-bold text-amber-900">Werkingen des lichaams</h3>
          <p className="text-xs text-amber-700 mt-1">Rom. 8:13</p>
          <ul className="mt-3 text-sm text-amber-900/90 space-y-1.5 list-disc pl-4">
            <li>Komen op <strong>tegen beter weten</strong></li>
            <li>Onbewust ù waar nog geen licht is</li>
            <li>Geen veroordeling als je ze <strong>doodt door de Geest</strong></li>
            <li>Niet hetzelfde als &quot;werken van het vlees&quot;</li>
          </ul>
        </div>
        <div className="bg-red-50 border border-red-200 border-t-0 sm:rounded-br-2xl p-5">
          <h3 className="font-bold text-red-900">Zondige werking</h3>
          <p className="text-xs text-red-700 mt-1">Gal. 5:19 ù Rom. 7:17</p>
          <ul className="mt-3 text-sm text-red-900/90 space-y-1.5 list-disc pl-4">
            <li><strong>Gezindheid stemt in</strong> met begeerte</li>
            <li>Bewuste zonde ù werken van het vlees</li>
            <li>Leidt tot wet der zonde en des doods</li>
            <li>Geweten verlamd bij volgroeide zonde</li>
          </ul>
        </div>
      </div>

      {/* Drie wetten */}
      <div className="mt-6 bg-white rounded-2xl border border-slate-200 p-5">
        <h3 className="font-bold text-slate-900 mb-3">Drie wetten (Rom. 8:2)</h3>
        <div className="grid sm:grid-cols-3 gap-3 text-sm">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="font-semibold text-green-800">1. Geest des levens</div>
            <p className="text-green-700 mt-1 text-xs">Bevrijdt van zonde en dood</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="font-semibold text-red-800">2. Wet der zonde</div>
            <p className="text-red-700 mt-1 text-xs">Dwingt tot zondigen</p>
          </div>
          <div className="bg-slate-100 border border-slate-300 rounded-xl p-4">
            <div className="font-semibold text-slate-800">3. Wet des doods</div>
            <p className="text-slate-600 mt-1 text-xs">Verlamt het geweten</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ??? PROCES: gevallen vs verlost ??? */

function ProcesView() {
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <ProcessCard
        variant="fallen"
        title="Gevallen mens"
        steps={[
          { label: "Zintuigen", desc: "Indrukken van buitenwereld" },
          { label: "Verstand", desc: "Verzoeking: 'gij zult als God zijn'" },
          { label: "Hart", desc: "Overleggingen worden boos (Gen. 6:5)" },
          { label: "Gezindheid", desc: "Stemt in met begeerte van het vlees" },
          { label: "Lichaam", desc: "Handelt ù zondige werking" },
          { label: "Gevolg", desc: "Wet der zonde ? wet des doods ? geest verduisterd" },
        ]}
        note="De ziel wordt slaaf van het vlees. De geest is dood voor God (Ef. 4:18)."
      />
      <ProcessCard
        variant="redeemed"
        title="Verloste mens"
        steps={[
          { label: "Woord Gods", desc: "Scheidt ziel en geest ù Hebr. 4:12" },
          { label: "Geest", desc: "Vernieuwd door Heilige Geest" },
          { label: "Hart", desc: "Oordeel ontvangen ù bekering" },
          { label: "Gezindheid", desc: "Dient de wet Gods (Rom. 7:25)" },
          { label: "Lichaam", desc: "Werkingen des lichaams ? doden door Geest" },
          { label: "Gevolg", desc: "Geen veroordeling ù vrucht des Geestes" },
        ]}
        note="Oude mens gekruisigd. Lichaam des vlezes afgelegd. Geestelijke mens wordt volwassen."
      />
    </div>
  );
}

/* ??? UI building blocks ??? */

const layerColors = {
  god: "bg-indigo-600 text-white border-indigo-700",
  geest: "bg-blue-100 text-blue-950 border-blue-300",
  ziel: "bg-violet-50 text-violet-950 border-violet-200",
  lichaam: "bg-orange-50 text-orange-950 border-orange-200",
};

function Layer({
  color,
  title,
  subtitle,
  refs,
  children,
  className = "",
}: {
  color: keyof typeof layerColors;
  title: string;
  subtitle: string;
  refs?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const isGod = color === "god";
  return (
    <div className={`border-2 p-5 sm:p-6 ${layerColors[color]} ${className}`}>
      <h2 className={`text-xl font-bold ${isGod ? "" : ""}`}>{title}</h2>
      <p className={`text-sm mt-1 ${isGod ? "text-indigo-100" : "opacity-75"}`}>{subtitle}</p>
      {refs && (
        <p className={`text-xs mt-1 ${isGod ? "text-indigo-200" : "opacity-50"}`}>{refs}</p>
      )}
      {children}
    </div>
  );
}

function Connector({ label, color }: { label: string; color: "blue" | "slate" }) {
  const c = color === "blue" ? "text-blue-500" : "text-slate-400";
  return (
    <div className={`flex flex-col items-center py-2 bg-white border-x-2 border-slate-200 ${c}`}>
      <div className="w-0.5 h-4 bg-current" />
      <span className="text-xs font-medium px-3 text-center text-slate-500">{label}</span>
      <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-current" />
    </div>
  );
}

function SubBlock({
  title,
  desc,
  accent,
  highlight,
}: {
  title: string;
  desc: string;
  accent: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`bg-white rounded-xl border border-slate-200 border-t-4 ${accent} p-4 ${
        highlight ? "ring-2 ring-red-200" : ""
      }`}
    >
      <h4 className="font-bold text-slate-900">{title}</h4>
      <p className="text-xs text-slate-600 mt-2 leading-relaxed">{desc}</p>
    </div>
  );
}

function BodyRow({
  color,
  title,
  ref_,
  desc,
  status,
}: {
  color: "red" | "purple" | "slate";
  title: string;
  ref_: string;
  desc: string;
  status: string;
}) {
  const borders = {
    red: "border-red-300 bg-red-50/50",
    purple: "border-purple-300 bg-purple-50/50",
    slate: "border-slate-300 bg-slate-50/50",
  };
  return (
    <div className={`rounded-xl border-l-4 p-4 ${borders[color]}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h4 className="font-bold text-slate-900">{title}</h4>
        <span className="text-xs text-slate-500">{ref_}</span>
      </div>
      <p className="text-sm text-slate-700 mt-2">{desc}</p>
      <span className="inline-block mt-2 text-xs font-medium bg-white border border-slate-200 rounded-full px-3 py-0.5 text-slate-600">
        {status}
      </span>
    </div>
  );
}

function ProcessCard({
  variant,
  title,
  steps,
  note,
}: {
  variant: "fallen" | "redeemed";
  title: string;
  steps: { label: string; desc: string }[];
  note: string;
}) {
  const isFallen = variant === "fallen";
  return (
    <div
      className={`rounded-2xl border-2 p-6 ${
        isFallen ? "border-red-200 bg-white" : "border-green-200 bg-white"
      }`}
    >
      <h3
        className={`text-lg font-bold mb-5 ${isFallen ? "text-red-800" : "text-green-800"}`}
      >
        {title}
      </h3>
      <ol className="space-y-0">
        {steps.map((step, i) => (
          <li key={step.label} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 ${
                  isFallen ? "bg-red-500" : "bg-green-600"
                }`}
              >
                {i + 1}
              </div>
              {i < steps.length - 1 && (
                <div className={`w-0.5 flex-1 min-h-[24px] ${isFallen ? "bg-red-200" : "bg-green-200"}`} />
              )}
            </div>
            <div className="pb-5">
              <div className="font-semibold text-slate-900">{step.label}</div>
              <div className="text-sm text-slate-600 mt-0.5">{step.desc}</div>
            </div>
          </li>
        ))}
      </ol>
      <p className={`text-sm mt-2 p-3 rounded-lg ${isFallen ? "bg-red-50 text-red-900" : "bg-green-50 text-green-900"}`}>
        {note}
      </p>
    </div>
  );
}
