# Decisões e preferências do projeto

Registro de por que o sistema é como é. Complementa `ESPECIFICACAO.md`.

## Decisões de arquitetura
- Supabase (banco, login, funções de servidor); módulo dentro do Portal Processos com o mesmo login.
- Repositório `senaconsultingmg/GestorProjetos`; migrações SQL versionadas; homologação em ramificação (branch) do Supabase.
- Cadastros compartilhados com o portal: ver seção "Integração com o Portal Processos" da especificação.
- LGPD no padrão, com log de acesso a dados protegidos de atendidos; documentos de atendidos em área restrita com senha.
- Patrimônio do projeto unificado com o módulo Ativos do portal.
- Avisos no sistema agora; e-mail na fase 4. Integração RM/Fluig é fase opcional, somente leitura.

## Regras de negócio que surgiram da prática (não perder)
- **Orçamento** é planilha mensal (orçado × realizado, saldo acumulado, mês travável), com ampliação em tela cheia.
- **Itens** definem os documentos que o lançamento deve ter: padrão Nota fiscal/recibo, Comprovante de pagamento e Foto, mais personalizados; cada um obrigatório ou opcional. Foto nem sempre é obrigatória.
- **Cotações:** compra/serviço a partir do valor mínimo exige 3 cotações ou justificativa aprovada; item com 3 cotações (ou justificativa) dispensa a cotação do lançamento, salvo "cotação por medição".
- **Nome do arquivo salvo:** `<processo sem o ano>_<ddmmaaaaHHMM>_<original>`, sem acentos, no máximo 80 caracteres, extensão mantida.
- **Imagens:** reduzidas no navegador (1600 px, JPEG 75%), preservando o EXIF; PDFs nunca são barrados.
- **Anexar:** escolher arquivo → conferir categoria → clicar em Enviar. Arquivo escolhido e não enviado impede salvar.
- **Atendidos:** categoria aluno/atendido, foto, documentos em área restrita, matrícula em várias ações; ação genérica com texto rico e anexos.
- **Acesso:** funções (catálogo) → perfis → usuários, com escopo por projeto; relatório emitido por quem tem a função `rel_emite`.
- **Armazenamento:** vários destinos (Storage, Drive, bucket), um principal e cópias, só ativados após teste de conexão; modelo de pastas com {processo},{ano},{mes},{ano-mes},{verba},{item},{acao}.
- **Layout:** barra lateral escura, topo com busca, trilha de navegação, etapas em círculos, painel de resumo (inspirado no Portal Tripolo).

## Como o dono do produto trabalha
- Fala português; quer relatórios curtos e que o trabalho siga de forma autônoma.
- Prefere que eu aja como engenheiro especialista: defina passos, aponte dúvidas restantes e só implemente ideias novas quando ele mandar ("analise e só implemente quando eu falar").
- Rejeita solução que simplifica demais o que pediu (ex.: documentos do item viraram lista de tipos com "obrigatório", não um campo de texto).
- Testa o protótipo e devolve ajustes finos; gosta de reduzir chance de erro do usuário (ex.: botão Enviar).

## Ideias analisadas e ainda NÃO implementadas
- **Importação por planilha modelo** dentro do item do orçamento: o navegador não lê arquivos por link/caminho do Excel; o envio deve ser planilha + arquivos juntos (pasta ou ZIP), ligados pelo nome do arquivo, com tela de conferência antes de gravar. Implementar só quando o dono mandar.
- Integração RM/Fluig (ver seção 10 da especificação).

## Em aberto
Itens 5, 6, 7, 8, 10 e 11 da seção 9 da especificação. Além disso: como o Portal Processos modela empresas, grupos, setores e papéis (precisa ver o esquema do banco do portal para fechar a integração).
