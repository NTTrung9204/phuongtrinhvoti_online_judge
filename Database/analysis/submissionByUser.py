import json
from matplotlib import pyplot as plt

data_path = "test.submission.json"
user = {}
number_selection = 20

with open(data_path, 'r', encoding='utf-8') as file:
    json_data = json.load(file)

for submission in json_data:
    if submission['applicant'] not in user:
        user[submission['applicant']] = 1
    else:
        user[submission['applicant']] += 1

user = dict(sorted(user.items(), key=lambda x: x[1], reverse=True))

user = dict(list(user.items())[:number_selection])
print(user)


plt.xticks(rotation=45, fontstyle='italic')
plt.xlabel('Tên người dùng')
plt.ylabel('Số bài nộp')
plt.title('Thống kê số bài nộp của người dùng')
plt.bar(user.keys(), user.values())
plt.show()

