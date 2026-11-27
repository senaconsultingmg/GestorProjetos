from playwright.sync_api import sync_playwright
errs=[]
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1300,'height':900})
    pg.on('pageerror',lambda e:errs.append(str(e))); pg.on('console',lambda m: errs.append(m.text) if m.type=='error' else None)
    pg.goto('file:///home/claude/proto/obras2.html'); pg.select_option('#role','coord'); pg.click('text=Escola de Futebol Bairro Esperança >> nth=0')
    pg.click('.tabs >> text=Orçamento')
    pg.locator('table.gx tr',has_text='Aluguel').first.locator('button[data-a=item-edit]').click()
    print('checkbox:',pg.locator('#icm').count()); pg.check('#icm'); pg.click('button[data-a=item-salvar]'); pg.fill('#md','Exigir 3 orçamentos no aluguel'); pg.click('button[data-a=mud-ok]')
    print(pg.evaluate("itemDe('I3').cotMed"))
    pg.evaluate("lancForm(null,'V2','I3')"); print('cotbox:',pg.is_visible('#cotbox'),pg.inner_text('#cotmot'))
    pg.fill('#ls','Aluguel dezembro'); pg.fill('#lv','2000'); pg.select_option('#lf','P2')
    pg.click('button[data-a=lanc-salvar][data-id=lancar]'); print('e1',pg.inner_text('#le').replace('\n',' | ')[:300])
    for k,(f,v) in enumerate([('P1',2100),('P2',2000),('P3',2200)]):
        pg.select_option('#cf%d'%k,f); pg.fill('#cv%d'%k,str(v))
    pg.click('button[data-a=lanc-salvar][data-id=lancar]'); print('e2',pg.inner_text('#le').replace('\n',' | ')[:200])
    for k in range(3): pg.set_input_files('#cq%d'%k,{'name':'orc%d.pdf'%k,'mimeType':'application/pdf','buffer':b'x'})
    pg.click('button[data-a=lanc-salvar][data-id=lancar]'); print('e3',pg.inner_text('#le').replace('\n',' | ')[:200])
    pg.check('input[name=cesc][value="0"]'); pg.click('button[data-a=lanc-salvar][data-id=lancar]'); print('e4',pg.inner_text('#le').replace('\n',' | ')[:200])
    pg.check('input[name=cesc][value="1"]'); pg.click('button[data-a=lanc-salvar][data-id=lancar]'); print('e5',pg.inner_text('#le').replace('\n',' | ')[:200] if pg.locator('#le').count() else 'ok', pg.inner_text('#toast'))
    print('ERRS',errs); b.close()
