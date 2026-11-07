/* Simulador de YouTube: muestra tu miniatura dentro de maquetas de Inicio, Búsqueda, Recomendados, Reproducción y Móvil.
   Título y canal los escribes tú; la zona de duración es solo una guía de lo que tapa YouTube. No usa datos inventados de vistas. */
const Sim={
 mode:'home',dark:true,scale:100,guide:true,title:'',chan:'Tu canal',dur:'12:34',img:'',
 MODES:{home:'Inicio',search:'Búsqueda',rec:'Recomendados',watch:'Reproducción',mob:'Móvil'},
 show(){this.img=Exp.canvas().toDataURL('image/jpeg',.92);if(!this.title)this.title=document.getElementById('pname').value||'Título de tu video';this.draw()},
 th(w){return '<div class="sth" style="width:'+w+'px"><img src="'+this.img+'" alt="">'+(this.guide?'<i class="zg" title="Zona que cubre la duración"></i>':'')+'<b class="du">'+esc(this.dur)+'</b></div>'},
 meta(t,c){return '<div class="smt"><div class="av">'+esc((this.chan||'C').trim().charAt(0).toUpperCase())+'</div><div><div class="stt" style="font-size:'+t+'px">'+esc(this.title)+'</div><div class="sch">'+esc(this.chan)+'</div></div></div>'},
 sk(w){return '<div class="skc" style="width:'+w+'px"><div class="skb" style="height:'+Math.round(w*9/16)+'px"></div><div class="skl"></div><div class="skl s"></div></div>'},
 body(){const s=this.scale/100;switch(this.mode){
  case'home':{const w=Math.round(340*s);return '<div class="sgrid">'+this.sk(w)+'<div style="width:'+w+'px">'+this.th(w)+this.meta(14*Math.max(.8,s))+'</div>'+this.sk(w)+'</div>'}
  case'search':{const w=Math.round(360*s);return '<div class="slist">'+this.sk(w).replace('class="skc"','class="skc row"')+'<div class="srow">'+this.th(w)+'<div class="smt2"><div class="stt" style="font-size:'+Math.round(18*Math.max(.8,s))+'px">'+esc(this.title)+'</div><div class="sch">'+esc(this.chan)+'</div></div></div></div>'}
  case'rec':{const w=Math.round(168*s);return '<div class="srec"><div class="srow">'+this.sk(w)+'</div><div class="srow">'+this.th(w)+'<div class="smt2"><div class="stt" style="font-size:'+Math.round(14*Math.max(.85,s))+'px">'+esc(this.title)+'</div><div class="sch">'+esc(this.chan)+'</div></div></div><div class="srow">'+this.sk(w)+'</div></div>'}
  case'watch':{const w=Math.round(168*s);return '<div class="swatch"><div class="splay">'+Ic('play',34)+'</div><div class="srec"><div class="srow">'+this.th(w)+'<div class="smt2"><div class="stt" style="font-size:'+Math.round(13*Math.max(.85,s))+'px">'+esc(this.title)+'</div><div class="sch">'+esc(this.chan)+'</div></div></div><div class="srow">'+this.sk(w)+'</div></div></div>'}
  default:{const w=Math.round(360*Math.min(1,s+.1));return '<div class="phone" style="width:'+(w+16)+'px">'+this.th(w)+this.meta(15)+this.sk(w)+'</div>'}}},
 draw(){const m=this.mode;Pro.modal('<h3>Simulador de YouTube</h3><div class="chips" id="sChips">'+Object.keys(this.MODES).map(k=>'<button data-m="'+k+'"'+(k===m?' class="on"':'')+'>'+this.MODES[k]+'</button>').join('')+'</div>'
  +'<div class="sctl"><label>Título<input id="sT" value="'+esc(this.title)+'" maxlength="100"></label><label>Canal<input id="sC" value="'+esc(this.chan)+'" maxlength="40"></label><label>Duración (ejemplo)<input id="sD" value="'+esc(this.dur)+'" maxlength="8"></label></div>'
  +'<div class="sctl"><label>Tamaño <input id="sS" type="range" min="40" max="140" value="'+this.scale+'"><span id="sSv">'+this.scale+'%</span></label><button id="sTh" class="tile on">'+Ic(this.dark?'eye':'eyeoff')+'<span>'+(this.dark?'Tema oscuro':'Tema claro')+'</span></button><button id="sGd" class="tile'+(this.guide?' on':'')+'">'+Ic('scan')+'<span>Zona de duración</span></button></div>'
  +'<div class="stage '+(this.dark?'dk':'lt')+'" id="sStage">'+this.body()+'</div><p><small>Maquetas orientativas del diseño de YouTube; el aspecto real cambia con el dispositivo y las actualizaciones de la plataforma. Los bloques grises representan otros videos.</small></p>',true);
  document.querySelectorAll('#sChips button').forEach(b=>b.onclick=()=>{this.mode=b.dataset.m;this.draw()});
  const re=()=>{document.getElementById('sStage').innerHTML=this.body()};
  document.getElementById('sT').oninput=e=>{this.title=e.target.value;re()};document.getElementById('sC').oninput=e=>{this.chan=e.target.value;re()};document.getElementById('sD').oninput=e=>{this.dur=e.target.value;re()};
  document.getElementById('sS').oninput=e=>{this.scale=+e.target.value;document.getElementById('sSv').textContent=this.scale+'%';re()};
  document.getElementById('sTh').onclick=()=>{this.dark=!this.dark;this.draw()};document.getElementById('sGd').onclick=()=>{this.guide=!this.guide;this.draw()}}};
function esc(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
