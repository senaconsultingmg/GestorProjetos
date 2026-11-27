/* ===== Equipe (staff): vagas, pessoas e prestação mensal por pessoa ===== */
const STM={aberta:['Em preparação',''],em_analise:['Em análise','warn'],aprovada:['Aprovada','ok'],devolvida:['Devolvida','bad']};
const VINC=['CLT','PJ','Bolsista','Estagiário','Outro'];
const stMesSt=m=>(D.staffMes&&D.staffMes[m]||{st:'aberta'}).st;
const stOcup=()=>D.equipe.filter(p=>!p.deslig||p.deslig>HOJE).length;
const stAtiva=(p,m)=>p.adm.slice(0,7)<=m&&(!p.deslig||p.deslig.slice(0,7)>=m);
const stItens=p=>[{k:'sal',nome:'Salário',prev:p.sal}].concat((p.ben||[]).map(b=>({k:b.id,nome:b.nome,prev:b.valor})));
const stReg=(pid,m)=>(D.staffPC&&D.staffPC[m+'|'+pid])||{pago:{},arq:[],obs:''};
const stItOk=(r,k)=>{const x=r.pago[k];return!!(x&&x.v>0&&x.d&&r.arq.some(a=>a.t===k))};
const stComp=(p,m)=>{const r=stReg(p.id,m),it=stItens(p),ok=it.filter(i=>stItOk(r,i.k)).length;return{ok,tot:it.length,full:ok===it.length}};
const stMeses=()=>{if(!D.exIni)return[];const a=D.exIni.slice(0,7),h=HOJE.slice(0,7),f=D.exFim?D.exFim.slice(0,7):h;return mesesDe(a,h<f?h:f)};
const stMv=v=>veTotal()?brl(v):MK;
function stNomeItem(p,k){const i=stItens(p).find(x=>x.k===k);return i?i.nome:k}

