"""Find and download native-speaker Dutch recordings from Wikimedia Commons.

Sources: Lingua Libre (Category:Lingua Libre pronunciation-nld) and the classic
"Nl-<word>.ogg" files (Category:Dutch pronunciation). Polite: one request at a
time, maxlag, pauses and back-off on 429.

  python3 native.py list      # build tts/commons_index.json (all file titles)
  python3 native.py fetch     # download matches for tts/items.json into tts/native/
"""
import json, os, sys, time, re, hashlib, ssl, subprocess, urllib.request, urllib.parse, urllib.error, unicodedata
UA = 'DutchCourseAudioFetcher/1.0 (non-commercial educational course; low volume)'
CA = '/root/.ccr/ca-bundle.crt'
CTX = ssl.create_default_context(cafile=CA) if os.path.exists(CA) else ssl.create_default_context()
API = 'https://commons.wikimedia.org/w/api.php'

def get(url, binary=False):
    for attempt in range(8):
        try:
            r = urllib.request.Request(url, headers={'User-Agent': UA, 'Api-User-Agent': UA})
            d = urllib.request.urlopen(r, context=CTX, timeout=60).read()
            return d if binary else json.loads(d)
        except urllib.error.HTTPError as e:
            if e.code in (429, 503):
                wait = 30 * (attempt + 1); print('  429, waiting', wait, flush=True); time.sleep(wait); continue
            if e.code == 404: return None
            raise
        except Exception as e:
            print('  err', e, flush=True); time.sleep(10)
    raise SystemExit('gave up: ' + url)

def catmembers(cat):
    out, cont = [], {}
    while True:
        q = {'action': 'query', 'list': 'categorymembers', 'cmtitle': cat, 'cmtype': 'file', 'cmlimit': '500', 'format': 'json', 'maxlag': '5', **cont}
        d = get(API + '?' + urllib.parse.urlencode(q))
        out += [m['title'] for m in d['query']['categorymembers']]
        print(cat, len(out), flush=True)
        if 'continue' not in d: return out
        cont = {'cmcontinue': d['continue']['cmcontinue']}
        time.sleep(1.5)

def key(s):
    s = unicodedata.normalize('NFC', s).strip().lower()
    return re.sub(r'\s+', ' ', s.replace('_', ' '))

def build_index():
    idx = {}
    for t in catmembers('Category:Lingua Libre pronunciation-nld'):
        m = re.match(r'File:LL-Q7411 \(nld\)-(.+?)-(.+)\.(wav|ogg|flac|mp3)$', t)
        if m: idx.setdefault(key(m.group(2)), []).append({'t': t[5:], 'sp': m.group(1), 'src': 'Lingua Libre'})
    for t in catmembers('Category:Dutch pronunciation'):
        m = re.match(r'File:Nl-(.+?)(?:-\d+|\d)?\.(ogg|oga|wav|mp3|flac)$', t, re.I)
        if m: idx.setdefault(key(m.group(1)), []).append({'t': t[5:], 'sp': None, 'src': 'Wikimedia Commons'})
    json.dump(idx, open('tts/commons_index.json', 'w'), ensure_ascii=False)
    print('words in index:', len(idx))


