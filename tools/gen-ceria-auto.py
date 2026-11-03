# Menghasilkan ceria-auto.css: penimpa otomatis untuk tema terang dari aturan CSS gelap lama.
import re,sys
files=['styles.css','v7.css','bc.css','v11.css','strokes.css']
HEX=re.compile(r'#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b')
def rgb(h):
    h=h.lstrip('#')
    if len(h)==3:h=''.join(c*2 for c in h)
    return int(h[0:2],16),int(h[2:4],16),int(h[4:6],16)
def lum(c):
    r,g,b=[x/255 for x in c];return .2126*r+.7152*g+.0722*b
def sat(c):
    mx,mn=max(c),min(c);return 0 if mx==0 else (mx-mn)/mx
def near_black(c):return max(c)<0x58
out=[];seen=set()
for f in files:
    css=open(f,encoding='utf-8').read()
    css=re.sub(r'/\*.*?\*/','',css,flags=re.S)
    for m in re.finditer(r'([^{}@][^{}]*)\{([^{}]*)\}',css):
        sel,body=m.group(1).strip(),m.group(2)
        if not sel or sel.startswith('@') or 'keyframes' in sel or sel.startswith(':root') or sel in ('html','body','html,body'):continue
        decl={}
        for d in body.split(';'):
            if ':' in d:
                k,v=d.split(':',1);decl[k.strip().lower()]=v.strip()
        bg=decl.get('background') or decl.get('background-color')
        col=decl.get('color')
        add=[]
        has_color_bg=False
        if bg:
            hs=[rgb(h) for h in HEX.findall(bg) for h in [h if len(h)==6 else ''.join(c*2 for c in h)]]
            if hs and all(near_black(c) for c in hs):add.append('background:#fff!important')
            elif hs and not any(near_black(c) for c in hs):has_color_bg=True
        if col:
            hs=[h if len(h)==6 else ''.join(c*2 for c in h) for h in HEX.findall(col)]
            if hs:
                c=rgb(hs[0]);L=lum(c)
                if L>.55 and not has_color_bg and not (bg and 'gradient' in bg and not add):
                    if sat(c)>.28:add.append('color:var(--deep)!important')           # pink/merah muda -> merah tua
                    elif L>.82:add.append('color:var(--ink)!important')                 # putih/hampir putih -> teks gelap
                    else:add.append('color:var(--muted)!important')                    # abu terang -> abu
        bc=decl.get('border-color') or decl.get('border')
        if bc:
            hs=[rgb(h if len(h)==6 else ''.join(c*2 for c in h)) for h in HEX.findall(bc)]
            if hs and all(near_black(c) or lum(c)<.2 for c in hs) and 'border' in decl and 'solid' in decl['border'] if 'border' in decl else False:
                add.append('border-color:var(--line)!important')
        if add:
            key=(sel,tuple(add))
            if key in seen:continue
            seen.add(key)
            ss=','.join('html.tc '+s.strip() for s in sel.split(',') if s.strip() and not s.strip().startswith(('html','body',':root')))
            if ss:out.append(ss+'{'+';'.join(add)+'}')
open('ceria-auto.css','w',encoding='utf-8').write('/* otomatis dari tools/gen-ceria-auto.py — jangan diedit manual */\n'+'\n'.join(out)+'\n')
print('aturan dihasilkan:',len(out))
