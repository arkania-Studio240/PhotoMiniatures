/* Acabado de interfaz: pantalla de carga, menú con iconos, hojas inferiores arrastrables, miniaturas de capas, barra de estado,
   estado vacío del lienzo y barra de progreso global. No cambia la lógica del editor; solo envuelve funciones existentes. */
(function(){
 const $=s=>document.querySelector(s);
 IC.save='M5 3h12l4 4v14H3V3zM7 3v6h8V3M7 21v-7h10v7';
 // pantalla de carga
 const sp=document.getElementById('splash');if(sp){const hide=()=>setTimeout(()=>{sp.classList.add('off');setTimeout(()=>sp.remove(),500)},450);document.readyState==='complete'?hide():addEventListener('load',hide)}
 // barra de progreso global
 const bz=document.createElement('div');bz.id='busy';document.body.append(bz);const Busy={n:0,t:0,on(){this.n++;bz.classList.add('on')},off(){this.n=Math.max(0,this.n-1);if(!this.n&&!this.t)bz.classList.remove('on')},pulse(ms){bz.classList.add('on');clearTimeout(this.t);this.t=setTimeout(()=>{this.t=0;if(!this.n)bz.classList.remove('on')},ms)}};
 if(window.Work){const c=Work.call.bind(Work);Work.call=function(){Busy.on();return c.apply(null,arguments).finally(()=>Busy.off())}}
 const tt=App.toast;App.toast=function(m){if(/…$/.test(String(m)))Busy.pulse(2200);return tt.apply(this,arguments)};
 // menú «Más» con iconos y atajos
 const more=$('#more');if(more){const M={bSave:['save','Ctrl+S'],bOpen:['folderopen'],mPsd:['upload'],mExpPsd:['download'],mPrev:['scan'],bInst:['download']};
  for(const id in M){const b=document.getElementById(id);if(!b||b.dataset.ic)continue;b.dataset.ic=1;const t=b.textContent.trim();b.innerHTML=Ic(M[id][0],18)+'<span>'+t+'</span>'+(M[id][1]?'<kbd>'+M[id][1]+'</kbd>':'')}
  const add=(id,ic,t,k,fn)=>{if(document.getElementById(id))return;const b=document.createElement('button');b.id=id;b.innerHTML=Ic(ic,18)+'<span>'+t+'</span>'+(k?'<kbd>'+k+'</kbd>':'');b.onclick=()=>{more.hidden=true;fn()};more.append(b)};
  const hr=document.createElement('hr');more.append(hr);add('bPal','search','Acciones rápidas','Ctrl+K',()=>Keys.palette());add('bKeys','select','Atajos de teclado','Alt+K',()=>Keys.edit());add('bAuto','done','Autoguardado','',()=>Auto.show())}
 // diálogos: cerrar al tocar fuera y arrastrar hacia abajo (hoja inferior)
 const modal=document.getElementById('modal'),box=modal&&modal.querySelector('.box');
 if(modal){modal.addEventListener('pointerdown',e=>{modal._d=e.target===modal});modal.addEventListener('click',e=>{if(e.target===modal&&modal._d)document.getElementById('mClose').click()});
  const mob=()=>matchMedia('(max-width:800px),(max-height:520px) and (pointer:coarse)').matches;let y0=null,dy=0;
  box.addEventListener('touchstart',e=>{if(!mob())return;const r=box.getBoundingClientRect(),y=e.touches[0].clientY;if(y-r.top<34&&box.scrollTop<=0)y0=y;else y0=null},{passive:true});
  box.addEventListener('touchmove',e=>{if(y0==null)return;dy=Math.max(0,e.touches[0].clientY-y0);box.style.transition='none';box.style.transform='translateY('+dy+'px)'},{passive:true});
  box.addEventListener('touchend',()=>{if(y0==null)return;box.style.transition='';if(dy>90)document.getElementById('mClose').click();box.style.transform='';y0=null;dy=0})}
 // miniaturas de capas
 const Th={c:new Map(),gen:0,sig(l){return[l.type,l.x|0,l.y|0,l.w|0,l.h|0,(l.rot||0).toFixed(2),l.text,l.fill,l.stroke,l.sw,l.font,l.size,l.src&&l.src.length,l.lm,l.op,l.bm,l.br,l.ct,l.sat,l.bl,l.curve,l.tg,l.fill2,l.e_ov,l.e_ig,l.e_st,l.e_s2,l.e_ex,l.e_rg,l.e_pp,l.e_pv,CW,CH].join('|')},
  make(l){const full=Ed.alone(l,true),b=Pro.bb(l);let x0=Math.max(0,b.x0),y0=Math.max(0,b.y0),x1=Math.min(CW,b.x1),y1=Math.min(CH,b.y1);if(x1-x0<2||y1-y0<2){x0=0;y0=0;x1=CW;y1=CH}const w=x1-x0,h=y1-y0,k=Math.min(64/w,64/h),c=document.createElement('canvas');c.width=Math.max(1,Math.round(w*k));c.height=Math.max(1,Math.round(h*k));c.getContext('2d').drawImage(full,x0,y0,w,h,0,0,c.width,c.height);return c.toDataURL()}};
 const lu=App.layersUI;App.layersUI=function(){const r=lu.apply(this,arguments);try{const el=$('#layers'),ls=[...L.layers].reverse(),g=++Th.gen,q=[];[...el.children].forEach((row,i)=>{const l=ls[i];if(!l)return;const s=document.createElement('span');s.className='th';const im=document.createElement('img');im.alt='';s.append(im);row.prepend(s);const sg=Th.sig(l),c=Th.c.get(l.id);if(c&&c.sg===sg)im.src=c.url;else q.push([l,im,sg])});
  const run=()=>{if(g!==Th.gen||!q.length)return;const[l,im,sg]=q.shift();try{const u=Th.make(l);Th.c.set(l.id,{sg,url:u});im.src=u}catch(e){}setTimeout(run,24)};if(q.length)setTimeout(run,60);
  if(Th.c.size>200){const ids=new Set(L.layers.map(l=>l.id));for(const k of [...Th.c.keys()])if(!ids.has(k))Th.c.delete(k)}}catch(e){console.error(e)}return r};
 // barra de estado y estado vacío
 const mid=$('#mid'),sb=document.createElement('div');sb.id='sbar';mid&&mid.append(sb);
 const em=document.createElement('div');em.id='empty';em.innerHTML='<div class="card"><h3>Empieza tu miniatura</h3><p>Añade un título, una imagen o parte de una plantilla.</p><div class="acts"><button class="pri" id="eT">'+Ic('text',18)+'Añadir texto</button><button id="eI">'+Ic('upload',18)+'Subir imagen</button><button id="eP">'+Ic('layout',18)+'Plantillas</button></div></div>';mid&&mid.append(em);
 const go=id=>{const b=document.getElementById(id);b&&b.click()};document.getElementById('eT').onclick=()=>Keys.A.find(a=>a[0]==='text')[3]();document.getElementById('eI').onclick=()=>go('bUp');document.getElementById('eP').onclick=()=>{const t=$('#ltabs [data-t=tpl]');t&&t.click();const n=$('#nav [data-sh=left]');if(n&&getComputedStyle($('#nav')).display!=='none'&&document.body.dataset.sh!=='left')n.click()};
 const upd=()=>{const dash=document.getElementById('dash'),vis=L.layers.filter(l=>l.name!=='fondo').length;em.classList.toggle('on',!!dash&&dash.hidden&&!vis);
  const l=L.get(),zp=document.getElementById('zpct');sb.innerHTML='<span><b>'+CW+' × '+CH+'</b> px</span><span>Zoom <b>'+(zp?zp.textContent:'100%')+'</b></span><span><b>'+L.layers.length+'</b> capa(s)</span><span class="gap"></span>'+(l?'<span>'+(l.type==='text'?'Texto':l.type==='img'?'Imagen':'Forma')+' · <b>'+Math.round(l.x)+', '+Math.round(l.y)+'</b> · '+Math.round(l.w||0)+' × '+Math.round(l.h||0)+'</span>':'<span>Sin selección</span>')};
 const rf=App.refresh;App.refresh=function(){const r=rf.apply(this,arguments);try{upd()}catch(e){}return r};
 const sz=Ed.setZoom;Ed.setZoom=function(){const r=sz.apply(this,arguments);try{upd()}catch(e){}return r};
 const dh=document.getElementById('dash');if(dh)new MutationObserver(upd).observe(dh,{attributes:true,attributeFilter:['hidden']});setTimeout(upd,600)})();
