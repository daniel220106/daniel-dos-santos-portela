"""Renderiza o vídeo "Lulu, o Polvinho que Perdeu as Cores" (1080x1920, 30 fps) com pycairo."""
import json, math, os, random, subprocess, sys
from multiprocessing import Pool
import cairo

W, H, FPS = 1080, 1920, 30
TL = json.load(open("build/timeline.json"))
TOTAL = TL["total"]
F = {f["id"]: f for f in TL["falas"]}
def ini(i): return F[i]["ini"]
def end(i): return F[i]["ini"] + F[i]["dur"]

FONT = "Fredoka Light"  # família registrada pelo arquivo Fredoka-Bold.ttf

# ---------------------------------------------------------------- cores
def hexc(h): h = h.lstrip("#"); return tuple(int(h[i:i+2], 16) / 255 for i in (0, 2, 4))
GRAY = hexc("#AEB4BE")
YEL, RED, BLU, GRN, PNK = hexc("#FFD23F"), hexc("#FF4F4F"), hexc("#3D8BFF"), hexc("#3CC46A"), hexc("#FF6FC1")
def lerp(a, b, k): return a + (b - a) * k
def mix(c1, c2, k): return tuple(lerp(a, b, k) for a, b in zip(c1, c2))
def lighten(c, k): return mix(c, (1, 1, 1), k)
def darken(c, k): return mix(c, (0, 0, 0), k)
def clamp(x, a=0.0, b=1.0): return max(a, min(b, x))
def smooth(a, b, t):
    x = clamp((t - a) / (b - a)) if b != a else float(t >= a)
    return x * x * (3 - 2 * x)
def ease_out_back(x):
    x = clamp(x); c = 1.9
    return 1 + (c + 1) * (x - 1) ** 3 + c * (x - 1) ** 2
def pop(t0, t, d=0.45): return max(0.001, ease_out_back((t - t0) / d)) if t >= t0 else 0.001

# ordem dos tentáculos (esquerda -> direita) e suas cores verdadeiras
TCOL = [RED, YEL, GRN, BLU, RED, YEL, GRN, BLU]

# amigos: id da pergunta, id da resposta, cor, palavra, tentáculos que colorem, vaga final
AMIGOS = [
    dict(nome="peixe", q="q_peixe", r="r_peixe", cor=YEL, palavra="AMARELO!", tent=(1, 5), vaga=(190, 820, 0.85), lado=-1),
    dict(nome="carang", q="q_carang", r="r_carang", cor=RED, palavra="VERMELHO!", tent=(0, 4), vaga=(185, 1585, 0.8), lado=1),
    dict(nome="baleia", q="q_baleia", r="r_baleia", cor=BLU, palavra="AZUL!", tent=(3, 7), vaga=(880, 760, 0.6), lado=1),
    dict(nome="tarta", q="q_tarta", r="r_tarta", cor=GRN, palavra="VERDE!", tent=(2, 6), vaga=(890, 1600, 0.75), lado=-1),
]
T_ARCO = ini("cabeca") + F["cabeca"]["dur"] - 1.35   # momento em que fala "Arco-íris!"
T_ONDA = ini("onda") + 2.2                            # a onda passa
T_DRAIN = (T_ONDA + 0.5, T_ONDA + 2.0)

def tent_k(i, t):
    """quanto da cor verdadeira o tentáculo i tem (0 = cinza)."""
    if t < ini("intro") - 0.05: return 0.0
    if t < T_DRAIN[1]: return 1 - smooth(*T_DRAIN, t)
    for a in AMIGOS:
        if i in a["tent"]:
            r = ini(a["r"]); return smooth(r + 0.45, r + 1.2, t)
    return 0.0
def head_k(t):
    if t < ini("intro") - 0.05: return 0.0
    if t < T_DRAIN[1]: return 1 - smooth(*T_DRAIN, t)
    return smooth(T_ARCO + 0.15, T_ARCO + 0.8, t)

def humor(t):
    if t < ini("intro"): return "triste"
    if t < T_ONDA: return "feliz"
    if t < ini("q_peixe"): return "susto" if t < T_DRAIN[1] + 0.4 else "triste"
    if t < ini("r_peixe"): return "espera"
    if t < T_ARCO: return "feliz"
    return "muito"

# ---------------------------------------------------------------- helpers de desenho
def set_rgb(ctx, c, a=1.0): ctx.set_source_rgba(c[0], c[1], c[2], a)
def ellipse(ctx, x, y, rx, ry):
    ctx.save(); ctx.translate(x, y); ctx.scale(rx, ry); ctx.arc(0, 0, 1, 0, 2 * math.pi); ctx.restore()
def fill_stroke(ctx, fill, line=None, lw=5, a=1.0):
    set_rgb(ctx, fill, a); ctx.fill_preserve()
    set_rgb(ctx, line or darken(fill, 0.35), a); ctx.set_line_width(lw); ctx.stroke()
def rrect(ctx, x, y, w, h, r):
    ctx.new_sub_path()
    ctx.arc(x + w - r, y + r, r, -math.pi / 2, 0); ctx.arc(x + w - r, y + h - r, r, 0, math.pi / 2)
    ctx.arc(x + r, y + h - r, r, math.pi / 2, math.pi); ctx.arc(x + r, y + r, r, math.pi, 1.5 * math.pi)
    ctx.close_path()
