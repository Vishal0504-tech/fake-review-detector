import joblib
import os

BASE_DIR = os.path.dirname(__file__)

model_path = os.path.join(BASE_DIR, "model.pkl")
vectorizer_path = os.path.join(BASE_DIR, "vectorizer.pkl")

model = joblib.load(model_path)
vectorizer = joblib.load(vectorizer_path)

def predict_review(text):
    vec = vectorizer.transform([text])
    prob = model.predict_proba(vec)[0][1]

    return {
        "score": float(prob),
        "label": "Real" if prob > 0.5 else "Fake"
    }