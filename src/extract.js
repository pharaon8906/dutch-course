const fs=require('fs');
eval(fs.readFileSync('words.js','utf8')+fs.readFileSync('content.js','utf8')+fs.readFileSync('emoji.js','utf8')+';globalThis.D={RAW,DIALOGS,GRAMMAR,SOUNDS,HACKS,FALSE_FRIENDS}');
const {RAW,DIALOGS,GRAMMAR,SOUNDS,FALSE_FRIENDS}=D;
const clean=t=>t.replace(/\s\/\s/g,', ').replace(/\(.*?\)/g,'').replace(/\.\.\.|…|___/g,'').replace(/\s+/g,' ').trim();
const items=new Map();
function add(text,voice,chunk){const c=clean(text);if(!c)return;const k=voice+'|'+c;if(!items.has(k))items.set(k,{k,text:c,voice,chunk})}
Object.entries(RAW).forEach(([cat,txt],ci)=>txt.trim().split('\n').forEach(l=>{const nl=l.split('|')[0].trim();add(nl,'m','w'+ci);const m=nl.match(/^(de|het) (.*)$/);if(m&&!nl.includes('?'))add(m[2],'m','w'+ci)}));
DIALOGS.forEach((d,i)=>d.lines.forEach(([who,nl])=>add(nl,who==='A'?'f':'m','d')));
GRAMMAR.forEach(g=>g.ex.forEach(([nl])=>add(nl.split('→').pop().split('—')[0].trim(),'m','x')));
SOUNDS.forEach(s=>{s.ex.forEach(w=>add(w,'m','x'));add(s.ex.join(', '),'m','x')});
FALSE_FRIENDS.forEach(f=>add(f[0],'m','x'));
const extra=['Ik wil graag ...','Mag ik ...?','Hoeveel kost het?','Waar is ...?','Kunt u dat herhalen?','Kunt u langzamer praten?','Hoe zeg je ... in het Nederlands?','Wat betekent dat?','Ik spreek een beetje Nederlands.','Ik wil graag Nederlands oefenen.','Achtentachtig angstige agenten aten achtentachtig ananassen','Scheveningen','Hallo! Welkom bij de cursus Nederlands.','Dit is mijn stem.','Hallo! Ik spreek Nederlands.'];
extra.forEach(t=>add(t,'m','x'));
const arr=[...items.values()];arr.forEach((it,i)=>it.id=i);
fs.writeFileSync('tts/items.json',JSON.stringify(arr));
console.log(arr.length,'clips;',[...new Set(arr.map(a=>a.chunk))].length,'chunks; female',arr.filter(a=>a.voice==='f').length);
