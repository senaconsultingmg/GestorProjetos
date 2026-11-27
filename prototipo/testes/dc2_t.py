from playwright.sync_api import sync_playwright
errs=[]
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1300,'height':900})
    pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('file:///home/claude/proto/obras2.html'); pg.select_option('#role','coord'); pg.click('text=Escola de Futebol Bairro Esperança >> nth=0')
    pg.click('.tabs >> text=Orçamento')
    pg.locator('table.gx tr',has_text='Aluguel').first.locator('button[data-a=item-edit]').click()
    print('padrão:',[(c.get_attribute('data-k'),c.is_checked()) for c in pg.locator('.idu').all()],[c.is_checked() for c in pg.locator('.ido').all()])
    pg.uncheck('.idu[data-k=foto]'); print('obrig foto desabilitado:',pg.locator('.idr',has_text='Foto').locator('.ido').is_disabled())
    pg.check('.idu[data-k=foto]')
    pg.click('[data-a=idoc-add]'); pg.fill('.idn','Contrato de locação'); pg.locator('#idl .ido').check()
    pg.click('button[data-a=item-salvar]'); pg.fill('#md','Documentos do item'); pg.click('button[data-a=mud-ok]')
    print(pg.evaluate("JSON.stringify(itemDe('I3').docsReq)"))
    pg.evaluate("lancForm(null,'V2','I3')")
    print('opts:',[o.inner_text() for o in pg.locator('#ft option').all()])
    pg.fill('#ls','Aluguel dezembro'); pg.fill('#lv','100'); pg.select_option('#lf','P2')
    pg.select_option('#ft','nf'); pg.set_input_files('#fi',files=[{'name':'nota.pdf','mimeType':'application/pdf','buffer':b'x'}]); pg.click('button[data-a=arq-enviar]')
    pg.select_option('#ft','comp'); pg.set_input_files('#fi',files=[{'name':'pix.pdf','mimeType':'application/pdf','buffer':b'x'}]); pg.click('button[data-a=arq-enviar]')
    pg.click('button[data-a=lanc-salvar][data-id=lancar]'); print('e1:',pg.inner_text('#le').replace('\n',' | ')[:200])
    pg.select_option('#ft',index=3); print('selecionado:',pg.eval_on_selector('#ft','s=>s.options[s.selectedIndex].text'))
    pg.set_input_files('#fi',files=[{'name':'Contrato.pdf','mimeType':'application/pdf','buffer':b'x'}]); print('pendente?',pg.inner_text('#fl')); pg.click('button[data-a=lanc-salvar][data-id=lancar]'); print('e2a:',pg.inner_text('#le').replace('\n',' | ')[:160]); pg.click('button[data-a=arq-enviar]')
    pg.click('button[data-a=lanc-salvar][data-id=lancar]'); print('e2:',pg.inner_text('#toast'))
    # editar o lançamento criado: tipos preservados
    print(pg.evaluate("(()=>{const l=D.lanc[D.lanc.length-1];return JSON.stringify(l.arqT)})()"))
    # item novo padrão: foto opcional, NF/comp obrigatórios
    pg.evaluate("lancForm(null,'V1','I1')"); print('item padrão opts:',[o.inner_text() for o in pg.locator('#ft option').all()])
    pg.click('[data-a=fechar]')
    pg.click('button[data-a=item-novo][data-k=c]') if pg.locator('button[data-a=item-novo][data-k=c]').count() else None
print(errs)
