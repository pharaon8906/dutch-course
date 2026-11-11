/* ---------- levels & data ---------- */
const LVO={A0:0,A1:1,A2:2};
const DEMO2=['🤝','☕','🛒','🗺️','🩺','📞','🚆','🏖️','💼'];
const ALLD=DIALOGS.map((d,i)=>Object.assign({},d,{lv:DLEVEL[i],e:DEMO2[i]})).concat(NEW_DIALOGS);
const GLOSS=new Map(GLOSS_RAW.split('\n').map(l=>{const i=l.indexOf('|');return [l.slice(0,i),l.slice(i+1)]}));
const lvOf=c=>CATLEVEL[c]||'A1';
function lvChips(curLv,id){return `<div class="row lvchips" id="${id}">${['A0','A1','A2','all'].map(l=>`<button class="chip ${curLv===l?'on':''}" data-lv="${l}">${l==='all'?'🌈 Усі':LEVELS.find(x=>x.id===l).e+' '+l}</button>`).join('')}</div>`}
function bindChips(id,fn){document.querySelectorAll(`#${id} [data-lv]`).forEach(b=>b.onclick=()=>fn(b.dataset.lv))}
const inLv=(lv,f)=>f==='all'||lv===f;

/* ---------- microphone ---------- */
let DICT=null;
(async()=>{try{if(window.claude&&claude.use){DICT=await claude.use('dictation')}}catch(e){DICT=null}})();
const WSR=window.SpeechRecognition||window.webkitSpeechRecognition||null;
const micAvailable=()=>!!(DICT||WSR);
let micStop=null;
function listen({onPartial,onDone,onError}){
  let done=false,text='',timer=null,maxT=null,unsubs=[];
  const finish=()=>{if(done)return;done=true;clearTimeout(timer);clearTimeout(maxT);unsubs.forEach(u=>{try{u()}catch(e){}});micStop=null;onDone(text.trim())};
  const startWSR=()=>{
    if(!WSR){done=true;onError('unavailable');return}
    const r=new WSR();r.lang='nl-NL';r.interimResults=true;r.maxAlternatives=1;r.continuous=false;
    r.onresult=e=>{let f='',p='';for(const res of e.results){if(res.isFinal)f+=res[0].transcript+' ';else p+=res[0].transcript}text=f;onPartial&&onPartial((f+p).trim())};
    r.onerror=e=>{if(e.error==='no-speech'){finish();return}if(!done){done=true;micStop=null;onError(e.error==='not-allowed'?'not_granted':e.error)}};
    r.onend=()=>finish();
    micStop=()=>{try{r.stop()}catch(e){}};
    try{r.start()}catch(e){done=true;onError('unavailable');return}
    maxT=setTimeout(()=>micStop&&micStop(),15000);
  };
  if(DICT){
    unsubs.push(DICT.onFinal(({text:t})=>{text+=t;clearTimeout(timer);timer=setTimeout(()=>DICT.stop().then(finish,finish),1400)}));
    unsubs.push(DICT.onPartial(({text:t})=>{onPartial&&onPartial((text+' '+t).trim());if(t){clearTimeout(timer)}}));
    unsubs.push(DICT.onState(({state,reason})=>{if(state==='idle'&&!done){if(reason&&!['stopped','viewer_stopped'].includes(reason)&&!text){done=true;unsubs.forEach(u=>{try{u()}catch(e){}});micStop=null;onError(reason)}else finish()}}));
    micStop=()=>DICT.stop().then(finish,finish);
    maxT=setTimeout(()=>micStop&&micStop(),15000);
    DICT.start({language:'nl'}).catch(err=>{if(done)return;unsubs.forEach(u=>{try{u()}catch(e){}});unsubs=[];clearTimeout(maxT);
      if(err&&err.code==='unavailable'&&WSR){startWSR()}else{done=true;micStop=null;onError(err&&err.code||'error')}});
    return;
  }
  startWSR();
}
const NUM={0:'nul',1:'een',2:'twee',3:'drie',4:'vier',5:'vijf',6:'zes',7:'zeven',8:'acht',9:'negen',10:'tien',11:'elf',12:'twaalf',13:'dertien',14:'veertien',15:'vijftien',16:'zestien',17:'zeventien',18:'achttien',19:'negentien',20:'twintig',30:'dertig',40:'veertig',50:'vijftig',60:'zestig',70:'zeventig',80:'tachtig',90:'negentig',100:'honderd'};
function numNl(n){if(NUM[n])return NUM[n];if(n<100){const t=Math.floor(n/10)*10,u=n%10;return NUM[u]+(u===2||u===3?'ën':'en')+NUM[t]}return String(n)}
function wnorm(s){return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/(\d+)/g,(m)=>' '+numNl(+m)+' ').replace(/[^a-z' ]/g,' ').replace(/'/g,'').split(/\s+/).filter(Boolean)}
function compare(expected,heard){
  const E=wnorm(expected),H=wnorm(heard);const n=E.length,m=H.length;
  const d=Array.from({length:n+1},()=>new Array(m+1).fill(0));
  const eq=(a,b)=>a===b||(a.length>3&&b.length>3&&lev(a,b)<=1);
  for(let i=n-1;i>=0;i--)for(let j=m-1;j>=0;j--)d[i][j]=eq(E[i],H[j])?d[i+1][j+1]+1:Math.max(d[i+1][j],d[i][j+1]);
  const ok=new Array(n).fill(false);let i=0,j=0;while(i<n&&j<m){if(eq(E[i],H[j])){ok[i]=true;i++;j++}else if(d[i+1][j]>=d[i][j+1])i++;else j++}
  const score=n?ok.filter(Boolean).length/n:0;
  return {score,ok,E};
}
function markWords(expected,res){const raw=expected.split(/\s+/);let k=0;return raw.map(w=>{const has=wnorm(w).length>0;const cls=has?(res.ok[k]?'w-ok':'w-miss'):'';if(has)k+=wnorm(w).length;return `<span class="${cls}">${esc(w)}</span>`}).join(' ')}
function micErrText(code){return code==='not_granted'?'Доступ до мікрофона заборонено. Дозвольте його в налаштуваннях браузера або в меню дозволів сторінки.':code==='unavailable'?'Розпізнавання мовлення тут недоступне. Відкрийте курс у Chrome.':'Не вдалося почути. Спробуйте ще раз.'}
const MIC='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>';

/* ---------- navigation ---------- */
const NAV=[['home','🏠','Головна'],['learn','📚','Навчання'],['dialogs','💬','Діалоги'],['quiz','🎯','Тренажер'],['progress','🏆','Прогрес']];
const SUB={words:['learn','🃏 Слова'],sounds:['learn','🔤 Звуки й букви'],reading:['learn','📖 Читання'],grammar:['learn','📘 Граматика'],hacks:['learn','💡 Лайфхаки']};
const VIEWS=['home','learn','dialogs','quiz','progress','words','sounds','reading','grammar','hacks'];
let cur=(location.hash||'').slice(1);if(!VIEWS.includes(cur))cur='home';
function drawNav(){const top=SUB[cur]?SUB[cur][0]:cur;$('#bnav').innerHTML=NAV.map(([id,i,n])=>`<button class="bn" data-tab="${id}" ${id===top?'aria-current="page"':''}><span class="i">${i}</span>${n}</button>`).join('');
  $('#hero').hidden=cur!=='home';
  const sb=$('#subbar');if(SUB[cur]||cur!=='home'){sb.hidden=false;sb.innerHTML=SUB[cur]?`<button class="btn" data-tab="learn">← Навчання</button><h2>${SUB[cur][1]}</h2>`:`<h2>${NAV.find(n=>n[0]===cur)[1]} ${NAV.find(n=>n[0]===cur)[2]}</h2><span class="hs small">🔥 ${S.streak||0} · ⭐ ${S.xp}</span>`}else sb.hidden=true}
function drawHero(){touchDay();const h=$('#hstats');if(h)h.innerHTML=`<span>🔥 ${S.streak||0} дн.</span><span>⭐ ${S.xp} XP</span><span>📚 ${WORDS.filter(learned).length}/${WORDS.length}</span><span>${LEVELS.find(l=>l.id===S.level).e} ${S.level}</span>`}
function go(id){cur=id;try{history.replaceState(null,'','#'+id)}catch(e){}render();window.scrollTo({top:0})}
window.addEventListener('hashchange',()=>{const h=location.hash.slice(1);if(h!==cur&&VIEWS.includes(h)){cur=h;render()}});
document.addEventListener('click',e=>{
  const s=e.target.closest('[data-say]');if(s){e.stopPropagation();say(s.dataset.say,{voice:s.dataset.voice,rate:s.dataset.rate?+s.dataset.rate:undefined,btn:s.classList.contains('speak')?s:null});return}
  const t=e.target.closest('[data-tab]');if(t){go(t.dataset.tab);return}
  const g=e.target.closest('[data-go]');if(g){go(g.dataset.go);return}
});
function render(){stopSpeech();if(micStop)micStop();DS.talk=null;closePop();drawNav();drawHero();({home:vHome,learn:vLearn,words:vWords,sounds:vSounds,reading:vReading,grammar:vGrammar,hacks:vHacks,dialogs:vDialogs,quiz:vQuiz,progress:vProgress})[cur]()}

