/* Interfaz de escritorio: panel izquierdo con barra lateral de iconos (pestañas en vertical) y marca en la barra superior.
   En móvil no cambia nada visible: las mismas piezas siguen funcionando como hoja inferior. */
(function(){
 const left=document.getElementById('left'),tabs=document.getElementById('ltabs');
 if(left&&tabs&&!left.classList.contains('split')){const body=document.createElement('div');body.className='lbody';[...left.children].forEach(c=>{if(c!==tabs&&!c.classList.contains('grab'))body.append(c)});left.append(body);left.classList.add('split')}
 const h=document.querySelector('header'),nm=document.getElementById('pname');
 if(h&&nm&&!h.querySelector('.brand')){const b=document.createElement('span');b.className='brand';b.innerHTML=Ic('logo',18)+'<span>Thumbnail Studio <b>3.0</b></span>';nm.before(b)}
 // etiqueta corta bajo cada icono de la barra lateral (solo escritorio)
 document.querySelectorAll('#ltabs button').forEach(b=>{if(!b.querySelector('.lb')){const s=document.createElement('span');s.className='lb';s.textContent=b.title;b.append(s)}});
})();
