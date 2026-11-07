/* Thumbnail Quality Inspector: revisa composición, atención, separación sujeto/fondo, distribución, alineación, recortes y legibilidad
   a tamaño reducido. Son heurísticas locales: orientan, no predicen clics ni CTR. */
const Insp={
 sal(c){const W=128,H=72,s=Pro.small(c,W),d=Pro.data(s).data,Y=new Float32Array(W*H),S=new Float32Array(W*H);for(let i=0;i<W*H;i++){const r=d[i*4],g=d[i*4+1],b=d[i*4+2];Y[i]=Analyze.lum(r,g,b);S[i]=(Math.max(r,g,b)-Math.min(r,g,b))/255}
  const GW=32,GH=18,G=new Float32Array(GW*GH);let mx=0;for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){const i=y*W+x,g=Math.abs(Y[i+1]-Y[i-1])+Math.abs(Y[i+W]-Y[i-W]),v=g+S[i]*.12,k=((y>>2)*GW)+(x>>2);G[k]+=v}
  for(let i=0;i<G.length;i++)mx=Math.max(mx,G[i]);if(mx>0)for(let i=0;i<G.length;i++)G[i]/=mx;return{G,GW,GH}},
 clusters(S){const GW=S.GW,GH=S.GH;let G=S.G;for(let p=0;p<2;p++){const N=new Float32Array(G.length);for(let y=0;y<GH;y++)for(let x=0;x<GW;x++){let a=0,n=0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const xx=x+dx,yy=y+dy;if(xx>=0&&yy>=0&&xx<GW&&yy<GH){a+=G[yy*GW+xx];n++}}N[y*GW+x]=a/n}G=N}let mx=0;for(const v of G)mx=Math.max(mx,v);if(mx>0)G=G.map(v=>v/mx);const seen=new Uint8Array(G.length),out=[];for(let i=0;i<G.length;i++){if(seen[i]||G[i]<.55)continue;const st=[i],cl={n:0,sum:0,cx:0,cy:0};seen[i]=1;while(st.length){const k=st.pop(),x=k%GW,y=(k/GW)|0;cl.n++;cl.sum+=G[k];cl.cx+=x*G[k];cl.cy+=y*G[k];[[1,0],[-1,0],[0,1],[0,-1]].forEach(p=>{const nx=x+p[0],ny=y+p[1];if(nx<0||ny<0||nx>=GW||ny>=GH)return;const j=ny*GW+nx;if(!seen[j]&&G[j]>=.55){seen[j]=1;st.push(j)}})}cl.cx=cl.cx/cl.sum/GW;cl.cy=cl.cy/cl.sum/GH;out.push(cl)}return out.sort((a,b)=>b.sum-a.sum)},
 run(){const R={problems:[],tips:[],good:[]},P=(t,f,l)=>R.problems.push({t,f,l}),T=(t,f,l)=>R.tips.push({t,f,l}),G=t=>R.good.push({t}),ls=Pro.layers(),full=Exp.canvas();
  // 1) Elementos cortados
  let cut=0;ls.forEach(l=>{const b=Pro.bb(l),a=(b.x1-b.x0)*(b.y1-b.y0);if(a<=0)return;const ix=Math.max(0,Math.min(b.x1,CW)-Math.max(b.x0,0)),iy=Math.max(0,Math.min(b.y1,CH)-Math.max(b.y0,0)),vis=ix*iy/a;if(vis<.995&&vis>.02){const out=Math.round((1-vis)*100);
   if(l.type==='text'){cut++;P(Pro.nm(l)+' queda cortado: '+out+'% fuera del lienzo.',()=>{L.snap();const k=Pro.bb(l),dx=k.x0<0?-k.x0:k.x1>CW?CW-k.x1:0,dy=k.y0<0?-k.y0:k.y1>CH?CH-k.y1:0;l.x+=dx;l.y+=dy},'Mover dentro del lienzo')}
   else if(out>=35){T(Pro.nm(l)+' sale '+out+'% del lienzo. Si no es intencional, el espectador verá un elemento cortado.',()=>{L.snap();const k=Pro.bb(l),dx=k.x0<0?-k.x0:k.x1>CW?CW-k.x1:0,dy=k.y0<0?-k.y0:k.y1>CH?CH-k.y1:0;l.x+=dx;l.y+=dy},'Mover dentro del lienzo')}}});
  if(!cut)G('Ningún texto queda cortado por los bordes.');
  // 2) Alineación casi correcta
  const bs=ls.slice(0,14).map(l=>({l,b:Pro.bb(l)})),tol=Math.max(6,CW*.006),fixes=[];
  for(let i=0;i<bs.length&&fixes.length<3;i++)for(let j=i+1;j<bs.length&&fixes.length<3;j++){const A=bs[i],B=bs[j],ax=[['x','izquierda',A.b.x0,B.b.x0],['x','derecha',A.b.x1,B.b.x1],['x','centro horizontal',(A.b.x0+A.b.x1)/2,(B.b.x0+B.b.x1)/2],['y','borde superior',A.b.y0,B.b.y0],['y','borde inferior',A.b.y1,B.b.y1]];
   for(const a of ax){const d=a[2]-a[3];if(Math.abs(d)>=1&&Math.abs(d)<=tol){fixes.push({t:Pro.nm(A.l)+' y '+Pro.nm(B.l)+' casi comparten el '+a[1]+' (diferencia de '+Math.abs(Math.round(d))+' px).',f:()=>{L.snap();if(B.l.lock)return;B.l[a[0]]+=d},l:'Alinear'});break}}}
  fixes.forEach(f=>T(f.t,f.f,f.l));if(!fixes.length&&ls.length>1)G('No hay elementos desalineados por pocos píxeles.');
  // 3) Atención: varios focos de igual fuerza
  const sal=this.sal(full),cl=this.clusters(sal),top=cl[0];
  if(top){const rivals=cl.filter(c=>c.n>=3&&c.sum>=top.sum*.7).length;if(rivals>=3)P('Hay '+rivals+' zonas con una fuerza visual parecida: compiten por la atención y no queda un foco claro.',null);else if(rivals===2)T('Dos zonas tienen fuerza visual parecida. Si una es el sujeto, reduce el contraste o la saturación de la otra.',null);else G('Hay un foco de atención dominante.')}
  const big=ls.filter(l=>{const b=Pro.bb(l);return (b.x1-b.x0)*(b.y1-b.y0)>CW*CH*.1}).length;if(big>=4)T('Hay '+big+' elementos grandes. Con tantos, ninguno destaca: prioriza uno y reduce el resto.',null);
  // 4) Separación sujeto/fondo
  const imgs=ls.filter(l=>l.type==='img').map(l=>({l,a:(()=>{const b=Pro.bb(l);return Math.max(0,Math.min(b.x1,CW)-Math.max(b.x0,0))*Math.max(0,Math.min(b.y1,CH)-Math.max(b.y0,0))})()})).sort((a,b)=>b.a-a.a),sub=imgs[0]&&imgs[0].a>CW*CH*.06?imgs[0].l:null;
  if(sub){const W=128,m=Pro.small(Ed.alone(sub,true),W),md=Pro.data(m).data,Wd=W,Hd=m.height,wo=Pro.without(sub,W),wd=Pro.data(wo).data,wi=Pro.data(Pro.small(full,W)).data,inn=new Uint8Array(Wd*Hd);for(let i=0;i<Wd*Hd;i++)inn[i]=md[i*4+3]>128?1:0;
   const ring=new Uint8Array(Wd*Hd);for(let y=0;y<Hd;y++)for(let x=0;x<Wd;x++){const i=y*Wd+x;if(inn[i])continue;let hit=0;for(let dy=-5;dy<=5&&!hit;dy+=1)for(let dx=-5;dx<=5;dx+=1){const xx=x+dx,yy=y+dy;if(xx>=0&&yy>=0&&xx<Wd&&yy<Hd&&inn[yy*Wd+xx]){hit=1;break}}ring[i]=hit}
   const cs=Pro.mean(wi,i=>inn[i]?1:0),cb=Pro.mean(wd,i=>ring[i]?1:0);
   if(cs&&cb){const dl=Math.abs(Analyze.lum(...cs)-Analyze.lum(...cb)),dist=Math.hypot(cs[0]-cb[0],cs[1]-cb[1],cs[2]-cb[2]);
    if(dl<.1&&dist<70)P(Pro.nm(sub)+' se confunde con el fondo que lo rodea (diferencia de luminosidad baja y colores parecidos).',()=>{L.snap();sub.e_s2=1;sub.e_s2c='#ffffff';sub.e_s2s=10},'Añadir contorno blanco');
    else if(dl<.18&&dist<110)T('La separación entre '+Pro.nm(sub)+' y el fondo es moderada. Un contorno claro, un resplandor o oscurecer el fondo ayudaría.',()=>{L.snap();sub.e_s2=1;sub.e_s2c='#ffffff';sub.e_s2s=8},'Añadir contorno blanco');
    else G('El sujeto principal se separa bien del fondo.')}}
  // 5) Distribución
  const{G:g,GW,GH}=sal;let L2=0,R2=0,tot=0,low=0,cx=0,cy=0;for(let y=0;y<GH;y++)for(let x=0;x<GW;x++){const v=g[y*GW+x];tot+=v;cx+=x*v;cy+=y*v;if(x<GW/2)L2+=v;else R2+=v;if(v<.06)low++}
  if(tot>0){const sh=Math.max(L2,R2)/tot;if(sh>.74)T('El '+Math.round(sh*100)+'% del detalle visual está en '+(L2>R2?'la mitad izquierda':'la mitad derecha')+'. Si no es intencional, el otro lado queda vacío o pesa menos.',null);else if(sh<.62)G('El peso visual está repartido de forma equilibrada.');
   if(low/g.length>.55)T('Más de la mitad del lienzo casi no tiene detalle. Puedes ampliar el sujeto o el texto para aprovechar el espacio.',null);
   const fx=cx/tot/GW,fy=cy/tot/GH,near=[1/3,2/3].some(a=>[1/3,2/3].some(b=>Math.hypot(fx-a,fy-b)<.12));if(near)G('El centro de interés cae cerca de un punto de la regla de tercios.')}
  // 6) Legibilidad a tamaño reducido
  const sm=Pro.small(full,168),sd=Pro.data(sm),k=168/CW;let anyT=0;
  ls.filter(l=>l.type==='text'&&String(l.text||'').trim()).forEach(l=>{anyT=1;const b=Pro.bb(l),cap=l.size*.72*k;let n=0,s=0,s2=0;const x0=Math.max(0,b.x0*k|0),x1=Math.min(sd.width,Math.ceil(b.x1*k)),y0=Math.max(0,b.y0*k|0),y1=Math.min(sd.height,Math.ceil(b.y1*k));for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){const i=(y*sd.width+x)*4,v=Analyze.lum(sd.data[i],sd.data[i+1],sd.data[i+2]);s+=v;s2+=v*v;n++}
   const sdv=n?Math.sqrt(Math.max(0,s2/n-(s/n)*(s/n))):0;
   if(cap<7)P(Pro.nm(l)+' mide unos '+cap.toFixed(1)+' px de alto de letra a 168 px de ancho: no se leerá en móvil.',()=>{L.snap();l.size=Math.ceil(l.size*7.5/cap)},'Agrandar hasta ser legible');
   else if(sdv<.07)T(Pro.nm(l)+' casi se pierde al reducir la miniatura (poco contraste interno). Prueba un contorno más grueso o un fondo más oscuro/claro detrás.',()=>{L.snap();l.sw=Math.max(l.sw||0,Math.round(l.size*.1));l.stroke=l.stroke||'#000000'},'Reforzar contorno');
   else G(Pro.nm(l)+' se sigue leyendo a tamaño reducido.')});
  if(!anyT)T('No hay texto: si el título del video no basta, una frase corta puede reforzar el tema.',null);
  return R},
 show(){App.toast('Analizando…');setTimeout(()=>{let R;try{R=this.run()}catch(e){console.error(e);return App.toast('No se pudo analizar la miniatura')}this.R=R;
  const sec=(t,ic,col,a)=>'<h4 style="color:'+col+'">'+Ic(ic,16)+' '+t+' <span class="cnt">'+a.length+'</span></h4>'+(a.length?a.map((x,i)=>'<div class="ri"><span>'+x.t+'</span>'+(x.f?'<button class="fx" data-s="'+t+'" data-i="'+i+'">'+x.l+'</button>':'')+'</div>').join(''):'<p class="empty">Nada por aquí.</p>');
  Pro.modal('<h3>Inspector de calidad</h3><div class="rp">'+sec('Problemas','alert','#e5383b',R.problems)+sec('Sugerencias','bulb','#e0a23b',R.tips)+sec('Aspectos positivos','check','#4cae6e',R.good)+'</div><p><small>Heurísticas calculadas en tu dispositivo con los datos del lienzo. Orientan la revisión; no predicen clics ni CTR. Cada corrección se puede deshacer.</small></p>',true);
  document.querySelectorAll('#mBody .fx').forEach(b=>b.onclick=()=>{const x=this.R[{Problemas:'problems',Sugerencias:'tips'}[b.dataset.s]][+b.dataset.i];try{x.f();App.refresh();App.toast('Corrección aplicada (se puede deshacer)')}catch(e){console.error(e)}this.show()})},30)}};