def star(ctx, x, y, r, rot=0.0):
    ctx.new_path()
    for k in range(8):
        rr = r if k % 2 == 0 else r * 0.38
        a = rot + k * math.pi / 4
        (ctx.move_to if k == 0 else ctx.line_to)(x + rr * math.cos(a), y + rr * math.sin(a))
    ctx.close_path()
def eye(ctx, x, y, r, look=(0, 0), blink=1.0, s=1.0):
    ctx.save(); ctx.translate(x, y); ctx.scale(1, max(0.08, blink))
    ellipse(ctx, 0, 0, r, r * 1.12); fill_stroke(ctx, (1, 1, 1), (0.15, 0.12, 0.2), 3 * s)
    px, py = look[0] * r * 0.28, look[1] * r * 0.25
    ellipse(ctx, px, py + r * 0.08, r * 0.62, r * 0.7); set_rgb(ctx, (0.12, 0.1, 0.2)); ctx.fill()
    ellipse(ctx, px - r * 0.2, py - r * 0.18, r * 0.24, r * 0.26); set_rgb(ctx, (1, 1, 1)); ctx.fill()
    ellipse(ctx, px + r * 0.22, py + r * 0.3, r * 0.1, r * 0.1); ctx.fill()
    ctx.restore()
def smile(ctx, x, y, w, depth, lw=5):
    ctx.new_path(); ctx.move_to(x - w, y); ctx.curve_to(x - w * 0.5, y + depth, x + w * 0.5, y + depth, x + w, y)
    set_rgb(ctx, (0.25, 0.1, 0.15)); ctx.set_line_width(lw); ctx.set_line_cap(cairo.LINE_CAP_ROUND); ctx.stroke()

def text_path(ctx, s, size, x, y, align=0.5):
    ctx.select_font_face(FONT, cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_BOLD); ctx.set_font_size(size)
    e = ctx.text_extents(s); ctx.move_to(x - e.x_advance * align, y); ctx.text_path(s); return e
def big_text(ctx, s, size, x, y, fill, outline=(0.1, 0.08, 0.2), ow=None, scale=1.0, alpha=1.0, rot=0.0):
    if scale <= 0.01 or alpha <= 0.01: return
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(scale, scale)
    ctx.new_path(); text_path(ctx, s, size, 0, size * 0.35)
    ctx.set_line_join(cairo.LINE_JOIN_ROUND)
    set_rgb(ctx, outline, alpha); ctx.set_line_width(ow or size * 0.22); ctx.stroke_preserve()
    set_rgb(ctx, fill, alpha); ctx.fill(); ctx.restore()

# ---------------------------------------------------------------- cenário
rnd = random.Random(7)
BOLHAS = [(rnd.uniform(0, W), rnd.uniform(40, 120), rnd.uniform(0, 3000), rnd.uniform(6, 22), rnd.uniform(0, 6)) for _ in range(34)]
ALGAS = [(60, 1, 330), (130, -1, 260), (950, 1, 300), (1025, -1, 360), (870, 1, 210)]
CORAIS = [(80, 1760, PNK), (260, 1820, hexc("#FF9F43")), (820, 1800, hexc("#B57BFF")), (1000, 1770, hexc("#FF9F43"))]
CONFETE = [(rnd.uniform(0, W), rnd.uniform(0, 1), rnd.uniform(200, 420), rnd.choice([YEL, RED, BLU, GRN, PNK, (1, 1, 1)]), rnd.uniform(0, 6), rnd.uniform(-1, 1)) for _ in range(90)]