/* ---------- home ---------- */
function lvStats(lv){
  const ws=WORDS.filter(w=>lvOf(w.cat)===lv),ds=ALLD.map((d,i)=>[d,i]).filter(([d])=>d.lv===lv),ts=TEXTS.filter(t=>t.lv===lv),gs=GRAMMAR2.map((g,i)=>[g,i]).filter(([g])=>g.lv===lv);
  return {w:[ws.filter(learned).length,ws.length],d:[ds.filter(([d,i])=>S.ddone[i]).length,ds.length],t:[ts.filter(t=>S.read[t.id]).length,ts.length],g:[gs.filter(([g,i])=>S.gdone[i]).length,gs.length]};
}
function vHome(){
  touchDay();
  const wod=WORDS[hashStr(today())%WORDS.length];
  const due=WORDS.filter(isDue).length;
  const pct=Math.min(100,Math.round(S.done.n/S.goal*100));
  const st=lvStats(S.level);const tot=(st.w[0]/st.w[1]+st.d[0]/st.d[1]+st.t[0]/st.t[1]+st.g[0]/st.g[1])/4;
  const hack=HACKS[hashStr(today()+'h')%HACKS.length];
  $('#view').innerHTML=`
  <section class="card">
    <h2>Мій рівень</h2>
    <div class="lvgrid">${LEVELS.map(l=>`<button class="lvcard ${S.level===l.id?'on':''}" data-setlv="${l.id}"><span class="e">${l.e}</span><b>${l.n}</b><span class="small">${l.d}</span></button>`).join('')}</div>
  </section>
  <section class="card" style="background:linear-gradient(135deg,var(--green-soft),var(--blue-soft))">
    <div class="row" style="justify-content:space-between"><h2>${LEVELS.find(l=>l.id===S.level).e} Шлях рівня ${S.level}</h2><span class="pill ok">${Math.round(tot*100)}%</span></div>
    <div class="bar"><i style="width:${tot*100}%"></i></div>
    <div class="path">
      ${[['🃏','Слова',st.w,'words'],['💬','Діалоги',st.d,'dialogs'],['📖','Тексти',st.t,'reading'],['📘','Граматика',st.g,'grammar']].map(([e,n,[a,b],go])=>`<button class="pstep ${a>=b?'done':''}" data-go="${go}"><span class="e">${a>=b?'✅':e}</span><b>${n}</b><span class="small">${a} / ${b}</span></button>`).join('')}
    </div>
    ${tot>=1?`<div class="tipbox"><b>🏅 Рівень ${S.level} пройдено!</b> Переходь на наступний.</div>`:''}
  </section>
  <section class="card">
    <div class="row" style="flex-wrap:nowrap;gap:16px">
      <div class="ring" style="--p:${pct}"><div>${pct}%</div></div>
      <div style="min-width:0;display:grid;gap:6px"><h2>Ціль на сьогодні</h2><div class="small muted">${S.done.n} з ${S.goal} вправ · ${S.xp} XP</div><div class="row"><span class="pill fire">🔥 ${S.streak||0} дн.</span>${due?`<span class="pill">🔁 ${due} на повторення</span>`:''}</div></div>
    </div>
    <div class="row"><button class="btn primary" id="startDue">${due?`🔁 Повторити (${due})`:'✨ Нові слова'}</button><button class="btn sunny" data-go="reading">📖 Читати</button><button class="btn" data-go="dialogs">🎤 Говорити</button></div>
  </section>
  <section class="card" style="background:linear-gradient(135deg,var(--sun-soft),var(--pink-soft))">
    <div class="label">Слово дня</div>
    <div class="row" style="flex-wrap:nowrap;gap:14px"><div class="q-pic" style="font-size:56px">${wod.em}</div><div style="min-width:0;flex:1"><div class="q-big" style="text-align:left;padding:0">${artHTML(wod.nl)}</div><div style="font-weight:800">${esc(wod.uk)}</div></div>${spkBtn(wod.nl)}</div>
  </section>
  <section class="card"><div class="label">💡 Лайфхак дня</div><h3>${esc(hack[0])}</h3><div>${esc(hack[1])}</div></section>`;
  $('#startDue').onclick=()=>{wordsState.cat=due?'__due':'__new';buildDeck();go('words')};
  document.querySelectorAll('[data-setlv]').forEach(b=>b.onclick=()=>{S.level=b.dataset.setlv;save();toast('Рівень: '+S.level);vHome();drawHero()});
}

/* ---------- learn hub ---------- */
function vLearn(){
  const tiles=[['words','🃏','Слова',`${WORDS.length} слів з картинками`,'c0'],['sounds','🔤','Звуки й букви','Як пишеться і як читається','c1'],['reading','📖','Читання',`${TEXTS.length} текстів по 5 хвилин`,'c2'],['grammar','📘','Граматика',`${GRAMMAR2.length} тем простими словами`,'c3'],['hacks','💡','Лайфхаки','Як вчити швидше','c4'],['quiz','🎯','Тренажер','Перевір себе','c5']];
  $('#view').innerHTML=`<div class="hub">${tiles.map(([id,e,n,d,c])=>`<button class="hubtile ${c}" data-go="${id}"><span class="e">${e}</span><b>${n}</b><span class="small">${d}</span></button>`).join('')}</div>`;
}

