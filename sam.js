/* Selección interactiva por clics con SAM (SlimSAM vía transformers.js, se ejecuta en el navegador).
   El modelo se descarga de internet la primera vez (CDN jsDelivr + Hugging Face); no hay claves API.
   Clic = mantener (+), botón «− Quitar» = excluir. El resultado se aplica como máscara de la capa: la imagen original no se toca. */
const SamAI={LIB:'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.2',MODEL:'Xenova/slimsam-77-uniform',pts:[],active:false,neg:false,l:null,prev:null,busy:Promise.resolve(),
 async load(){if(!this._p)this._p=(async()=>{const T=await import(this.LIB);T.env.allowLocalModels=false;const[m,p]=await Promise.all([T.SamModel.from_pretrained(this.MODEL),T.AutoProcessor.from_pretrained(this.MODEL)]);this.T=T;this.model=m;this.processor=p})().catch(e=>{this._p=null;throw e});return this._p},
 async embed(l){if(this.cache&&this.cache.src===l.src)return;const img=await this.T.RawImage.fromURL(l.src),inputs=await this.processor(img),emb=await this.model.get_image_embeddings(inputs);this.cache={src:l.src,img,inputs,emb}},
 async run(l,pts){const T=this.T,c=this.cache,rs=c.inputs.reshaped_input_sizes[0],W=c.img.width,H=c.img.height,P=pts.map(p=>[p.x*rs[1]/W,p.y*rs[0]/H]);
  const out=await this.model({...c.emb,input_points:new T.Tensor('float32',P.flat(),[1,1,P.length,2]),input_labels:new T.Tensor('int64',pts.map(p=>BigInt(p.label)),[1,1,pts.length])});
  const m=await this.processor.post_process_masks(out.pred_masks,c.inputs.original_sizes,c.inputs.reshaped_input_sizes),sc=out.iou_scores.data;let b=0;for(let i=1;i<sc.length;i++)if(sc[i]>sc[b])b=i;
  const t=m[0],h=t.dims[2],w=t.dims[3],o=new Uint8Array(w*h);o.set(t.data.subarray(b*w*h,(b+1)*w*h));return{w,h,data:o}},
 dims(l){const i=L.img(l.src);return[i.naturalWidth||1,i.naturalHeight||1]},
 toImg(l,x,y){const[W,H]=this.dims(l),r=-(l.rot||0),dx=x-l.x,dy=y-l.y;let u=dx*Math.cos(r)-dy*Math.sin(r),v=dx*Math.sin(r)+dy*Math.cos(r);if(l.fx)u=-u;if(l.fy)v=-v;return{x:(u/l.w+.5)*W,y:(v/l.h+.5)*H}},
 toCv(l,px,py){const[W,H]=this.dims(l),r=l.rot||0;let u=(px/W-.5)*l.w,v=(py/H-.5)*l.h;if(l.fx)u=-u;if(l.fy)v=-v;return{x:l.x+u*Math.cos(r)-v*Math.sin(r),y:l.y+u*Math.sin(r)+v*Math.cos(r)}},
 status(t){const s=document.getElementById('samSt');if(s)s.textContent=t},
 async start(l){if(this.active)return;this.l=l;this.pts=[];this.prev=null;this.mask=null;this.active=true;this.neg=false;this.bar(true);Ed.sched();
  try{this.status('Cargando modelo…');await this.load();await this.embed(l);if(this.active)this.status('Toca el objeto que quieres conservar')}catch(e){console.error(e);App.toast('No se pudo ejecutar el modelo. Revisa tu conexión e inténtalo de nuevo.');this.stop()}},
 stop(){this.active=false;this.pts=[];this.prev=null;this.mask=null;this.bar(false);Ed.sched()},
 add(e){const m=Ed.pos?Ed.pos(e):(()=>{const r=Ed.cv.getBoundingClientRect(),k=CW/r.width;return{x:(e.clientX-r.left)*k,y:(e.clientY-r.top)*k}})(),p=this.toImg(this.l,m.x,m.y),[W,H]=this.dims(this.l);
  if(p.x<0||p.y<0||p.x>W||p.y>H)return;this.pts.push({x:p.x,y:p.y,label:this.neg?0:1});this.update()},
 update(){Ed.sched();if(!this.pts.length){this.prev=null;this.mask=null;return}const pts=this.pts.slice(),l=this.l;
  this.busy=this.busy.then(async()=>{try{this.status('Segmentando…');const r=await this.run(l,pts);if(!this.active||pts.length!==this.pts.length)return;this.mask=r;const c=document.createElement('canvas');c.width=r.w;c.height=r.h;const x=c.getContext('2d'),d=x.createImageData(r.w,r.h);for(let i=0;i<r.data.length;i++){if(r.data[i]){d.data[i*4]=0;d.data[i*4+1]=200;d.data[i*4+2]=120;d.data[i*4+3]=255}}x.putImageData(d,0,0);this.prev=c;this.status(pts.length+' pts');Ed.sched()}catch(e){console.error(e);App.toast('No se pudo ejecutar el modelo. Revisa tu conexión e inténtalo de nuevo.')}})},
 undo(){this.pts.pop();this.update()},
 apply(){const l=this.l,r=this.mask;if(!r)return App.toast('Primero haz una selección');const cut=document.createElement('canvas');cut.width=r.w;cut.height=r.h;const cx=cut.getContext('2d'),d=cx.createImageData(r.w,r.h);for(let i=0;i<r.data.length;i++){d.data[i*4]=d.data[i*4+1]=d.data[i*4+2]=255;d.data[i*4+3]=r.data[i]?255:0}cx.putImageData(d,0,0);
  const mask=Ed.mk(),mx=mask.getContext('2d'),a=l.cL||0,b=l.cT||0,c2=l.cR||0,d2=l.cB||0,dx=-l.w/2+l.w*a/100,dy=-l.h/2+l.h*b/100,dw=l.w*(1-(a+c2)/100),dh=l.h*(1-(b+d2)/100);
  mx.save();mx.translate(l.x,l.y);mx.rotate(l.rot||0);mx.scale(l.fx?-1:1,l.fy?-1:1);mx.drawImage(cut,r.w*a/100,r.h*b/100,r.w*(1-(a+c2)/100),r.h*(1-(b+d2)/100),dx,dy,dw,dh);mx.restore();
  L.snap();if(!l.origSrc)l.origSrc=l.src;l.lm=Ed.reg('mask',mask);this.stop();App.refresh();App.toast('Selección aplicada como máscara. Puedes retocarla o restaurar la original.')},
 paint(ctx){const l=this.l;if(!l)return;const k=CW/Ed.cv.clientWidth;if(this.prev){ctx.save();ctx.translate(l.x,l.y);ctx.rotate(l.rot||0);ctx.scale(l.fx?-1:1,l.fy?-1:1);ctx.globalAlpha=.5;ctx.drawImage(this.prev,-l.w/2,-l.h/2,l.w,l.h);ctx.restore()}
  this.pts.forEach(p=>{const q=this.toCv(l,p.x,p.y);ctx.beginPath();ctx.arc(q.x,q.y,9*k,0,7);ctx.fillStyle=p.label?'#22c55e':'#ef4444';ctx.fill();ctx.lineWidth=2.5*k;ctx.strokeStyle='#fff';ctx.stroke()})},
 bar(on){let b=document.getElementById('samBar');if(!on){if(b)b.hidden=true;return}
  if(!b){b=document.createElement('div');b.id='samBar';b.style.cssText='position:fixed;left:50%;bottom:76px;transform:translateX(-50%);z-index:60;display:flex;gap:6px;align-items:center;flex-wrap:wrap;justify-content:center;max-width:94vw;padding:8px 10px;background:#141416;border:1px solid #2a2a2e;border-radius:12px;box-shadow:0 8px 30px #000a';
   b.innerHTML='<button id="samP" class="pri">＋ Mantener</button><button id="samN">− Quitar</button><button id="samU">Quitar punto</button><button id="samOk" class="pri">Aplicar</button><button id="samX">Cancelar</button><small id="samSt" style="color:#aaa;min-width:120px"></small>';document.body.append(b);
   const sel=()=>{document.getElementById('samP').classList.toggle('pri',!this.neg);document.getElementById('samN').classList.toggle('pri',this.neg)};
   samP.onclick=()=>{this.neg=false;sel()};samN.onclick=()=>{this.neg=true;sel()};samU.onclick=()=>this.undo();samOk.onclick=()=>this.apply();samX.onclick=()=>this.stop();this._sel=sel}
  b.hidden=false;this.neg=false;this._sel();if(window.I18n)I18n.set(I18n.lang)}};
(function(){const od=Ed.draw;Ed.draw=function(ctx,exp,nobg){od.call(this,ctx,exp,nobg);if(!exp&&ctx===this.ctx&&SamAI.active)SamAI.paint(ctx)};
 document.getElementById('cv').addEventListener('pointerdown',e=>{if(!SamAI.active)return;e.preventDefault();e.stopImmediatePropagation();if(e.shiftKey||e.button===2)SamAI.neg=true;SamAI.add(e)},true);
 const pr=document.getElementById('props');if(pr)new MutationObserver(()=>{const a=document.getElementById('aiCut');if(!a||document.getElementById('samBtn'))return;const b=document.createElement('button');b.id='samBtn';b.className=a.className;b.textContent='Seleccionar con IA (clics)';b.onclick=()=>{const l=L.get();if(l&&l.type==='img')SamAI.start(l)};a.after(b)}).observe(pr,{childList:true,subtree:true})})();
