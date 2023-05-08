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
  $("#text").val("");
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
    $("#output").scrollTop($("#output")[0].scrollHeight);
  }
});

$("#send").on("click", function () {
  const msg = {
    // キー：バリュー
    uname: $("#uname").val(),
    text: $("#text").val(),
  };
  sendText(msg.uname, msg.text);
  $("#output").scrollTop($("#output")[0].scrollHeight);
});
onChildAdded(dbRef, function (data) {
  // データをとる
  const msg = data.val();
  const key = data.key; // ユニークKEY
  // ユーザーでアイコン切り替え
  let image_src = "";
  if (msg.uname == "hachi") {
    image_src = "./imgs/hachi.jpg";
    console.log(msg.uname);
  } else if (msg.uname == "chii") {
    image_src = "./imgs/chii.png";
  } else {
    image_src = "./imgs/usagi.png";
  }
  // 選択チャット削除ボタン
  const delBtn = '<div class="del_btn"><img src="./imgs/delete.png"></div>';
  let h =
    "<div data-key=" +
    key +
    ">" +
    '<div class="message d-flex align-items-center">' +
    '<img src="' +
    image_src +
    '" class="user-icon" />' +
    '<p id="username_style">' +
    msg.uname +
    "</p>" +
    "</div>" +
    "<div class='align-items-center'>" +
    '<p id="text_style">' +
    msg.text +
    "</p>" +
    "<button id='testdel' class='test'>" +
    '<img src="./imgs/delete.png" class="del_btn" alt="">' +
    "</button>" +
    "</div>" +
    "</div>";

  $("#output").append(h);
  $("#output #username_style").addClass("bg-info text-white rounded p-1");
  $("#output #text_style").addClass("bubble");

  $("#output").scrollTop($("#output")[0].scrollHeight);
});

// 全部消すボタン
$("#deleteAll").on("click", function () {
  const pathAll = ref(db, "chat");
  $("#output").empty();
  remove(pathAll);
  $("#text").empty();
});

$("#output").on("click", "#testdel", function () {
  const key = $(this).parent().parent().data("key");
  console.log(key);
  remove(ref(db, "chat/" + key));
  $(this).parent().parent().remove();
});

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
