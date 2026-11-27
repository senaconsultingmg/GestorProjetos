from playwright.sync_api import sync_playwright
def F(n):return {'name':n,'mimeType':'application/pdf','buffer':b'x'}
with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page(viewport={'width':1440,'height':900});errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('file:///home/claude/proto/obras2.html'); pg.click('[data-a=abrir]')
    for r in ['coord','gestor','assist','analista','auditor','prof','fin','dir','adm']:
        pg.select_option('#role',r); print(r,'Equipe' in ' '.join(x.inner_text() for x in pg.locator('.tabs button').all()))
    pg.select_option('#role','coord'); pg.click('.tabs >> text=Equipe')
    pg.screenshot(path='/tmp/st1.png')
    print(pg.inner_text('.kpi').replace('\n',' '))
    # nova pessoa: 3 ocupadas de 4
    pg.click('[data-a=st-nova]'); pg.fill('#sn','Paulo Reis'); pg.fill('#sc','Monitor'); pg.fill('#sa','2026-11-03'); pg.fill('#ss','2000'); pg.fill('#sb','Vale-transporte: 200,00\nVale-refeição: 600')
    pg.click('[data-a=st-salvar]'); print('livres:',pg.inner_text('.kpi >> nth=2').replace('\n',' '))
    pg.click('[data-a=st-nova]'); print('quinta:',pg.inner_text('.mb')[:140].replace('\n',' ')); pg.click('[data-a=fechar]')
    # prestação nov do Paulo
    pg.select_option('#role','assist'); pg.click('.tabs >> text=Equipe')
    pg.click('button[data-a=st-enviar]') if False else None
    print('enviar disabled:',pg.locator('[data-a=st-enviar]').is_disabled())
    rows=pg.locator('[data-a=stp-abrir]'); print('linhas',rows.count())
    pg.locator('[data-a=stp-abrir]').nth(3).click()
    pg.fill('#spv_sal','2000'); pg.fill('#spd_sal','2026-11-05')
    pg.select_option('#sft','sal'); pg.set_input_files('#sfi',files=[F('holerite paulo.pdf')]); print('stage:',pg.locator('#stg-sfi').count())
    pg.click('button[data-a=arq-enviar]'); print('chips:',pg.inner_text('#sfl').replace('\n',' '))
    pg.fill('#spv_'+pg.evaluate("D.equipe[3].ben[0].id"),'150'); pg.fill('#spd_'+pg.evaluate("D.equipe[3].ben[0].id"),'2026-11-05')
    pg.click('[data-a=stp-salvar]'); print('e1:',pg.inner_text('#le').replace('\n',' '))
    pg.fill('#sob','Vale-transporte proporcional (admissão dia 3).'); pg.click('[data-a=stp-salvar]'); print('toast:',pg.inner_text('#toast'))
    print('status:',pg.evaluate("JSON.stringify(stComp(D.equipe[3],'2026-11'))"))
    # completar tudo p/ enviar
    pg.evaluate("""(()=>{D.equipe.forEach(p=>{const m='2026-11';const pago={},arq=[];stItens(p).forEach(i=>{pago[i.k]={v:i.prev,d:m+'-05'};arq.push({n:'x_'+i.k+'.pdf',t:i.k})});D.staffPC[m+'|'+p.id]={pago,arq,obs:''}});render()})()""")
    print('enviar disabled:',pg.locator('[data-a=st-enviar]').is_disabled())
    pg.click('[data-a=st-enviar]'); print(pg.inner_text('.pill >> nth=0'))
    pg.select_option('#role','analista'); pg.click('.tabs >> text=Equipe'); print([x.inner_text() for x in pg.locator('.tabs button').all()][:3])
    pg.click('[data-a=st-devolver]'); pg.click('[data-a=st-devolver-ok]'); print('e:',pg.inner_text('#le'))
    pg.fill('#pp','Falta guia do FGTS.'); pg.click('[data-a=st-devolver-ok]'); print(pg.inner_text('.alert.bad').replace('\n',' '))
    pg.select_option('#role','coord'); pg.click('.tabs >> text=Cadastro'); pg.click('.tabs >> text=Cadastro')
    pg.click('[data-a=vagas-edit]'); pg.fill('#vg','2'); pg.click('[data-a=vagas-salvar]'); print('red:',pg.inner_text('#le'))
    pg.fill('#vg','6'); pg.click('[data-a=vagas-salvar]'); print(pg.inner_text('#toast'))
    pg.select_option('#role','fin'); print('fin tabs',[x.inner_text() for x in pg.locator('.tabs button').all()])
    pg.select_option('#role','dir'); pg.click('.tabs >> text=Equipe'); print(pg.locator('[data-a=st-nova]').count(), 'mask' in pg.content())
    pg.screenshot(path='/tmp/st2.png'); print(errs)
