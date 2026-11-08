/* Procesamiento en segundo plano (Web Worker) para operaciones pesadas sobre píxeles. Si el navegador no permite workers,
   se ejecuta la misma función en el hilo principal (más lento, pero funciona). */
const WF={
 bleed(d,W,H,passes){const n=W*H,known=new Uint8Array(n);for(let i=0;i<n;i++)if(d[i*4+3]>=250)known[i]=1;
  for(let p=0;p<passes;p++){const up=[];for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x;if(known[i]||d[i*4+3]===0)continue;let r=0,g=0,b=0,c=0;
   for(let dy=-1;dy<=1;dy++){const yy=y+dy;if(yy<0||yy>=H)continue;for(let dx=-1;dx<=1;dx++){const xx=x+dx;if(xx<0||xx>=W||(!dx&&!dy))continue;const j=yy*W+xx;if(known[j]){r+=d[j*4];g+=d[j*4+1];b+=d[j*4+2];c++}}}
   if(c)up.push(i,r/c,g/c,b/c)}
   if(!up.length)break;for(let k=0;k<up.length;k+=4){const i=up[k];d[i*4]=up[k+1];d[i*4+1]=up[k+2];d[i*4+2]=up[k+3];known[i]=1}}return d},
 sharpen(s,w,h,k){const o=new Uint8ClampedArray(s);for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){const i=(y*w+x)*4;for(let c=0;c<3;c++)o[i+c]=s[i+c]*(1+4*k)-k*(s[i+c-4]+s[i+c+4]+s[i+c-w*4]+s[i+c+w*4])}return o},
 psnr(a,b){let s=0,n=0;for(let k=0;k<a.length;k+=4){const al=a[k+3]/255;for(let j=0;j<3;j++){const e=a[k+j]-b[k+j];s+=e*e*al;n+=al}}const m=s/(n||1);return m<1e-9?99:10*Math.log10(255*255/m)}};
const Work={w:null,id:0,pend:{},
 ok(){if(this.w!==null)return !!this.w;try{const src='const F={'+Object.keys(WF).map(k=>WF[k].toString()).join(',')+'};onmessage=e=>{const{id,name,args}=e.data;try{const r=F[name](...args);postMessage({id,r},r&&r.buffer?[r.buffer]:[])}catch(x){postMessage({id,err:String(x)})}};',u=URL.createObjectURL(new Blob([src],{type:'text/javascript'}));this.w=new Worker(u);URL.revokeObjectURL(u);this.w.onmessage=e=>{const p=this.pend[e.data.id];if(!p)return;delete this.pend[e.data.id];e.data.err?p.no(new Error(e.data.err)):p.ok(e.data.r)};this.w.onerror=()=>{this.w=false;Object.values(this.pend).forEach(p=>p.no(new Error('worker')));this.pend={}};return true}catch(e){this.w=false;return false}},
 call(name,args){return new Promise((ok,no)=>{const run=()=>{try{ok(WF[name](...args))}catch(e){no(e)}};if(!this.ok())return setTimeout(run,0);const id=++this.id;this.pend[id]={ok,no};try{this.w.postMessage({id,name,args},args.filter(a=>a&&a.buffer).map(a=>a.buffer))}catch(e){delete this.pend[id];setTimeout(run,0)}})}};
