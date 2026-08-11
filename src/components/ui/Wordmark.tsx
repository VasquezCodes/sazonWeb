import { cn } from "@/lib/utils";

/* Los dos trazos amarillos del logo impreso, redibujados a mano: el subrayado
   de pincel y el abanico de destellos sobre la "o". No es decoracion generica,
   es la parte del logo que la tipografia no puede dar. Kaushan Script se acerca
   al lettering original, pero sin estos dos gestos el wordmark de la web no se
   reconoce como la misma marca que la grafica de las piezas.

   Van dentro de un envoltorio `inline-block` que se ajusta al ancho del texto,
   de modo que se colocan y escalan con el, tanto en el header (donde el logo va
   a `scale-75` y alineado a la izquierda) como en el footer (centrado y a tamano
   completo). Todo esta en `em`, asi que basta cambiar el `text-4xl` para que los
   dos trazos acompanen. */

function BrushUnderline() {
  return (
    // El recuadro se pasa del ancho del texto hacia la derecha porque en el logo
    // el trazo termina despues de la "n", no debajo de ella. La relacion del
    // viewBox coincide con la de la caja, asi que `preserveAspectRatio="none"`
    // no llega a deformar el trazo.
    <svg
      viewBox="0 0 104 20"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="pointer-events-none absolute bottom-[-0.12em] right-[-0.26em] left-[0.28em] h-[0.4em] text-gold"
    >
      {/* Grueso abajo a la izquierda, subiendo y afinandose hacia la derecha. */}
      <path
        d="M4,12.6 C24,12.3 60,9.6 84,4.8 C90,3.7 95,2.8 99,2.0 L100,5.8 C95,6.6 90,7.6 84,9.0 C60,14.0 24,17.4 5,18.0 Z"
        fill="currentColor"
      />
      {/* La punta partida: el pincel se queda sin pintura y se abre en dos. */}
      <path d="M99,0.2 C101,-0.2 103,-0.4 104,-0.6 L104,1.2 C102,1.5 100,1.8 99,2.0 Z" fill="currentColor" />
    </svg>
  );
}

function Sparks() {
  return (
    // Cinco trazos girando en abanico alrededor de un centro que cae sobre la
    // "o": casi vertical en el medio, casi horizontal en el extremo derecho.
    <svg
      viewBox="0 0 40 28"
      aria-hidden="true"
      className="pointer-events-none absolute top-[-0.34em] right-[-0.28em] h-[0.58em] w-[0.82em] text-gold"
    >
      <g stroke="currentColor" strokeLinecap="round" fill="none">
        <path d="M4.5,20.5 L1.5,11.5" strokeWidth="2.6" />
        <path d="M12,17 L11,7" strokeWidth="2.8" />
        <path d="M20,16.5 L23,6.5" strokeWidth="2.8" />
        <path d="M27.5,19 L33.5,11" strokeWidth="2.6" />
        <path d="M32,24.5 L39,21" strokeWidth="2.4" />
      </g>
    </svg>
  );
}

export function Wordmark({
  className,
  tone = "ink",
}: {
  className?: string;
  tone?: "ink" | "white";
}) {
  return (
    <span className={cn("inline-flex flex-col leading-none", className)}>
      {/* El relleno inferior le abre sitio al subrayado. Sin el, el trazo se
          come el aire que separa el nombre de la bajada. */}
      <span
        className={cn(
          "font-script text-4xl pb-[0.16em]",
          tone === "ink" ? "text-ink" : "text-white"
        )}
      >
        <span className="relative inline-block">
          Sazón
          <BrushUnderline />
          <Sparks />
        </span>
      </span>
      <span
        className={cn(
          "mt-1 font-heading text-[0.6rem] font-bold uppercase tracking-[0.25em]",
          // The ink variant sits on cream (the header) and can afford /70; the
          // white variant sits on `celeste` (the footer) at 0.6rem, where /80
          // already drops under AA, so it stays at /90.
          tone === "ink" ? "text-ink/70" : "text-white/90"
        )}
      >
        Venezuelan Street Food
      </span>
    </span>
  );
}
