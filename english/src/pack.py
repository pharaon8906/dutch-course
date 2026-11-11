"""Pack audio clips into audio/*.json chunks and write tts/index.json.

Native-speaker recordings (tts/native_mp3/<id>.mp3, from native.py) replace the
Google HD clip for the same item. A noun with its article ("de kaas") that has
no native clip of its own falls back to the native clip of the bare word
("kaas"). Credits for every native clip go to tts/credits.json.
"""
import json, os, base64, subprocess, shutil, concurrent.futures as cf
items = json.load(open('tts/items.json'))
native = json.load(open('tts/native.json')) if os.path.exists('tts/native.json') else {}
native = {int(k): v for k, v in native.items() if os.path.exists('tts/native_mp3/%s.mp3' % k)}
by_text = {it['text'].lower(): it['id'] for it in items if it['id'] in native}

def src_for(it):
    if it['id'] in native: return it['id']
    if it['chunk'] in ('d', 'd2'): return None
    t = it['text'].lower()
    if t.startswith(('a ', 'an ', 'to ', 'the ')) and t.split(' ', 1)[1] in by_text: return by_text[t.split(' ', 1)[1]]
    return None

def enc(it):
    out = f"tts/mp3/{it['id']}.mp3"
    try:
        subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', f"tts/gmp3/{it['id']}.mp3", '-af', 'silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,apad=pad_dur=0.12,loudnorm=I=-16:TP=-1.5,aformat=sample_fmts=s16:sample_rates=24000', '-ac', '1', '-ar', '24000', '-b:a', '32k', out], check=True)
    except Exception:
        subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', f"tts/gmp3/{it['id']}.mp3", '-ac', '1', '-ar', '24000', '-b:a', '32k', out], check=True)

os.makedirs('tts/mp3', exist_ok=True)
todo = [it for it in items if not os.path.exists(f"tts/mp3/{it['id']}.mp3") or os.path.getmtime(f"tts/mp3/{it['id']}.mp3") < os.path.getmtime(f"tts/gmp3/{it['id']}.mp3")]
with cf.ThreadPoolExecutor(8) as ex: list(ex.map(enc, todo))

chunks, idx, used = {}, {}, {}
for it in items:
    n = src_for(it)
    path = 'tts/native_mp3/%d.mp3' % n if n is not None else f"tts/mp3/{it['id']}.mp3"
    chunks.setdefault(it['chunk'], {})[str(it['id'])] = base64.b64encode(open(path, 'rb').read()).decode()
    idx[it['k']] = [it['chunk'], it['id']] + ([1] if n is not None else [])
    if n is not None: used[n] = native[n]
shutil.rmtree('audio', ignore_errors=True); os.makedirs('audio')
for c, d in chunks.items(): json.dump(d, open(f'audio/{c}.json', 'w'))
json.dump(idx, open('tts/index.json', 'w'), ensure_ascii=False)
credits = sorted(({'w': m.get('text', ''), 'f': m['file'], 'a': (m.get('artist') or m.get('speaker') or '').strip(), 'l': m.get('license', ''), 's': m['src']} for m in used.values()), key=lambda c: c['w'])
json.dump(credits, open('tts/credits.json', 'w'), ensure_ascii=False)
nat_items = sum(1 for v in idx.values() if len(v) > 2)
print(sum(os.path.getsize('audio/' + f) for f in os.listdir('audio')) // 1024, 'KB audio;', nat_items, 'of', len(items), 'clips use native speakers')
