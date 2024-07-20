import json
import matplotlib.pyplot as plt
from datetime import datetime
from collections import defaultdict

data_path = "test.user.json"

with open(data_path, 'r', encoding='utf-8') as file:
    data = json.load(file)

user_count_by_date = defaultdict(int)

for record in data:
    time_str = record.get('time')
    if time_str:
        time_obj = datetime.strptime(time_str, '%a %b %d %Y %H:%M:%S GMT%z (Coordinated Universal Time)')
        date_key = time_obj.strftime('%Y-%m-%d')
        user_count_by_date[date_key] += 1

sorted_dates = sorted(user_count_by_date.keys())
# cumulative_counts = []
# cumulative_sum = 0

# for date in sorted_dates:
#     cumulative_sum += user_count_by_date[date]
#     cumulative_counts.append(cumulative_sum)

dates = [datetime.strptime(date, '%Y-%m-%d') for date in sorted_dates]

plt.figure(figsize=(12, 6))
plt.plot(dates, list(user_count_by_date.values()), marker='o', linestyle='-', color='b')
plt.xlabel('Ngày')
plt.ylabel('Số người dùng')
plt.title('Số người dùng mới theo ngày')
plt.xticks(rotation=45)
plt.tight_layout()
plt.grid(True)
plt.show()
