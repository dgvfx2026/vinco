# VINCO — Presença em cada traço

Landing page completa de uma barbearia **fictícia**, criada para portfólio. Identidade, textos e composição originais. Referência visual estudada: [Mett — Barber Shop, Behance](https://www.behance.net/gallery/179701509/Mett-Barber-Shop).

## Abrir o site

Domínio configurado para publicação: https://vincobarber.vercel.app/

Repositório: https://github.com/dgvfx2026/vinco

Prévia local: http://127.0.0.1:4173/

O `index.html` e todos os recursos do site ficam na raiz do projeto. Não há etapa de compilação nem dependências de aplicação para instalar. O arquivo `vercel.json` configura o projeto como HTML estático, com saída na raiz e comandos de instalação e build desativados. No painel do Vercel, mantenha o Root Directory na raiz do repositório, sem selecionar a antiga pasta `dist`.

Para servir localmente, execute `npm run dev` nesta pasta e abra http://127.0.0.1:4173. Requer Python 3. `index.html` também pode ser aberto diretamente no navegador.

## Arquivos

- `index.html`: conteúdo semântico, metadados e vetores de recorte.
- `styles.css`: sistema visual, responsividade e microinterações.
- `app.js`: menu móvel, diálogos, galeria, agendamento demonstrativo e sequências de animação.
- `assets/`: fotografias responsivas em AVIF com fallback WebP, máscaras SVG de lâmina e máquina de corte, fontes locais, favicon e imagem social.
- `vercel.json`: publicação estática no Vercel a partir da raiz.
- `DIRECAO-DE-ARTE.md`: conceito da marca, decisões visuais, origem das imagens e prompts finais.
- `LICENSES/`: licenças SIL OFL das fontes.
- `local-business.example.json`: modelo não publicado para informações reais de um futuro negócio.

## Implementado

HERO fotográfico exclusivo, máscaras de lâmina em CSS/SVG, conceito da marca, quatro serviços com preços e durações fictícios, galeria editorial ampliável, diferenciais, CTA, localização e contato conceituais, rodapé e informações de privacidade. Navegação por âncoras, menu móvel com estado acessível e fechamento por Escape, modais nativos com foco e retorno ao acionador, animações automáticas e conteúdo disponível sem JavaScript.

O agendamento permite escolher serviço, dia e horário e revisar o resumo. Bloqueia domingo e segunda; ajusta os horários ao período ilustrativo de atendimento e à duração do serviço. Funciona apenas no navegador, sem dados pessoais, envio, pagamento ou reserva real.

## Paleta

Grafite `#242426`, branco quente `#F0EFEB` e vermelho queimado `#BA3E32`. Botões vermelhos usam texto branco; destaques sobre grafite usam vermelho claro `#F07C6D`. Fotografias, máscaras e coreografia foram preservadas.

## Animações

Entradas ao rolar a página com IntersectionObserver e Web Animations API, sem biblioteca adicional. Headline do HERO em três tempos; lâminas de lados opostos; textos, preços e setas dos serviços em cascata; fotografias com deslocamento e escala suaves; três ícones vetoriais autorais que chegam da esquerda, direita e de baixo, com uma pequena rotação e acomodação final. A intensidade e os atrasos são menores no celular. Cada elemento entra uma vez por visita, sem controlar a rolagem do usuário.

Todas as entradas começam automaticamente, conforme solicitado, sem botão de ativação ou pausa. A coreografia permanece ativa inclusive quando o navegador sinaliza `prefers-reduced-motion`; essa preferência desativa apenas a rolagem suave por âncoras. O conteúdo permanece visível sem JavaScript. O foco por teclado estabiliza imediatamente o elemento focado. Ao terminar, as animações liberam os estilos para preservar o hover, as máscaras e as rotações da composição.

As entradas usam apenas transformações e opacidade. As leituras de estilo são agrupadas antes das animações, evitando recálculos entre elementos. Cada alvo sai do observador na primeira entrada; configurações e efeitos finalizados são liberados. `will-change` é aplicado somente enquanto o efeito está em execução. Não há biblioteca de animação, loop contínuo ou processamento a cada evento de scroll.

## Otimização das imagens e fontes

As 12 variantes AVIF foram exportadas a partir dos PNGs originais, com as mesmas dimensões e composição; detalhes de pele, cabelo e materiais foram comparados visualmente. Somam 1.107.400 bytes contra 1.344.474 bytes das versões WebP equivalentes: redução de 17,6% no conjunto das variantes. Esse total compara os arquivos disponíveis, não o download de uma visita nem uma pontuação de performance. O navegador escolhe uma versão por fotografia conforme `srcset` e `sizes`; WebP permanece como fallback.

O HERO usa preload AVIF compatível com o `picture` e prioridade alta. Fotografias abaixo da primeira tela mantêm lazy loading, dimensões declaradas e decodificação assíncrona. A galeria ampliada também usa AVIF com fallback. As fontes locais mantêm todos os pesos utilizados e os subconjuntos latinos adequados ao conteúdo em português; arquivos de idiomas não utilizados foram removidos. Duas fontes da composição inicial são pré-carregadas.

## SEO e publicação

Title, description, canonical, Open Graph, imagem social, idioma, um H1, hierarquia H2/H3, alt descritivos, robots.txt, sitemap.xml e JSON-LD de WebSite configurados. Imagem principal prioritária; demais fotografias com lazy loading e dimensões declaradas. Fontes e fotografias locais; nenhum recurso visual depende de URL temporária.

O conteúdo visível identifica o caráter fictício. Não há avaliações, perfis sociais, telefone ou localização geográfica inventados. **Não foi publicado um LocalBusiness de uma empresa inexistente.** O modelo usa [HairSalon, do Schema.org](https://schema.org/HairSalon) e só deve ser preenchido e incorporado quando houver empresa, endereço e contato reais, verificados e visíveis na página. Não incluir notas ou avaliações sem fonte legítima.

Canonical, og:url, og:image, JSON-LD, robots.txt e sitemap.xml usam https://vincobarber.vercel.app/. Ao migrar de domínio, atualizar esses endereços com a nova URL definitiva. `.openai/hosting.json` preserva a identidade de uma hospedagem alternativa registrada anteriormente, cuja publicação não foi concluída; ele não configura o Vercel.

## Validação realizada

Revisão visual em navegador Chromium nas dimensões solicitadas de 1440×900, 1024×768, 768×1024, 390×844, 360×800 e 320×740. A área útil é ligeiramente menor quando há barra de rolagem. Sem rolagem horizontal nas larguras verificadas. Segunda passagem de direção de arte para legibilidade, contraste do botão de fechar e continuidade do conteúdo durante animações.

Menu móvel, navegação, abertura dos serviços, dia fechado, horários de sábado, resumo, edição da escolha, Escape, retorno de foco, galeria e informações de privacidade testados. Verificação de um H1, IDs únicos, destinos de âncoras, JSON-LD válido como JSON, arquivos e dimensões de srcset, respostas HTTP 200 dos recursos e sintaxe do JavaScript. Sem erros ou avisos capturados no console durante os testes.

Na revisão de movimento, foram observadas as entradas direcionais e a sequência dos três ícones em desktop e mobile, inclusive durante rolagem real. O início automático foi confirmado sem interação, com a preferência de movimento reduzido ativa no navegador de teste. O foco por Tab encerrou a transformação da fotografia focada. A contenção visual evita excesso de largura transitório. Menu móvel e abertura do agendamento continuaram funcionais após as entradas.

Na revisão após a otimização, o navegador carregou AVIF no HERO, nos dois recortes do conceito e nas três ampliações da galeria. Máscaras, proporções e enquadramentos foram conferidos após a inclusão de `picture`. Ausência do controle de ativação e início automático foram confirmados em desktop e mobile. Sem excesso de largura durante animações nas larguras de 1440, 768, 390, 360 e 320 pixels; sem erros ou avisos capturados no console. As dimensões das variantes, arquivos locais, referências das fontes e respostas HTTP foram verificados novamente.

Combinações da paleta grafite e vermelho verificadas matematicamente: grafite/branco quente 13,47:1; texto secundário/branco quente 5,19:1; branco/vermelho 5,49:1; vermelho claro/grafite 5,76:1; vermelho/branco quente 4,77:1. Isso não constitui auditoria completa de acessibilidade. Não foram realizados testes em aparelhos físicos ou Safari, nem medição Lighthouse ou Core Web Vitals; nenhuma pontuação é alegada.

## Configuração externa futura

Para uso comercial real: integrar uma agenda, substituir todos os dados fictícios por dados verificados, obter fotografias reais ou manter a identificação de imagens de IA, definir políticas adequadas ao fluxo de dados, configurar domínio próprio e publicar com o acesso desejado. O estado atual é uma demonstração pronta para portfólio.
