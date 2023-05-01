// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  set,
  onChildAdded,
  remove,
  onChildRemoved,
  onValue,
} from "https://www.gstatic.com/firebasejs/9.20.0/firebase-database.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDUkEEZ-rUnp1H2hlMCVj9wqBTT-NwlzgQ",
  authDomain: "gsdemo-eb597.firebaseapp.com",
  databaseURL: "https://gsdemo-eb597-default-rtdb.firebaseio.com",
  projectId: "gsdemo-eb597",
  storageBucket: "gsdemo-eb597.appspot.com",
  messagingSenderId: "68690679366",
  appId: "1:68690679366:web:d838bd899c4bf7227adc47",
};

// Initialize Firebase このまま使えば良い
const app = initializeApp(firebaseConfig);
const db = getDatabase(app); // realtimeDBに接続
const dbRef = ref(db, "chat"); // RealtimeDB内の"chat"を使う chatという階層にデータを入れる

// テキスト送信関数
function sendText(uname, text) {
  const msg = {
    // キー：バリュー
    uname: uname,
    text: text,
  };
  const newPostRef = push(dbRef); // ユニークキーを生成している
  set(newPostRef, msg); //ユニークKEYとMSG
  $("#output").scrollTop($("#output")[0].scrollHeight);
  
  $("#text").find("p").remove();
}

// エンターキーで送信
$("#text").on("keydown", function (e) {
  if (e.key == "Enter" && (e.metaKey || e.ctrlKey)) {
    //   send();
    // オブジェクト
    const msg = {
      // キー：バリュー
      uname: $("#uname").val(),
      text: $("#text").val(),
    };
    sendText(msg.uname, msg.text);
    // const newPostRef = push(dbRef); // ユニークキーを生成している
    // set(newPostRef, msg); //ユニークKEYとMSG
    $("#output").scrollTop($("#output")[0].scrollHeight);
  }
});

// キーに対応する文字取得
$("#gettext").on("click", function () {
  // var key = "-NUBUeEfHsU5sqYcfdwl";
  var key = keyArry[0];

  // データを取得
  const db = getDatabase();
  const databaseRef = ref(db, "chat/" + key);
  onValue(databaseRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const text = data.text;
      console.log("取得したテキスト:", text);
    } else {
      console.log("指定したキーに対するデータが存在しません。");
    }
  });
});

// チャットに紐づくユニークキーを配列にいれていく
let keyArry = [];

onChildAdded(dbRef, function (data) {
  // データをとる
  const msg = data.val();
  const key = data.key; // ユニークKEY

  keyArry.push(key);
  // console.log(keyArry); // 送信時のkeyを配列に追加していく
  // let h = "<p>" + msg.uname + "<br>" + msg.text + "</p>";
  // let h =
  //   "<div class='message'><img src='./imgs/hachi.jpg' class='user-icon'><p>" +
  //   msg.uname +
  //   "<br>" +
  //   msg.text +
  //   "</p></div>";

  let h =
    '<div class="message d-flex align-items-center">' +
    '<img src="./imgs/hachi.jpg" class="user-icon" />' +
    "<p id='username_style'>" +
    msg.uname +
    "</p>" +
    "</div>" +
    "<p id='text_style'>" +
    msg.text +
    "</p>";
  let btn = '<button id="deleteBtn">' + "test" + "</button>";
  $("#output").append(h);
  // $("#output p:last-child").addClass("bg-success text-white rounded p-1");
  $("#output #username_style").addClass("bg-info text-white rounded p-1");
  $("#output #text_style").addClass("bubble");
  // $("#output #text_style").addClass("bg-success text-white rounded p-1");

  // $("#output").append(btn);
  $("#output").scrollTop($("#output")[0].scrollHeight);
});

// 全部消すボタン
$("#deleteAll").on("click", function () {
  const pathAll = ref(db, "chat");
  $("#output").empty();
  remove(pathAll);
  $("#text").empty();
});

// 一部消すボタン
// $("#aaa").on("click", function () {
//   const kesu2 = ref(db, "chat/-NU9oK1d3s72x05V4bjV");
//   // $("#output").remove();
//   remove(kesu2);
//   alert("一部消した");
// });

// 一部消すボタン パスを変数に持たせる
// $("#aaa").on("click", function () {
//   // let path = "chat/-NU9oKe0o5VgHvzlrdTt"
//   let path = `chat/${keyArry[0]}`;

//   const kesu2 = ref(db, path);
//   // $("#output").remove();
//   remove(kesu2);
//   alert("一部消した");
// });

// $("#deleteBtn").on("click", function () {
//   alert("delete");
// });

// $("#output").on("click", "#deleteBtn", function () {
//   let p = $("#output").find("p");
//   $("#output").remove
// });

const recognition = new webkitSpeechRecognition(); // APIオブジェクト作成
recognition.continuous = true; // 音声認識を連続的に行う
recognition.interimResults = true; // 認識中の文字を取得
recognition.lang = "ja-jp";

const startBtn = document.getElementById("start");
const stopBtn = document.getElementById("stop");
const resultDiv = document.getElementById("text");

let finalTranscript = "";

startBtn.addEventListener("click", () => {
  recognition.start();
  startBtn.disabled = true;
  stopBtn.disabled = false;
});

stopBtn.addEventListener("click", () => {
  recognition.stop();
  startBtn.disabled = false;
  stopBtn.disabled = true;
});

recognition.addEventListener("result", (event) => {
  // resultは音声認識の結果を表すイベント
  let interimTranscript = "";
  let transcript = "";
  let speach_text = "";
  for (let i = event.resultIndex; i < event.results.length; i++) {
    transcript = event.results[i][0].transcript;
    if (event.results[i].isFinal) {
      finalTranscript += transcript + " ";
    } else {
      interimTranscript += transcript;
    }
    speach_text = event.results[i][0].transcript;
  }
  const match_result = speach_text.includes("送信");
  if (match_result) {
    speach_text = speach_text.replace("送信", "");
    console.log(speach_text);
    console.log(speach_text.length);
    let test = $("#uname").val();
    console.log($("#uname").val());
    if (speach_text != " ") {
      sendText(test, speach_text);
    }
  }
  resultDiv.innerText = finalTranscript + interimTranscript;
});

recognition.addEventListener("end", () => {
  // 音声認識終了時の関数
  startBtn.disabled = false;
  stopBtn.disabled = true;
  resultDiv.innerText = "";
  finalTranscript = "";
  console.log("認識終了");
});
