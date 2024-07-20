import json
import matplotlib.pyplot as plt
from collections import Counter
from datetime import datetime

file_path = 'test.submission.json'

with open(file_path, 'r', encoding='utf-8') as file:
    json_data = json.load(file)

dates = [entry['time'] for entry in json_data]
dates = [datetime.strptime(date, '%d/%m/%Y').date() for date in dates]

date_counts = Counter(dates)
sorted_dates = sorted(date_counts.items())

days = [date[0] for date in sorted_dates]
counts = [date[1] for date in sorted_dates]

plt.figure(figsize=(10, 5))
plt.plot(days, counts, marker='o')

plt.xlabel('Ngày')
plt.ylabel('Số lượt nộp bài')
plt.title('Số lượt nộp bài theo thời gian')

plt.xticks(rotation=45, fontstyle='italic')

plt.tight_layout()
plt.show()
