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

   Los puntos y la ola viven en zonas separadas y no se tocan nunca. Arriba
   dos filas de lunares al tresbolillo, con el tamaño, el paso y el desfase
   medidos del logo; abajo, una banda limpia de rojo donde la ola tiene sitio
   para moverse de verdad. Así el canto es inmune al problema a cualquier
   ancho de viewport, en vez de estar afinado para uno solo.

   Es una licencia respecto al logo — allí la ola sí corta los puntos — y es
   deliberada: a este formato la copia literal se ve peor que la adaptación. */

/* La máscara: macizo arriba, ola abajo, estirada a lo ancho (`none` +
   `mask-size: 100% 100%`, sin repetir).

   Sin embaldosar a propósito. Una versión anterior repetía un festón cada
   420px, y cualquier motivo que se repite a una frecuencia que el ojo alcanza
   a contar deja de leerse como borde pintado y pasa a leerse como cenefa de
   mantel. El canto del logo es UNA curva larga y asimétrica; aquí se estira
   entera de lado a lado.

   El viewBox mide 1200x60 y esa proporción no es decorativa: es la misma que
   tiene la franja ya renderizada (~1440x72 en un escritorio), así que la
   escala en X y en Y sale casi igual. Con un viewBox desproporcionado el
   aplastado vertical comprime la amplitud y la ola se lee como una banda
   casi recta.

   La ola se mueve entre y=40 y y=60 — de 48px a 72px una vez renderizada — y
   el límite de arriba es el número importante: la segunda fila de lunares
   acaba a 41,5px, así que la cresta pasa 6,5px por debajo y no llega a morder
   ningún punto. Que no lo muerda es la regla dura de este componente: con la
   franja a ~20:1 cualquier ola es casi horizontal, así que si su canto cruza
   una fila la parte entera a la misma altura y el borde se vuelve una hilera
   de bultos — el aire de tira de sellos perforada del que costó salir.

   El rectángulo arranca en -40 por arriba y por los lados para que el viewBox
   lo recorte en vez de que sus cantos coincidan con el borde de la caja.

   La irregularidad del canto va dibujada en la propia curva, no en un filtro.
   Un `feTurbulence` + `feDisplacementMap` parece el camino obvio para un
   borde de pincel, pero desplaza mal un contorno casi horizontal: el ruido se
   muestrea siempre a la misma altura y sale un escalonado de bloques
   rectangulares que se lee como artefacto de compresión. Los tramos `S` —
   cúbicas suaves, que heredan solas el punto de control anterior y empalman
   sin picos — con las alturas variadas a mano dan una orilla orgánica, nítida
   a cualquier resolución y sin coste de filtro. Si se retoca, no subir ninguna
   altura por encima de 40: ahí acaba la segunda fila de lunares. */
const WAVE_MASK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 60' preserveAspectRatio='none'%3E" +
  "%3Cpath fill='%23fff' d='M-40,-30 L1240,-30 L1240,58.9 " +
  "C1200,59.8 1150,60 1090,58.8 S1000,53.3 975,45.8 S940,40.8 900,40.4 " +
  "S830,42.6 790,46.9 S720,55.4 660,58 S575,59 540,56.8 " +
  "S470,47.7 425,42.4 S355,40 310,41 S225,45.9 170,50.9 " +
  "S70,57.2 -40,58.4 Z'/%3E%3C/svg%3E";

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

/* La retícula sale MEDIDA del logo, no estimada. Las cifras se sacaron
   detectando cada lunar del campo rojo de `public/images/Logo.jpeg` como una
   mancha y midiendo sus centros:

     · el punto ocupa el 17% del alto del campo,
     · el paso horizontal es de 3,4 diámetros,
     · el salto vertical entre filas es de 1,66 diámetros,
     · y cada fila va desfasada MEDIO PASO respecto a la anterior (0,45 y
       0,43 medidos en las dos parejas de filas disponibles).

   Ese desfase es lo que hace que los lunares no se lean en línea recta sino
   al tresbolillo, y es el detalle por el que la trama se reconoce como la de
   la marca: con las filas alineadas el conjunto parece papel pintado
   genérico.

   Sobre una franja de 72px eso da 13px de punto, 44px de paso y 22px de
   salto vertical, con la segunda fila corrida 22px — medio paso — en X.

   Van DOS capas y no una rejilla que se repita hacia abajo. Cada una tiene
   la celda tan alta como la franja y se repite sólo en X, así que aporta
   exactamente una fila y nada por debajo. Con una rejilla normal saldrían
   más filas hasta llenar el alto y la de más abajo caería dentro del
   recorrido de la ola, que es justo lo que hay que evitar.

   La altura de cada fila va en el `at 50% Npx` del propio gradiente y no en
   `background-position`, que sería lo intuitivo pero no funciona: ahí el
   porcentaje se mide contra el hueco libre entre caja y celda, y como la
   celda mide justo el alto de la caja ese hueco es cero. El desfase
   horizontal sí puede ir en `background-position`, porque en X la celda es
   más estrecha que la caja y el valor se toma como longitud.

   El lunar es crema y no blanco: sobre este rojo el blanco puro salta un
   escalón por delante de la crema del header y la franja deja de leerse como
   el mismo papel. */
const ROW_1 = "radial-gradient(circle at 50% 13px, #fef8ec 6.5px, transparent 7.3px)";
const ROW_2 = "radial-gradient(circle at 50% 35px, #fef8ec 6.5px, transparent 7.3px)";

export function PolkaRail({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        backgroundImage: [ROW_1, ROW_2, RED].join(", "),
        backgroundSize: "44px 100%, 44px 100%, 100% 100%",
        backgroundPosition: "0 0, 22px 0, 0 0",
        backgroundRepeat: "repeat-x, repeat-x, no-repeat",
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
