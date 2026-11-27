"use strict";
const HOJE='2026-11-23';
const $=(s,r=document)=>r.querySelector(s);
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const brl=v=>v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const pc=v=>Math.round(v*100)+'%';
const nf1=v=>(Math.round(v*10)/10).toFixed(1).replace('.',',');
const fd=i=>i?i.split('-').reverse().join('/'):'—';
const sum=a=>a.reduce((x,y)=>x+y,0);
const avg=a=>a.length?sum(a)/a.length:0;
const MESES=['','Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const mesNome=m=>MESES[+m.slice(5)]+'/'+m.slice(0,4);
const DSEM=['dom','seg','ter','qua','qui','sex','sáb'];
function mul(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}

/* ---------- perfis ---------- */
const ROLES={coord:['Renata Moura','Coordenadora de Projetos'],gestor:['Marcos Lima','Gestor do contrato'],assist:['Carlos Dias','Assistente de prestação de contas'],analista:['Paula Reis','Analista de prestação de contas'],auditor:['Tiago Nunes','Auditor'],prof:['Rodrigo Pires','Professor'],psi:['Caio Fernandes','Psicólogo'],ped:['Lúcia Andrade','Pedagoga'],fin:['Sandra Vieira','Financeiro'],dir:['Helena Prado','Diretoria'],adm:['Admin do Portal','Administrador']};
const FUNC=[
['Projetos',[['proj_gerir','Cria, edita e encerra projetos (conclui etapas, inicia a execução e o encerramento)'],['cad_edit','Edita o cadastro (dados do projeto, documentos, contas, centros de custo e critérios da auditoria)'],['ver_inativos','Vê os projetos inativos']]],
['Plano de trabalho e orçamento',[['plano_edit','Cria ações e metas no plano de trabalho'],['orc_edit','Cria verbas de custos, itens de custos, tipos de receita e itens de receita; bloqueia itens'],['rem_aprova','Aprova remanejamento entre verbas'],['trava','Trava e destrava meses do orçamento'],['ver_valores','Vê valores (sem esta marca, os valores aparecem escondidos)']]],
['Lançamentos e prestação de contas',[['lanc','Lança despesas, solicita remanejamento e cadastra prestadores'],['rcb','Registra recebimentos de receitas'],['rend_info','Informa rendimentos financeiros'],['lanc_analisa','Analisa lançamentos e aprova a prestação de contas do mês'],['prest_enviar','Envia a prestação de contas do mês para análise'],['just_aprova','Aprova justificativas de falta de 3 orçamentos e avalia prestadores'],['pc_edit','Redige e envia a prestação de contas por ação'],['pc_ver','Abre a prestação de contas por ação (leitura e conferência)'],['rel_emite','Emite o relatório de execução das ações (por ação e período)']]],
['Calendário, alunos e acompanhamento',[['agenda','Cria e remarca aulas e eventos, registra presença e notas'],['aluno_gerir','Cadastra alunos, turmas, inscrições, saídas e transferências'],['dados_prot','Vê os dados protegidos dos alunos'],['log_acesso','Vê o registro de acessos aos dados protegidos'],['acomp_prof','Registra acompanhamento como professor'],['acomp_psi','Registra e vê o acompanhamento psicológico'],['acomp_ped','Registra acompanhamento como pedagogo'],['acomp_tudo','Vê todos os tipos de acompanhamento, inclusive o psicológico']]],
['Equipe (staff)',[['staff_gerir','Cadastra, edita e desliga pessoas da equipe (staff)'],['staff_prest','Comprova salário e benefícios de cada pessoa por mês e envia a prestação da equipe'],['staff_analisa','Analisa, aprova ou devolve a prestação mensal da equipe']]],
['Auditoria e patrimônio',[['aud_emite','Emite relatórios de auditoria, abre divergências e as encerra'],['aud_resp','Responde divergências e registra correções'],['pat_edit','Cadastra e altera bens do patrimônio']]],
['Abas que pode abrir',[['ver_resumo','Resumo'],['ver_cad','Cadastro'],['ver_plano','Plano de trabalho'],['ver_orc','Orçamento'],['ver_prest','Prestação de contas'],['ver_cal','Calendário'],['ver_alunos','Alunos'],['ver_acomp','Acompanhamento'],['ver_aud','Auditoria'],['ver_hist','Histórico'],['ver_pat','Patrimônio'],['ver_prov','Prestadores'],['ver_staff','Equipe (staff)']]],
['Administração',[['acessos_admin','Administra perfis e usuários (permissões)']]]];
const VER=['ver_resumo','ver_cad','ver_plano','ver_orc','ver_prest','ver_cal','ver_alunos','ver_acomp','ver_aud','ver_hist','ver_pat','ver_prov','ver_staff'];
const COORDF=VER.concat(['proj_gerir','cad_edit','ver_inativos','plano_edit','orc_edit','trava','lanc','rcb','rend_info','agenda','aluno_gerir','acomp_tudo','dados_prot','log_acesso','aud_resp','pc_edit','pat_edit','ver_valores','just_aprova','rel_emite','staff_gerir','staff_prest']);
const PERFIS=[
{id:'coord',nome:'Coordenador de Projetos',funcs:COORDF},
{id:'gestor',nome:'Gestor do contrato',funcs:VER.concat(['plano_edit','rem_aprova','just_aprova','lanc','rcb','agenda','aluno_gerir','aud_resp','pc_edit','pat_edit','dados_prot','ver_valores','rel_emite','staff_gerir'])},
{id:'assist',nome:'Assistente de prestação de contas',funcs:['ver_staff','staff_prest','ver_resumo','ver_plano','ver_orc','ver_prest','ver_pat','ver_prov','ver_cal','lanc','rcb','prest_enviar','aud_resp','pc_edit','pat_edit','ver_valores']},
{id:'analista',nome:'Analista de prestação de contas',funcs:['ver_staff','staff_analisa','ver_resumo','ver_plano','ver_orc','ver_prest','ver_aud','ver_hist','ver_pat','ver_prov','lanc_analisa','trava','aud_resp','pc_ver','ver_valores','rel_emite']},
{id:'auditor',nome:'Auditor',funcs:['ver_staff','ver_resumo','ver_cad','ver_plano','ver_orc','ver_prest','ver_cal','ver_alunos','ver_aud','ver_hist','ver_pat','ver_prov','aud_emite','log_acesso','pc_ver','ver_valores','rel_emite']},
{id:'prof',nome:'Professor',funcs:['ver_plano','ver_cal','ver_alunos','ver_acomp','agenda','acomp_prof']},
{id:'psi',nome:'Psicólogo',funcs:['ver_plano','ver_cal','ver_alunos','ver_acomp','acomp_psi']},
{id:'ped',nome:'Pedagoga',funcs:['ver_plano','ver_cal','ver_alunos','ver_acomp','acomp_ped']},
{id:'fin',nome:'Financeiro',funcs:['ver_orc','ver_hist','rend_info','ver_valores']},
{id:'dir',nome:'Diretoria',funcs:['ver_staff','ver_resumo','ver_cad','ver_plano','ver_orc','ver_prest','ver_cal','ver_aud','ver_hist','ver_pat','ver_inativos','ver_valores','rel_emite']},
{id:'adm',nome:'Administrador',funcs:COORDF.concat(['acessos_admin'])}];
const USUARIOS=Object.keys(ROLES).map(r=>({id:r,nome:ROLES[r][0],email:ROLES[r][0].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ /g,'.')+'@instituto.org.br',perfil:r,projetos:'todos',ativo:true}));
const ACLOG=[];
const DEST_TIPOS={storage:{nome:'Armazenamento do sistema (Supabase Storage)',campos:[['url','URL do projeto','https://seu-projeto.supabase.co',1],['bucket','Nome do bucket','projetos-obras',1],['segredo','Chave de serviço (guardada só no servidor)','',1,'password']]},
 drive:{nome:'Google Drive (Workspace da empresa)',campos:[['pastaId','ID da pasta raiz ou da unidade compartilhada','1AbC…',1],['conta','E-mail da conta de serviço','arquivos@empresa.com.br',1],['grupo','Grupo do Workspace que recebe acesso (opcional)','projetos@empresa.com.br',0],['acesso','Quem controla o acesso','',1,'select',[['drive','O Google Drive (pastas compartilhadas com os usuários)'],['sistema','O sistema (o servidor entrega o arquivo conforme o perfil)']]]]},
 bucket:{nome:'Bucket S3 compatível (S3, R2, Backblaze…)',campos:[['endpoint','Endereço (endpoint)','https://s3.exemplo.com',1],['regiao','Região','sa-east-1',0],['bucket','Nome do bucket','',1],['chaveId','Chave de acesso (ID)','',1],['segredo','Chave secreta (guardada só no servidor)','',1,'password'],['prefixo','Prefixo (opcional)','projetos/',0]]}};
