from playwright.sync_api import sync_playwright
errs=[]
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1300,'height':800})
    pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('file:///home/claude/proto/obras2.html'); pg.click('text=Escola de Futebol Bairro Esperança >> nth=0'); pg.click('.tabs >> text=Orçamento')
    print('main w',pg.evaluate("document.querySelector('main').offsetWidth"))
    pg.click('[data-a=orc-full]'); print('full',pg.evaluate("[document.querySelector('.gxc').getBoundingClientRect().width,document.querySelector('.gxw').getBoundingClientRect().height]"))
    pg.screenshot(path='/tmp/shots/orcfull.png')
    pg.keyboard.press('Escape'); print('after esc',pg.locator('.gxc.full').count())
    pg.click('[data-a=orc-full]'); pg.click('[data-a=orc-full]'); print('toggle',pg.locator('.gxc.full').count(), pg.evaluate("document.body.className"))
print(errs)
