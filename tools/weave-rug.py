"""Generate a seamless jute weave albedo and tangent-space normal tile."""

from pathlib import Path

import numpy as np
from PIL import Image


output = Path(__file__).resolve().parent.parent / 'site/media/study'
tile = 384
v, u = np.mgrid[:tile, :tile].astype(float) / tile
warps, wefts = 34, 24
x = u * warps + .034 * np.cos(v * np.pi * 8)
y = v * wefts + .021 * np.sin(u * np.pi * 10)
warp = np.exp(-np.sin(np.pi * x) ** 2 * 2.0)
weft = np.exp(-np.sin(np.pi * y) ** 2 * 1.9)
pattern = (np.floor(x + .5).astype(int) + np.floor(y + .5).astype(int)) % 2
crossing = np.where(pattern, np.maximum(warp * .62, weft), np.maximum(warp, weft * .62))
fibers = .031 * np.sin(u * np.pi * 204 + np.sin(v * np.pi * 42))
fibers += .023 * np.sin(v * np.pi * 192 + np.sin(u * np.pi * 64))
height = crossing + fibers
blend = 0.80 + .17 * crossing + .047 * np.sin(2 * np.pi * (9 * u + 7 * v)) + fibers
albedo = np.clip(blend[..., None] * [188, 166, 133], 0, 255).astype('uint8')
dx = (np.roll(height, -1, axis=1) - np.roll(height, 1, axis=1)) * .89
dy = (np.roll(height, -1, axis=0) - np.roll(height, 1, axis=0)) * .89
normal = np.stack((-dx, dy, np.ones_like(dx)), axis=-1)
normal /= np.linalg.norm(normal, axis=-1, keepdims=True)
Image.fromarray(albedo, 'RGB').save(output / 'study-jute-albedo.webp', quality=90, method=6)
Image.fromarray(np.clip(normal * 127.5 + 127.5, 0, 255).astype('uint8'), 'RGB').save(
    output / 'study-jute-normal.webp', quality=93, method=6
)