/* ---------- words / flashcards ---------- */
const wordsState={cat:'__new',dir:'nl',q:[],i:0,flipped:false,search:'',lv:null};
function lvWords(){const f=wordsState.lv||S.level;return WORDS.filter(w=>inLv(lvOf(w.cat),f))}
function buildDeck(){
  let pool;const c=wordsState.cat;
  if(c==='__due')pool=WORDS.filter(isDue);
  else if(c==='__new')pool=lvWords().filter(w=>S.box[w.id]===undefined).slice(0,15);
  else if(c==='__all')pool=shuffle(lvWords()).slice(0,25);
  else pool=WORDS.filter(w=>w.cat===c);
  wordsState.q=c==='__new'?pool:shuffle(pool);wordsState.i=0;wordsState.flipped=false;
}
function vWords(){
  const f=wordsState.lv||S.level;
  if(!wordsState.q.length||wordsState.i>=wordsState.q.length)buildDeck();
  const cats=CATS.filter(c=>inLv(lvOf(c),f));
  const opts=[['__new','✨ Нові (15)'],['__due','🔁 На повторення ('+WORDS.filter(isDue).length+')'],['__all','🎲 Мікс']].concat(cats.map(c=>[c,CATEMO[c]+' '+c]));
  $('#view').innerHTML=`
  <section class="card">
    ${lvChips(f,'wlv')}
    <div class="row"><select id="cat" aria-label="Набір слів" style="flex:1;min-width:0">${opts.map(([v,n])=>`<option value="${esc(v)}" ${v===wordsState.cat?'selected':''}>${esc(n)}</option>`).join('')}</select>
    <button class="btn" id="dir">${wordsState.dir==='nl'?'🇳🇱 → 🇺🇦':'🇺🇦 → 🇳🇱'}</button></div>
    <div id="cardArea"></div>
  </section>
  <section class="card"><h2>Теми</h2>
    <div class="tiles">${cats.map(c=>{const ws=WORDS.filter(w=>w.cat===c);const l=ws.filter(learned).length;return `<button class="tilebtn c${catIdx(c)}" data-cat="${esc(c)}"><span class="e">${CATEMO[c]}</span><span>${esc(c)}</span><span class="small muted">${lvOf(c)} · ${l}/${ws.length}</span><span class="bar"><i style="width:${l/ws.length*100}%"></i></span></button>`}).join('')}</div>
  </section>
  <section class="card"><div class="row" style="justify-content:space-between"><h2>📖 Словник</h2><span class="small muted">${WORDS.length} слів</span></div>
    <input type="search" id="search" placeholder="Пошук нідерландською чи українською" value="${esc(wordsState.search)}" aria-label="Пошук слова">
    <div class="list" id="dict"></div></section>`;
  bindChips('wlv',l=>{wordsState.lv=l;if(!wordsState.cat.startsWith('__')&&!inLv(lvOf(wordsState.cat),l))wordsState.cat='__new';buildDeck();vWords()});
  $('#cat').onchange=e=>{wordsState.cat=e.target.value;buildDeck();drawCard()};
  $('#dir').onclick=()=>{wordsState.dir=wordsState.dir==='nl'?'uk':'nl';wordsState.flipped=false;vWords()};
  $('#search').oninput=e=>{wordsState.search=e.target.value;drawDict()};
  document.querySelectorAll('[data-cat]').forEach(b=>b.onclick=()=>{wordsState.cat=b.dataset.cat;$('#cat').value=b.dataset.cat;buildDeck();drawCard();$('#cardArea').scrollIntoView({behavior:reduced?'auto':'smooth',block:'center'})});
  drawCard();drawDict();
}
function drawCard(anim){
  const a=$('#cardArea');if(!a)return;const st=wordsState;
  if(!st.q.length){a.innerHTML=`<div class="flipwrap in"><div class="flipper" style="cursor:default"><div class="face front"><div><div class="pic">🎉</div><div class="word">Klaar!</div><div class="hint">${st.cat==='__due'?'Немає слів на повторення. Приходь завтра або вчи нові.':'У цьому наборі вже немає нових слів. Обери тему нижче.'}</div></div></div></div></div>`;return}
  if(st.i>=st.q.length){confetti(70);a.innerHTML=`<div class="flipwrap in"><div class="flipper" style="cursor:default"><div class="face front"><div><div class="pic">🏆</div><div class="word">Goed gedaan!</div><div class="tr">Набір пройдено: ${st.q.length} карток</div><div class="row" style="justify-content:center;margin-top:14px"><button class="btn primary" id="again">Ще набір</button><button class="btn sunny" data-go="quiz">🎯 Перевірити</button></div></div></div></div></div>`;$('#again').onclick=()=>{buildDeck();drawCard()};return}
  const w=st.q[st.i];const nlF=st.dir==='nl';const b=S.box[w.id];
  a.innerHTML=`
  <div class="row" style="justify-content:space-between"><span class="small muted">${st.i+1} / ${st.q.length} · ${CATEMO[w.cat]} ${esc(w.cat)}</span><span class="pill ${b>=3?'ok':''}">${b===undefined?'✨ нове':'рівень '+b}</span></div>
  <div class="bar" style="height:8px"><i style="width:${st.i/st.q.length*100}%"></i></div>
  <div class="flipwrap in" id="fw"><div class="flipper ${st.flipped?'flipped':''}" id="flip" tabindex="0" role="button" aria-label="Перевернути картку">
    <div class="face front"><span class="spk">${spkBtn(w.nl)}</span><div><div class="pic">${w.em}</div><div class="word">${nlF?artHTML(w.nl):esc(w.uk)}</div><div class="hint">👆 Торкнись, щоб перевернути</div></div></div>
    <div class="face back"><span class="spk">${spkBtn(w.nl)}</span><div><div class="pic">${w.em}</div><div class="word">${nlF?esc(w.uk):artHTML(w.nl)}</div><div class="tr muted">${nlF?artHTML(w.nl):esc(w.uk)}</div>${w.hint?`<div class="hint">💡 ${esc(w.hint)}</div>`:''}</div></div>
  </div></div>
  <div class="row" style="justify-content:center" id="cbtns"></div>`;
  const btns=()=>{$('#cbtns').innerHTML=st.flipped?`<button class="btn bad" id="no">🔁 Ще раз</button><button class="btn good" id="yes">✅ Знаю</button>`:`<button class="btn primary" id="show">Показати переклад</button>`;
    if($('#show'))$('#show').onclick=flip;
    if($('#yes'))$('#yes').onclick=e=>{grade(w,true);xpFloat(e.currentTarget,'+10');next('out-r')};
    if($('#no'))$('#no').onclick=()=>{grade(w,false);st.q.push(w);next('out-l')}};
  const flip=()=>{st.flipped=!st.flipped;$('#flip').classList.toggle('flipped',st.flipped);if(st.flipped)say(w.nl,{auto:true});btns()};
  const next=cls=>{const fw=$('#fw');if(reduced){st.i++;st.flipped=false;drawCard();return}fw.classList.remove('in');void fw.offsetWidth;fw.classList.add(cls);setTimeout(()=>{st.i++;st.flipped=false;drawCard()},300)};
  $('#flip').onclick=flip;$('#flip').onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();flip()}};
  btns();
}
function drawDict(){
  const q=norm(wordsState.search||'');
  const list=WORDS.filter(w=>!q||norm(w.nl).includes(q)||w.uk.toLowerCase().includes(q));
  $('#dict').innerHTML=list.length?list.map(w=>`<div class="li"><span class="em">${w.em}</span><div class="nl">${artHTML(w.nl)}</div><div class="uk">${esc(w.uk)}</div>${learned(w)?'<span class="pill ok">✓</span>':''}${spkBtn(w.nl)}</div>`).join(''):'<div class="li muted">Нічого не знайдено</div>';
}

/* ---------- sounds & letters ---------- */
function vSounds(){
  const ex=(w)=>w.replace(/-/g,'');
  $('#view').innerHTML=`
  <section class="card"><div class="small muted">Торкнись будь-якої букви чи слова, щоб почути. Внизу — гра «Вгадай звук».</div>
    <label class="small" for="rate" style="font-weight:800">Швидкість: <span id="rv">${S.rate.toFixed(2)}</span></label><input type="range" id="rate" min="0.6" max="1.2" step="0.05" value="${S.rate}" style="width:100%;accent-color:var(--pink)">
    <button class="btn primary" id="sq">🎧 Гра «Вгадай звук»</button><div id="sqArea"></div></section>
  <section class="card"><h2>🔤 Абетка</h2><div class="small muted">Як називаються букви (знадобиться, щоб продиктувати прізвище чи адресу).</div>
    <div class="abc">${ALPHABET.map(([L,r])=>`<button class="abcb" data-say="${L}"><b>${L}${L.toLowerCase()}</b><span>${esc(r)}</span></button>`).join('')}</div></section>
  ${PHONICS.map((g,gi)=>`<section class="card"><h2>${g.e} ${esc(g.g)}</h2><div class="small muted">${esc(g.d)}</div>
    <div class="ph">${g.items.map(it=>`<div class="phi"><div class="phw">${esc(it.w)}</div><div style="min-width:0;display:grid;gap:6px"><div><b>Читається:</b> ${esc(it.r)}</div>
      <div class="row">${it.ex.map(([w,uk])=>`<button class="chip" data-say="${esc(ex(w))}">🔊 ${esc(w)} <span class="muted small">— ${esc(uk)}</span></button>`).join('')}</div>
      ${it.tip?`<div class="small tipbox">💡 ${esc(it.tip)}</div>`:''}</div></div>`).join('')}</div></section>`).join('')}
  <section class="card" style="background:linear-gradient(135deg,var(--orange-soft),var(--pink-soft))"><h2>🌀 Скоромовки</h2>
    <div class="ex">${spkBtn('Achtentachtig angstige agenten aten achtentachtig ananassen')}<div><div class="nl">Achtentachtig angstige agenten aten achtentachtig ananassen.</div><div class="small muted">88 наляканих поліцейських з'їли 88 ананасів. Тренує горлове g/ch.</div></div></div>
    <div class="ex">${spkBtn('Scheveningen')}<div><div class="nl">Scheveningen</div><div class="small muted">Курорт біля Гааги. Слово, яке видає іноземця за секунду.</div></div></div></section>`;
  $('#rate').oninput=e=>{S.rate=+e.target.value;$('#rv').textContent=S.rate.toFixed(2);save()};
  $('#sq').onclick=soundQuiz;
}
function soundQuiz(){
  const g=PHONICS[Math.floor(Math.random()*PHONICS.length)];const it=g.items[Math.floor(Math.random()*g.items.length)];
  const [w,uk]=it.ex[Math.floor(Math.random()*it.ex.length)];const word=w.replace(/-/g,'');
  const opts=shuffle([it,...shuffle(g.items.filter(x=>x!==it)).slice(0,2)]);
  const A=$('#sqArea');
  A.innerHTML=`<div class="q-big" style="font-size:1.1rem">Яке буквосполучення ти чуєш?</div><div class="row" style="justify-content:center"><button class="btn primary" id="sqp">${SPK} Слухати</button><button class="btn" data-say="${esc(word)}" data-rate="0.7">🐢</button></div><div class="opts">${opts.map(o=>`<button class="opt" data-a="${o===it}" style="text-align:center;font-family:var(--f-display)">${esc(o.w)}</button>`).join('')}</div><div id="sqf" class="feedback"></div>`;
  $('#sqp').onclick=()=>say(word);say(word,{auto:true});
  A.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{if(A.dataset.done==='1')return;A.dataset.done='1';const ok=b.dataset.a==='true';A.querySelectorAll('.opt').forEach(x=>{if(x.dataset.a==='true')x.classList.add('right')});if(!ok)b.classList.add('wrong');else{credit(5);xpFloat(b,'+5')}
    $('#sqf').className='feedback '+(ok?'ok':'no');$('#sqf').innerHTML=`${ok?'🎉 Так!':'😅 Ні.'} Слово: <b>${esc(w)}</b> — ${esc(uk)} <button class="btn" id="sqn">Далі →</button>`;$('#sqn').onclick=()=>{A.dataset.done='0';soundQuiz()}});
  A.dataset.done='0';
}

