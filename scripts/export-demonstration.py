"""Export faithful page images and readable excerpts from the source PDF.

Usage: python scripts/export-demonstration.py path/to/hemograma.pdf
Requires PyMuPDF and ffmpeg. Source PDFs stay outside the public directory.
"""

from pathlib import Path
import subprocess
import sys
import tempfile

import pymupdf


if len(sys.argv) != 2:
    raise SystemExit("Usage: python scripts/export-demonstration.py path/to/hemograma.pdf")

document = pymupdf.open(sys.argv[1])
if len(document) < 48:
    raise SystemExit("Expected the 53-page Hemograma Descomplicado PDF")

output = Path(__file__).resolve().parents[1] / "public" / "images"
output.mkdir(parents=True, exist_ok=True)


def export(name: str, page_number: int, clip: tuple[float, ...] | None, scale: float):
    page = document[page_number - 1]
    rectangle = pymupdf.Rect(clip) if clip else page.rect
    pixmap = page.get_pixmap(matrix=pymupdf.Matrix(scale, scale), clip=rectangle)
    target = output / name
    with tempfile.TemporaryDirectory() as temporary:
        source = Path(temporary) / "page.png"
        pixmap.save(source)
        subprocess.run(
            ["ffmpeg", "-y", "-loglevel", "error", "-i", str(source),
             "-c:v", "libwebp", "-quality", "90", str(target)],
            check=True,
        )
    print(f"{target.name}: page {page_number}, {pixmap.width}x{pixmap.height}")


export("percentual-60.webp", 28, (40, 105, 225, 225), 3)
export("percentual-30.webp", 28, (228, 105, 413, 225), 3)
export("desafio-05.webp", 45, (36, 132, 420, 198), 3)
export("resolucao-05.webp", 48, (36, 93, 420, 184), 3)
export("pagina-45.webp", 45, None, 2.3)
export("pagina-48.webp", 48, None, 2.3)
