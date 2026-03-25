import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import pickle

fake = pd.read_csv("Fake.csv")
true = pd.read_csv("True.csv")

fake["label"]=0
true["label"]=1

data=pd.concat([fake,true])

X=data["text"]
y=data["label"]

vec=TfidfVectorizer(stop_words="english")
Xv=vec.fit_transform(X)

model=LogisticRegression()
model.fit(Xv,y)

pickle.dump(model,open("model.pkl","wb"))
pickle.dump(vec,open("vectorizer.pkl","wb"))