/* ---------- reading ---------- */
const RS={id:null,trans:false,lv:null};
const tok=s=>s.match(/'s|[A-Za-zÀ-ÿ]+(?:'s)?|[^A-Za-zÀ-ÿ']+|'/g)||[];
const isW=t=>/[A-Za-zÀ-ÿ]/.test(t);
function vReading(){
  if(RS.id===null){
    const f=RS.lv||S.level;
    $('#view').innerHTML=`<section class="card"><div class="small muted">Тексти по рівнях, кожен приблизно на 5 хвилин. Торкнись будь-якого слова — почуєш вимову і побачиш переклад.</div>${lvChips(f,'rlv')}</section>
    <div class="grid2">${TEXTS.filter(t=>inLv(t.lv,f)).map((t,i)=>{const n=t.p.flat().reduce((s,[nl])=>s+nl.split(/\s+/).length,0);return `<button class="card dlg-card c${TEXTS.indexOf(t)%6}" data-t="${t.id}"><span class="e">${t.e}</span><span class="label">${t.lv} · ${n} слів · ≈5 хв ${S.read[t.id]?'· ✅':''}</span><h3>${esc(t.t)}</h3><span class="muted small">${esc(t.uk)}</span></button>`}).join('')}</div>`;
    bindChips('rlv',l=>{RS.lv=l;vReading()});
    document.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{RS.id=b.dataset.t;vReading();window.scrollTo({top:0})});return;
  }
  const t=TEXTS.find(x=>x.id===RS.id);let si=0;
  $('#view').innerHTML=`<section class="card">
    <div class="row" style="justify-content:space-between"><button class="btn" id="rback">← Усі тексти</button><span class="pill">${t.lv}</span></div>
    <div class="row" style="flex-wrap:nowrap;gap:12px"><span style="font-size:2.4rem">${t.e}</span><div><h2>${esc(t.t)}</h2><div class="muted">${esc(t.uk)}</div></div></div>
    <div class="row"><button class="btn primary" id="rplay">${SPK} Слухати весь текст</button><button class="btn" id="rtr">${RS.trans?'🙈 Сховати':'👀 Показати'} переклад</button></div>
    <div class="small muted">👆 Торкнись слова — вимова й переклад. ▶ біля речення — прослухати речення.</div>
    <div class="rtext">${t.p.map(par=>`<div class="par">${par.map(([nl,uk])=>{const idx=si++;return `<div class="sen" data-si="${idx}"><button class="sp" data-say="${esc(nl)}" aria-label="Прослухати речення">▶</button><div style="min-width:0"><div class="snl">${tok(nl).map(x=>isW(x)?`<span class="tw" data-w="${esc(x.toLowerCase())}">${esc(x)}</span>`:esc(x)).join('')}</div>${RS.trans?`<div class="suk">${esc(uk)}</div>`:''}</div></div>`}).join('')}</div>`).join('')}</div>
  </section>
  <section class="card"><h2>❓ Чи все зрозуміло?</h2>${t.q.map((q,qi)=>`<div><div style="font-weight:800;margin-bottom:6px">${qi+1}. ${esc(q.q)}</div><div class="opts">${q.o.map((o,k)=>`<button class="opt rq" data-q="${qi}" data-k="${k}">${esc(o)}</button>`).join('')}</div></div>`).join('')}
  <button class="btn good" id="rdone">${S.read[t.id]?'✅ Прочитано':'✅ Позначити як прочитано (+20 XP)'}</button></section>`;
  $('#rback').onclick=()=>{RS.id=null;vReading()};
  $('#rtr').onclick=()=>{RS.trans=!RS.trans;vReading()};
  document.querySelectorAll('.tw').forEach(el=>el.onclick=e=>{e.stopPropagation();const w=el.dataset.w;if(w!=="'s")say(w);showPop(el,el.textContent,GLOSS.get(w)||findUk(w)||'—')});
  document.querySelectorAll('.rq').forEach(b=>b.onclick=()=>{const q=t.q[+b.dataset.q];const sib=document.querySelectorAll(`.rq[data-q="${b.dataset.q}"]`);if([...sib].some(x=>x.classList.contains('right')))return;sib.forEach(x=>{if(+x.dataset.k===q.a)x.classList.add('right')});if(+b.dataset.k!==q.a)b.classList.add('wrong');else credit(3)});
  $('#rdone').onclick=e=>{if(!S.read[t.id]){S.read[t.id]=1;credit(20);xpFloat(e.currentTarget,'+20');confetti(60);save()}e.currentTarget.textContent='✅ Прочитано'};
  const sens=t.p.flat();
  $('#rplay').onclick=()=>{
    if(RS.playing){RS.playing=false;stopSpeech();$('#rplay').innerHTML=SPK+' Слухати весь текст';document.querySelectorAll('.sen.playing').forEach(x=>x.classList.remove('playing'));return}
    RS.playing=true;$('#rplay').innerHTML='⏸ Зупинити';let k=0;const run=Date.now();RS.run=run;
    const nx=()=>{if(!RS.playing||RS.run!==run||cur!=='reading')return;document.querySelectorAll('.sen.playing').forEach(x=>x.classList.remove('playing'));if(k>=sens.length){RS.playing=false;$('#rplay').innerHTML=SPK+' Слухати весь текст';return}
      const el=document.querySelector(`.sen[data-si="${k}"]`);el.classList.add('playing');el.scrollIntoView({behavior:reduced?'auto':'smooth',block:'center'});
      say(sens[k][0],{queue:true,onend:()=>{k++;setTimeout(nx,300)}})};
    nx();
  };
}
function findUk(w){const x=WORDS.find(v=>norm(v.nl)===w||v.nl.toLowerCase()===w);return x&&x.uk}
function showPop(el,word,tr){closePop();const r=el.getBoundingClientRect();const p=document.createElement('div');p.className='pop';p.id='pop';p.innerHTML=`<b>${esc(word)}</b> — ${esc(tr)}`;document.body.appendChild(p);
  const pw=p.offsetWidth;let x=Math.min(Math.max(8,r.left+r.width/2-pw/2),innerWidth-pw-8);let y=r.top-p.offsetHeight-8;if(y<8)y=r.bottom+8;p.style.left=x+'px';p.style.top=y+'px'}
function closePop(){const p=document.getElementById('pop');if(p)p.remove()}
document.addEventListener('scroll',closePop,{passive:true});
document.addEventListener('click',e=>{if(!e.target.closest('.tw'))closePop()});

/* ---------- grammar ---------- */
const GS={lv:null};
function vGrammar(){
  const f=GS.lv||S.level;
  $('#view').innerHTML=`<section class="card"><div class="small">Кожна тема: <b>простими словами</b> → правило → приклади з озвучкою → <b>типова помилка</b> → лайфхак → тест.</div>${lvChips(f,'glv')}</section>
  ${GRAMMAR2.map((g,i)=>[g,i]).filter(([g])=>inLv(g.lv,f)).sort((a,b)=>LVO[a[0].lv]-LVO[b[0].lv]).map(([g,i],n)=>`<details class="g" ${n===0?'open':''}><summary><span class="e">${g.e}</span><span style="flex:1">${esc(g.t)}</span>${S.gdone[i]?'<span class="pill ok">✓</span>':`<span class="pill">${g.lv}</span>`}</summary><div class="gb">
    <div class="simple"><b>Простими словами:</b> ${g.simple}</div>
    <div class="scroll">${g.rules}</div>${g.verbs?verbTable(g.verbs):''}
    <div class="label">🔊 Приклади</div>
    ${g.ex.map(([nl,uk])=>`<div class="ex">${spkBtn(nl)}<div style="min-width:0"><div class="nl">${esc(nl)}</div><div class="small muted">${esc(uk)}</div></div></div>`).join('')}
    <div class="mist"><div>❌ <s>${esc(g.mistake[0])}</s></div><div>✅ <b>${esc(g.mistake[1])}</b> ${spkBtn(g.mistake[1])}</div><div class="small muted">${esc(g.mistake[2])}</div></div>
    <div class="tipbox"><b>💡 Лайфхак:</b> ${g.tip}</div>
    <div class="label">✏️ Перевір себе</div>
    ${g.q.map((q,qi)=>`<div><div style="margin-bottom:6px;font-weight:700">${esc(q.q)}</div><div class="opts">${q.o.map((o,k)=>`<button class="opt gq" data-g="${i}" data-qi="${qi}" data-k="${k}">${esc(o)}</button>`).join('')}</div></div>`).join('')}
  </div></details>`).join('')}`;
  bindChips('glv',l=>{GS.lv=l;vGrammar()});
  document.querySelectorAll('.gq').forEach(b=>b.onclick=()=>{
    const gi=+b.dataset.g,qi=+b.dataset.qi,q=GRAMMAR2[gi].q[qi];const sib=document.querySelectorAll(`.gq[data-g="${gi}"][data-qi="${qi}"]`);
    if([...sib].some(x=>x.classList.contains('right')))return;
    sib.forEach(x=>{if(+x.dataset.k===q.a)x.classList.add('right')});
    if(+b.dataset.k!==q.a){b.classList.add('wrong');S.gfail=S.gfail||{};S.gfail[gi]=1}else{credit(5);xpFloat(b,'+5');const r=b.getBoundingClientRect();confetti(20,r.left+r.width/2,r.top)}
    const all=document.querySelectorAll(`.gq[data-g="${gi}"].right`).length;if(all===GRAMMAR2[gi].q.length){S.gdone[gi]=1;save()}
  });
}