const DESTINOS=[{id:'DS1',tipo:'storage',nome:'Armazenamento do sistema',p:{url:'https://seu-projeto.supabase.co',bucket:'projetos-obras',segredo:'••••••••'},pasta:'{processo}/{ano-mes}/{verba}',st:'ok',testado:'2026-11-20 09:10'},
 {id:'DS2',tipo:'drive',nome:'Google Drive da empresa',p:{},pasta:'{processo}/{ano-mes}/{verba}',st:'',testado:''}];
const ARMAZ={principal:'DS1',copia:''};
const TIPOS=['Doação direta','Emenda municipal','Emenda estadual','Emenda federal','Lei de incentivo','Outros'];
const SENHA='1234';

/* ---------- projeto exemplo ---------- */
const nomes=['Davi Souza','Miguel Santos','Arthur Oliveira','Heitor Lima','Gabriel Pereira','Samuel Costa','Lucas Ribeiro','Matheus Almeida','Pedro Carvalho','Enzo Gomes','Rafael Martins','Bernardo Rocha','Nicolas Barbosa','Guilherme Araújo','Felipe Nunes','João Vitor Dias','Caio Teixeira','Bruno Moreira','Thiago Cardoso','Vinícius Freitas','Kauã Ramos','Ryan Mendes','Théo Cavalcanti','Isaac Monteiro','Ana Clara Lopes','Maria Eduarda Pinto','Larissa Campos','Beatriz Farias'];
const ruas=['Rua das Palmeiras','Rua Sete de Setembro','Av. Esperança','Rua do Campo','Travessa da Paz'];
const CRIT0=()=>[{id:'acoes',nome:'Cumprimento das ações e metas',peso:30},{id:'orc',nome:'Execução do orçamento',peso:20},{id:'prest',nome:'Qualidade das prestações de contas',peso:20},{id:'alunos',nome:'Assiduidade e participação dos alunos',peso:20},{id:'prov',nome:'Qualidade dos prestadores',peso:10}];
function mkVazio(nome){return{ativo:true,enc:null,bens:[],criterios:CRIT0(),id:'P'+Date.now()%100000,nome,etapa:'elab',pat:'',instr:'',codigos:[],tipo:'',respElab:'',docs:[],contas:[],cc:[],acoes:[],verbas:[],lanc:[],prest:{},cal:[],alunos:[],turmas:[],acomp:[],prov:[],div:[],nc:[],aud:[],minCot:500,rem:[],staffMax:0,equipe:[],staffPC:{},staffMes:{},ini:'',fim:'',exIni:'',exFim:'',ver:1,vers:[{v:1,q:HOJE,quem:'Sistema',desc:'Versão inicial do projeto'}],log:[],trava:{},receitas:[],rcb:[],objetivo:'',
 vis:visPadrao([]),dadosAcesso:['coord','gestor'],logAcesso:[]}}