def cenario(ctx, t):
    g = cairo.LinearGradient(0, 0, 0, H)
    g.add_color_stop_rgb(0, *hexc("#5EDCFF")); g.add_color_stop_rgb(0.55, *hexc("#1E9BE0")); g.add_color_stop_rgb(1, *hexc("#0A5AA8"))
    ctx.set_source(g); ctx.paint()
    # raios de luz
    for k in range(6):
        x = 120 + k * 180 + math.sin(t * 0.4 + k) * 40
        a = 0.06 + 0.04 * math.sin(t * 0.9 + k * 1.7)
        ctx.new_path(); ctx.move_to(x - 40, -10); ctx.line_to(x + 60, -10); ctx.line_to(x + 260, H * 0.85); ctx.line_to(x + 60, H * 0.85); ctx.close_path()
        lg = cairo.LinearGradient(0, 0, 0, H * 0.85); lg.add_color_stop_rgba(0, 1, 1, 1, a); lg.add_color_stop_rgba(1, 1, 1, 1, 0)
        ctx.set_source(lg); ctx.fill()
    # algas
    for x0, d, h in ALGAS:
        for j in range(2):
            xb = x0 + j * 26 * d
            ctx.new_path(); ctx.move_to(xb, H)
            pts = []
            for s in range(1, 9):
                yy = H - 60 - h * s / 8 - j * 40
                xx = xb + math.sin(t * 1.5 + s * 0.6 + x0) * 18 * s / 8 * (1.6 - j * 0.4)
                pts.append((xx, yy))
            for xx, yy in pts: ctx.line_to(xx, yy)
            ctx.set_line_cap(cairo.LINE_CAP_ROUND); ctx.set_line_join(cairo.LINE_JOIN_ROUND)
            set_rgb(ctx, hexc("#1F8A4C") if j else hexc("#2DB563")); ctx.set_line_width(26 - j * 6); ctx.stroke()
    # areia
    ctx.new_path(); ctx.move_to(0, H)
    for x in range(0, W + 41, 40): ctx.line_to(x, 1700 + math.sin(x / 140) * 22)
    ctx.line_to(W, H); ctx.close_path()
    sg = cairo.LinearGradient(0, 1680, 0, H); sg.add_color_stop_rgb(0, *hexc("#FFE6A3")); sg.add_color_stop_rgb(1, *hexc("#F2C26B"))
    ctx.set_source(sg); ctx.fill()
    for x, y, c in CORAIS:
        for k, (dx, dy, r) in enumerate([(0, 0, 38), (-34, -40, 28), (30, -48, 30), (0, -84, 24), (-50, -10, 22)]):
            ellipse(ctx, x + dx, y + dy + math.sin(t * 2 + k) * 2, r, r); fill_stroke(ctx, c, darken(c, 0.2), 3)
    # bolhas
    for x0, sp, ph, r, w in BOLHAS:
        y = H + 50 - ((t * sp + ph) % (H + 150))
        x = x0 + math.sin(t * 1.3 + w) * 14
        ellipse(ctx, x, y, r, r); ctx.set_source_rgba(1, 1, 1, 0.22); ctx.fill_preserve()
        ctx.set_source_rgba(1, 1, 1, 0.6); ctx.set_line_width(2.5); ctx.stroke()
        ellipse(ctx, x - r * 0.35, y - r * 0.35, r * 0.25, r * 0.25); ctx.set_source_rgba(1, 1, 1, 0.85); ctx.fill()