function verbTable(v){return `<div class="scroll"><table class="gt vt"><tr><th></th><th>Інфінітив</th><th>Минулий</th><th>Perfectum</th><th>UA</th></tr>${v.map(r=>`<tr><td><button class="sp" data-say="${esc(r[0]+', '+r[1]+', '+r[2])}" aria-label="Слухати ${esc(r[0])}">▶</button></td><td><b>${esc(r[0])}</b></td><td>${esc(r[1])}</td><td>${esc(r[2])}</td><td class="muted">${esc(r[3])}</td></tr>`).join('')}</table></div><button class="btn sunny" data-qmode="verbs">🎯 Тренувати неправильні дієслова</button>`}
document.addEventListener('click',e=>{const b=e.target.closest('[data-qmode]');if(b){go('quiz');startQuiz(b.dataset.qmode)}});
const VERBS=GRAMMAR2.filter(g=>g.verbs).flatMap(g=>g.verbs);
/* ---------- hacks ---------- */
const HEMO=['🏷️','⏱️','🔁','🗣️','👥','🌍','📝','📱','📻','🙌','🧩','🤪','⏲️'];
function vHacks(){
  $('#view').innerHTML=`<div class="grid2">${HACKS.map((h,i)=>`<section class="card"><div class="row" style="flex-wrap:nowrap;gap:12px;align-items:flex-start"><div class="c${i%6}" style="width:48px;height:48px;border-radius:14px;display:grid;place-items:center;font-size:24px;flex:none">${HEMO[i]||'💡'}</div><div><h3>${esc(h[0])}</h3><div class="small">${esc(h[1])}</div></div></div></section>`).join('')}</div>
  <section class="card"><h2>🪤 Фальшиві друзі</h2><div class="small muted">Слова, що звучать знайомо, але означають інше.</div>
  <div class="scroll"><table class="ff">${FALSE_FRIENDS.map(f=>`<tr><td>${spkBtn(f[0])} ${artHTML(f[0])}</td><td>${esc(f[1])}</td><td class="muted">${esc(f[2])}</td></tr>`).join('')}</table></div></section>
  <section class="card"><h2>🧰 Набір виживання</h2>
  ${[['Ik wil graag ...','Я б хотів ...'],['Mag ik ...?','Можна мені ...?'],['Hoeveel kost het?','Скільки коштує?'],['Waar is ...?','Де ...?'],['Kunt u dat herhalen?','Можете повторити?'],['Kunt u langzamer praten?','Можете говорити повільніше?'],['Hoe zeg je ... in het Nederlands?','Як сказати ... нідерландською?'],['Wat betekent dat?','Що це означає?'],['Ik spreek een beetje Nederlands.','Я трохи говорю нідерландською.'],['Ik wil graag Nederlands oefenen.','Я хочу попрактикувати нідерландську.']].map(([nl,uk])=>`<div class="ex">${spkBtn(nl)}<div><div class="nl">${esc(nl)}</div><div class="small muted">${esc(uk)}</div></div></div>`).join('')}</section>`;
}

