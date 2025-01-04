//ファイル追跡１：
// アップロードされた画像を取得して、composition.jsへ
let isSubmitting = false; // 送信フラグを追加
document.getElementById("form1").addEventListener("submit", async (event) => {

  event.preventDefault();
  document.getElementById("uploadButton").disabled = true; // ボタンを無効化
  const formData = new FormData(event.target);
  const response = await fetch("/composition/process-file", {
    method: "POST",
    body: formData,
  });

  if (response.ok){
    const data = await response.json(); 
    console.log(data)
    window.location.href = `/result?path=${encodeURIComponent(data)}`;
  }

});


// window.addEventListener("beforeunload", (event) => {
//   // ページから離れる前の処理
//   window.location.href = "/deleteImage";

// });