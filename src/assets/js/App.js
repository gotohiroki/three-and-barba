import "../scss/app.scss";

import webgl from "./webgl";
const app = new webgl( document.getElementById('container'));

window.addEventListener('DOMContentLoaded', () => {
  console.log('hello')
  app;
})

window.addEventListener('resize', () => {
  app.setupResize();
})
