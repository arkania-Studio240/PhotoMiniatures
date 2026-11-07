/* Smart Layout: propone composiciones a partir de las capas reales (sujeto = imagen más grande, textos, resto).
   Cada propuesta se previsualiza sin aplicarla y, al aplicarla, se puede guardar antes una variante del diseño original. Todo se puede deshacer. */
const Lay={
 cx:document.createElement('canvas').getContext('2d'),
 tw(l,s){const c=this.cx;c.font=(l.bold?'bold ':'')+s+'px "'+(l.font||'Impact')+'", Impact, sans-serif';const ls=String(l.text||'').split('\n');return{w:Math.max(...ls.map(t=>c.measureText(t).width+(l.ls||0)*t.length),1),h:ls.length*s*1.15}},
 parts(){const vs=Pro.layers().filter(l=>!l.lock),texts=vs.filter(l=>l.type==='text'&&String(l.text||'').trim()),imgs=vs.filter(l=>l.type==='img').map(l=>({l,a:l.w*l.h})).sort((a,b)=>b.a-a.a);return{vs,texts,sub:imgs[0]&&imgs[0].a>CW*CH*.06?imgs[0].l:null}},
 stack(ts,x0,x1,yc,maxH){const ms=ts.map(l=>this.tw(l,l.size)),mx=Math.max(...ts.map(l=>l.size)),gap=.18*mx,colW=x1-x0,tot=k=>ms.reduce((a,m)=>a+m.h*k,0)+(ts.length-1)*gap*k,k=Math.max(.3,Math.min(...ms.map(m=>colW/m.w),maxH/tot(1),2.2));let y=yc-tot(k)/2;return ts.map((l,i)=>{const h=ms[i].h*k,o={l,x:(x0+x1)/2,y:y+h/2,size:l.size*k};y+=h+gap*k;return o})},
 list(){const P=this.parts(),R=[];
  if(P.sub&&P.texts.length){
   R.push({n:'Sujeto a la derecha, texto a la izquierda',d:'El texto ocupa la columna izquierda y el sujeto se apoya abajo a la derecha.',t:()=>[...this.stack(P.texts,CW*.05,CW*.52,CH*.5,CH*.86),this.sub(P.sub,CW*.75,CH,CW*.46)]});
   R.push({n:'Sujeto a la izquierda, texto a la derecha',d:'Versión espejo: útil si el sujeto mira hacia la derecha.',t:()=>[...this.stack(P.texts,CW*.48,CW*.95,CH*.5,CH*.86),this.sub(P.sub,CW*.25,CH,CW*.46)]});
   R.push({n:'Texto arriba, sujeto centrado',d:'Titular en la franja superior y el sujeto grande debajo.',t:()=>[...this.stack(P.texts,CW*.06,CW*.94,CH*.2,CH*.3),this.sub(P.sub,CW*.5,CH*.74,CW*.8)]})}
  if(P.texts.length)R.push({n:'Jerarquía clara del texto',d:'El texto más grande pasa a ser el titular (lectura en móvil) y los demás se reducen a la mitad. No cambia las posiciones.',t:()=>{const s=[...P.texts].sort((a,b)=>b.size-a.size),h=s[0],hs=Math.max(h.size,CH*.2),k0=Math.min(1,CW*.9/this.tw(h,hs).w),H=hs*k0;return s.map((l,i)=>({l,size:i?Math.max(CH*.08,H*.5):H}))}});
  R.push({n:'Márgenes y zona de duración',d:'Mantiene todo dentro de un margen del 4 % y levanta los textos que tapa la duración del video.',t:()=>{const m=CW*.04,o=[];P.vs.forEach(l=>{const b=Pro.bb(l);let dx=0,dy=0;if(b.x0<m&&b.x1-b.x0<=CW-2*m)dx=m-b.x0;else if(b.x1>CW-m&&b.x1-b.x0<=CW-2*m)dx=CW-m-b.x1;if(b.y0<CH*.04&&b.y1-b.y0<=CH*.92)dy=CH*.04-b.y0;else if(b.y1>CH*.96&&b.y1-b.y0<=CH*.92)dy=CH*.96-b.y1;
    if(l.type==='text'&&b.x1+dx>CW*.8&&b.y1+dy>CH*.84)dy-=(b.y1+dy)-CH*.82;if(dx||dy)o.push({l,x:l.x+dx,y:l.y+dy})});return o}});
  return R},
 sub(s,cx,hMax,wMax){const k=Math.max(.5,Math.min(hMax/s.h,wMax/s.w,2.2)),w=s.w*k,h=s.h*k;return{l:s,x:cx,y:CH-h/2,w,h}},
 cap(ts){return ts.map(t=>({l:t.l,x:t.l.x,y:t.l.y,w:t.l.w,h:t.l.h,size:t.l.size}))},
 put(ts){ts.forEach(t=>{const l=t.l;if(t.x!=null)l.x=t.x;if(t.y!=null)l.y=t.y;if(t.w!=null){l.w=t.w;l.h=t.h}if(t.size!=null)l.size=t.size})},
 show(){const P=this.parts();if(!P.vs.length)return Pro.modal('<h3>Smart Layout</h3><p class="empty">Añade elementos al lienzo (imágenes, texto) para recibir propuestas. Las capas bloqueadas no se mueven.</p>');
  let R=this.list().map(p=>{let ts=[];try{ts=p.t().filter(t=>!t.l.lock)}catch(e){console.error(e)}return Object.assign(p,{ts})}).filter(p=>p.ts.length);
  R.forEach(p=>{const s=this.cap(p.ts);this.put(p.ts);try{p.img=Pro.small(Exp.canvas(),260).toDataURL('image/jpeg',.7)}finally{this.put(s)}});
  Pro.modal('<h3>Smart Layout</h3><p><small>'+(P.sub?'Sujeto detectado: '+Pro.nm(P.sub)+'. ':'No hay una imagen grande: solo se ofrecen propuestas de texto y márgenes. ')+P.texts.length+' texto(s). Las propuestas no se aplican hasta que las elijas.</small></p><label class="ck"><input type="checkbox" id="lyV" checked> Guardar una variante del diseño actual antes de aplicar</label>'
   +(R.length?'<div class="vgrid lgrid">'+R.map((p,i)=>'<div class="vc"><img src="'+p.img+'" alt=""><b>'+p.n+'</b><small>'+p.d+'</small><button class="pri" data-a="'+i+'">Aplicar</button></div>').join('')+'</div>':'<p class="empty">Tu diseño ya cumple estas reglas: no hay cambios que proponer.</p>')+'<p><small>Las propuestas parten de reglas de composición habituales (columnas, tercios, márgenes) y de las medidas reales de tus capas. Revisa el resultado: el criterio final es tuyo.</small></p>',true);
  document.querySelectorAll('#mBody [data-a]').forEach(b=>b.onclick=async()=>{const p=R[+b.dataset.a];if(document.getElementById('lyV').checked)await Var.snap('var','Antes de Smart Layout');L.snap();this.put(p.ts);App.refresh();document.getElementById('modal').hidden=true;App.toast('Propuesta aplicada (Deshacer para volver)')})}};
