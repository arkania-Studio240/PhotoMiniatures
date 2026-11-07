var CW=1280,CH=720;
const Store={db:null,open(){return new Promise(r=>{const q=indexedDB.open('tstudio',3);q.onupgradeneeded=()=>{const d=q.result;if(!d.objectStoreNames.contains('p'))d.createObjectStore('p',{keyPath:'id'});if(!d.objectStoreNames.contains('f'))d.createObjectStore('f',{keyPath:'name'});if(!d.objectStoreNames.contains('v'))d.createObjectStore('v',{keyPath:'id'})};q.onsuccess=()=>{this.db=q.result;r()};q.onerror=()=>r()})},
put(p){return new Promise(r=>{const t=this.db.transaction('p','readwrite');t.objectStore('p').put(p);t.oncomplete=r})},
all(){return new Promise(r=>{const q=this.db.transaction('p').objectStore('p').getAll();q.onsuccess=()=>r(q.result)})},
putFont(f){return new Promise(r=>{const t=this.db.transaction('f','readwrite');t.objectStore('f').put(f);t.oncomplete=r})},
allFonts(){return new Promise(r=>{const q=this.db.transaction('f').objectStore('f').getAll();q.onsuccess=()=>r(q.result);q.onerror=()=>r([])})},
putV(r){return new Promise(res=>{const t=this.db.transaction('v','readwrite');t.objectStore('v').put(r);t.oncomplete=()=>res(true);t.onerror=t.onabort=()=>res(false)})},
allV(pid){return new Promise(res=>{const q=this.db.transaction('v').objectStore('v').getAll();q.onsuccess=()=>res(q.result.filter(r=>r.pid===pid).sort((a,b)=>b.t-a.t));q.onerror=()=>res([])})},
delV(id){return new Promise(res=>{const t=this.db.transaction('v','readwrite');t.objectStore('v').delete(id);t.oncomplete=()=>res(true)})},
del(id){return new Promise(r=>{const t=this.db.transaction('p','readwrite');t.objectStore('p').delete(id);t.oncomplete=r})}};
