"""Turn texts_a0/a1/a2.txt into texts_more.js (appended to TEXTS)."""
import json
out=[]
for f in ['texts_a0.txt','texts_a1.txt','texts_a2.txt']:
    cur=None
    for line in open(f,encoding='utf-8').read().split('\n'):
        line=line.rstrip()
        if line.startswith('## '):
            i,lv,e,t,uk=[x.strip() for x in line[3:].split('|')]
            cur={'id':i,'lv':lv,'e':e,'t':t,'uk':uk,'p':[[]],'q':[]};out.append(cur)
        elif not cur: continue
        elif line.startswith('? '):
            q,o,a=[x.strip() for x in line[2:].split('|')]
            cur['q'].append({'q':q,'o':[x.strip() for x in o.split(';') if x.strip()],'a':int(a)})
        elif not line.strip():
            if cur['p'][-1]: cur['p'].append([])
        else:
            nl,uk=[x.strip() for x in line.split(' | ',1)]
            cur['p'][-1].append([nl,uk])
    for t in out:
        if not t['p'][-1]: t['p'].pop()
for t in out:
    for q in t['q']: assert 0<=q['a']<len(q['o']),(t['id'],q)
open('texts_more.js','w').write('TEXTS.push(...'+json.dumps(out,ensure_ascii=False)+');\n')
print(len(out),'texts;',sum(len(t['p']) for t in out),'paragraphs;',sum(len(p) for t in out for p in t['p']),'sentences;',
      'words',sum(len(nl.split()) for t in out for p in t['p'] for nl,_ in p))
