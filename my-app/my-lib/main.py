import sys,secrets,string,requests,cv2,os,uuid
from pathlib import Path





#SERVER_URL認識されない。
cdserver_url = os.getenv("SERVER_URL")
#server_url = os.getenv("http://localhost:4000","http://localhost:4000")
uploaded_file_path = sys.argv[1]

def deleteOriginalFile():
  path = Path(uploaded_file_path)
  try:
    path.unlink()
    print(f"{path} は消え去りました。さようなら")
  except :
    print("なんかエラーでたぞpython")

def generate_random_string(length=10):
    alphabet = string.ascii_letters + string.digits + string.punctuation
    random_string = ''.join(secrets.choice(alphabet) for _ in range(length))
    return random_string

def addSimply(image):
   project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
   image_path = os.path.join(project_root, "public", "images", "2697532_s.jpg")
   errImage = cv2.imread(image_path)
   errImage = cv2.resize(errImage,(image.shape[1],image.shape[0]))
   addImage = image + errImage

   return addImage


#画像ファイル追跡3：
# アップロードされた画像をopencvで加工し、加工した画像をcomplete_imagesへ保存
#元の画像はもういらないので、消す
#composition.jsで、表示する準備をする


if uploaded_file_path :

    image = cv2.imread(uploaded_file_path)
    
    resultImage = addSimply(image)
    #resultImage = cv2.cvtColor(image,cv2.COLOR_BGR2RGB)
    random = "ujyfyu"

    app_dir = Path(__file__).resolve().parent.parent 
    save_dir = app_dir / 'complete_images' 
    save_dir.mkdir(parents=True, exist_ok=True)
    
    uu_id = uuid.uuid4().hex  # 一意の16進文字列
    save_path = save_dir / f"{uu_id}.png"
    print('保存パスはこれです', save_path)

    cv2.imwrite(str(save_path), resultImage)  # 加工した画像を保存
    deleteOriginalFile()


    data = {"path": str(save_path)} 
    requests.post(f'{server_url}/composition/completeChangeImg',json=data)


else:
  print('そもそも画像がないよ')








