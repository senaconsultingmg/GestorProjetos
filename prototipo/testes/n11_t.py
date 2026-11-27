from playwright.sync_api import sync_playwright
errs=[]
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1300,'height':900})
    pg.on('pageerror',lambda e:errs.append(str(e))); pg.on('console',lambda m: errs.append(m.text) if m.type=='error' else None)
    pg.goto('file:///home/claude/proto/obras2.html')
    pg.select_option('#role','coord'); print('coord ve Permissões:',pg.locator('button[data-a=acessos]').count())
    pg.select_option('#role','adm'); pg.click('button[data-a=acessos]'); pg.click('button[data-a=ax][data-id=perfis]')
    pg.click('button[data-a=perfil-novo]'); pg.click('button[data-a=perfil-salvar]'); print('e1',pg.inner_text('#le').replace('\n',' | '))
    pg.fill('#pn','Assistente de lançamentos'); 
    for f in ['ver_resumo','ver_orc','ver_prest','lanc','rcb']: pg.check('.pfn[value=%s]'%f)
    pg.click('button[data-a=perfil-salvar]')
    pg.click('button[data-a=ax][data-id=usuarios]'); pg.click('button[data-a=user-novo]'); pg.fill('#un','Ana Souza'); pg.fill('#ue','ana@instituto.org.br')
    pg.select_option('#up',label='Assistente de lançamentos'); pg.click('button[data-a=user-salvar]'); print('senha:',pg.inner_text('.mb')[:100].replace('\n',' | ')); pg.click('button[data-a=fechar]')
    uid=pg.evaluate("USUARIOS.find(u=>u.nome==='Ana Souza').id"); pg.select_option('#role',uid)
    print('perm btn visivel p/ Ana:',pg.locator('button[data-a=acessos]').count())
    pg.click('text=Escola de Futebol Bairro Esperança >> nth=0'); print('tabs:',pg.inner_text('.tabs').replace('\n',' '))
    pg.click('.tabs >> text=Orçamento'); print('valores mascarados:',pg.locator('.mask').count()>0 or '•••' in pg.inner_text('#app'), '| botão +:',pg.locator('button.mais').count())
    # dar ver_valores
    pg.select_option('#role','adm'); pg.click('button[data-a=lista]') if pg.locator('button[data-a=lista]').count() else None
    pg.click('button[data-a=acessos]'); pg.click('button[data-a=ax][data-id=perfis]'); pg.click('.item:has-text("Assistente de lançamentos") button[data-a=perfil-edit]'); pg.check('.pfn[value=ver_valores]'); pg.click('button[data-a=perfil-salvar]')
    pg.select_option('#role',uid); pg.click('text=Escola de Futebol Bairro Esperança >> nth=0'); pg.click('.tabs >> text=Orçamento'); print('com ver_valores, mascarado:','•••' in pg.inner_text('#gx'))
    # guarda do último admin
    pg.select_option('#role','adm'); pg.click('button[data-a=lista]'); pg.click('button[data-a=acessos]'); pg.click('button[data-a=ax][data-id=perfis]'); pg.click('.item:has-text("Administrador") button[data-a=perfil-edit]'); pg.uncheck('.pfn[value=acessos_admin]'); pg.click('button[data-a=perfil-salvar]'); print('guard:',pg.inner_text('#le').replace('\n',' | '))
    print('ERRS',errs); b.close()
