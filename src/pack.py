import json,os,base64,subprocess,concurrent.futures as cf
items=json.load(open('tts/items.json'))
def enc(it):
  try:
    subprocess.run(['ffmpeg','-loglevel','error','-y','-i',f"tts/gmp3/{it['id']}.mp3",'-af','silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,apad=pad_dur=0.12,loudnorm=I=-16:TP=-1.5,aformat=sample_fmts=s16:sample_rates=24000','-ac','1','-ar','24000','-b:a','32k',f"tts/mp3/{it['id']}.mp3"],check=True)
  except Exception:
    subprocess.run(['ffmpeg','-loglevel','error','-y','-i',f"tts/gmp3/{it['id']}.mp3",'-ac','1','-ar','24000','-b:a','32k',f"tts/mp3/{it['id']}.mp3"],check=True);print('plain',it['id'])
with cf.ThreadPoolExecutor(8) as ex: list(ex.map(enc,items))
chunks={}
for it in items: chunks.setdefault(it['chunk'],{})[str(it['id'])]=base64.b64encode(open(f"tts/mp3/{it['id']}.mp3",'rb').read()).decode()
for c,d in chunks.items(): json.dump(d,open(f'audio/{c}.json','w'))
print(sum(os.path.getsize('audio/'+f) for f in os.listdir('audio'))//1024,'KB audio')
