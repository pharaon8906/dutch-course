// Builds wex.js: one example sentence (nl, uk, voice) for every word.
const fs=require('fs');
eval(['words.js','content.js','content2.js','texts.js','texts_more.js','examples.js'].map(f=>fs.readFileSync(f,'utf8')).join('\n')+';RAW["Розмовні вирази"]=EXPR_RAW;globalThis.X={RAW,TEXTS,DIALOGS,NEW_DIALOGS,EXAMPLES_RAW,CATLEVEL}');
const {RAW,TEXTS,DIALOGS,NEW_DIALOGS,EXAMPLES_RAW,CATLEVEL}=X;
const man=new Map(EXAMPLES_RAW.split('\n').map(l=>{const [w,nl,uk]=l.split('|');return [w,[nl,uk,'m']]}));
const tok=s=>(s.match(/'s|[A-Za-zÀ-ÿ]+(?:'s)?/g)||[]).map(x=>x.toLowerCase());
const LV={A0:0,A1:1,A2:2};const sents=[];
TEXTS.forEach(t=>t.p.flat().forEach(([nl,uk])=>{if(!/[„”]/.test(nl))sents.push({nl,uk,lv:LV[t.lv],v:'m'})}));
DIALOGS.concat(NEW_DIALOGS).forEach(d=>d.lines.forEach(([w,nl,uk])=>sents.push({nl,uk,lv:1,v:w==='A'?'f':'m'})));
const out={};let auto=0,manual=0,none=0;
for(const [cat,v] of Object.entries(RAW))v.trim().split('\n').forEach(l=>{const nl=l.split('|')[0].trim();
  if(man.has(nl)){out[nl]=man.get(nl);manual++;return}
  const base=nl.toLowerCase().replace(/^(de|het) /,'').replace(/[?!.]/g,'').replace(/\s*\(.*\)/,'').split(' / ')[0].trim();const bt=tok(base);
  const wl=LV[CATLEVEL[cat]||'A1'];
  const c=sents.filter(s=>{const st=tok(s.nl);return bt.length===1?st.includes(bt[0]):s.nl.toLowerCase().includes(base)}).filter(s=>s.nl.toLowerCase().trim()!==nl.toLowerCase());
  if(!c.length){none++;return}
  c.sort((a,b)=>{const sa=Math.abs(a.nl.split(' ').length-7)+Math.max(0,a.lv-wl)*3,sb=Math.abs(b.nl.split(' ').length-7)+Math.max(0,b.lv-wl)*3;return sa-sb||a.nl.length-b.nl.length});
  out[nl]=[c[0].nl,c[0].uk,c[0].v];auto++});
fs.writeFileSync('wex.js','const WEX='+JSON.stringify(out)+';\n');
console.log('examples: auto',auto,'manual',manual,'missing',none);