/* ---------- dialogs with microphone ---------- */
const DS={i:null,trans:true,role:null,lv:null,talk:null};
function vDialogs(){
  if(DS.i===null){
    const f=DS.lv||S.level;
    $('#view').innerHTML=`<section class="card"><div class="small muted">Побутові ситуації. Слухай, а потім натисни <b>🎤 Говорити</b>: ти береш роль, кажеш свою репліку в мікрофон — якщо правильно, розмова йде далі, якщо ні — повторюєш.</div>${lvChips(f,'dlv')}</section>
    <div class="grid2">${ALLD.map((d,i)=>[d,i]).filter(([d])=>inLv(d.lv,f)).map(([d,i])=>`<button class="card dlg-card c${i%6}" data-d="${i}"><span class="e">${d.e}</span><span class="label">${d.lv} · ${d.lines.length} реплік ${S.ddone[i]?'· ✅':''}</span><h3>${esc(d.t)}</h3><span class="muted small">${esc(d.uk)}</span></button>`).join('')}</div>`;
    bindChips('dlv',l=>{DS.lv=l;vDialogs()});
    document.querySelectorAll('[data-d]').forEach(b=>b.onclick=()=>{DS.i=+b.dataset.d;DS.role=null;vDialogs();window.scrollTo({top:0})});return;
  }
  const d=ALLD[DS.i];const T=DS.talk;
  $('#view').innerHTML=`<section class="card">
    <div class="row" style="justify-content:space-between"><button class="btn" id="back">← Усі діалоги</button><span class="pill">${d.lv}</span></div>
    <div class="row" style="flex-wrap:nowrap;gap:12px"><span style="font-size:2.4rem">${d.e}</span><div><h2>${esc(d.t)}</h2><div class="muted">${esc(d.uk)}</div></div></div>
    <div class="row">
      <button class="btn primary" id="playAll">${SPK} Прослухати</button>
      <button class="btn bad" id="talkA">🎤 Говорити за 👩 A</button>
      <button class="btn bad" id="talkB">🎤 Говорити за 👨 B</button>
      <button class="btn" id="tr">${DS.trans?'🙈':'👀'} Переклад</button>
    </div>
    <div class="chat" id="lines">${d.lines.map(([who,nl,uk],k)=>{const mine=T&&T.role===who;const hide=mine&&k>=T.k&&!(T.revealed&&k===T.k);return `<div class="line ${who} ${T&&k===T.k?'playing':''} ${T&&T.okLines&&T.okLines[k]?'okline':''}" data-k="${k}"><span class="ava">${who==='A'?'👩':'👨'}</span><div class="bubble"><div style="min-width:0;flex:1"><div class="nl ${hide?'hidden-text':''}">${esc(nl)}</div>${DS.trans||mine?`<div class="uk">${esc(uk)}</div>`:''}</div>${hide?'':spkBtn(nl,nl,who==='A'?'f':'m')}</div></div>`}).join('')}</div>
    <div id="talkPanel"></div>
    <div class="tipbox"><b>💡 Корисно:</b> ${esc(d.tip)}</div>
    <div class="row"><button class="btn" id="prev" ${DS.i?'':'disabled'}>← Попередній</button><button class="btn" id="nextD" ${DS.i<ALLD.length-1?'':'disabled'}>Наступний →</button></div>
  </section>`;
  $('#back').onclick=()=>{DS.i=null;DS.talk=null;stopSpeech();vDialogs()};
  $('#tr').onclick=()=>{DS.trans=!DS.trans;vDialogs();if(DS.talk)talkPanel()};
  $('#prev').onclick=()=>{DS.i--;DS.talk=null;vDialogs()};$('#nextD').onclick=()=>{DS.i++;DS.talk=null;vDialogs()};
  $('#talkA').onclick=()=>startTalk('A');$('#talkB').onclick=()=>startTalk('B');
  $('#playAll').onclick=()=>{
    DS.talk=null;stopSpeech();let k=0;const run=Date.now();DS.run=run;const L=()=>document.querySelectorAll('.line');
    const next=()=>{if(DS.run!==run||cur!=='dialogs')return;L().forEach(x=>x.classList.remove('playing'));if(k>=d.lines.length)return;
      const [who,nl]=d.lines[k];const el=L()[k];el.classList.add('playing');el.scrollIntoView({behavior:reduced?'auto':'smooth',block:'nearest'});
      say(nl,{queue:true,voice:who==='A'?'f':'m',onend:()=>{k++;setTimeout(next,350)}})};
    next();
  };
  if(T)talkPanel();
}
function startTalk(role){stopSpeech();DS.run=0;DS.talk={role,k:0,tries:0,okLines:{},revealed:false,score:0,mine:0};vDialogs();talkStep()}
function talkStep(){
  const T=DS.talk;if(!T||cur!=='dialogs'||!$('#talkPanel'))return;const d=ALLD[DS.i];
  if(T.k>=d.lines.length){const sc=T.mine?Math.round(T.score/T.mine*100):100;$('#talkPanel').innerHTML=`<div class="talk done"><div class="q-pic">🎉</div><h3>Розмову завершено!</h3><div>Твій результат: <b>${sc}%</b></div><div class="row" style="justify-content:center"><button class="btn primary" id="tAgain">🔁 Ще раз</button><button class="btn" id="tOther">🎭 Інша роль</button></div></div>`;
    if(!S.ddone[DS.i]){S.ddone[DS.i]=1;save()}credit(15);confetti(80);
    $('#tAgain').onclick=()=>startTalk(T.role);$('#tOther').onclick=()=>startTalk(T.role==='A'?'B':'A');
    document.querySelectorAll('.line.playing').forEach(x=>x.classList.remove('playing'));return}
  const [who,nl]=d.lines[T.k];
  document.querySelectorAll('.line').forEach((x,i)=>x.classList.toggle('playing',i===T.k));
  const el=document.querySelector(`.line[data-k="${T.k}"]`);el&&el.scrollIntoView({behavior:reduced?'auto':'smooth',block:'center'});
  if(who!==T.role){$('#talkPanel').innerHTML=`<div class="talk"><div class="muted">🔊 Співрозмовник говорить…</div></div>`;
    say(nl,{voice:who==='A'?'f':'m',onend:()=>{if(DS.talk===T){T.k++;T.tries=0;T.revealed=false;talkStep()}}});return}
  T.mine++;talkPanel();
}
function talkPanel(msg){
  const T=DS.talk;if(!T)return;const d=ALLD[DS.i];if(T.k>=d.lines.length)return;const [who,nl,uk]=d.lines[T.k];if(who!==T.role)return;
  const mic=micAvailable();
  $('#talkPanel').innerHTML=`<div class="talk">
    <div class="label">Твоя черга (${who==='A'?'👩 A':'👨 B'})</div>
    <div class="say-uk">«${esc(uk)}»</div>
    <div id="heard" class="heard">${msg||(T.revealed?`<div class="nl">${esc(nl)}</div>`:'<span class="muted small">Скажи це нідерландською</span>')}</div>
    ${mic?`<button class="micbtn" id="micb" aria-label="Говорити">${MIC}</button><div class="small muted" id="micst">Натисни і говори</div>`:`<div class="small muted">Мікрофон тут недоступний. Скажи фразу вголос, а тоді перевір себе.</div>`}
    <div class="row" style="justify-content:center">
      <button class="btn" id="hintb">👀 Підказка</button>
      <button class="btn" id="modelb">${SPK} Як сказати</button>
      ${!mic?`<button class="btn good" id="selfok">✅ Я сказав(ла) правильно</button>`:''}
      ${T.tries>=2||!mic?`<button class="btn" id="skipb">Пропустити →</button>`:''}
    </div></div>`;
  $('#hintb').onclick=()=>{T.revealed=true;const h=document.querySelector(`.line[data-k="${T.k}"] .nl`);h&&h.classList.remove('hidden-text');talkPanel(`<div class="nl">${esc(nl)}</div>`)};
  $('#modelb').onclick=()=>say(nl,{voice:who==='A'?'f':'m'});
  if($('#skipb'))$('#skipb').onclick=()=>advance(false);
  if($('#selfok'))$('#selfok').onclick=()=>advance(true);
  if($('#micb'))$('#micb').onclick=()=>{
    const b=$('#micb');if(b.classList.contains('on')){micStop&&micStop();return}
    stopSpeech();b.classList.add('on');$('#micst').textContent='🔴 Слухаю… говори';
    listen({onPartial:t=>{$('#heard').innerHTML=`<span class="muted">${esc(t)}</span>`},
      onDone:text=>{b.classList.remove('on');if(!text){$('#micst').textContent='Нічого не почув. Натисни і говори голосніше.';return}
        const r=compare(nl,text);
        if(r.score>=0.7){T.score+=r.score;T.okLines[T.k]=1;$('#heard').innerHTML=`<div class="nl">${markWords(nl,r)}</div><div class="feedback ok">🎉 Goed zo! ${Math.round(r.score*100)}%</div>`;$('#micst').textContent='Правильно! Ідемо далі…';xpFloat(b,'+10');const rr=b.getBoundingClientRect();confetti(24,rr.left+rr.width/2,rr.top);setTimeout(()=>advance(true,true),1300)}
        else{T.tries++;$('#heard').innerHTML=`<div class="small muted">Ти сказав(ла): «${esc(text)}»</div><div class="nl">${markWords(nl,r)}</div><div class="feedback no">🔁 Спробуй ще раз (${Math.round(r.score*100)}%). Червоні слова — пропущені.</div>`;$('#micst').textContent='Послухай і повтори';
          const h=document.querySelector(`.line[data-k="${T.k}"] .nl`);h&&h.classList.remove('hidden-text');
          say(nl,{voice:who==='A'?'f':'m',onend:()=>{if(T.tries>=2&&!$('#skipb')&&$('#modelb')){const sb=document.createElement('button');sb.className='btn';sb.id='skipb';sb.textContent='Пропустити →';sb.onclick=()=>advance(false);$('#modelb').after(sb)}}})}},
      onError:code=>{b.classList.remove('on');$('#micst').textContent=micErrText(code);if(code==='not_granted'||code==='unavailable'){DICT=null}}});
  };
}
function advance(ok,credited){const T=DS.talk;if(!T)return;if(ok&&!credited){T.score+=1;T.okLines[T.k]=1;credit(5)}else if(ok)credit(10);T.k++;T.tries=0;T.revealed=false;
  const d=ALLD[DS.i];const keep=T;vDialogs();DS.talk=keep;
  document.querySelectorAll('.line').forEach((x,i)=>{const [who]=d.lines[i];if(who===T.role&&i<T.k){const n=x.querySelector('.nl');n&&n.classList.remove('hidden-text');x.classList.toggle('okline',!!T.okLines[i])}});
  talkStep()}