# ---------------------------------------------------------------- Lulu
def lulu(ctx, t, alvo):
    hm = humor(t)
    dance = smooth(ini("viva") - 0.3, ini("viva"), t)
    cx = 540 + math.sin(t * 4) * 25 * dance
    cy = 1010 + math.sin(t * 2.1) * 14 - abs(math.sin(t * 5)) * 60 * dance
    if T_ONDA - 0.2 < t < T_DRAIN[1]:
        cx += math.sin(t * 40) * 10 * (1 - smooth(T_ONDA + 0.8, T_DRAIN[1], t))
    sq = 1 + math.sin(t * 10) * 0.03 * dance
    # tentáculos
    for i in (0, 7, 1, 6, 2, 5, 3, 4):
        col = mix(GRAY, TCOL[i], tent_k(i, t))
        off = i - 3.5
        x, y = cx + off * 40, cy + 120
        ang = off * 0.17
        curl = math.copysign(1, off) * (abs(off) / 3.5) * 1.3
        L, N = 330 - abs(off) * 14, 22
        pts = [(x, y)]
        for s in range(1, N + 1):
            u = s / N
            a = ang + math.sin(t * 2.6 + i * 0.9 - u * 3.2) * 0.42 * u + curl * u * u + math.sin(t * 9) * 0.25 * u * dance
            x += math.sin(a) * L / N; y += math.cos(a) * L / N
            pts.append((x, y))
        left, right = [], []
        for s, (px, py) in enumerate(pts):
            nx, ny = pts[min(s + 1, N)][0] - pts[max(s - 1, 0)][0], pts[min(s + 1, N)][1] - pts[max(s - 1, 0)][1]
            ln = math.hypot(nx, ny) or 1; nx, ny = -ny / ln, nx / ln
            wdt = lerp(34, 9, s / N)
            left.append((px + nx * wdt, py + ny * wdt)); right.append((px - nx * wdt, py - ny * wdt))
        ctx.new_path(); ctx.move_to(*left[0])
        for p in left[1:]: ctx.line_to(*p)
        tx, ty = pts[-1]; ctx.arc(tx, ty, 9, 0, 2 * math.pi) if False else None
        for p in reversed(right): ctx.line_to(*p)
        ctx.close_path(); ctx.set_line_join(cairo.LINE_JOIN_ROUND)
        fill_stroke(ctx, col, darken(col, 0.3), 5)
        for s in range(5, N - 2, 3):
            px, py = pts[s]; nx, ny = left[s][0] - px, left[s][1] - py
            r = lerp(12, 5, s / N)
            ellipse(ctx, px - nx * 0.45, py - ny * 0.45, r, r); set_rgb(ctx, lighten(col, 0.45)); ctx.fill()
    # cabeça
    hk = head_k(t); hc = mix(GRAY, PNK, hk)
    ctx.save(); ctx.translate(cx, cy); ctx.scale(sq, 2 - sq)
    ctx.new_path(); ctx.move_to(-215, 60)
    ctx.curve_to(-235, -150, -120, -250, 0, -250); ctx.curve_to(120, -250, 235, -150, 215, 60)
    ctx.curve_to(200, 150, -200, 150, -215, 60); ctx.close_path()
    rg = cairo.RadialGradient(-70, -120, 20, 0, -40, 290)
    rg.add_color_stop_rgb(0, *lighten(hc, 0.45)); rg.add_color_stop_rgb(0.6, *hc); rg.add_color_stop_rgb(1, *darken(hc, 0.18))
    ctx.set_source(rg); ctx.fill_preserve(); set_rgb(ctx, darken(hc, 0.32)); ctx.set_line_width(6); ctx.stroke()
    # bolinhas na cabeça (as cores dos amigos)
    for (sx, sy, r), c in zip([(-120, -150, 26), (110, -165, 22), (-30, -205, 18), (150, -70, 16), (-165, -60, 15)], [YEL, BLU, GRN, RED, YEL]):
        ellipse(ctx, sx, sy, r, r * 0.85); set_rgb(ctx, mix(lighten(GRAY, 0.25), c, hk), 0.9); ctx.fill()
    ellipse(ctx, -95, -185, 45, 24); ctx.set_source_rgba(1, 1, 1, 0.45); ctx.fill()
    # olhos
    blink = 1.0
    ph = (t + 0.7) % 3.6
    if ph < 0.14: blink = abs(ph - 0.07) / 0.07
    lx = clamp((alvo[0] - cx) / 400, -1, 1); ly = clamp((alvo[1] - cy) / 400, -1, 1)
    for sx in (-85, 85):
        eye(ctx, sx, -40, 58, (lx, ly), blink)
    if hm in ("triste",):
        for sx in (-85, 85):  # pálpebra caída + sobrancelha
            ctx.new_path(); ctx.move_to(sx - 62, -95); ctx.line_to(sx + 62, -95)
            ctx.line_to(sx + 62 * (1 if sx < 0 else -1) * -1 * -1, -95)
            d = 1 if sx < 0 else -1
            ctx.new_path(); ctx.move_to(sx - 64, -110); ctx.line_to(sx + 64, -110); ctx.line_to(sx + 64 * d, -70 + 0); ctx.line_to(sx - 64 * d, -50)
            ctx.close_path()
            ctx.new_path(); ctx.move_to(sx - 66, -112); ctx.line_to(sx + 66, -112)
            ctx.line_to(sx + 66, -78 if d > 0 else -58); ctx.line_to(sx - 66, -58 if d > 0 else -78); ctx.close_path()
            set_rgb(ctx, hc); ctx.fill()
            ctx.new_path(); ctx.move_to(sx - 50 * d, -135); ctx.line_to(sx + 40 * d, -118 + 0)
            ctx.move_to(sx + 45 * d * -1, -120)
            ctx.new_path(); ctx.move_to(sx - 45, -128 if d > 0 else -150); ctx.line_to(sx + 45, -150 if d > 0 else -128)
            set_rgb(ctx, darken(hc, 0.5)); ctx.set_line_width(9); ctx.set_line_cap(cairo.LINE_CAP_ROUND); ctx.stroke()
        # lágrimas
        for sx in (-120, 120):
            for k in range(3):
                p = ((t * 1.1 + k / 3 + (0.5 if sx > 0 else 0)) % 1)
                ty = 10 + p * 170; tx = sx + math.copysign(p * 30, sx)
                ctx.new_path(); ctx.move_to(tx, ty - 22); ctx.curve_to(tx + 14, ty - 2, tx + 12, ty + 12, tx, ty + 12)
                ctx.curve_to(tx - 12, ty + 12, tx - 14, ty - 2, tx, ty - 22)
                ctx.set_source_rgba(0.55, 0.85, 1, 0.9 * (1 - p)); ctx.fill()
    # bochechas
    for sx in (-150, 150):
        ellipse(ctx, sx, 35, 34, 20); ctx.set_source_rgba(1, 0.35, 0.5, 0.45); ctx.fill()
    # boca
    if hm == "triste":
        smile(ctx, 0, 85, 42, -30, 8)
    elif hm == "susto":
        ellipse(ctx, 0, 70, 26, 34); fill_stroke(ctx, hexc("#6B1B2E"), hexc("#3A0B18"), 4)
    elif hm == "espera":
        smile(ctx, 0, 55, 40, 22, 8)
    else:
        op = 1.0 if hm == "muito" else 0.65
        talk = 0.15 * abs(math.sin(t * 12)) if hm == "muito" else 0
        ctx.new_path(); ctx.move_to(-62, 45); ctx.curve_to(-20, 55, 20, 55, 62, 45)
        ctx.curve_to(50, 45 + 85 * (op + talk), -50, 45 + 85 * (op + talk), -62, 45); ctx.close_path()
        fill_stroke(ctx, hexc("#6B1B2E"), hexc("#3A0B18"), 4)
        ctx.save(); ctx.new_path(); ctx.move_to(-62, 45); ctx.curve_to(-20, 55, 20, 55, 62, 45)
        ctx.curve_to(50, 45 + 85 * (op + talk), -50, 45 + 85 * (op + talk), -62, 45); ctx.close_path(); ctx.clip()
        ellipse(ctx, 0, 45 + 80 * (op + talk), 40, 28); set_rgb(ctx, hexc("#FF7A9A")); ctx.fill(); ctx.restore()
    ctx.restore()
    return cx, cy

