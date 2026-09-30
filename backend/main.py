from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import scipy.stats as stats
import numpy as np

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 1. Endpoint ANOVA (Existing) ---
class AnovaRequest(BaseModel):
    group_a: list[float]
    group_b: list[float]
    group_c: list[float]

@app.post("/api/calculate-anova")
def calculate_anova(data: AnovaRequest):
    f_stat, p_value = stats.f_oneway(data.group_a, data.group_b, data.group_c)
    return {
        "f_statistic": round(f_stat, 4),
        "p_value": round(p_value, 4),
        "status": "significant" if p_value < 0.05 else "not significant"
    }

# --- 2. Endpoint Z-Score (New Tool) ---
class ZScoreRequest(BaseModel):
    dataset: list[float]

@app.post("/api/calculate-zscore")
def calculate_zscore(data: ZScoreRequest):
    dataset = data.dataset
    if not dataset:
        return {"error": "Dataset kosong"}

    mean_val = np.mean(dataset)
    std_val = np.std(dataset, ddof=1) # Standar deviasi sampel (ddof=1)

    # Menghindari pembagian dengan nol jika seluruh angka sama
    if std_val == 0:
        z_scores = [0.0 for _ in dataset]
    else:
        z_scores = stats.zscore(dataset, ddof=1)

    return {
        "mean": round(float(mean_val), 4),
        "standard_deviation": round(float(std_val), 4),
        "results": [
            {"original": val, "z_score": round(float(z), 4)}
            for val, z in zip(dataset, z_scores)
        ]
    }