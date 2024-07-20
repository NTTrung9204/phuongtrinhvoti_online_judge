import json
import matplotlib.pyplot as plt
from collections import defaultdict
import numpy as np

data_path = "test.assignment.json"

with open(data_path, 'r', encoding='utf-8') as file:
    data = json.load(file)

assignment_count_by_type = defaultdict(int)

for record in data:
    assignment_type = record.get('type')
    if assignment_type is not None:
        assignment_count_by_type[assignment_type] += 1

types = list(assignment_count_by_type.keys())
counts = list(assignment_count_by_type.values())

colors = [
    '#e41a1c', '#377eb8', '#4daf4a', '#ff7f00', '#6a3d9a', '#ff69b4',
    '#a6cee3', '#b2df8a', '#fb9a99', '#fdbf6f', '#cab2d6', '#ffb6c1',
    '#1f78b4', '#33a02c', '#f6c7b6', '#ff7f00', '#b2df8a', '#a6cee3',
    '#1f78b4', '#b2df8a', '#fb9a99', '#fdbf6f', '#ff69b4', '#cab2d6',
    '#ffb6c1', '#a6cee3', '#1f78b4', '#b2df8a', '#ff7f00', '#f6c7b6'
]

plt.figure(figsize=(12, 10))
plt.pie(counts, labels=types, autopct='%1.1f%%', colors=colors)
plt.title('Phân bố số lượng bài tập theo loại')
plt.show()
