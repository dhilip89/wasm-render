
import WasmLoader                     from './WasmLoader';
import StatsGraph, {StatsMode}        from './StatsGraph';
import NativeRasteriser               from './rasteriser/NativeRasteriser';
import WasmRasteriser                 from './rasteriser/WasmRasteriser';
import {WasmInstance}                 from './main.ext';
import Device                         from './Device';
import Vector2                        from './Vector2';

const INT32_SIZE_IN_BYTES = 4;
const SCR_WIDTH = 640, SCR_HEIGHT = 480;
const PAGE_SIZE_BYTES = SCR_WIDTH * SCR_HEIGHT * INT32_SIZE_IN_BYTES;

let w = new WasmLoader();
let s = new StatsGraph(StatsMode.MS);

w.load("./wasm/WasmRasteriser").then((wasm: WasmInstance) =>
{
  // Create a rasteriser
  //let nraster = new NativeRasteriser();
  let wraster = new WasmRasteriser(wasm);

  //console.log(wasm);

  // Create a device, pass the rasteriser
  let device = new Device(SCR_WIDTH, SCR_HEIGHT, wraster);

  device.create();

  wraster.fill(32,0,128);
  //
  // let pts:Vector2[] = [
  //     new Vector2(10, 10),
  //     new Vector2(100, 10),
  //     new Vector2(10, 100)
  // ];
  //
  // nraster.tri(pts, 255, 0, 255);

  for (let x=0; x <640; x+=8)
  {
    wraster.vline(x, 0, 479, 255,255,255);
    wraster.vline(x+1, 0, 479, 0,0,0);
    wraster.vline(x+2, 0, 479, 255,255,255);
  }

  // for (let t=0; t<10000; t++)
  // {
  //   nraster.line(
  //     Math.floor(Math.random() * SCR_WIDTH),
  //     Math.floor(Math.random() * SCR_HEIGHT),
  //     Math.floor(Math.random() * SCR_WIDTH),
  //     Math.floor(Math.random() * SCR_HEIGHT),
  //     Math.floor(Math.random() * 255),
  //     Math.floor(Math.random() * 255),
  //     Math.floor(Math.random() * 255)
  //   );
  // }

  device.flip();

  requestAnimationFrame(render);

  function render()
  {
    s.begin();
    device.flip();
    s.end();

    // s.begin();
    // for (let t:number = 0; t<60; t++)
    // {
    //   //wasm.a.addOne(128, HEAP_buffer_ptr8, PAGE_SIZE_BYTES);
    //   device.flip(view);
    // }
    // s.end();
    //
    requestAnimationFrame(render);
  }

});


/*
function runbenchmarks(wasm)
{
  const bsize = 65536;
  const iterations = 5000;
  let hm = wasm._malloc(bsize);
  let wasmview = new Uint8Array(wasm.buffer, hm, bsize);
  let realview = new Uint8Array(bsize);

  let tstart = performance.now();
  // write to buffer
  for (let i=0; i<iterations; i++)
  {
    for (let o=0; o<bsize; o++)
      wasmview[o] = 1;
  }

  let wasmtotal_write = performance.now() - tstart;

  tstart = performance.now();
  // write to buffer
  for (let i=0; i<iterations; i++)
  {
    for (let o=0; o<bsize; o++)
      realview[o] = 1;
  }

  let realtotal_write = performance.now() - tstart;

  tstart = performance.now();
  let v = 0;
  // read
  for (let i=0; i<iterations; i++)
  {
    for (let o=0; o<bsize; o++)
      v = wasmview[o];
  }

  let wasmtotal_read = performance.now() - tstart;

  tstart = performance.now();
  v = 0;
  // read
  for (let i=0; i<iterations; i++)
  {
    for (let o=0; o<bsize; o++)
      v = realview[o];
  }

  let realtotal_read = performance.now() - tstart;


  console.log(`For ${iterations} WRITE iterations to ${bsize} bytes in WASM View took ${wasmtotal_write} ms`);
  console.log(`For ${iterations} WRITE iterations to ${bsize} bytes in REAL View took ${realtotal_write} ms`);
  console.log(`For ${iterations} READ iterations to ${bsize} bytes in WASM View took ${wasmtotal_read} ms`);
  console.log(`For ${iterations} READ iterations to ${bsize} bytes in REAL View took ${realtotal_read} ms`);


}
*/