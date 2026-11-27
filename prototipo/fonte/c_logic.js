/* ---------- estado e permissões ---------- */
const S={view:'lista',tab:'resumo',role:'gestor',mes:'2026-11',cal:'2026-11',open:{},fSt:'',alunoQ:''};
const R=()=>S.role;
const userAtual=()=>USUARIOS.find(u=>u.id===S.role)||USUARIOS[0];
const perfilDe=id=>PERFIS.find(p=>p.id===id)||{nome:'—',funcs:[]};
const has=f=>perfilDe(userAtual().perfil).funcs.includes(f);
const who=()=>userAtual().nome+' ('+perfilDe(userAtual().perfil).nome.split(' ')[0].toLowerCase()+')';
const MAXNOME=80;
const nomeArq=n=>{const pr=(D.codigos||[]).find(x=>/processo/i.test(x.rot)),raw=String((pr&&pr.v)||D.id||'proj'),num=raw.replace(/^\d{4}[-\/._ ]+/,'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^A-Za-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,20)||'proj',d=new Date(),p=x=>String(x).padStart(2,'0'),st=p(d.getDate())+p(d.getMonth()+1)+d.getFullYear()+p(d.getHours())+p(d.getMinutes());let o=String(n).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^A-Za-z0-9._-]+/g,'_');const k=o.lastIndexOf('.'),ext=k>0&&o.length-k<=6?o.slice(k):'',base=(ext?o.slice(0,k):o).replace(/^[_.-]+/,'')||'arquivo',pre=num+'_'+st+'_';return pre+base.slice(0,Math.max(8,MAXNOME-pre.length-ext.length))+ext};
const FN=f=>nomeArq(f.name);
const podeLancar=()=>!trancado()&&has('lanc');
const podeAgenda=()=>!trancado()&&has('agenda');
const trancado=()=>D.etapa==='enc';
const veTotal=()=>has('ver_valores');
const veVerba=v=>has('ver_valores');
const can=v=>v==null?veTotal():veVerba(v);
const MK='<span class="mask" title="Você não tem permissão para ver este valor">R$ •••••</span>';
const $$=(v,vid)=>can(vid)?brl(v):MK;
const pill=(t,c)=>'<span class="pill '+(c||'')+'">'+esc(t)+'</span>';
const bar=(p,c)=>'<div class="bar '+(c||'')+'"><i style="width:'+Math.max(0,Math.min(100,p*100))+'%"></i></div>';
const chips=a=>a.map(n=>'<span class="chip">'+(/\.(jpg|png|jpeg)$/i.test(n)?'📷 ':'📎 ')+esc(n)+'</span>').join('')||'<span class="muted small">nenhum arquivo</span>';
const lg=(l,acao,txt)=>l.hist.push({q:HOJE,quem:who(),acao,txt:txt||''});
const ST={rascunho:['Rascunho',''],lancado:['Em análise','warn'],aprovado:['Aprovado','ok'],devolvido:['Devolvido','bad']};
const DOCL={nf:'Nota fiscal / recibo',comp:'Comprovante de pagamento',foto:'Foto'};
const TIPOL={compra:'Compra',servico:'Contratação de serviço',folha:'Folha de pagamento',fixo:'Custo fixo / mensalidade'};
const itens=()=>D.verbas.flatMap(v=>v.itens.map(i=>Object.assign({vid:v.id,vnome:v.nome},i)));
const verbaDe=id=>D.verbas.find(v=>v.id===id);
const itemDe=id=>itens().find(i=>i.id===id);
const provDe=id=>(D.prov.find(p=>p.id===id)||{nome:'—'});
const ctx=l=>(verbaDe(l.v)?verbaDe(l.v).nome:'')+' › '+(itemDe(l.i)?itemDe(l.i).nome:'');
const itemOrc=i=>sum(Object.values(i.mensal||{}));
const mOrc=(i,m)=>(i.mensal||{})[m]||0;
const totalOrc=()=>sum(D.verbas.map(v=>sum(v.itens.map(itemOrc))));
function mesesProj(){const r=[];if(!D.ini)return r;let [y,m]=D.ini.split('-').map(Number);const [fy,fm]=D.fim.split('-').map(Number);while(y<fy||(y===fy&&m<=fm)){r.push(y+'-'+String(m).padStart(2,'0'));m++;if(m>12){m=1;y++}}return r}
const lv=(f)=>D.lanc.filter(f);
const exec=f=>sum(lv(l=>l.st==='aprovado'&&f(l)).map(l=>l.valor));
const reserv=f=>sum(lv(l=>l.st==='lancado'&&f(l)).map(l=>l.valor));
const verbaOrc=v=>sum(v.itens.map(itemOrc));
const saldoVerba=(v,ex)=>verbaOrc(v)-sum(lv(l=>l.v===v.id&&l.id!==ex&&(l.st==='aprovado'||l.st==='lancado')).map(l=>l.valor));
const saldoItem=(i,ex)=>itemOrc(i)-sum(lv(l=>l.i===i.id&&l.id!==ex&&(l.st==='aprovado'||l.st==='lancado')).map(l=>l.valor));
const DOCPAD=[{k:'nf',nome:'Nota fiscal / recibo'},{k:'comp',nome:'Comprovante de pagamento'},{k:'foto',nome:'Foto'}];
const docsItem=(iid,vid)=>{const i=itemDe(iid),v=verbaDe(vid||(i&&i.vid));const l=(i&&i.docsReq)||[{k:'nf',nome:DOCPAD[0].nome,obrig:true},{k:'comp',nome:DOCPAD[1].nome,obrig:true},{k:'foto',nome:DOCPAD[2].nome,obrig:!!(v&&v.foto)}];l.forEach(d=>DOCL[d.k]=d.nome);return l};
const exigDocs=l=>docsItem(l.i,l.v).filter(d=>d.obrig).map(d=>d.k);
const faltaDocs=l=>exigDocs(l).filter(k=>!l.docs[k]);
const cotMedI=id=>{const i=itemDe(id);return !!(i&&i.cotMed)};
const cotDispI=id=>{const i=itemDe(id);return !!(i&&(((i.cot||[]).length>=3)||i.cotJust))};
const reqCot=l=>cotMedI(l.i)||((['compra','servico'].includes(l.tipo)&&l.valor>=D.minCot)&&!cotDispI(l.i));
const cotCompleta=l=>!!(l.cot&&!l.cot.dispensa&&l.cot.itens.filter(x=>x.f&&x.v>0).length>=3);
const cotOk=l=>!reqCot(l)||cotCompleta(l)||!!(l.cot&&l.cot.dispensa&&l.cot.justSt==='aprovada');
const mesDe=l=>l.data.slice(0,7);
const prestSt=m=>(D.prest[m]||{st:'aberta'}).st;
const PREST={aberta:['Em preparação',''],em_analise:['Em análise','warn'],aprovada:['Aprovada','ok']};
const acaoDe=id=>D.acoes.find(a=>a.id===id)||{nome:'—',metas:[]};
const noPeriodo=(a,d)=>(!a.entrada||a.entrada<=d)&&(!a.saida||d<=a.saida)&&!(a.pausas||[]).some(p=>d>p.de&&d<p.ate);
const ativo=a=>noPeriodo(a,HOJE)&&!(a.saida&&a.saida<=HOJE);
const contaAtiva=c=>c.ativa!==false;
const vagasT=t=>{const n=t.alunos.map(i=>D.alunos.find(a=>a.id===i)).filter(a=>a&&ativo(a)).length;return{n,max:t.max||0,vagas:t.max?Math.max(0,t.max-n):null}};
const bloqI=id=>{const i=itemDe(id);return i&&i.bloq};
const alunosAcao=(id,d)=>D.alunos.filter(a=>a.acoes.includes(id)&&(!d||noPeriodo(a,d)));
const realizadas=f=>D.cal.filter(e=>e.st==='realizada'&&(!f||f(e)));
const evAcao=id=>D.cal.filter(e=>e.acao===id);
const freqAluno=a=>{const s=realizadas(e=>e.tipo==='aula'&&a.acoes.includes(e.acao)&&noPeriodo(a,e.data));return s.length?s.filter(e=>e.pres.includes(a.id)).length/s.length:0};
const notaAluno=a=>{const ns=realizadas(e=>e.tipo==='aula'&&e.notas[a.id]&&noPeriodo(a,e.data)).map(e=>e.notas[a.id].n);return ns.length?avg(ns):0};
const idade=a=>Math.floor((new Date(HOJE)-new Date(a.nasc))/31557600000);
const freqAcao=id=>{const s=realizadas(e=>e.acao===id&&e.tipo==='aula'),n=alunosAcao(id).length;return s.length&&n?avg(s.map(e=>e.pres.length/n)):0};
function metaProg(m,ac){
 if(m.ind==='aulas'||m.ind==='eventos'){const at=realizadas(e=>e.acao===ac.id).length;return{at,alvo:m.alvo,p:m.alvo?at/m.alvo:0,t:at+' de '+m.alvo}}
 if(m.ind==='alunos')return{at:D.alunos.length,alvo:m.alvo,p:D.alunos.length/m.alvo,t:D.alunos.length+' de '+m.alvo};
 if(m.ind==='freq'){const f=freqAcao(ac.id);return{at:f,alvo:m.alvo,p:f/m.alvo,t:pc(f)+' (meta '+pc(m.alvo)+')'}}

 if(m.ind==='marco'){const ok=(ac.pc&&ac.pc.st==='aprovada')?1:0;return{at:ok,alvo:m.alvo,p:ok/(m.alvo||1),t:ok?'Concluída (prestação aprovada)':'Pendente'}}
 return{at:0,alvo:m.alvo,p:0,t:'—'}}
const catA=a=>a.cat||'aluno',catL=a=>catA(a)==='atendido'?'Atendido':'Aluno';
const TPDOC=['CPF','RG','CNH','Comprovante de residência','Atestado','Certidão','Currículo','Certificado','Outro'];
const iniciais=a=>(a.social||'?').split(' ').map(x=>x[0]).slice(0,2).join('').toUpperCase();
let alDocs=[],alFoto='';
function reduzFoto(file,cb){const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const k=Math.min(1,480/Math.max(im.width,im.height)),cv=document.createElement('canvas');cv.width=Math.max(1,Math.round(im.width*k));cv.height=Math.max(1,Math.round(im.height*k));cv.getContext('2d').drawImage(im,0,0,cv.width,cv.height);cb(cv.toDataURL('image/jpeg',.8))};im.src=r.result};r.readAsDataURL(file)}