function vStaff(){
 const m=stMeses().includes(S.mes)?S.mes:(stMeses().slice(-1)[0]||S.mes),ger=has('staff_gerir')&&!trancado(),oc=stOcup(),mx=D.staffMax||0,ms=stMeses(),sm=stMesSt(m);
 const ativos=D.equipe.filter(p=>stAtiva(p,m));
 const linhas=D.equipe.map(p=>{const des=p.deslig&&p.deslig<=HOJE;return'<tr'+(des?' style="opacity:.6"':'')+'><td><b>'+esc(p.nome)+'</b><div class="small muted">'+esc(p.cargo)+' · '+esc(p.vinc)+'</div></td><td>'+fd(p.adm)+(p.deslig?'<div class="small muted">até '+fd(p.deslig)+'</div>':'')+'</td><td class="n">'+stMv(p.sal)+'</td><td class="small">'+((p.ben||[]).map(b=>esc(b.nome)+' '+(veTotal()?brl(b.valor):'•••')).join('<br>')||'<span class="muted">—</span>')+'</td><td>'+pill(des?'Desligado':'Ativo',des?'':'ok')+'</td><td>'+(ger?'<button class="btn sm" data-a="st-edit" data-id="'+p.id+'">Editar</button>':'')+'</td></tr>'}).join('');
 const pm=ativos.map(p=>{const c=stComp(p,m),r=stReg(p.id,m),sal=stItOk(r,'sal');return'<tr><td><b>'+esc(p.nome)+'</b><div class="small muted">'+esc(p.cargo)+'</div></td><td>'+(sal?'<span class="ok">✓ comprovado</span>':'<span class="bad">pendente</span>')+'</td><td>'+((p.ben||[]).length?(c.ok-(sal?1:0))+' de '+p.ben.length:'<span class="muted">—</span>')+'</td><td class="n">'+r.arq.length+'</td><td>'+(c.full?pill('Completo','ok'):pill(c.ok+' de '+c.tot+' itens','warn'))+'</td><td><button class="btn sm" data-a="stp-abrir" data-id="'+p.id+'">'+(has('staff_prest')&&['aberta','devolvida'].includes(sm)&&!travado(m)?'Comprovar':'Ver')+'</button></td></tr>'}).join('');
 const todos=ativos.length>0&&ativos.every(p=>stComp(p,m).full);
 let acao='';
 if(has('staff_prest')&&['aberta','devolvida'].includes(sm)&&!travado(m))acao='<button class="btn p" data-a="st-enviar"'+(todos?'':' disabled')+'>Enviar prestação da equipe ao analista</button>'+(todos?'':'<span class="small bad">Comprove salário e benefícios de todas as pessoas antes de enviar.</span>');
 else if(has('staff_analisa')&&sm==='em_analise')acao='<button class="btn p" data-a="st-aprovar">Aprovar</button><button class="btn d" data-a="st-devolver">Devolver para correção</button>';
 else acao='<span class="small muted">'+(sm==='aprovada'?'Prestação da equipe aprovada.':'Sem ação disponível para o seu perfil neste estado.')+'</span>';
 const par=D.staffMes&&D.staffMes[m]&&D.staffMes[m].parecer;
 return'<div class="card"><div class="row"><h2 style="margin:0">Equipe (staff)</h2><span class="sp"></span>'+(ger?'<button class="btn p sm" data-a="st-nova">+ Pessoa</button>':'')+'</div><div class="grid g4" style="margin-top:8px"><div class="kpi"><div class="l">Vagas autorizadas</div><div class="v">'+mx+'</div></div><div class="kpi"><div class="l">Ocupadas</div><div class="v">'+oc+'</div></div><div class="kpi"><div class="l">Livres</div><div class="v" style="color:'+(mx-oc<0?'var(--bad)':'inherit')+'">'+(mx-oc)+'</div></div></div>'+(oc>mx?'<div class="alert bad">Há mais pessoas ativas do que vagas autorizadas.</div>':'')+(mx===0?'<div class="alert warn">Nenhuma vaga autorizada. A coordenação informa a quantidade no Cadastro, em Parametrização.</div>':'')+
 '<div class="tw" style="margin-top:8px"><table><thead><tr><th>Pessoa</th><th>Admissão</th><th class="n">Salário previsto</th><th>Benefícios previstos</th><th>Situação</th><th></th></tr></thead><tbody>'+(linhas||'<tr><td colspan="6" class="muted">Nenhuma pessoa cadastrada.</td></tr>')+'</tbody></table></div></div>'+
 '<div class="card"><div class="row"><h2 style="margin:0">Prestação de contas da equipe</h2><span class="sp"></span><label class="small" for="mes">Mês</label><select id="mes" data-a="mes" style="width:auto">'+ms.map(x=>'<option value="'+x+'"'+(x===m?' selected':'')+'>'+mesNome(x)+'</option>').join('')+'</select>'+pill(STM[sm][0],STM[sm][1])+(travado(m)?pill('🔒 Mês travado'):'')+'</div><p class="muted small">Para cada pessoa, demonstre o pagamento do salário e de cada benefício do mês e anexe os comprovantes (holerite, comprovante de pagamento, guias). Só depois que todos estiverem completos a prestação do mês pode ser enviada.</p>'+(par?'<div class="alert '+(sm==='devolvida'?'bad':'info')+'">Parecer do analista: '+esc(par)+'</div>':'')+
 '<div class="tw"><table><thead><tr><th>Pessoa</th><th>Salário</th><th>Benefícios</th><th class="n">Anexos</th><th>Situação</th><th></th></tr></thead><tbody>'+(pm||'<tr><td colspan="6" class="muted">Nenhuma pessoa ativa neste mês.</td></tr>')+'</tbody></table></div><div class="row" style="margin-top:10px">'+acao+'</div></div>';
}

