Arquivos de dados para AR.js

- camera_para.dat: Arquivo de calibração padrão do AR.js (já incluído)
- reference-image.png: Imagem de referência 512x512 (padrão checkerboard preto/branco) para geração de NFT descriptor
- reference-image.svg: Versão SVG da imagem de referência (pode ser usado para recriar PNG)
- nft-descriptor.fset: Descritor NFT para tracking (será gerado posteriormente via ferramenta AR.js)
- nft-descriptor.iset: Image set para NFT tracking (se aplicável)
- nft-descriptor.fset3: Descritor NFT versão 3 (se aplicável)

Para gerar o NFT descriptor:
1. Use a imagem reference-image.png como imagem de referência
2. Execute a ferramenta AR.js marker training:
   - GitHub: https://github.com/AR-js-org/AR.js/tree/master/three.js/examples/marker-training
   - Ou use versão online se disponível
3. Faça upload da reference-image.png
4. Baixe os arquivos .fset, .iset, .fset3 gerados
5. Renomeie para nft-descriptor.fset, nft-descriptor.iset, nft-descriptor.fset3
6. Coloque em /public/data/

Para recriar a imagem de referência:
- Execute: node scripts/create-nft-reference-image.js
