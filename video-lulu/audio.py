"""Música original (gerada por código), efeitos sonoros e mixagem com a narração."""
import json, wave
import numpy as np

SR = 48000
TL = json.load(open("build/timeline.json"))
TOTAL = TL["total"]
F = {f["id"]: f for f in TL["falas"]}
N = int(TOTAL * SR) + SR
rng = np.random.default_rng(3)

def midi(n): return 440 * 2 ** ((n - 69) / 12)
def tvec(d): return np.arange(int(d * SR)) / SR
def add(buf, x, t0, g=1.0):
    i = int(t0 * SR)
    if i >= len(buf): return
    x = x[: len(buf) - i]; buf[i:i + len(x)] += x * g

def pluck(f, d=0.9):  # Karplus-Strong (som de ukulele)
    n = int(d * SR); p = max(2, int(SR / f))
    buf = rng.uniform(-1, 1, p); out = np.zeros(n)
    for i in range(n):
        out[i] = buf[i % p]
        buf[i % p] = 0.5 * (buf[i % p] + buf[(i + 1) % p]) * 0.996
    return out
def bell(f, d=1.2):
    t = tvec(d)
    return (np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t * 6)) * np.exp(-t * 4)
def bass(f, d=0.5):
    t = tvec(d); return (np.sin(2 * np.pi * f * t) + 0.25 * np.sin(4 * np.pi * f * t)) * np.exp(-t * 5) * np.minimum(1, t * 200)
def noise(d, smooth=1):
    x = rng.uniform(-1, 1, int(d * SR))
    if smooth > 1: x = np.convolve(x, np.ones(smooth) / smooth, "same")
    return x

# cache dos sons de ukulele
_cache = {}
def uke(n):
    if n not in _cache: _cache[n] = pluck(midi(n))
    return _cache[n]

# ------------------------------------------------ música (112 bpm, Dó maior: C G Am F)
music = np.zeros(N)
bpm = 112; beat = 60 / bpm; bar = 4 * beat
CH = [(48, [60, 64, 67, 72]), (43, [59, 62, 67, 71]), (45, [57, 60, 64, 69]), (41, [57, 60, 65, 69])]
MEL = [[72, 74, 76, 79], [74, 71, 74, 79], [72, 76, 81, 79], [77, 76, 74, 72]]
t_sad = [(0, F["intro"]["ini"]), (F["onda"]["ini"] + 2.6, F["q_peixe"]["ini"])]
def sad(t): return any(a <= t < b for a, b in t_sad)
b = 0
while b * bar < TOTAL:
    root, notes = CH[b % 4]; t0 = b * bar
    s = sad(t0)
    pattern = [0, 2, 1, 3, 2, 1, 3, 2]
    for k, idx in enumerate(pattern):
        add(music, uke(notes[idx]), t0 + k * beat / 2, 0.30 if not s else 0.18)
    add(music, bass(midi(root)), t0, 0.5); add(music, bass(midi(root)), t0 + 2 * beat, 0.4)
    if not s:
        for k in range(8):  # chocalho nos contratempos
            add(music, noise(0.03) * np.exp(-np.arange(int(0.03 * SR)) / 300), t0 + k * beat / 2 + beat / 4, 0.07)
        if b % 2 == 1:
            for k, n in enumerate(MEL[(b // 2) % 4]):
                add(music, bell(midi(n), 0.8), t0 + k * beat, 0.13)
    b += 1

# ------------------------------------------------ efeitos
sfx = np.zeros(N)
def chime(t0, g=0.35):
    for k, n in enumerate([84, 88, 91, 96]): add(sfx, bell(midi(n), 1.0), t0 + k * 0.07, g)
def pop_s(t0, g=0.5):
    t = tvec(0.12); f = 900 * np.exp(-t * 18) + 250
    add(sfx, np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 25), t0, g)
def whoosh(t0, d=0.7, g=0.25, sm=12):
    x = noise(d, sm); t = tvec(d); env = np.sin(np.pi * t / d) ** 2
    add(sfx, x * env, t0, g)
def wah(t0):
    for k, n in enumerate([55, 54, 53, 52]):
        d = 0.55 if k < 3 else 1.1; t = tvec(d)
        f = midi(n) * (1 + 0.012 * np.sin(2 * np.pi * 5 * t) * (k == 3))
        ph = 2 * np.pi * np.cumsum(f) / SR
        x = (np.sin(ph) + 0.5 * np.sin(2 * ph) + 0.3 * np.sin(3 * ph)) * np.minimum(1, t * 30) * np.exp(-t * 1.5)
        add(sfx, x, t0 + k * 0.45, 0.16)
def bubble(t0, g=0.2):
    t = tvec(0.08); f = 400 + 2500 * t / 0.08
    add(sfx, np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 40), t0, g)

T_ONDA = F["onda"]["ini"] + 2.2
T_ARCO = F["cabeca"]["ini"] + F["cabeca"]["dur"] - 1.35
whoosh(T_ONDA - 0.4, 2.2, 0.55, 30)
wah(F["triste"]["ini"] + 1.9)
chime(F["intro"]["ini"] - 0.1, 0.25)
for q, r in [("q_peixe", "r_peixe"), ("q_carang", "r_carang"), ("q_baleia", "r_baleia"), ("q_tarta", "r_tarta")]:
    whoosh(F[q]["ini"], 0.8, 0.22)
    pop_s(F[q]["ini"] + F[q]["dur"] - 0.6, 0.35)
    pop_s(F[r]["ini"], 0.5); chime(F[r]["ini"] + 0.4)
for k in range(10): add(sfx, bell(midi(72 + [0, 4, 7, 12, 16, 19, 24, 28, 31, 36][k]), 1.4), T_ARCO + k * 0.05, 0.22)
whoosh(T_ARCO, 1.5, 0.2, 3)
for k, n in enumerate([72, 76, 79, 84]): add(sfx, bell(midi(n), 1.6), F["viva"]["ini"] + k * 0.12, 0.3)
for k in range(5): pop_s(F["fim"]["ini"] + 0.2 + k * 0.22, 0.3)
for tt in rng.uniform(1, TOTAL - 1, 22): bubble(tt, 0.08)

# ------------------------------------------------ voz + ducking
voz = np.zeros(N)
for f in TL["falas"]:
    with wave.open(f"build/voz/{f['id']}.wav") as w:
        x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16) / 32768
    add(voz, x, f["ini"], 1.0)
env = np.convolve(np.abs(voz), np.ones(4800) / 4800, "same")
env = np.convolve((env > 0.01).astype(float), np.ones(9600) / 9600, "same")
mus_g = 0.55 - 0.33 * env
fade = np.ones(N); fl = int(1.2 * SR); end = int(TOTAL * SR)
fade[end - fl:end] = np.linspace(1, 0, fl); fade[end:] = 0
mixd = (music * mus_g + sfx * 0.9) * fade + voz * 1.0
mixd = mixd[:end]
mixd = np.tanh(mixd * 0.95) * 0.92
st = np.stack([mixd, mixd], 1)
with wave.open("build/audio.wav", "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((st * 32767).astype(np.int16).tobytes())
print("audio ok", round(len(mixd) / SR, 2), "s  pico", round(float(np.abs(mixd).max()), 3))
