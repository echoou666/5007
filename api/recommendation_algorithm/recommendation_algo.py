from flask import Flask, request, jsonify

from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # 允许所有的跨域请求
# 定义 recommend 函数，计算推荐结果
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import json


def recommend_questions(user_liked_questions, all_questions):
    user_liked_questions = json.loads(user_liked_questions)
    all_questions = json.loads(all_questions)

    # 编码用户喜欢的帖子标题和标签
    user_liked_questions_texts = [question['title'] + ' '.join(question['tags']) for question in user_liked_questions]
    print(user_liked_questions_texts)

    # 获取用户喜欢的帖子的ID
    liked_question_ids = set([question['_id'] for question in user_liked_questions])

    # 编码剩余帖子（不包括用户喜欢的帖子）的标题和标签
    all_questions_texts = [question['title'] + ' '.join(question['tags']) for question in all_questions if
                       question['_id'] not in liked_question_ids]
    print(all_questions_texts)

    # 使用 TF-IDF 向量化帖子的标题和标签
    vectorizer = TfidfVectorizer()
    user_liked_questions_matrix = vectorizer.fit_transform(user_liked_questions_texts)
    all_questions_matrix = vectorizer.transform(all_questions_texts)

    # 计算用户喜欢的帖子和剩余帖子之间的余弦相似度
    similarities = cosine_similarity(user_liked_questions_matrix, all_questions_matrix)

    # 获取与用户喜欢的帖子最相似的帖子
    recommended_questions = []
    seen_ids = set()  # 记录已经出现过的帖子id
    num_recommended = 0  # 记录已推荐的帖子数量
    for i in range(similarities.shape[0]):
        max_sim_indices = np.argsort(similarities[i])[::-1][:4]  # 获取前5个最相似的帖子索引
        print(max_sim_indices)
        for max_sim_index in max_sim_indices:
            recommended_question = all_questions[max_sim_index]
            if recommended_question['_id'] not in seen_ids:
                recommended_questions.append(recommended_question)
                seen_ids.add(recommended_question['_id'])
                num_recommended += 1
                if num_recommended == 4:  # 达到5条推荐结果后退出循环
                    break
        if num_recommended == 4:
            break

    return recommended_questions


# 定义推荐接口路由
@app.route('/recommend', methods=['POST'])
def recommend():
    # 获取前端传递的用户保存的帖子列表和全部帖子列表
    # print(request.json)
    user_liked_questions = request.json.get('user_liked_questions')
    all_questions = request.json.get('all_questions')
    # print(user_liked_questions)
    # print(all_questions)

    # 调用 recommend 函数，传递用户喜欢的帖子列表和全部帖子列表
    recommended_questions = recommend_questions(user_liked_questions, all_questions)

    # 返回推荐的帖子列表作为响应数据
    return jsonify({'success': True, 'data': recommended_questions})


if __name__ == '__main__':
    # 监听 5003 端口
    print("running")
    app.run(host='0.0.0.0', port=5003)
