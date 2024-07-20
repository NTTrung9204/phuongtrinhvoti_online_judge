import json
import matplotlib.pyplot as plt

data_path = "test.user.json"

with open(data_path, 'r', encoding='utf-8') as file:
    data = json.load(file)

user_scores = []

for record in data:
    score = record.get('score')
    user_id = record.get('username')
    if score is not None and user_id is not None:
        user_scores.append((user_id, score))

sorted_user_scores = sorted(user_scores, key=lambda x: x[1], reverse=True)

top_20_users = sorted_user_scores[:20]

user_ids = [user[0] for user in top_20_users]
scores = [user[1] for user in top_20_users]

plt.figure(figsize=(12, 8))
bars = plt.barh(user_ids, scores, color='b')
plt.xlabel('Điểm số')
plt.ylabel('Tên người dùng')
plt.title('Top 20 người dùng có điểm số cao nhất')
plt.gca().invert_yaxis()

for bar in bars:
    width = bar.get_width()
    plt.text(width, bar.get_y() + bar.get_height()/2, f'{width}', 
             va='center', ha='left', fontsize=10, color='black')

plt.grid(True)
plt.show()
