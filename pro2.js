/* Conecta los botones de Análisis de la etapa 2. */
(()=>{const m={pAB:()=>Var.show(),pVer:()=>Ver.show(),pAuto:()=>Auto.show(),pLay:()=>Lay.show()};for(const k in m){const e=document.getElementById(k);if(e)e.onclick=()=>{if(k!=='pAuto'&&!L.layers.length)return App.toast('El lienzo está vacío: añade elementos primero');m[k]()}}})();