# ---------------------------------------------------------------- amigos
def peixe(ctx, t, s):
    c = YEL
    ctx.save(); ctx.translate(-70, 0); ctx.rotate(math.sin(t * 11) * 0.3)
    ctx.new_path(); ctx.move_to(5, 0); ctx.curve_to(-30, -30, -60, -60, -70, -48); ctx.curve_to(-55, -10, -55, 10, -70, 48)
    ctx.curve_to(-60, 60, -30, 30, 5, 0); fill_stroke(ctx, hexc("#FFB020"), None, 4); ctx.restore()
    ctx.new_path(); ctx.move_to(-20, -50); ctx.curve_to(0, -95, 40, -85, 45, -45); fill_stroke(ctx, hexc("#FFB020"), None, 4)
    ellipse(ctx, 0, 0, 92, 62); set_rgb(ctx, c); ctx.fill()
    ctx.save(); ellipse(ctx, 0, 0, 92, 62); ctx.clip()
    for x in (-35, -5):
        ctx.new_path(); ctx.move_to(x, -65); ctx.curve_to(x + 12, -20, x + 12, 20, x, 65); set_rgb(ctx, hexc("#FFB020")); ctx.set_line_width(9); ctx.stroke()
    ctx.restore(); ellipse(ctx, 0, 0, 92, 62); set_rgb(ctx, darken(c, 0.35)); ctx.set_line_width(5); ctx.stroke()
    eye(ctx, 42, -12, 20, (1, 0))
    ellipse(ctx, 60, 22, 12, 7); ctx.set_source_rgba(1, 0.4, 0.5, 0.5); ctx.fill()
    smile(ctx, 74, 14, 14, 10, 4)

def carang(ctx, t, s):
    c = RED
    for d in (-1, 1):
        for k in range(3):
            a = math.sin(t * 9 + k * 1.3 + d) * 10
            ctx.new_path(); ctx.move_to(d * (40 + k * 18), 25); ctx.line_to(d * (95 + k * 15), 55 + a); ctx.line_to(d * (105 + k * 15), 85)
            set_rgb(ctx, darken(c, 0.2)); ctx.set_line_width(11); ctx.set_line_cap(cairo.LINE_CAP_ROUND); ctx.set_line_join(cairo.LINE_JOIN_ROUND); ctx.stroke()
        ctx.new_path(); ctx.move_to(d * 70, -20); ctx.line_to(d * 115, -75); set_rgb(ctx, darken(c, 0.2)); ctx.set_line_width(14); ctx.stroke()
        snap = 0.35 + 0.3 * abs(math.sin(t * 5 + d))
        ctx.save(); ctx.translate(d * 125, -100); ctx.rotate(-math.pi / 2 + d * 0.5)
        ctx.new_path(); ctx.move_to(0, 0); ctx.arc(0, 0, 38, snap, 2 * math.pi - snap); ctx.close_path(); fill_stroke(ctx, c, None, 4); ctx.restore()
        ctx.new_path(); ctx.move_to(d * 25, -45); ctx.line_to(d * 32, -95); set_rgb(ctx, darken(c, 0.2)); ctx.set_line_width(9); ctx.stroke()
    ellipse(ctx, 0, 0, 100, 62); fill_stroke(ctx, c, None, 5)
    ellipse(ctx, -30, -25, 30, 12); ctx.set_source_rgba(1, 1, 1, 0.35); ctx.fill()
    for d in (-1, 1): eye(ctx, d * 32, -108, 19, (0, 0.3))
    smile(ctx, 0, 15, 26, 18, 5)

def baleia(ctx, t, s):
    c = BLU
    ctx.save(); ctx.translate(-170, -10); ctx.rotate(math.sin(t * 4) * 0.2)
    ctx.new_path(); ctx.move_to(30, 10); ctx.curve_to(-20, 0, -40, -20, -60, -70); ctx.curve_to(-30, -60, -10, -40, 0, -20)
    ctx.curve_to(-10, -40, -50, -40, -100, -20); ctx.curve_to(-60, 10, -10, 30, 30, 30); ctx.close_path()
    fill_stroke(ctx, darken(c, 0.05), None, 5); ctx.restore()
    ctx.new_path(); ctx.move_to(-190, 10); ctx.curve_to(-180, -120, 0, -150, 120, -110)
    ctx.curve_to(220, -75, 230, 40, 190, 80); ctx.curve_to(120, 140, -120, 120, -190, 10); ctx.close_path()
    ctx.save(); fill_stroke(ctx, c, None, 6)
    ctx.restore()
    ctx.new_path(); ctx.move_to(-150, 50); ctx.curve_to(-60, 120, 120, 125, 195, 60); ctx.curve_to(120, 80, -60, 80, -150, 50)
    set_rgb(ctx, lighten(c, 0.55)); ctx.fill()
    ctx.new_path(); ctx.move_to(-10, 60); ctx.curve_to(10, 120, 60, 130, 50, 80); fill_stroke(ctx, darken(c, 0.1), None, 4)
    ellipse(ctx, -40, -80, 60, 18); ctx.set_source_rgba(1, 1, 1, 0.3); ctx.fill()
    eye(ctx, 110, -20, 22, (0.6, 0))
    ellipse(ctx, 135, 25, 16, 9); ctx.set_source_rgba(1, 0.45, 0.6, 0.5); ctx.fill()
    smile(ctx, 170, 30, 30, 16, 5)
    for k in range(5):
        p = (t * 1.4 + k / 5) % 1
        a = -math.pi / 2 + (k - 2) * 0.35
        x, y = 60 + math.cos(a) * 140 * p, -130 + math.sin(a) * 160 * p + 120 * p * p
        ellipse(ctx, x, y, 14 * (1 - p * 0.5), 18 * (1 - p * 0.5)); ctx.set_source_rgba(0.75, 0.93, 1, 1 - p); ctx.fill()

