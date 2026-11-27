import struct,io,base64
from playwright.sync_api import sync_playwright
errs=[]
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1300,'height':900})
    pg.on('pageerror',lambda e:errs.append('PAGEERR '+str(e))); pg.on('console',lambda m: errs.append(m.text) if m.type=='error' else None)
    pg.goto('file:///home/claude/proto/obras2.html'); pg.click('text=Escola de Futebol Bairro Esperança >> nth=0')
    # imagem com EXIF
    r=pg.evaluate("""async()=>{const cv=document.createElement('canvas');cv.width=3200;cv.height=2000;const x=cv.getContext('2d');x.fillStyle='#c33';x.fillRect(0,0,3200,2000);
     const bl=await new Promise(r=>cv.toBlob(r,'image/jpeg',.95));const u=new Uint8Array(await bl.arrayBuffer());
     // exif: Orientation=6 big endian
     const tiff=[0x4d,0x4d,0,0x2a,0,0,0,8, 0,1, 0x01,0x12,0,3,0,0,0,1,0,6,0,0, 0,0,0,0];
     const body=[0x45,0x78,0x69,0x66,0,0,...tiff];const len=body.length+2;
     const seg=new Uint8Array([0xFF,0xE1,len>>8,len&255,...body]);
     const f=new Uint8Array(u.length+seg.length);f.set(u.subarray(0,2));f.set(seg,2);f.set(u.subarray(2),2+seg.length);
     const file=new File([f],'a.jpg',{type:'image/jpeg'});const o=await reduzirImg(file);
     const nb=await o.blob.arrayBuffer();const s=exifSeg(nb);let ori=null;if(s){const v=new DataView(s.buffer,s.byteOffset);ori=v.getUint16(28)}
     const bm=await createImageBitmap(o.blob);return{w:bm.width,h:bm.height,exif:o.exif,tem:!!s,ori,orig:o.orig,novo:o.novo}}""")
    print('img',r)
    # relatório
    pg.select_option('#role','coord'); pg.click('.tabs >> text=Prestação')
    pg.click('button[data-a=rel-novo]'); pg.click('button[data-a=rel-gerar]')
    print('rel h1:',pg.locator('.rel h1').inner_text(),'| blocos',pg.locator('.relb').count(),'| avisos',pg.locator('.noprint .alert').count())
    pg.screenshot(path='/tmp/shots/rel1.png',full_page=True)
    pg.click('button[data-a=rel-voltar]'); print('voltou',pg.locator('.rel').count())
    pg.click('button[data-a=rel-novo]'); pg.fill('#rde','2026-12-01'); pg.fill('#rat','2026-11-01'); pg.click('button[data-a=rel-gerar]'); print('erro:',pg.inner_text('#le')); pg.click('button[data-a=fechar]')
    # armazenamento
    pg.select_option('#role','adm'); pg.click('button[data-a=lista]'); pg.click('button[data-a=acessos]'); pg.click('button[data-a=ax][data-id=armaz]')
    print(pg.inner_text('.alert.info'))
    pg.locator('.item',has_text='Google Drive da empresa').locator('[data-a=dest-princ]').click(); print(pg.inner_text('#toast'))
    pg.locator('.item',has_text='Google Drive da empresa').locator('[data-a=dest-conf]').click()
    pg.fill('#dc_pastaId','1AbC'); pg.fill('#dc_conta','x@e.com'); pg.fill('#dpa','{processo}/{ano}/{acao}'); print('prev',pg.inner_text('#dpv'))
    pg.click('[data-a=dest-salvar]'); pg.locator('.item',has_text='Google Drive da empresa').locator('[data-a=dest-testar]').click()
    pg.locator('.item',has_text='Google Drive da empresa').locator('[data-a=dest-princ]').click(); print(pg.inner_text('.alert.info'))
    pg.click('[data-a=dest-novo]'); pg.select_option('#dtp','bucket'); print('campos bucket',pg.locator('#dcm input,#dcm select').count()); pg.fill('#dnm','Backblaze'); pg.click('[data-a=dest-salvar]'); print(pg.locator('.item').count())
    pg.screenshot(path='/tmp/shots/arm1.png',full_page=True)
print('ERRS',errs)
