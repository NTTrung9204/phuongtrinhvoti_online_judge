import json
import matplotlib.pyplot as plt
from collections import defaultdict

data_path = "test.assignment.json"

with open(data_path, 'r', encoding='utf-8') as file:
    data = json.load(file)

assignment_count_by_type = defaultdict(int)

for record in data:
    assignment_type = record.get('type')
    if assignment_type is not None:
        assignment_count_by_type[assignment_type] += 1

assignment_types = list(assignment_count_by_type.keys())
counts = list(assignment_count_by_type.values())

sorted_indices = sorted(range(len(assignment_types)), key=lambda i: assignment_types[i])
sorted_types = [assignment_types[i] for i in sorted_indices]
sorted_counts = [counts[i] for i in sorted_indices]

plt.figure(figsize=(12, 8))
bars = plt.bar(sorted_types, sorted_counts, color='b')
plt.xlabel('Dạng bài')
plt.ylabel('Số lượng bài tập')
plt.title('Số lượng bài tập theo dạng bài')

for bar in bars:
    height = bar.get_height()
    plt.text(bar.get_x() + bar.get_width()/2, height, f'{height}', 
             va='bottom', ha='center', fontsize=10, color='black')

plt.xticks(rotation=45, ha='right')
plt.grid(True, axis='y', linestyle='--', alpha=0.7)
plt.tight_layout()
plt.show()
