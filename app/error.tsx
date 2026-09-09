"use client";
export default function ErrorPage({ reset }: { reset: () => void }) { return <main className="system-page"><p>ERROR</p><h1>頁を開けませんでした。</h1><button type="button" onClick={reset}>もう一度読み込む</button></main>; }