function tempoDecorrido(){if(!D.ini)return 0;const i=new Date(D.ini),f=new Date(D.fim),h=new Date(HOJE);return Math.max(0,Math.min(1,(h-i)/(f-i)))}
function toast(m){const t=$('#toast');t.textContent=m;t.style.display='block';clearTimeout(toast.t);toast.t=setTimeout(()=>t.style.display='none',3400)}
function modal(titulo,corpo,rodape){$('#modal').innerHTML='<div class="mo" data-a="fechar-bg"><div class="mb" role="dialog" aria-label="'+esc(titulo)+'"><h2>'+esc(titulo)+'</h2>'+corpo+'<div class="row" style="margin-top:14px;justify-content:flex-end">'+(rodape||'')+'</div></div></div>'}
const fechar=()=>{$('#modal').innerHTML=''};
const errs=a=>a.map(x=>'<div class="alert bad">'+esc(x)+'</div>').join('');

/* ---------- indicador de desempenho ---------- */
const PESOS={acoes:.30,orc:.20,prest:.20,alunos:.20,prov:.10};
const DIMN0={acoes:'Cumprimento das ações e metas',orc:'Execução do orçamento',prest:'Qualidade das prestações de contas',alunos:'Assiduidade e participação dos alunos',prov:'Qualidade dos prestadores'};
const cl=x=>Math.max(1,Math.min(5,x));
function autoNotas(){
 const ps=[];D.acoes.forEach(a=>a.metas.forEach(m=>ps.push(Math.min(1,metaProg(m,a).p))));
 const prevAteHoje=D.cal.filter(e=>e.data<=HOJE&&e.tipo==='aula');
 const cumpr=prevAteHoje.length?prevAteHoje.filter(e=>e.st==='realizada').length/prevAteHoje.length:1;
 const acoes=cl(1+4*(0.5*avg(ps)+0.5*cumpr));
 const pace=tempoDecorrido()?(exec(()=>true)+reserv(()=>true))/totalOrc()/tempoDecorrido():1;
 const orc=cl(pace>=.8&&pace<=1.1?5:pace>=.6&&pace<=1.25?4:pace>=.4&&pace<=1.5?3:2);
 const env=D.lanc.filter(l=>l.st!=='rascunho'),ruins=env.filter(l=>l.st==='devolvido'||D.div.some(d=>d.l===l.id)).length;
 const prest=cl(5-8*(env.length?ruins/env.length:0)-0.4*D.nc.filter(n=>n.st!=='encerrada').length);
 const al=D.alunos.filter(a=>a.acoes.some(x=>x==='AC1'||x==='AC2'));
 const alunos=cl(0.5*(1+4*avg(al.map(freqAluno)))+0.5*(avg(al.map(notaAluno).filter(n=>n>0))||3));
 const av=D.lanc.filter(l=>l.aval).map(l=>l.aval);
 const prov=av.length?cl(avg(av)):3;
 return{acoes,orc,prest,alunos,prov};
}
const nota=n=>{const cs=D.criterios.filter(c=>n[c.id]!=null),t=sum(cs.map(c=>c.peso));return t?sum(cs.map(c=>n[c.id]*c.peso))/t:0};
const notaAtual=()=>D.aud.length?nota(D.aud[D.aud.length-1].notas):0;
const faixaAtual=()=>D.aud.length?faixa(notaAtual()):['Sem auditoria',''];
const itensCot=()=>D.verbas.flatMap(v=>v.itens);
const cotOkItem=i=>(i.cot||[]).length>=3||(i.cotJust&&i.cotJust.st==='aprovada');
const faixa=n=>n>=4.5?['Excelente','ok']:n>=3.5?['Bom','info']:n>=2.5?['Atenção','warn']:['Em risco','bad'];

