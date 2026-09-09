# microCMS 初期設定

この設定は制作・納品担当者向けです。日常の更新は [購入者向け更新手順](./buyer-cms-guide.md) を参照してください。

## 1. サービスとAPIキー

1. microCMSでサービスを作成します。
2. 「サービス設定 → APIキー」から、GET権限だけを持つ読み取り専用キーを作成します。
3. ホスティング環境へ `.env.example` と同名の環境変数を登録します。

`MICROCMS_API_KEY` と `MICROCMS_WEBHOOK_SECRET` はサーバー専用です。名前に `NEXT_PUBLIC_` を付けないでください。ブラウザへ配信されるコードには含まれません。

## 2. APIスキーマ

フィールドIDは下記と完全に一致させます。表示名は日本語で自由に設定できます。

手入力の代わりに、APIの基本情報と型を選択した後の「APIスキーマを定義」画面から次のファイルをインポートできます。インポートJSONは公式のスキーマ形式に合わせ、`apiFields` と `customFields` だけを含みます。

- `restaurant`（オブジェクト形式）: [`microcms-schemas/restaurant.json`](./microcms-schemas/restaurant.json)
- `courses`（リスト形式）: [`microcms-schemas/courses.json`](./microcms-schemas/courses.json)
- `notices`（リスト形式）: [`microcms-schemas/notices.json`](./microcms-schemas/notices.json)

### `restaurant` — オブジェクト形式

未入力のフィールドは現在のローカル値で補完されます。

| フィールドID | 種類 | 用途・入力例 |
|---|---|---|
| `brandJa` | テキスト | 篝 |
| `brandEn` | テキスト | KAGARI |
| `heroTitle` | テキストエリア | 改行位置も反映。例: `火と\n余白。` |
| `heroBody` | テキストエリア | ヒーロー説明 |
| `courseEyebrow` | テキスト | `SEPTEMBER / TEN COURSES` |
| `courseSectionTitle` | テキスト | `十皿、` |
| `courseTitleAccent` | テキスト | `今夜の火加減。` |
| `courseSectionIntro` | テキストエリア | モバイル版コース導入文 |
| `courseName` | テキスト | おまかせ |
| `coursePrice` | 数値 | 33000（円、税込価格の運用を推奨） |
| `coursePriceSuffix` | テキスト | `（税込・サービス料10%別）` |
| `serviceRatePercent` | 数値 | 10 |
| `address` | テキスト | 郵便番号を含む住所 |
| `access` | テキストエリア | 最寄駅・出口・徒歩分数 |
| `telephone` | テキスト | 03-0000-0000 |
| `reception` | テキスト | 電話受付時間 |
| `hours` | テキストエリア | サイトに表示する営業時間 |
| `closed` | テキスト | サイトに表示する定休日 |
| `pairing` | テキストエリア | ペアリング名と価格 |
| `seats` | テキストエリア | 席数・個室情報 |
| `children` | テキストエリア | お子様の利用条件 |
| `dress` | テキストエリア | 服装・香水等のお願い |
| `allergy` | テキストエリア | アレルギー対応案内 |
| `cancellation` | テキストエリア | キャンセル規定 |
| `reservationTitle` | テキスト | ご予約 |
| `reservationNote` | テキストエリア | 予約開始日や受付案内 |
| `reservationSlots` | テキストエリア | `18:00` と `20:45` を1行ずつ |
| `bookingWindowMonths` | 数値 | 予約受付月数。1〜12 |
| `guestsMin` | 数値 | 最少人数。1〜20 |
| `guestsMax` | 数値 | 最大人数。1〜20 |
| `closedWeekdays` | テキスト | 定休曜日を0（日）〜6（土）でカンマ区切り。例: `0`。曜日定休なしは `none` |
| `secondMondayClosed` | 真偽値 | 第2月曜を予約不可にする場合ON |
| `timeZone` | テキスト | 通常は `Asia/Tokyo` |

### `courses` — リスト形式

| フィールドID | 種類 | 必須 | 用途 |
|---|---|---:|---|
| `chapter` | テキスト | ○ | 序、先付、椀など |
| `title` | テキスト | ○ | 料理名 |
| `description` | テキストエリア | ○ | 料理説明 |
| `origin` | テキストエリア | ○ | 産地・生産者 |
| `photo` | 画像 | ○ | 横位置の主写真。altテキストも入力 |
| `sortOrder` | 数値 | ○ | 10、20、30…のように間隔を空ける |
| `details` | 繰り返し | 任意 | 下記 `courseDetail` を複数登録 |

カスタムフィールド `courseDetail` を作り、`label`（テキスト）と `value`（テキスト）を追加してください。`details` はこのカスタムフィールドの繰り返しです。

### `notices` — リスト形式

| フィールドID | 種類 | 必須 | 用途 |
|---|---|---:|---|
| `date` | 日時 | ○ | サイトでは `YYYY.MM.DD` 表示 |
| `title` | テキスト | ○ | お知らせ本文 |
| `sortOrder` | 数値 | ○ | 小さい順に表示 |

リストAPIは公開済みコンテンツだけを最大100件取得します。通常運用では、表示順変更時に `sortOrder` を編集してください。

## 3. 環境変数とデプロイ

`.env.example` を参照してホスティング環境へ値を登録し、再デプロイします。エンドポイント名を上記から変更した場合だけ、対応する `MICROCMS_*_ENDPOINT` も変更します。

APIキーが未設定、サービスIDが不正、タイムアウト、APIエラー、またはレスポンス形式が不正な場合は、該当セクションだけ `content/restaurant.ts` と `content/reservation.ts` のローカル値へ戻ります。秘密値やエラー本文は画面へ表示しません。

## 4. 公開直後反映Webhook

1. 推測困難なランダム文字列を作り、ホスティング環境の `MICROCMS_WEBHOOK_SECRET` に登録して再デプロイします。
2. `restaurant`、`courses`、`notices` の各APIで「API設定 → Webhook → カスタム通知」を追加します。
3. URLを `https://公開ドメイン/api/revalidate` にします。
4. カスタム通知の「シークレット」に、環境変数と同じ値を登録します。
5. 公開・更新・公開停止・並び替えを通知対象にします。

受信側は `x-microcms-signature` のHMAC-SHA256署名を検証してからキャッシュを破棄します。Webhookが届かなかった場合も、`MICROCMS_REVALIDATE_SECONDS` 後のアクセスで再取得されます。

## 5. 動作確認

microCMSでテスト用のお知らせを公開し、数秒後にサイトへ反映されることを確認します。その後、下書きへ戻すか公開停止し、サイトから消えることも確認してください。
