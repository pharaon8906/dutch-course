import json,base64,re,os
s=open('app.html').read()
data='\n'.join(open(f).read() for f in ['words.js','content.js','emoji.js','content2.js','content3.js','texts.js','texts_more.js','gloss.js','gloss2.js','wex.js'])
idx=open('tts/index.json').read()
sil='data:audio/mpeg;base64,'+base64.b64encode(open('tts/silent.mp3','rb').read()).decode()
cred=open('tts/credits.json').read() if os.path.exists('tts/credits.json') else '[]'
s=s.replace('/*DATA*/',data).replace('/*AIDX*/{}',idx).replace('/*CREDITS*/[]',cred)
s=re.sub(r"const SILENT='[^']*';","const SILENT='"+sil+"';",s)
open('course.html','w').write(s.replace('/*AUDIO*/null','null'))
chunks={f[:-5]:json.load(open('audio/'+f)) for f in os.listdir('audio')}
rep=s.replace('/*AUDIO*/null','null')
import shutil
shutil.rmtree('../audio',ignore_errors=True);shutil.copytree('audio','../audio')
open('../index.html','w').write('<!DOCTYPE html>\n<html lang="uk">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n</head>\n<body>\n'+rep+'\n</body>\n</html>\n')
print(os.path.getsize('course.html')//1024,'KB page;',os.path.getsize('../index.html')//1024,'KB repo')
