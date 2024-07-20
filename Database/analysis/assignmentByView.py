import json
import matplotlib.pyplot as plt

data_path = "test.assignment.json"

with open(data_path, 'r', encoding='utf-8') as file:
    data = json.load(file)

assignment_views = []

for record in data:
    assignment_name = record.get('title')
    views = record.get('view')
    if assignment_name is not None and views is not None:
        assignment_views.append((assignment_name, views))

sorted_assignments = sorted(assignment_views, key=lambda x: x[1], reverse=True)

top_20_assignments = sorted_assignments[:20]

assignment_names = [assignment[0] for assignment in top_20_assignments]
views = [assignment[1] for assignment in top_20_assignments]

plt.figure(figsize=(12, 8))
bars = plt.bar(assignment_names, views, color='b')
plt.xlabel('Tên bài tập')
plt.ylabel('Số lượng xem')
plt.title('Top 20 bài tập có số lượng xem cao nhất')

for bar in bars:
    height = bar.get_height()
    plt.text(bar.get_x() + bar.get_width()/2, height, f'{height}', 
             va='bottom', ha='center', fontsize=10, color='black')

plt.xticks(rotation=45, ha='right')
plt.grid(True, axis='y', linestyle='--', alpha=0.7)
plt.tight_layout()
plt.show()