/* ---------- quiz ---------- */
const QZ={mode:null,qs:[],i:0,score:0,answered:false,hint:0,cat:''};
const MODES=[
 ['choice','🖼️','Вибери переклад','Бачиш слово з картинкою — обираєш переклад.','c0'],
 ['listen','🎧','На слух','Чуєш слово — обираєш, яке прозвучало.','c1'],
 ['type','⌨️','Напиши слово','Пишеш нідерландською. Артикль можна не писати.','c2'],
 ['article','🎲','De чи het?','Гра на артиклі.','c3'],
 ['dict','📝','Диктант','Чуєш речення з діалогів і текстів — записуєш його.','c4'],
 ['gram','📘','Граматика','Питання з усіх тем граматики твого рівня.','c3'],
 ['verbs','📋','Неправильні дієслова','Обери правильну форму минулого часу.','c1'],
 ['speak','🎤','Скажи вголос','Бачиш слово — кажеш його в мікрофон, програма перевіряє вимову.','c5']
];
function vQuiz(){
  if(!QZ.mode){
    $('#view').innerHTML=`<section class="card"><div class="muted small">Раунд — 10 питань на твоєму рівні (${S.level}). Слова з помилками повертаються частіше.</div>
    <label class="label" for="qcat">Тема</label><select id="qcat"><option value="">🌈 Усі теми рівня</option>${CATS.map(c=>`<option value="${esc(c)}" ${QZ.cat===c?'selected':''}>${CATEMO[c]} ${esc(c)}</option>`).join('')}</select></section>
    ${MODES.filter(m=>m[0]!=='speak'||micAvailable()).map(([id,e,n,d,c])=>`<section class="card"><div class="mode"><div class="mi ${c}">${e}</div><div style="min-width:0;flex:1"><h3>${n}</h3><div class="small muted">${d}</div></div><button class="btn primary" data-mode="${id}">Грати</button></div></section>`).join('')}
    ${micAvailable()?'':'<div class="small muted" style="text-align:center">🎤 Режим «Скажи вголос» з\'явиться, якщо відкрити курс у Chrome.</div>'}`;
    $('#qcat').onchange=e=>QZ.cat=e.target.value;
    document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>startQuiz(b.dataset.mode));
    return;
  }
  drawQ();
}
function dictPool(){const out=[];ALLD.forEach(d=>{if(LVO[d.lv]<=LVO[S.level])d.lines.forEach(([who,nl,uk])=>{if(nl.split(' ').length<=9)out.push({nl,uk,voice:who==='A'?'f':'m'})})});TEXTS.forEach(t=>{if(LVO[t.lv]<=LVO[S.level])t.p.flat().forEach(([nl,uk])=>{if(nl.split(' ').length<=9&&!/[„”]/.test(nl))out.push({nl,uk,voice:'m'})})});return out}
function startQuiz(mode){
  let pool;
  if(mode==='gram'){pool=GRAMMAR2.filter(g=>LVO[g.lv]<=LVO[S.level]).flatMap(g=>g.q.map(q=>Object.assign({t:g.t,e:g.e},q)));Object.assign(QZ,{mode,qs:shuffle(pool).slice(0,10),i:0,score:0,answered:false,hint:0,pool});vQuiz();return}
  if(mode==='verbs'){pool=VERBS.flatMap(v=>[{v,k:2},{v,k:1}]);Object.assign(QZ,{mode,qs:shuffle(pool).slice(0,10),i:0,score:0,answered:false,hint:0,pool});vQuiz();return}
  if(mode==='dict'){pool=dictPool();Object.assign(QZ,{mode,qs:shuffle(pool).slice(0,8),i:0,score:0,answered:false,hint:0,pool});vQuiz();return}
  pool=(mode==='article'?NOUNS:WORDS).filter(w=>QZ.cat?w.cat===QZ.cat:LVO[lvOf(w.cat)]<=LVO[S.level]);
  if(pool.length<4)pool=mode==='article'?NOUNS:WORDS;
  const weak=pool.filter(w=>S.box[w.id]!==undefined&&S.box[w.id]<3);
  const qs=shuffle(weak).slice(0,4).concat(shuffle(pool)).filter((w,i,a)=>a.indexOf(w)===i).slice(0,10);
  Object.assign(QZ,{mode,qs:shuffle(qs),i:0,score:0,answered:false,hint:0,pool});
  vQuiz();
}
function distractors(w,key){return shuffle(QZ.pool.filter(x=>x!==w&&x[key]!==w[key])).slice(0,3)}
function drawQ(){
  const v=$('#view');
  if(QZ.i>=QZ.qs.length){
    const p=QZ.score/QZ.qs.length;if(p>=.6)confetti(p>=.9?120:60);
    v.innerHTML=`<section class="card" style="text-align:center;background:linear-gradient(135deg,var(--sun-soft),var(--green-soft))"><div class="q-pic">${p>=.9?'🏆':p>=.6?'🌷':'💪'}</div><div class="q-big">${Math.round(QZ.score*10)/10} / ${QZ.qs.length}</div>
    <div style="font-weight:800">${p>=.9?'Uitstekend! Відмінно!':p>=.6?'Goed zo! Добре, ще трохи практики.':'Niet erg! Повтори й спробуй ще.'}</div>
    <div class="row" style="justify-content:center"><button class="btn primary" id="rq">Ще раунд</button><button class="btn" id="bq">Інший режим</button></div></section>`;
    $('#rq').onclick=()=>startQuiz(QZ.mode);$('#bq').onclick=()=>{QZ.mode=null;vQuiz()};return;
  }
  const w=QZ.qs[QZ.i];QZ.answered=false;QZ.hint=0;
  const head=`<div class="row" style="justify-content:space-between"><span class="small muted">Питання ${QZ.i+1} / ${QZ.qs.length} · ✅ ${Math.round(QZ.score*10)/10}</span><button class="btn" id="quit">✕ Вийти</button></div><div class="bar"><i style="width:${QZ.i/QZ.qs.length*100}%"></i></div>`;
  let body='';
  if(QZ.mode==='gram'||QZ.mode==='verbs'){
    let qt,opts,ans,expl;
    if(QZ.mode==='gram'){qt=`<div class="small muted">${w.e} ${esc(w.t)}</div><div class="q-big" style="font-size:1.3rem">${esc(w.q)}</div>`;opts=w.o;ans=w.a}
    else{const v=w.v,k=w.k;const right=v[k];const others=shuffle(VERBS.filter(x=>x!==v)).slice(0,2).map(x=>x[k]);const fake=k===2?(v[2].split(' ')[0]+' ge'+v[0].replace(/en$/,'')+(k===2?'d':'')):(v[0].replace(/en$/,'')+'de');opts=shuffle([right,others[0],fake!==right?fake:others[1]]);ans=opts.indexOf(right);
      qt=`<div class="q-pic">📋</div><div class="q-big" style="font-size:1.4rem">${esc(v[0])} <span class="muted small">(${esc(v[3])})</span></div><div style="text-align:center;font-weight:800">${k===2?'Perfectum (я зробив)?':'Минулий простий (ik / wij)?'}</div>`}
    v.innerHTML=`<section class="card">${head}${qt}<div class="opts">${opts.map((o,k)=>`<button class="opt" data-k="${k}">${esc(o)}</button>`).join('')}</div><div id="fb" class="feedback" aria-live="polite"></div><div class="row" id="nextRow" hidden><button class="btn primary" id="next">Далі →</button></div></section>`;
    $('#quit').onclick=()=>{QZ.mode=null;vQuiz()};
    document.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{if(QZ.answered)return;QZ.answered=true;const ok=+b.dataset.k===ans;
      document.querySelectorAll('.opt').forEach(x=>{if(+x.dataset.k===ans)x.classList.add('right')});if(!ok)b.classList.add('wrong');else{QZ.score++;const r=b.getBoundingClientRect();confetti(24,r.left+r.width/2,r.top);xpFloat(b,'+10')}
      credit(ok?10:1);const fb=$('#fb');fb.className='feedback '+(ok?'ok':'no');
      fb.innerHTML=(ok?'🎉 Goed zo!':'😅 Ні.')+(QZ.mode==='verbs'?` <b>${esc(w.v[0])} — ${esc(w.v[1])} — ${esc(w.v[2])}</b>`:` Правильно: <b>${esc(opts[ans])}</b>`);
      if(QZ.mode==='verbs')say(w.v[0]+', '+w.v[1]+', '+w.v[2],{auto:true});
      $('#nextRow').hidden=false;$('#next').onclick=()=>{QZ.i++;drawQ()}});
    return;
  }
  if(QZ.mode==='choice'){const o=shuffle([w,...distractors(w,'uk')]);body=`<div class="q-pic">${w.em}</div><div class="row" style="justify-content:center;gap:12px"><div class="q-big">${artHTML(w.nl)}</div>${spkBtn(w.nl)}</div><div class="opts">${o.map(x=>`<button class="opt" data-a="${x===w}">${esc(x.uk)}</button>`).join('')}</div>`}
  else if(QZ.mode==='listen'){const o=shuffle([w,...distractors(w,'nl')]);body=`<div class="q-pic">🎧</div><div class="row" style="justify-content:center"><button class="btn primary" id="play">${SPK} Слухати</button><button class="btn" data-say="${esc(w.nl)}" data-rate="0.7">🐢 Повільно</button></div><div class="opts">${o.map(x=>`<button class="opt" data-a="${x===w}">${artHTML(x.nl)}</button>`).join('')}</div>`}
  else if(QZ.mode==='type'){body=`<div class="q-pic">${w.em}</div><div class="q-big">${esc(w.uk)}</div><form id="tf" class="row" style="flex-wrap:nowrap"><input type="text" id="ans" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="нідерландською…" aria-label="Відповідь"><button class="btn primary">OK</button></form>`}
  else if(QZ.mode==='article'){const m=w.nl.match(/^(de|het) (.*)$/);body=`<div class="q-pic">${w.em}</div><div class="row" style="justify-content:center;gap:12px"><div class="q-big">___ ${esc(m[2])}</div>${spkBtn(m[2])}</div><div class="small muted" style="text-align:center">${esc(w.uk)}</div><div class="opts"><button class="opt" data-a="${m[1]==='de'}" style="text-align:center;font-size:1.3rem"><span class="art-de">de</span></button><button class="opt" data-a="${m[1]==='het'}" style="text-align:center;font-size:1.3rem"><span class="art-het">het</span></button></div>`}
  else if(QZ.mode==='dict'){body=`<div class="q-pic">📝</div><div class="row" style="justify-content:center"><button class="btn primary" id="play">${SPK} Слухати</button><button class="btn" id="slow">🐢 Повільно</button></div><form id="tf" class="row" style="flex-wrap:nowrap"><input type="text" id="ans" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Запиши, що почув…" aria-label="Відповідь"><button class="btn primary">OK</button></form>`}
  else{body=`<div class="q-pic">${w.em}</div><div class="row" style="justify-content:center;gap:12px"><div class="q-big">${artHTML(w.nl)}</div>${spkBtn(w.nl)}</div><div class="small muted" style="text-align:center">${esc(w.uk)}</div><div id="heard" class="heard"></div><button class="micbtn" id="micb" aria-label="Говорити">${MIC}</button><div class="small muted" id="micst" style="text-align:center">Натисни і скажи слово</div>`}
  v.innerHTML=`<section class="card">${head}${body}<div class="row"><button class="btn sunny" id="hint">💡 Підказка</button><span id="hintText" class="small muted" style="flex:1;min-width:0"></span></div><div id="fb" class="feedback" aria-live="polite"></div><div class="row" id="nextRow" hidden><button class="btn primary" id="next">Далі →</button></div></section>`;
  $('#quit').onclick=()=>{QZ.mode=null;vQuiz()};
  if(QZ.mode==='dict'){$('#play').onclick=()=>say(w.nl,{voice:w.voice});$('#slow').onclick=()=>say(w.nl,{voice:w.voice,rate:0.7});setTimeout(()=>say(w.nl,{voice:w.voice,auto:true}),300)}
  else if($('#play')){$('#play').onclick=()=>say(w.nl);setTimeout(()=>say(w.nl,{auto:true}),300)}
  $('#hint').onclick=()=>{QZ.hint++;$('#hintText').textContent=hintFor(w,QZ.hint)};
  document.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{
    if(QZ.answered)return;const ok=b.dataset.a==='true';
    document.querySelectorAll('.opt').forEach(x=>{if(x.dataset.a==='true')x.classList.add('right')});
    if(!ok)b.classList.add('wrong');else{const r=b.getBoundingClientRect();confetti(24,r.left+r.width/2,r.top+r.height/2);xpFloat(b,QZ.hint?'+5':'+10')}
    finish(w,ok);
  });
  if($('#tf')){
    $('#ans').focus({preventScroll:true});
    $('#tf').onsubmit=e=>{e.preventDefault();if(QZ.answered)return;const raw=$('#ans').value;if(!raw.trim())return;
      if(QZ.mode==='dict'){const r=compare(w.nl,raw);QZ.answered=true;QZ.score+=r.score;credit(Math.round(r.score*10));
        $('#fb').className='feedback '+(r.score>=0.8?'ok':'no');$('#fb').innerHTML=`${r.score>=0.8?'🎉 Чудово!':'🔁 Майже.'} ${Math.round(r.score*100)}%<div class="nl" style="font-weight:700">${markWords(w.nl,r)}</div><div class="small muted">${esc(w.uk)}</div>`;
        $('#nextRow').hidden=false;$('#next').onclick=()=>{QZ.i++;drawQ()};return}
      const val=norm(raw);const target=norm(w.nl);const alts=w.nl.split('/').map(norm);
      const ok=val===target||alts.includes(val);const close=!ok&&lev(val,target)<=1;
      if(ok||close){const r=$('#ans').getBoundingClientRect();confetti(24,r.left+r.width/2,r.top);xpFloat($('#ans'),'+10')}else{$('#ans').animate([{transform:'translateX(-7px)'},{transform:'translateX(7px)'},{transform:'none'}],{duration:300,iterations:2})}
      finish(w,ok||close,close?`Майже! Правильно: ${w.nl}`:null)};
  }
  if($('#micb'))$('#micb').onclick=()=>{const b=$('#micb');if(b.classList.contains('on')){micStop&&micStop();return}stopSpeech();b.classList.add('on');$('#micst').textContent='🔴 Слухаю…';
    listen({onPartial:t=>{$('#heard').textContent=t},onDone:text=>{b.classList.remove('on');if(!text){$('#micst').textContent='Нічого не почув. Спробуй ще.';return}const r=compare(w.nl.replace(/^(de|het) /,''),text.replace(/^(de|het) /i,''));
      if(r.score>=0.7){$('#heard').innerHTML=`<span class="w-ok">${esc(text)}</span>`;confetti(24);xpFloat(b,'+10');finish(w,true)}else{$('#heard').innerHTML=`<span class="small muted">Почув: «${esc(text)}»</span>`;$('#micst').textContent='Не зовсім. Послухай і спробуй ще';say(w.nl);QZ.hint++;if(QZ.hint>=3)finish(w,false)}},
      onError:c=>{b.classList.remove('on');$('#micst').textContent=micErrText(c)}})};
}
function hintFor(w,n){
  if(QZ.mode==='dict'){const ws=w.nl.split(' ');return n===1?`${ws.length} слів. Переклад: ${w.uk}`:`Починається так: «${ws.slice(0,Math.ceil(ws.length/2)).join(' ')}…»`}
  const base=w.nl.replace(/^(de|het) /,'');
  if(QZ.mode==='article')return n===1?'Закінчується на -je? Тоді het. Множина завжди de.':(w.hint||'Приблизно 2/3 слів мають de.');
  if(n===1)return w.hint?w.hint:`Починається на «${base[0]}», ${base.length} літер`;
  if(n===2)return `Починається на «${base.slice(0,Math.ceil(base.length/2))}…»`;
  say(w.nl);return '🔊 Озвучую — слухай уважно';
}
function lev(a,b){const d=[];for(let i=0;i<=a.length;i++){d[i]=[i];for(let j=1;j<=b.length;j++)d[i][j]=i?Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]===b[j-1]?0:1)):j}return d[a.length][b.length]}
function finish(w,ok,msg){
  if(QZ.answered)return;QZ.answered=true;if(ok)QZ.score++;
  const b=S.box[w.id]||0;setBox(w,ok?Math.min(b+1,6):Math.max(0,b-1));
  credit(ok?(QZ.hint?5:10):1);
  const fb=$('#fb');fb.className='feedback '+(ok?'ok':'no');
  fb.innerHTML=(msg?'🙂 '+esc(msg):ok?'🎉 Goed zo! Правильно.':`😅 Ні. Правильно: ${artHTML(w.nl)} — ${esc(w.uk)}`)+(w.hint&&!ok?`<div class="small muted" style="font-weight:600">💡 ${esc(w.hint)}</div>`:'');
  if(QZ.mode!=='listen'&&QZ.mode!=='speak')say(w.nl,{auto:true});
  $('#nextRow').hidden=false;$('#next').focus({preventScroll:true});$('#next').onclick=()=>{QZ.i++;drawQ()};
}

