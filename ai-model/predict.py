import pickle
from flask import Flask,request,jsonify

model=pickle.load(open("model.pkl","rb"))
vec=pickle.load(open("vectorizer.pkl","rb"))

app=Flask(__name__)

@app.route("/predict",methods=["POST"])
def predict():
 text=request.json["text"]
 v=vec.transform([text])
 pred=model.predict(v)[0]
 prob=model.predict_proba(v)[0].max()

 return jsonify({
  "prediction":"FAKE NEWS" if pred==0 else "REAL NEWS",
  "confidence":round(prob*100,2)
 })

app.run(port=5000)
