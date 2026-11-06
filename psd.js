const PSD={bk:{'':'norm',multiply:'mul ',screen:'scrn',overlay:'over',darken:'dark',lighten:'lite','color-dodge':'div ','color-burn':'idiv','hard-light':'hLit','soft-light':'sLit',difference:'diff',exclusion:'smud',hue:'hue ',saturation:'sat ',color:'colr',luminosity:'lum '},
async download(){const b=this.write(),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=(document.getElementById('pname').value||'miniatura')+'.psd';a.click()},
write(){const W=1280,H=720,u16=n=>new Uint8Array([n>>8&255,n&255]),u32=n=>new Uint8Array([n>>>24&255,n>>>16&255,n>>>8&255,n&255]),str=s=>Uint8Array.from(s,c=>c.charCodeAt(0)&255);
const cat=a=>{let n=0;a.forEach(x=>n+=x.length);const o=new Uint8Array(n);let p=0;a.forEach(x=>{o.set(x,p);p+=x.length});return o};
const pad=(a,m)=>{const r=(m-a.length%m)%m;return r?cat([a,new Uint8Array(r)]):a};
const c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d',{willReadFrequently:true});
const recs=[],chd=[],orig=L.layers;
try{for(const l of orig){x.clearRect(0,0,W,H);L.layers=[Object.assign({},l,{vis:true,op:1,bm:''})];Ed.draw(x,true,true);L.layers=orig;
const p=x.getImageData(0,0,W,H).data;let x0=W,y0=H,x1=-1,y1=-1;
for(let j=0;j<H;j++)for(let i=0;i<W;i++)if(p[(j*W+i)*4+3]){if(i<x0)x0=i;if(i>x1)x1=i;if(j<y0)y0=j;if(j>y1)y1=j}
if(x1<0){x0=y0=x1=y1=0}
const w=x1-x0+1,h=y1-y0+1,ch=[0,1,2,3].map(()=>new Uint8Array(w*h));
for(let j=0;j<h;j++)for(let i=0;i<w;i++){const s=((y0+j)*W+x0+i)*4,d=j*w+i;ch[0][d]=p[s];ch[1][d]=p[s+1];ch[2][d]=p[s+2];ch[3][d]=p[s+3]}
const nm=String(l.type==='text'?l.text:(l.name||'Capa')).slice(0,60)||'Capa',as=nm.replace(/[^\x20-\x7e]/g,'?').slice(0,31);
const asc=pad(cat([new Uint8Array([as.length]),str(as)]),4);
const u=new Uint8Array(nm.length*2);for(let k=0;k<nm.length;k++){u[k*2]=nm.charCodeAt(k)>>8;u[k*2+1]=nm.charCodeAt(k)&255}
const ld=pad(cat([u32(nm.length),u]),4),luni=cat([str('8BIM'),str('luni'),u32(ld.length),ld]),extra=cat([u32(0),u32(0),asc,luni]),cl=u32(2+w*h);
recs.push(cat([u32(y0),u32(x0),u32(y1+1),u32(x1+1),u16(4),u16(0),cl,u16(1),cl,u16(2),cl,u16(65535),cl,str('8BIM'),str(this.bk[l.bm||'']||'norm'),new Uint8Array([Math.round(Math.max(0,Math.min(1,l.op))*255),0,l.vis?0:2,0]),u32(extra.length),extra]));
ch.forEach(a=>chd.push(u16(0),a))}}finally{L.layers=orig}
const li=pad(cat([u16(orig.length),...recs,...chd]),2),lm=cat([u32(li.length),li,u32(0)]);
const f=Exp.canvas().getContext('2d').getImageData(0,0,W,H).data,pl=[0,1,2].map(k=>{const a=new Uint8Array(W*H);for(let i=0;i<W*H;i++)a[i]=f[i*4+k];return a});
const pj=new TextEncoder().encode(JSON.stringify({v:1,layers:L.ser(),guides:(typeof Ed!=='undefined'&&Ed.guides)||[],n:L.n}));
return new Blob([cat([str('8BPS'),u16(1),new Uint8Array(6),u16(3),u32(H),u32(W),u16(8),u16(3),u32(0),u32(0),u32(lm.length),lm,u16(0),...pl,str('TSTUDIO1'),u32(pj.length),pj])],{type:'application/octet-stream'})},
async read(buf){const v=new DataView(buf),u8=new Uint8Array(buf);let p=0;
const r16=()=>{const n=v.getUint16(p);p+=2;return n},s16=()=>{const n=v.getInt16(p);p+=2;return n},r32=()=>{const n=v.getUint32(p);p+=4;return n},s32=()=>{const n=v.getInt32(p);p+=4;return n},r8=()=>u8[p++],s4=()=>{const s=String.fromCharCode(u8[p],u8[p+1],u8[p+2],u8[p+3]);p+=4;return s},skip=()=>{const m=r32();p+=m};
if(s4()!=='8BPS')throw new Error('no es un archivo PSD válido');if(r16()!==1)throw new Error('formato PSB no soportado');p+=6;const nch=r16(),H=r32(),Wd=r32(),dep=r16(),mode=r16();
if(dep!==8||mode!==3)throw new Error('solo se admite PSD en RGB de 8 bits');skip();skip();
const lmLen=r32(),lmEnd=p+lmLen,recs=[];
const unpack=(cp,dp,h,w)=>{const out=new Uint8Array(w*h);let q=dp,o=0;for(let r=0;r<h;r++){const end=q+v.getUint16(cp+r*2);while(q<end){const c=v.getInt8(q++);if(c>=0){for(let k=0;k<=c;k++)out[o++]=u8[q++]}else if(c!==-128){const b=u8[q++];for(let k=0;k<1-c;k++)out[o++]=b}}q=end}return[out,q]};
if(lmLen>0){const liLen=r32(),liEnd=p+liLen;if(liLen>0){const n=Math.abs(s16());
for(let i=0;i<n;i++){const t=s32(),l=s32(),b=s32(),r=s32(),nc=r16(),chs=[];for(let k=0;k<nc;k++)chs.push({id:s16(),len:r32()});p+=4;const bkey=s4();const op=r8();p++;const fl=r8();p++;const el=r32(),ee=p+el;skip();skip();
const ns=p,nl=u8[p];let name=String.fromCharCode(...u8.slice(p+1,p+1+nl));p=ns+Math.ceil((1+nl)/4)*4;let sec=0;
while(p+12<=ee){s4();const key=s4(),len=r32(),st=p;if(key==='luni'){const m=v.getUint32(p);let s='';for(let k=0;k<m;k++)s+=String.fromCharCode(v.getUint16(p+4+k*2));name=s}if(key==='lsct')sec=v.getUint32(p);
const ok=[len,len+len%2,len+(4-len%4)%4].find(c=>st+c>=ee||['8BIM','8B64'].includes(String.fromCharCode(...u8.slice(st+c,st+c+4))));p=st+(ok===undefined?len:ok)}
p=ee;recs.push({t,l,b,r,chs,op,fl,name,sec,bkey})}
for(const rc of recs){const w=rc.r-rc.l,h=rc.b-rc.t;rc.px={};for(const c of rc.chs){const st=p;if(w>0&&h>0&&c.len>2){const cm=r16();if(cm===0)rc.px[c.id]=u8.slice(p,p+w*h);else if(cm===1)rc.px[c.id]=unpack(p,p+h*2,h,w)[0]}p=st+c.len}}}
p=liEnd}
const inv=Object.fromEntries(Object.entries(this.bk).map(([a,b])=>[b,a])),k=Math.min(1280/Wd,720/H),ox=(1280-Wd*k)/2,oy=(720-H*k)/2,out=[];
const mk=(name,w,h,px,l,t,op,vis)=>{const cv=document.createElement('canvas');cv.width=w;cv.height=h;const x=cv.getContext('2d'),id=x.createImageData(w,h);for(let i=0;i<w*h;i++){id.data[i*4]=px[0]?px[0][i]:0;id.data[i*4+1]=px[1]?px[1][i]:0;id.data[i*4+2]=px[2]?px[2][i]:0;id.data[i*4+3]=px[-1]?px[-1][i]:255}x.putImageData(id,0,0);
return{type:'img',name:name||'Capa',src:cv.toDataURL('image/png'),x:ox+(l+w/2)*k,y:oy+(t+h/2)*k,w:w*k,h:h*k,rot:0,op:op,vis:vis}};
for(const rc of recs){const w=rc.r-rc.l,h=rc.b-rc.t;if(rc.sec||w<=0||h<=0||!(rc.px[0]||rc.px[1]||rc.px[2]||rc.px[-1]))continue;{const o=mk(rc.name,w,h,rc.px,rc.l,rc.t,rc.op/255,!(rc.fl&2));o.bm=inv[rc.bkey]||'';out.push(o)}}
if(!out.length){p=lmEnd;const cm=r16(),px={};if(cm===0){for(let c=0;c<3;c++)px[c]=u8.slice(p+c*Wd*H,p+(c+1)*Wd*H)}else if(cm===1){let dp=p+nch*H*2;for(let c=0;c<3;c++){const r=unpack(p+c*H*2,dp,H,Wd);px[c]=r[0];dp=r[1]}}else throw new Error('compresión no soportada');out.push(mk('Imagen PSD',Wd,H,px,0,0,1,true))}
for(let i=u8.length-12;i>=lmEnd;i--)if(u8[i]===84&&String.fromCharCode(...u8.slice(i,i+8))==='TSTUDIO1'){try{const n=v.getUint32(i+8),pr=JSON.parse(new TextDecoder().decode(u8.slice(i+12,i+12+n))),o2=pr.layers.map(l=>{const c=Object.assign({},l);delete c.id;return c});o2.project=pr;return o2}catch(x){}break}
return out}};
