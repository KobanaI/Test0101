//Process１：
// アップロードされた画像を取得して、composition.jsへ



document.getElementById("form1").addEventListener("submit", async (event) => {

  event.preventDefault();
  document.getElementById("uploadButton").disabled = true; // ボタンを無効化
  const formData = new FormData(event.target);


  const response = await fetch("/composition/process-file", {
    method: "POST",
    body: formData,
  });

  if (response.ok){
    window.location.href = `/result`;
    document.getElementById("uploadButton").disabled = false;
  }

});