def tarta(ctx, t, s):
    c = GRN; sk = hexc("#9BE07A")
    for dx, d in ((-75, -1), (75, 1)):
        ctx.save(); ctx.translate(dx, 40); ctx.rotate(d * (0.5 + math.sin(t * 6 + d) * 0.35))
        ellipse(ctx, d * 35, 0, 45, 20); fill_stroke(ctx, sk, None, 4); ctx.restore()
    ctx.save(); ctx.translate(130, -5 + math.sin(t * 3) * 6)
    ellipse(ctx, 0, 0, 50, 44); fill_stroke(ctx, sk, None, 4)
    eye(ctx, 12, -10, 17, (0.7, 0)); smile(ctx, 22, 16, 16, 10, 4)
    ellipse(ctx, 32, 6, 10, 6); ctx.set_source_rgba(1, 0.4, 0.5, 0.5); ctx.fill()
    ctx.restore()
    ctx.new_path(); ctx.move_to(-130, 40); ctx.curve_to(-130, -110, 130, -110, 130, 40); ctx.close_path()
    fill_stroke(ctx, c, None, 6)
    for hx, hy in ((0, -25), (-62, 5), (62, 5), (-35, -65), (35, -65)):
        ctx.new_path()
        for k in range(6):
            a = k * math.pi / 3
            (ctx.move_to if k == 0 else ctx.line_to)(hx + 26 * math.cos(a), hy + 22 * math.sin(a))
        ctx.close_path(); set_rgb(ctx, lighten(c, 0.3)); ctx.fill()
    rrect(ctx, -140, 30, 280, 26, 13); fill_stroke(ctx, hexc("#E9D27A"), None, 4)

DESENHO = dict(peixe=peixe, carang=carang, baleia=baleia, tarta=tarta)
PALCO = (540, 610)

def pos_amigo(a, t):
    """posição, escala e direção do amigo no tempo t (ou None se ainda não entrou)."""
    q, r = ini(a["q"]), ini(a["r"])
    if t < q: return None
    side = a["lado"]
    vx, vy, vs = a["vaga"]
    if t < r + 0.25:
        k = ease_out_back(clamp((t - q) / 1.3))
        x = lerp(540 + side * -900, PALCO[0], k); y = PALCO[1] + math.sin(t * 2.5) * 18
        sc = 1.25; flip = -side * -1 if k < 1 else 1
        return x, y, sc, (1 if side < 0 else -1) if k < 0.98 else 1
    k = smooth(r + 0.25, r + 1.5, t)
    x = lerp(PALCO[0], vx, k); y = lerp(PALCO[1], vy, k) + math.sin(t * 2.5 + vx) * 12
    sc = lerp(1.25, vs, k)
    face = 1 if vx < 540 else -1
    if t > ini("viva"): y -= abs(math.sin(t * 5 + vx)) * 40
    return x, y, sc, face if k > 0.5 else 1

def amigos(ctx, t):
    for a in AMIGOS:
        p = pos_amigo(a, t)
        if not p: continue
        x, y, sc, face = p
        ctx.save(); ctx.translate(x, y); ctx.scale(sc * face, sc)
        ctx.set_line_join(cairo.LINE_JOIN_ROUND); ctx.set_line_cap(cairo.LINE_CAP_ROUND)
        DESENHO[a["nome"]](ctx, t, sc); ctx.restore()
        # balão de pergunta
        q, r = ini(a["q"]), ini(a["r"])
        if end(a["q"]) - 0.6 < t < r:
            k = pop(end(a["q"]) - 0.6, t)
            bx, by = x + 215, y - 40 + math.sin(t * 6) * 10
            ctx.save(); ctx.translate(bx, by); ctx.scale(k, k)
            ellipse(ctx, 0, 0, 70, 70); fill_stroke(ctx, (1, 1, 1), (0.1, 0.08, 0.2), 6)
            ctx.new_path(); ctx.move_to(-40, 50); ctx.line_to(-70, 90); ctx.line_to(-10, 64); set_rgb(ctx, (1, 1, 1)); ctx.fill()
            big_text(ctx, "?", 110, 0, 0, a["cor"], (0.1, 0.08, 0.2), 14)
            ctx.restore()

