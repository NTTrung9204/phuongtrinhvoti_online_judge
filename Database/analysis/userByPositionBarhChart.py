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

plt.figure(figsize=(12, 8))
bars = plt.barh(positions, counts, color='b')
plt.xlabel('Số lượng người dùng')
plt.ylabel('Vị trí')
plt.title('Số lượng người dùng theo vị trí')

for bar in bars:
    width = bar.get_width()
    plt.text(width, bar.get_y() + bar.get_height()/2, f'{width}', 
             va='center', ha='left', fontsize=10, color='black')

plt.grid(True, axis='x', linestyle='--', alpha=0.7)
plt.show()
