from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List

class Memo(BaseModel):
    id : str
    content : str
    
memos = []


app = FastAPI()

#CREATE
@app.post("/memos")
def create_memo(memo:Memo):
    memos.append(memo)
    return '메모 추가에 성공'

#READ
# @app.get('/memos')
# def read_memo():
#     return memos

@app.get('/memos') #id를 기준으로 
def read_memo(sortBy:str, order:str):
    # sort_key = lambda memos:getattr(memos,sortBy) #sortby로 넘어온 기준을 확인하는 작업
    print(type(getattr(memos[0],'content')))
    sort_key = getattr(memos[0],'content')
    sorted_data = sorted(memos, key=sort_key, reverse=(order.lower()=='desc')) #reverse값이 True이면 내림차순

    return sorted_data




#UPDATE
@app.put('/memos/{memo_id}')
def put_memo(req_memo:Memo):
    for memo in memos:
        if memo.id == req_memo.id:
            memo.content = req_memo.content
            return '성공했습니다.'
    return '존재하지 않는 메모'

#DELETE
@app.delete("/memos/{memo_id}")
def delete_memo(memo_id):
    for index, memo in enumerate(memos):  # 인덱스와 메모 값을 동시에 사용하며 반복문을 돌기위해 enumerate 함수 사용
        if memo.id == memo_id:  # 들어온 메모와 존재하는 메모의 id가 일치한다면
            memos.pop(index)  # memos 배열에서 삭제
            return "성공"
    return "존재하지 않는 메모"

app.mount('/', StaticFiles(directory='static', html=True), name='static')

