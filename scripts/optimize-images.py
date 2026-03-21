#!/usr/bin/env python3
"""
scripts/optimize-images.py
public/bottles/ 内の画像を Web 用に最適化（リサイズ＋圧縮）する

使い方:
  python scripts/optimize-images.py

仕様:
  - 長辺を 600px に縮小（それ以下はそのまま）
  - JPEG: quality=82 で再保存
  - PNG: PNG のまま最適化（必要なら JPEG に変換）
  - 元ファイルは .bak として保持（確認後に削除可）
"""

import os
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Pillow が必要です: pip install Pillow")
    sys.exit(1)

BOTTLES_DIR = Path(__file__).parent.parent / "public" / "bottles"
MAX_SIZE    = 600    # 長辺の最大ピクセル数
JPEG_Q      = 82     # JPEG クオリティ
SIZE_WARN   = 200_000  # 200KB 超えたら警告


def optimize(path: Path):
    suffix = path.suffix.lower()
    if suffix not in (".jpg", ".jpeg", ".png", ".webp"):
        return

    original_size = path.stat().st_size
    img = Image.open(path)

    # RGBA → RGB（JPEG保存のため）
    if img.mode in ("RGBA", "P") and suffix in (".jpg", ".jpeg"):
        img = img.convert("RGB")

    # リサイズ（長辺を MAX_SIZE に）
    w, h = img.size
    if max(w, h) > MAX_SIZE:
        ratio = MAX_SIZE / max(w, h)
        new_size = (int(w * ratio), int(h * ratio))
        img = img.resize(new_size, Image.LANCZOS)
        resized = True
    else:
        resized = False

    # 保存（元ファイルを .bak にバックアップ）
    bak_path = path.with_suffix(path.suffix + ".bak")
    if not bak_path.exists():
        path.rename(bak_path)

    if suffix == ".png":
        img.save(path, "PNG", optimize=True)
    else:
        out_path = path.with_suffix(".jpg")
        img.convert("RGB").save(out_path, "JPEG", quality=JPEG_Q, optimize=True)
        if out_path != path:
            path = out_path  # PNG→JPEG に変換した場合

    new_size = path.stat().st_size
    ratio_str = f"{new_size / original_size * 100:.0f}%"
    resize_str = f" | リサイズ: {w}x{h}→{img.size[0]}x{img.size[1]}" if resized else ""
    warn = " ⚠️ まだ大きい" if new_size > SIZE_WARN else ""
    print(f"  ✅  {path.name:35s} {original_size//1024:>6}KB → {new_size//1024:>5}KB ({ratio_str}){resize_str}{warn}")


def main():
    if not BOTTLES_DIR.exists():
        print(f"ディレクトリが見つかりません: {BOTTLES_DIR}")
        sys.exit(1)

    targets = sorted([
        p for p in BOTTLES_DIR.iterdir()
        if p.suffix.lower() in (".jpg", ".jpeg", ".png", ".webp")
        and not p.name.endswith(".bak")
    ])

    if not targets:
        print("画像ファイルが見つかりません")
        return

    print(f"\n🖼   {len(targets)} 枚を最適化します（長辺 {MAX_SIZE}px, JPEG q={JPEG_Q}）\n")
    for p in targets:
        optimize(p)

    print(f"\n💾  バックアップは .bak ファイルとして保存されています")
    print(f"    問題なければ以下で削除できます:")
    print(f"    find public/bottles -name '*.bak' -delete\n")


if __name__ == "__main__":
    main()
