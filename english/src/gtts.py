import json,os,sys,ssl,urllib.request,base64,concurrent.futures as cf
KEY=os.environ['GKEY'];CTX=ssl.create_default_context(cafile='/root/.ccr/ca-bundle.crt')
VOICE={'f':'en-US-Chirp3-HD-Kore','m':'en-US-Chirp3-HD-Charon'}
def synth(text,voice,out,rate=0.95):
    body=json.dumps({'input':{'text':text},'voice':{'languageCode':'en-US','name':VOICE[voice]},'audioConfig':{'audioEncoding':'MP3','speakingRate':rate,'sampleRateHertz':24000}}).encode()
    for attempt in range(4):
        try:
            r=urllib.request.Request('https://texttospeech.googleapis.com/v1/text:synthesize',data=body,headers={'Content-Type':'application/json','X-Goog-Api-Key':KEY})
            d=json.load(urllib.request.urlopen(r,context=CTX,timeout=60));open(out,'wb').write(base64.b64decode(d['audioContent']));return True
        except Exception as e:
            err=e;import time;time.sleep(2**attempt)
    print('FAIL',text,err);return False
if __name__=='__main__':
    mode=sys.argv[1]
    if mode=='sample':
        os.makedirs('gsample',exist_ok=True)
        synth('Hallo, ik ben Anna. Hoe heet jij?','f','gsample/1.mp3')
        synth('Hoi Anna, ik heet Mark. Leuk je te ontmoeten!','m','gsample/2.mp3')
        synth('Ik kom uit Oekraïne. Ik woon nu in Amsterdam.','f','gsample/3.mp3')
        synth('de kaas','f','gsample/4.mp3');synth('gezellig','f','gsample/5.mp3')
    else:
        items=json.load(open('tts/items.json'));os.makedirs('tts/gmp3',exist_ok=True)
        # words & examples: female Kore; dialogs keep A=female, B=male
        jobs=[(it['text'],'m' if (it['voice']=='m' and it['chunk'] in ('d','d2')) else 'f','tts/gmp3/%d.mp3'%it['id']) for it in items if not os.path.exists('tts/gmp3/%d.mp3'%it['id'])]
        with cf.ThreadPoolExecutor(int(os.environ.get("TH","6"))) as ex: res=list(ex.map(lambda j:synth(*j),jobs))
        print('ok',sum(res),'of',len(jobs))
