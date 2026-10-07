const DB_NAME = "SpecimenTrophySmartSaveBackgroundSyncTestV1";
const DB_VERSION = 1;
const STORE = "queue";
const SYNC_TAG = "specimen-smart-save-upload";
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw4CR9H7Zl6E2K7Aip-5sfICD6kev5Ih-_1aokwMkGmGGeB4jDdkC6y7E3PfEPm8_Ne3w/exec";

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", event => event.waitUntil(self.clients.claim()));

function openDB(){
  return new Promise((resolve,reject)=>{
    const req=indexedDB.open(DB_NAME,DB_VERSION);
    req.onupgradeneeded=()=>{
      const db=req.result;
      if(!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE,{keyPath:"id",autoIncrement:true});
    };
    req.onsuccess=()=>resolve(req.result);
    req.onerror=()=>reject(req.error);
  });
}

function getAll(){
  return openDB().then(db=>new Promise((resolve,reject)=>{
    const req=db.transaction(STORE,"readonly").objectStore(STORE).getAll();
    req.onsuccess=()=>resolve(req.result||[]);
    req.onerror=()=>reject(req.error);
  }));
}

function remove(id){
  return openDB().then(db=>new Promise((resolve,reject)=>{
    const tx=db.transaction(STORE,"readwrite");
    tx.objectStore(STORE).delete(id);
    tx.oncomplete=()=>resolve();
    tx.onerror=()=>reject(tx.error);
  }));
}

async function uploadItem(item){
  const response = await fetch(SCRIPT_URL, {
    method:"POST",
    body:new URLSearchParams(item.data),
    mode:"no-cors",
    cache:"no-store"
  });
  // no-cors returns an opaque response, so a resolved fetch means the request
  // was handed off; it does not provide a readable Apps Script confirmation.
  return response;
}

async function processQueue(){
  const items=await getAll();
  for(const item of items){
    try{
      await uploadItem(item);
      await remove(item.id);
    }catch(error){
      console.warn("Background Sync upload failed; keeping item queued",error);
      throw error;
    }
  }
}

self.addEventListener("sync", event=>{
  if(event.tag===SYNC_TAG){
    event.waitUntil(processQueue());
  }
});

self.addEventListener("message", event=>{
  if(event.data === "PROCESS_QUEUE"){
    event.waitUntil?.(processQueue());
  }
});
