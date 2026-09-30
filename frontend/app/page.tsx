"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const translations = {
  id: {
    tabAnova: "Uji ANOVA",
    tabZScore: "Z-Score",
    anovaTitle: "Kalkulator Uji ANOVA",
    anovaDesc: "Salin 3 kolom data numerik dari Excel (pisahkan dengan Tab/Spasi).",
    zTitle: "Kalkulator Z-Score",
    zDesc: "Salin 1 kolom data numerik dari Excel untuk mencari standar deviasi dan Z-Score.",
    placeholder3Col: "Contoh (3 kolom):\n250.5    400.1    150.0\n300.0    420.5    160.5",
    placeholder1Col: "Contoh (1 kolom):\n10\n15\n20\n25",
    btnCalc: "Jalankan Analisis",
    btnProcessing: "Memproses...",
    errorDefault: "Gagal terhubung ke server atau format salah.",
    resultTitle: "Hasil Analisis:",
    sig: "🟩 Terdapat Perbedaan Signifikan (P < 0.05)",
    notSig: "🟨 Tidak Terdapat Perbedaan Signifikan (P >= 0.05)",
    fStat: "F-Statistic",
    pValue: "P-Value",
    chartTitle: "Perbandingan Nilai Rata-rata (Mean)",
    meanText: "Rata-rata (Mean)",
    stdText: "Standar Deviasi",
    thOriginal: "Nilai Asli",
    thZScore: "Z-Score"
  },
  en: {
    tabAnova: "ANOVA Test",
    tabZScore: "Z-Score",
    anovaTitle: "ANOVA Test Calculator",
    anovaDesc: "Copy 3 columns of numeric data from Excel (separated by Tab/Space).",
    zTitle: "Z-Score Calculator",
    zDesc: "Copy 1 column of numeric data from Excel to find standard deviation and Z-Score.",
    placeholder3Col: "Example (3 columns):\n250.5    400.1    150.0\n300.0    420.5    160.5",
    placeholder1Col: "Example (1 column):\n10\n15\n20\n25",
    btnCalc: "Run Analysis",
    btnProcessing: "Processing...",
    errorDefault: "Failed to connect to server or invalid format.",
    resultTitle: "Analysis Results:",
    sig: "🟩 Significant Difference Found (P < 0.05)",
    notSig: "🟨 No Significant Difference Found (P >= 0.05)",
    fStat: "F-Statistic",
    pValue: "P-Value",
    chartTitle: "Mean Value Comparison",
    meanText: "Mean",
    stdText: "Standard Deviation",
    thOriginal: "Original Value",
    thZScore: "Z-Score"
  }
};

