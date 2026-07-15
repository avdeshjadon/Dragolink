import os, glob
files = glob.glob('backend/src/**/*.java', recursive=True) + glob.glob('frontend/src/**/*.jsx', recursive=True) + glob.glob('frontend/src/**/*.js', recursive=True)
for f in files:
    try:
        with open(f, 'r') as file:
            content = file.read()
        content = content.replace('LinkPulse', 'Dragolink').replace('linkpulse', 'dragolink').replace('LINKPULSE', 'DRAGOLINK')
        with open(f, 'w') as file:
            file.write(content)
    except Exception as e:
        print(f"Error processing {f}: {e}")
