/* Menú de inicio rediseñado: barra superior fija, búsqueda con icono, categorías en una fila desplazable,
   «Proyectos recientes» arriba con tarjetas horizontales, plantillas en 2 columnas con su categoría,
   botón flotante «Nueva miniatura» y selector de tamaño (YouTube, Full HD, Shorts, cuadrado, personalizado). */
const Dash={
 ago(t){const m=Math.max(0,Math.round((Date.now()-t)/6e4));if(m<1)return 'Ahora mismo';if(m<60)return 'Hace '+m+' min';const h=Math.round(m/60);if(h<24)return 'Hace '+h+' h';const dd=Math.round(h/24);return dd<30?'Hace '+dd+(dd===1?' día':' días'):new Date(t).toLocaleDateString()},
 SIZES:[[1280,720,'YouTube','Miniatura estándar'],[1920,1080,'Full HD','Alta resolución'],[1080,1920,'Shorts / Reels','Vertical 9:16'],[1080,1080,'Cuadrado','Redes sociales'],[2560,1440,'Banner QHD','Portada de canal']],
 create(w,h){const d=document.getElementById('dash');w=Math.max(100,Math.min(4096,Math.round(+w)||1280));h=Math.max(100,Math.min(4096,Math.round(+h)||720));
  L.snap();L.layers=[];L.id='p'+Date.now();L.setSel([]);Ed.applySize([w,h]);document.getElementById('pname').value='Sin título';d.hidden=true;document.getElementById('modal').hidden=true;
  L.add({type:'rect',name:'fondo',x:CW/2,y:CH/2,w:CW,h:CH,fill:'#1e1e24',fill2:'#000000'});L.setSel([]);App.refresh();setTimeout(()=>Ed.fit&&Ed.fit(),60)},
 pick(){App.modal('<h3>Nueva miniatura</h3><div class="szg">'+this.SIZES.map(s=>'<button class="szb" data-w="'+s[0]+'" data-h="'+s[1]+'"><i style="aspect-ratio:'+s[0]+'/'+s[1]+'"></i><b>'+s[2]+'</b><small>'+s[0]+' × '+s[1]+'</small></button>').join('')+'</div><div class="szc"><span>Personalizado</span><input id="szW" type="number" inputmode="numeric" min="100" max="4096" value="1280"><span>×</span><input id="szH" type="number" inputmode="numeric" min="100" max="4096" value="720"><button class="pri" id="szGo">Crear</button></div><p><small>De 100 a 4096 px por lado.</small></p>');
  document.querySelectorAll('#mBody .szb').forEach(b=>b.onclick=()=>this.create(b.dataset.w,b.dataset.h));document.getElementById('szGo').onclick=()=>this.create(document.getElementById('szW').value,document.getElementById('szH').value)}};
App.dash=async function(){
 const d=document.getElementById('dash'),ps=await Store.all();d.hidden=false;const cats=['Todas',...new Set(Templates.map(t=>t.cat))];let cat='Todas',q='';ps.sort((a,b)=>b.t-a.t);
 d.innerHTML='<div class="dtop"><div class="dbrand">'+Ic('logo',22)+'<span>Thumbnail Studio <b>3.0</b></span></div><button class="icb" id="dBack" title="Volver al editor" aria-label="Volver al editor">'+Ic('back')+'</button></div>'
  +'<div class="dsearch">'+Ic('search',18)+'<input id="dQ" placeholder="Buscar plantillas..." autocomplete="off"><button class="icb" id="dQx" hidden title="Borrar búsqueda" aria-label="Borrar búsqueda">'+Ic('x',16)+'</button></div><div class="chips" id="dC"></div>'
  +(ps.length?'<h2>Proyectos recientes <span class="cnt">'+ps.length+'</span></h2><div class="dh" id="dP"></div>':'')
  +'<h2>Plantillas populares <span class="cnt" id="dN"></span></h2><div class="dg" id="dT"></div>'
  +'<button class="pri fab" id="dNew">'+Ic('plus',20)+'<span>Nueva miniatura</span></button>';
 const $d=s=>d.querySelector(s);
 ps.forEach(p=>{const e=document.createElement('div');e.className='dc';const im=document.createElement('img');im.src=p.thumb;im.alt='';im.loading='lazy';const n=document.createElement('div');n.className='nm';const b=document.createElement('b');b.textContent=p.name;const s=document.createElement('small');s.textContent=Dash.ago(p.t);n.append(b,s);e.append(im,n);
  e.onclick=()=>{L.id=p.id;Ed.applySize(p.size);Ed.post=Object.assign({},p.post);Ed.syncPost&&Ed.syncPost();L.layers=p.layers;L.n=p.n;Ed.guides=p.guides||[];L.setSel([]);document.getElementById('pname').value=p.name;d.hidden=true;App.refresh()};$d('#dP').append(e)});
 const draw=()=>{const C=$d('#dC');C.innerHTML='';cats.forEach(c=>{const b=document.createElement('button');b.textContent=c;if(c===cat)b.className='on';b.onclick=()=>{cat=c;draw();const o=C.querySelector('.on');o&&o.scrollIntoView({inline:'center',block:'nearest'})};C.append(b)});
  const T=$d('#dT');T.innerHTML='';let n=0;Templates.forEach((t,i)=>{if((cat!=='Todas'&&t.cat!==cat)||!t.name.toLowerCase().includes(q))return;n++;const e=document.createElement('div');e.className='dc';const c=document.createElement('canvas');c.width=320;c.height=180;const tg=document.createElement('span');tg.className='tag';tg.textContent=t.cat;const nm=document.createElement('div');nm.className='nm';const b=document.createElement('b');b.textContent=t.name;nm.append(b);e.append(c,tg,nm);e.onclick=()=>App.tpl(i);T.append(e);App.thumb(i,c)});
  $d('#dN').textContent=n;if(!n)T.innerHTML='<p class="empty">No hay plantillas que coincidan con tu búsqueda.</p>'};
 draw();const qi=$d('#dQ'),qx=$d('#dQx');qi.oninput=e=>{q=e.target.value.toLowerCase().trim();qx.hidden=!q;draw()};qx.onclick=()=>{qi.value='';q='';qx.hidden=true;draw();qi.focus()};
 $d('#dNew').onclick=()=>Dash.pick();$d('#dBack').onclick=()=>{d.hidden=true}};