export default function CombinedTools() {
  const [lang, setLang] = useState<"id" | "en">("id");
  const [activeTab, setActiveTab] = useState<"anova" | "zscore">("anova");
  const t = translations[lang];

  // --- State untuk ANOVA ---
  const [anovaData, setAnovaData] = useState("");
  const [anovaResult, setAnovaResult] = useState<any>(null);
  const [anovaLoading, setAnovaLoading] = useState(false);
  const [anovaError, setAnovaError] = useState("");

  // --- State untuk Z-Score ---
  const [zData, setZData] = useState("");
  const [zResult, setZResult] = useState<any>(null);
  const [zLoading, setZLoading] = useState(false);
  const [zError, setZError] = useState("");

  // --- Fungsi Logika ANOVA ---
  const parseExcelData = (text: string) => {
    const group_a: number[] = [];
    const group_b: number[] = [];
    const group_c: number[] = [];
    text.trim().split("\n").forEach((row) => {
      const cols = row.split("\t");
      if (cols[0] && !isNaN(Number(cols[0]))) group_a.push(Number(cols[0]));
      if (cols[1] && !isNaN(Number(cols[1]))) group_b.push(Number(cols[1]));
      if (cols[2] && !isNaN(Number(cols[2]))) group_c.push(Number(cols[2]));
    });
    return { group_a, group_b, group_c };
  };

  const calculateAverage = (arr: number[]) => {
    if (arr.length === 0) return 0;
    return Number((arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2));
  };

  const handleAnova = async () => {
    setAnovaLoading(true); setAnovaError("");
    try {
      const payload = parseExcelData(anovaData);
      if (payload.group_a.length === 0) throw new Error(t.errorDefault);

      const response = await fetch("http://localhost:8001/api/calculate-anova", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(t.errorDefault);

      const apiData = await response.json();
      const chartData = [
        { name: lang === "id" ? "Grup A" : "Group A", RataRata: calculateAverage(payload.group_a) },
        { name: lang === "id" ? "Grup B" : "Group B", RataRata: calculateAverage(payload.group_b) },
        { name: lang === "id" ? "Grup C" : "Group C", RataRata: calculateAverage(payload.group_c) },
      ];
      setAnovaResult({ ...apiData, chartData });
    } catch (err: any) { setAnovaError(err.message || t.errorDefault); }
    finally { setAnovaLoading(false); }
  };

  // --- Fungsi Logika Z-Score ---
  const parseSingleColumn = (text: string) => {
    const dataset: number[] = [];
    text.trim().split("\n").forEach((row) => {
      const val = row.trim();
      if (val && !isNaN(Number(val))) dataset.push(Number(val));
    });
    return dataset;
  };

  const handleZScore = async () => {
    setZLoading(true); setZError("");
    try {
      const dataset = parseSingleColumn(zData);
      if (dataset.length === 0) throw new Error(t.errorDefault);

      const response = await fetch("http://localhost:8001/api/calculate-zscore", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ dataset }),
      });
      if (!response.ok) throw new Error(t.errorDefault);

      const data = await response.json();
      setZResult(data);
    } catch (err: any) { setZError(err.message || t.errorDefault); }
    finally { setZLoading(false); }
  };

  return (
      <div className="p-4 md:p-8 max-w-3xl mx-auto font-sans">
        {/* Header & Toggle Bahasa */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex gap-2 p-1 bg-gray-200/50 rounded-lg">
            <button
                onClick={() => setActiveTab("anova")}
                className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${activeTab === "anova" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              {t.tabAnova}
            </button>
            <button
                onClick={() => setActiveTab("zscore")}
                className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${activeTab === "zscore" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              {t.tabZScore}
            </button>
          </div>

          <button
              onClick={() => setLang(lang === "id" ? "en" : "id")}
              className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-semibold transition-colors flex items-center"
          >
            {lang === "id" ? "🇬🇧 EN" : "🇮🇩 ID"}
          </button>
        </div>

        {/* --- KONTEN TAB ANOVA --- */}
        {activeTab === "anova" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h1 className="text-2xl font-bold mb-2">{t.anovaTitle}</h1>
              <p className="text-gray-600 mb-6">{t.anovaDesc}</p>

              <textarea
                  className="w-full h-40 p-4 border border-gray-300 rounded-lg outline-none font-mono text-sm bg-transparent"
                  placeholder={t.placeholder3Col} value={anovaData} onChange={(e) => setAnovaData(e.target.value)}
              />

              <button onClick={handleAnova} disabled={anovaLoading || anovaData.length === 0}
                      className="mt-4 w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors">
                {anovaLoading ? t.btnProcessing : t.btnCalc}
              </button>

              {anovaError && <p className="text-red-500 mt-4 bg-red-50 p-3 rounded">{anovaError}</p>}

              {anovaResult && (
                  <div className="mt-8 p-6 border border-gray-200 rounded-xl bg-gray-50/10 shadow-sm">
                    <h2 className="font-semibold text-xl mb-4 border-b pb-2">{t.resultTitle}</h2>
                    <div className="mb-6 p-4 rounded border border-gray-200 bg-white/5">
                      <p className="text-lg font-medium text-center">{anovaResult.p_value < 0.05 ? t.sig : t.notSig}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="p-4 rounded border border-gray-200 text-center bg-white/5">
                        <p className="text-sm text-gray-500">{t.fStat}</p>
                        <p className="text-2xl font-mono font-medium">{anovaResult.f_statistic}</p>
                      </div>
                      <div className="p-4 rounded border border-gray-200 text-center bg-white/5">
                        <p className="text-sm text-gray-500">{t.pValue}</p>
                        <p className="text-2xl font-mono font-medium">{anovaResult.p_value}</p>
                      </div>
                    </div>
                    <div className="p-4 rounded border border-gray-200 bg-white/5">
                      <h3 className="font-semibold mb-6 text-center">{t.chartTitle}</h3>
                      <div className="w-full h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={anovaResult.chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#4b5563" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip cursor={{fill: 'rgba(255,255,255,0.1)'}} contentStyle={{borderRadius: '8px'}} />
                            <Bar dataKey="RataRata" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={50} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
              )}
            </div>
        )}

        {/* --- KONTEN TAB Z-SCORE --- */}
        {activeTab === "zscore" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h1 className="text-2xl font-bold mb-2">{t.zTitle}</h1>
              <p className="text-gray-600 mb-6">{t.zDesc}</p>

              <textarea
                  className="w-full h-40 p-4 border border-gray-300 rounded-lg outline-none font-mono text-sm bg-transparent"
                  placeholder={t.placeholder1Col} value={zData} onChange={(e) => setZData(e.target.value)}
              />

              <button onClick={handleZScore} disabled={zLoading || zData.length === 0}
                      className="mt-4 w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors">
                {zLoading ? t.btnProcessing : t.btnCalc}
              </button>

              {zError && <p className="text-red-500 mt-4 bg-red-50 p-3 rounded">{zError}</p>}

              {zResult && (
                  <div className="mt-8 p-6 border border-gray-200 rounded-xl bg-gray-50/10 shadow-sm">
                    <h2 className="font-semibold text-xl mb-4 border-b pb-2">{t.resultTitle}</h2>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="p-4 rounded border border-gray-200 text-center bg-white/5">
                        <p className="text-sm text-gray-500">{t.meanText}</p>
                        <p className="text-xl font-mono font-medium">{zResult.mean}</p>
                      </div>
                      <div className="p-4 rounded border border-gray-200 text-center bg-white/5">
                        <p className="text-sm text-gray-500">{t.stdText}</p>
                        <p className="text-xl font-mono font-medium">{zResult.standard_deviation}</p>
                      </div>
                    </div>
                    <div className="rounded border border-gray-200 overflow-hidden max-h-72 overflow-y-auto bg-white/5">
                      <table className="w-full text-left border-collapse">
                        <thead className="border-b border-gray-200">
                        <tr>
                          <th className="p-3 text-sm font-semibold">{t.thOriginal}</th>
                          <th className="p-3 text-sm font-semibold">{t.thZScore}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {zResult.results.map((item: any, idx: number) => (
                            <tr key={idx} className="border-b border-gray-200/50 hover:bg-gray-100/10">
                              <td className="p-3 font-mono text-sm">{item.original}</td>
                              <td className="p-3 font-mono text-sm text-blue-500 font-medium">{item.z_score}</td>
                            </tr>
                        ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
              )}
            </div>
        )}

        <div className="mt-16 pt-8 border-t border-gray-200">
          {activeTab === "anova" ? (
              <div className="animate-in fade-in">
                <h2 className="text-xl font-bold mb-3 text-gray-800">
                  {lang === "id" ? "Memahami Uji ANOVA" : "Understanding ANOVA Test"}
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 text-justify">
                  {lang === "id"
                      ? "Analysis of Variance (ANOVA) sebuah metode komputasi statistik yang digunakan untuk membandingkan rata-rata dari tiga kelompok populasi atau lebih secara bersamaan. P-Value yang dihasilkan (jika < 0.05) menunjukkan bahwa terdapat perbedaan yang signifikan secara statistik antar kelompok tersebut, yang sering digunakan dalam analisis data asuransi, medis, maupun penelitian akademik."
                      : "Analysis of Variance (ANOVA) is a statistical computational method used to simultaneously compare the means of three or more population groups. The resulting P-Value (if < 0.05) indicates a statistically significant difference between the groups, widely used in insurance data analysis, medical fields, and academic research."}
                </p>
              </div>
          ) : (
              <div className="animate-in fade-in">
                <h2 className="text-xl font-bold mb-3 text-gray-800">
                  {lang === "id" ? "Memahami Z-Score & Standar Deviasi" : "Understanding Z-Score & Standard Deviation"}
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 text-justify">
                  {lang === "id"
                      ? "Z-Score menunjukkan seberapa jauh sebuah titik data dari nilai rata-rata (mean) dalam satuan standar deviasi. Nilai Z yang positif berarti data berada di atas rata-rata, sedangkan nilai negatif berada di bawah rata-rata. Alat ini sangat berguna untuk normalisasi data sebelum diproses dalam algoritma Machine Learning."
                      : "A Z-Score indicates how many standard deviations a specific data point is from the mean. A positive Z-Score means the data is above the mean, while a negative score is below the mean. This tool is highly useful for data normalization before processing in Machine Learning algorithms."}
                </p>
              </div>
          )}
        </div>

        <div className="mt-12 mb-4 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
          <a href="/privacy" className="hover:text-blue-600 mx-3 hover:underline">Privacy Policy</a>
          <span className="text-gray-300">|</span>
          <a href="/terms" className="hover:text-blue-600 mx-3 hover:underline">Terms of Service & Disclaimer</a>
        </div>

      </div>
  );
}