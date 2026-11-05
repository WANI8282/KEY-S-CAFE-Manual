// src/data/animationData.js - 3D＆アニメーション制御データベース

window.animationData = {
  // 3D空間の共通アセット定義 (Three.jsでのオブジェクト呼び出し用)
  assets: {
    cup: {
      type: "glass-cup-with-key-logo", // 鍵マーク付きプラカップ
      texture: "assets/key-orb.svg",
      lines: { lower: 0.75, upper: 0.80 }, // 実物の白線の高さ（写真通り高め）
      ridges: { lowest: 0.85 } // 一番下のくぼみ
    },
    mug: { type: "ceramic-mug", logo: "KEY'S CAFÉ" },
    ingredients: {
      ice: { shape: "particles-cube", color: "#e0f2fe", opacity: 0.7 },
      coffee: { shape: "liquid-flow", color: "#452615", opacity: 0.95 },
      milk: { shape: "liquid-flow", color: "#f8fafc", opacity: 0.95 },
      cocoa: { shape: "liquid-flow", color: "#5c3d2e", opacity: 0.95 },
      syrup_caramel: { shape: "viscous-liquid", color: "#b45309" },
      espuma: { shape: "soft-cloud", color: "#ffffff" },
      source_chocolate: { shape: "spiral-line", color: "#1e1b4b" }
    }
  },

  // 各メニューの3Dアニメーションシーケンス
  sequences: {
    // ---------------- アイスコーヒー (氷温熟成珈琲アイス) ----------------
    "iced-coffee": {
      container: "cup",
      steps: [
        {
          id: 1,
          description: "R/Lプラカップを用意します（鍵マーク正面）",
          camera: { x: 0, y: 1.5, z: 4, duration: 1.5 }, // 正面アップ
          action: "show",
          target: "cup",
          duration: 1.0
        },
        {
          id: 2,
          description: "氷を「上の白い線（高さ80%）」までぴったり入れます",
          camera: { x: 0.8, y: 1.2, z: 3, duration: 1.0 }, // 斜め上から
          action: "fill",
          target: "ice",
          targetHeight: 0.80, // 上側の白線
          animationType: "particles-fall", // 氷が上からパラパラ落ちる動き
          duration: 2.0
        },
        {
          id: 3,
          description: "コーヒーを「一番下のくぼみ（高さ85%）」まで注ぎます",
          camera: { x: 0, y: 1.5, z: 3.5, duration: 1.5 },
          action: "pour",
          target: "coffee",
          targetHeight: 0.85, // 一番下のくぼみ
          animationType: "liquid-rising", // 下から液体が上がってくる
          color: "#2b1408",
          duration: 2.5
        }
      ]
    },

    // ---------------- アイスカフェラテ ----------------
    "iced-cafe-latte": {
      container: "cup",
      steps: [
        {
          id: 1,
          description: "R/Lプラカップを用意します",
          action: "show",
          target: "cup",
          duration: 1.0
        },
        {
          id: 2,
          description: "氷を「上の白い線」まで入れます",
          action: "fill",
          target: "ice",
          targetHeight: 0.80,
          animationType: "particles-fall",
          duration: 1.5
        },
        {
          id: 3,
          description: "牛乳（ミルク）をベース位置まで注ぎます",
          action: "pour",
          target: "milk",
          targetHeight: 0.50,
          animationType: "liquid-rising",
          color: "#f8fafc",
          duration: 1.8
        },
        {
          id: 4,
          description: "ハーモニーからエスプレッソを注ぎ、2層のグラデーションを作ります",
          camera: { x: -0.5, y: 2.0, z: 2.5, duration: 1.5 },
          action: "pour",
          target: "coffee",
          targetHeight: 0.85, // 最終的に一番下のくぼみまで
          animationType: "layer-pouring", // 上からゆっくりエスプレッソが混ざる
          color: "#4a2a18",
          duration: 2.5
        }
      ]
    },

    // ---------------- アイスカフェモカ ----------------
    "iced-cafe-mocha": {
      container: "cup",
      steps: [
        {
          id: 1,
          description: "R/Lプラカップを用意し、氷を「上の白い線」まで入れます",
          action: "show",
          target: "cup",
          duration: 1.0
        },
        {
          id: 2,
          description: "ハーモニーからアイスカフェモカを注ぎます",
          action: "pour",
          target: "coffee",
          targetHeight: 0.85,
          animationType: "liquid-rising",
          duration: 2.0
        },
        {
          id: 3,
          description: "⚠️ 銀のスプーンで底からしっかりと混ぜます（スプーンは後でお湯洗い）",
          action: "animate-object",
          tool: "silver-spoon",
          animationType: "stir-motion", // くるくるかき混ぜるアニメ
          duration: 2.0
        },
        {
          id: 4,
          description: "エスプーマ（ホイップ）を渦状に優しく乗せます",
          camera: { x: 0, y: 2.2, z: 2.5, duration: 1.2 }, // 上から覗き込む
          action: "overlay",
          target: "espuma",
          animationType: "spiral-generate", // くるくると形作られる
          duration: 1.8
        },
        {
          id: 5,
          description: "仕上げにチョコソースを格子状にかけます",
          action: "overlay",
          target: "source_chocolate",
          animationType: "grid-drizzle", // 線状に流れる
          duration: 1.5
        }
      ]
    }
  }
};
