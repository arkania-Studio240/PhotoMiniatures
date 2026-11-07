/* Accesibilidad visual: simulación de daltonismo (matrices de Machado et al., 2009, en RGB lineal), contraste del texto en cada modo
   y elementos que se confunden con el fondo. Previsualización a varios tamaños. */
const A11y={
 MODES:{normal:['Normal',null],prot:['Protanopia',[[.152286,1.052583,-.204868],[.114503,.786281,.099216],[-.003882,-.048116,1.051998]]],deut:['Deuteranopia',[[.367322,.860646,-.227968],[.280085,.672501,.047413],[-.01182,.04294,.968881]]],trit:['Tritanopia',[[1.255528,-.076749,-.178779],[-.078411,.930809,.147602],[.004733,.691367,.3039]]],achr:['Acromatopsia','g']},
 mode:'normal',
 lin:(()=>{const t=new Float32Array(256);for(let i=0;i<256;i++){const v=i/255;t[i]=v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4)}return t})(),
 enc(v){v=v<0?0:v>1?1:v;return Math.round((v<=.0031308?v*12.92:1.055*Math.pow(v,1/2.4)-.055)*255)},
 sim(c,m){const M=this.MODES[m][1];if(!M)return c;const[r,g,b]=[this.lin[c[0]|0],this.lin[c[1]|0],this.lin[c[2]|0]];if(M==='g'){const y=this.enc(.2126*r+.7152*g+.0722*b);return[y,y,y]}return[this.enc(M[0][0]*r+M[0][1]*g+M[0][2]*b),this.enc(M[1][0]*r+M[1][1]*g+M[1][2]*b),this.enc(M[2][0]*r+M[2][1]*g+M[2][2]*b)]},
 apply(cv,m){const x=cv.getContext('2d'),d=x.getImageData(0,0,cv.width,cv.height),p=d.data;if(m!=='normal')for(let i=0;i<p.length;i+=4){const o=this.sim([p[i],p[i+1],p[i+2]],m);p[i]=o[0];p[i+1]=o[1];p[i+2]=o[2]}x.putImageData(d,0,0);return cv},
 ratio(a,b){const x=Analyze.lum(...a),y=Analyze.lum(...b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)},
 hex(h){return Analyze.hex(h)},
 report(){const ls=Pro.layers(),full=Exp.canvas(),W=128,rows=[],conf=[];const k=W/CW;
  ls.forEach(l=>{const b=Pro.bb(l),x0=Math.max(0,b.x0*k|0),x1=Math.min(W,Math.ceil(b.x1*k)),y0=Math.max(0,b.y0*k|0);const wo=Pro.without(l,W),wd=Pro.data(wo),y1=Math.min(wd.height,Math.ceil(b.y1*k));
   const inBox=i=>{const x=i%W,y=(i/W)|0;return x>=x0&&x<x1&&y>=y0&&y<y1?1:0};const bg=Pro.mean(wd.data,inBox);if(!bg)return;
   let col;if(l.type==='text')col=this.hex(l.fill);else{const al=Pro.small(Ed.alone(l,false),W),ad=Pro.data(al).data;col=Pro.mean(ad,(i,a)=>a>200?1:0)}if(!col)return;
   const per={};Object.keys(this.MODES).forEach(m=>{const c1=this.sim(col,m),c2=this.sim(bg,m);per[m]={r:this.ratio(c1,c2),d:Math.hypot(c1[0]-c2[0],c1[1]-c2[1],c1[2]-c2[2])}});
   if(l.type==='text')rows.push({l,per});
   Object.keys(this.MODES).forEach(m=>{if(m!=='normal'&&per.normal.d>=90&&per[m].d<45)conf.push(Pro.nm(l)+' se confunde con el fondo en '+this.MODES[m][0]+'.')})});
  return{rows,conf}},
 cell(r){const c=r>=4.5?'#4cae6e':r>=3?'#e0a23b':'#e5383b';return '<td style="color:'+c+';font-weight:600">'+r.toFixed(1)+':1</td>'},
 show(){const full=Exp.canvas();this.src=Pro.small(full,480);let rep;App.toast('Analizando…');setTimeout(()=>{try{rep=this.report()}catch(e){console.error(e);return App.toast('No se pudo analizar')}this.rep=rep;this.draw()},30)},
 draw(){const m=this.mode,cv=this.apply(Pro.small(this.src,480),m),u=cv.toDataURL(),rep=this.rep,ms=Object.keys(this.MODES);
  const tbl=rep.rows.length?'<div style="overflow-x:auto"><table class="ct"><tr><th>Texto</th>'+ms.map(k=>'<th>'+this.MODES[k][0]+'</th>').join('')+'</tr>'+rep.rows.map(r=>'<tr><td>'+Pro.nm(r.l)+'</td>'+ms.map(k=>this.cell(r.per[k].r)).join('')+'</tr>').join('')+'</table></div><p><small>Contraste WCAG entre el color del texto y el fondo que tiene detrás. Verde ≥ 4,5:1; ámbar 3 a 4,5:1 (suficiente solo para texto grande); rojo &lt; 3:1.</small></p>':'<p class="empty">No hay capas de texto para medir contraste.</p>';
  Pro.modal('<h3>Accesibilidad visual</h3><div class="chips" id="aChips">'+ms.map(k=>'<button data-m="'+k+'"'+(k===m?' class="on"':'')+'>'+this.MODES[k][0]+'</button>').join('')+'</div><img class="apv" src="'+u+'" alt="Simulación"><div class="aps"><div><img src="'+u+'" width="360"><small>360 px</small></div><div><img src="'+u+'" width="168"><small>168 px</small></div><div><img src="'+u+'" width="120"><small>120 px</small></div></div><h4>Contraste del texto</h4>'+tbl+'<h4>Elementos difíciles de distinguir</h4>'+(rep.conf.length?rep.conf.map(t=>'<div class="ri"><span>'+t+'</span></div>').join(''):'<p class="empty">Ningún elemento se confunde con el fondo en las simulaciones.</p>')+'<p><small>Las simulaciones son aproximaciones del modelo de Machado et al. (2009) para dicromacia completa; las personas con visión alterada pueden percibir distinto.</small></p>',true);
  document.querySelectorAll('#aChips button').forEach(b=>b.onclick=()=>{this.mode=b.dataset.m;this.draw()})}};
