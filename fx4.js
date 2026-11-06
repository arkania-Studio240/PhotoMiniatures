/* Ajustes generales de imagen (afectan a todo el lienzo, también en la exportación):
   exposición, contraste, saturación, viñeta y grano. Se guardan con el proyecto en Ed.post. */
Ed.post={};
Ed.postOn=function(){const p=this.post;return p.ex||p.ct||p.sa||p.vg||p.gr};
Ed.postFx=function(ctx){const p=this.post;if(!this.postOn())return;const cv=ctx.canvas,w=cv.width,h=cv.height;ctx.save();ctx.setTransform(1,0,0,1,0,0);
 if(p.ex||p.ct||p.sa){const t=this._pt||(this._pt=document.createElement('canvas'));t.width=w;t.height=h;const x=t.getContext('2d');x.clearRect(0,0,w,h);x.drawImage(cv,0,0);
  ctx.clearRect(0,0,w,h);ctx.filter=`brightness(${100+(p.ex||0)}%) contrast(${100+(p.ct||0)}%) saturate(${100+(p.sa||0)}%)`;ctx.drawImage(t,0,0);ctx.filter='none'}
 if(p.vg){const g=ctx.createRadialGradient(w/2,h/2,Math.min(w,h)*.3,w/2,h/2,Math.hypot(w,h)/2);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,`rgba(0,0,0,${p.vg/100})`);ctx.fillStyle=g;ctx.fillRect(0,0,w,h)}
 if(p.gr){if(!this._gp){const n=document.createElement('canvas');n.width=n.height=256;const x=n.getContext('2d'),d=x.createImageData(256,256);let s=12345;for(let i=0;i<d.data.length;i+=4){s=(s*1103515245+12345)&0x7fffffff;const v=(s>>16)&255;d.data[i]=d.data[i+1]=d.data[i+2]=v;d.data[i+3]=255}x.putImageData(d,0,0);this._gp=n}
  ctx.globalCompositeOperation='overlay';ctx.globalAlpha=p.gr/100;ctx.fillStyle=ctx.createPattern(this._gp,'repeat');ctx.fillRect(0,0,w,h)}
 ctx.restore()};
Ed.syncPost=function(){document.querySelectorAll('#postfx [data-k]').forEach(i=>i.value=this.post[i.dataset.k]||0);this.sched()};
(function(){const F=[['ex','Exposición',-60,60],['ct','Contraste',-60,60],['sa','Saturación',-100,100],['vg','Viñeta',0,100],['gr','Grano',0,60]],
 s=document.querySelector('.sec[data-s="view"]');if(!s)return;const d=document.createElement('div');d.id='postfx';d.className='grid';
 d.innerHTML='<h4 style="grid-column:1/-1;margin:8px 0 0">Ajustes generales</h4>'+F.map(f=>`<label>${f[1]}<input type="range" data-k="${f[0]}" min="${f[2]}" max="${f[3]}" value="0"></label>`).join('')+'<button id="postReset" style="grid-column:1/-1">Restablecer ajustes</button>';s.append(d);
 d.addEventListener('input',e=>{const k=e.target.dataset.k;if(k){Ed.post[k]=+e.target.value;Ed.sched()}});
 d.addEventListener('change',e=>{if(e.target.dataset.k&&App.save)App.save(true)});
 document.getElementById('postReset').onclick=()=>{Ed.post={};Ed.syncPost();App.toast('Ajustes restablecidos')}})();
