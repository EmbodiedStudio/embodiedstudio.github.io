"""Generate a seamless jute weave albedo and tangent-space normal tile."""

from pathlib import Path

import numpy as np
from PIL import Image


output = Path(__file__).resolve().parent.parent / 'site/media/study'
tile = 384
v, u = np.mgrid[:tile, :tile].astype(float) / tile
warps, wefts = 34, 24
turn = 2 * np.pi
rng = np.random.default_rng(21)

# Periodic phase shifts and per-yarn widths keep the cloth seamless without a uniform diagonal grid.
x = u * warps + .16 * np.sin(turn * (2 * u + 3 * v)) + .09 * np.cos(turn * (7 * u - 2 * v))
y = v * wefts + .12 * np.sin(turn * (3 * u - 2 * v)) + .10 * np.cos(turn * (5 * v + u))
warp_index = np.floor(x + .5).astype(int) % warps
weft_index = np.floor(y + .5).astype(int) % wefts
warp_width = rng.uniform(1.48, 2.65, warps)[warp_index]
weft_width = rng.uniform(1.48, 2.52, wefts)[weft_index]
warp = np.exp(-np.sin(np.pi * x) ** 2 * warp_width)
weft = np.exp(-np.sin(np.pi * y) ** 2 * weft_width)
warp *= rng.uniform(.87, 1.12, warps)[warp_index]
weft *= rng.uniform(.89, 1.09, wefts)[weft_index]
pattern = (warp_index + weft_index) % 2
crossing = np.where(pattern, np.maximum(warp * .54, weft), np.maximum(warp, weft * .64))
fibers = .031 * np.sin(u * np.pi * 204 + np.sin(v * np.pi * 42))
fibers += .023 * np.sin(v * np.pi * 192 + np.sin(u * np.pi * 64))
height = crossing + fibers
strand_tone = rng.uniform(-.047, .047, warps)[warp_index] * warp
strand_tone += rng.uniform(-.043, .043, wefts)[weft_index] * weft
blend = .81 + .15 * crossing + strand_tone + .019 * np.sin(turn * (3 * u + 7 * v)) + fibers
albedo = np.clip(blend[..., None] * [188, 166, 133], 0, 255).astype('uint8')
dx = (np.roll(height, -1, axis=1) - np.roll(height, 1, axis=1)) * .76
dy = (np.roll(height, -1, axis=0) - np.roll(height, 1, axis=0)) * .76
normal = np.stack((-dx, dy, np.ones_like(dx)), axis=-1)
normal /= np.linalg.norm(normal, axis=-1, keepdims=True)
Image.fromarray(albedo, 'RGB').save(output / 'study-jute-albedo.webp', quality=90, method=6)
Image.fromarray(np.clip(normal * 127.5 + 127.5, 0, 255).astype('uint8'), 'RGB').save(
    output / 'study-jute-normal.webp', quality=93, method=6
)
