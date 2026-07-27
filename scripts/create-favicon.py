from pathlib import Path

from PIL import Image


root = Path(__file__).resolve().parents[1]
source = root.parent / "OGS_Logotyper/PNG/ogs_avatar_rundad_fyrkant.png"
output = root / "public/favicon-padded.png"

icon = Image.open(source).convert("RGBA")
icon.thumbnail((440, 440), Image.Resampling.LANCZOS)

canvas = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
x = (canvas.width - icon.width) // 2
y = (canvas.height - icon.height) // 2
canvas.alpha_composite(icon, (x, y))
canvas.save(output, "PNG", optimize=True)
