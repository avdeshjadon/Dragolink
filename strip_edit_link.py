import re

with open('frontend/src/pages/MyLinks.jsx', 'r') as f:
    content = f.read()

# 1. Replace the button click
content = re.sub(
    r'onClick=\{\(\) => openEditModal\(link\)\}',
    r"onClick={() => navigate(`/links/${link.id}/edit`)}",
    content
)

# 2. Remove states
states_to_remove = [
    r'  const \[editModalLink, setEditModalLink\] = useState\(null\);\n',
    r'  const \[editUrl, setEditUrl\] = useState\(\'\'\);\n',
    r'  const \[editTitle, setEditTitle\] = useState\(\'\'\);\n',
    r'  const \[editAlias, setEditAlias\] = useState\(\'\'\);\n',
    r'  const \[editRoutingRules, setEditRoutingRules\] = useState\(\[\]\);\n',
    r'  const \[editUtmSource, setEditUtmSource\] = useState\(\'\'\);\n',
    r'  const \[editUtmMedium, setEditUtmMedium\] = useState\(\'\'\);\n',
    r'  const \[editUtmCampaign, setEditUtmCampaign\] = useState\(\'\'\);\n',
    r'  const \[editUtmTerm, setEditUtmTerm\] = useState\(\'\'\);\n',
    r'  const \[editUtmContent, setEditUtmContent\] = useState\(\'\'\);\n',
    r'  const \[editTrackIp, setEditTrackIp\] = useState\(true\);\n',
    r'  const \[editTrackBrowser, setEditTrackBrowser\] = useState\(true\);\n',
    r'  const \[editTrackOs, setEditTrackOs\] = useState\(true\);\n',
    r'  const \[editTrackDevice, setEditTrackDevice\] = useState\(true\);\n',
    r'  const \[editTrackReferrer, setEditTrackReferrer\] = useState\(true\);\n',
    r'  const \[isEditingLink, setIsEditingLink\] = useState\(false\);\n',
]

for s in states_to_remove:
    content = re.sub(s, '', content)


# 3. Remove functions
functions_to_remove = [
    r'  const openEditModal = \(link\) => \{.*?\n  \};\n\n',
    r'  const addEditRoutingRule = \(\) => \{.*?\n  \};\n\n',
    r'  const removeEditRoutingRule = \(index\) => \{.*?\n  \};\n\n',
    r'  const updateEditRoutingRule = \(index, field, value\) => \{.*?\n  \};\n\n',
    r'  const handleEditSubmit = async \(\) => \{[\s\S]*?finally \{\n      setIsEditingLink\(false\);\n    \}\n  \};\n\n'
]

for f_regex in functions_to_remove:
    content = re.sub(f_regex, '', content, flags=re.DOTALL)


# 4. Remove Edit Modal
# Find the start of Edit Modal
modal_start = content.find('{/* Edit Modal */}')
if modal_start != -1:
    # We will just remove from modal_start to the next {/*
    # Wait, the modal ends just before </main>
    # The modal is inside <MotionModal ...> ... </MotionModal>
    # Let's use regex to remove it
    content = re.sub(
        r'\s*\{/\* Edit Modal \*/\}[\s\S]*?</MotionModal>\n',
        '\n',
        content
    )


with open('frontend/src/pages/MyLinks.jsx', 'w') as f:
    f.write(content)