def magia(ctx, t, lulu_xy):
    """estrelinhas voando do amigo para os tentáculos + palavra da cor."""
    cx, cy = lulu_xy
    for a in AMIGOS:
        r = ini(a["r"])
        if r - 0.1 < t < r + 2.2:
            for i in a["tent"]:
                tx, ty = cx + (i - 3.5) * 40 + (i - 3.5) * 25, cy + 280
                for k in range(7):
                    p = clamp((t - r - k * 0.06) / 0.8)
                    if 0 < p < 1:
                        x = lerp(PALCO[0], tx, p) + math.sin(p * 9 + k) * 40
                        y = lerp(PALCO[1], ty, p) - math.sin(p * math.pi) * 120
                        star(ctx, x, y, 22 * (1 - p * 0.4), t * 5 + k); set_rgb(ctx, lighten(a["cor"], 0.3)); ctx.fill_preserve()
                        set_rgb(ctx, (1, 1, 1)); ctx.set_line_width(3); ctx.stroke()
                # brilho no tentáculo
                g = clamp((t - r - 0.6) / 1.2)
                if 0 < g < 1:
                    for k in range(6):
                        a2 = k * 1.05 + t * 3
                        star(ctx, tx + math.cos(a2) * 90 * g, ty + math.sin(a2) * 90 * g, 16 * (1 - g), t * 4)
                        ctx.set_source_rgba(1, 1, 1, 1 - g); ctx.fill()
        # palavra da cor
        if r - 0.05 < t < end(a["r"]) + 0.6:
            k = pop(r - 0.05, t, 0.5)
            fade = 1 - smooth(end(a["r"]) + 0.2, end(a["r"]) + 0.6, t)
            wob = math.sin(t * 7) * 0.04
            big_text(ctx, a["palavra"], 150, 540, 600, a["cor"], (0.1, 0.08, 0.2), 30, k * (1 + wob), fade, wob)

ARCO = [RED, hexc("#FF9F43"), YEL, GRN, BLU, hexc("#8E5CFF")]
def arco_iris(ctx, t, lulu_xy):
    cx, cy = lulu_xy
    if T_ARCO - 0.1 < t < T_ARCO + 2.2:
        g = clamp((t - T_ARCO) / 1.6)
        for k, c in enumerate(ARCO):
            ctx.new_path(); ctx.arc(cx, cy - 60, 120 + g * 700 + k * 26, 0, 2 * math.pi)
            set_rgb(ctx, c, 0.85 * (1 - g)); ctx.set_line_width(26); ctx.stroke()
        for k in range(24):
            a = k * 2 * math.pi / 24
            star(ctx, cx + math.cos(a) * (100 + g * 600), cy - 60 + math.sin(a) * (100 + g * 600), 26 * (1 - g * 0.6), t * 3)
            set_rgb(ctx, ARCO[k % 6], 1 - g); ctx.fill()
    # palavra ARCO-ÍRIS em letras coloridas
    if T_ARCO - 0.1 < t < ini("viva") + 0.4:
        k = pop(T_ARCO - 0.1, t, 0.5); fade = 1 - smooth(ini("viva"), ini("viva") + 0.4, t)
        palavra = "ARCO-ÍRIS!"
        ctx.select_font_face(FONT, cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_BOLD); ctx.set_font_size(140)
        wt = ctx.text_extents(palavra).x_advance; x = 540 - wt / 2 * k
        for j, ch in enumerate(palavra):
            ctx.set_font_size(140); adv = ctx.text_extents(ch).x_advance
            yy = 600 + math.sin(t * 8 + j * 0.7) * 16
            big_text(ctx, ch, 140, x + adv * k / 2, yy, ARCO[j % 6], (0.1, 0.08, 0.2), 28, k, fade)
            x += adv * k

def confete(ctx, t):
    t0 = ini("viva") - 0.2
    if t < t0: return
    for x0, ph, sp, c, rot, sw in CONFETE:
        y = -40 + ((t - t0) * sp + ph * 300) % (H + 80) if t - t0 > ph * 0.8 else -100
        x = x0 + math.sin(t * 2 + rot) * 40
        ctx.save(); ctx.translate(x, y); ctx.rotate(rot + t * 4 * sw); ctx.scale(1, abs(math.sin(t * 6 + rot)) + 0.2)
        ctx.rectangle(-10, -6, 20, 12); set_rgb(ctx, c); ctx.fill(); ctx.restore()

def cores_favoritas(ctx, t):
    t0 = ini("fim")
    if t < t0: return
    cols = [RED, YEL, GRN, BLU, PNK]
    for j, c in enumerate(cols):
        k = pop(t0 + 0.2 + j * 0.22, t, 0.5)
        x = 140 + j * 200; y = 610 - abs(math.sin(t * 4 + j * 0.9)) * 30
        if k <= 0: continue
        ctx.save(); ctx.translate(x, y); ctx.scale(k, k)
        ellipse(ctx, 0, 0, 78, 78); fill_stroke(ctx, c, (0.1, 0.08, 0.2), 8)
        ellipse(ctx, -24, -28, 24, 16); ctx.set_source_rgba(1, 1, 1, 0.6); ctx.fill()
        ctx.restore()

# ---------------------------------------------------------------- onda gigante
def onda(ctx, t):
    if not (T_ONDA - 0.3 < t < T_ONDA + 1.8): return
    p = (t - (T_ONDA - 0.3)) / 2.1
    front = W + 200 - p * (W + 1400)
    for band, (c, a) in enumerate([((0.85, 0.97, 1), 0.75), ((0.6, 0.88, 1), 0.6), ((1, 1, 1), 0.9)]):
        ctx.new_path()
        x0 = front + band * 120
        ctx.move_to(x0 + 700, -50)
        for y in range(-50, H + 60, 40):
            ctx.line_to(x0 + math.sin(y / 160 + t * 6 + band) * 90 + (band == 2) * 0, y)
        ctx.line_to(x0 + 700, H + 50); ctx.close_path()
        if band == 2:
            ctx.new_path()
            for y in range(-50, H + 60, 70):
                xx = x0 + math.sin(y / 160 + t * 6 + band) * 90
                ellipse(ctx, xx, y, 40, 40)
            set_rgb(ctx, c, a); ctx.fill()
        else:
            set_rgb(ctx, c, a); ctx.fill()

