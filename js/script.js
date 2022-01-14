let res = document.querySelector('.result');
let youScore = document.querySelector('.youS');
let opScore = document.querySelector('.opS');
let boxes = document.querySelectorAll('.box');
let form = document.querySelector('#mode');
let rest = document.querySelector('.reset');
let you = document.querySelector('.you');
let op = document.querySelector('.op');
let gameC = document.querySelector('.game-c');
let gameCount = 0;
let youS = 0;
let opS = 0;
let count = 0;
let checkScoreVal = false;
let start = true;
let first;

let arList = [
  [0, 4, 8],
  [2, 4, 6],
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
];

document.addEventListener('DOMContentLoaded', addListener);

form.addEventListener('change', (e) => {
  reset();
  if (form.rand.checked) {
    you.textContent = 'YOU';
    op.textContent = 'COMP';
  } else {
    you.textContent = 'PL 1';
    op.textContent = 'PL 2';
  }
});

rest.addEventListener('click', reset);

function addListener() {
  if (form.rand.checked && gameCount % 2 && count === 0) {
    checkO();
  }
  boxes.forEach((it) => {
    it.addEventListener('click', checkX);
    if (!it.dataset.oc) {
      it.style.cursor = 'pointer';
    }
  });
}

function checkX(e) {
  let it = e.target;
  if (form.rand.checked) {
    if (!it.dataset.oc) {
      it.textContent = 'X';
      it.dataset.oc = 'x';
      it.style.filter = 'hue-rotate(45deg)';
      it.style.cursor = 'not-allowed';
      count++;
      checkScore('x');
      boxes.forEach((it) => {
        it.removeEventListener('click', checkX);
      });
      setTimeout(() => {
        if (!checkScoreVal) {
          checkO();
          addListener();
        }
      }, 200);
    }
  } else {
    if (!it.dataset.oc) {
      let k = start ? ['X', 'x', 'hue-rotate(45deg)'] : ['O', 'o', 'hue-rotate(315deg)'];
      it.textContent = k[0];
      it.dataset.oc = k[1];
      it.style.filter = k[2];
      it.style.cursor = 'not-allowed';
      count++;
      start = !start;
      checkScore(k[1]);
    }
  }
}

function checkB(bx) {
  count++;
  bx.textContent = 'O';
  bx.dataset.oc = 'o';
  bx.style.filter = 'hue-rotate(180deg)';
  bx.style.cursor = 'not-allowed';
  checkScore('o');
}

function checkO() {
  if (count < 9) {
    let ar = [0, 2, 6, 8];
    let mir = [8, 6, 2, 0];
    let rnb = Math.floor(Math.random() * 4);
    if (count === 0) {
      first = rnb;
      checkB(boxes[ar[rnb]]);
    } else if (count === 2) {
      if (!boxes[4].dataset.oc) {
        checkB(boxes[4]);
      } else {
        checkB(boxes[mir[first]]);
      }
    } else if (count === 1) {
      if (!boxes[4].dataset.oc) {
        first = rnb;
        checkB(boxes[4]);
      } else {
        first = rnb;
        checkB(boxes[ar[rnb]]);
      }
    } else if (count === 3) {
      defence(rnb, first, mir);
    } else {
      play();
    }
  }
}

function checkScore(x) {
  if (count > 4) {
    if (winCheck(x, arList)) {
      if (x === 'x') {
        won();
      } else {
        lost();
      }
    } else if (count > 8) {
      draw();
    }
  }
}

function winCheck(x, ar) {
  let checkRes = false;

  for (let i = 0, n = ar.length; i < n; i++) {
    if (boxes[ar[i][0]].dataset.oc === x && boxes[ar[i][1]].dataset.oc === x && boxes[ar[i][2]].dataset.oc === x) {
      checkRes = true;

      return checkRes;
    }
  }

  return checkRes;
}

function won() {
  if (form.rand.checked) {
    res.textContent = 'YOU WON! :)';
  } else {
    res.textContent = 'PL1 WON!"';
  }
  res.style.color = 'green';
  res.classList.remove('hidden');

  youS++;
  youScore.textContent = youS;
  restart();
}
function draw() {
  res.textContent = 'DRAW :|';
  res.classList.remove('hidden');
  res.style.color = 'orange';
  restart();
}
function lost() {
  if (form.rand.checked) {
    res.textContent = 'YOU LOST :(';
    res.style.color = 'red';
  } else {
    res.textContent = 'PL2 WON!';
    res.style.color = 'GREEN';
  }

  res.classList.remove('hidden');

  opS++;
  opScore.textContent = opS;
  restart();
}

function restart() {
  gameCount++;
  gameC.textContent = gameCount + 1;
  count = 0;
  checkScoreVal = true;
  start = gameCount % 2 ? false : true;
  setTimeout(() => {
    checkScoreVal = false;
    res.textContent = '';
    res.classList.add('hidden');
    clearBoxes();
  }, 850);
}

function clearBoxes() {
  count = 0;
  boxes.forEach((it) => {
    it.textContent = '';
    it.removeAttribute('style');
    it.dataset.oc = '';
  });
  addListener();
}

