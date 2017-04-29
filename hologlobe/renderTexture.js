'use strict';

const canvas = document.getElementById('test');
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const ctx = canvas.getContext('2d');

const canvasData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);

const colorScale = d3.scale.quantile()
  .range(["#2c7bb6", "#00a6ca","#00ccbc","#90eb9d","#ffff8c","#f9d057","#f29e2e","#e76818","#d7191c"])
  .domain([101000, 102000]);

function drawPixelColor(x, y, r, g, b, a) {
  const index = (Math.round(x) + Math.round(y) * canvasWidth) * 4;

  canvasData.data[index + 0] = r;
  canvasData.data[index + 1] = g;
  canvasData.data[index + 2] = b;
  canvasData.data[index + 3] = a;
}

function drawPixelValue(x, y, value) {
  const color = d3.rgb(colorScale(value));
  drawPixelColor(x, y, color.r, color.g, color.b, 255);
  // drawPixelColor(x, y, 0, 0, 255, 128);  
}

function updateCanvas() {
  ctx.putImageData(canvasData, 0, 0);
}

function renderData(data) {
  for (let i = 0; i < data.lat.length; i += 1) {
    for (let j = 0; j < data.lon.length; j += 1) {
      const y = data.lat[i] + 90;
      const x = (data.lon[j] + 180);
      drawPixelValue(x, y, data.values[i][j]);
    }
  }

  updateCanvas();
}
