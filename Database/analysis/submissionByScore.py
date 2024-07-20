import json
import matplotlib.pyplot as plt
from collections import Counter

file_path = 'test.submission.json' 

with open(file_path, 'r', encoding='utf-8') as file:
    json_data = json.load(file)

scores = [entry['score'] for entry in json_data]

score_counts = Counter(scores)

print(score_counts)

scores = list(score_counts.keys())
counts = list(score_counts.values())

plt.figure(figsize=(10, 5))
plt.bar(scores, counts, width=25)

plt.xlabel('Điểm số')
plt.ylabel('Số lượng lời giải')
plt.title('Thống kê số lượng lời giải theo điểm số')

plt.xticks(rotation=45, fontstyle='italic')

plt.show()
