"""Máquina de vídeos de achadinhos.

Uso:  python3 fazer_video.py produtos/<pasta>
A pasta precisa ter config.json + a imagem do anúncio (print da Shopee).
Gera um vídeo vertical 1080x1920 com gancho, recortes animados, textos, preço,
"link na bio" no final e música de fundo original.
"""
import json, math, os, subprocess, sys, wave
import cairo
import numpy as np
from PIL import Image, ImageFilter

W, H, FPS, SR = 1080, 1920, 30, 48000
FONT = "Fredoka Light"

pasta = sys.argv[1]
cfg = json.load(open(os.path.join(pasta, sys.argv[2] if len(sys.argv) > 2 and sys.argv[2].endswith(".json") else "config.json")))
img = Image.open(os.path.join(pasta, cfg["imagem"])).convert("RGB")
k = img.width / cfg.get("ref_largura", img.width)

def hexc(h): h = h.lstrip("#"); return tuple(int(h[i:i+2], 16) / 255 for i in (0, 2, 4))
COR = hexc(cfg.get("cor", "#EE4D2D"))
def clamp(x, a=0.0, b=1.0): return max(a, min(b, x))
def ease_out_back(x):
    x = clamp(x); c = 1.9
    return 1 + (c + 1) * (x - 1) ** 3 + c * (x - 1) ** 2
def pop(t0, t, d=0.4): return max(0.001, ease_out_back((t - t0) / d)) if t >= t0 else 0.001
def smooth(a, b, t):
    x = clamp((t - a) / (b - a)); return x * x * (3 - 2 * x)

def pil_to_surface(im):
    im = im.convert("RGBA"); arr = np.array(im)
    bgra = arr[:, :, [2, 1, 0, 3]].copy()
    return cairo.ImageSurface.create_for_data(memoryview(bgra), cairo.FORMAT_ARGB32, im.width, im.height), bgra

# ------------------------------------------------ narração (voz de IA Kokoro, pt-BR)
VOZ = cfg.get("voz")
falas = []
if VOZ:
    from kokoro_onnx import Kokoro
    base = os.path.join(os.path.dirname(os.path.abspath(__file__)), "modelos")
    kk = Kokoro(os.path.join(base, "kokoro-v1.0.int8.onnx"), os.path.join(base, "voices-v1.0.bin"))
    for c in cfg["cenas"]:
        if c.get("fala"):
            a, sr = kk.create(c["fala"], voice=VOZ, speed=cfg.get("velocidade", 1.1), lang="pt-br")
            idx = np.linspace(0, len(a) - 1, int(len(a) * SR / sr))
            a = np.interp(idx, np.arange(len(a)), a)
            a = a / (np.abs(a).max() + 1e-9) * 0.9
            c["dur"] = max(c["dur"], len(a) / SR + 0.45)
            falas.append(a)
        else:
            falas.append(None)

