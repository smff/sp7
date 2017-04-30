'use strict';

const Canvas = require('canvas');
const d3 = require('d3');

const canvasWidth = 360;
const canvasHeight = 180;

module.exports = (data, min, max) => {

  const colorScale = d3.scaleQuantile()
      .range(["#2c7bb6", "#00a6ca", "#00ccbc", "#90eb9d", "#ffff8c", "#f9d057", "#f29e2e", "#e76818", "#d7191c"])
      .domain([min, max]);

  let Image = Canvas.Image
      , canvas = new Canvas(canvasWidth, canvasHeight)
      , ctx = canvas.getContext('2d');

  let canvasData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);

  for (let i = 0; i < data.lat.length; i += 1) {
    for (let j = 0; j < data.lon.length; j += 1) {
      const y = -data.lat[i] + 90;
      const x = (data.lon[j] + 180);
      let color = d3.rgb(colorScale(data.values[i][j]));
      let index = (Math.round(x) + Math.round(y) * canvasWidth) * 4;
      canvasData.data[index + 0] = color.r;
      canvasData.data[index + 1] = color.g;
      canvasData.data[index + 2] = color.b;
      canvasData.data[index + 3] = 255;
    }
  }

  ctx.putImageData(canvasData, 0, 0);

  return canvas.toBuffer();
};

function drawPixelValue(x, y, value) {
  const color = d3.rgb(colorScale(value));
  drawPixelColor(x, y, color.r, color.g, color.b, 255);
}

function drawPixelColor(x, y, r, g, b, a) {
  const index = (Math.round(x) + Math.round(y) * canvasWidth) * 4;

  canvasData.data[index + 0] = r;
  canvasData.data[index + 1] = g;
  canvasData.data[index + 2] = b;
  canvasData.data[index + 3] = a;
}