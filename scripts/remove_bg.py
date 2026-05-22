import os
from PIL import Image
from collections import deque

def remove_background(image_path, output_path):
    print(f"Processing {image_path}...")
    im = Image.open(image_path)
    im = im.convert("RGBA")
    width, height = im.size
    
    # Visited set for BFS
    visited = set()
    queue = deque()
    
    # Add all border pixels as starting points
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
    
    # Pre-load pixels for high-performance pixel access
    pixels = im.load()
    
    while queue:
        cx, cy = queue.popleft()
        r, g, b, a = pixels[cx, cy]
        
        # Check if this pixel is background (gray-ish and not white)
        diff = max(r, g, b) - min(r, g, b)
        if diff < 20 and max(r, g, b) < 245:
            bg_pixels.add((cx, cy))
            
            # Check 4 neighbors
            for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                nx, ny = cx + dx, cy + dy
                if 0 <= nx < width and 0 <= ny < height:
                    if (nx, ny) not in visited:
                        visited.add((nx, ny))
                        queue.append((nx, ny))
                        
    # Update image pixels
    for x, y in bg_pixels:
        pixels[x, y] = (0, 0, 0, 0)
        
    # Save the result
    im.save(output_path, "PNG")
    print(f"Saved {output_path} with {len(bg_pixels)} transparent pixels.")

if __name__ == "__main__":
    public_dir = r"c:\Users\Pierre\Desktop\Mi To Do List\artifacts\mi-todo\public"
    files = [
        "kawaii_cloud.png",
        "kawaii_heart.png",
        "kawaii_star.png",
        "mascote_cheer.png",
        "mascote_idle.png"
    ]
    for f in files:
        path = os.path.join(public_dir, f)
        if os.path.exists(path):
            # Overwrite the original file directly so the website gets the clean version!
            remove_background(path, path)
