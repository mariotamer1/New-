import html
from items import ITEMS
L=['0001101','0011001','0010011','0111101','0100011','0110001','0101111','0111011','0110111','0001011']
G=['0100111','0110011','0011011','0100001','0011101','0111001','0000101','0010001','0001001','0010111']
R=['1110010','1100110','1101100','1000010','1011100','1001110','1010000','1000100','1001000','1110100']
P=['LLLLLL','LLGLGG','LLGGLG','LLGGGL','LGLLGG','LGGLLG','LGGGLL','LGLGLG','LGGLGL','LGGLGL']
def ean13_bits(code13):
    d=[int(x) for x in code13]
    bits='101'
    for i in range(1,7): bits+=(L if P[d[0]][i-1]=='L' else G)[d[i]]
    bits+='01010'
    for i in range(7,13): bits+=R[d[i]]
    return bits+'101'
def svg(code13):
    bits=ean13_bits(code13)  # 95 modules
    rects=[]
    guard=set(list(range(0,3))+list(range(45,50))+list(range(92,95)))
    for i,b in enumerate(bits):
        if b=='1':
            h=95 if i in guard else 88
            rects.append(f'<rect x="{i}" y="0" width="1" height="{h}"/>')
    # 1 inch wide = 95 modules; 0.85 inch tall bars
    return f'<svg class="bc" viewBox="0 0 95 95" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" fill="#000">{"".join(rects)}</svg>'
def label(title,code):
    c13=code.zfill(13)
    digits=code
    return f'''<div class="lbl"><div class="t">{html.escape(title)}</div>{svg(c13)}<div class="d">{digits}</div></div>'''
per=12
pages=[]
for i in range(0,len(ITEMS),per):
    cells=''.join(label(t,c) for t,c in ITEMS[i:i+per])
    pages.append(f'<section class="sheet">{cells}</section>')
doc=f'''<!doctype html><html><head><meta charset="utf-8"><style>
@page {{ size: 6in 4in; margin: 0; }}
* {{ box-sizing: border-box; margin: 0; padding: 0; }}
html, body {{ background:#fff; }}
.sheet {{ width:6in; height:4in; display:grid; grid-template-columns: repeat(4, 1.5in); grid-template-rows: repeat(3, 1.3333in); page-break-after: always; break-after: page; overflow:hidden; }}
.sheet:last-child {{ page-break-after: auto; break-after: auto; }}
.lbl {{ border:0.01in dotted #bbb; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:0.03in 0.02in; color:#000; font-family: Arial, Helvetica, sans-serif; }}
.t {{ font-size:7.5pt; font-weight:700; text-align:center; line-height:1.1; height:0.2in; display:flex; align-items:flex-end; justify-content:center; max-width:1.46in; }}
.bc {{ width:1in; height:0.85in; display:block; margin:0.02in 0; }}
.bc rect {{ shape-rendering: crispEdges; }}
.d {{ font-family: 'Courier New', monospace; font-size:8pt; letter-spacing:0.5pt; height:0.16in; line-height:0.16in; }}
</style></head><body>{''.join(pages)}</body></html>'''
open('labels.html','w').write(doc)
print('pages', len(pages))