def dataset():
    """Download Lingua Libre's Dutch dataset (one zip) and index it locally."""
    import zipfile
    html = get('https://lingualibre.org/datasets/', binary=True).decode('utf-8', 'replace')
    links = re.findall(r'href="([^"]*(?:nld|Q7411)[^"]*\.zip)"', html)
    print('dataset links:', links, flush=True)
    if not links: raise SystemExit('no Dutch dataset link found')
    url = urllib.parse.urljoin('https://lingualibre.org/datasets/', links[0])
    data = get(url, binary=True)
    open('/tmp/nld.zip', 'wb').write(data); print('zip MB', len(data) // 1048576, flush=True)
    os.makedirs('/tmp/nld', exist_ok=True)
    zipfile.ZipFile('/tmp/nld.zip').extractall('/tmp/nld')
    idx = {}
    for root, _, files in os.walk('/tmp/nld'):
        for fn in files:
            if not fn.lower().endswith(('.ogg', '.wav', '.flac', '.mp3', '.opus')): continue
            sp = os.path.basename(root); word = os.path.splitext(fn)[0]
            idx.setdefault(key(word), []).append({'t': 'LL-Q7411 (nld)-%s-%s.wav' % (sp, word), 'sp': sp, 'src': 'Lingua Libre',
                                                   'local': os.path.join(root, fn), 'license': 'CC BY-SA 4.0 (Lingua Libre)'})
    json.dump(idx, open('tts/commons_index.json', 'w'), ensure_ascii=False)
    print('words in dataset:', len(idx), flush=True)

def file_url(title):
    name = title.replace(' ', '_')
    h = hashlib.md5(name.encode('utf-8')).hexdigest()
    return 'https://upload.wikimedia.org/wikipedia/commons/%s/%s/%s' % (h[0], h[:2], urllib.parse.quote(name))

def fetch():
    idx = json.load(open('tts/commons_index.json'))
    items = json.load(open('tts/items.json'))
    # speaker popularity among our words -> prefer one consistent voice
    want = {}
    for it in items:
        if it['chunk'] in ('d', 'd2'): continue   # dialogs keep two consistent HD voices
        k = key(it['text'])
        if k in idx: want[it['id']] = k
    score = {}
    for k in set(want.values()):
        for f in idx[k]: score[f['sp']] = score.get(f['sp'], 0) + 1
    os.makedirs('tts/native', exist_ok=True)
    meta = json.load(open('tts/native.json')) if os.path.exists('tts/native.json') else {}
    it_text = {it['id']: it['text'] for it in items}
    for n, (iid, k) in enumerate(sorted(want.items())):
        if str(iid) in meta: continue
        best = sorted(idx[k], key=lambda f: (f['src'] != 'Lingua Libre', -score.get(f['sp'], 0)))[0]
        ext = best['t'].rsplit('.', 1)[1].lower()
        out = 'tts/native/%d.%s' % (iid, ext)
        data = open(best['local'], 'rb').read() if best.get('local') else get(file_url(best['t']), binary=True)
        if not data: print('  404', best['t']); continue
        open(out, 'wb').write(data)
        mp3 = 'tts/native_mp3/%d.mp3' % iid
        os.makedirs('tts/native_mp3', exist_ok=True)
        r = subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', out, '-af',
            'silenceremove=start_periods=1:start_threshold=-40dB,areverse,silenceremove=start_periods=1:start_threshold=-40dB,areverse,apad=pad_dur=0.12,loudnorm=I=-16:TP=-1.5,aformat=sample_fmts=s16:sample_rates=24000',
            '-ac', '1', '-ar', '24000', '-b:a', '32k', mp3])
        os.remove(out)
        if r.returncode != 0 or not os.path.exists(mp3) or os.path.getsize(mp3) < 1500:
            print('  bad audio', best['t']); continue
        meta[str(iid)] = {'file': best['t'], 'speaker': best['sp'], 'src': best['src'], 'text': it_text[iid], 'license': best.get('license', ''), 'artist': best['sp'] or ''}
        if n % 20 == 0:
            json.dump(meta, open('tts/native.json', 'w'), ensure_ascii=False); print(n, '/', len(want), flush=True)
        if not best.get('local'): time.sleep(0.7)
    json.dump(meta, open('tts/native.json', 'w'), ensure_ascii=False)
    print('native clips:', len(meta), 'of', len(want), 'matched; items total', len(items))

def licenses():
    meta = json.load(open('tts/native.json'))
    files = sorted({m['file'] for m in meta.values() if not m.get('license')})
    lic = {}
    for i in range(0, len(files), 50):
        q = {'action': 'query', 'prop': 'imageinfo', 'iiprop': 'extmetadata', 'iiextmetadatafilter': 'LicenseShortName|Artist',
             'titles': '|'.join('File:' + f for f in files[i:i+50]), 'format': 'json', 'maxlag': '5'}
        d = get(API + '?' + urllib.parse.urlencode(q))
        for p in d['query']['pages'].values():
            em = (p.get('imageinfo') or [{}])[0].get('extmetadata', {})
            lic[p['title'][5:]] = {'license': em.get('LicenseShortName', {}).get('value', ''),
                                   'artist': re.sub('<[^>]+>', '', em.get('Artist', {}).get('value', ''))[:80]}
        time.sleep(1.5)
    for m in meta.values():
        m.update(lic.get(m['file'], {}))
    json.dump(meta, open('tts/native.json', 'w'), ensure_ascii=False, indent=0)
    print('licenses:', len(lic))

if __name__ == '__main__':
    {'list': build_index, 'dataset': dataset, 'fetch': fetch, 'licenses': licenses}[sys.argv[1]]()
