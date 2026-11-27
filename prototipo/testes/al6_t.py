import base64
from playwright.sync_api import sync_playwright
PNG=base64.b64decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==')
errs=[]
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1300,'height':900})
    pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('file:///home/claude/proto/obras2.html'); pg.click('text=Escola de Futebol Bairro Esperança >> nth=0')
    pg.select_option('#role','coord'); pg.click('.tabs >> text=Atendidos')
    print([o.inner_text() for o in pg.locator('#alct option').all()])
    pg.locator('tr.click').first.click(); pg.click('[data-a=fechar]') if False else None
    pg.click('text=Ver dados protegidos'); pg.fill('#sn','1234'); print(pg.inner_text('.mb')[-120:].replace('\n',' ')); pg.click('[data-a=dados-abrir]')
    pg.set_input_files('#afo',files=[{'name':'f.png','mimeType':'image/png','buffer':PNG}]); pg.wait_for_timeout(600)
    print('foto:',pg.locator('.mb img').count(), pg.inner_text('#toast'))
    print('tipos doc:',[o.inner_text() for o in pg.locator('#pdt option').all()])
    pg.set_input_files('#pdf',files=[{'name':'atestado.pdf','mimeType':'application/pdf','buffer':b'x'}]); pg.select_option('#pdt','Atestado'); pg.click('[data-a=pdoc-add]'); print('docs:',pg.locator('.mb .row.item').count())
print(errs)
