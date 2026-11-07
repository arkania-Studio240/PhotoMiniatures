/* Historial ligero: los estados deshacer/rehacer no copian las imágenes grandes (data URLs); guardan una referencia
   a un almacén compartido, así 30 pasos pesan casi lo mismo que 1. Además libera los lienzos de pintura y máscara
   y las imágenes que ya no usa ningún paso del historial (barrido en dos pasadas para no borrar nada en uso). */
const HS={m:new Map(),t:new Map(),n:0,cand:new Set(),max:30,timer:0};
L.ser0=function(){return JSON.stringify(this.layers,(k,v)=>{if(typeof v==='string'&&v.length>1000){let t=HS.m.get(v);if(!t){t='§h'+(++HS.n);HS.m.set(v,t);HS.t.set(t,v)}return t}return v})};
L.par=function(s){return JSON.parse(s,(k,v)=>typeof v==='string'&&v.charCodeAt(0)===167&&HS.t.has(v)?HS.t.get(v):v)};
L.snap=function(){this.u.push(this.ser0());let g=false;if(this.u.length>HS.max){this.u.shift();g=true}if(this.r.length){this.r=[];g=true}if(g)this.gcLater()};
L.undo=function(){if(!this.u.length)return;this.r.push(this.ser0());this.layers=this.par(this.u.pop());this.sel=null;this.ms=[]};
L.redo=function(){if(!this.r.length)return;this.u.push(this.ser0());this.layers=this.par(this.r.pop());this.sel=null;this.ms=[]};
L.states=function(){return[...this.u,this.ser0(),...[...this.r].reverse()]};
L.goto=function(i){const a=this.states();if(i<0||i>=a.length)return;this.u=a.slice(0,i);this.r=a.slice(i+1).reverse();this.layers=this.par(a[i]);this.sel=null;this.ms=[]};
L.gcLater=function(){clearTimeout(HS.timer);HS.timer=setTimeout(()=>this.gc(),1500)};
L.gc=function(){const all=[...this.u,...this.r,this.ser0()].join('\n'),used=new Set(all.match(/§h\d+/g)||[]),refs=new Set(all.match(/(?:paint|mask):\d+/g)||[]),usedVals=new Set();
 for(const [t,v] of [...HS.t]){if(used.has(t))usedVals.add(v);else{HS.t.delete(t);HS.m.delete(v)}}
 const now=new Set();for(const k of Object.keys(this.imgs)){const big=k.length>1000,pm=/^(?:paint|mask):/.test(k);if(!(pm?!refs.has(k):big&&!usedVals.has(k)))continue;if(HS.cand.has(k)){delete this.imgs[k]}else now.add(k)}
 HS.cand=now};
