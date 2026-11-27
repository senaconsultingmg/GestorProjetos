from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(); errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('file:///home/claude/proto/obras2.html')
    r=pg.evaluate("""()=>{D=PROJ[0]||D;return 0}""") if False else None
    pg.click('text=Escola de Futebol Bairro Esperança >> nth=0')
    print(pg.evaluate("""()=>{const its=D.verbas.flatMap(v=>v.itens);const a=its[0];a.cotMed=false;a.cotJust=null;a.cot=[];const j=its[0];
      const mk=(it)=>({tipo:'compra',valor:99999,i:it.id});
      const base=reqCot(mk(a));
      a.cotJust={txt:'x',st:'pendente'};const com=reqCot(mk(a));delete a.cotJust;
      a.cotJust={txt:'x',st:'pendente'};a.cotMed=true;const med=reqCot(mk(a));
      return {base,comJust:com,medicao:med,min:D.minCot}}"""))
    print(errs)
