import re

with open('frontend/src/pages/MyLinks.jsx', 'r') as f:
    content = f.read()

# Remove states
states_to_remove = [
    "  const [clickLogModalLink, setClickLogModalLink] = useState(null);",
    "  const [clickLogs, setClickLogs] = useState([]);",
    "  const [isClickLogLoading, setIsClickLogLoading] = useState(false);",
    "  const [expandedLogId, setExpandedLogId] = useState(null);",
    "  const [deleteLogModalId, setDeleteLogModalId] = useState(null);",
    "  const [isClearAllLogsModalOpen, setIsClearAllLogsModalOpen] = useState(false);",
    "  const [isDeletingLog, setIsDeletingLog] = useState(false);"
]
for state in states_to_remove:
    content = content.replace(state + "\n", "")

# Remove functions: fetchClickLogs, handleDeleteLog, handleClearAllLogs, downloadLogsCSV
# It's easier to use a regex to find these blocks and remove them
content = re.sub(r'  const fetchClickLogs = async \(linkId\) => \{.*?\};\n', '', content, flags=re.DOTALL)
content = re.sub(r'  const handleDeleteLog = async \(logId\) => \{.*?\};\n', '', content, flags=re.DOTALL)
content = re.sub(r'  const handleClearAllLogs = async \(\) => \{.*?\};\n', '', content, flags=re.DOTALL)
content = re.sub(r'  const downloadLogsCSV = \(\) => \{.*?\};\n', '', content, flags=re.DOTALL)

# Replace the onClick for "Click Logs" button
content = content.replace("onClick={() => setClickLogModalLink(link)}", "onClick={() => navigate(`/logs/${link.id}`)}")

# Remove the Modals from the JSX return
# Remove the MotionAlert for Clear All Logs
content = re.sub(r'      \{\/\* Clear All Logs Confirmation \*\/\}.*?icon=\{<span className="material-symbols-outlined text-\[32px\]">delete_sweep</span>\}.*?/>', '', content, flags=re.DOTALL)

# Remove the Click Log Modal
content = re.sub(r'      \{\/\* Click Log Modal \*\/\}\n      <MotionModal.*?title="Click Logs".*?</MotionModal>', '', content, flags=re.DOTALL)

with open('frontend/src/pages/MyLinks.jsx', 'w') as f:
    f.write(content)
