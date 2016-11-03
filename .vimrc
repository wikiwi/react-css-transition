set backupcopy=yes
let s:path = expand('<sfile>:p:h')
let g:syntastic_typescript_checkers = ['tslint']
let g:syntastic_javascript_checkers = ['eslint']
let g:syntastic_yaml_checkers = ['jsyaml']
let NERDTreeShowHidden=1

let g:formatdef_eslint = '"cat > '.expand("%:p:h").'/.fix.'.expand('%:t').';'.
      \ s:path.'/node_modules/.bin/eslint --fix --ignore-pattern ''!*'' '.expand("%:p:h").'/.fix.'.expand('%:t').'> /dev/null 2>&1;'.
      \ 'cat '.expand("%:p:h").'/.fix.'.expand('%:t').';'.
      \ 'rm '.expand("%:p:h").'/.fix.'.expand('%:t').'"'
let g:formatters_javascript = ['eslint']

:function Autoformat()
:  if exists(":Autoformat") | :Autoformat | endif
:endfunction

execute 'au BufWrite '.s:path.'/*.tsx :call Autoformat()'
execute 'au BufWrite '.s:path.'/*.ts :call Autoformat()'
execute 'au BufWrite '.s:path.'/*.d.ts :call Autoformat()'
execute 'au BufWrite '.s:path.'/*.json :call Autoformat()'
execute 'au BufWrite '.s:path.'/*.js :call Autoformat()'

