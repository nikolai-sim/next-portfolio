function map_range(
  value: number,
  low1: number,
  high1: number,
  low2: number,
  high2: number
) {
  return low2 + ((high2 - low2) * (value - low1)) / (high1 - low1);
}

function map_normal(value: number) {
  return map_range(value, -1, 1, 0, 1);
}

function normalise(val: number, max: number, min: number) {
  const normal = (val - min) / (max - min);
  if (normal < 0) {
    return 0;
  } else if (normal > 1) {
    return 1;
  } else {
    return normal;
  }
}

function dist(x1: number, y1: number, x2: number, y2: number) {
  let a = x1 - x2;
  let b = y1 - y2;

  return Math.sqrt(a * a + b * b);
}

function getPosition(element: HTMLElement) {
  var clientRect = element.getBoundingClientRect();
  return {
    left: clientRect.left + document.body.scrollLeft,
    top: clientRect.top + document.body.scrollTop,
  };
}

const clamp = (num: number, min: number, max: number) =>
  Math.min(Math.max(num, min), max);

const map_obj = (obj: Object, fn: Function) =>
  Object.fromEntries(Object.entries(obj).map(([k, v], i) => [k, fn(v, k, i)]));

function getPositions(element: any) {
  var xPosition = 0;
  var yPosition = 0;

  while (element) {
    xPosition += element.offsetLeft - element.scrollLeft + element.clientLeft;
    yPosition += element.offsetTop - element.scrollTop + element.clientTop;
    element = element.offsetParent;
  }

  return { x: xPosition, y: yPosition };
}

function shuffle(array: []) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

export {
  map_range,
  dist,
  map_normal,
  normalise,
  getPosition,
  map_obj,
  getPositions,
  clamp,
  shuffle,
};
