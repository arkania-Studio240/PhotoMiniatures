/* Idiomas: es (base), en, pt, fr. Traduce el DOM (texto, title, placeholder), incluidos los textos que genera el código.
   Lo que no está en el diccionario se queda en español. Añadir un idioma = añadir una columna a D y una entrada a LANGS. */
(function(){
const LANGS={es:'Español',en:'English',pt:'Português',fr:'Français'},IDX={en:1,pt:2,fr:3};
const D=new Map(`Plantillas|Templates|Modelos|Modèles
Elementos|Elements|Elementos|Éléments
Pintar|Paint|Pintar|Peindre
Selección|Selection|Seleção|Sélection
Filtros|Filters|Filtros|Filtres
Fondos|Backgrounds|Fundos|Arrière-plans
Assets|Assets|Recursos|Ressources
Vista|View|Vista|Vue
Inicio|Home|Início|Accueil
Deshacer|Undo|Desfazer|Annuler
Rehacer|Redo|Refazer|Rétablir
Analizar|Analyze|Analisar|Analyser
Más|More|Mais|Plus
Exportar|Export|Exportar|Exporter
Guardar proyecto|Save project|Salvar projeto|Enregistrer le projet
Abrir proyectos|Open projects|Abrir projetos|Ouvrir des projets
Importar PSD|Import PSD|Importar PSD|Importer un PSD
Exportar PSD|Export PSD|Exportar PSD|Exporter en PSD
Vista y análisis|View & analysis|Vista e análise|Aperçu et analyse
Instalar app|Install app|Instalar app|Installer l'app
Rectángulo|Rectangle|Retângulo|Rectangle
Círculo|Circle|Círculo|Cercle
Texto|Text|Texto|Texte
Subir imagen|Upload image|Enviar imagem|Importer une image
Estrella|Star|Estrela|Étoile
Triángulo|Triangle|Triângulo|Triangle
Hexágono|Hexagon|Hexágono|Hexagone
Rombo|Diamond|Losango|Losange
Flecha|Arrow|Seta|Flèche
Pluma|Pen|Caneta|Plume
Cerrar forma|Close shape|Fechar forma|Fermer la forme
Terminar abierta|Finish open|Terminar aberta|Terminer ouvert
Mover|Move|Mover|Déplacer
Pincel|Brush|Pincel|Pinceau
Borrador|Eraser|Borracha|Gomme
Cuentagotas|Eyedropper|Conta-gotas|Pipette
Tamaño|Size|Tamanho|Taille
Color|Color|Cor|Couleur
Opacidad|Opacity|Opacidade|Opacité
Marco rect.|Rect. marquee|Marco ret.|Cadre rect.
Elipse|Ellipse|Elipse|Ellipse
Lazo|Lasso|Laço|Lasso
Varita mágica|Magic wand|Varinha mágica|Baguette magique
Tolerancia varita|Wand tolerance|Tolerância da varinha|Tolérance de la baguette
Invertir|Invert|Inverter|Inverser
Deseleccionar|Deselect|Desmarcar|Désélectionner
Borrar contenido|Delete content|Apagar conteúdo|Effacer le contenu
Copiar a capa|Copy to layer|Copiar para camada|Copier vers un calque
Rellenar color|Fill color|Preencher cor|Remplir de couleur
Conservar selección (máscara)|Keep selection (mask)|Manter seleção (máscara)|Conserver la sélection (masque)
Ocultar selección con máscara|Hide selection with mask|Ocultar seleção com máscara|Masquer la sélection
Añadir máscara|Add mask|Adicionar máscara|Ajouter un masque
Pincel: ocultar|Brush: hide|Pincel: ocultar|Pinceau : masquer
Pincel: revelar|Brush: reveal|Pincel: revelar|Pinceau : révéler
Quitar máscara|Remove mask|Remover máscara|Supprimer le masque
Radio de refinado|Refine radius|Raio de refinamento|Rayon d'affinage
Expandir máscara|Expand mask|Expandir máscara|Étendre le masque
Contraer máscara|Contract mask|Contrair máscara|Contracter le masque
Difuminar bordes|Feather edges|Suavizar bordas|Adoucir les bords
Suavizar bordes|Smooth edges|Alisar bordas|Lisser les bords
Invertir máscara|Invert mask|Inverter máscara|Inverser le masque
Reglas|Rulers|Réguas|Règles
Guías e imán|Guides & snap|Guias e ímã|Guides et magnétisme
+ Guía vertical|+ Vertical guide|+ Guia vertical|+ Guide vertical
+ Guía horizontal|+ Horizontal guide|+ Guia horizontal|+ Guide horizontal
Ajustar a pantalla|Fit to screen|Ajustar à tela|Ajuster à l'écran
Zoom 100 %|Zoom 100%|Zoom 100%|Zoom 100 %
Tamaño del lienzo|Canvas size|Tamanho da tela|Taille du canevas
Lienzo|Canvas|Tela|Canevas
Ancho|Width|Largura|Largeur
Alto|Height|Altura|Hauteur
Aplicar|Apply|Aplicar|Appliquer
Escalar el contenido|Scale content|Dimensionar o conteúdo|Mettre le contenu à l'échelle
Mínimo 100 px|Minimum 100 px|Mínimo 100 px|Minimum 100 px
Ajustes generales|General adjustments|Ajustes gerais|Réglages généraux
Exposición|Exposure|Exposição|Exposition
Contraste|Contrast|Contraste|Contraste
Saturación|Saturation|Saturação|Saturation
Viñeta|Vignette|Vinheta|Vignette
Grano|Grain|Granulação|Grain
Restablecer ajustes|Reset adjustments|Redefinir ajustes|Réinitialiser les réglages
Propiedades|Properties|Propriedades|Propriétés
Capas|Layers|Camadas|Calques
Historial|History|Histórico|Historique
Selecciona un objeto|Select an object|Selecione um objeto|Sélectionnez un objet
Agrupar|Group|Agrupar|Grouper
Desagrupar|Ungroup|Desagrupar|Dégrouper
Fusionar|Merge|Mesclar|Fusionner
Recorte|Clip|Recorte|Détourage
Duplicar|Duplicate|Duplicar|Dupliquer
Subir|Raise|Subir|Monter
Bajar|Lower|Descer|Descendre
Eliminar|Delete|Excluir|Supprimer
Crear|Create|Criar|Créer
Ajustes|Settings|Ajustes|Réglages
Plantillas populares|Popular templates|Modelos populares|Modèles populaires
Proyectos recientes|Recent projects|Projetos recentes|Projets récents
Aún no hay proyectos guardados.|No saved projects yet.|Ainda não há projetos salvos.|Aucun projet enregistré.
Buscar plantillas...|Search templates...|Buscar modelos...|Rechercher des modèles...
Todas|All|Todos|Tous
Volver al editor|Back to editor|Voltar ao editor|Retour à l'éditeur
＋ Nueva miniatura|＋ New thumbnail|＋ Nova miniatura|＋ Nouvelle miniature
Tecnología|Technology|Tecnologia|Technologie
Reacciones|Reactions|Reações|Réactions
Tutoriales|Tutorials|Tutoriais|Tutoriels
Nombre|Name|Nome|Nom
Formato|Format|Formato|Format
Calidad|Quality|Qualidade|Qualité
Descargar|Download|Baixar|Télécharger
Efectos de capa|Layer effects|Efeitos de camada|Effets de calque
Sombra|Shadow|Sombra|Ombre
Contorno|Outline|Contorno|Contour
Brillo|Brightness|Brilho|Luminosité
Desenfoque|Blur|Desfoque|Flou
Temperatura|Temperature|Temperatura|Température
Tono|Hue|Matiz|Teinte
Rotación °|Rotation °|Rotação °|Rotation °
Blanco y negro|Black & white|Preto e branco|Noir et blanc
Visible|Visible|Visível|Visible
Bloqueado|Locked|Bloqueado|Verrouillé
Multiplicar|Multiply|Multiplicar|Multiplier
Quitar fondo|Remove background|Remover fundo|Supprimer l'arrière-plan
Voltear H|Flip H|Inverter H|Retourner H
Voltear V|Flip V|Inverter V|Retourner V
Izquierda|Left|Esquerda|Gauche
Derecha|Right|Direita|Droite
Arriba|Top|Topo|Haut
Abajo|Bottom|Base|Bas
Cambio|Change|Alteração|Modification
Añadir capa|Add layer|Adicionar camada|Ajouter un calque
Editar|Edit|Editar|Modifier
Proyecto guardado|Project saved|Projeto salvo|Projet enregistré
Selecciona una capa|Select a layer|Selecione uma camada|Sélectionnez un calque
Primero haz una selección|Make a selection first|Faça uma seleção primeiro|Faites d'abord une sélection
Imagen original restaurada|Original image restored|Imagem original restaurada|Image originale restaurée
Máscara invertida|Mask inverted|Máscara invertida|Masque inversé
Bordes suavizados|Edges smoothed|Bordas alisadas|Bords lissés
Estilo copiado|Style copied|Estilo copiado|Style copié
Copia un estilo primero|Copy a style first|Copie um estilo primeiro|Copiez d'abord un style
Ajustes restablecidos|Adjustments reset|Ajustes redefinidos|Réglages réinitialisés
Todas las capas están ocultas|All layers are hidden|Todas as camadas estão ocultas|Tous les calques sont masqués
Corte automático listo|Auto cutout done|Recorte automático pronto|Détourage automatique terminé
Capa convertida a píxeles|Layer converted to pixels|Camada convertida em pixels|Calque converti en pixels
Seleccionar con IA (clics)|Select with AI (clicks)|Selecionar com IA (cliques)|Sélection par IA (clics)
＋ Mantener|＋ Keep|＋ Manter|＋ Garder
− Quitar|− Remove|− Remover|− Retirer
Quitar punto|Remove point|Remover ponto|Retirer le point
Cancelar|Cancel|Cancelar|Annuler
Cargando modelo…|Loading model…|Carregando modelo…|Chargement du modèle…
Segmentando…|Segmenting…|Segmentando…|Segmentation…
Toca el objeto que quieres conservar|Tap the object you want to keep|Toque no objeto que deseja manter|Touchez l'objet à conserver
No se pudo ejecutar el modelo. Revisa tu conexión e inténtalo de nuevo.|Could not run the model. Check your connection and try again.|Não foi possível executar o modelo. Verifique a conexão e tente novamente.|Impossible d'exécuter le modèle. Vérifiez votre connexion et réessayez.
Selección aplicada como máscara. Puedes retocarla o restaurar la original.|Selection applied as a mask. You can refine it or restore the original.|Seleção aplicada como máscara. Você pode ajustá-la ou restaurar a original.|Sélection appliquée comme masque. Vous pouvez l'affiner ou restaurer l'original.
Vista CTR|CTR preview|Pré-visualização CTR|Aperçu CTR
Escritorio (360px)|Desktop (360px)|Desktop (360px)|Bureau (360px)
Móvil (168px)|Mobile (168px)|Celular (168px)|Mobile (168px)
Recomendaciones (120px)|Recommendations (120px)|Recomendações (120px)|Recommandations (120px)
Análisis|Analysis|Análise|Analyse
Consejos: usa pocas palabras (3 máx.), alto contraste entre texto y fondo, un punto focal claro y evita dejar texto cerca de las esquinas (ahí va la duración del video). Revisa que se lea en la vista pequeña.|Tips: use few words (3 max), high contrast between text and background, a clear focal point, and keep text away from the corners (the video duration goes there). Check that it reads in the small preview.|Dicas: use poucas palavras (máx. 3), alto contraste entre texto e fundo, um ponto focal claro e evite texto perto dos cantos (ali fica a duração do vídeo). Confira se lê bem na prévia pequena.|Conseils : peu de mots (3 max), fort contraste entre texte et fond, un point focal clair, et pas de texte près des coins (la durée de la vidéo s'y affiche). Vérifiez la lisibilité dans l'aperçu réduit.
Heurísticas orientativas calculadas en tu dispositivo (estimaciones, no medición exacta). No predicen clics ni CTR.|Indicative heuristics computed on your device (estimates, not exact measurements). They do not predict clicks or CTR.|Heurísticas orientativas calculadas no seu dispositivo (estimativas, não medição exata). Não preveem cliques nem CTR.|Heuristiques indicatives calculées sur votre appareil (estimations, pas de mesure exacte). Elles ne prédisent ni clics ni CTR.
Hay un punto focal reconocible (detalle concentrado cerca del centro).|There is a recognizable focal point (detail concentrated near the center).|Há um ponto focal reconhecível (detalhes concentrados perto do centro).|Il y a un point focal reconnaissable (détails concentrés près du centre).
Poco contraste general: la imagen se ve plana en tamaños pequeños. Sube contraste o separa sujeto y fondo.|Low overall contrast: the image looks flat at small sizes. Raise contrast or separate subject and background.|Pouco contraste geral: a imagem fica plana em tamanhos pequenos. Aumente o contraste ou separe sujeito e fundo.|Faible contraste global : l'image paraît plate en petit. Augmentez le contraste ou séparez sujet et fond.
La miniatura es muy oscura; en el feed de YouTube puede perderse.|The thumbnail is very dark; it may get lost in the YouTube feed.|A miniatura está muito escura; pode se perder no feed do YouTube.|La miniature est très sombre ; elle peut se perdre dans le fil YouTube.
La miniatura es muy clara; puede confundirse con el fondo blanco de YouTube.|The thumbnail is very bright; it may blend into YouTube's white background.|A miniatura está muito clara; pode se confundir com o fundo branco do YouTube.|La miniature est très claire ; elle peut se fondre dans le fond blanc de YouTube.
El detalle visual está repartido por los bordes. Un sujeto grande en el centro o en un tercio lateral mejora el punto focal.|Visual detail is spread along the edges. A large subject in the center or a side third improves the focal point.|Os detalhes estão espalhados pelas bordas. Um sujeito grande no centro ou num terço lateral melhora o ponto focal.|Les détails sont répartis sur les bords. Un grand sujet au centre ou sur un tiers latéral améliore le point focal.
El foco está justo en el centro; si el texto va al lado opuesto, la composición queda más equilibrada.|The focus is right at the center; putting the text on the opposite side balances the composition.|O foco está bem no centro; com o texto no lado oposto, a composição fica mais equilibrada.|Le point focal est au centre ; placer le texte du côté opposé équilibre la composition.
No hay texto visible. Una frase corta puede ayudar a transmitir el tema, si encaja con tu estilo.|There is no visible text. A short phrase can help convey the topic, if it fits your style.|Não há texto visível. Uma frase curta pode ajudar a transmitir o tema, se combinar com seu estilo.|Aucun texte visible. Une courte phrase peut aider à transmettre le sujet, si elle convient à votre style.
Todos los textos tienen un tamaño parecido; haz mucho mayor la palabra principal para crear jerarquía visual.|All texts are a similar size; make the main word much larger to create visual hierarchy.|Todos os textos têm tamanho parecido; aumente bastante a palavra principal para criar hierarquia visual.|Tous les textes ont une taille similaire ; agrandissez nettement le mot principal pour créer une hiérarchie visuelle.
Hay jerarquía de texto: la palabra principal destaca claramente.|Clear text hierarchy: the main word stands out.|Há hierarquia de texto: a palavra principal se destaca.|Hiérarchie de texte claire : le mot principal ressort.`.split('\n').map(l=>{const a=l.split('|');return[a[0],a.slice(1)]}));
const PAT=[[/^(\d+)\. (.+)$/,(m,t)=>m[1]+'. '+t(m[2])],[/^Exportar (.+)$/,(m,t)=>t('Exportar')+' '+m[1]],[/^Lienzo (.+)$/,(m,t)=>t('Lienzo')+' '+m[1]],[/^Editar · (.+)$/,(m,t)=>t('Editar')+' · '+m[1]]];
const PAT2=[[/^Cantidad de texto adecuada \((\d+) palabras\)\.$/,['Appropriate amount of text ($1 words).','Quantidade de texto adequada ($1 palavras).','Quantité de texte adaptée ($1 mots).']],
[/^Hay (\d+) palabras de texto\. Lo habitual es 1 a 4 para que se lea en móvil\.$/,['There are $1 words of text. 1 to 4 is typical so it reads on mobile.','Há $1 palavras de texto. O comum é de 1 a 4 para ler bem no celular.','Il y a $1 mots de texte. 1 à 4 est l\'usage pour rester lisible sur mobile.']],
[/^(.+): contraste suficiente \(aprox\. ([\d.]+):1\)\.$/,['$1: enough contrast (approx. $2:1).','$1: contraste suficiente (aprox. $2:1).','$1 : contraste suffisant (env. $2:1).']],
[/^(.+): contraste suficiente \(aprox\. ([\d.]+):1, ayudado por el contorno\)\.$/,['$1: enough contrast (approx. $2:1, helped by the outline).','$1: contraste suficiente (aprox. $2:1, ajudado pelo contorno).','$1 : contraste suffisant (env. $2:1, aidé par le contour).']],
[/^(.+): contraste bajo con el fondo \(aprox\. ([\d.]+):1\)\. Añade contorno, sombra o cambia el color\.$/,['$1: low contrast with the background (approx. $2:1). Add an outline, shadow or change the color.','$1: contraste baixo com o fundo (aprox. $2:1). Adicione contorno, sombra ou mude a cor.','$1 : faible contraste avec le fond (env. $2:1). Ajoutez un contour, une ombre ou changez la couleur.']],
[/^(.+): tamaño pequeño; en móvil mediría unos (\d+) px\. Agrándalo\.$/,['$1: small size; on mobile it would be about $2 px. Make it larger.','$1: tamanho pequeno; no celular teria cerca de $2 px. Aumente.','$1 : taille réduite ; sur mobile environ $2 px. Agrandissez-le.']],
[/^(.+) queda en la esquina inferior derecha, donde YouTube muestra la duración del video\.$/,['$1 sits in the bottom-right corner, where YouTube shows the video duration.','$1 fica no canto inferior direito, onde o YouTube mostra a duração do vídeo.','$1 se trouve dans le coin inférieur droit, où YouTube affiche la durée de la vidéo.']],
[/^(.+) está muy cerca del borde; puede recortarse según el dispositivo\.$/,['$1 is very close to the edge; it may be cropped depending on the device.','$1 está muito perto da borda; pode ser cortado conforme o dispositivo.','$1 est très proche du bord ; il peut être coupé selon l\'appareil.']]];
let lang='es';try{lang=localStorage.getItem('ts_lang')||''}catch(e){}
if(!LANGS[lang]){const n=(navigator.language||'es').slice(0,2);lang=LANGS[n]?n:'en'}
const tr=s=>{if(lang==='es')return s;const e=D.get(s);if(e&&e[IDX[lang]-1])return e[IDX[lang]-1];for(const[r,f]of PAT){const m=s.match(r);if(m)return f(m,tr)}for(const[r,t]of PAT2){const m=s.match(r);if(m)return t[IDX[lang]-1].replace(/\$(\d)/g,(_,i)=>m[i])}return s};
const skip=n=>{const p=n.nodeType===1?n:n.parentElement;return !p||p.closest('script,style,#layers,canvas,textarea,input')};
const tx=n=>{if(skip(n))return;const v=n.nodeValue;if(!v.trim())return;if(n.__o===undefined||v!==n.__t)n.__o=v;const o=n.__o,nv=o.match(/^\s*/)[0]+tr(o.trim())+o.match(/\s*$/)[0];n.__t=nv;if(v!==nv)n.nodeValue=nv};
const at=e=>{['title','placeholder'].forEach(a=>{if(!e.hasAttribute||!e.hasAttribute(a))return;e.__a=e.__a||{};const v=e.getAttribute(a);if(e.__a[a]===undefined||v!==e.__a[a+'t'])e.__a[a]=v;const nv=tr(e.__a[a]);e.__a[a+'t']=nv;if(v!==nv)e.setAttribute(a,nv)})};
const scan=r=>{if(r.nodeType===3)return tx(r);if(r.nodeType!==1)return;if(r.closest('script,style,#layers'))return;at(r);r.querySelectorAll('[title],[placeholder]').forEach(at);const w=document.createTreeWalker(r,NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode())tx(n)};
window.I18n={get lang(){return lang},tr,set(l){if(!LANGS[l])return;lang=l;try{localStorage.setItem('ts_lang',l)}catch(e){}document.documentElement.lang=l;scan(document.body);const s=document.getElementById('lang');if(s)s.value=l}};
const mo=new MutationObserver(ms=>{for(const m of ms){if(m.type==='characterData')tx(m.target);else m.addedNodes.forEach(scan)}});
const more=document.getElementById('more'),sel=document.createElement('select');sel.id='lang';sel.title='Idioma / Language';sel.innerHTML=Object.entries(LANGS).map(([k,v])=>`<option value="${k}">${v}</option>`).join('');sel.onchange=()=>I18n.set(sel.value);if(more)more.prepend(sel);
document.documentElement.lang=lang;sel.value=lang;scan(document.body);mo.observe(document.body,{childList:true,subtree:true,characterData:true});
})();