/* ---------- progress ---------- */
function vProgress(){
  touchDay();
  const L=WORDS.filter(learned).length,P=WORDS.filter(w=>S.box[w.id]!==undefined&&!learned(w)).length;
  $('#view').innerHTML=`<section class="card"><h2>🏆 Мій прогрес</h2>
    <div class="grid2" style="grid-template-columns:repeat(auto-fit,minmax(130px,1fr))">
      <div class="stat c3"><span class="label">📚 Вивчено</span><span class="n">${L}</span><span class="small muted">з ${WORDS.length}</span></div>
      <div class="stat c0"><span class="label">⏳ У процесі</span><span class="n">${P}</span></div>
      <div class="stat c5"><span class="label">🔥 Серія</span><span class="n">${S.streak||0}</span><span class="small muted">днів</span></div>
      <div class="stat c2"><span class="label">⭐ Досвід</span><span class="n">${S.xp}</span><span class="small muted">XP</span></div>
    </div></section>
  ${LEVELS.map(l=>{const st=lvStats(l.id);return `<section class="card"><h2>${l.e} ${l.n}</h2>${[['🃏 Слова',st.w],['💬 Діалоги (розмова з мікрофоном)',st.d],['📖 Тексти',st.t],['📘 Граматика',st.g]].map(([n,[a,b]])=>`<div><div class="row" style="justify-content:space-between"><span class="small" style="font-weight:700">${n}</span><span class="small muted" style="font-variant-numeric:tabular-nums">${a}/${b}</span></div><div class="bar" style="height:8px"><i style="width:${b?a/b*100:0}%"></i></div></div>`).join('')}</section>`}).join('')}
  <section class="card"><h2>⚙️ Налаштування</h2>
    <label class="small" for="goal" style="font-weight:800">Денна ціль (вправ)</label><select id="goal">${[10,20,30,50].map(n=>`<option ${S.goal===n?'selected':''}>${n}</option>`).join('')}</select>
    <label class="small" for="rate2" style="font-weight:800">Швидкість вимови: <span id="rv2">${S.rate.toFixed(2)}</span></label><input type="range" id="rate2" min="0.6" max="1.2" step="0.05" value="${S.rate}" style="width:100%;accent-color:var(--pink)">
    <div class="small muted">🎧 Озвучка — природні голоси Google HD. 🎤 Мікрофон: ${micAvailable()?'доступний ✅':'недоступний у цьому вікні (відкрий курс у Chrome)'}.</div>
    <div class="row"><button class="btn primary" data-say="Hallo! Welkom bij de cursus Nederlands.">${SPK} Перевірити звук</button></div>
    <div class="row" id="resetRow"><button class="btn" id="reset">Скинути прогрес</button></div>
  </section>`;
  $('#goal').onchange=e=>{S.goal=+e.target.value;save()};
  $('#rate2').oninput=e=>{S.rate=+e.target.value;$('#rv2').textContent=S.rate.toFixed(2);save()};
  $('#reset').onclick=()=>{$('#resetRow').innerHTML='<span class="small">Точно скинути весь прогрес?</span><button class="btn bad" id="rYes">Так, скинути</button><button class="btn" id="rNo">Скасувати</button>';
    $('#rYes').onclick=()=>{Object.assign(S,{box:{},due:{},xp:0,streak:0,last:'',done:{date:'',n:0},read:{},ddone:{},gdone:{}});save();toast('Прогрес скинуто');render()};$('#rNo').onclick=vProgress};
}

render();
