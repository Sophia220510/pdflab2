$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.Speech

$renderDirectory = Join-Path $PSScriptRoot '..\.work\ads'
New-Item -ItemType Directory -Force -Path $renderDirectory | Out-Null

$paragraphs = @(
  'Sessenta por cento pode representar menos células do que trinta por cento. O total de leucócitos muda essa conta.',
  'É esse tipo de relação que o Hemograma Descomplicado explica: você acompanha os números, entende o raciocínio e depois pratica com exercícios comentados.',
  'São 53 páginas ilustradas e 12 desafios para estudantes de Biomedicina, Farmácia e Análises Clínicas.',
  'Conheça as páginas do material. O e-book custa R$37.'
)

$speaker = New-Object System.Speech.Synthesis.SpeechSynthesizer
try {
  $speaker.SelectVoice('Microsoft Maria Desktop')
  $speaker.Rate = 3
  for ($index = 0; $index -lt $paragraphs.Count; $index++) {
    $target = Join-Path $renderDirectory ('voice-{0}.wav' -f ($index + 1))
    $speaker.SetOutputToWaveFile($target)
    $speaker.Speak($paragraphs[$index])
    $speaker.SetOutputToNull()
    Write-Output $target
  }
} finally {
  $speaker.Dispose()
}
