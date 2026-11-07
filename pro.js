/* Herramientas 4.0: base común (modal ancho, utilidades de imagen) y pestaña «Análisis». */
const Pro={
 modal(h,wide){const b=document.getElementById('mBody').parentElement;b.classList.toggle('wide',!!wide);App.modal(h)},
 small(c,w){const h=Math.max(1,Math.round(w*c.height/c.width)),s=document.createElement('canvas');s.width=w;s.height=h;s.getContext('2d').drawImage(c,0,0,w,h);return s},
 data(c){return c.getContext('2d').getImageData(0,0,c.width,c.height)},
 without(l,w){const v=l.vis;l.vis=false;try{return this.small(Exp.canvas(),w)}finally{l.vis=v}},
 bb(l){const w=l.w||0,h=l.h||0;let b;if(l.type==='text'&&window.Analyze){const t=Analyze.tbox(l);b={x0:t.x0,y0:t.y0,x1:t.x1,y1:t.y1};if(!l.rot)return b;const cx=(b.x0+b.x1)/2,cy=(b.y0+b.y1)/2,ww=b.x1-b.x0,hh=b.y1-b.y0;return this.rbox(cx,cy,ww,hh,l.rot)}return this.rbox(l.x,l.y,w,h,l.rot||0)},
 rbox(cx,cy,w,h,r){const c=Math.cos(r),s=Math.sin(r),xs=[],ys=[];[[-1,-1],[1,-1],[1,1],[-1,1]].forEach(p=>{const x=p[0]*w/2,y=p[1]*h/2;xs.push(cx+x*c-y*s);ys.push(cy+x*s+y*c)});return{x0:Math.min(...xs),y0:Math.min(...ys),x1:Math.max(...xs),y1:Math.max(...ys)}},
 layers(){return L.layers.filter(l=>l.vis&&l.name!=='fondo')},
 nm(l){return '«'+String(l.type==='text'?l.text:l.name||l.type).replace(/\n/g,' ').slice(0,18)+'»'},
 mean(d,pick){let r=0,g=0,b=0,n=0;for(let i=0;i<d.length;i+=4){const w=pick(i/4,d[i+3]);if(w>0){r+=d[i]*w;g+=d[i+1]*w;b+=d[i+2]*w;n+=w}}return n?[r/n,g/n,b/n]:null},
 init(){const m={pInsp:()=>Insp.show(),pSim:()=>Sim.show(),pA11y:()=>A11y.show()};for(const k in m){const e=document.getElementById(k);if(e)e.onclick=()=>{if(!L.layers.length)return App.toast('El lienzo está vacío: añade elementos primero');m[k]()}}}};
Pro.init();
