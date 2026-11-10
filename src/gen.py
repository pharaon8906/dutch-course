import json,wave,subprocess,os,base64
from piper import PiperVoice
from piper.config import SynthesisConfig
items=json.load(open('tts/items.json'))
V={'m':PiperVoice.load('voices/nl-rdh-medium.onnx'),'f':PiperVoice.load('voices/nl-mls_7432-low.onnx')}
cfg={'m':SynthesisConfig(length_scale=1.1),'f':SynthesisConfig(length_scale=1.4)}
os.makedirs('tts/mp3',exist_ok=True)
for it in items:
    wp=f"tts/tmp.wav";mp=f"tts/mp3/{it['id']}.mp3"
    with wave.open(wp,'wb') as w: V[it['voice']].synthesize_wav(it['text'],w,syn_config=cfg[it['voice']])
    subprocess.run(['ffmpeg','-loglevel','error','-y','-i',wp,'-af','silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,apad=pad_dur=0.12,loudnorm=I=-16:TP=-1.5','-ac','1','-ar','22050','-b:a','32k',mp],check=True)
chunks={}
for it in items:
    chunks.setdefault(it['chunk'],{})[str(it['id'])]=base64.b64encode(open(f"tts/mp3/{it['id']}.mp3",'rb').read()).decode()
os.makedirs('audio',exist_ok=True)
for c,d in chunks.items(): json.dump(d,open(f'audio/{c}.json','w'))
idx={it['k']:[it['chunk'],it['id']] for it in items}
json.dump(idx,open('tts/index.json','w'),ensure_ascii=False)
print('done',sum(os.path.getsize('audio/'+f) for f in os.listdir('audio'))//1024,'KB')