# ---------------------------------------------------------------- textos fixos e legendas
def topo(ctx, t):
    k = pop(0.0, t + 0.45)
    ctx.save(); ctx.translate(540, 170); ctx.scale(k, k)
    s = "AJUDE O LULU!"
    ctx.select_font_face(FONT, cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_BOLD); ctx.set_font_size(76)
    w = ctx.text_extents(s).x_advance
    rrect(ctx, -w / 2 - 40, -62, w + 80, 124, 36); set_rgb(ctx, (1, 1, 1)); ctx.fill_preserve()
    set_rgb(ctx, (0.1, 0.08, 0.2)); ctx.set_line_width(6); ctx.stroke()
    ctx.move_to(-w / 2, 27); ctx.show_text(s) if False else None
    ctx.new_path(); text_path(ctx, s, 76, 0, 27); set_rgb(ctx, (0.1, 0.08, 0.2)); ctx.fill()
    ctx.restore()

def wrap(ctx, words, size, maxw):
    ctx.select_font_face(FONT, cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_BOLD); ctx.set_font_size(size)
    lines, cur = [], []
    for w in words:
        test = " ".join(cur + [w])
        if cur and ctx.text_extents(test).x_advance > maxw: lines.append(cur); cur = [w]
        else: cur.append(w)
    lines.append(cur); return lines

def legenda(ctx, t):
    falas = TL["falas"]
    for j, f in enumerate(falas):
        nxt = falas[j + 1]["ini"] if j + 1 < len(falas) else TOTAL
        if not (f["ini"] - 0.1 <= t < nxt - 0.05): continue
        words = f["texto"].split()
        n = len(words); size = 72
        lines = wrap(ctx, words, size, 940)
        k = pop(f["ini"] - 0.1, t, 0.35)
        cur = clamp((t - f["ini"]) / max(f["dur"], 0.1)) * n
        idx = 0; y0 = 330
        ctx.save(); ctx.translate(540, y0); ctx.scale(k, k); ctx.translate(-540, -y0)
        for li, line in enumerate(lines):
            ctx.set_font_size(size)
            sp = size * 0.3
            ws = [ctx.text_extents(w).x_advance for w in line]
            x = 540 - (sum(ws) + sp * (len(line) - 1)) / 2
            y = y0 + li * 90
            for w, wd in zip(line, ws):
                said = idx < cur
                now = int(cur) == idx and cur < n
                col = (1, 0.88, 0.2) if now else (1, 1, 1)
                ctx.new_path(); text_path(ctx, w, size, x, y + 22, 0)
                ctx.set_line_join(cairo.LINE_JOIN_ROUND); set_rgb(ctx, (0.08, 0.06, 0.18), 1 if said or now else 0.5)
                ctx.set_line_width(14); ctx.stroke_preserve(); set_rgb(ctx, col, 1 if said or now else 0.55); ctx.fill()
                x += wd + sp; idx += 1
        ctx.restore()

# ---------------------------------------------------------------- quadro
def quadro(t):
    surf = cairo.ImageSurface(cairo.FORMAT_RGB24, W, H)
    ctx = cairo.Context(surf); ctx.set_antialias(cairo.ANTIALIAS_GOOD)
    cenario(ctx, t)
    alvo = (540, 1500)
    for a in AMIGOS:
        p = pos_amigo(a, t)
        if p and ini(a["q"]) <= t < ini(a["r"]) + 1.2: alvo = p[:2]
    if t >= ini("fim"): alvo = (540, 600)
    xy = lulu(ctx, t, alvo)
    amigos(ctx, t)
    magia(ctx, t, xy)
    arco_iris(ctx, t, xy)
    cores_favoritas(ctx, t)
    confete(ctx, t)
    onda(ctx, t)
    # flash de transição para a "lembrança"
    fl = 1 - smooth(ini("intro") - 0.1, ini("intro") + 0.35, t) if t > ini("intro") - 0.25 else smooth(ini("intro") - 0.25, ini("intro") - 0.1, t)
    if fl > 0: ctx.set_source_rgba(1, 1, 1, fl); ctx.paint()
    topo(ctx, t)
    legenda(ctx, t)
    return surf

def render_chunk(args):
    idx, f0, f1 = args
    out = f"build/parte_{idx:02d}.mp4"
    p = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgra", "-s", f"{W}x{H}", "-r", str(FPS),
                          "-i", "-", "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", out], stdin=subprocess.PIPE)
    for fr in range(f0, f1):
        s = quadro(fr / FPS); s.flush(); p.stdin.write(bytes(s.get_data()))
    p.stdin.close(); p.wait(); return out

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "preview":
        for t in map(float, sys.argv[2:]):
            quadro(t).write_to_png(f"build/preview_{t:05.1f}.png")
        sys.exit()
    n = int(TOTAL * FPS); P = os.cpu_count() or 4; step = math.ceil(n / P)
    parts = Pool(P).map(render_chunk, [(i, i * step, min(n, (i + 1) * step)) for i in range(P)])
    with open("build/partes.txt", "w") as fh:
        for pth in parts: fh.write(f"file '{os.path.basename(pth)}'\n")
    print("ok", n, "quadros")