function stForm(id){
 const p=id?D.equipe.find(x=>x.id===id):null;
 modal(p?'Editar pessoa da equipe':'Nova pessoa da equipe','<div id="le"></div><label class="f" for="sn">Nome completo</label><input id="sn" value="'+esc(p?p.nome:'')+'"><div class="row"><div style="flex:2;min-width:160px"><label class="f" for="sc">Cargo / função</label><input id="sc" value="'+esc(p?p.cargo:'')+'"></div><div style="flex:1;min-width:120px"><label class="f" for="sv">Vínculo</label><select id="sv">'+VINC.map(v=>'<option'+(p&&p.vinc===v?' selected':'')+'>'+v+'</option>').join('')+'</select></div></div><div class="row"><div style="flex:1;min-width:130px"><label class="f" for="sa">Admissão</label><input type="date" id="sa" value="'+(p?p.adm:'')+'"></div>'+(p?'<div style="flex:1;min-width:130px"><label class="f" for="sd">Desligamento (se houver)</label><input type="date" id="sd" value="'+(p&&p.deslig||'')+'"></div>':'')+'<div style="flex:1;min-width:130px"><label class="f" for="ss">Salário mensal previsto (R$)</label><input type="number" step="0.01" min="0" id="ss" value="'+(p?p.sal:'')+'"></div></div><label class="f" for="sb">Benefícios mensais previstos (um por linha, “nome: valor”)</label><textarea id="sb" rows="4" placeholder="Vale-refeição: 660&#10;Vale-transporte: 220">'+esc(p?(p.ben||[]).map(b=>b.nome+': '+b.valor).join('\n'):'')+'</textarea><div class="small muted">Cada benefício listado vira um item a comprovar todo mês. Dados pessoais sensíveis (CPF, endereço) ficam fora deste cadastro.</div>','<button class="btn" data-a="fechar">Cancelar</button><button class="btn p" data-a="st-salvar" data-id="'+(id||'')+'">Salvar</button>');
}

function stpForm(pid,m){
 const p=D.equipe.find(x=>x.id===pid),r=stReg(pid,m),sm=stMesSt(m),ed=has('staff_prest')&&['aberta','devolvida'].includes(sm)&&!travado(m);
 M={sp:{pid,m},pago:JSON.parse(JSON.stringify(r.pago)),arq:r.arq.map(a=>Object.assign({},a)),ed};
 const it=stItens(p);
 const linha=i=>{const x=M.pago[i.k]||{};return'<tr><td><b>'+esc(i.nome)+'</b><div class="small muted">previsto '+stMv(i.prev)+'</div></td><td><input class="spx" type="number" step="0.01" min="0" id="spv_'+i.k+'" data-k="'+i.k+'" value="'+(x.v!=null?x.v:'')+'"'+(ed?'':' disabled')+' style="min-width:100px"></td><td><input class="spx" type="date" id="spd_'+i.k+'" data-k="'+i.k+'" value="'+(x.d||'')+'"'+(ed?'':' disabled')+'></td><td id="sst_'+i.k+'"></td></tr>'};
 modal(p.nome+' · '+mesNome(m),'<div class="row">'+pill(STM[sm][0],STM[sm][1])+'<span class="small muted">'+esc(p.cargo)+'</span></div>'+(ed?'':'<div class="alert info">'+(travado(m)?'Mês travado: não aceita alterações.':sm==='em_analise'?'Prestação em análise: aguarde o parecer.':sm==='aprovada'?'Prestação aprovada.':'Seu perfil só consulta esta tela.')+'</div>')+'<div id="le"></div><div class="tw"><table><thead><tr><th>Item</th><th>Valor pago (R$)</th><th>Data do pagamento</th><th>Comprovante</th></tr></thead><tbody>'+it.map(linha).join('')+'</tbody></table></div>'+
 (ed?'<label class="f">Anexar comprovantes</label><div class="row"><select id="sft" style="width:auto">'+it.map(i=>'<option value="'+i.k+'">'+esc(i.k==='sal'?'Salário — holerite / comprovante de pagamento':i.nome+' — comprovante')+'</option>').join('')+'</select><input type="file" id="sfi" multiple style="flex:1;min-width:150px"></div>':'')+'<div id="sfl" style="margin-top:6px"></div><label class="f" for="sob">Observação (obrigatória quando o valor pago difere do previsto)</label><textarea id="sob" rows="2"'+(ed?'':' disabled')+'>'+esc(r.obs||'')+'</textarea>',
 '<button class="btn" data-a="fechar">'+(ed?'Cancelar':'Fechar')+'</button>'+(ed?'<button class="btn p" data-a="stp-salvar">Salvar prestação da pessoa</button>':''));
 stLive();stFileList();
}
function stLeitura(){const o={};M.sp&&stItens(D.equipe.find(x=>x.id===M.sp.pid)).forEach(i=>{const v=$('#spv_'+i.k),d=$('#spd_'+i.k);o[i.k]={v:v?parseFloat(v.value)||0:0,d:d?d.value:''}});return o}
function stLive(){
 if(!M.sp)return;const p=D.equipe.find(x=>x.id===M.sp.pid),pg=stLeitura();
 stItens(p).forEach(i=>{const x=pg[i.k],tem=M.arq.some(a=>a.t===i.k),el=$('#sst_'+i.k);if(!el)return;
  const falta=[];if(!(x.v>0))falta.push('valor');if(!x.d)falta.push('data');if(!tem)falta.push('arquivo');
  el.innerHTML=falta.length?'<span class="small bad">falta '+falta.join(', ')+'</span>':(Math.abs(x.v-i.prev)>0.004?'<span class="small" style="color:var(--warn)">✓ difere do previsto</span>':'<span class="ok">✓ comprovado</span>')});
}
function stFileList(){const el=$('#sfl');if(!el)return;const p=D.equipe.find(x=>x.id===M.sp.pid);el.innerHTML=M.arq.map((x,i)=>'<span class="chip">📎 '+esc(x.n)+' <small>('+esc(stNomeItem(p,x.t))+')</small>'+(M.ed?' <button class="crumb" data-a="srm-arq" data-id="'+i+'" aria-label="Remover">×</button>':'')+'</span>').join('')||'<span class="muted small">Nenhum comprovante anexado.</span>'}
function stAnexa(t){const tp=$('#sft').value;[...t.files].forEach(f=>M.arq.push({n:FN(f),t:tp}));t.value='';stFileList();stLive()}