# prepara recortes (em alta, com leve nitidez) e fundos desfocados
cenas, t = [], 0.0
for c in cfg["cenas"]:
    im_c = Image.open(os.path.join(pasta, c["imagem"])).convert("RGB") if c.get("imagem") else img
    box = tuple(int(v * k) for v in c["recorte"])
    cr = im_c.crop(box)
    esc = max(900 / cr.width, 1.0)
    cr = cr.resize((int(cr.width * esc), int(cr.height * esc)), Image.LANCZOS).filter(ImageFilter.UnsharpMask(2, 80, 2))
    bg = cr.resize((W // 8, int(W // 8 * cr.height / cr.width))).filter(ImageFilter.GaussianBlur(4))
    s, keep = pil_to_surface(cr); bs, keep2 = pil_to_surface(bg)
    cenas.append(dict(c, ini=t, surf=s, keep=keep, bg=bs, keep2=keep2, w=cr.width, h=cr.height))
    t += c["dur"]
TOTAL = t

def rrect(ctx, x, y, w, h, r):
    ctx.new_sub_path()
    ctx.arc(x + w - r, y + r, r, -math.pi / 2, 0); ctx.arc(x + w - r, y + h - r, r, 0, math.pi / 2)
    ctx.arc(x + r, y + h - r, r, math.pi / 2, math.pi); ctx.arc(x + r, y + r, r, math.pi, 1.5 * math.pi); ctx.close_path()

def texto(ctx, s, size, x, y, fill, outline=(0.05, 0.05, 0.1), ow=None, sc=1.0, maxw=840):
    ctx.save(); ctx.select_font_face(FONT, cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_BOLD); ctx.set_font_size(size)
    e = ctx.text_extents(s)
    if e.x_advance > maxw: size *= maxw / e.x_advance; ctx.set_font_size(size); e = ctx.text_extents(s)
    ctx.translate(x, y); ctx.scale(sc, sc)
    ctx.move_to(-e.x_advance / 2, size * 0.35); ctx.text_path(s)
    ctx.set_line_join(cairo.LINE_JOIN_ROUND)
    if outline: ctx.set_source_rgb(*outline); ctx.set_line_width(ow or size * 0.2); ctx.stroke_preserve()
    ctx.set_source_rgb(*fill); ctx.fill(); ctx.restore()

def quadro(t):
    surf = cairo.ImageSurface(cairo.FORMAT_RGB24, W, H); ctx = cairo.Context(surf)
    i = max(j for j, c in enumerate(cenas) if c["ini"] <= t + 1e-6)
    c = cenas[i]; lt = t - c["ini"]; p = lt / c["dur"]
    # fundo: a própria imagem desfocada e escurecida
    ctx.save(); sc = max(W / c["bg"].get_width(), H / c["bg"].get_height())
    ctx.scale(sc, sc); ctx.set_source_surface(c["bg"], 0, 0); ctx.get_source().set_filter(cairo.FILTER_BILINEAR); ctx.paint(); ctx.restore()
    ctx.set_source_rgba(0, 0, 0, 0.45); ctx.paint()
    # cartão com a foto (zoom lento + entrada)
    z = c["zoom"][0] + (c["zoom"][1] - c["zoom"][0]) * p
    ent = pop(c["ini"], t, 0.35)
    cw = 960; ch = min(840, cw * c["h"] / c["w"])
    cx, cy = W / 2, 1000
    ctx.save(); ctx.translate(cx, cy); ctx.scale(ent, ent)
    rrect(ctx, -cw / 2 - 10, -ch / 2 - 10, cw + 20, ch + 20, 44); ctx.set_source_rgb(1, 1, 1); ctx.fill()
    rrect(ctx, -cw / 2, -ch / 2, cw, ch, 36); ctx.clip()
    s = max(cw / c["w"], ch / c["h"]) * z
    ctx.scale(s, s); ctx.translate(-c["w"] / 2, -c["h"] / 2)
    ctx.set_source_surface(c["surf"], 0, 0); ctx.get_source().set_filter(cairo.FILTER_GOOD); ctx.paint()
    ctx.restore()
    # selo do topo
    ctx.save(); ctx.select_font_face(FONT, cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_BOLD); ctx.set_font_size(52)
    sw = ctx.text_extents(cfg["selo"]).x_advance
    rrect(ctx, W / 2 - sw / 2 - 34, 170, sw + 68, 96, 48); ctx.set_source_rgb(*COR); ctx.fill()
    ctx.restore(); texto(ctx, cfg["selo"], 52, W / 2, 218, (1, 1, 1), None)
    # título e subtítulo
    y_t = 380
    texto(ctx, c["titulo"], 120 if c.get("final") else 96, W / 2, y_t, (1, 0.86, 0.2) if c.get("final") else (1, 1, 1), sc=pop(c["ini"] + 0.1, t))
    texto(ctx, c["sub"], 66, W / 2, y_t + 110, (1, 1, 1), sc=pop(c["ini"] + 0.3, t))
    # etiqueta de preço
    tp = pop(0.6, t)
    ctx.save(); ctx.translate(W / 2, cy + ch / 2 + 110); ctx.rotate(-0.04 + math.sin(t * 3) * 0.02); ctx.scale(tp, tp)
    ctx.select_font_face(FONT, cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_BOLD); ctx.set_font_size(64)
    pw = ctx.text_extents(cfg["preco"]).x_advance
    rrect(ctx, -pw / 2 - 40, -60, pw + 80, 120, 30); ctx.set_source_rgb(1, 0.86, 0.2); ctx.fill_preserve()
    ctx.set_source_rgb(0.05, 0.05, 0.1); ctx.set_line_width(6); ctx.stroke(); ctx.restore()
    texto(ctx, cfg["preco"], 64, W / 2, cy + ch / 2 + 108, (0.05, 0.05, 0.1), None, sc=tp)
    # seta pulsando no final
    if c.get("final"):
        b = math.sin(t * 9) * 18
        for dx in (-440, 440):
            ctx.save(); ctx.translate(W / 2 + dx, y_t + b)
            ctx.scale(-1 if dx > 0 else 1, 1)
            ctx.move_to(-30, -40); ctx.line_to(30, 0); ctx.line_to(-30, 40); ctx.close_path()
            ctx.set_source_rgb(1, 0.86, 0.2); ctx.fill(); ctx.restore()
    # barra de progresso
    ctx.rectangle(0, H - 14, W * t / TOTAL, 14); ctx.set_source_rgb(*COR); ctx.fill()
    return surf

# ------------------------------------------------ áudio: batida alegre + "pops"
def audio(path):
    n = int(TOTAL * SR); out = np.zeros(n); rng = np.random.default_rng(1)
    beat = 60 / 120
    def add(x, t0, g):
        i = int(t0 * SR); x = x[: max(0, n - i)]; out[i:i + len(x)] += x * g
    tt = lambda d: np.arange(int(d * SR)) / SR
    kick = np.sin(2 * np.pi * np.cumsum(60 + 120 * np.exp(-tt(0.3) * 30)) / SR) * np.exp(-tt(0.3) * 9)
    hat = rng.uniform(-1, 1, int(0.04 * SR)) * np.exp(-tt(0.04) * 120)
    chords = [[60, 64, 67], [57, 60, 64], [53, 57, 60], [55, 59, 62]]
    for b in range(int(TOTAL / beat) + 1):
        t0 = b * beat
        add(kick, t0, 0.55); add(hat, t0 + beat / 2, 0.12)
        ch = chords[(b // 4) % 4]
        if b % 2 == 0:
            for m in ch:
                f = 440 * 2 ** ((m + 12 - 69) / 12); x = tt(beat * 1.8)
                add(np.sin(2 * np.pi * f * x) * np.exp(-x * 2.5) * 0.6 + np.sin(4 * np.pi * f * x) * np.exp(-x * 5) * 0.2, t0, 0.13)
    for c in cenas:
        x = tt(0.12); f = 900 * np.exp(-x * 18) + 250
        add(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x * 25), c["ini"] + 0.1, 0.45)
    if VOZ:
        voz = np.zeros(n)
        for c, a in zip(cenas, falas):
            if a is not None:
                i = int((c["ini"] + 0.15) * SR); a = a[: max(0, n - i)]; voz[i:i + len(a)] += a
        env = np.convolve((np.abs(voz) > 0.02).astype(float), np.ones(SR // 5) / (SR // 5), "same")
        out = out * (1 - 0.6 * np.clip(env * 3, 0, 1)) + voz
    fl = int(0.8 * SR); out[-fl:] *= np.linspace(1, 0, fl)
    out = np.tanh(out * 1.05) * 0.9
    st = (np.stack([out, out], 1) * 32767).astype(np.int16)
    with wave.open(path, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(st.tobytes())

if __name__ == "__main__":
    if "preview" in sys.argv:
        for tv in map(float, sys.argv[sys.argv.index("preview") + 1:]): quadro(tv).write_to_png(os.path.join(pasta, f"preview_{tv:04.1f}.png"))
        sys.exit()
    wav = os.path.join(pasta, "_audio.wav"); audio(wav)
    out = os.path.join(pasta, cfg["saida"])
    p = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgra", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
                          "-i", wav, "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p",
                          "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", out], stdin=subprocess.PIPE)
    for fr in range(int(TOTAL * FPS)):
        s = quadro(fr / FPS); s.flush(); p.stdin.write(bytes(s.get_data()))
    p.stdin.close(); p.wait(); os.remove(wav)
    print("pronto:", out, f"{TOTAL:.1f}s")
