import os, sys
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
print(f'base_dir: "{BASE_DIR}"')
sys.path.append(os.path.join(BASE_DIR, 'pkg'))