function reset() {
  start = true;
  gameCount = 0;
  gameC.textContent = 1;
  youS = 0;
  opS = 0;
  youScore.textContent = youS;
  opScore.textContent = opS;
  clearBoxes();
}

function boxCheck(x, ar) {
  let checkRes = true;
  for (let i = 0, n = ar.length; i < n; i++) {
    if (boxes[ar[i][0]].dataset.oc === x && boxes[ar[i][1]].dataset.oc === x && !boxes[ar[i][2]].dataset.oc) {
      checkB(boxes[ar[i][2]]);
      checkRes = false;
      return checkRes;
    } else if (boxes[ar[i][1]].dataset.oc === x && boxes[ar[i][2]].dataset.oc === x && !boxes[ar[i][0]].dataset.oc) {
      checkB(boxes[ar[i][0]]);
      checkRes = false;
      return checkRes;
    } else if (boxes[ar[i][0]].dataset.oc === x && boxes[ar[i][2]].dataset.oc === x && !boxes[ar[i][1]].dataset.oc) {
      checkB(boxes[ar[i][1]]);
      checkRes = false;
      return checkRes;
    }
  }
  return checkRes;
}

function play() {
  let checkZ = true;
  checkZ = boxCheck('o', arList);

  if (checkZ) {
    checkZ = boxCheck('x', arList);
  }
  if (checkZ) {
    checkZ = attack(arList);
    if (checkZ) {
      randomCheck();
    }
  }
}

function randomCheck() {
  let arR = [];
  boxes.forEach((it, nm) => {
    if (!it.dataset.oc) {
      arR.push(nm);
    }
  });
  let rn = Math.floor(Math.random() * (9 - count));
  let checked = boxes[arR[rn]];

  checkB(checked);
}

function attack(ar) {
  let checkZ = true;
  let ar1 = [];
  for (let i = 0, n = ar.length; i < n; i++) {
    if (
      boxes[ar[i][0]].dataset.oc !== 'x' &&
      boxes[ar[i][1]].dataset.oc !== 'x' &&
      boxes[ar[i][2]].dataset.oc !== 'x' &&
      (boxes[ar[i][0]].dataset.oc === 'o' || boxes[ar[i][1]].dataset.oc === 'o' || boxes[ar[i][2]].dataset.oc === 'o')
    ) {
      for (let j = 0; j < 3; j++) {
        if (!boxes[ar[i][j]].dataset.oc) {
          ar1.push(ar[i][j]);
        }
      }
    }
  }
  let st = new Set(ar1);
  let ar2 = Array.from(st);

  if (ar1.length) {
    for (nm in ar1) {
      if (ar1[nm] !== ar2[nm]) {
        checkB(boxes[ar1[nm]]);
        checkZ = false;
        return checkZ;
      }
    }
    let ran = Math.floor(Math.random() * ar1.length);
    checkB(boxes[ar1[ran]]);
    checkZ = false;
    return checkZ;
  }

  return checkZ;
}

function defence(rnb, first, mir) {
  if (boxes[4].dataset.oc === 'o') {
    if (
      (boxes[0].dataset.oc === 'x' && boxes[8].dataset.oc === 'x') ||
      (boxes[2].dataset.oc === 'x' && boxes[6].dataset.oc === 'x')
    ) {
      let tr = [1, 3, 5, 7];
      checkB(boxes[tr[rnb]]);
    } else if (
      (boxes[1].dataset.oc === 'x' && boxes[3].dataset.oc === 'x') ||
      (boxes[3].dataset.oc === 'x' && boxes[7].dataset.oc === 'x') ||
      (boxes[1].dataset.oc === 'x' && boxes[5].dataset.oc === 'x') ||
      (boxes[5].dataset.oc === 'x' && boxes[7].dataset.oc === 'x')
    ) {
      let ran = Math.floor(Math.random() * 3);
      if (boxes[1].dataset.oc === 'x' && boxes[3].dataset.oc === 'x') {
        let rar = [0, 2, 6];
        checkB(boxes[rar[ran]]);
      } else if (boxes[3].dataset.oc === 'x' && boxes[7].dataset.oc === 'x') {
        let rar = [0, 6, 8];
        checkB(boxes[rar[ran]]);
      } else if (boxes[1].dataset.oc === 'x' && boxes[5].dataset.oc === 'x') {
        let rar = [0, 2, 8];
        checkB(boxes[rar[ran]]);
      } else if (boxes[5].dataset.oc === 'x' && boxes[7].dataset.oc === 'x') {
        let rar = [2, 6, 8];
        checkB(boxes[rar[ran]]);
      }
    } else {
      play();
    }
  } else if (boxes[4].dataset.oc === 'x' && boxes[mir[first]].dataset.oc === 'x') {
    let rn = Math.floor(Math.random() * 2);
    if (first === 0 || first === 3) {
      let lar = [2, 6];
      checkB(boxes[lar[rn]]);
    } else {
      let lar = [0, 8];
      checkB(boxes[lar[rn]]);
    }
  } else {
    play();
  }
}
