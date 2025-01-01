//ファイル追跡１：
// アップロードされた画像を取得して、composition.jsへ

document.getElementById("form1").addEventListener("submit", async (event) => {
  event.preventDefault();
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