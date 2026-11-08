/* Exportación inteligente: perfiles, calidad, compresión hasta un peso objetivo, comparación antes/después (vista dividida, lupa 100 % y PSNR)
   y avisos de dimensiones/peso. Sustituye al diálogo básico; sigue usando Exp.canvas y PSD.download. */
const Xp={
 P:{yt:{n:'YouTube: JPG hasta 2 MB (válido desde móvil)',fmt:'image/jpeg',maxKB:2000,q:.95,scale:1},hq:{n:'Máxima calidad: PNG sin pérdida',fmt:'image/png'},web:{n:'Web ligera: WebP hasta 500 KB',fmt:'image/webp',maxKB:500,q:.92},alpha:{n:'PNG con fondo transparente',fmt:'image/png',tr:1},psd:{n:'PSD con capas editables',psd:1},custom:{n:'Personalizado',fmt:'image/jpeg',q:.9,custom:1}},
 cur:'yt',urls:[],run:0,
 blob(c,t,q){return new Promise(r=>c.toBlob(r,t,q))},
 img(u){return new Promise((ok,no)=>{const i=new Image();i.onload=()=>ok(i);i.onerror=no;i.src=u})},
 rel(){const r=CW/CH;return Math.abs(r-16/9)<.01},
 settings(){const p=Object.assign({},this.P[this.cur]);if(p.custom){p.fmt=document.getElementById('xF').value;p.q=+document.getElementById('xQ').value;const m=+document.getElementById('xM').value;p.maxKB=m>0?m:0}
  p.rs=!!(document.getElementById('xR')&&document.getElementById('xR').checked);return p},
 async build(p){let c=Exp.canvas(!!p.tr);if(p.rs&&(c.width!==1280||c.height!==720)){const s=document.createElement('canvas');s.width=1280;s.height=720;const x=s.getContext('2d');x.imageSmoothingQuality='high';x.drawImage(c,0,0,1280,720);c=s}
  const lossy=p.fmt!=='image/png';let q=p.q||.92,b=await this.blob(c,p.fmt,lossy?q:undefined),it=1;
  if(lossy&&p.maxKB){let lo=.3,hi=q;if(b.size/1024>p.maxKB){while(it<8){q=(lo+hi)/2;b=await this.blob(c,p.fmt,q);if(b.size/1024>p.maxKB)hi=q;else lo=q;it++}q=lo;b=await this.blob(c,p.fmt,q)}}
  return{c,b,q:lossy?q:null,lossy}},
 psnr(a,i){const w=a.width,h=a.height,t=document.createElement('canvas');t.width=w;t.height=h;t.getContext('2d').drawImage(i,0,0,w,h);const d1=a.getContext('2d').getImageData(0,0,w,h).data,d2=t.getContext('2d').getImageData(0,0,w,h).data;return Work.call('psnr',[d1,d2])},
 warn(c,b,p){const w=[],kb=b.size/1024;if(c.width<640)w.push(['e','El ancho ('+c.width+' px) es menor que el mínimo de YouTube (640 px): se rechazaría.']);else if(c.width<1280||c.height<720)w.push(['w','Menor que la resolución recomendada de 1280×720.']);
  if(Math.abs(c.width/c.height-16/9)>.01)w.push(['w','La relación de aspecto no es 16:9: YouTube puede añadir bandas o recortar.']);
  if(kb>2048)w.push(['w','Pesa más de 2 MB: subida desde móvil limitada a 2 MB (YouTube indica 50 MB desde ordenador; confírmalo en su ayuda).']);
  if(p.fmt==='image/webp')w.push(['w','YouTube suele citar JPG, PNG o GIF para miniaturas; comprueba que acepte WebP antes de subirlo.']);
  if(p.tr)w.push(['w','Los fondos transparentes pueden verse negros o blancos según el reproductor.']);return w},
 show(){this.urls.forEach(u=>URL.revokeObjectURL(u));this.urls=[];
  Pro.modal('<h3>Exportar '+CW+'×'+CH+'</h3><label>Perfil<select id="xP">'+Object.keys(this.P).map(k=>'<option value="'+k+'"'+(k===this.cur?' selected':'')+'>'+this.P[k].n+'</option>').join('')+'</select></label>'
   +'<div id="xC" class="sctl" hidden><label>Formato<select id="xF"><option value="image/jpeg">JPG</option><option value="image/webp">WebP</option><option value="image/png">PNG</option></select></label><label>Calidad <input id="xQ" type="range" min=".3" max="1" step=".01" value=".9"></label><label>Peso máximo (KB, 0 = sin límite)<input id="xM" type="number" inputmode="numeric" min="0" value="0"></label></div>'
   +'<label class="ck" id="xRl" hidden><input type="checkbox" id="xR" checked> Reescalar a 1280×720 (tu lienzo es 16:9 pero de otro tamaño)</label>'
   +'<div id="xI"><p class="empty">Calculando…</p></div><div class="szc"><button class="pri" id="xD" disabled>Descargar</button></div>',true);
  const P=document.getElementById('xP'),upd=()=>{const p=this.P[this.cur];document.getElementById('xC').hidden=!p.custom;document.getElementById('xRl').hidden=!(p.scale&&this.rel()&&(CW!==1280||CH!==720));document.getElementById('xD').disabled=true;clearTimeout(this.tm);this.tm=setTimeout(()=>this.calc(),350)};
  P.onchange=()=>{this.cur=P.value;upd()};['xF','xQ','xM','xR'].forEach(i=>{const e=document.getElementById(i);if(e)e.oninput=e.onchange=upd});
  document.getElementById('xD').onclick=()=>this.dl();upd()},
 async calc(){const my=++this.run,box=document.getElementById('xI');if(!box)return;const p=this.settings();if(p.psd){box.innerHTML='<p>Se exportará un archivo PSD con tus capas (soporte de capas, máscaras básicas y texto rasterizado según la implementación existente). El tamaño depende de las imágenes.</p>';document.getElementById('xD').disabled=false;return}
  box.innerHTML='<p class="empty">Calculando…</p>';let r;try{r=await this.build(p)}catch(e){console.error(e);box.innerHTML='<p class="empty">No se pudo generar el archivo. Prueba con un tamaño de lienzo menor.</p>';return}
  if(my!==this.run)return;this.last={p,r};const kb=r.b.size/1024,ws=this.warn(r.c,r.b,p);let png=null,ps='',iu='',ou='';
  try{this.urls.forEach(u=>URL.revokeObjectURL(u));this.urls=[];ou=URL.createObjectURL(r.b);this.urls.push(ou);const im=await this.img(ou);if(my!==this.run)return;if(r.lossy&&!p.tr){const pn=await this.psnr(r.c,im);ps=pn>=40?'prácticamente idéntica':pn>=35?'muy buena':pn>=30?'buena (puede notarse en degradados)':'con pérdida visible';png=pn}
   const pb=await this.blob(r.c,'image/png');iu=URL.createObjectURL(pb);this.urls.push(iu);this.pngKB=pb.size/1024}catch(e){console.error(e)}
  if(my!==this.run)return;
  const sav=r.lossy&&this.pngKB?Math.round((1-kb/this.pngKB)*100):0;
  box.innerHTML='<table class="ct"><tr><td>Resolución</td><td>'+r.c.width+' × '+r.c.height+'</td></tr><tr><td>Formato</td><td>'+r.b.type.replace('image/','').toUpperCase()+(r.q?' · calidad '+Math.round(r.q*100)+'%':'')+'</td></tr><tr><td>Peso</td><td><b>'+(kb>=1024?(kb/1024).toFixed(2)+' MB':Math.round(kb)+' KB')+'</b>'+(sav>0?' · '+sav+'% menos que el PNG original ('+Math.round(this.pngKB)+' KB)':'')+'</td></tr>'+(png?'<tr><td>Fidelidad</td><td>PSNR '+png.toFixed(1)+' dB: '+ps+'</td></tr>':'')+'</table>'
   +(ws.length?ws.map(w=>'<div class="ri" style="border-color:'+(w[0]==='e'?'#e5383b':'#e0a23b')+'"><span>'+w[1]+'</span></div>').join(''):'<div class="ri" style="border-color:#4cae6e"><span>Cumple las medidas habituales para miniaturas de YouTube.</span></div>')
   +(iu&&r.lossy?'<h4>Antes y después de comprimir</h4><div class="csplit" id="xS"><img src="'+ou+'"><img src="'+iu+'" id="xSa" style="clip-path:inset(0 50% 0 0)"><i id="xSl" style="left:50%"></i></div><small>Izquierda: original sin pérdida · Derecha: archivo exportado. Arrastra para comparar.</small><div class="aps" id="xZ"></div>':'');
  document.getElementById('xD').disabled=false;
  const S=document.getElementById('xS');if(S){const set=q=>{document.getElementById('xSa').style.clipPath='inset(0 '+(100-q)+'% 0 0)';document.getElementById('xSl').style.left=q+'%'},mv=e=>{const b=S.getBoundingClientRect();set(Math.max(0,Math.min(100,(e.clientX-b.left)/b.width*100)))};S.onpointerdown=e=>{S.setPointerCapture(e.pointerId);mv(e);S.onpointermove=mv};S.onpointerup=()=>{S.onpointermove=null};
   try{const a=await this.img(iu),b=await this.img(ou),cw=Math.min(220,r.c.width),ch=Math.min(150,r.c.height),sx=Math.max(0,(r.c.width-cw)/2|0),sy=Math.max(0,(r.c.height-ch)/2|0),mk=(i,t)=>{const c=document.createElement('canvas');c.width=cw;c.height=ch;c.getContext('2d').drawImage(i,sx,sy,cw,ch,0,0,cw,ch);c.style.cssText='image-rendering:pixelated;border-radius:6px;max-width:100%';const d=document.createElement('div');d.append(c);const s=document.createElement('small');s.textContent=t;d.append(s);return d},z=document.getElementById('xZ');if(z){z.append(mk(a,'Original (100 %)'),mk(b,'Exportado (100 %)'))}}catch(e){}}},
 dl(){const l=this.last,p=this.settings();if(p.psd)return PSD.download(),void(document.getElementById('modal').hidden=true);if(!l)return;const ext={'image/png':'.png','image/webp':'.webp'}[l.r.b.type]||'.jpg',a=document.createElement('a'),u=URL.createObjectURL(l.r.b);a.href=u;a.download=(document.getElementById('pname').value||'miniatura')+(l.p.tr?'-transparente':'')+ext;a.click();setTimeout(()=>URL.revokeObjectURL(u),4000);App.toast('Exportado '+Math.round(l.r.b.size/1024)+' KB')}};
window.addEventListener('load',()=>{App.exp=function(){if(!L.layers.length)return App.toast('El lienzo está vacío');Xp.show()}});
