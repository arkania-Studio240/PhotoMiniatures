const PAL={'g':'#4caf50','d':'#2e7d32','k':'#111','r':'#e53935','p':'#ff8a80','c':'#4dd0e1','w':'#fff','b':'#0097a7','t':'#d32f2f','y':'#fdd835','s':'#9e9e9e','n':'#6d4c41'};
Object.assign(PAL,{h:'#e0a070',m:'#5d4037',u:'#3949ab',o:'#ef6c00',z:'#5a8f3c',x:'#2b2b2b',e:'#b388ff',a:'#43a047',i:'#4a4a4a'});
const PIX={
Steve:['mmmmmmmm','mmmmmmmm','hhhhhhhh','hwuhhuwh','hhhhhhhh','hhmmmmhh','hhmhhmhh','hhhhhhhh'],
Alex:['oooooooo','oooooooo','hhhhhhhh','hwahhawh','hhhhhhhh','hhhhhhhh','hhhhhhhh','hhhhhhhh'],
Zombie:['zzzzzzzz','zzzzzzzz','zkzzzzkz','zzzzzzzz','zzkkkkzz','zzkzzkzz','zzzzzzzz','zzzzzzzz'],
Enderman:['xxxxxxxx','xxxxxxxx','xeexxeex','xxxxxxxx','xxxxxxxx','xxxxxxxx','xxxxxxxx','xxxxxxxx'],
Pico:['.cccccc.','cc..n.cc','c...n..c','....n...','....n...','....n...','....n...','....n...'],
Netherite:['........','.iiiiii.','iiwiiiii','iiiiiiii','iiiiiiii','.iiiiii.','........','........'],
Armadura:['s.ssss.s','ssssssss','ssswwsss','ssssssss','.ssssss.','.ssssss.','.ss..ss.','........'],
Césped:['gggggggg','gdggdggg','nnnnnnnn','nnnmnnnn','nnnnnnmn','nmnnnnnn','nnnnnmnn','nnnnnnnn'],
Creeper:['gdgggdgg','gggggggg','gkkggkkg','gkkggkkg','gggkkggg','ggkkkkgg','ggkkkkgg','gdgkkgdg'],
Corazón:['.rr..rr.','rrprrrrr','rprrrrrr','rrrrrrrr','.rrrrrr.','..rrrr..','...rr...','........'],
Diamante:['..cccc..','.cwcccb.','cwccccbb','cccccbbb','.cccbbb.','..cbbb..','...bb...','........'],
TNT:['tttttttt','wwwwwwww','wkwkwkww','wwkkkkww','wkwkwkww','wwwwwwww','tttttttt','tttttttt'],
Espada:['......cc','.....ccc','....ccc.','c..ccc..','cccc....','.ccn....','.nnc....','nn......'],
Estrella:['...yy...','...yy...','yyyyyyyy','.yyyyyy.','..yyyy..','.yyyyyy.','.yy..yy.','yy....yy']};
const Assets={list:[],init(){for(const k in PIX){const g=PIX[k],c=document.createElement('canvas');c.width=c.height=8;const x=c.getContext('2d');g.forEach((row,j)=>[...row].forEach((ch,i)=>{if(PAL[ch]){x.fillStyle=PAL[ch];x.fillRect(i,j,1,1)}}));
const big=document.createElement('canvas');big.width=big.height=256;const b=big.getContext('2d');b.imageSmoothingEnabled=false;b.drawImage(c,0,0,256,256);this.list.push({name:k,src:big.toDataURL()})}
const svg=(n,s,full)=>{const m=s.match(/viewBox="0 0 (\d+) (\d+)"/);this.list.push({name:n,full,ar:m?m[2]/m[1]:1,src:'data:image/svg+xml,'+encodeURIComponent(s)})};
svg('Flecha','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120"><path d="M10 40h110V10l70 50-70 50V80H10z" fill="#e53935" stroke="#fff" stroke-width="6"/></svg>');
svg('Círculo rojo','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle cx="100" cy="100" r="90" fill="none" stroke="#e53935" stroke-width="16"/></svg>');
svg('Explosión','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><path d="M100 5l20 55 50-30-20 55 45 10-45 25 30 45-55-15-5 50-20-45-35 40 5-55-50 5 40-40-40-35 55-5-5-50 35 35z" fill="#ff9800" stroke="#fdd835" stroke-width="8"/></svg>');
svg('Rayo','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 200"><path d="M70 0L10 110h45L40 200l75-120H65z" fill="#fdd835" stroke="#fff" stroke-width="6"/></svg>');
svg('Fuego','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 180"><path d="M60 0C70 50 115 70 110 120c-3 35-30 58-50 58S7 155 10 120C12 90 35 80 40 50c10 15 15 25 20-50z" fill="#ff6d00"/><path d="M60 70c8 30 35 40 30 70-3 20-18 30-30 30s-27-10-30-30c-3-25 20-35 30-70z" fill="#ffd54f"/></svg>');
svg('Humo','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 140"><g fill="#cfd8dc" opacity=".85"><circle cx="60" cy="80" r="45"/><circle cx="110" cy="60" r="50"/><circle cx="145" cy="90" r="40"/></g></svg>');
svg('Mando','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120"><path d="M40 20h120c25 0 40 50 38 80-2 14-18 14-28-2l-12-18H42L30 98c-10 16-26 16-28 2-2-30 13-80 38-80z" fill="#37474f" stroke="#90a4ae" stroke-width="4"/><circle cx="145" cy="48" r="9" fill="#e53935"/><circle cx="165" cy="62" r="9" fill="#43a047"/><path d="M45 40h24M57 28v24" stroke="#fff" stroke-width="8"/></svg>');
svg('NUEVO','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 80"><rect x="4" y="4" width="212" height="72" rx="14" fill="#e53935" stroke="#fff" stroke-width="6"/><text x="110" y="56" font-family="Impact,Arial Black" font-size="46" fill="#fff" text-anchor="middle">NUEVO</text></svg>');
svg('Marco','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120"><rect x="6" y="6" width="188" height="108" rx="10" fill="none" stroke="#fff" stroke-width="10"/></svg>');
svg('Laptop','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 150"><rect x="30" y="8" width="160" height="100" rx="8" fill="#222" stroke="#aaa" stroke-width="4"/><rect x="38" y="16" width="144" height="84" fill="#4dd0e1"/><path d="M8 118h204l-14 24H22z" fill="#90a4ae"/></svg>');
const bio=(n,c1,c2,g,ex)=>svg(n,'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720"><defs><linearGradient id="a" x2="0" y2="1"><stop offset="0" stop-color="'+c1+'"/><stop offset="1" stop-color="'+c2+'"/></linearGradient></defs><rect width="1280" height="720" fill="url(#a)"/><rect y="540" width="1280" height="180" fill="'+g+'"/>'+ex+'</svg>',true);
bio('Bioma Bosque','#4fc3f7','#e1f5fe','#43a047','<g fill="#2e7d32"><rect x="150" y="300" width="140" height="140"/><rect x="800" y="260" width="160" height="160"/></g><g fill="#5d4037"><rect x="205" y="440" width="30" height="110"/><rect x="865" y="420" width="30" height="130"/></g>');
bio('Bioma Desierto','#ffb74d','#fff3e0','#e6c07b','<g fill="#388e3c"><rect x="220" y="380" width="40" height="170"/><rect x="180" y="420" width="40" height="30"/><rect x="900" y="400" width="40" height="150"/></g>');
bio('Bioma Nether','#2a0000','#b71c1c','#3e2723','<rect y="620" width="1280" height="100" fill="#ff6d00"/><g fill="#5d1a1a"><rect x="100" y="380" width="90" height="170"/><rect x="900" y="330" width="120" height="220"/></g>');
bio('Bioma End','#050010','#311b92','#e8e4a0','<g fill="#111"><rect x="180" y="200" width="60" height="350"/><rect x="1000" y="260" width="60" height="290"/></g><circle cx="640" cy="200" r="50" fill="#b388ff"/>');
bio('Bioma Nieve','#b3e5fc','#ffffff','#f5f5f5','<g fill="#2e7d32"><path d="M200 540l60-200 60 200z"/><path d="M900 540l70-240 70 240z"/></g>');
svg('Partículas','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><g fill="#fdd835"><path d="M50 10l8 30 30 8-30 8-8 30-8-30-30-8 30-8z"/><path d="M140 80l6 22 22 6-22 6-6 22-6-22-22-6 22-6z"/><circle cx="100" cy="30" r="6"/><circle cx="30" cy="140" r="8"/><circle cx="160" cy="160" r="10"/><circle cx="90" cy="150" r="5"/></g></svg>');
svg('Vida HUD','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 100">'+[0,1,2,3,4].map(i=>'<path transform="translate('+i*100+',0)" d="M50 90L10 50A22 22 0 0 1 50 28A22 22 0 0 1 90 50z" fill="#e53935" stroke="#7f0000" stroke-width="4"/>').join('')+'</svg>');
svg('Hotbar HUD','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 100">'+[0,1,2,3,4,5,6,7,8].map(i=>'<rect x="'+(i*100+4)+'" y="4" width="92" height="92" fill="#444" stroke="#bbb" stroke-width="6"/>').join('')+'</svg>');
svg('Velocidad','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 120"><g stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".85"><path d="M0 20H220M40 50H300M0 80H240M60 105H280"/></g></svg>');
svg('Auriculares','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 180"><path d="M30 110V90a70 70 0 0 1 140 0v20" fill="none" stroke="#cfd8dc" stroke-width="12"/><rect x="14" y="100" width="36" height="64" rx="12" fill="#37474f"/><rect x="150" y="100" width="36" height="64" rx="12" fill="#37474f"/></svg>');
svg('Cámara','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 160"><rect x="10" y="30" width="200" height="120" rx="16" fill="#37474f"/><rect x="70" y="10" width="60" height="30" rx="6" fill="#546e7a"/><circle cx="110" cy="90" r="42" fill="#90a4ae"/><circle cx="110" cy="90" r="26" fill="#102027"/></svg>');
svg('Smartphone','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 200"><rect x="5" y="5" width="90" height="190" rx="14" fill="#222" stroke="#aaa" stroke-width="4"/><rect x="12" y="25" width="76" height="150" fill="#3b6fd4"/></svg>')}};

const Fonts={list:['Impact','Arial Black','Anton','Bangers','Bebas Neue','Luckiest Guy','Permanent Marker','Press Start 2P','Russo One','Black Ops One','Pacifico','Lobster','Righteous','Creepster','Oswald','Fredoka','Montserrat','Verdana','Georgia','Courier New'],custom:[],
init(){const rd=()=>{Ed.draw(Ed.ctx);if(App.tplThumbs)App.tplThumbs()};this.list.slice(2,17).forEach(n=>document.fonts.load('40px "'+n+'"').then(rd).catch(()=>{}));
Store.allFonts().then(fs=>fs.forEach(f=>new FontFace(f.name,f.data).load().then(ff=>{document.fonts.add(ff);this.custom.push(f.name);rd()}).catch(()=>{})))}};
