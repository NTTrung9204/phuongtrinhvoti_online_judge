import json
import matplotlib.pyplot as plt

data_path = "test.user.json"

with open(data_path, 'r', encoding='utf-8') as file:
    data = json.load(file)

position_count = {}

for record in data:
    position = record.get('position')
    if position is not None:
        if position in position_count:
            position_count[position] += 1
        else:
            position_count[position] = 1

positions = list(position_count.keys())
counts = list(position_count.values())

plt.figure(figsize=(10, 8))
plt.pie(counts, labels=positions, autopct='%1.1f%%', colors=plt.cm.Paired(range(len(positions))))
plt.title('Phân bố số người dùng theo trình độ')
plt.show()
