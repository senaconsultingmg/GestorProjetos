#!/bin/bash
# Junta os arquivos de prototipo/fonte em um único HTML (prototipo/projetos-e-obras.html) e confere a sintaxe do JavaScript.
set -e
cd "$(dirname "$0")/fonte"
cat a_head.html b_data.js c_logic.js d_views.js e_forms.js g_staff.js f_actions.js z_tail.html > ../projetos-e-obras.html
python3 -c "
s=open('../projetos-e-obras.html',encoding='utf8').read();i=s.index('<script>')+8;j=s.rindex('</script>');open('/tmp/po.js','w',encoding='utf8').write(s[i:j])"
node --check /tmp/po.js && echo SYNTAX_OK
