from playwright.sync_api import sync_playwright
errs=[]
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1300,'height':900})
    pg.on('pageerror',lambda e:errs.append(str(e))); pg.on('console',lambda m: errs.append(m.text) if m.type=='error' else None)
    pg.goto('file:///home/claude/proto/obras2.html'); pg.select_option('#role','coord'); pg.click('text=Escola de Futebol Bairro Esperança >> nth=0')
    print('header bg:',pg.evaluate("getComputedStyle(document.querySelector('header.top')).backgroundColor"))
    pg.click('.tabs >> text=Orçamento'); t=pg.inner_text('#app')
    print('card saldo por verba:', 'crédito e débito' in t, '| svb btn:',pg.locator('[data-a=svb]').count())
    print('linhas:',[l for l in t.split('\n') if 'Rendimentos reservados' in l or 'Resultado' in l or 'Total de receitas' in l][:8])
    pg.screenshot(path='/tmp/shots/n12a.png')
    # troca para soma
    pg.evaluate("D.etapa='param';render()"); pg.locator('table.gx tr',has_text='Rendimento da aplicação').first.locator('button[data-a=item-edit]').click()
    print('select visivel:',pg.is_visible('#irm'),pg.input_value('#irm'))
    pg.select_option('#irm','soma'); pg.click('button[data-a=item-salvar]'); t=pg.inner_text('#app')
    print('apos soma, linha reservados existe:', 'Rendimentos reservados (fora' in t)
    pg.click('button[data-a=item-novo][data-k=r]'); pg.fill('#in','Outro rend'); pg.fill('#io','10'); pg.check('#irend'); pg.click('button[data-a=item-salvar]'); print('erro:',pg.inner_text('#le').replace('\n',' | '))
    print('ERRS',errs); b.close()
