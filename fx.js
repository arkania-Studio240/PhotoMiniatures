const Fx={
bb(d,w,h,r){r=Math.max(1,Math.round(r));const t=new Float32Array(d.length),n=2*r+1,s=[0,0,0,0];
for(let y=0;y<h;y++){const o=y*w*4;s[0]=s[1]=s[2]=s[3]=0;for(let x=-r;x<=r;x++){const q=o+Math.min(w-1,Math.max(0,x))*4;s[0]+=d[q];s[1]+=d[q+1];s[2]+=d[q+2];s[3]+=d[q+3]}
for(let x=0;x<w;x++){const q=o+x*4;t[q]=s[0]/n;t[q+1]=s[1]/n;t[q+2]=s[2]/n;t[q+3]=s[3]/n;const a=o+Math.min(w-1,x+r+1)*4,b=o+Math.max(0,x-r)*4;s[0]+=d[a]-d[b];s[1]+=d[a+1]-d[b+1];s[2]+=d[a+2]-d[b+2];s[3]+=d[a+3]-d[b+3]}}
const st=w*4;for(let x=0;x<w;x++){s[0]=s[1]=s[2]=s[3]=0;for(let y=-r;y<=r;y++){const q=Math.min(h-1,Math.max(0,y))*st+x*4;s[0]+=t[q];s[1]+=t[q+1];s[2]+=t[q+2];s[3]+=t[q+3]}
for(let y=0;y<h;y++){const q=y*st+x*4;d[q]=s[0]/n;d[q+1]=s[1]/n;d[q+2]=s[2]/n;d[q+3]=s[3]/n;const a=Math.min(h-1,y+r+1)*st+x*4,b=Math.max(0,y-r)*st+x*4;s[0]+=t[a]-t[b];s[1]+=t[a+1]-t[b+1];s[2]+=t[a+2]-t[b+2];s[3]+=t[a+3]-t[b+3]}}},
blur(d,w,h,r,n){for(let i=0;i<d.length;i+=4){const a=d[i+3]/255;d[i]*=a;d[i+1]*=a;d[i+2]*=a}
for(let k=0;k<n;k++)this.bb(d,w,h,r);for(let i=0;i<d.length;i+=4){const a=d[i+3]/255;if(a>0){d[i]/=a;d[i+1]/=a;d[i+2]/=a}}},
defs:{
niveles:{t:'Niveles',p:[['neg','Negros',0,254,0],['gam','Gamma',.2,3,1,.05],['bla','Blancos',1,255,255]],f(d,w,h,p){const T=new Uint8Array(256),a=p.neg,b=Math.max(a+1,p.bla);for(let i=0;i<256;i++)T[i]=255*Math.pow(Math.min(1,Math.max(0,(i-a)/(b-a))),1/p.gam);for(let i=0;i<d.length;i+=4){d[i]=T[d[i]];d[i+1]=T[d[i+1]];d[i+2]=T[d[i+2]]}}},
curvas:{t:'Curvas (5 puntos)',p:[['sh','Sombras',-100,100,0],['mid','Medios',-100,100,0],['hi','Luces',-100,100,0]],f(d,w,h,p){const xs=[0,64,128,192,255],ys=[0,64+p.sh*.6,128+p.mid*.6,192+p.hi*.6,255],T=new Float32Array(256);
for(let i=0;i<256;i++){const k=Math.min(3,Math.floor(i/64)),t=(i-xs[k])/(xs[k+1]-xs[k]);T[i]=ys[k]+(ys[k+1]-ys[k])*t}
for(let n=0;n<4;n++)for(let i=1;i<255;i++)T[i]=(T[i-1]+2*T[i]+T[i+1])/4;for(let i=0;i<d.length;i+=4){d[i]=T[d[i]];d[i+1]=T[d[i+1]];d[i+2]=T[d[i+2]]}}},
enfoque:{t:'Enfocar',p:[['amt','Cantidad',0,300,100],['rad','Radio',1,8,2]],f(d,w,h,p,s){const b=new Uint8ClampedArray(d);Fx.blur(b,w,h,p.rad*s,2);const a=p.amt/100;for(let i=0;i<d.length;i+=4)for(let c=0;c<3;c++)d[i+c]=d[i+c]+(d[i+c]-b[i+c])*a}},
desenfoque:{t:'Desenfoque gaussiano',p:[['rad','Radio',1,40,6]],f(d,w,h,p,s){Fx.blur(d,w,h,p.rad*s,3)}},
ruido:{t:'Ruido / grano',p:[['amt','Cantidad',0,100,25],['mono','Monocromo (1 = sí)',0,1,1]],f(d,w,h,p){const a=p.amt*2.55;for(let i=0;i<d.length;i+=4){if(!d[i+3])continue;const n=(Math.random()-.5)*a;for(let c=0;c<3;c++)d[i+c]+=p.mono?n:(Math.random()-.5)*a}}},
vineta:{t:'Viñeta',p:[['amt','Intensidad',0,100,60],['size','Tamaño',10,100,50]],f(d,w,h,p){const st=p.size/100*.9;for(let y=0;y<h;y++)for(let x=0;x<w;x++){const r=Math.hypot((x/w-.5)*2,(y/h-.5)*2)/1.4142,t=Math.min(1,Math.max(0,(r-st)/(1-st))),f=1-p.amt/100*t*t*(3-2*t),i=(y*w+x)*4;d[i]*=f;d[i+1]*=f;d[i+2]*=f}}},
pixelar:{t:'Pixelar',p:[['size','Tamaño',2,64,8]],f(d,w,h,p,s){const b=Math.max(2,Math.round(p.size*s));for(let y0=0;y0<h;y0+=b)for(let x0=0;x0<w;x0+=b){const y1=Math.min(h,y0+b),x1=Math.min(w,x0+b);let r=0,g=0,bl=0,a=0,n=0;for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){const i=(y*w+x)*4;r+=d[i];g+=d[i+1];bl+=d[i+2];a+=d[i+3];n++}r/=n;g/=n;bl/=n;a/=n;for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){const i=(y*w+x)*4;d[i]=r;d[i+1]=g;d[i+2]=bl;d[i+3]=a}}}},
bn:{t:'Blanco y negro',p:[['amt','Cantidad',0,100,100]],f(d,w,h,p){const a=p.amt/100;for(let i=0;i<d.length;i+=4){const g=.299*d[i]+.587*d[i+1]+.114*d[i+2];for(let c=0;c<3;c++)d[i+c]+=(g-d[i+c])*a}}},
inv:{t:'Invertir colores',p:[],f(d){for(let i=0;i<d.length;i+=4){d[i]=255-d[i];d[i+1]=255-d[i+1];d[i+2]=255-d[i+2]}}},
autoc:{t:'Auto-contraste',p:[],f(d){for(let c=0;c<3;c++){const hs=new Uint32Array(256);let n=0;for(let i=c;i<d.length;i+=4)if(d[i+3-c]){hs[d[i]]++;n++}if(!n)continue;let lo=0,hi=255,a=0;for(;lo<255&&a+hs[lo]<n*.01;lo++)a+=hs[lo];a=0;for(;hi>0&&a+hs[hi]<n*.01;hi--)a+=hs[hi];if(hi<=lo)continue;for(let i=c;i<d.length;i+=4)d[i]=(d[i]-lo)*255/(hi-lo)}}},
calar:{t:'Calar selección',sel:true,p:[['r','Calar (px)',1,60,10]],f(d,w,h,p){Fx.blur(d,w,h,p.r,3)}}},
apply(name,p){const D=this.defs[name],l=L.get();
if(D.sel){if(!Ed.sel)return App.toast('Primero haz una selección');const c=Ed.cloneOf(Ed.sel),x=c.getContext('2d'),id=x.getImageData(0,0,1280,720);D.f(id.data,1280,720,p,1);x.putImageData(id,0,0);Ed.sel=c;Ed.selPath=null;Ed.selTint();Ed.sched();return}
if(!l)return App.toast('Selecciona una capa');L.snap();if(!l.paint)App.toast('Capa convertida a píxeles');
const src=l.paint?Ed.cloneOf(L.img(l.src)):Ed.raster(l),x=src.getContext('2d'),orig=Ed.cloneOf(src),id=x.getImageData(0,0,1280,720);D.f(id.data,1280,720,p,1);x.putImageData(id,0,0);
let out=src;if(Ed.sel){out=Ed.cloneOf(orig);const o=out.getContext('2d');o.globalCompositeOperation='destination-out';o.drawImage(Ed.sel,0,0);const t=Ed.cloneOf(src),tx=t.getContext('2d');tx.globalCompositeOperation='destination-in';tx.drawImage(Ed.sel,0,0);o.globalCompositeOperation='source-over';o.drawImage(t,0,0)}
l.src=Ed.reg('paint',out);App.refresh()},
open(name){const D=this.defs[name],l=L.get();if(!D.p.length)return this.apply(name,{});if(!D.sel&&!l)return App.toast('Selecciona una capa');
const p={};D.p.forEach(q=>p[q[0]]=q[4]);let base=null,pc;
App.modal(`<h3>${D.t}</h3>${D.sel?'':'<canvas id="fxp" width="320" height="180" style="width:100%;border-radius:8px;background:repeating-conic-gradient(#22262d 0 25%,#1a1d22 0 50%) 0 0/16px 16px"></canvas>'}${D.p.map(q=>`<label style="display:flex;justify-content:space-between;gap:8px;margin:10px 0">${q[1]}<input type="range" data-p="${q[0]}" min="${q[2]}" max="${q[3]}" step="${q[5]||1}" value="${q[4]}"></label>`).join('')}<div class="row"><button id="fxo" class="pri">Aplicar</button><button id="fxc">Cancelar</button></div>`);
if(!D.sel){pc=document.getElementById('fxp').getContext('2d',{willReadFrequently:true});const t=document.createElement('canvas');t.width=320;t.height=180;t.getContext('2d').drawImage(Ed.render(l),0,0,320,180);base=t.getContext('2d').getImageData(0,0,320,180)}
const prev=()=>{if(!base)return;const id=new ImageData(new Uint8ClampedArray(base.data),320,180);D.f(id.data,320,180,p,.25);pc.putImageData(id,0,0)};prev();
document.querySelectorAll('#mBody [data-p]').forEach(i=>i.oninput=()=>{p[i.dataset.p]=+i.value;prev()});
document.getElementById('fxc').onclick=()=>document.getElementById('modal').hidden=true;document.getElementById('fxo').onclick=()=>{document.getElementById('modal').hidden=true;this.apply(name,p)}}};
