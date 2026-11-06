/* Capas: fusionar (hacia abajo o selección) y máscara de recorte (clip a la capa inferior). */
Ed.alone=function(l,keepMask){const c=this.mk(),o=L.layers;L.layers=[Object.assign({},l,{vis:true,op:1,bm:'',clip:false,lm:keepMask?l.lm:null})];try{this.draw(c.getContext('2d'),true,true)}finally{L.layers=o}return c};
Ed.clipDraw=function(ctx,l){const i=L.layers.indexOf(l);let b=null;for(let j=i-1;j>=0;j--){if(!L.layers[j].clip){b=L.layers[j];break}}
 if(!b||!b.vis)return false;const T=this.pool(9),x=T.getContext('2d');x.globalCompositeOperation='source-over';x.clearRect(0,0,CW,CH);x.drawImage(this.alone(l,true),0,0);x.globalCompositeOperation='destination-in';x.drawImage(this.alone(b,true),0,0);x.globalCompositeOperation='source-over';
 ctx.save();ctx.globalAlpha=l.op;ctx.globalCompositeOperation=l.bm||'source-over';ctx.drawImage(T,0,0);ctx.restore();return true};
const LyrTools={
 merge(){let ids=L.ms.slice();if(ids.length===1){const i=L.layers.findIndex(q=>q.id===ids[0]);if(i<1)return App.toast('No hay capa debajo para fusionar');ids.push(L.layers[i-1].id)}
  if(ids.length<2)return App.toast('Selecciona capas (modo Multi) o una capa con otra debajo');
  const sub=L.layers.filter(q=>ids.includes(q.id));if(sub.some(q=>q.lock))return App.toast('Hay capas bloqueadas: desbloquéalas antes de fusionar');
  const vis=sub.filter(q=>q.vis);if(!vis.length)return App.toast('Todas las capas están ocultas');
  const c=Ed.mk(),o=L.layers;L.layers=vis.map(q=>Object.assign({},q));try{Ed.draw(c.getContext('2d'),true,true)}finally{L.layers=o}
  const idx=Math.max(...sub.map(q=>L.layers.indexOf(q))),set=new Set(sub.map(q=>q.id));
  const nl=L.add({type:'img',name:'Combinada',paint:true,src:Ed.reg('paint',c),x:CW/2,y:CH/2,w:CW,h:CH});L.layers.pop();
  const pos=L.layers.slice(0,idx+1).filter(q=>!set.has(q.id)).length;L.layers=L.layers.filter(q=>!set.has(q.id));L.layers.splice(pos,0,nl);L.setSel([nl.id]);App.refresh();App.toast('Capas fusionadas ('+sub.length+')')},
 clip(){const l=L.get();if(!l)return App.toast('Selecciona una capa');const i=L.layers.indexOf(l);if(!l.clip&&i<1)return App.toast('Necesita una capa debajo para recortarse a ella');L.snap();l.clip=!l.clip;App.refresh();App.toast(l.clip?'Recortada a la capa inferior':'Recorte quitado')},
 init(){const m=document.getElementById('lMrg'),c=document.getElementById('lClip');if(m)m.onclick=()=>this.merge();if(c)c.onclick=()=>this.clip()}};
LyrTools.init();