const STAFF_ACT={
 'st-nova':()=>{if(stOcup()>=(D.staffMax||0)){modal('Sem vaga livre','<div class="alert bad">Todas as vagas autorizadas ('+(D.staffMax||0)+') estão ocupadas. Aumente a quantidade em Cadastro › Parametrização ou registre o desligamento de alguém.</div>','<button class="btn p" data-a="fechar">Entendi</button>');return}stForm()},
 'st-edit':id=>stForm(id),
 'st-salvar':id=>{
  const n=$('#sn').value.trim(),c=$('#sc').value.trim(),a=$('#sa').value,s=parseFloat($('#ss').value),dd=$('#sd')?$('#sd').value:'',er=[];
  if(!n)er.push('Informe o nome.');if(!c)er.push('Informe o cargo ou função.');if(!a)er.push('Informe a data de admissão.');if(!(s>0))er.push('Informe o salário mensal previsto.');
  if(dd&&a&&dd<a)er.push('O desligamento não pode ser antes da admissão.');
  const ben=[];$('#sb').value.split('\n').map(x=>x.trim()).filter(Boolean).forEach(l=>{const k=l.lastIndexOf(':');const nm=(k>0?l.slice(0,k):l).trim(),v=parseFloat((k>0?l.slice(k+1):'').replace(/\./g,'').replace(',','.'))||0;if(!nm||!(v>0))er.push('Benefício inválido: “'+l+'”. Use “nome: valor”.');else ben.push({nome:nm,valor:v})});
  if(!id&&!er.length&&stOcup()>=(D.staffMax||0))er.push('Não há vaga livre.');
  if(er.length){$('#le').innerHTML=errs(er);return}
  const vinc=$('#sv').value;
  if(id){const p=D.equipe.find(x=>x.id===id);const old=p.ben||[];
   p.ben=ben.map((b,i)=>{const o=old.find(x=>x.nome.toLowerCase()===b.nome.toLowerCase());return{id:o?o.id:id+'_b'+Date.now()%100000+i,nome:b.nome,valor:b.valor}});
   const ant=p.nome+' · '+p.cargo+' · '+brl(p.sal)+(p.deslig?' · desligado em '+fd(p.deslig):'');Object.assign(p,{nome:n,cargo:c,vinc,adm:a,sal:s,deslig:dd||''});
   reg('Equipe','Pessoa da equipe alterada: '+n,ant,p.nome+' · '+p.cargo+' · '+brl(p.sal)+(p.deslig?' · desligado em '+fd(p.deslig):''))}
  else{const nid='E'+(D.equipe.length+1)+Date.now()%1000;D.equipe.push({id:nid,nome:n,cargo:c,vinc,adm:a,deslig:'',sal:s,ben:ben.map((b,i)=>({id:nid+'_b'+i,nome:b.nome,valor:b.valor}))});reg('Equipe','Pessoa incluída na equipe: '+n+' ('+c+')')}
  fechar();toast('Equipe atualizada.');render()},
 'stp-abrir':id=>stpForm(id,stMeses().includes(S.mes)?S.mes:stMeses().slice(-1)[0]),
 'srm-arq':id=>{M.arq.splice(+id,1);stFileList();stLive()},
 'stp-salvar':()=>{
  const {pid,m}=M.sp,p=D.equipe.find(x=>x.id===pid),pg=stLeitura(),obs=$('#sob').value.trim(),er=[];
  const dif=stItens(p).filter(i=>pg[i.k].v>0&&Math.abs(pg[i.k].v-i.prev)>0.004);
  if(dif.length&&!obs)er.push('Informe na observação por que o valor pago difere do previsto ('+dif.map(i=>i.nome).join(', ')+').');
  stItens(p).forEach(i=>{if(pg[i.k].d&&pg[i.k].d>HOJE)er.push(i.nome+': a data do pagamento não pode ser futura.')});
  if(er.length){$('#le').innerHTML=errs(er);return}
  D.staffPC=D.staffPC||{};D.staffPC[m+'|'+pid]={pago:pg,arq:M.arq,obs};
  reg('Equipe','Comprovantes de '+p.nome+' em '+mesNome(m)+' atualizados ('+stComp(p,m).ok+' de '+stComp(p,m).tot+' itens comprovados)');
  fechar();toast('Prestação de '+p.nome+' salva.');render()},
 'st-enviar':()=>{const m=S.mes;D.staffMes=D.staffMes||{};D.staffMes[m]={st:'em_analise',parecer:''};reg('Equipe','Prestação da equipe de '+mesNome(m)+' enviada ao analista');toast('Prestação da equipe enviada.');render()},
 'st-aprovar':()=>modal('Aprovar prestação da equipe — '+mesNome(S.mes),'<label class="f" for="pp">Parecer</label><textarea id="pp" rows="3"></textarea>','<button class="btn" data-a="fechar">Cancelar</button><button class="btn p" data-a="st-aprovar-ok">Aprovar</button>'),
 'st-aprovar-ok':()=>{const m=S.mes;D.staffMes[m]={st:'aprovada',parecer:$('#pp').value.trim()||'Conferida pelo analista.'};reg('Equipe','Prestação da equipe de '+mesNome(m)+' aprovada');fechar();toast('Prestação da equipe aprovada.');render()},
 'st-devolver':()=>modal('Devolver prestação da equipe — '+mesNome(S.mes),'<div id="le"></div><label class="f" for="pp">O que precisa ser corrigido</label><textarea id="pp" rows="3"></textarea>','<button class="btn" data-a="fechar">Cancelar</button><button class="btn d" data-a="st-devolver-ok">Devolver</button>'),
 'st-devolver-ok':()=>{const t=$('#pp').value.trim();if(!t){$('#le').innerHTML=errs(['Explique o que deve ser corrigido.']);return}const m=S.mes;D.staffMes[m]={st:'devolvida',parecer:t};reg('Equipe','Prestação da equipe de '+mesNome(m)+' devolvida: '+t);fechar();toast('Prestação devolvida para correção.');render()},
 'vagas-edit':()=>modal('Vagas da equipe (staff)','<div id="le"></div><label class="f" for="vg">Quantas pessoas podem ser contratadas para a equipe deste projeto?</label><input type="number" min="0" step="1" id="vg" value="'+(D.staffMax||0)+'"><div class="small muted">É o limite previsto no projeto. O sistema impede cadastrar mais pessoas ativas do que isso.</div>','<button class="btn" data-a="fechar">Cancelar</button><button class="btn p" data-a="vagas-salvar">Salvar</button>'),
 'vagas-salvar':()=>{const n=parseInt($('#vg').value,10);if(!(n>=0)){$('#le').innerHTML=errs(['Informe um número de vagas (0 ou mais).']);return}if(n<stOcup()){$('#le').innerHTML=errs(['Há '+stOcup()+' pessoas ativas: registre desligamentos antes de reduzir as vagas para '+n+'.']);return}const a=D.staffMax||0;D.staffMax=n;regCad('Vagas da equipe (staff) alteradas',String(a),String(n));fechar();toast('Vagas salvas.');render()}
};
