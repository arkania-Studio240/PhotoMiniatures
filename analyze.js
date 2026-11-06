/* Análisis de miniatura: heurísticas locales (sin IA externa). Son orientativas y no predicen CTR. */
const Analyze={
 lum(r,g,b){const f=v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)};return .2126*f(r)+.7152*f(g)+.0722*f(b)},
 hex(h){h=(h||'#fff').replace('#','');if(h.length===3)h=h.replace(/./g,'$&$&');const n=parseInt(h,16);return[n>>16&255,n>>8&255,n&255]},
 tbox(l){const ls=String(l.text||'').split('\n'),w=Math.max(...ls.map(s=>s.length),1)*l.size*.55,h=ls.length*l.size*1.15;return{x0:l.x-w/2,y0:l.y-h/2,x1:l.x+w/2,y1:l.y+h/2}},
 region(c,b){const x0=Math.max(0,b.x0|0),y0=Math.max(0,b.y0|0),w=Math.min(CW,b.x1|0)-x0,h=Math.min(CH,b.y1|0)-y0;if(w<2||h<2)return null;const d=c.getContext('2d').getImageData(x0,y0,w,h).data;let s=0,n=0;for(let i=0;i<d.length;i+=16){s+=this.lum(d[i],d[i+1],d[i+2]);n++}return s/n},
 run(){const R=[],tx=L.layers.filter(l=>l.type==='text'&&l.vis&&String(l.text||'').trim());
  const full=Exp.canvas(),W=64,H=36,sm=document.createElement('canvas');sm.width=W;sm.height=H;sm.getContext('2d').drawImage(full,0,0,W,H);
  const d=sm.getContext('2d').getImageData(0,0,W,H).data,Y=[];for(let i=0;i<d.length;i+=4)Y.push(this.lum(d[i],d[i+1],d[i+2]));
  const m=Y.reduce((a,b)=>a+b)/Y.length,sd=Math.sqrt(Y.reduce((a,b)=>a+(b-m)*(b-m),0)/Y.length);
  if(sd<.12)R.push(['warn','Poco contraste general: la imagen se ve plana en tamaños pequeños. Sube contraste o separa sujeto y fondo.']);
  if(m<.04)R.push(['warn','La miniatura es muy oscura; en el feed de YouTube puede perderse.']);
  if(m>.75)R.push(['warn','La miniatura es muy clara; puede confundirse con el fondo blanco de YouTube.']);
  let sx=0,sy=0,sw=0,ce=0,tot=0;for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){const i=y*W+x,g=Math.abs(Y[i+1]-Y[i-1])+Math.abs(Y[i+W]-Y[i-W]);sx+=x*g;sy+=y*g;sw+=g;tot+=g;if(x>W/3&&x<W*2/3&&y>H/6&&y<H*5/6)ce+=g}
  if(sw>0){const cx=sx/sw/W,cy=sy/sw/H,cf=ce/tot;
   if(cf<.25)R.push(['warn','El detalle visual está repartido por los bordes. Un sujeto grande en el centro o en un tercio lateral mejora el punto focal.']);
   else R.push(['ok','Hay un punto focal reconocible (detalle concentrado cerca del centro).']);
   if(Math.abs(cx-.5)<.04&&Math.abs(cy-.5)<.04&&tx.length)R.push(['tip','El foco está justo en el centro; si el texto va al lado opuesto, la composición queda más equilibrada.'])}
  const words=tx.reduce((a,l)=>a+String(l.text).trim().split(/\s+/).length,0);
  if(words>5)R.push(['warn','Hay '+words+' palabras de texto. Lo habitual es 1 a 4 para que se lea en móvil.']);else if(tx.length)R.push(['ok','Cantidad de texto adecuada ('+words+' palabras).']);
  if(tx.length>1){const sz=tx.map(l=>l.size||0).sort((p,q)=>q-p);if(sz[1]&&sz[0]/sz[1]<1.3)R.push(['tip','Todos los textos tienen un tamaño parecido; haz mucho mayor la palabra principal para crear jerarquía visual.']);else if(sz[1])R.push(['ok','Hay jerarquía de texto: la palabra principal destaca claramente.'])}
  if(!tx.length)R.push(['tip','No hay texto visible. Una frase corta puede ayudar a transmitir el tema, si encaja con tu estilo.']);
  for(const l of tx){const nm='«'+String(l.text).slice(0,18).replace(/\n/g,' ')+'»',b=this.tbox(l),px=l.size*168/CW;
   if(px<9)R.push(['warn',nm+': tamaño pequeño; en móvil mediría unos '+px.toFixed(0)+' px. Agrándalo.']);
   const was=l.vis;l.vis=false;const bg=this.region(Exp.canvas(),b);l.vis=was;
   if(bg!==null){const [r,g,bl]=this.hex(l.fill),a=this.lum(r,g,bl),cr=(Math.max(a,bg)+.05)/(Math.min(a,bg)+.05),rob=(l.sw||0)>=4;
    if(cr<3&&!rob)R.push(['warn',nm+': contraste bajo con el fondo (aprox. '+cr.toFixed(1)+':1). Añade contorno, sombra o cambia el color.']);
    else R.push(['ok',nm+': contraste suficiente (aprox. '+cr.toFixed(1)+':1'+(rob&&cr<3?', ayudado por el contorno':'')+').'])}
   if(b.x1>CW*.84&&b.y1>CH*.86)R.push(['warn',nm+' queda en la esquina inferior derecha, donde YouTube muestra la duración del video.']);
   if(b.x0<CW*.03||b.x1>CW*.97||b.y0<CH*.03||b.y1>CH*.97)R.push(['warn',nm+' está muy cerca del borde; puede recortarse según el dispositivo.'])}
  return R},
 html(){const R=this.run(),ic={ok:'✔',warn:'⚠',tip:'•'},col={ok:'#5fbf7a',warn:'#ffb347',tip:'#8d8d94'};return'<h4>Análisis</h4>'+R.map(r=>`<p style="margin:6px 0"><span style="color:${col[r[0]]}">${ic[r[0]]}</span> ${r[1]}</p>`).join('')+'<p><small>Heurísticas orientativas calculadas en tu dispositivo (estimaciones, no medición exacta). No predicen clics ni CTR.</small></p>'}};
const _prev=App.prev;App.prev=function(){_prev.call(this);try{document.getElementById('mBody').insertAdjacentHTML('beforeend',Analyze.html())}catch(e){console.error(e)}};
