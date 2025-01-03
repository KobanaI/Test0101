//ファイル追跡１：
// アップロードされた画像を取得して、composition.jsへ
let isSubmitting = false; // 送信フラグを追加
document.getElementById("form1").addEventListener("submit", async (event) => {

  if (isSubmitting) {
    event.preventDefault();
    return;
  }
  

  event.preventDefault();
  isSubmitting = true; // 送信中フラグを立てる
  document.getElementById("uploadButton").disabled = true; // ボタンを無効化
  const formData = new FormData(event.target);
 
  try {
    const response = await fetch("/composition/process-file", {
      method: "POST",
      body: formData,
    });
    if (response.ok) {
      console.log("アップロード成功:");
      window.location.href = "/composition/displayResults";
    }else{
      console.error("responseのところで失敗");
    }
  } catch (error) {
    console.error("リクエストエラー:", error);
  }
});


window.addEventListener("beforeunload", (event) => {
  // ページから離れる前の処理
  window.location.href = "/deleteImage";

});