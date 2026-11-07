/* Etapa final: nombres de acciones en el historial, vista previa del recorte sobre distintos fondos, ver original sin
   máscara, limpieza de color en los bordes del recorte y paneles de propiedades plegables. */
/* 1) Historial con nombres */
L.label=function(p,c){const NM={x:'Mover',y:'Mover',w:'Redimensionar',h:'Redimensionar',rot:'Rotar',op:'Opacidad',text:'Editar texto',fill:'Color',stroke:'Contorno',sw:'Contorno',sh:'Sombra',bm:'Modo de fusión',lm:'Máscara',vis:'Mostrar u ocultar',lock:'Bloquear',clip:'Recorte',size:'Tamaño de texto',font:'Fuente',src:'Imagen',name:'Renombrar',grp:'Agrupar',br:'Brillo',ct:'Contraste',sat:'Saturación',bl:'Desenfoque',curve:'Curvar texto',ls:'Espaciado',bold:'Negrita',tg:'Degradado de texto'},nm=q=>String(q.type==='text'?q.text:q.name||q.type).replace(/\n/g,' ').slice(0,16);
 if(c.length>p.length){const a=c.find(q=>!p.some(o=>o.id===q.id));return 'Añadir · '+(a?nm(a):'capa')}
 if(c.length<p.length){const r=p.find(q=>!c.some(o=>o.id===q.id));return 'Eliminar · '+(r?nm(r):'capa')}
 if(p.some((q,i)=>q.id!==c[i].id))return 'Reordenar capas';
 const ch=c.filter((q,i)=>JSON.stringify(q)!==JSON.stringify(p[i]));if(!ch.length)return 'Cambio';
 if(ch.length>1)return 'Editar '+ch.length+' capas';
 const q=ch[0],o=p[c.indexOf(q)],ks=[...new Set([...Object.keys(q),...Object.keys(o)])].filter(k=>JSON.stringify(q[k])!==JSON.stringify(o[k])),k=ks[0]||'',v=/^e_/.test(k)?'Efecto':NM[k]||'Editar';
 return v+' · '+nm(q)};
/* 2) Vista previa sobre fondos (solo en pantalla, no afecta a la exportación) */
const PV={set(m,c){const e=document.getElementById('cv');e.style.background=m==='k'?'#000':m==='c'?c:m==='g'?'repeating-conic-gradient(#d9d9dc 0 25%,#fff 0 50%) 0 0/24px 24px':'#fff';['pvC','pvW','pvK'].forEach(i=>{const b=document.getElementById(i);if(b)b.classList.toggle('on',(i==='pvC'&&m==='g')||(i==='pvW'&&m==='w')||(i==='pvK'&&m==='k'))})}};
{const g=i=>document.getElementById(i);
 if(g('pvC')){g('pvC').onclick=()=>PV.set('g');g('pvW').onclick=()=>PV.set('w');g('pvK').onclick=()=>PV.set('k');g('pvX').oninput=e=>PV.set('c',e.target.value);g('pvW').classList.add('on');
  g('pvO').onclick=()=>{Ed.showOrig=!Ed.showOrig;g('pvO').classList.toggle('on',Ed.showOrig);App.toast(Ed.showOrig?'Mostrando imágenes sin máscara':'Mostrando recortes');Ed.sched()}}}
{const o=Ed.draw;Ed.draw=function(ctx,exp,tr){if(this.showOrig&&!exp){const old=L.layers;L.layers=old.map(l=>l.lm?Object.assign({},l,{lm:null}):l);try{return o.call(this,ctx,exp,tr)}finally{L.layers=old}}return o.call(this,ctx,exp,tr)}}
/* 3) Limpieza de color en bordes: los píxeles semitransparentes toman el color de los píxeles opacos vecinos */
function edgeBleed(px,W,H,passes){const n=W*H,known=new Uint8Array(n);for(let i=0;i<n;i++)if(px[i*4+3]>=250)known[i]=1;
 for(let p=0;p<passes;p++){const up=[];for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x;if(known[i]||px[i*4+3]===0)continue;let r=0,g=0,b=0,c=0;
  for(let dy=-1;dy<=1;dy++){const yy=y+dy;if(yy<0||yy>=H)continue;for(let dx=-1;dx<=1;dx++){const xx=x+dx;if(xx<0||xx>=W||(!dx&&!dy))continue;const j=yy*W+xx;if(known[j]){r+=px[j*4];g+=px[j*4+1];b+=px[j*4+2];c++}}}
  if(c)up.push(i,r/c,g/c,b/c)}
  if(!up.length)break;for(let k=0;k<up.length;k+=4){const i=up[k];px[i*4]=up[k+1];px[i*4+1]=up[k+2];px[i*4+2]=up[k+3];known[i]=1}}return px}
{const b=document.getElementById('mclean');if(b)b.onclick=()=>{const l=L.get();if(!l)return App.toast('Selecciona una capa');if(!l.lm)return App.toast('Primero crea el recorte (máscara) de esta capa');
 const img=L.img(l.lm);if(!img.complete||!img.naturalWidth)return App.toast('La máscara aún se está cargando');
 App.toast('Limpiando bordes…');setTimeout(()=>{try{const c=Ed.alone(l,true),x=c.getContext('2d'),d=x.getImageData(0,0,CW,CH);edgeBleed(d.data,CW,CH,Math.max(2,Math.min(12,+document.getElementById('mrad').value||4)));x.putImageData(d,0,0);
  L.add({type:'img',name:'Recorte limpio',paint:true,src:Ed.reg('paint',c),x:CW/2,y:CH/2,w:CW,h:CH});l.vis=false;App.refresh();App.toast('Listo: la capa original queda oculta y recuperable')}catch(e){console.error(e);App.toast('No se pudo limpiar los bordes')}},30)}}
/* 4) Paneles plegables en Propiedades */
{const FOLD={'Alinear al lienzo':false},o=App.props;App.props=function(){o.apply(this,arguments);try{const el=document.getElementById('props');[...el.querySelectorAll(':scope>h4')].forEach(h=>{const t=h.textContent.trim(),d=document.createElement('details'),s=document.createElement('summary');d.className='fold';d.open=FOLD[t]!==false;s.innerHTML='<span>'+t+'</span>'+Ic('down',16);d.append(s);let n=h.nextSibling;while(n&&n.tagName!=='H4'){const nx=n.nextSibling;d.append(n);n=nx}h.replaceWith(d);d.ontoggle=()=>{FOLD[t]=d.open}})}catch(e){console.error(e)}}}
