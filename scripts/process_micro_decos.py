import os
import shutil
from PIL import Image
from collections import deque

def make_white_transparent_and_copy(src_path, dest_path):
    print(f"Processing {src_path} -> {dest_path}...")
    im = Image.open(src_path)
    im = im.convert("RGBA")
    width, height = im.size
    
    visited = set()
    queue = deque()
    
    # Start BFS from border pixels
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
        
        # Check if the pixel is white or close to it
        if r > 250 and g > 250 and b > 250:
            bg_pixels.add((cx, cy))
            
            for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                nx, ny = cx + dx, cy + dy
                if 0 <= nx < width and 0 <= ny < height:
                    if (nx, ny) not in visited:
                        visited.add((nx, ny))
                        queue.append((nx, ny))
                        
    # Update image pixels
    for x, y in bg_pixels:
        pixels[x, y] = (0, 0, 0, 0)
        
    im.save(dest_path, "PNG")
    print(f"Saved transparent image to {dest_path} with {len(bg_pixels)} transparent pixels.")

if __name__ == "__main__":
    src_dir = r"C:\Users\Pierre\.gemini\antigravity-ide\brain\92cc8e23-5853-4bf2-a142-0af2e1d50fe2"
    dest_dir = r"c:\Users\Pierre\Desktop\Mi To Do List\artifacts\mi-todo\public"
    
    mapping = {
        "kawaii_mini_star_1779464663572.png": "kawaii_mini_star.png",
        "kawaii_mini_rainbow_1779464680251.png": "kawaii_mini_rainbow.png",
        "kawaii_mini_flower_1779464698343.png": "kawaii_mini_flower.png",
        "kawaii_mini_butterfly_1779464717360.png": "kawaii_mini_butterfly.png"
    }
    
    for src_name, dest_name in mapping.items():
        src_path = os.path.join(src_dir, src_name)
        dest_path = os.path.join(dest_dir, dest_name)
        if os.path.exists(src_path):
            make_white_transparent_and_copy(src_path, dest_path)
        else:
            print(f"Error: {src_path} not found!")
