import base64,struct,zlib
from playwright.sync_api import sync_playwright
def png():
    raw=b'\x00\xff\x00\x00'*1
    def ch(t,d):c=struct.pack('>I',len(d))+t+d;return c+struct.pack('>I',zlib.crc32(t+d)&0xffffffff)
    return b'\x89PNG\r\n\x1a\n'+ch(b'IHDR',struct.pack('>IIBBBBB',1,1,8,6,0,0,0))+ch(b'IDAT',zlib.compress(raw))+ch(b'IEND',b'')
errs=[]
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1300,'height':900})
    pg.on('pageerror',lambda e:errs.append('PAGEERR '+str(e))); pg.on('console',lambda m: errs.append(m.text) if m.type=='error' else None)
    pg.goto('file:///home/claude/proto/obras2.html'); pg.click('text=Escola de Futebol Bairro Esperança >> nth=0')
    print([x.inner_text() for x in pg.locator('#role option').all()])
    pg.select_option('#role','assist'); pg.click('.tabs >> text=Plano de trabalho')
    pg.locator('.card',has_text='Torneio de integração').locator('button[data-a=pc-abrir]').first.click()
    pg.click('#pce'); pg.keyboard.type('Torneio com 6 times.'); pg.click('button[data-a=pc-enviar]'); print('ev erro:',pg.inner_text('#le'))
    pg.click('.tabs >> text=Plano de trabalho') if False else None
    pg.click('button[data-a=pc-voltar]')
    pg.locator('.card',has_text='Turma A (terça').locator('button[data-a=pc-abrir]').first.click()
    pg.click('#pce'); pg.keyboard.type('Aulas sem intercorrências.')
    pg.set_input_files('#pci',files=[{'name':'f.png','mimeType':'image/png','buffer':png()}]); pg.wait_for_timeout(500)
    print('img no texto:',pg.locator('#pce img').count())
    pg.select_option('#pct','PDF'); pg.set_input_files('#pcf',files=[{'name':'rel.pdf','mimeType':'application/pdf','buffer':b'x'}])
    print('texto mantido:',pg.inner_text('#pce')[:40],'| imgs',pg.locator('#pce img').count(),'| anexos',pg.locator('.chip').count())
    pg.screenshot(path='/tmp/shots/pc1.png',full_page=True)
    pg.click('button[data-a=pc-enviar]'); print(pg.inner_text('#toast'))
    pg.select_option('#role','analista')
    pg.click('button[data-a=pc-dev]'); print('sem motivo:',pg.inner_text('#le')); pg.fill('#pcm','Falta foto'); pg.click('button[data-a=pc-dev]'); print(pg.inner_text('#toast'))
    pg.select_option('#role','fin'); print('fin tabs',[x.inner_text() for x in pg.locator('.tabs button').all()]); pg.click('.tabs >> text=Orçamento')
    print('fin mais:',pg.locator('button[data-a=rcb-novo]').count(), '| linhas rend',pg.locator('table.gx tr',has_text='Rendimento da aplicação').first.locator('button.mais').count())
    pg.locator('table.gx tr',has_text='Rendimento da aplicação').first.locator('button.mais').last.click(); pg.fill('#rcv','140'); pg.fill('#rcs','Rendimento nov'); pg.set_input_files('#rcf',files=[{'name':'e.pdf','mimeType':'application/pdf','buffer':b'x'}]); pg.click('button[data-a=rcb-salvar]'); print(pg.inner_text('#toast'))
    pg.select_option('#role','assist'); pg.click('.tabs >> text=Orçamento'); print('assist mais rend:',pg.locator('table.gx tr',has_text='Rendimento da aplicação').first.locator('button.mais').count(),'doação',pg.locator('table.gx tr',has_text='Parcela mensal').first.locator('button.mais').count())
    pg.locator('table.gx tr',has_text='Lanche').first.locator('button.mais').last.click(); print('conta:',pg.inner_text('#lcx')); pg.keyboard.press('Escape')
    pg.screenshot(path='/tmp/shots/pc2.png')
    print('ERROS:',errs); b.close()
