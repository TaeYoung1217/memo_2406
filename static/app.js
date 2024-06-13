//CREATE ->> POST method
async function createMemo(value) {
  //서버에 post 요청으로 값을 create
  const res = await fetch("/memos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: new Date(),
      content: value,
    }),
  });

  readMemo();
}

//READ ->> GET method
async function readMemo() {
  //서버에 get요청해서 받아오는 함수]
  const res = await fetch("/memos?sortBy=content&order=asc"); //기본값으로 get 요청
  const jsonRes = await res.json();

  const ul = document.querySelector("#memo-ul");
  ul.innerHTML = ""; //ul 부분을 초기화 하고 다시 서버에 있는 내용과 입력한 값을 추가한 내용을 표시하기 위해 초기화
  jsonRes.forEach(displayMemo); //jsonRes에 있는 모든 요소에 대해 displayMemo 함수를 실행
}

function displayMemo(memo) {
  const ul = document.querySelector("#memo-ul");
  const li = document.createElement("li");
  li.innerText = `${memo.id} ${memo.content}`; //readMemo에서 가져온 jsonRes 객체의 내용을 memo로 받아와서 value를 사용

  const editBtn = document.createElement("button");
  editBtn.innerText = "수정하기";
  editBtn.addEventListener("click", editMemo);
  editBtn.dataset.id = memo.id;

  const delBtn = document.createElement("button");
  delBtn.innerText = "삭제하기";
  delBtn.addEventListener("click", deleteMemo);
  delBtn.dataset.id = memo.id;

  li.appendChild(editBtn);
  li.appendChild(delBtn);
  ul.appendChild(li);
}

//UPDATE ->> PUT method
async function editMemo(event) {
  const id = event.target.dataset.id;
  const editInput = prompt("수정할 내용을 입력하세요");

  const res = await fetch(`/memos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
      content: editInput,
    }),
  });

  readMemo();
}

//DELETE ->> DELETE method
async function deleteMemo(event) {
  const id = event.target.dataset.id;
  const res = await fetch(`/memos/${id}`, {
    method: "DELETE",
  });

  readMemo();
}

function handleSubmit(event) {
  //생성 버튼 눌렀을때 동작하는 함수
  event.preventDefault();
  const input = document.querySelector("#memo-input"); //memo-input에 들어있는 내용을
  createMemo(input.value); //creatememo 함수 parameter로 넘겨줌
  input.value = ""; //inputbox 초기화
}

const form = document.querySelector("#memo-form");
form.addEventListener("submit", handleSubmit);
readMemo();
