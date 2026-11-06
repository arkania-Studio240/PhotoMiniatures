/* Refinado de máscaras (bordes del recorte). Opera sobre la máscara de la capa activa; no toca la imagen original. */
const MaskFx={
 radius(){return +document.getElementById('mrad').value||4},
 run(name,fn){const l=L.get();if(!l)return App.toast('Selecciona una capa');if(!l.lm)return App.toast('Esta capa no tiene máscara: usa «Quitar fondo (IA)» o «Conservar selección» primero');
  const img=L.img(l.lm);if(!img.complete||!img.naturalWidth)return App.toast('La máscara aún se está cargando');
  L.snap();const c=Ed.mk(),x=c.getContext('2d');x.drawImage(img,0,0,CW,CH);fn(c,x,this.radius());l.lm=Ed.reg('mask',c);App.refresh();App.toast(name)},
 inv(c){const t=Ed.mk(),x=t.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,CW,CH);x.globalCompositeOperation='destination-out';x.drawImage(c,0,0);const k=c.getContext('2d');k.clearRect(0,0,CW,CH);k.drawImage(t,0,0)},
 grow(c,r){const t=Ed.mk();t.getContext('2d').drawImage(c,0,0);const x=c.getContext('2d');for(let i=0;i<24;i++){const a=i/24*Math.PI*2;x.drawImage(t,Math.cos(a)*r,Math.sin(a)*r)}},
 feather(c,r){const t=Ed.mk();t.getContext('2d').drawImage(c,0,0);const x=c.getContext('2d');x.clearRect(0,0,CW,CH);x.filter=`blur(${r}px)`;x.drawImage(t,0,0);x.filter='none'},
 smooth(c,r){this.feather(c,r);const x=c.getContext('2d'),d=x.getImageData(0,0,CW,CH),p=d.data;for(let i=3;i<p.length;i+=4){const v=(p[i]-128)*3+128;p[i]=v<0?0:v>255?255:v}x.putImageData(d,0,0)},
 init(){const b={mexp:(c,x,r)=>this.grow(c,r),mcon:(c,x,r)=>{this.inv(c);this.grow(c,r);this.inv(c)},mfea:(c,x,r)=>this.feather(c,r),msmo:(c,x,r)=>this.smooth(c,r),minv:c=>this.inv(c)},n={mexp:'Máscara expandida',mcon:'Máscara contraída',mfea:'Bordes difuminados',msmo:'Bordes suavizados',minv:'Máscara invertida'};
  for(const k in b){const e=document.getElementById(k);if(e)e.onclick=()=>this.run(n[k],b[k])}}};
MaskFx.init();
