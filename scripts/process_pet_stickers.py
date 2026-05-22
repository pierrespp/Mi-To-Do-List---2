import os
import shutil
from PIL import Image
from collections import deque

def make_white_transparent(img_path):
    print(f"Processing {img_path}...")
    im = Image.open(img_path)
    im = im.convert("RGBA")
    width, height = im.size
    
    visited = set()
    queue = deque()
    
    # Start BFS from all border pixels
    for x in range(width):
        queue.append((x, 0))
        queue.append((x, height - 1))
        visited.add((x, 0))
        visited.add((x, height - 1))
    for y in range(1, height - 1):
        queue.append((0, y))
        queue.append((width - 1, y))
        visited.add((0, y))
        visited.add((width - 1, y))
        
    bg_pixels = set()
    pixels = im.load()
    
    while queue:
        cx, cy = queue.popleft()
        r, g, b, a = pixels[cx, cy]
        
        # Check if the pixel is white or very close to it (e.g. background)
        if r > 240 and g > 240 and b > 240:
            bg_pixels.add((cx, cy))
            
            for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                nx, ny = cx + dx, cy + dy
                if 0 <= nx < width and 0 <= ny < height:
                    if (nx, ny) not in visited:
                        visited.add((nx, ny))
                        queue.append((nx, ny))
                        
    # Update image pixels to transparent
    for x, y in bg_pixels:
        pixels[x, y] = (0, 0, 0, 0)
        
    im.save(img_path, "PNG")
    print(f"Saved {img_path} with {len(bg_pixels)} transparent pixels.")

if __name__ == "__main__":
    brain_dir = r"C:\Users\Pierre\.gemini\antigravity-ide\brain\92cc8e23-5853-4bf2-a142-0af2e1d50fe2"
    public_dir = r"c:\Users\Pierre\Desktop\Mi To Do List\artifacts\mi-todo\public"
    
    mapping = {
        "kawaii_pet_mi_1779468298551.png": "kawaii_pet_mi.png",
        "kawaii_pet_kuro_1779468314581.png": "kawaii_pet_kuro.png"
    }
    
    for gen_name, target_name in mapping.items():
        src_path = os.path.join(brain_dir, gen_name)
        dest_path = os.path.join(public_dir, target_name)
        
        if os.path.exists(src_path):
            print(f"Copying {src_path} -> {dest_path}")
            shutil.copy(src_path, dest_path)
            make_white_transparent(dest_path)
        else:
            print(f"Warning: Source file {src_path} not found!")
