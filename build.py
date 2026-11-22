# Rebuilds index.html by injecting base64 images into src/template.html
t = open('src/template.html', encoding='utf-8').read().replace('__IMGS__', open('src/imgs.json').read())
open('index.html', 'w', encoding='utf-8').write(t)
