/* La franja roja de lunares de la marca, puesta como remate superior de la
   página.

   En la gráfica impresa el rojo no es un acento: es un campo de lunares con el
   canto de arriba ondulado, y es la mitad inferior del logo. En la web ese
   campo no existía por ninguna parte, y por eso el tope se veía blanco.

   Va dentro del `<header>` pegajoso, así que no es sólo el remate del hero:
   acompaña al scroll y sigue siendo lo primero de la pantalla cuando el hero ya
   pasó.

   ── El problema de formato, que es de donde salieron todas las versiones feas

   En el logo la ola atraviesa el campo de lunares y va cortando puntos por el
   camino. Copiar eso aquí sale mal, y no por la curva: el campo del logo es
   2,6:1 y esta franja es ~26:1. A esa proporción CUALQUIER ola es casi
   horizontal, así que su canto acaba corriendo paralelo a una fila de puntos
   durante cientos de píxeles y los parte todos por la mitad a la misma altura.
   El borde deja de ser un borde y se vuelve una hilera de bultos: el mismo aire
   de tira de sellos perforada que hundía la primera versión, sólo que
   disfrazado de canto ondulado.

   Se probaron los dos escapes obvios y ninguno vale. Bajar la amplitud deja la
   franja plana y sin gracia. Afinar mucho el lunar quita el bulto pero convierte
   los lunares en trama de semitono: parece plancha perforada, no la marca.

   ── Cómo está resuelto

   Los puntos y la ola viven en zonas separadas y no se tocan nunca. Arriba una
   fila de lunares al tamaño medido de la marca; abajo, una banda limpia de
   rojo donde la ola tiene sitio para moverse de verdad. Así el canto es inmune
   al problema a cualquier ancho de viewport, en vez de estar afinado para uno
   solo.

   Es una licencia respecto al logo — allí la ola sí corta los puntos — y es
   deliberada: a este formato la copia literal se ve peor que la adaptación. */

/* La máscara: macizo arriba, ola abajo, estirada a lo ancho (`none` +
   `mask-size: 100% 100%`, sin repetir).

   Sin embaldosar a propósito. La primera versión repetía un festón cada 420px,
   y cualquier motivo que se repite a una frecuencia que el ojo alcanza a contar
   deja de leerse como borde pintado y pasa a leerse como cenefa de mantel. El
   canto del logo es UNA curva larga y asimétrica; aquí se estira entera de lado
   a lado.

   El viewBox mide 1200x48 y esa proporción no es decorativa: es la misma que
   tiene la franja ya renderizada (~1440x60 en un escritorio), así que la escala
   en X y en Y sale casi igual. Con un viewBox desproporcionado el aplastado
   vertical comprime la amplitud de la ola: con 1200x100 metido en 52px, la
   ola quedaba a la mitad de su recorrido y se leía como una banda casi recta.

   La ola se mueve entre y=29,5 y y=48 — de 37px a 60px una vez renderizada, 23px
   de recorrido — y el límite de arriba es el número importante: la fila de
   lunares acaba a 27px, así que la cresta pasa 10px por debajo y no llega a
   morder ningún punto.

   El rectángulo arranca en -40 por arriba y por los lados para que el viewBox
   lo recorte en vez de que sus cantos coincidan con el borde de la caja: así
   la máscara tapa con holgura arriba y a los lados pase lo que pase con el
   redondeo, y la única orilla que dibuja forma es la ola de abajo.

   La irregularidad del canto va dibujada en la propia curva, no en un filtro,
   y esto costó una versión entera. Un `feTurbulence` + `feDisplacementMap`
   parece el camino obvio para conseguir borde de pincel, pero desplaza mal un
   contorno casi horizontal: como la orilla apenas cambia de altura, el ruido
   se muestrea prácticamente a la misma y sale un escalonado de bloques
   rectangulares de unos pocos píxeles. Se lee como artefacto de compresión,
   no como pintura.

   La alternativa es más simple y además es crujiente a cualquier resolución:
   muchos tramos `S` — cúbicas suaves, que heredan solas el punto de control
   anterior y por eso empalman sin picos — con las alturas variadas a mano. Da
   una orilla orgánica y desigual sin coste de filtro y sin depender de cómo
   rasterice cada navegador. Si se retoca, la única regla dura es no subir
   ninguna altura por encima de 29,5: por ahí anda la fila de lunares. */