/* ---------- v3: trava, versão, receitas, histórico ---------- */
const travado=m=>!!(D.trava&&D.trava[m]);
const reg=(tipo,txt,ant,dep)=>{D.log.push({q:HOJE,quem:who(),tipo,txt,ant:ant||'',dep:dep||''})};
const mkMensal=(rec,valor,mes,ms)=>rec==='mensal'?Object.fromEntries(ms.map(m=>[m,valor])):{[mes]:valor};
const rItens=()=>D.receitas.flatMap(v=>v.itens.map(i=>Object.assign({vid:v.id,vnome:v.nome},i)));
const rDe=id=>rItens().find(i=>i.id===id);
const rReal=f=>sum(D.rcb.filter(f).map(x=>x.valor));
const rMes=x=>x.data.slice(0,7);
const exI=()=>D.exIni||D.ini,exF=()=>D.exFim||D.fim;
let MUD=null;
function comMud(resumo,fn,ant,dep,tipo){
 if(D.etapa!=='exec'){fn();reg(tipo||'Orçamento',resumo,ant,dep);return}
 MUD={resumo,fn,ant,dep};
 modal('Alteração do projeto — nova versão v'+(D.ver+1),'<div class="alert info">'+esc(resumo)+'</div><p class="muted small">O projeto está em execução: toda alteração gera uma nova versão. Explique o que mudou e por quê, para facilitar a identificação depois.</p><label class="f" for="md">Descrição da alteração</label><textarea id="md" rows="3" placeholder="Ex.: Aditivo aprovado pelo parceiro em 20/11; incluída verba de transporte."></textarea><div id="le"></div>','<button class="btn" data-a="fechar">Cancelar</button><button class="btn p" data-a="mud-ok">Registrar versão v'+(D.ver+1)+'</button>');
}
function mudOk(){
 const d=$('#md').value.trim();if(!d){$('#le').innerHTML=errs(['Descreva a alteração para registrar a nova versão.']);return}
 const m=MUD;MUD=null;m.fn();D.ver++;D.vers.push({v:D.ver,q:HOJE,quem:who(),desc:d});reg('Versão','v'+D.ver+': '+d+' ('+m.resumo+')',m.ant,m.dep);fechar();toast('Alteração registrada: o projeto agora está na versão v'+D.ver+'.');render();
}

