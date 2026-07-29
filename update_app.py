import re

with open('frontend/src/App.jsx', 'r') as f:
    content = f.read()

# Add import if not present
if "import EditLink from './pages/EditLink';" not in content:
    content = content.replace("import CreateLink from './pages/CreateLink';", "import CreateLink from './pages/CreateLink';\nimport EditLink from './pages/EditLink';")

# Add route
if '<Route path="/links/:id/edit" element={<EditLink />} />' not in content:
    content = content.replace('<Route path="/links" element={<MyLinks />} />', '<Route path="/links" element={<MyLinks />} />\n                <Route path="/links/:id/edit" element={<EditLink />} />')

with open('frontend/src/App.jsx', 'w') as f:
    f.write(content)
