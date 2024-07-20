import json
import matplotlib.pyplot as plt
from collections import Counter

main_file_path = 'test.submission.json'
toplist_file_path = 'test.assignment.json'

with open(main_file_path, 'r', encoding='utf-8') as file:
    main_data = json.load(file)

with open(toplist_file_path, 'r', encoding='utf-8') as file:
    toplist_data = json.load(file)

key_to_nameType = {entry['_id']['$oid']: entry['type'] for entry in toplist_data}

print(key_to_nameType)

name_types = [key_to_nameType[entry['key']] for entry in main_data if entry['key'] in key_to_nameType]

print(name_types)

name_type_counts = Counter(name_types)

name_types = list(name_type_counts.keys())
counts = list(name_type_counts.values())

plt.figure(figsize=(10, 5))
plt.bar(name_types, counts)

plt.xlabel('Loại bài')
plt.ylabel('Số lượng')
plt.title('Thống kê số lượng mỗi loại bài được giải')

plt.xticks(rotation=45, fontstyle='italic')

plt.tight_layout()
plt.show()
