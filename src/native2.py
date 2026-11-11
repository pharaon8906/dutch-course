"""Native-speaker recordings from Wikimedia Commons, authenticated.

Needs WTOK (a Wikimedia OAuth 2 access token) in the environment; it is never
written to disk. For every non-dialog clip of 1-3 words it looks for a
Lingua Libre recording (LL-Q7411 (nld)-...) or a classic "Nl-<word>.ogg" file,
downloads the best one, converts it to the course format and records author and
licence for the credits page.

  WTOK=... python3 native2.py
"""
import json, os, re, time, ssl, subprocess, urllib.request, urllib.parse, urllib.error, unicodedata
TOK = os.environ['WTOK']
UA = 'DutchCourseAudioFetcher/1.0 (non-commercial educational course)'
CA = '/root/.ccr/ca-bundle.crt'
CTX = ssl.create_default_context(cafile=CA) if os.path.exists(CA) else ssl.create_default_context()
API = 'https://commons.wikimedia.org/w/api.php'

def get(url, binary=False):
    for attempt in range(6):
        try:
            r = urllib.request.Request(url, headers={'User-Agent': UA, 'Authorization': 'Bearer ' + TOK})
            d = urllib.request.urlopen(r, context=CTX, timeout=60).read()
            return d if binary else json.loads(d)
        except urllib.error.HTTPError as e:
            if e.code == 404: return None
            print('  http', e.code, 'retry', flush=True); time.sleep(10 * (attempt + 1))
        except Exception as e:
            print('  err', e, flush=True); time.sleep(5)
    return None

def api(**q):
    q.update(format='json', maxlag='5')
    return get(API + '?' + urllib.parse.urlencode(q))

def norm(s):
    return re.sub(r'\s+', ' ', unicodedata.normalize('NFC', s).replace('_', ' ')).strip().lower()

items = json.load(open('tts/items.json'))
want = {}
for it in items:
    if it['chunk'] in ('d', 'd2'): continue
    t = it['text']
    if 1 <= len(t.split()) <= 3 and len(t) <= 40: want.setdefault(norm(t), []).append(it['id'])
print('texts to look up:', len(want), flush=True)

# 1. Lingua Libre Dutch (small category)
cand = {}
cont = {}
while True:
    d = api(action='query', list='categorymembers', cmtitle='Category:Lingua Libre pronunciation-nld', cmtype='file', cmlimit='500', **cont)
    for m in d['query']['categorymembers']:
        mm = re.match(r'File:LL-Q7411 \(nld\)-(.+?)-(.+)\.(wav|ogg|flac|mp3)$', m['title'])
        if mm and norm(mm.group(2)) in want: cand.setdefault(norm(mm.group(2)), []).append(m['title'])
    if 'continue' not in d: break
    cont = {'cmcontinue': d['continue']['cmcontinue']}
print('Lingua Libre matches:', len(cand), flush=True)

# 2. classic Nl-<word>.ogg files, checked 50 titles per request
titles = {}
for w in want:
    if w in cand: continue
    for v in {w, w.capitalize()}:
        for ext in ('ogg', 'oga', 'wav', 'mp3'):
            titles['File:Nl-%s.%s' % (v, ext)] = w
tl = list(titles)
for i in range(0, len(tl), 50):
    d = api(action='query', prop='info', titles='|'.join(tl[i:i + 50]))
    if not d: continue
    norm_map = {n['to']: n['from'] for n in d['query'].get('normalized', [])}
    for p in d['query']['pages'].values():
        if 'missing' in p or 'invalid' in p: continue
        src = norm_map.get(p['title'], p['title'])
        w = titles.get(src) or titles.get(p['title'])
        if w: cand.setdefault(w, []).append(p['title'])
    if i % 1000 == 0: print('  checked', i, 'of', len(tl), '; found', len(cand), flush=True)
print('words with a recording:', len(cand), 'of', len(want), flush=True)

# 3. metadata (url, licence, author) for the first candidate of each word
first = {w: sorted(ts, key=lambda t: (not t.startswith('File:LL-'), t))[0] for w, ts in cand.items()}
meta_by_title = {}
ft = list(set(first.values()))
for i in range(0, len(ft), 50):
    d = api(action='query', prop='imageinfo', iiprop='url|extmetadata', iiextmetadatafilter='LicenseShortName|Artist', titles='|'.join(ft[i:i + 50]))
    for p in (d or {}).get('query', {}).get('pages', {}).values():
        ii = (p.get('imageinfo') or [{}])[0]
        em = ii.get('extmetadata', {})
        meta_by_title[p['title']] = {'url': ii.get('url'), 'license': em.get('LicenseShortName', {}).get('value', ''),
                                     'artist': re.sub('<[^>]+>', '', em.get('Artist', {}).get('value', '')).strip()[:80]}

# 4. download + convert
os.makedirs('tts/native_mp3', exist_ok=True); os.makedirs('/tmp/nat_raw', exist_ok=True)
native = json.load(open('tts/native.json')) if os.path.exists('tts/native.json') else {}
done = 0
for w, title in sorted(first.items()):
    m = meta_by_title.get(title)
    if not m or not m['url']: continue
    raw = '/tmp/nat_raw/x.' + m['url'].rsplit('.', 1)[-1]
    data = get(m['url'], binary=True)
    if not data: print('  no data', title); continue
    open(raw, 'wb').write(data)
    for iid in want[w]:
        out = 'tts/native_mp3/%d.mp3' % iid
        r = subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', raw, '-af',
            'silenceremove=start_periods=1:start_threshold=-40dB,areverse,silenceremove=start_periods=1:start_threshold=-40dB,areverse,apad=pad_dur=0.12,loudnorm=I=-16:TP=-1.5,aformat=sample_fmts=s16:sample_rates=24000',
            '-ac', '1', '-ar', '24000', '-b:a', '32k', out])
        if r.returncode or not os.path.exists(out) or os.path.getsize(out) < 1500:
            if os.path.exists(out): os.remove(out)
            print('  bad audio', title); continue
        native[str(iid)] = {'file': title[5:], 'text': w, 'license': m['license'], 'artist': m['artist'],
                            'speaker': m['artist'], 'src': 'Lingua Libre' if title.startswith('File:LL-') else 'Wikimedia Commons'}
    done += 1
    if done % 50 == 0:
        json.dump(native, open('tts/native.json', 'w'), ensure_ascii=False); print('  downloaded', done, flush=True)
    time.sleep(0.2)
json.dump(native, open('tts/native.json', 'w'), ensure_ascii=False)
print('DONE: native recordings for', done, 'words;', len(native), 'clips')
