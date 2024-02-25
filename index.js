const canvas = document.querySelector("canvas"); //recuperamos la etiqueta
const ctx = canvas.getContext("2d"); //como queremos dibujar en este elemento

canvas.width = 448;
canvas.height = 400;

//Variables del juego

//Variables de la pelota//
const ballRadius = 4;
//posicion de la pelota//
let x = canvas.width / 2;
let y = canvas.height - 30;
//velocidad de la pelota
let dx = 2;
let dy = -2;

//Variables de la Nave
const naveHeight = 10;
const naveWidth = 50;

let naveX = (canvas.width - naveWidth) / 2;
let naveY = canvas.height - naveHeight - 10;

let rightPressed = false;
let leftPressed = false;

//Variable de los ladrillos
const ladrillosRowCount = 6;
const ladrillosColumnCount = 13;
const ladrillosWidth = 30;
const ladrillosHeight = 14;
const ladrillosPadding = 2;
const ladrillosOffsetTop = 80;
const ladrillosOffsetLeft = 15;
const ladrillos = [];

const LADRILLOS_STATUS = {
  SANO: 1,
  ROTO: 0,
};

for (let c = 0; c < ladrillosColumnCount; c++) {
  ladrillos[c] = []; //inicializamos con un array vacio
  for (let r = 0; r < ladrillosRowCount; r++) {
    //calculamos la posicion del ladrillo en la pantalla
    const ladrilloX =
      c * (ladrillosWidth + ladrillosPadding) + ladrillosOffsetLeft;
    const ladrilloY =
      r * (ladrillosHeight + ladrillosPadding) + ladrillosOffsetTop;
    //Asignar un color aleatorio a cada ladrillo
    const random = Math.floor(Math.random() * 8);
    //Guardamos la info de cada ladrillo
    ladrillos[c][r] = {
      x: ladrilloX,
      y: ladrilloY,
      status: LADRILLOS_STATUS.SANO,
      color: random,
    };
  }
}

const NAVE_SENSITIVITY = 8;
function dibujarPelotita() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.closePath(); //terminar el trazado
}
function dibujarNave() {
  ctx.fillRect(
    naveX, //coordenada X
    naveY, //coordenada Y
    naveWidth, //ancho del dibujo
    naveHeight //alto del dibujo
  );
}
function dibujarLadrillos() {
  for (let c = 0; c < ladrillosColumnCount; c++) {
    for (let r = 0; r < ladrillosRowCount; r++) {
      const currentLadrillos = ladrillos[c][r];
      if (currentLadrillos.status == LADRILLOS_STATUS.ROTO) continue;

      ctx.fillStyle = "yellow";
      ctx.fillRect(
        currentLadrillos.x,
        currentLadrillos.y,
        ladrillosWidth,
        ladrillosHeight
      );
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = "#000";
    }
  }
}
function colisionDetectada() {
  for (let c = 0; c < ladrillosColumnCount; c++) {
    for (let r = 0; r < ladrillosRowCount; r++) {
      const currentLadrillos = ladrillos[c][r];
      if (currentLadrillos.status == LADRILLOS_STATUS.ROTO) continue;

      const pelotitaChocaLadrilloX =
        x > currentLadrillos.x && x < currentLadrillos.x + ladrillosWidth;
      const pelotitaChocaLadrilloY =
        y > currentLadrillos.y && y < currentLadrillos.y + ladrillosHeight;
      if (pelotitaChocaLadrilloX && pelotitaChocaLadrilloY) {
        dy = -dy;
        currentLadrillos.status = LADRILLOS_STATUS.ROTO;
      }
    }
  }
}

function movimientoPelotita() {
  //rebotar las pelotas en los laterales
  if (
    x + dx > canvas.width - ballRadius || //pared derecha
    x + dx < ballRadius //pared izquierda
  ) {
    dx = -dx;
  }
  //rebotar arriba
  if (y + dy < ballRadius) {
    dy = -dy;
  }

  //la pelotita choca en la nave
  const pelotitaEnAncho = x > naveX && x < naveX + naveWidth;

  const pelotitaChocaNave = y + dy > naveY;

  if (pelotitaChocaNave & pelotitaEnAncho) {
    dy = -dy; //cambia la direccion de la pelotita
  }
  //la pelotita cae, pierdes
  else if (y + dy > canvas.height - ballRadius) {
    console.log("Perdiste");
    document.location.reload();
  }
  x += dx;
  y += dy;
}

function movimientoNave() {
  if (rightPressed && naveX < canvas.width - naveWidth) {
    naveX += NAVE_SENSITIVITY;
  } else if (leftPressed && naveX > 0) {
    naveX -= NAVE_SENSITIVITY;
  }
}

function cleanCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function initEvents() {
  document.addEventListener("keydown", keyDownHandler);
  document.addEventListener("keyup", keyUpHandler);

  function keyDownHandler(event) {
    const { key } = event;
    if (key == "Right" || key == "ArrowRight") {
      rightPressed = true;
    } else if (key == "Left" || key == "ArrowLeft") {
      leftPressed = true;
    }
  }

  function keyUpHandler(event) {
    const { key } = event;
    if (key == "Right" || key == "ArrowRight") {
      rightPressed = false;
    } else if (key == "Left" || key == "ArrowLeft") {
      leftPressed = false;
    }
  }
}

function draw() {
  console.log({ rightPressed });
  cleanCanvas();
  // Aquí se realizarán los dibujos y chequeos de colisiones

  // Elementos
  dibujarPelotita();
  dibujarNave();
  dibujarLadrillos();

  // Colisiones y movimientos
  colisionDetectada();
  movimientoPelotita();
  movimientoNave(); // Asegúrate de tener los paréntesis aquí

  window.requestAnimationFrame(draw);
}

draw();
initEvents();
