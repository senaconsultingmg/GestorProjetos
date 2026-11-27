/* ---------- ações ---------- */
const STG={sfi:'sft',fi:'ft',di:'dt',pcf:'pct',pdi:'pdt',pfi:'pff'};
function stageShow(t){const old=document.getElementById('stg-'+t.id);if(old)old.remove();if(!t.files.length)return;const nm=[...t.files].map(f=>esc(f.name)).join(', ');const d=document.createElement('div');d.id='stg-'+t.id;d.className='row';d.style.cssText='margin-top:6px;gap:6px;align-items:center';d.innerHTML='<span class="small muted" style="flex:1">📎 '+t.files.length+' arquivo(s) selecionado(s): '+nm+'. Confira a categoria e clique em Enviar.</span><button class="btn p" type="button" data-a="arq-enviar" data-id="'+t.id+'">Enviar</button><button class="btn" type="button" data-a="arq-cancel" data-id="'+t.id+'">Cancelar</button>';t.closest('.row').insertAdjacentElement('afterend',d)}
function lancSalvar(modo){
 const o={v:$('#lv1').value,i:$('#li').value,tipo:$('#lt').value,data:$('#ld').value,desc:$('#ls').value.trim(),forn:$('#lf').value,valor:parseFloat($('#lv').value)||0,conta:contaDe(itemDe($('#li').value),verbaDe($('#lv1').value)),cc:ccDe(itemDe($('#li').value),verbaDe($('#lv1').value))};
 if(bloqI(o.i)&&!(M.id)){$('#le').innerHTML=errs(['Este item está bloqueado e não aceita lançamentos.']);return}
 if($('#fi')&&$('#fi').files.length){$('#le').innerHTML=errs(['Há arquivo selecionado que ainda não foi enviado. Escolha a categoria e clique em “Enviar” (ou cancele a seleção).']);return}
 const docs={nf:0,comp:0,foto:0};M.arq.forEach(x=>docs[x.t]=1);
 const tmp=Object.assign({},o,{docs}),er=[];let rem=false;
 let cot=null;
 if(reqCot(tmp)){
  if($('#cdis').checked){cot={dispensa:true,just:$('#cjust').value.trim(),justSt:'pendente',itens:[]};if(!cot.just&&modo==='lancar')er.push('Escreva a justificativa para não ter 3 cotações.')}
  else{const old=(M.id&&D.lanc.find(x=>x.id===M.id)||{}).cot,sel=document.querySelector('input[name=cesc]:checked'),esc0=sel?+sel.value:null;const it=[0,1,2].map(k=>{const fl=$('#cq'+k).files[0],ant=old&&old.itens&&old.itens[k]&&old.itens[k].arq;return{f:$('#cf'+k).value,v:parseFloat($('#cv'+k).value)||0,arq:fl?FN(fl):(ant||'')}});cot={dispensa:false,just:'',justSt:'',itens:it,esc:esc0};
   if(modo==='lancar'){if(it.some(x=>!x.f||x.v<=0))er.push('Informe fornecedor e preço dos 3 orçamentos.');else if(new Set(it.map(x=>x.f)).size<3)er.push('Os 3 orçamentos precisam ser de fornecedores diferentes.');else if(it.some(x=>!x.arq))er.push('Anexe o arquivo de cada um dos 3 orçamentos.');else if(esc0==null)er.push('Marque qual orçamento foi o escolhido.');else if(it[esc0].f!==o.forn)er.push('O prestador do lançamento precisa ser o do orçamento escolhido ('+provDe(it[esc0].f).nome+').')}}
 }
 if(modo==='lancar'){
  if(!o.desc)er.push('Descreva o lançamento.');if(!o.forn)er.push('Escolha o prestador ou fornecedor.');if(o.valor<=0)er.push('Informe o valor.');
  if(o.data<exI()||o.data>exF())er.push('A data está fora do período de execução do projeto ('+fd(exI())+' a '+fd(exF())+').');else if(o.data>HOJE)er.push('A data não pode ser futura: lance só o que já foi realizado.');
  faltaDocs(tmp).forEach(k=>er.push('Falta anexar: '+DOCL[k]+'.'));
  const sv=saldoVerba(verbaDe(o.v),M.id);if(o.valor>sv){er.push('O valor excede o saldo da verba em '+brl(o.valor-sv)+'. Solicite um remanejamento entre verbas antes de lançar.');rem=true}
 }
 if(o.data&&travado(o.data.slice(0,7)))er.push('O mês '+mesNome(o.data.slice(0,7))+' está travado: não aceita lançamentos.');
 if(M.id){const l0=D.lanc.find(x=>x.id===M.id);if(l0&&travado(mesDe(l0)))er.push('O lançamento está em um mês travado.')}
 if(er.length){$('#le').innerHTML=errs(er)+(rem?'<button class="btn sm" data-a="rem-novo">Solicitar remanejamento</button>':'');return}
 let l=M.id&&D.lanc.find(x=>x.id===M.id);const antes=l?{v:l.valor,d:l.data,i:l.i,desc:l.desc}:null;
 if(!l){l={id:nid('L',D.lanc),hist:[]};D.lanc.push(l)}
 Object.assign(l,o,{docs,arq:M.arq.map(x=>x.n),arqT:Object.fromEntries(M.arq.map(x=>[x.n,x.t])),cot});
 if(modo==='lancar'){l.st='lancado';lg(l,'Lançou',cot&&cot.dispensa?'Sem 3 cotações: justificativa enviada ao gestor do contrato.':'')}else{l.st='rascunho';lg(l,'Salvou rascunho')}
 if(modo==='lancar'){if(!antes)reg('Lançamento',l.id+' lançado: '+l.desc+' ('+ctx(l)+', '+fd(l.data)+')','',brl(l.valor));else{const dif=[];if(antes.v!==l.valor)dif.push('valor');if(antes.d!==l.data)dif.push('data');if(antes.i!==l.i)dif.push('item');if(antes.desc!==l.desc)dif.push('descrição');reg('Lançamento',l.id+' editado ('+(dif.join(', ')||'comprovantes/dados')+')',brl(antes.v)+' · '+fd(antes.d),brl(l.valor)+' · '+fd(l.data));lg(l,'Editou',dif.join(', '))}}
 S.open[o.v]=true;fechar();toast(modo==='lancar'?'Lançado: o valor ficou reservado no orçamento (em análise).':'Rascunho salvo.');render();
}
function fimProjeto(){return}
document.addEventListener('click',e=>{
 const t=e.target.closest('[data-a]');if(!t)return;
 const a=t.dataset.a,id=t.dataset.id;
 if(a==='fechar-bg'){if(e.target===t)fechar();return}
 if(t.tagName==='SELECT'||(t.tagName==='INPUT'&&t.type!=='button'))return;
 if(STAFF_ACT[a]){STAFF_ACT[a](id,t);return}
 switch(a){
  case'acessos':S.view='acessos';S.ax='usuarios';render();break;
  case'ax':S.ax=id;render();break;
  case'user-novo':userForm();break;
  case'user-edit':userForm(id);break;
  case'user-salvar':{const n=$('#un').value.trim(),em=$('#ue').value.trim().toLowerCase(),pa=$('#up').value,td=$('#utd').checked,pj=[...document.querySelectorAll('.upj:checked')].map(x=>x.value),er=[];if(!n)er.push('Informe o nome.');if(!/^\S+@\S+\.\S+$/.test(em))er.push('Informe um e-mail válido.');if(USUARIOS.some(u=>u.email===em&&u.id!==id))er.push('Já existe um usuário com esse e-mail.');if(!pa)er.push('Escolha o perfil do usuário.');if(!td&&!pj.length)er.push('Escolha ao menos um projeto, ou marque todos.');if(id&&id===S.role&&!perfilDe(pa).funcs.includes('acessos_admin'))er.push('Você não pode tirar de si mesmo a administração de acessos.');if(er.length){$('#le').innerHTML=errs(er);break}
   const pr=td?'todos':pj;if(id){const u=USUARIOS.find(x=>x.id===id),ant=perfilDe(u.perfil).nome;Object.assign(u,{nome:n,email:em,perfil:pa,projetos:pr});ACLOG.push({q:HOJE,quem:who(),txt:'Usuário alterado: '+n+' ('+ant+' → '+perfilDe(pa).nome+')'});fechar();fillRole();render();break}
   const sp=senhaProv();USUARIOS.push({id:'U'+(USUARIOS.length+1),nome:n,email:em,perfil:pa,projetos:pr,ativo:true});ACLOG.push({q:HOJE,quem:who(),txt:'Usuário criado: '+n+' com o perfil '+perfilDe(pa).nome});fechar();fillRole();render();senhaModal(n,sp);break}
  case'user-tog':{const u=USUARIOS.find(x=>x.id===id);u.ativo=!u.ativo;ACLOG.push({q:HOJE,quem:who(),txt:(u.ativo?'Usuário reativado: ':'Usuário inativado: ')+u.nome});fillRole();render();break}
  case'user-reset':{const u=USUARIOS.find(x=>x.id===id),sp=senhaProv();ACLOG.push({q:HOJE,quem:who(),txt:'Nova senha provisória gerada para '+u.nome});senhaModal(u.nome,sp);break}
  case'perfil-novo':perfilForm();break;
  case'perfil-edit':perfilForm(id);break;
  case'perfil-grupo':{const bx=[...document.querySelectorAll('#pg'+id+' .pfn')],all=bx.every(x=>x.checked);bx.forEach(x=>x.checked=!all);break}
  case'perfil-salvar':{const n=$('#pn').value.trim(),fs=[...document.querySelectorAll('.pfn:checked')].map(x=>x.value),er=[];if(!n)er.push('Informe o nome do cargo.');if(PERFIS.some(p=>p.nome.toLowerCase()===n.toLowerCase()&&p.id!==id))er.push('Já existe um perfil com esse nome.');if(!fs.length)er.push('Marque ao menos uma função.');
   const admOk=PERFIS.map(p=>p.id===id?{funcs:fs}:p).some(p=>p.funcs.includes('acessos_admin')&&USUARIOS.some(u=>u.ativo&&(PERFIS.find(x=>x.id===u.perfil)||{}).funcs&&(u.perfil===id?fs:perfilDe(u.perfil).funcs)===p.funcs));if(id&&!fs.includes('acessos_admin')&&!USUARIOS.some(u=>u.ativo&&u.perfil!==id&&perfilDe(u.perfil).funcs.includes('acessos_admin')))er.push('Ao menos um usuário ativo precisa manter a função de administrar acessos.');if(er.length){$('#le').innerHTML=errs(er);break}
   if(id){const p=PERFIS.find(x=>x.id===id),ant=p.funcs.length;Object.assign(p,{nome:n,funcs:fs});ACLOG.push({q:HOJE,quem:who(),txt:'Perfil alterado: '+n+' ('+ant+' → '+fs.length+' funções)'})}else{PERFIS.push({id:'PF'+(PERFIS.length+1),nome:n,funcs:fs});ACLOG.push({q:HOJE,quem:who(),txt:'Perfil criado: '+n+' ('+fs.length+' funções)'})}fechar();fillRole();render();break}
  case'perfil-del':{if(USUARIOS.some(u=>u.perfil===id)){toast('Há usuários neste perfil. Mude o perfil deles antes de excluir.');break}const p=PERFIS.find(x=>x.id===id);PERFIS.splice(PERFIS.indexOf(p),1);ACLOG.push({q:HOJE,quem:who(),txt:'Perfil excluído: '+p.nome});render();break}
  case'orc-full':S.orcFull=!S.orcFull;render();break;
  case'idoc-add':$('#idl').insertAdjacentHTML('beforeend',docLinha({nome:'',obrig:false},true));break;
  case'idoc-rm':t.closest('.idr').remove();break;
  case'rel-novo':relForm();break;
  case'rel-gerar':{const ac=$('#rac').value,de=$('#rde').value,ate=$('#rat').value,er=[];if(!de||!ate)er.push('Informe o período.');else if(de>ate)er.push('O início do período é depois do fim.');if(er.length){$('#le').innerHTML=errs(er);break}S.rel={ac,de,ate};fechar();render();window.scrollTo(0,0);break}
  case'rel-voltar':S.rel=null;render();break;
  case'rel-print':window.print();break;
  case'dest-novo':destForm();break;
  case'dest-conf':destForm(id);break;
  case'dest-salvar':{const tp=id?DESTINOS.find(x=>x.id===id).tipo:$('#dtp').value,cm=DEST_TIPOS[tp].campos,nome=$('#dnm').value.trim(),pasta=$('#dpa').value.trim(),er=[];if(!nome)er.push('Dê um nome ao destino.');if(!pasta)er.push('Informe o modelo de pastas.');const p={};cm.forEach(c=>{const v=($('#dc_'+c[0])||{}).value||'';p[c[0]]=v});if(er.length){$('#le').innerHTML=errs(er);break}
   if(id){const d=DESTINOS.find(x=>x.id===id);Object.keys(p).forEach(k=>{if(p[k]!==''||!/segredo/.test(k))d.p[k]=p[k]});d.nome=nome;d.pasta=pasta;d.st='';ACLOG.push({q:HOJE,quem:who(),txt:'Destino de arquivos alterado: '+nome+' (precisa testar a conexão de novo)'})}else{DESTINOS.push({id:'DS'+(DESTINOS.length+1)+Math.floor(Math.random()*90+10),tipo:tp,nome,p,pasta,st:'',testado:''});ACLOG.push({q:HOJE,quem:who(),txt:'Destino de arquivos adicionado: '+nome})}fechar();render();break}
  case'dest-testar':{const d=DESTINOS.find(x=>x.id===id),falta=DEST_TIPOS[d.tipo].campos.filter(c=>c[3]&&!d.p[c[0]]).map(c=>c[1]);if(falta.length){d.st='erro';d.erro='Faltam: '+falta.join('; ');d.testado=HOJE}else{d.st='ok';d.erro='';d.testado=HOJE+' '+new Date().toTimeString().slice(0,5)}ACLOG.push({q:HOJE,quem:who(),txt:'Teste de conexão: '+d.nome+' → '+(d.st==='ok'?'ok':'erro')});render();break}
  case'dest-princ':{const d=DESTINOS.find(x=>x.id===id);if(d.st!=='ok'){toast('Teste a conexão antes de usar este destino como principal.');break}const ant=destPrincipal();ARMAZ.principal=id;if(ARMAZ.copia===id)ARMAZ.copia='';ACLOG.push({q:HOJE,quem:who(),txt:'Destino principal: '+(ant?ant.nome:'—')+' → '+d.nome+'. Arquivos já salvos continuam onde estão.'});render();break}
  case'dest-copia':{const d=DESTINOS.find(x=>x.id===id);if(d.st!=='ok'){toast('Teste a conexão antes de usar este destino como cópia.');break}if(ARMAZ.principal===id){toast('O destino principal não pode ser a própria cópia.');break}ARMAZ.copia=id;ACLOG.push({q:HOJE,quem:who(),txt:'Cópia de segurança: '+d.nome});render();break}
  case'dest-copia-off':ARMAZ.copia='';ACLOG.push({q:HOJE,quem:who(),txt:'Cópia de segurança desligada'});render();break;
  case'dest-del':{if(ARMAZ.principal===id||ARMAZ.copia===id){toast('Troque o principal ou a cópia antes de remover este destino.');break}const d=DESTINOS.find(x=>x.id===id);DESTINOS.splice(DESTINOS.indexOf(d),1);ACLOG.push({q:HOJE,quem:who(),txt:'Destino de arquivos removido: '+d.nome});render();break}
  case'pf':S.pf=id;render();break;
  case'abrir':D=PROJ.find(p=>p.id===id);S.view='proj';S.tab=(D.etapa==='exec'||D.etapa==='enc')?'resumo':'cad';S.mes='2026-11';render();window.scrollTo(0,0);break;
  case'nav-tog':document.body.classList.toggle('navopen');break;
  case'lista':S.view='lista';render();break;
  case'tab':S.tab=id;render();window.scrollTo(0,0);break;
  case'fechar':fechar();break;
  case'proj-novo':projNovo();break;
  case'proj-criar':{const n=$('#pn').value.trim();if(!n){$('#le').innerHTML=errs(['Informe o nome do projeto.']);break}const p=mkVazio(n);p.id='P'+(PROJ.length+1);PROJ.push(p);D=p;S.view='proj';S.tab='cad';fechar();toast('Projeto criado na etapa de Elaboração.');render();break}
  case'rec-edit':recEdit();break;
  case'conta-nova':contaForm();break;
  case'conta-edit':contaForm(id);break;
  case'cc-edit':ccForm(id);break;
  case'conta-tog':{const c=D.contas.find(x=>x.id===id);c.ativa=c.ativa===false;regCad((c.ativa?'Conta reativada: ':'Conta inativada: ')+c.nome,c.ativa?'Inativa':'Ativa',c.ativa?'Ativa':'Inativa');render();break}
  case'cc-tog':{const c=D.cc.find(x=>x.id===id);c.ativa=c.ativa===false;regCad((c.ativa?'Centro de custo reativado: ':'Centro de custo inativado: ')+c.nome,c.ativa?'Inativo':'Ativo',c.ativa?'Ativo':'Inativo');render();break}
  case'item-bloq':bloqForm(id);break;
  case'item-bloq-ok':{const j=$('#bj').value.trim();if(!j){$('#le').innerHTML=errs(['Informe a justificativa do bloqueio.']);break}const it=D.verbas.flatMap(v=>v.itens).find(x=>x.id===id),cur=HOJE.slice(0,7);const fn=()=>{Object.keys(it.mensal||{}).forEach(m=>{if(m>=cur&&!travado(m)){it.mensal[m]=sum(lv(l=>l.i===id&&mesDe(l)===m&&(l.st==='aprovado'||l.st==='lancado')).map(l=>l.valor))}});it.bloq={data:HOJE,quem:who(),just:j}};fechar();comMud('Item bloqueado: '+it.nome,fn,'Ativo','Bloqueado — '+j);break}
  case'item-desbloq':{const it=D.verbas.flatMap(v=>v.itens).find(x=>x.id===id);comMud('Item desbloqueado: '+it.nome,()=>{it.bloq=null},'Bloqueado','Ativo (previsões não são restauradas; edite o item para reprogramar)');break}
  case'conta-salvar':{const b=$('#cb').value.trim(),ag=$('#cag').value.trim(),nu=$('#cnu').value.trim(),ob=$('#cob').value.trim();if(!b||!ag||!nu){$('#le').innerHTML=errs(['Informe banco, agência e conta.']);break}const nome=b+' · Ag. '+ag+' · C/C '+nu;if(id){const c=D.contas.find(x=>x.id===id),ant=c.nome;Object.assign(c,{banco:b,ag,num:nu,obs:ob,nome});regCad('Conta bancária alterada',ant,nome)}else{D.contas.push({id:nid('C',D.contas),banco:b,ag,num:nu,obs:ob,nome,ativa:true});regCad('Conta bancária cadastrada: '+nome)}fechar();render();break}
  case'cc-novo':ccForm();break;
  case'cc-salvar':{const cd=$('#ccn').value.trim(),ds=$('#ccd').value.trim();if(!cd||!ds){$('#le').innerHTML=errs(['Informe o número e a descrição do centro de custo.']);break}if(D.cc.some(x=>x.id!==id&&x.cod===cd)){$('#le').innerHTML=errs(['Já existe um centro de custo com esse número.']);break}const nome=cd+' · '+ds;if(id){const c=D.cc.find(x=>x.id===id),ant=c.nome;Object.assign(c,{cod:cd,desc:ds,nome});regCad('Centro de custo alterado',ant,nome)}else{D.cc.push({id:nid('CC',D.cc),cod:cd,desc:ds,nome,ativa:true});regCad('Centro de custo cadastrado: '+nome)}fechar();render();break}
  case'etapa-avancar':{if(D.etapa==='param'){execForm();break}const p={elab:'param'},ant=D.etapa;D.etapa=p[D.etapa];regCad('Etapa concluída: '+ETAPAS.find(x=>x[0]===ant)[1].slice(4),ETAPAS.find(x=>x[0]===ant)[1].slice(4),ETAPAS.find(x=>x[0]===D.etapa)[1].slice(4));toast('Etapa concluída. O projeto agora está em '+ETAPAS.find(x=>x[0]===D.etapa)[1].slice(4)+'.');render();window.scrollTo(0,0);break}
  case'exec-ok':{const a=$('#x1').value,b=$('#x2').value,er=[];if(!a||!b)er.push('Informe início e fim da execução.');else if(a>b)er.push('O fim da execução é anterior ao início.');if(er.length){$('#le').innerHTML=errs(er);break}D.exIni=a;D.exFim=b;D.etapa='exec';D.vis=visPadrao(D.verbas);D.prest[a.slice(0,7)]=D.prest[a.slice(0,7)]||{st:'aberta',parecer:''};D.prest[HOJE.slice(0,7)]=D.prest[HOJE.slice(0,7)]||{st:'aberta',parecer:''};S.mes=HOJE.slice(0,7);regCad('Execução iniciada',ETAPAS[1][1].slice(4),'Execução de '+fd(a)+' a '+fd(b));fechar();toast('Execução iniciada.');render();window.scrollTo(0,0);break}
  case'enc-ini':encIni();break;
  case'enc-ini-ok':{D.etapa='enc';D.enc=D.enc||{};regCad('Encerramento iniciado: etapas anteriores bloqueadas','Execução','Encerramento');fechar();S.tab='cad';toast('Encerramento iniciado. Etapas anteriores bloqueadas.');render();window.scrollTo(0,0);break}
  case'enc-saldo':{D.enc.saldo=apuraSaldo();regCad('Saldo final apurado: '+$$(D.enc.saldo.saldoFinal));render();break}
  case'enc-fim':encFim();break;
  case'enc-fim-ok':{if(!reqEtapa('enc').every(r=>r[1])){fechar();break}D.enc.em=HOJE;D.ativo=false;regCad('Projeto encerrado: passou de ativo para inativo','Ativo','Inativo');fechar();toast('Projeto encerrado e inativado.');S.view='lista';S.pf='ativos';render();window.scrollTo(0,0);break}
  case'pat-novo':patForm();break;
  case'pat-edit':patForm(id);break;
  case'pat-ver':patDet(id);break;
  case'pat-rem':patRem(id);break;
  case'pat-salvar':{const d=$('#pd').value.trim(),n=$('#pn2').value.trim(),l=$('#pl').value.trim(),da=$('#pda').value,er=[];if(!d)er.push('Informe a descrição do bem.');if(!n)er.push('Informe o número de patrimônio (fornecido pelo sistema de patrimônio).');else if(D.bens.some(b=>b.num===n&&b.id!==id))er.push('Esse número de patrimônio já está cadastrado.');if(!l)er.push('Informe o local onde o bem está lotado.');if(!da)er.push('Informe a data de aquisição.');if(er.length){$('#le').innerHTML=errs(er);break}
   const nv={desc:d,num:n,local:l,status:$('#ps').value,lanc:$('#pc2').value,dataAq:da};
   if(id){const b=D.bens.find(x=>x.id===id),lb={desc:'Descrição',num:'Nº de patrimônio',local:'Local',status:'Status',lanc:'Compra de origem',dataAq:'Data de aquisição'};Object.keys(nv).forEach(k=>{if(nv[k]!==b[k]){b.hist.push({q:HOJE,quem:who(),campo:lb[k],ant:String(b[k]||'—'),dep:String(nv[k]||'—')});reg('Patrimônio',lb[k]+' do bem '+b.num+' alterado',String(b[k]||'—'),String(nv[k]||'—'));b[k]=nv[k]}});toast('Bem atualizado.');fechar();patDet(id);break}
   const b=Object.assign({id:'PT'+(D.bens.length+1),fotos:[],docs:[],rem:null,hist:[{q:HOJE,quem:who(),campo:'Cadastro',ant:'—',dep:'Bem cadastrado'}]},nv);D.bens.push(b);reg('Patrimônio','Bem cadastrado: '+n+' · '+d);fechar();toast('Bem cadastrado.');render();break}
  case'pat-rem-ok':{const b=D.bens.find(x=>x.id===id),dt=$('#rd1').value,ds=$('#rd2').value.trim(),mo=$('#rd3').value.trim(),er=[];if(!dt)er.push('Informe a data da remoção.');if(!ds)er.push('Informe para onde o bem foi.');if(!mo)er.push('Informe o motivo.');if(er.length){$('#le').innerHTML=errs(er);break}const fo=$('#rd4').files[0];b.rem={data:dt,destino:ds,motivo:mo};if(fo)b.fotos.push({fase:'Remoção',n:FN(fo)});const ant=b.status+' · '+b.local;b.status='Removido';b.local='Removido — '+ds;b.hist.push({q:dt,quem:who(),campo:'Status',ant:ant,dep:'Removido → '+ds+', '+fd(dt)});reg('Patrimônio','Bem '+b.num+' removido para '+ds);fechar();patDet(id);break}
  case'acao-nova':acaoForm();break;
  case'acao-salvar':{const n=$('#an').value.trim(),m=lerMeta('');if(!n||!m.nome||!m.alvo){$('#le').innerHTML=errs(['Informe o nome da ação e a primeira meta (nome e alvo). Toda ação precisa de uma meta.']);break}D.acoes.push({id:'AC'+D.acoes.length,nome:n,tipo:$('#at').value,metas:[Object.assign({id:'M'+(D.acoes.reduce((s,x)=>s+x.metas.length,0)+1)},m)]});fechar();toast('Ação criada com sua meta.');render();break}
  case'meta-nova':metaForm(id);break;
  case'meta-salvar':{const m=lerMeta('');if(!m.nome||!m.alvo){$('#le').innerHTML=errs(['Informe a meta e o alvo.']);break}acaoDe(id).metas.push(Object.assign({id:'M'+(D.acoes.reduce((s,x)=>s+x.metas.length,0)+1)},m));fechar();render();break}
  case'mais':fechar();lancForm(null,itemVerba(id),id,t.dataset.m);break;
  case'cel':celDet(id,t.dataset.m);break;
  case'verba':S.open[id]=S.open[id]===false;render();break;
  case'rem-novo':fechar();remForm();break;
  case'rem-enviar':{const de=$('#rd').value,pa=$('#rp').value,m=$('#rm').value,v=parseFloat($('#rv').value)||0,j=$('#rj').value.trim(),er=[];if(itemVerba(de)===itemVerba(pa))er.push('Para itens da mesma verba não é preciso remanejar: o saldo é livre. Escolha itens de verbas diferentes.');if(v<=0)er.push('Informe o valor.');if(travado(m))er.push('O mês '+mesNome(m)+' está travado: não aceita remanejamento.');if(v>mOrc(itemDe(de),m))er.push('O item de origem tem só '+brl(mOrc(itemDe(de),m))+' orçados em '+mesNome(m)+'.');if(!j)er.push('Escreva a justificativa.');if(er.length){$('#le').innerHTML=errs(er);break}D.rem.push({id:nid('R',D.rem),de,para:pa,mes:m,valor:v,just:j,st:'pendente',por:who(),data:HOJE});fechar();toast('Solicitação enviada ao gestor do contrato.');S.tab='orc';render();break}
  case'verba-nova':verbaForm(t.dataset.k);break;
  case'verba-edit':verbaForm(t.dataset.k,id);break;
  case'verba-salvar':{const k=t.dataset.k,n=$('#vn').value.trim(),d=$('#vd').value.trim(),foto=k!=='r'&&$('#vf').checked,vc=$('#vc').value,vk=$('#vk').value;if(!n||!vc||!vk){$('#le').innerHTML=errs([!n?'Informe o nome.':'Cadastre e escolha a conta bancária e o centro de custo (Cadastro → Parametrização).']);break}
   const g=id?(k==='r'?D.receitas:D.verbas).find(x=>x.id===id):null;
   const ap=()=>{if(g){g.nome=n;g.desc=d;g.conta=vc;g.cc=vk;if(k!=='r')g.foto=foto}else if(k==='r')D.receitas.push({id:'RV'+(D.receitas.length+1),nome:n,desc:d,conta:vc,cc:vk,itens:[]});else{const nv={id:nid('V',D.verbas),nome:n,desc:d,foto,conta:vc,cc:vk,itens:[]};D.verbas.push(nv);}fechar();render()};
   comMud((g?'Verba “':'Nova verba “')+n+(k==='r'?'” (receita)':'”'),ap);break}
  case'item-novo':itemForm(t.dataset.k);break;
  case'item-edit':itemForm(t.dataset.k,id);break;
  case'item-salvar':{const k=t.dataset.k,r=k==='r',cotMed=!r&&$('#icm').checked,n=$('#in').value.trim(),v=parseFloat($('#io').value)||0,rec=$('#im').value,mes=$('#imm').value,gid=$('#iv').value,nota=$('#inota').value.trim(),ic=$('#ic').value,ik=$('#ik').value,rend=r&&$('#irend').checked,ms=mesesProj(),er=[];if(!ic||!ik)er.push('Cadastre e escolha a conta bancária e o centro de custo.');if(rend&&!$('#irm').value)er.push('Escolha o que fazer com o rendimento: somar ao orçamento ou reservar até o fim do contrato.');let cot=null,cotJust=null;if(!r){cot=[];[...document.querySelectorAll('#cotl .cr')].forEach(row=>{const fn=row.querySelector('.cf').value.trim(),vl=parseFloat(row.querySelector('.cv').value)||0,fl=row.querySelector('.ca').files[0],a0=row.querySelector('.ca0');const arq=fl?FN(fl):(a0?a0.textContent:'');if(fn||vl||arq){if(!fn||vl<=0||!arq)er.push('Orçamento incompleto: informe fornecedor, valor e o anexo'+(fn?' ('+fn+')':'')+'.');else cot.push({forn:fn,valor:vl,txt:row.querySelector('.ct').value.trim(),arq})}});if(new Set(cot.map(c=>c.forn.toLowerCase())).size<cot.length)er.push('Cada orçamento precisa ser de um fornecedor diferente.');const jt=$('#cjt').value.trim();if(cot.length<3){if(!jt)er.push('Há '+cot.length+' orçamento(s): informe a justificativa por não haver 3.');else{const ex0=id&&D.verbas.flatMap(v=>v.itens).find(x=>x.id===id);cotJust=(ex0&&ex0.cotJust&&ex0.cotJust.txt===jt&&ex0.cotJust.st==='aprovada')?ex0.cotJust:{txt:jt,st:'pendente',por:'',data:''}}}}
   const grupos=r?D.receitas:D.verbas,ex=id?grupos.flatMap(g=>g.itens).find(x=>x.id===id):null;
   if(!ms.length)er.push('Preencha o período do projeto (Recebimento) antes de montar o orçamento.');if(!n)er.push('Informe o item.');const docsReq=r?undefined:docsLer();if(!r){const nn=docsReq.map(d=>d.nome.toLowerCase());if(new Set(nn).size<nn.length)er.push('Há documentos repetidos na lista.')}if(v<=0)er.push('Informe o valor.');
   const pi=$('#ipi').value,pf=$('#ipf').value;if(rec==='mensal'&&pi>pf)er.push('O mês inicial do item é depois do final.');const mensal=ms.length&&v>0?mkMensal(rec,v,mes,ms.filter(m=>rec!=='mensal'||(m>=pi&&m<=pf))):{};
   if(rec==='unico'&&travado(mes)&&!(ex&&ex.mensal[mes]!=null))er.push('O mês '+mesNome(mes)+' está travado: não dá para incluir orçado nele.');
   if(ex&&ex.rec==='unico'&&travado(ex.mes)&&mes!==ex.mes)er.push('O valor atual está em '+mesNome(ex.mes)+', mês travado: não pode ser movido.');
   Object.keys(D.trava).forEach(m=>{if(ex&&ex.mensal[m]!=null)mensal[m]=ex.mensal[m];else delete mensal[m]});
   if(ex&&!r){const lj=sum(lv(l=>l.i===id&&(l.st==='aprovado'||l.st==='lancado')).map(l=>l.valor));if(sum(Object.values(mensal))<lj-0.005)er.push('O novo orçado total ('+brl(sum(Object.values(mensal)))+') fica abaixo do que já foi lançado neste item ('+brl(lj)+').')}
   if(er.length){$('#le').innerHTML=errs(er);break}
   const antT=ex?brl(sum(Object.values(ex.mensal))):'',depT=brl(sum(Object.values(mensal)));
   const rendMod=rend?$('#irm').value:undefined;const ap=()=>{const g=grupos.find(x=>x.id===gid);if(ex){const og=grupos.find(x=>x.itens.includes(ex));if(og!==g){og.itens.splice(og.itens.indexOf(ex),1);g.itens.push(ex);if(!r)D.lanc.filter(l=>l.i===ex.id).forEach(l=>l.v=gid)}Object.assign(ex,{nome:n,rec,valor:v,mes:rec==='unico'?mes:undefined,nota,mensal,conta:ic,cc:ik,rend,rendMod,cot,cotJust,cotMed,docsReq,ini:rec==='mensal'?pi:undefined,fim:rec==='mensal'?pf:undefined})}else g.itens.push({id:(r?'RI':'I')+Math.floor(Math.random()*90000+10000)+'x',nome:n,rec,valor:v,mes:rec==='unico'?mes:undefined,nota,mensal,conta:ic,cc:ik,rend,rendMod,cot,cotJust,cotMed,docsReq,ini:rec==='mensal'?pi:undefined,fim:rec==='mensal'?pf:undefined});S.open[gid]=true;fechar();render()};
   comMud((ex?'Item “':'Novo item “')+n+'” ('+(rec==='mensal'?brl(v)+' por mês':brl(v)+' em '+mesNome(mes))+')'+(r?' — receita':''),ap,antT,depT);break}
  case'mud-ok':mudOk();break;
  case'rec-salvar':{const ini=$('#r6').value,fim=$('#r7').value,ei=$('#r6e')?$('#r6e').value:(D.exIni||''),ef=$('#r7e')?$('#r7e').value:(D.exFim||''),er=[];
   if(ini&&fim&&ini>fim)er.push('O fim do período do projeto é anterior ao início.');if(ei&&ef&&ei>ef)er.push('O fim da execução é anterior ao início.');
   if(D.ini&&ini&&fim&&(ini!==D.ini||fim!==D.fim))er.push(...checaPeriodo(ini,fim));
   if(er.length){$('#le').innerHTML=errs(er);break}
   const nt=$('#r5n').value.trim(),v={r1:$('#r1').value.trim(),r2:$('#r2').value.trim(),r3:$('#r3').value.trim(),r4:$('#r4').value,r5:nt||$('#r5').value,r8:$('#r8').value.trim()};
   const mud=D.etapa==='exec'&&D.ini&&(ini!==D.ini||fim!==D.fim||ei!==(D.exIni||'')||ef!==(D.exFim||''));
   const ap=()=>{const ant0=[D.respElab,D.pat,D.instr,D.tipo,D.ini&&fd(D.ini)+'–'+fd(D.fim),D.objetivo].join(' | ');D.respElab=v.r1;D.pat=v.r2;D.instr=v.r3;D.codigos=v.r4.split('\n').map(x=>x.trim()).filter(Boolean).map(x=>{const k=x.indexOf(':');return k>0?{rot:x.slice(0,k).trim(),v:x.slice(k+1).trim()}:{rot:'Código',v:x}});if(nt&&!TIPOS.includes(nt))TIPOS.push(nt);D.tipo=v.r5;if(D.ini&&(ini!==D.ini||fim!==D.fim))aplicaPeriodo(ini,fim);D.ini=ini;D.fim=fim;if(D.etapa==='exec'){D.exIni=ei||ini;D.exFim=ef||fim}D.objetivo=v.r8;regCad('Dados do cadastro alterados',ant0,[D.respElab,D.pat,D.instr,D.tipo,fd(D.ini)+'–'+fd(D.fim),D.objetivo].join(' | '));fechar();toast('Dados salvos.'+(nt?' Novo tipo criado: '+nt+'.':''));render()};
   if(mud)comMud('Período/execução alterados',ap,fd(D.ini)+' a '+fd(D.fim)+' · exec. '+fd(D.exIni||D.ini)+' a '+fd(D.exFim||D.fim),fd(ini)+' a '+fd(fim)+' · exec. '+fd(ei||ini)+' a '+fd(ef||fim));else ap();break}
  case'rem-ok':case'rem-no':{const r=D.rem.find(x=>x.id===id);if(a==='rem-ok'){if(travado(r.mes)){toast('Mês travado: não é possível aprovar remanejamento nele.');break}const todos=D.verbas.flatMap(v=>v.itens),src=todos.find(i=>i.id===r.de),dst=todos.find(i=>i.id===r.para);src.mensal[r.mes]=(src.mensal[r.mes]||0)-r.valor;dst.mensal[r.mes]=(dst.mensal[r.mes]||0)+r.valor;r.st='aprovado';D.ver++;D.vers.push({v:D.ver,q:HOJE,quem:who(),desc:'Remanejamento '+r.id+' aprovado: '+brl(r.valor)+' de '+src.nome+' para '+dst.nome+' ('+mesNome(r.mes)+').'});reg('Versão','v'+D.ver+': remanejamento '+r.id+' aprovado ('+src.nome+' → '+dst.nome+', '+mesNome(r.mes)+')',brl(r.valor)+' em '+src.nome,brl(r.valor)+' em '+dst.nome)}else{r.st='recusado';reg('Orçamento','Remanejamento '+r.id+' recusado')}toast(a==='rem-ok'?'Remanejamento aprovado: orçado atualizado e projeto na versão v'+D.ver+'.':'Remanejamento recusado.');render();break}
  case'lanc-apr':{const l=D.lanc.find(x=>x.id===id);if(travado(mesDe(l))){toast('Mês travado.');break}l.st='aprovado';lg(l,'Aprovou',$('#mo').value);reg('Lançamento',l.id+' aprovado ('+ctx(l)+')','',brl(l.valor));fechar();toast('Lançamento aprovado: o valor virou executado.');render();break}
  case'lanc-dev':{const l=D.lanc.find(x=>x.id===id),m=$('#mo').value.trim();if(travado(mesDe(l))){toast('Mês travado.');break}if(!m){$('#le').innerHTML=errs(['Explique o motivo da devolução.']);break}l.st='devolvido';lg(l,'Devolveu',m);reg('Lançamento',l.id+' devolvido: '+m);fechar();toast('Devolvido ao assistente.');render();break}
  case'lanc-excl':exclForm(id);break;
  case'lanc-excl-ok':{const l=D.lanc.find(x=>x.id===id),m=$('#xm').value.trim();if(!m){$('#le').innerHTML=errs(['Informe o motivo da exclusão.']);break}if(travado(mesDe(l))){$('#le').innerHTML=errs(['Mês travado.']);break}D.lanc.splice(D.lanc.indexOf(l),1);reg('Lançamento',l.id+' excluído ('+l.desc+', '+ctx(l)+'): '+m,brl(l.valor),'—');fechar();toast('Lançamento excluído. Fica registrado no histórico.');render();break}
  case'trava':travaForm(t.dataset.m,travado(t.dataset.m));break;
  case'trava-ok':{const m=t.dataset.m;if(t.dataset.u){if(!has('trava')){$('#le').innerHTML=errs(['Você não tem permissão para destravar.']);break}const j=$('#tj').value.trim();if(!j){$('#le').innerHTML=errs(['Informe o motivo.']);break}delete D.trava[m];reg('Trava','Destravou '+mesNome(m)+': '+j)}else{D.trava[m]={por:who(),q:HOJE};reg('Trava','Travou '+mesNome(m))}fechar();toast(t.dataset.u?'Mês destravado.':mesNome(m)+' travado.');render();break}
  case'rcb-novo':rcbForm(id,t.dataset.m);break;
  case'rcb-salvar':{const i=$('#rci').value,d=$('#rcd').value,v=parseFloat($('#rcv').value)||0,s=$('#rcs').value.trim(),arq=[...$('#rcf').files].map(x=>FN(x)),er=[];
   if(!d||d<exI()||d>exF())er.push('A data está fora do período de execução.');else if(d>HOJE)er.push('A data não pode ser futura.');if(d&&travado(d.slice(0,7)))er.push('O mês '+mesNome(d.slice(0,7))+' está travado.');if(v<=0)er.push('Informe o valor.');if(!s)er.push('Descreva o recebimento.');if(!arq.length)er.push('Anexe o comprovante (extrato ou recibo).');if(!podeRcb(rDe(i)))er.push(rDe(i).rend?'Rendimentos são informados pelo setor financeiro.':'Seu perfil não registra este recebimento.');
   if(er.length){$('#le').innerHTML=errs(er);break}{const it=rDe(i),g=D.receitas.find(x=>x.id===it.vid);D.rcb.push({id:nid('RC',D.rcb),i,data:d,valor:v,desc:s,quem:who(),arq,conta:contaDe(it,g),cc:ccDe(it,g)})};reg('Recebimento','Recebimento '+s+' ('+(rDe(i)||{}).nome+', '+fd(d)+')','',brl(v));fechar();toast('Recebimento registrado.');render();break}
  case'rcel':rcelDet(id,t.dataset.m);break;
  case'rcb-excl':{const x=D.rcb.find(y=>y.id===id);if(travado(rMes(x))){toast('Mês travado.');break}D.rcb.splice(D.rcb.indexOf(x),1);reg('Recebimento','Recebimento '+x.id+' excluído ('+x.desc+')',brl(x.valor),'—');fechar();toast('Recebimento excluído.');render();break}
  case'hlog':S.fLog=id;render();break;
  case'altab':S.alTab=id;render();break;
  case'turma-nova':turmaForm();break;
  case'turma-edit':turmaForm(id);break;
  case'turma-salvar':{const c=$('#tc').value.trim(),lt=$('#tl').value.trim().toUpperCase(),mx=parseInt($('#tm').value)||0,cu=$('#tcu').value,pf=$('#tp').value.trim(),ti=$('#ti').value,tf=$('#tf').value,al=[...document.querySelectorAll('.tal:checked')].map(x=>x.value),er=[];
   if(!c)er.push('Informe o código da turma.');if(!lt)er.push('Informe a letra da turma (A, B, C…).');if(mx<1)er.push('Informe a quantidade máxima de alunos.');if(!cu)er.push('Escolha o curso.');if(!pf)er.push('Informe o professor.');if(!ti)er.push('Informe a data de início da turma.');if(ti&&tf&&tf<ti)er.push('A previsão de término é anterior ao início.');if(mx&&al.length>mx)er.push('A turma tem '+al.length+' alunos marcados e o máximo é '+mx+'.');
   if(D.turmas.some(x=>x.cod===c&&x.id!==id))er.push('Já existe uma turma com esse código.');if(lt&&cu&&D.turmas.some(x=>x.id!==id&&x.curso===cu&&x.letra===lt))er.push('Já existe a turma '+lt+' neste curso.');if(er.length){$('#le').innerHTML=errs(er);break}
   const nome=acaoDe(cu).nome+' — Turma '+lt,d={cod:c,letra:lt,max:mx,curso:cu,prof:pf,ini:ti,fim:tf,h1:$('#th1').value,h2:$('#th2').value,dias:$('#td').value.trim(),obs:$('#to').value.trim(),nome,alunos:al};
   if(id)Object.assign(D.turmas.find(x=>x.id===id),d);else D.turmas.push(Object.assign({id:'T'+(D.turmas.length+1)+'x'},d));fechar();toast('Turma salva.');render();break}
  case'saida-form':saidaForm(id);break;
  case'saida-ok':{const a=D.alunos.find(x=>x.id===id),d=$('#sd').value,m=$('#sm').value.trim(),tp=(document.querySelector('input[name=stp]:checked')||{}).value;if(!d||d<a.entrada){$('#le').innerHTML=errs(['A data não pode ser antes da entrada.']);break}if(!m){$('#le').innerHTML=errs(['Informe o motivo.']);break}
   if(tp==='transf'){const dt=D.turmas.find(x=>x.id===$('#std').value),v=vagasT(dt);if(v.vagas===0){$('#le').innerHTML=errs(['A turma de destino está lotada.']);break}const orig=D.turmas.filter(t=>t.alunos.includes(id));orig.forEach(t=>t.alunos=t.alunos.filter(x=>x!==id));dt.alunos.push(id);a.hist.push({q:d,quem:who(),txt:'Transferido de '+(orig.map(t=>t.cod).join(', ')||'—')+' para '+dt.cod+': '+m});fechar();toast('Aluno transferido para '+dt.cod+'. A vaga na turma de origem foi aberta.');render();break}
   a.saida=d;a.motivoSaida=m;a.hist.push({q:d,quem:who(),txt:'Saída do projeto: '+m});fechar();toast('Saída registrada. A vaga nas turmas dele foi aberta.');render();break}
  case'aluno-reativar':{const a=D.alunos.find(x=>x.id===id);const ant=a.saida;a.pausas=(a.pausas||[]).concat({de:ant,ate:HOJE});delete a.saida;delete a.motivoSaida;a.hist.push({q:HOJE,quem:who(),txt:'Reativado (saída anterior em '+fd(ant)+')'});toast('Aluno reativado.');alunoDet(id);render();break}
  case'insc-form':inscForm(id);break;
  case'insc-ok':{const s=inscForm.sel(),novos=s.filter(a=>!a.acoes.includes(id));if(!novos.length){$('#le').innerHTML=errs(['Ninguém a inscrever: todos já estão nesta ação.']);break}novos.forEach(a=>{a.acoes.push(id);a.insc=a.insc||{};a.insc[id]=HOJE;a.hist.push({q:HOJE,quem:who(),txt:'Inscrito em: '+acaoDe(id).nome})});fechar();toast(novos.length+' aluno(s) inscrito(s) na ação.');render();break}
  case'ac-aluno':S.acAluno=id;S.acF='';D.logAcesso.push({q:fd(HOJE)+' '+new Date().toTimeString().slice(0,5),quem:who(),aluno:D.alunos.find(x=>x.id===id).mat+' (prontuário)'});render();break;
  case'ac-abrir':fechar();S.tab='acomp';S.acAluno=id;S.acF='';D.logAcesso.push({q:fd(HOJE)+' '+new Date().toTimeString().slice(0,5),quem:who(),aluno:D.alunos.find(x=>x.id===id).mat+' (prontuário)'});render();break;
  case'ac-f':S.acF=id;render();break;
  case'ac-novo':acForm();break;
  case'ac-salvar':{const d=$('#acd').value,c1=$('#ac1').value.trim(),c2=$('#ac2').value.trim();if(!d||d>HOJE){$('#le').innerHTML=errs(['Informe uma data válida (não futura).']);break}if(!c1&&!c2){$('#le').innerHTML=errs(['Escreva ao menos uma observação.']);break}D.acomp.push({id:'PR'+(D.acomp.length+1),aluno:S.acAluno,tipo:meuTipo(),data:d,autor:who(),c1,c2});fechar();toast('Registro salvo no prontuário.');render();break}
  case'pc-abrir':S.pcAcao=id;render();window.scrollTo(0,0);break;
  case'pc-voltar':pcColeta();S.pcAcao=null;render();break;
  case'pc-fmt':document.execCommand(id,false,null);break;
  case'pc-img':{const e=$('#pce');if(e)e.focus();$('#pci').click();break}
  case'pc-rm':{pcColeta();pcDe(acaoDe(S.pcAcao)).anexos.splice(+id,1);render();break}
  case'pc-salvar':{pcColeta();toast('Rascunho salvo.');break}
  case'pc-enviar':{pcColeta();const a=acaoDe(S.pcAcao),p=pcDe(a),er=[];const tem=p.anexos.length||p.html.replace(/<[^>]*>/g,'').trim()||/<img/.test(p.html);
   if(a.tipo==='generico'){if(!tem)er.push('Escreva o texto ou anexe ao menos um arquivo antes de enviar.')}
   else if(a.tipo==='evento'){if(!D.cal.some(e=>e.acao===a.id&&e.st==='realizada'))er.push('O evento ainda não tem uma data registrada como realizada no calendário.');if(!tem)er.push('Inclua o texto e/ou anexos que comprovam a realização do evento.')}
   else if(!D.cal.some(e=>e.acao===a.id&&e.tipo==='aula'&&e.st==='realizada'))er.push('Ainda não há aulas realizadas nesta ação.');
   if(er.length){$('#le').innerHTML=errs(er);break}p.st='enviada';p.hist.push({q:HOJE,quem:who(),acao:'Enviou para análise',txt:''});reg('Prestação da ação',a.id+' · '+a.nome+': enviada para análise');toast('Enviada ao analista.');render();break}
  case'pc-apr':{const a=acaoDe(S.pcAcao),p=pcDe(a);p.st='aprovada';p.hist.push({q:HOJE,quem:who(),acao:'Aprovou',txt:''});reg('Prestação da ação',a.id+' · '+a.nome+': aprovada');toast('Prestação da ação aprovada.');render();break}
  case'pc-dev':{const a=acaoDe(S.pcAcao),p=pcDe(a),m=$('#pcm').value.trim();if(!m){$('#le').innerHTML=errs(['Explique o motivo da devolução.']);break}p.st='devolvida';p.hist.push({q:HOJE,quem:who(),acao:'Devolveu',txt:m});reg('Prestação da ação',a.id+' · '+a.nome+': devolvida — '+m);toast('Devolvida para correção.');render();break}
  case'cot-add':$('#cotl').insertAdjacentHTML('beforeend',cotLinha());cotVis();break;
  case'cot-del':{t.closest('.cr').remove();cotVis();break}
  case'cot-det':cotDet(id);break;
  case'cot-apr':{const it=D.verbas.flatMap(v=>v.itens).find(x=>x.id===id);it.cotJust.st='aprovada';it.cotJust.por=who();it.cotJust.data=HOJE;reg('Orçamento','Justificativa de orçamentos aprovada: '+it.nome);fechar();toast('Justificativa aprovada.');render();break}
  case'cot-rec':{const it=D.verbas.flatMap(v=>v.itens).find(x=>x.id===id);it.cotJust.st='recusada';reg('Orçamento','Justificativa de orçamentos recusada: '+it.nome);fechar();toast('Justificativa recusada: a coordenação precisa anexar os orçamentos.');render();break}
  case'crit-form':critForm();break;
  case'crit-add':$('#crl').insertAdjacentHTML('beforeend',critLinha());critTot();break;
  case'crit-del':{t.closest('.cl').remove();critTot();break}
  case'crit-salvar':{const ls=[...document.querySelectorAll('#crl .cl')].map((r,k)=>({id:r.dataset.id||('c'+Date.now()%10000+k),nome:r.querySelector('.cn').value.trim(),peso:parseFloat(r.querySelector('.cp').value)||0})),er=[];if(!ls.length)er.push('Inclua ao menos um critério.');if(ls.some(c=>!c.nome))er.push('Todo critério precisa de nome.');if(ls.some(c=>c.peso<=0))er.push('Todo critério precisa de peso maior que zero.');if(sum(ls.map(c=>c.peso))!==100)er.push('Os pesos precisam somar 100% (hoje somam '+sum(ls.map(c=>c.peso))+'%).');if(er.length){$('#le').innerHTML=errs(er);break}
   const ant=D.criterios.map(c=>c.nome+' '+c.peso+'%').join(' · ');D.criterios=ls;regCad('Critérios da auditoria alterados',ant,ls.map(c=>c.nome+' '+c.peso+'%').join(' · '));fechar();toast('Critérios salvos.');render();break}
  case'lanc':lancDet(D.lanc.find(x=>x.id===id));break;
  case'lanc-novo':lancForm(null,id);break;
  case'lanc-edit':lancForm(D.lanc.find(x=>x.id===id));break;
  case'lanc-salvar':lancSalvar(id);break;
  case'arq-enviar':{const i=document.getElementById(id);if(i&&i.files&&i.files.length){i._go=true;i.dispatchEvent(new Event('change',{bubbles:true}));i._go=false}const w=document.getElementById('stg-'+id);if(w)w.remove();break}
  case'arq-cancel':{const i=document.getElementById(id);if(i)i.value='';const w=document.getElementById('stg-'+id);if(w)w.remove();break}
  case'rm-arq':M.arq.splice(+id,1);fileList();lancLive();break;
  case'aval':{modal('Avaliar prestador','<label class="f" for="av">Nota de 1 a 5</label><select id="av"><option>5</option><option>4</option><option>3</option><option>2</option><option>1</option></select>','<button class="btn" data-a="fechar">Cancelar</button><button class="btn p" data-a="aval-ok" data-id="'+id+'">Salvar</button>');break}
  case'aval-ok':{D.lanc.find(x=>x.id===id).aval=+$('#av').value;fechar();toast('Avaliação registrada.');render();break}
  case'just-ok':case'just-no':{const l=D.lanc.find(x=>x.id===id);l.cot.justSt=a==='just-ok'?'aprovada':'recusada';lg(l,a==='just-ok'?'Justificativa de cotação aprovada':'Justificativa de cotação recusada');toast(a==='just-ok'?'Justificativa aprovada.':'Justificativa recusada: o assistente precisará anexar 3 cotações.');if(a==='just-no')l.st='devolvido';render();break}
  case'prest-enviar':D.prest[S.mes].st='em_analise';toast('Prestação enviada ao analista.');render();break;
  case'prest-aprovar':modal('Aprovar prestação — '+mesNome(S.mes),'<label class="f" for="pp">Parecer</label><textarea id="pp" rows="3"></textarea>','<button class="btn" data-a="fechar">Cancelar</button><button class="btn p" data-a="prest-ok">Aprovar prestação</button>');break;
  case'prest-ok':D.prest[S.mes].st='aprovada';D.prest[S.mes].parecer=$('#pp').value||'Conferida pelo analista.';fechar();toast('Prestação aprovada.');render();break;
  case'rel-copiar':{const tx=relTexto(S.mes);try{navigator.clipboard.writeText(tx).then(()=>toast('Texto copiado.'),()=>mostra(tx))}catch(x){mostra(tx)}break}
  case'dia':diaForm(id);break;
  case'aula-form':fechar();aulaForm(id);break;
  case'evento-form':fechar();eventoForm(id);break;
  case'aula-salvar':{const ac=$('#ac').value,datas=datasPeriodo(),h1=$('#ah').value,h2=$('#ah2').value,er=[];if(!datas.length)er.push('Nenhuma data no período escolhido.');if(!h1||!h2||h2<=h1)er.push('O término precisa ser depois do início.');
   const dup=datas.filter(d=>D.cal.some(x=>x.data===d&&x.acao===ac&&x.tipo==='aula'));if(dup.length)er.push('Já existe aula desta ação em: '+dup.slice(0,6).map(fd).join(', ')+(dup.length>6?'…':'')+'.');if(er.length){$('#le').innerHTML=errs(er);break}
   datas.forEach(d=>D.cal.push({id:nid('E',D.cal),data:d,tipo:'aula',acao:ac,inst:$('#ai').value,hora:h1,hfim:h2,local:$('#al').value,pres:[],notas:{},fotos:0,docs:[],obs:'',st:'prevista'}));D.cal.sort((x,y)=>x.data.localeCompare(y.data));fechar();toast(datas.length+' aula(s) cadastrada(s) no calendário.');S.cal=datas[0].slice(0,7);render();break}
  case'evento-salvar':{const ac=$('#ac').value,datas=datasPeriodo(),h1=$('#ah').value,h2=$('#ah2').value,er=[];if(!datas.length)er.push('Nenhuma data no período escolhido.');if(!h1||!h2||h2<=h1)er.push('O término precisa ser depois do início.');if(er.length){$('#le').innerHTML=errs(er);break}
   datas.forEach(d=>D.cal.push({id:nid('E',D.cal),data:d,tipo:'acao',acao:ac,inst:$('#ai').value,hora:h1,hfim:h2,local:$('#al').value,pres:[],notas:{},fotos:0,docs:[],obs:'',st:'prevista'}));D.cal.sort((x,y)=>x.data.localeCompare(y.data));fechar();toast(datas.length+' data(s) cadastrada(s) no calendário.');S.cal=datas[0].slice(0,7);render();break}
  case'ev':evDet(id);break;
  case'ev-salvar':{const ev=D.cal.find(x=>x.id===id);ev.st='realizada';ev.obs=$('#eo').value;ev.fotos=M.fotos||0;ev.docs=M.docNames||[];if(ev.tipo==='aula'){const al=alunosAcao(ev.acao,ev.data).map(x=>x.id);ev.pres=M.pres.filter(x=>al.includes(x));ev.notas={};ev.pres.forEach(x=>{const n=parseInt($('#n_'+x).value)||0;ev.notas[x]={n:n||3,obs:$('#o_'+x).value}})}ev.comp=(ev.tipo==='aula'&&ev.pres.length>0)||ev.docs.length>0;fechar();toast(ev.comp?'Ação salva: comprovação lançada (✓ no calendário).':'Registro salvo — sem presença nem anexo: ainda não conta como comprovação.');render();break}
  case'ev-cancelar':case'ev-remarcar':{const ev=D.cal.find(x=>x.id===id),m=$('#em').value.trim(),nd=$('#ed').value;if(!m){$('#le').innerHTML=errs(['Informe o motivo.']);break}if(a==='ev-remarcar'){if(!nd){$('#le').innerHTML=errs(['Informe a nova data.']);break}ev.obs='Remarcada de '+fd(ev.data)+': '+m;ev.data=nd;toast('Remarcado para '+fd(nd)+'.')}else{ev.st='cancelada';ev.motivo=m;toast('Cancelado com justificativa.')}D.cal.sort((x,y)=>x.data.localeCompare(y.data));fechar();render();break}
  case'cal-ant':case'cal-prox':{let [y,m]=S.cal.split('-').map(Number);m+=a==='cal-prox'?1:-1;if(m<1){m=12;y--}if(m>12){m=1;y++}S.cal=y+'-'+String(m).padStart(2,'0');render();break}
  case'aluno':alunoDet(id);break;
  case'aluno-novo':alunoNovo();break;
  case'aluno-salvar':{const n=$('#nn').value.trim(),s=$('#ns').value.trim(),acs=[...document.querySelectorAll('.nac:checked')].map(x=>x.value),er=[];if(!n||!s)er.push('Informe o nome completo e o nome social.');if(!acs.length)er.push('Marque ao menos uma ação em que participará.');if(er.length){$('#le').innerHTML=errs(er);break}const en=$('#nen').value||HOJE,id='a'+(D.alunos.length+1),cat=$('#ncat').value,ins={AC0:en};acs.forEach(x=>ins[x]=en);const al={id,mat:'M-2026-'+String(D.alunos.length+1).padStart(3,'0'),cat,social:s,nome:n,nasc:$('#nd').value||'2015-01-01',end:$('#ne').value,bairro:'—',resp:$('#nr').value,tel:$('#nt').value,termo:$('#nc').checked,entrada:en,foto:alFoto||'',docsP:alDocs.map(d=>({nome:d.nome,tipo:d.tipo,q:HOJE,quem:who()})),hist:[{q:en,quem:who(),txt:'Entrada no projeto como '+(cat==='atendido'?'atendido':'aluno')+' em: '+acs.join(', ')}],insc:ins,acoes:['AC0'].concat(acs)};D.alunos.push(al);if($('#ntu').value)D.turmas.find(t=>t.id===$('#ntu').value).alunos.push(id);fechar();toast((cat==='atendido'?'Atendido':'Aluno')+' cadastrado com a matrícula '+al.mat+'.');render();break}
  case'aldoc-rm':alDocs.splice(+id,1);alDocLista();break;
  case'pdoc-add':{const al=D.alunos.find(x=>x.id===id),fs=PDOC.files||[];if(!fs.length){toast('Escolha o arquivo primeiro.');break}fs.forEach(x=>{(al.docsP=al.docsP||[]).push({nome:FN(x),tipo:PDOC.tipo,q:HOJE,quem:who()})});al.hist.push({q:HOJE,quem:who(),txt:'Documento anexado na área restrita: '+PDOC.tipo});D.logAcesso.push({q:fd(HOJE)+' '+new Date().toTimeString().slice(0,5),quem:who(),aluno:al.mat+' (documento anexado)'});toast('Documento anexado.');dadosModal(id);break}
  case'pdoc-ver':{const al=D.alunos.find(x=>x.id===id),dc=al.docsP[+t.dataset.i];D.logAcesso.push({q:fd(HOJE)+' '+new Date().toTimeString().slice(0,5),quem:who(),aluno:al.mat+' (abriu '+dc.tipo+')'});toast('Abertura registrada: '+dc.tipo+' — '+dc.nome);break}
  case'pdoc-rm':{const al=D.alunos.find(x=>x.id===id);al.docsP.splice(+t.dataset.i,1);dadosModal(id);break}
  case'aluno-inscrever':{const al=D.alunos.find(x=>x.id===id);al.acoes.push($('#ma').value);al.insc=al.insc||{};al.insc[$('#ma').value]=HOJE;al.hist.push({q:HOJE,quem:who(),txt:'Inscrito em: '+acaoDe($('#ma').value).nome});toast('Aluno inscrito na ação.');alunoDet(id);render();break}
  case'dados-senha':senhaForm(id);break;
  case'dados-abrir':{if($('#sn').value!==SENHA){$('#le').innerHTML=errs(['Senha incorreta.']);break}const al=D.alunos.find(x=>x.id===id);D.logAcesso.push({q:fd(HOJE)+' '+new Date().toTimeString().slice(0,5),quem:who(),aluno:al.mat});dadosModal(id);break}
  case'log-acesso':modal('Registro de acessos aos dados protegidos','<p class="muted small" style="margin-top:0">Quem consultou os dados pessoais, quando e de qual aluno.</p>'+D.logAcesso.slice().reverse().map(x=>'<div class="chk"><b>'+esc(x.q)+'</b> · '+esc(x.quem)+' · aluno '+esc(x.aluno)+'</div>').join(''),'<button class="btn" data-a="fechar">Fechar</button>');break;
  case'prov-novo':modal('Novo prestador','<label class="f" for="pn">Nome</label><input id="pn"><label class="f" for="pc">Categoria</label><input id="pc" placeholder="Ex.: Fornecedor de material"><label class="f" for="pd">CNPJ / CPF</label><input id="pd"><div id="le"></div>','<button class="btn" data-a="fechar">Cancelar</button><button class="btn p" data-a="prov-salvar">Salvar</button>');break;
  case'prov-salvar':{const n=$('#pn').value.trim();if(!n){$('#le').innerHTML=errs(['Informe o nome.']);break}D.prov.push({id:'P'+(D.prov.length+1),nome:n,cat:$('#pc').value||'—',doc:$('#pd').value||'—'});fechar();render();break}
  case'aud-novo':audForm();break;
  case'nc-add':ncAdd();break;
  case'aud-salvar':{const f=$('#aa').files[0];if(!f){$('#le').innerHTML=errs(['Anexe o relatório completo da auditoria.']);break}const mes=$('#am').value,notas={};D.criterios.forEach(c=>notas[c.id]=+$('#nt_'+c.id).value);if(D.criterios.some(c=>!notas[c.id])){$('#le').innerHTML=errs(['Dê uma nota de 1 a 5 para todos os critérios.']);break}
   for(let k=1;k<=M.nc;k++){const d=$('#nd'+k);if(d&&d.value.trim())D.nc.push({id:nid('N',D.nc),desc:d.value.trim(),grav:$('#ng'+k).value,prazo:$('#np'+k).value,st:'aberta',origem:'Auditoria de '+mesNome(mes),corr:''})}
   D.aud.push({id:nid('AU',D.aud),mes,data:HOJE,auditor:userAtual().nome,anexo:FN(f),notas,obs:$('#ao').value.split('\n').map(x=>x.trim()).filter(Boolean)});fechar();toast('Relatório registrado. Indicador: '+nf1(nota(notas))+' de 5.');render();break}
  case'div-novo':fechar();modal('Abrir divergência — '+id,'<label class="f" for="dt">O que está divergente</label><textarea id="dt" rows="3"></textarea><label class="f" for="dp">Prazo para resposta</label><input type="date" id="dp" value="'+addDias(HOJE,5)+'"><div id="le"></div>','<button class="btn" data-a="fechar">Cancelar</button><button class="btn p" data-a="div-salvar" data-id="'+id+'">Abrir divergência</button>');break;
  case'div-salvar':{const tx=$('#dt').value.trim();if(!tx){$('#le').innerHTML=errs(['Descreva a divergência.']);break}D.div.push({id:nid('D',D.div),l:id,texto:tx,por:who(),abertaEm:HOJE,prazo:$('#dp').value,st:'aberta',resp:''});fechar();toast('Divergência aberta: o assistente será avisado.');render();break}
  case'div-resp':modal('Responder divergência '+id,'<label class="f" for="dr">Resposta</label><textarea id="dr" rows="3"></textarea><div id="le"></div>','<button class="btn" data-a="fechar">Cancelar</button><button class="btn p" data-a="div-resp-ok" data-id="'+id+'">Enviar resposta</button>');break;
  case'div-resp-ok':{const tx=$('#dr').value.trim();if(!tx){$('#le').innerHTML=errs(['Escreva a resposta.']);break}const d=D.div.find(x=>x.id===id);d.resp=tx;d.st='respondida';fechar();toast('Resposta enviada ao auditor.');render();break}
  case'div-fim':D.div.find(x=>x.id===id).st='encerrada';toast('Divergência encerrada.');render();break;
  case'div-reabrir':D.div.find(x=>x.id===id).st='aberta';toast('Divergência reaberta.');render();break;
  case'nc-corr':modal('Registrar correção','<label class="f" for="nc1">O que foi feito para corrigir</label><textarea id="nc1" rows="3"></textarea>','<button class="btn" data-a="fechar">Cancelar</button><button class="btn p" data-a="nc-corr-ok" data-id="'+id+'">Registrar</button>');break;
  case'nc-corr-ok':{const n=D.nc.find(x=>x.id===id);n.corr=$('#nc1').value||'Corrigida.';n.st='correcao';fechar();toast('Correção registrada: aguardando o auditor.');render();break}
  case'nc-fim':D.nc.find(x=>x.id===id).st='encerrada';toast('Não conformidade encerrada.');render();break;
 }
});
function mostra(tx){modal('Texto do relatório','<textarea rows="14" readonly style="font-family:monospace;font-size:12px">'+esc(tx)+'</textarea>','<button class="btn" data-a="fechar">Fechar</button>')}
document.addEventListener('change',e=>{if(e.target.type==='file'&&e.target.files&&e.target.files.length&&!e.target._go)setTimeout(()=>procArqs(e.target.files),30);if(e.target.classList&&e.target.classList.contains('tal'))turmaForm.vg();
 const t=e.target;
 if(t.type==='file'&&STG[t.id]&&!t._go){stageShow(t);return}
 if(t.id==='role'){S.role=t.value;const u=userAtual();if(S.view==='acessos'&&!has('acessos_admin'))S.view='lista';if(S.view==='proj'&&u.projetos!=='todos'&&!u.projetos.includes(D.id))S.view='lista';render();return}
 if(t.classList&&t.classList.contains('idu')){const o=t.closest('.idr').querySelector('.ido');o.disabled=!t.checked;if(!t.checked)o.checked=false;return}
 if(t.id==='dtp'){$('#dcm').innerHTML=destForm.campos(t.value);return}
 if(t.id==='irend'){$('#irmw').style.display=t.checked?'':'none';return}
 if(t.id==='utd'){$('#upl').style.display=t.checked?'none':'';return}
 if(t.dataset&&t.dataset.a==='mes'){S.mes=t.value;render();return}
 if(t.dataset&&t.dataset.a==='presc'){setTimeout(evBtn,0);const i=M.pres.indexOf(t.dataset.id);if(t.checked&&i<0)M.pres.push(t.dataset.id);if(!t.checked&&i>=0)M.pres.splice(i,1);const on=t.checked;['n_','o_'].forEach(p=>{const el=$('#'+p+t.dataset.id);if(el)el.disabled=!on});return}
 if(t.id==='sfi'){stAnexa(t);return}
 if(t.id==='fi'){const tp=$('#ft').value;[...t.files].forEach(f=>M.arq.push({n:FN(f),t:tp}));t.value='';fileList();return}
 if(t.id==='ef'){M.fotos=(D.cal.find(x=>x.id===M.id).fotos||0)+t.files.length;$('#efl').textContent=M.fotos+' foto(s) anexada(s)';evBtn();return}
 if(t.id==='edc'){[...t.files].forEach(x=>M.docNames.push(FN(x)));M.docs=M.docNames.length;$('#edl').textContent=M.docNames.join(', ');evBtn();return}
 if(t.id==='ad1'||t.id==='ad2'||(t.classList&&t.classList.contains('adw'))){if(t.id==='ad1'&&$('#ad2').value<t.value)$('#ad2').value=t.value;prevPeriodo();return}
 if(t.id==='lv1'){fillItens();lancLive();return}
 if(['ipi','ipf'].includes(t.id)){itemForm.calc();return}
 if(['li','lt','lc'].includes(t.id)){lancLive();return}
 if(t.id==='di'){[...t.files].forEach(x=>D.docs.push({n:FN(x),t:$('#dt').value}));regCad('Documento carregado ('+$('#dt').value+'): '+FN(t.files[0]));render();return}
 if(t.id==='enr'||t.id==='ent'){const k=t.id==='enr'?'rel':'termo';D.enc=D.enc||{};D.enc[k]={n:FN(t.files[0]),data:HOJE,quem:who()};regCad((k==='rel'?'Relatório de conferência final':'Termo de aprovação')+' anexado: '+FN(t.files[0]));render();return}
 if(t.id==='pfi'||t.id==='pdi'){const b=D.bens.find(x=>x.id===M.pat);[...t.files].forEach(x=>{if(t.id==='pfi'){const fase=$('#pff').value;b.fotos.push({fase,n:FN(x)});b.hist.push({q:HOJE,quem:who(),campo:'Foto ('+fase+')',ant:'—',dep:FN(x)})}else{const tp=$('#pdt').value;b.docs.push({t:tp,n:FN(x)});b.hist.push({q:HOJE,quem:who(),campo:'Documento ('+tp+')',ant:'—',dep:FN(x)})}});reg('Patrimônio','Anexo no bem '+b.num+': '+FN(t.files[0]));patDet(b.id);return}
 if(t.id==='iv'&&$('#ic')){const g=(D.verbas.concat(D.receitas)).find(x=>x.id===t.value);if(g){$('#ic').value=g.conta||$('#ic').value;$('#ik').value=g.cc||$('#ik').value}return}
 if(t.id==='pcf'){pcColeta();const p=pcDe(acaoDe(S.pcAcao)),tp=$('#pct').value;[...t.files].forEach(x=>p.anexos.push({n:FN(x),t:tp}));render();return}
 if(t.id==='pci'){const fs=[...t.files];t.value='';fs.forEach(x=>{const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const k=Math.min(1,800/im.width),cv=document.createElement('canvas');cv.width=Math.max(1,im.width*k);cv.height=Math.max(1,im.height*k);cv.getContext('2d').drawImage(im,0,0,cv.width,cv.height);const e=$('#pce');e.focus();if(pcSel){const s=getSelection();s.removeAllRanges();s.addRange(pcSel)}document.execCommand('insertImage',false,cv.toDataURL('image/jpeg',.8));pcColeta()};im.src=r.result};r.readAsDataURL(x)});return}
 if(t.id==='im'){itemForm.calc();return}
 if(t.id==='alst'){S.alSt=t.value;render();return}
 if(t.id==='alct'){S.alCat=t.value;render();return}
 if(t.id==='afo'&&t.files[0]){const al=D.alunos.find(x=>x.id===t.dataset.id);reduzFoto(t.files[0],u=>{al.foto=u;(al.hist=al.hist||[]).push({q:HOJE,quem:who(),txt:'Foto atualizada'});dadosModal(al.id);toast('Foto salva.')});return}
 if(t.id==='nfo'&&t.files[0]){reduzFoto(t.files[0],u=>{alFoto=u;$('#nfv').innerHTML='<img src="'+u+'" alt="Foto" style="width:100%;height:100%;object-fit:cover">'});return}
 if(t.id==='ndf'){[...t.files].forEach(x=>alDocs.push({nome:FN(x),tipo:$('#ndt').value}));t.value='';alDocLista();return}
 if(t.id==='pdf'){PDOC.files=[...t.files];return}
 if(t.id==='pdt'){PDOC.tipo=t.value;return}
 if(t.name==='io'||t.id==='itu'){inscForm.prev();return}
 if(t.id==='cdis'){$('#cjust').style.display=t.checked?'block':'none';return}
});
document.addEventListener('input',e=>{if(e.target.id==='gs'){gBusca(e.target.value);return}if(e.target.classList&&e.target.classList.contains('spx')){stLive();return}if(e.target.id==='dpa'){$('#dpv').textContent=pastaPrev(e.target.value);return}if(e.target.id==='tm')turmaForm.vg();if(e.target.id==='patq'){S.patQ=e.target.value;const p=e.target.selectionStart;render();const n=$('#patq');if(n){n.focus();n.setSelectionRange(p,p)}return}if(e.target.id==='io')itemForm.calc();if(e.target.id==='acq'){S.acQ=e.target.value;const p=e.target.selectionStart;render();const n=$('#acq');if(n){n.focus();n.setSelectionRange(p,p)}return}if(e.target.id==='lv')lancLive();if(e.target.id==='alq'){S.alunoQ=e.target.value;const p=e.target.selectionStart;render();const n=$('#alq');if(n){n.focus();n.setSelectionRange(p,p)}}});
let pcSel=null;
['mouseup','keyup'].forEach(ev=>document.addEventListener(ev,e=>{if(e.target.closest&&e.target.closest('#pce')){const s=getSelection();if(s.rangeCount)pcSel=s.getRangeAt(0).cloneRange()}}));
document.addEventListener('keydown',e=>{if(e.key==='Escape')fechar()});
fillRole();
render();

document.addEventListener('keydown',e=>{if(e.key==='Escape'&&S.orcFull&&!$('#modal').innerHTML.trim()){S.orcFull=false;render()}});

document.addEventListener('click',e=>{if(!e.target.closest('.sbox')){const r=$('#gsr');if(r)r.style.display='none'}else if(e.target.closest('#gsr button')){setTimeout(()=>{$('#gs').value='';$('#gsr').style.display='none'},0)}});
