/* Mejoras para Android: hoja inferior arrastrable con 3 alturas (tocar el asa la cierra; arrastrar hacia abajo la cierra),
   botón Atrás que cierra diálogos y paneles en vez de salir de la app, y vibración suave al tocar botones. */
const Droid={
 snap(h,H){if(h<H*.28)return 0;const s=[.36,.5,.86].map(f=>f*H);return s.reduce((a,b)=>Math.abs(b-h)<Math.abs(a-h)?b:a)},
 open(){const d=document,m=d.getElementById('modal'),dh=d.getElementById('dash');return !!d.body.dataset.sh||(m&&!m.hidden)}};
(function(){
 const d=document,b=d.body;let drag=null,pushed=false;
 d.addEventListener('touchstart',e=>{const g=e.target.closest&&e.target.closest('.grab');if(!g)return;const as=g.closest('aside');drag={y0:e.touches[0].clientY,h0:as.getBoundingClientRect().height,h:0,moved:false};b.classList.add('dragging')},{passive:true});
 d.addEventListener('touchmove',e=>{if(!drag)return;e.preventDefault();const dy=drag.y0-e.touches[0].clientY;if(Math.abs(dy)>6)drag.moved=true;const H=innerHeight;drag.h=Math.max(H*.18,Math.min(H*.88,drag.h0+dy));b.style.setProperty('--sh',drag.h+'px')},{passive:false});
 const end=()=>{if(!drag)return;b.classList.remove('dragging');const H=innerHeight,s=drag.moved?Droid.snap(drag.h,H):0;if(s)b.style.setProperty('--sh',s+'px');else{b.style.removeProperty('--sh');App.closeSheet()}drag=null};
 d.addEventListener('touchend',end);d.addEventListener('touchcancel',end);
 // vibración suave (solo táctil)
 d.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'&&navigator.vibrate&&e.target.closest&&e.target.closest('button,.tc'))navigator.vibrate(6)},{passive:true});
 // botón Atrás de Android
 const sync=()=>{if(Droid.open()&&!pushed){history.pushState({ts:1},'');pushed=true}else if(!Droid.open()&&pushed){pushed=false;history.back()}};
 new MutationObserver(sync).observe(b,{attributes:true,attributeFilter:['data-sh']});
 const m=d.getElementById('modal');if(m)new MutationObserver(sync).observe(m,{attributes:true,attributeFilter:['hidden']});
 addEventListener('popstate',()=>{if(!pushed)return;pushed=false;if(m&&!m.hidden)m.hidden=true;else if(b.dataset.sh)App.closeSheet();if(Droid.open()){history.pushState({ts:1},'');pushed=true}});
})();