function visPadrao(verbas){const v={};['coord','gestor','assist','analista','auditor','prof','psi','ped','fin','dir','adm'].forEach(r=>{const all=['coord','gestor','analista','auditor','fin','dir','adm'].includes(r),ver=all||r==='assist';v[r]={total:all,v:Object.fromEntries(verbas.map(x=>[x.id,ver])),};});return v}
function mkProjeto1(){
 const verbas=[
  {id:'V1',nome:'Verba Alimentação',foto:true,itens:[{id:'I1',nome:'Lanche',orc:9000},{id:'I2',nome:'Hidratação',orc:3000}]},
  {id:'V2',nome:'Verba Custo Fixo',foto:false,itens:[{id:'I3',nome:'Aluguel do campo',orc:24000},{id:'I4',nome:'Água e luz',orc:6000},{id:'I5',nome:'Telefonia e internet',orc:3600}]},
  {id:'V3',nome:'Verba Mão de obra',foto:false,itens:[{id:'I6',nome:'Salário dos instrutores',orc:36000},{id:'I7',nome:'Salário do gestor',orc:12000},{id:'I8',nome:'Porteiro',orc:2400},{id:'I9',nome:'Segurança patrimonial',orc:3600}]},
  {id:'V4',nome:'Verba Uniformes',foto:true,itens:[{id:'I10',nome:'Uniformes dos alunos',orc:5400},{id:'I11',nome:'Uniformes dos colaboradores',orc:1000}]},
  {id:'V5',nome:'Verba Material esportivo',foto:true,itens:[{id:'I12',nome:'Bolas e cones',orc:9000},{id:'I13',nome:'Equipamentos (redes, coletes)',orc:5000}]}];
 const M12=[];for(let y=2026,m=9,k=0;k<12;k++){M12.push(y+'-'+String(m).padStart(2,'0'));m++;if(m>12){m=1;y++}}
 const eq=t=>Object.fromEntries(M12.map(m=>[m,t/12]));
 const PONT={I10:{'2026-10':5400},I11:{'2026-10':1000},I12:{'2026-09':4500,'2027-03':4500},I13:{'2026-11':2500,'2027-03':2500}};
 verbas.forEach(v=>v.itens.forEach(i=>{i.mensal=PONT[i.id]||eq(i.orc);delete i.orc}));
 const H=(q,quem,acao,txt)=>({q,quem,acao,txt:txt||''});
 const G='Carlos Dias (assistente)',A='Paula Reis (analista)';
 const cot3=(a,b,c)=>({dispensa:false,just:'',justSt:'',itens:[{f:'P1',v:a},{f:'P8',v:b},{f:'P9',v:c}]});
 const lanc=[
  {id:'L1',data:'2026-09-10',v:'V5',i:'I12',tipo:'compra',desc:'20 bolas nº 5, 10 cones e 2 jogos de coletes',forn:'P1',valor:4350,cc:'CC1',conta:'C1',st:'aprovado',docs:{nf:1,comp:1,foto:1,cot:1},arq:['nf_1182.pdf','pix_10set.pdf','foto_material.jpg'],cot:{dispensa:false,just:'',justSt:'',itens:[{f:'P1',v:4350},{f:'P8',v:4680},{f:'P9',v:4510}]},hist:[H('2026-09-10',G,'Lançou'),H('2026-09-12',A,'Aprovou')],aval:5},
  {id:'L2',data:'2026-09-12',v:'V2',i:'I3',tipo:'fixo',desc:'Aluguel do campo — setembro',forn:'P2',valor:2000,cc:'CC1',conta:'C1',st:'aprovado',docs:{nf:1,comp:1,foto:0},arq:['recibo_set.pdf','pix_12set.pdf'],cot:null,hist:[H('2026-09-12',G,'Lançou'),H('2026-09-14',A,'Aprovou')],aval:4},
  {id:'L3',data:'2026-09-30',v:'V3',i:'I6',tipo:'folha',desc:'Instrutores — setembro (2 profissionais)',forn:'P7',valor:3000,cc:'CC1',conta:'C1',st:'aprovado',docs:{nf:1,comp:1,foto:0},arq:['recibos_set.pdf','ted_30set.pdf'],cot:null,hist:[H('2026-09-30',G,'Lançou'),H('2026-10-02',A,'Aprovou')],aval:5},
  {id:'L4',data:'2026-10-05',v:'V2',i:'I3',tipo:'fixo',desc:'Aluguel do campo — outubro',forn:'P2',valor:2000,cc:'CC1',conta:'C1',st:'aprovado',docs:{nf:1,comp:1,foto:0},arq:['recibo_out.pdf','pix_5out.pdf'],cot:null,hist:[H('2026-10-05',G,'Lançou'),H('2026-10-07',A,'Aprovou')],aval:4},
  {id:'L5',data:'2026-10-10',v:'V4',i:'I10',tipo:'compra',desc:'Kits de uniforme dos alunos (30 unidades)',forn:'P3',valor:5700,cc:'CC1',conta:'C1',st:'aprovado',docs:{nf:1,comp:1,foto:1,cot:1},arq:['nf_3340.pdf','pix_10out.pdf','foto_uniformes.jpg'],cot:{dispensa:false,just:'',justSt:'',itens:[{f:'P3',v:5700},{f:'P8',v:6100},{f:'P9',v:6250}]},hist:[H('2026-10-10',G,'Lançou'),H('2026-10-14',A,'Aprovou')],aval:4},
  {id:'L6',data:'2026-10-31',v:'V3',i:'I6',tipo:'folha',desc:'Instrutores — outubro (2 profissionais)',forn:'P7',valor:3000,cc:'CC1',conta:'C1',st:'aprovado',docs:{nf:1,comp:1,foto:0},arq:['recibos_out.pdf','ted_31out.pdf'],cot:null,hist:[H('2026-10-31',G,'Lançou'),H('2026-11-03',A,'Aprovou')],aval:5},
  {id:'L7',data:'2026-10-15',v:'V2',i:'I4',tipo:'fixo',desc:'Água e luz do campo (setembro e outubro)',forn:'P5',valor:780,cc:'CC1',conta:'C1',st:'lancado',docs:{nf:1,comp:1,foto:0},arq:['contas_set_out.pdf','pix_15out.pdf'],cot:null,hist:[H('2026-10-16',G,'Lançou')]},
  {id:'L8',data:'2026-11-05',v:'V2',i:'I3',tipo:'fixo',desc:'Aluguel do campo — novembro',forn:'P2',valor:2000,cc:'CC1',conta:'C1',st:'lancado',docs:{nf:1,comp:1,foto:0},arq:['recibo_nov.pdf','pix_5nov.pdf'],cot:null,hist:[H('2026-11-06',G,'Lançou')]},
  {id:'L9',data:'2026-11-08',v:'V1',i:'I1',tipo:'compra',desc:'Lanche — 28 alunos (novembro)',forn:'P4',valor:1350,cc:'CC1',conta:'C1',st:'devolvido',docs:{nf:1,comp:1,foto:0,cot:1},arq:['nf_9921.pdf','pix_8nov.pdf'],cot:{dispensa:false,just:'',justSt:'',itens:[{f:'P4',v:1350},{f:'P8',v:1420},{f:'P9',v:1500}]},hist:[H('2026-11-09',G,'Lançou'),H('2026-11-12',A,'Devolveu','Falta a foto do lanche sendo servido. Anexe também a NF com o CNPJ da instituição.')]},
  {id:'L10',data:'2026-11-12',v:'V2',i:'I5',tipo:'fixo',desc:'Internet — outubro e novembro',forn:'P6',valor:240,cc:'CC2',conta:'C1',st:'rascunho',docs:{nf:1,comp:0,foto:0},arq:['fatura_net.pdf'],cot:null,hist:[]},
  {id:'L11',data:'2026-11-20',v:'V5',i:'I13',tipo:'compra',desc:'Rede de gol certificada e bomba de ar',forn:'P1',valor:1200,cc:'CC1',conta:'C1',st:'lancado',docs:{nf:1,comp:1,foto:1,cot:0},arq:['nf_1230.pdf','pix_20nov.pdf','foto_rede.jpg'],cot:{dispensa:true,just:'Único fornecedor da região com rede certificada pela federação; os demais não atendem a norma.',justSt:'pendente',itens:[]},hist:[H('2026-11-20',G,'Lançou','Sem 3 cotações: justificativa enviada ao gestor do contrato.')]}];
 const prov=[['P1','Esporte Total Ltda','Fornecedor de material'],['P2','Associação Esperança','Locador do campo'],['P3','Confecções Bom Jogo','Fornecedor de uniformes'],['P4','Atacado Bom Preço','Fornecedor de alimentos'],['P5','Concessionárias (água e luz)','Serviço público'],['P6','NetBairro','Internet'],['P7','Equipe própria (folha)','Pessoal'],['P8','Sports Center Ltda','Fornecedor de material'],['P9','Casa do Esporte','Fornecedor de material']].map(x=>({id:x[0],nome:x[1],cat:x[2],doc:'—'}));
 const P={id:'P1',nome:'Escola de Futebol Bairro Esperança',etapa:'exec',pat:'Instituto Bola Cidadã',instr:'Termo de Fomento nº 112/2026',codigos:[{rot:'Código no sistema do parceiro',v:'SIGCONV-88421'},{rot:'Nº do processo',v:'2026/004512'}],tipo:'Emenda municipal',respElab:'Fernanda Alves (elaboração e condução da proposta)',
  ini:'2026-09-01',fim:'2027-08-31',objetivo:'Oferecer aulas gratuitas de futebol, duas vezes por semana, a 28 crianças e adolescentes do bairro, com acompanhamento de frequência e participação e prestação de contas mensal ao parceiro.',
  docs:[{n:'edital_emenda_2026.pdf',t:'Edital'},{n:'proposta_aprovada.pdf',t:'Proposta'},{n:'termo_de_fomento_112_2026.pdf',t:'Instrumento'}],
  contas:[{id:'C1',nome:'Banco Esperança · Ag. 0123 · C/C 45678-9 (conta do projeto)'}],cc:[{id:'CC1',nome:'CC01 · Operação da escola'},{id:'CC2',nome:'CC02 · Administração do projeto'}],
  verbas,lanc,prov,minCot:500,cal:[],
  prest:{'2026-09':{st:'aprovada',parecer:'Setembro conferido: execução e comprovantes em conformidade.'},'2026-10':{st:'em_analise',parecer:''},'2026-11':{st:'aberta',parecer:''}},
  rem:[{id:'R1',de:'I5',para:'I4',valor:250,mes:'2026-11',just:'As contas de água e luz vieram acima do previsto no campo novo; a telefonia tem folga.',st:'pendente',por:'Carlos Dias (assistente)',data:'2026-11-18'}],
  div:[{id:'D1',l:'L7',texto:'A conta de luz não identifica a unidade consumidora. Anexe a fatura completa.',por:'Tiago Nunes (auditor)',abertaEm:'2026-11-19',prazo:'2026-11-27',st:'aberta',resp:''},{id:'D2',l:'L1',texto:'Foto sem data visível.',por:'Tiago Nunes (auditor)',abertaEm:'2026-09-20',prazo:'2026-09-27',st:'encerrada',resp:'Nova foto datada anexada em 22/09.'}],
  nc:[{id:'N1',desc:'Lista de presença de 24/09 sem assinatura do instrutor.',grav:'baixa',prazo:'2026-10-30',st:'encerrada',origem:'Auditoria de setembro',corr:'Assinatura colhida e lista reenviada.'}],
  aud:[{id:'AU1',mes:'2026-09',data:'2026-10-20',auditor:'Tiago Nunes',anexo:'relatorio_auditoria_set.pdf',notas:{acoes:4,orc:5,prest:4,alunos:4,prov:5},obs:['Boa organização documental.','Sugerida conferência semanal das listas de presença.']}],
  acoes:[
   {id:'AC0',nome:'Matrícula e cadastro dos alunos',tipo:'cadastro',metas:[{id:'M1',nome:'Matricular 28 alunos',ind:'alunos',alvo:28}]},
   {id:'AC1',nome:'Aulas de futebol — Turma A (terça e quinta)',tipo:'aulas',metas:[{id:'M2',nome:'Realizar as aulas previstas até 18/12',ind:'aulas',alvo:0},{id:'M3',nome:'Frequência média de 75% ou mais',ind:'freq',alvo:0.75}]},
   {id:'AC2',nome:'Aulas de futebol — Turma B (quarta e sexta)',tipo:'aulas',metas:[{id:'M4',nome:'Realizar as aulas previstas até 18/12',ind:'aulas',alvo:0},{id:'M5',nome:'Frequência média de 75% ou mais',ind:'freq',alvo:0.75}]},
   {id:'AC3',nome:'Torneio de integração do bairro',tipo:'evento',metas:[{id:'M6',nome:'Realizar 1 torneio com as famílias',ind:'eventos',alvo:1}]},
   {id:'AC4',nome:'Reuniões com as famílias',tipo:'evento',metas:[{id:'M7',nome:'Realizar 2 reuniões no semestre',ind:'eventos',alvo:2}]}],
  logAcesso:[{q:'2026-11-17 09:12',quem:'Marcos Lima (gestor)',aluno:'M-2026-004'},{q:'2026-11-19 14:40',quem:'Renata Moura (coordenadora)',aluno:'M-2026-012'}],dadosAcesso:['coord','gestor']};
 P.vis=visPadrao(verbas);P.vis.assist.total=false;P.vis.prof={total:false,v:Object.fromEntries(verbas.map(x=>[x.id,false]))};

 P.exIni='2026-09-01';P.exFim='2027-08-31';P.ver=3;
 P.vers=[{v:1,q:'2026-08-20',quem:'Renata Moura (coordenadora)',desc:'Versão inicial aprovada com o parceiro.'},{v:2,q:'2026-10-02',quem:'Renata Moura (coordenadora)',desc:'Uniformes passaram de 2 para 1 compra (outubro).'},{v:3,q:'2026-11-04',quem:'Renata Moura (coordenadora)',desc:'Início da execução adiado de 01/09 para 10/09 por atraso na liberação do campo; período do projeto mantido.'}];
 P.exIni='2026-09-10';
 P.trava={'2026-09':{por:'Paula Reis (analista)',q:'2026-10-05'}};
 const rM=v=>Object.fromEntries(M12.map(m=>[m,v]));
 verbas[0].desc='Lanche servido ao final de cada aula e hidratação durante a atividade. Exige foto do lanche sendo servido.';
 verbas[1].desc='Despesas fixas de manutenção do campo e comunicação. Pagar até o dia 10 de cada mês.';
 verbas[2].desc='Folha e prestadores de serviço contínuos. Anexar recibos e comprovante de transferência.';
 verbas[3].desc='Compra pontual com 3 cotações. Exige foto da entrega.';
 verbas[4].desc='Material esportivo; exige foto e nota fiscal.';
 verbas[0].itens[0].nota='Lanche para 28 alunos, 2 vezes por semana. Valor unitário de referência: R$ 1,50 por aluno.';
 verbas[1].itens[0].nota='Valor fixado no contrato com a Associação Esperança.';
 verbas[1].itens[1].nota='Consumo estimado; pode variar com a estação. Usar remanejamento se passar do orçado.';
 verbas.forEach(v=>v.itens.forEach(i=>{i.rec=PONT[i.id]?(Object.keys(PONT[i.id]).length>1?'pers':'unico'):'mensal';const ks=Object.keys(i.mensal);i.valor=i.rec==='mensal'?i.mensal[ks[0]]:(i.rec==='unico'?i.mensal[ks[0]]:0);if(i.rec==='unico')i.mes=ks[0]}));
 P.receitas=[{id:'RV1',nome:'Repasse do parceiro',desc:'Recursos transferidos pelo Instituto Bola Cidadã conforme o cronograma de desembolso do termo.',itens:[{id:'RI1',nome:'Parcela mensal do repasse',rec:'mensal',valor:8000,nota:'Cai na conta do projeto até o dia 5.',mensal:Object.fromEntries(M12.map(m=>[m,8000]))}]},{id:'RV2',nome:'Contrapartida',desc:'Valor assumido pela associação como contrapartida do projeto.',itens:[{id:'RI2',nome:'Contrapartida da associação',rec:'unico',valor:24000,mes:'2026-09',nota:'Pagamento único, na assinatura do termo.',mensal:{'2026-09':24000}}]}];
 P.rcb=[{id:'RC1',i:'RI1',data:'2026-09-05',valor:8000,desc:'Repasse de setembro',quem:'Carlos Dias (assistente)',arq:['extrato_set.pdf']},{id:'RC2',i:'RI1',data:'2026-10-05',valor:8000,desc:'Repasse de outubro',quem:'Carlos Dias (assistente)',arq:['extrato_out.pdf']},{id:'RC3',i:'RI1',data:'2026-11-05',valor:7500,desc:'Repasse de novembro (menor que o previsto)',quem:'Carlos Dias (assistente)',arq:['extrato_nov.pdf']},{id:'RC4',i:'RI2',data:'2026-09-10',valor:24000,desc:'Contrapartida',quem:'Carlos Dias (assistente)',arq:['comprovante_contrapartida.pdf']}];
 P.log=[{q:'2026-10-05',quem:'Paula Reis (analista)',tipo:'Trava',txt:'Travou setembro/2026 após a aprovação da prestação.'},{q:'2026-11-04',quem:'Renata Moura (coordenadora)',tipo:'Versão',txt:'v3: início da execução 01/09 → 10/09.',ant:'01/09/2026',dep:'10/09/2026'},{q:'2026-10-02',quem:'Renata Moura (coordenadora)',tipo:'Orçamento',txt:'v2: Uniformes dos alunos — orçado em outubro.',ant:'R$ 2.700 + R$ 2.700',dep:'R$ 5.400'}];
 /* alunos */
 P.alunos=nomes.map((n,i)=>{const t=i<14?'A':'B',r=mul(i+3),p=n.split(' ');return{id:'a'+(i+1),mat:'M-2026-'+String(i+1).padStart(3,'0'),social:n==='Larissa Campos'?'Lia C.':p[0]+' '+p[p.length-1][0]+'.',nome:n,nasc:(2012+Math.floor(r()*7))+'-0'+(1+Math.floor(r()*9))+'-1'+Math.floor(r()*9),end:ruas[i%5]+', '+(10+i*7),bairro:['Jardim Esperança','Vila Nova','Morro Alto'][i%3],resp:'Sra. '+p[p.length-1],tel:'(11) 9'+String(7000+i*37).padStart(4,'0')+'-'+String(1000+i*91).slice(0,4),termo:![5,17,26].includes(i),acoes:['AC0',t==='A'?'AC1':'AC2','AC3','AC4']}});
 /* calendário */
 const rng=mul(11),cancel={'2026-09-24':'Chuva forte','2026-10-21':'Campo indisponível (evento da associação)','2026-11-11':'Chuva forte','2026-11-20':'Feriado — Consciência Negra'},semFoto=['2026-10-08','2026-11-05'];let id=1;
 const prob=a=>(a.id==='a4'||a.id==='a21')?0.35:0.85;
 for(let d=new Date('2026-09-14T12:00:00Z');d<=new Date('2026-12-18T12:00:00Z');d.setUTCDate(d.getUTCDate()+1)){
  const wd=d.getUTCDay(),t=(wd===2||wd===4)?'A':(wd===3||wd===5)?'B':null;if(!t)continue;
  const iso=d.toISOString().slice(0,10),ac=t==='A'?'AC1':'AC2',al=P.alunos.filter(a=>a.acoes.includes(ac));
  const e={id:'E'+(id++),data:iso,tipo:'aula',acao:ac,inst:t==='A'?'Rodrigo Pires':'Juliana Castro',hora:'16:00',local:'Campo da Associação',pres:[],notas:{},fotos:0,obs:''};
  if(iso>HOJE){e.st='prevista'}
  else if(cancel[iso]){e.st='cancelada';e.motivo=cancel[iso]}
  else{e.st='realizada';al.forEach(a=>{if(rng()<prob(a)){e.pres.push(a.id);const low=prob(a)<.5;e.notas[a.id]={n:Math.max(1,Math.min(5,Math.round((low?2.6:3.7)+rng()*1.6))),obs:''}}});e.fotos=semFoto.includes(iso)?0:1+Math.floor(rng()*3);e.obs=['Treino de passe e controle.','Jogos reduzidos 5x5.','Fundamentos de drible e finalização.','Coletivo e regras do jogo.'][Math.floor(rng()*4)]}
  P.cal.push(e);
 }
 P.cal.push({id:'E'+(id++),data:'2026-11-14',tipo:'acao',acao:'AC4',inst:'Marcos Lima',hora:'10:00',local:'Salão da Associação',pres:[],notas:{},fotos:2,obs:'1ª reunião com as famílias: 22 responsáveis presentes.',st:'realizada'});
 P.cal.push({id:'E'+(id++),data:'2026-12-12',tipo:'acao',acao:'AC3',inst:'Marcos Lima',hora:'09:00',local:'Campo da Associação',pres:[],notas:{},fotos:0,obs:'',st:'prevista'});
 ['AC1','AC2'].forEach(a=>{const m=P.acoes.find(x=>x.id===a).metas[0];m.alvo=P.cal.filter(e=>e.acao===a).length});
 P.alunos.forEach((a,i)=>{a.entrada=[20,21,22,23].includes(i)?'2026-10-05':'2026-09-10';a.hist=[{q:a.entrada,quem:'Carlos Dias (assistente)',txt:'Entrada no projeto'}];a.insc={};a.acoes.forEach(x=>a.insc[x]=(x==='AC3'||x==='AC4')?'2026-10-20':a.entrada)});
 P.alunos[27].saida='2026-11-10';P.alunos[27].motivoSaida='Mudança de bairro';P.alunos[27].hist.push({q:'2026-11-10',quem:'Marcos Lima (gestor)',txt:'Saída do projeto: mudança de bairro'});
 P.turmas=[{id:'T1',cod:'TA-26',letra:'A',max:16,curso:'AC1',prof:'Rodrigo Pires',ini:'2026-09-10',fim:'2027-08-31',h1:'16:00',h2:'17:30',dias:'terça e quinta',obs:'',nome:'Aulas de futebol — Turma A',alunos:P.alunos.filter((a,i)=>i<14).map(a=>a.id)},{id:'T2',cod:'TB-26',letra:'B',max:15,curso:'AC2',prof:'Juliana Castro',ini:'2026-09-10',fim:'2027-08-31',h1:'09:00',h2:'10:30',dias:'quarta e sexta',obs:'',nome:'Aulas de futebol — Turma B',alunos:P.alunos.filter((a,i)=>i>=14).map(a=>a.id)}];
 P.acomp=[
  {id:'PR1',aluno:'a3',tipo:'prof',data:'2026-10-08',autor:'Rodrigo Pires (professor)',c1:'Boa evolução nos fundamentos; ainda evita jogadas em dupla.',c2:'Participativo, ajuda os colegas menores.'},
  {id:'PR2',aluno:'a3',tipo:'ped',data:'2026-10-15',autor:'Lúcia Andrade (pedagoga)',c1:'Reforço de leitura combinado com a escola; ritmo abaixo do esperado para a idade.',c2:'Encaminhar à biblioteca comunitária duas vezes por semana.'},
  {id:'PR3',aluno:'a3',tipo:'psi',data:'2026-10-22',autor:'Caio Fernandes (psicólogo)',c1:'Demonstra insegurança ao ser corrigido em público.',c2:'Acompanhamento quinzenal; conversar com a família.'},
  {id:'PR4',aluno:'a9',tipo:'prof',data:'2026-11-12',autor:'Rodrigo Pires (professor)',c1:'Faltas seguidas nas últimas semanas.',c2:'Chegou irritado em duas aulas.'},
  {id:'PR5',aluno:'a9',tipo:'ped',data:'2026-11-16',autor:'Lúcia Andrade (pedagoga)',c1:'Contato com a escola: queda de rendimento no mês.',c2:'Visita à família agendada.'}];

 P.verbas.forEach(v=>{v.conta='C1';v.cc='CC1';v.itens.forEach(i=>{i.conta='C1';i.cc=(i.id==='I5')?'CC2':'CC1'})});
 P.receitas.forEach(g=>{g.conta='C1';g.cc='CC1';g.itens.forEach(i=>{i.conta='C1';i.cc='CC1'})});
 P.receitas.push({id:'RV3',nome:'Rendimentos',desc:'Rendimento da aplicação financeira da conta do projeto. Informado mensalmente pelo setor financeiro.',conta:'C1',cc:'CC2',itens:[{id:'RI3',nome:'Rendimento da aplicação',rec:'mensal',valor:120,rend:true,rendMod:'reserva',nota:'Valor estimado. O realizado vem do extrato da aplicação.',conta:'C1',cc:'CC2',mensal:Object.fromEntries(M12.map(m=>[m,120]))}]});
 P.rcb.forEach(x=>{x.conta='C1';x.cc='CC1'});
 P.rcb.push({id:'RC5',i:'RI3',data:'2026-09-30',valor:96.4,desc:'Rendimento de setembro',quem:'Sandra Vieira (financeiro)',arq:['extrato_aplicacao_set.pdf'],conta:'C1',cc:'CC2'},{id:'RC6',i:'RI3',data:'2026-10-31',valor:131.8,desc:'Rendimento de outubro',quem:'Sandra Vieira (financeiro)',arq:['extrato_aplicacao_out.pdf'],conta:'C1',cc:'CC2'});

 P.acoes.find(x=>x.id==='AC4').pc={html:'<p>Primeira reunião com as famílias realizada em 14/11, com 22 responsáveis. Foram apresentados o plano de trabalho e o calendário de aulas.</p><p>Pontos levantados: horário de saída e transporte.</p>',anexos:[{n:'lista_presenca_reuniao1.pdf',t:'Comprovante'},{n:'foto_reuniao1.jpg',t:'Foto'}],st:'enviada',hist:[{q:'2026-11-17',quem:'Carlos Dias (assistente)',acao:'Enviou para análise',txt:''}]};
 P.cal.forEach(e=>{e.docs=e.docs||[];if(e.st==='realizada'&&(e.pres.length||e.fotos||e.docs.length))e.comp=true});
 P.criterios=CRIT0();
 const FORN=P.prov.map(x=>x.nome);
 P.verbas.forEach(v=>v.itens.forEach(i=>{if(['I3','I6','I7','I8','I9'].includes(i.id)){i.cot=[];i.cotJust={txt:i.id==='I3'?'Local único disponível no bairro; contrato direto com a Associação Esperança.':'Folha de pagamento de profissionais contratados: não se aplica cotação.',st:'aprovada',por:'Marcos Lima (gestor)',data:'2026-08-25'}}else{const t=i.mensal?Object.values(i.mensal).find(x=>x>0)||100:100;i.cot=[0,1,2].map(k=>({forn:FORN[k]||('Fornecedor '+(k+1)),valor:Math.round(t*(1+k*0.06)),txt:k===0?'Menor preço, entrega em 5 dias.':'',arq:'orcamento_'+i.id+'_'+(k+1)+'.pdf'}))}}));
 P.ativo=true;P.enc=null;
 const cmp=P.lanc.filter(l=>l.tipo==='compra');
 P.bens=[{id:'PT1',desc:'Kit de 20 bolas de futebol de campo',local:'Almoxarifado da Associação',status:'Em uso',num:'PAT-004512',lanc:cmp[0]?cmp[0].id:'',dataAq:cmp[0]?cmp[0].data:'2026-09-20',fotos:[{fase:'Aquisição',n:'bolas_entrega.jpg'},{fase:'Alocação',n:'bolas_almoxarifado.jpg'}],docs:[{t:'NF',n:'nf_bolas_1234.pdf'},{t:'Comprovante de pagamento',n:'comprovante_bolas.pdf'}],rem:null,hist:[{q:'2026-09-20',quem:'Carlos Dias (assistente)',campo:'Cadastro',ant:'—',dep:'Bem cadastrado'},{q:'2026-09-22',quem:'Carlos Dias (assistente)',campo:'Local',ant:'Em recebimento',dep:'Almoxarifado da Associação'}]},
 {id:'PT2',desc:'Armário de aço para almoxarifado',local:'Salão da Associação',status:'Em estoque',num:'PAT-004513',lanc:'',dataAq:'2026-10-03',fotos:[{fase:'Aquisição',n:'armario.jpg'}],docs:[{t:'NF',n:'nf_armario.pdf'},{t:'Manual',n:'manual_armario.pdf'}],rem:null,hist:[{q:'2026-10-03',quem:'Carlos Dias (assistente)',campo:'Cadastro',ant:'—',dep:'Bem cadastrado'}]},
 {id:'PT3',desc:'Projetor multimídia',local:'Removido — devolvido ao parceiro',status:'Removido',num:'PAT-004498',lanc:'',dataAq:'2026-09-12',fotos:[{fase:'Aquisição',n:'projetor.jpg'},{fase:'Remoção',n:'projetor_devolucao.jpg'}],docs:[{t:'NF',n:'nf_projetor.pdf'}],rem:{data:'2026-11-08',destino:'Instituto Bola Cidadã (sede)',motivo:'Defeito de fábrica; trocado pelo parceiro.'},hist:[{q:'2026-09-12',quem:'Carlos Dias (assistente)',campo:'Cadastro',ant:'—',dep:'Bem cadastrado'},{q:'2026-11-08',quem:'Marcos Lima (gestor)',campo:'Status',ant:'Em uso',dep:'Removido → Instituto Bola Cidadã (sede), 08/11/2026'}]}];


 P.staffMax=4;
 P.equipe=[
  {id:'E1',nome:'Juliana Prado',cargo:'Coordenadora pedagógica',vinc:'CLT',adm:'2026-09-10',deslig:'',sal:4200,ben:[{id:'E1_b0',nome:'Vale-refeição',valor:660},{id:'E1_b1',nome:'Vale-transporte',valor:220},{id:'E1_b2',nome:'Plano de saúde',valor:310}]},
  {id:'E2',nome:'Roberto Alves',cargo:'Assistente administrativo',vinc:'CLT',adm:'2026-09-10',deslig:'',sal:2500,ben:[{id:'E2_b0',nome:'Vale-refeição',valor:660},{id:'E2_b1',nome:'Vale-transporte',valor:220}]},
  {id:'E3',nome:'Fernanda Lima',cargo:'Auxiliar de serviços gerais',vinc:'CLT',adm:'2026-10-01',deslig:'',sal:1800,ben:[{id:'E3_b0',nome:'Vale-transporte',valor:180}]}];
 const spk=(p,m,dia,full)=>{const pago={},arq=[];[{k:'sal',prev:p.sal,nm:'holerite'}].concat(p.ben.map((b,i)=>({k:b.id,prev:b.valor,nm:'beneficio'+(i+1)}))).forEach((i,ix)=>{if(!full&&ix>1)return;pago[i.k]={v:i.prev,d:m+'-'+dia};arq.push({n:'0045'+'12_'+dia+m.slice(5)+m.slice(0,4)+'0900_'+i.nm+'_'+p.nome.split(' ')[0].toLowerCase()+'.pdf',t:i.k})});return{pago,arq,obs:''}};
 P.staffPC={};
 P.equipe.forEach(p=>{['2026-09','2026-10'].forEach(m=>{if(p.adm.slice(0,7)<=m)P.staffPC[m+'|'+p.id]=spk(p,m,'05',true)});});
 P.staffPC['2026-11|E1']=spk(P.equipe[0],'2026-11','05',false);
 P.staffMes={'2026-09':{st:'aprovada',parecer:'Setembro conferido: salários e benefícios comprovados.'},'2026-10':{st:'em_analise',parecer:''},'2026-11':{st:'aberta',parecer:''}};
 return P;
}
const PROJ=[mkProjeto1()];
(()=>{const p=mkVazio('Horta Comunitária Vila Nova');Object.assign(p,{id:'P2',etapa:'enc',ativo:false,pat:'Prefeitura Municipal',instr:'Convênio nº 008/2025',tipo:'Emenda Municipal',respElab:'Renata Moura',ini:'2025-03-01',fim:'2025-12-31',exIni:'2025-03-10',exFim:'2025-12-20',objetivo:'Implantar uma horta comunitária com oficinas para 40 famílias.',codigos:[{rot:'Código do convênio',v:'CV-008-2025'}]});
p.contas=[{id:'C1',nome:'Banco do Povo · C/C 1020-3'}];p.cc=[{id:'CC1',nome:'CC01 · Horta'}];
p.enc={rel:{n:'relatorio_conferencia_final.pdf',data:'2026-01-20',quem:'Renata Moura (coordenadora)'},termo:{n:'termo_aprovacao_prefeitura.pdf',data:'2026-01-28',quem:'Renata Moura (coordenadora)'},saldo:{data:'2026-01-20',quem:'Renata Moura (coordenadora)',cO:60000,cR:58210,rP:60000,rR:60000,saldoFinal:1790,saldoOrc:1790,verbas:[{nome:'Verba Insumos',orc:30000,real:29000},{nome:'Verba Mão de obra',orc:30000,real:29210}]},em:'2026-01-30'};
p.log=[{q:'2026-01-30',quem:'Renata Moura (coordenadora)',tipo:'Cadastro',txt:'Projeto encerrado: relatório de conferência final, saldo e termo de aprovação anexados.'}];PROJ.push(p)})();
let D=PROJ[0];