const mesesDe=(ini,fim)=>{const r=[];let [y,m]=ini.split('-').map(Number);const [fy,fm]=fim.split('-').map(Number);while(y<fy||(y===fy&&m<=fm)){r.push(y+'-'+String(m).padStart(2,'0'));m++;if(m>12){m=1;y++}}return r};
function checaPeriodo(ini,fim){
 const ms2=mesesDe(ini.slice(0,7),fim.slice(0,7)),er=new Set();
 Object.keys(D.trava).forEach(m=>{if(!ms2.includes(m))er.add('O mês travado '+mesNome(m)+' ficaria fora do novo período.')});
 D.verbas.concat(D.receitas).forEach(g=>g.itens.forEach(i=>Object.keys(i.mensal).forEach(m=>{if(ms2.includes(m))return;
  const mov=D.lanc.some(l=>l.i===i.id&&mesDe(l)===m)||D.rcb.some(x=>x.i===i.id&&rMes(x)===m);
  if(mov)er.add('Há lançamentos em '+mesNome(m)+' ("'+i.nome+'"), que ficaria fora do novo período.');
  else if(i.rec!=='mensal'&&(i.mensal[m]||0)>0)er.add('O item "'+i.nome+'" tem valor em '+mesNome(m)+', fora do novo período. Edite o item antes.')})));
 return [...er];
}
function aplicaPeriodo(ini,fim){
 const ms2=mesesDe(ini.slice(0,7),fim.slice(0,7));
 D.verbas.concat(D.receitas).forEach(g=>g.itens.forEach(i=>{if(i.rec==='mensal'){const n={};ms2.forEach(m=>n[m]=i.mensal[m]!=null?i.mensal[m]:i.valor);i.mensal=n}}));
}

