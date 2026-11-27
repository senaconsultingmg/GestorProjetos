# GestorProjetos — contexto para quem continuar o trabalho

Módulo **Projetos e Obras** do Portal Processos (Sena Consulting). Leia nesta ordem antes de qualquer mudança:

1. `docs/ESPECIFICACAO.md` — especificação completa (escopo, perfis, regras, modelo de dados, fases, testes). **É a fonte da verdade.**
2. `docs/DECISOES.md` — decisões já tomadas, preferências do dono do produto e o que ainda está em aberto.
3. `prototipo/projetos-e-obras.html` — protótipo navegável com dados fictícios (abra no navegador). Ele mostra o comportamento esperado de cada tela; em caso de dúvida, o protótipo + a especificação valem como "requisito aceito".
4. `prototipo/fonte/` — código-fonte do protótipo em partes (dados, lógica, telas, formulários, ações). `prototipo/construir.sh` junta tudo. `prototipo/testes/` tem os testes de navegador (Playwright, Python) que provam as regras.

## Pilha alvo
React + TypeScript + Tailwind + PostgreSQL no Supabase; módulo dentro do Portal Processos, com o mesmo login. Regras críticas (saldos, travas de mês, permissões, cotações, documentos obrigatórios) devem ser aplicadas também no banco e em funções de servidor, não só na tela.

## Como trabalhar
- Portuguesa do Brasil em tudo que o usuário vê, nas mensagens e nos commits.
- Mudou comportamento? Atualize `docs/ESPECIFICACAO.md` e o protótipo (fonte + HTML) na mesma mudança, e rode os testes.
- O protótipo guarda só nomes de arquivos (sem conteúdo) e dados em memória; o sistema real guarda arquivos no destino configurado e abre por link assinado.
- Nada é apagado de verdade nos dados do negócio (histórico e log de acesso); veja a seção 6 da especificação.
- Commits terminam com as linhas de coautoria combinadas no projeto.

## Rodar o protótipo e os testes
```
./prototipo/construir.sh                 # gera prototipo/projetos-e-obras.html
pip install playwright && playwright install chromium
python3 prototipo/testes/o_t.py          # cada teste abre o HTML e imprime o resultado; procure por "Traceback" ou "Error"
```
Os testes apontam para o HTML por caminho fixo (`/home/claude/proto/obras2.html`); ajuste a constante no topo de cada arquivo ao rodar em outra máquina.
