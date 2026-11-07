/* Zoom y desplazamiento profesionales: el zoom (pellizco con dos dedos, Ctrl+rueda, botones) se ancla en el punto
   bajo los dedos o el cursor. Barra con −, +, ajustar y porcentaje. Teclas: + / − / 0 (ajustar). */
Ed.zoomAt=function(w,cx,cy){const wr=document.getElementById('wrap'),r=this.cv.getBoundingClientRect(),fx=(cx-r.left)/r.width,fy=(cy-r.top)/r.height;this.setZoom(w);const r2=this.cv.getBoundingClientRect();wr.scrollLeft+=r2.left+fx*r2.width-cx;wr.scrollTop+=r2.top+fy*r2.height-cy};
Ed.zoomStep=function(k){const wr=document.getElementById('wrap').getBoundingClientRect(),r=this.cv.getBoundingClientRect();this.zoomAt(r.width*k,wr.left+wr.width/2,wr.top+wr.height/2)};
(function(){
 const z=document.querySelector('.zoom'),sl=document.getElementById('zoom');if(!z)return;
 const b=(id,ic,t)=>{const e=document.createElement('button');e.id=id;e.className='icb';e.title=t;e.setAttribute('aria-label',t);e.innerHTML=Ic(ic);return e},
  pct=document.createElement('button');pct.id='zpct';pct.className='zp';pct.title='Zoom 100%';pct.textContent='100%';
 const mn=b('zOut','minus','Alejar'),pl=b('zIn','plus','Acercar'),ft=b('zFit','grow','Ajustar a la pantalla');
 z.prepend(mn);z.append(pl,pct,ft);
 mn.onclick=()=>Ed.zoomStep(1/1.25);pl.onclick=()=>Ed.zoomStep(1.25);ft.onclick=()=>Ed.fit();pct.onclick=()=>Ed.zoomStep(CW/Ed.cv.getBoundingClientRect().width);
 const o=Ed.setZoom;Ed.setZoom=function(w){o.call(this,w);const p=Math.round(this.cv.getBoundingClientRect().width/CW*100);pct.textContent=p+'%';if(sl)sl.value=p};
 addEventListener('keydown',e=>{if(e.ctrlKey||e.metaKey||e.altKey||e.target.closest&&e.target.closest('input,textarea,select,[contenteditable]'))return;if(e.key==='+'||e.key==='=')Ed.zoomStep(1.25);else if(e.key==='-')Ed.zoomStep(.8);else if(e.key==='0')Ed.fit();else return;e.preventDefault()});
})();