const contaDe=(i,g)=>i.conta||(g&&g.conta)||'';
const ccDe=(i,g)=>i.cc||(g&&g.cc)||'';
const nomeC=id=>(D.contas.find(c=>c.id===id)||{nome:'—'}).nome,nomeK=id=>(D.cc.find(c=>c.id===id)||{nome:'—'}).nome;
const infoCC=(i,g)=>{g=g||D.verbas.find(v=>v.itens.some(x=>x.id===i.id));return'Conta: '+nomeC(contaDe(i,g))+' · Centro de custo: '+nomeK(ccDe(i,g))};
const podeRcb=i=>i&&!trancado()&&(i.rend?has('rend_info'):has('rcb'));

const regCad=(txt,ant,dep)=>reg('Cadastro',txt,ant,dep);
function apuraSaldo(){
 const cO=totalOrc(),cR=exec(()=>true),rP=sum(D.receitas.map(g=>sum(g.itens.map(itemOrc)))),rR=rReal(()=>true);
 return{data:HOJE,quem:who(),cO,cR,rP,rR,saldoFinal:rR-cR,saldoOrc:cO-cR,verbas:D.verbas.map(v=>({nome:v.nome,orc:verbaOrc(v),real:exec(l=>l.v===v.id)}))};
}
const tabLog=ls=>ls.length?'<div class="gxw" style="max-height:none"><table class="gx" style="width:100%"><thead><tr><th class="sh" style="text-align:left">Quando</th><th class="sh" style="text-align:left">Quem</th><th class="sh" style="text-align:left">O que foi alterado</th><th class="sh" style="text-align:right">Antes</th><th class="sh" style="text-align:right">Depois</th></tr></thead><tbody>'+ls.map(x=>'<tr><td style="text-align:left;white-space:nowrap">'+fd(x.q)+'</td><td style="text-align:left">'+esc(x.quem)+'</td><td style="text-align:left;white-space:normal;min-width:200px;max-width:340px">'+esc(x.txt)+'</td><td style="text-align:right;white-space:normal;min-width:110px;max-width:220px;font-size:12px">'+esc(x.ant||'')+'</td><td style="text-align:right;white-space:normal;min-width:110px;max-width:220px;font-size:12px">'+esc(x.dep||'')+'</td></tr>').join('')+'</tbody></table></div>':'<p class="muted small">Nenhuma alteração registrada ainda.</p>';

