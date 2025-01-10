import sys,cv2,os,uuid,random,json
from pathlib import Path





#SERVER_URL認識されない？
server_url = os.getenv("SERVER_URL")
#server_url = os.getenv("http://localhost:4000","http://localhost:4000")
uploaded_file_path = sys.argv[1]

def deleteOriginalFile():
  path = Path(uploaded_file_path)
  try:
    path.unlink()
  except :
    print("なんかエラーでたぞpython")

def randomImageSelect():
  image_name = ["bug1.jpg",
                "resultBack.png",
                "ByWPiqSIkE.png", 
                "n2AnGreC4Y.png",
                "logo.png",
                "NCdHbTEEK1.png",
                "Z7KsnB4xWw.png",
                "il1s36cg3C.png"]
  return random.choice(image_name)


def addSimply(image):
   project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
   image_path = os.path.join(project_root, "bugImages",randomImageSelect())
   errImage = cv2.imread(image_path)
   errImage = cv2.resize(errImage,(image.shape[1],image.shape[0]))
   addImage = image + errImage

  #  image_path = os.path.join(project_root, "bugImages",randomImageSelect())
  #  errImage = cv2.imread(image_path)
  #  errImage = cv2.resize(errImage,(image.shape[1],image.shape[0]))
  #  addImage = addImage + errImage

   return addImage



#Process３：
# アップロードされた画像をopencvで加工し、加工した画像をcomplete_imagesへ保存
#元の画像はもういらないので、消す
#composition.jsで、表示する準備をする


if uploaded_file_path :

    image = cv2.imread(uploaded_file_path)
    
    resultImage = addSimply(image)

    #resultImage = cv2.cvtColor(image,cv2.COLOR_BGR2RGB)

    app_dir = Path(__file__).resolve().parent.parent 
    save_dir = app_dir / 'complete_images' 
    save_dir.mkdir(parents=True, exist_ok=True)
    
    uu_id = uuid.uuid4().hex
    save_path = save_dir / f"{uu_id}.png"

    cv2.imwrite(str(save_path), resultImage)  # 加工した画像を保存
    deleteOriginalFile()

    
    data = {"path": str(save_path)} 
    data["path"] = data["path"].replace("\\", "/")
    print(json.dumps(data))  # json.dumps を使用してデータを JSON 形式で出力



else:
  print('そもそも画像がないよ')








