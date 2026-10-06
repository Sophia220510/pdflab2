# Anúncio de demonstração

O arquivo [hemograma-demonstracao-vertical.mp4](hemograma-demonstracao-vertical.mp4) é um vídeo vertical de 1080 × 1920 pixels, com 34,4 segundos. Ele usa a página 28 do PDF principal, o desafio 05 da página 45, a resolução correspondente da página 48, a capa e a narração fornecida pelo responsável. A voz é uma síntese em português; não representa Paulo Brandão.

## Sequência

1. Mostra 60% e 30% de linfócitos sem os totais.
2. Revela 3.000 e 12.000 leucócitos/µL e as contagens absolutas de 1.800 e 3.600 linfócitos/µL.
3. Mostra a página 28 inteira: “Percentual pode enganar”.
4. Mostra o desafio 05 e sua resolução comentada.
5. Termina com capa, R$37 e “Saiba mais”.

## Narração

> Sessenta por cento pode representar menos células do que trinta por cento. O total de leucócitos muda essa conta.
>
> É esse tipo de relação que o Hemograma Descomplicado explica: você acompanha os números, entende o raciocínio e depois pratica com exercícios comentados.
>
> São 53 páginas ilustradas e 12 desafios para estudantes de Biomedicina, Farmácia e Análises Clínicas.
>
> Conheça as páginas do material. O e-book custa R$37.

## Uso e teste

O destino do botão “Saiba mais” na plataforma de anúncios deve ser a landing page publicada, com parâmetros UTM da campanha. O criativo está pronto, mas nenhuma campanha foi publicada e nenhum gasto foi iniciado.

Para comparar este criativo com o anúncio de autoridade, mantenha o mesmo público e a mesma oferta, dentro de um limite total de gasto previamente confirmado. Compare **compras aprovadas** e **CPA**. Cliques e chegadas ao checkout ajudam a identificar onde as pessoas saem do fluxo, mas não substituem as compras aprovadas.

Se Paulo gravar um comentário curto explicando a página 28, a gravação pode substituir a voz sintetizada em uma segunda versão do anúncio. Use essa versão como variação separada.

## Reproduzir

Com Python, PyMuPDF, Node, Playwright, PowerShell com `System.Speech` e FFmpeg instalados, execute a partir da raiz do projeto:

```powershell
python scripts/export-demonstration.py "C:\Users\dbran\Downloads\01-Hemograma-Descomplicado (1).pdf"
powershell -ExecutionPolicy Bypass -File ads/render-voice.ps1
node ads/render-slides.mjs
python ads/render-video.py
```

Substitua o caminho do PDF no primeiro comando se necessário. Os arquivos intermediários ficam em `.work/ads/` e não são publicados no site.
