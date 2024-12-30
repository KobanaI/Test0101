import socket
import sys,secrets,string,requests,cv2,os
print("Script started", file=sys.stderr)

def test_connection():
    try:
        # GoogleのDNSサーバー(8.8.8.8)に接続できるか確認
        socket.create_connection(("8.8.8.8", 53), timeout=5)
        print("Network is reachable.")
    except OSError as e:
        print("Network is not reachable:", e)

test_connection()





from pathlib import Path



try:
    response = requests.get("https://gene11.onrender.com/")
    print("いやーたいへんですね",response.status_code)
except Exception as e:
    print("Error:", e)


server_url = os.getenv("SERVER_URL", "https://gene11.onrender.com")
uploaded_file_path = sys.argv[1]


def deleteReq():
  
  path = Path(uploaded_file_path)
  try:
    path.unlink()
    print(f"{path} は跡形もなく消え去りました")
  except :
    print("なんかエラーでたぞpython")

def generate_random_string(length=10):
    alphabet = string.ascii_letters + string.digits + string.punctuation
    random_string = ''.join(secrets.choice(alphabet) for _ in range(length))
    return random_string


# 画像を読み込む
if uploaded_file_path :
    print(1122)
    image = cv2.imread(uploaded_file_path)
    image_change1 = cv2.cvtColor(image,cv2.COLOR_BGR2RGB)
    random = "dsdasdsaasfaddasdsf"

    app_dir = Path(__file__).resolve().parent.parent  # my-app フォルダ
    save_dir = app_dir / 'complete_images'  # my-app/complete_images フォルダ
    save_dir.mkdir(parents=True, exist_ok=True)
    
    save_path = save_dir / f"{random}.png"
    print('保存パスはこれです', save_path)
    deleteReq()
    cv2.imwrite(str(save_path), image_change1)  # 変換した画像を保存


    data = {"path": str(save_path)}  # 辞書形式に変更
    requests.post(f'{server_url}/composition/completeChangeImg',json=data)


else:
  print('そもそも画像がないよ')