const WAVE_MASK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 48' preserveAspectRatio='none'%3E" +
  "%3Cpath fill='%23fff' d='M-40,-26 L1240,-26 L1240,47.5 " +
  "C1200,48.4 1150,48.6 1090,47.4 S1000,42 975,34.5 S940,29.6 900,29.2 " +
  "S830,31.4 790,35.6 S720,44 660,46.6 S575,47.6 540,45.4 " +
  "S470,36.4 425,31.2 S355,28.8 310,29.8 S225,34.6 170,39.6 " +
  "S70,45.8 -40,47 Z'/%3E%3C/svg%3E";

/* #e80203 es el rojo de la marca MEDIDO, no elegido: es la mediana por canal
   de los 162.636 píxeles rojos de `public/images/Logo.jpeg`, con los cuartiles
   en #e40102 y #ec0305 — una distribución tan cerrada que no deja lugar a
   dudas. Es el mismo valor que `--color-red` en globals.css: traer este rojo a
   la franja fue justamente lo que obligó a cambiar el token, porque el
   terracota anterior (#c03d27) puesto a treinta píxeles de la franja encendida
   parecía un error y no una paleta.

   Va literal y no como `var(--color-red)` porque el degradado necesita además
   las variantes aclarada y oscurecida, que no son tokens. Si el token cambia,
   estos tres cambian con él.

   Va como degradado y no como plano porque a este tamaño un color plano se lee
   a plástico — la misma razón por la que el resto de la página lleva
   `paper-grain` — y unos pocos puntos entre el canto de arriba y el de abajo
   bastan para que parezca pintura. */
const RED = "linear-gradient(180deg, #f3141a 0%, #e80203 55%, #cc0206 100%)";

/* El lunar y su paso salen medidos del logo, no estimados. En la gráfica el
   punto ocupa el 17% del alto del campo rojo y va a 2,86 diámetros del
   siguiente; sobre una franja de 60px eso da 10px de punto y 29px de paso.
   Antes estaban a 7px y 16px, que era la mitad de contundente de lo que la
   marca es en realidad.

   Al tamaño de verdad ya no caben dos filas: 10px de punto a 29px de paso
   necesitan ~47px sólo para los lunares, y la franja tiene 60px de los que la
   ola se lleva los últimos 23. Así que va UNA fila, centrada a 22px del canto
   — 17px de rojo por encima y 10px por debajo antes de que empiece la ola. No
   está a media franja sino a media franja MEDIA: la ola hace que el alto varíe
   entre 37 y 60px, y centrar sobre los 60 dejaba el punto visiblemente alto. Dos
   filas a este tamaño exigen subir `--header-rail` a ~4,75rem.

   La altura de la fila va en el `at 50% Npx` del propio gradiente y no en
   `background-position`, que sería lo intuitivo pero no funciona: ahí el
   porcentaje se mide contra el hueco libre entre caja y celda, y como la celda
   mide justo el alto de la caja ese hueco es cero.

   La capa se repite sólo en X (`repeat-x`), así que aporta exactamente una
   fila y nada por debajo. Con una rejilla cuadrada saldrían más filas hacia
   abajo hasta llenar el alto, y la de más abajo caería dentro del recorrido de
   la ola: cada punto partido por la mitad a la misma altura, que es el aire de
   tira de sellos perforada del que costó tanto salir.

   El lunar es crema y no blanco: sobre este rojo el blanco puro salta un
   escalón por delante de la crema del header y la franja deja de leerse como
   el mismo papel. */
const ROW_1 = "radial-gradient(circle at 50% 22px, #fef8ec 5px, transparent 5.7px)";

export function PolkaRail({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        backgroundImage: [ROW_1, RED].join(", "),
        backgroundSize: "29px 100%, 100% 100%",
        backgroundPosition: "0 0, 0 0",
        backgroundRepeat: "repeat-x, no-repeat",
        maskImage: `url("${WAVE_MASK}")`,
        WebkitMaskImage: `url("${WAVE_MASK}")`,
        maskSize: "100% 100%",
        WebkitMaskSize: "100% 100%",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
      }}
    />
  );
}
