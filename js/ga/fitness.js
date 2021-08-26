export function calcParcelArea(vertices) {
  let i = -1;
  let n = vertices.length;
  let a;
  let b = vertices[n - 1];
  let area = 0;

  while (++i < n) {
    a = b;
    b = vertices[i];
    area += a.y * b.x - a.x * b.y;
  }
  return area / 2;
}

function faRatio(vertices, validCellCount) {
  return (
    (validCellCount * (CELL_SIZE - 3) * (CELL_SIZE - 3)) /
    calcParcelArea(vertices)
  );
}

export function lenAreaRatio(len, area) {
  return (4 * Math.PI * area) / (len * len);
}
export function matrixValCount(mat, val) {
  let sum = 0;
  for (let col = 0; col < mat.length; col++) {
    for (let row = 0; row < mat.length; row++) {
      const element = mat[col][row];
      if (element === val) {
        sum += 1;
      }
    }
  }
  return sum;
}