const isRes=i=>!!(i&&i.rend&&i.rendMod==='reserva');
const resId=iid=>isRes(rDe(iid));

/* ---------- imagens: reduz pixels e mantém metadados (EXIF) ---------- */
function exifSeg(buf){const v=new DataView(buf);if(v.getUint16(0)!==0xFFD8)return null;let o=2;while(o+4<v.byteLength){const m=v.getUint16(o);if(m===0xFFDA||(m&0xFF00)!==0xFF00)return null;const len=v.getUint16(o+2);if(m===0xFFE1&&v.getUint32(o+4)===0x45786966)return new Uint8Array(buf.slice(o,o+2+len));o+=2+len}return null}
function exifOrient1(seg){try{const v=new DataView(seg.buffer,seg.byteOffset,seg.byteLength),t=10,le=v.getUint16(t)===0x4949,i0=v.getUint32(t+4,le),n=v.getUint16(t+i0,le);for(let k=0;k<n;k++){const e=t+i0+2+k*12;if(v.getUint16(e,le)===0x0112){v.setUint16(e+8,1,le);break}}}catch(x){}return seg}
async function reduzirImg(f,max=1600,q=.75){
 if(!/^image\/(jpeg|png|webp)$/.test(f.type))return null;
 const buf=await f.arrayBuffer(),exif=f.type==='image/jpeg'?exifSeg(buf):null;
 let bmp;try{bmp=await createImageBitmap(f)}catch(x){return null}
 const k=Math.min(1,max/Math.max(bmp.width,bmp.height)),w=Math.round(bmp.width*k),h=Math.round(bmp.height*k),cv=document.createElement('canvas');cv.width=w;cv.height=h;cv.getContext('2d').drawImage(bmp,0,0,w,h);
 const bl=await new Promise(r=>cv.toBlob(r,'image/jpeg',q));let out=new Uint8Array(await bl.arrayBuffer());
 if(exif&&exif.length<65000){const seg=exifOrient1(new Uint8Array(exif)),r=new Uint8Array(out.length+seg.length);r.set(out.subarray(0,2),0);r.set(seg,2);r.set(out.subarray(2),2+seg.length);out=r}
 return{blob:new Blob([out],{type:'image/jpeg'}),orig:f.size,novo:out.length,w,h,exif:!!exif};
}
const kb=n=>n>=1048576?(n/1048576).toFixed(1).replace('.',',')+' MB':Math.max(1,Math.round(n/1024))+' KB';
const destPrincipal=()=>DESTINOS.find(d=>d.id===ARMAZ.principal);
const destCopia=()=>DESTINOS.find(d=>d.id===ARMAZ.copia);
const pastaPrev=m=>{const pr=(D.codigos||[]).find(c=>/processo/i.test(c.rot)),num=String((pr&&pr.v)||D.id).replace(/[^A-Za-z0-9]+/g,'-'),v=(D.verbas[0]||{nome:'Verba 1'}).nome.replace('Verba ','');return String(m||'{processo}/{ano-mes}/{verba}').replace('{processo}',num).replace('{ano-mes}',HOJE.slice(0,7)).replace('{ano}',HOJE.slice(0,4)).replace('{mes}',HOJE.slice(5,7)).replace('{verba}',v).replace('{item}','item').replace('{acao}','acao')};
async function procArqs(files){
 const imgs=[...files].filter(f=>/^image\//.test(f.type)),pdfs=[...files].filter(f=>f.type==='application/pdf'),ps=[];
 let o=0,n=0,c=0;for(const f of imgs){const r=await reduzirImg(f);if(r){o+=r.orig;n+=r.novo;c++}}
 const d=destPrincipal(),cp=destCopia();
 let t='';if(c)t+=c+' imagem(ns) reduzida(s): '+kb(o)+' → '+kb(n)+' (metadados mantidos). ';
 const big=pdfs.filter(f=>f.size>10485760).length;if(big)t+=big+' PDF grande(s) aceito(s); o servidor otimiza depois. ';
 if(d)t+='Salvo em '+d.nome+(cp?' (cópia: '+cp.nome+')':'')+' → '+pastaPrev(d.pasta)+'/';
 if(t)toast(t);
}
