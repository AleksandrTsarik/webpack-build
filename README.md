# Webpack Vanilla JS Starter

## Структура проекта

- `src/assets/fonts/` — сюда добавляйте исходные шрифты (`.ttf`, `.otf`, `.woff`, `.woff2`).

  - Все шрифты автоматически конвертируются в форматы `.woff` и `.woff2` при сборке.
  - Для подключения шрифтов используйте SCSS:
    ```scss
    @font-face {
      font-family: "MyFont";
      src: url("../assets/fonts/MyFont.woff2") format("woff2"), url("../assets/fonts/MyFont.woff")
          format("woff");
      font-weight: normal;
      font-style: normal;
    }
    ```

- `src/assets/images/` — сюда добавляйте изображения (`.jpg`, `.jpeg`, `.png`).
  - Все изображения автоматически конвертируются в формат `.webp` при сборке.
  - Для использования картинок импортируйте их в JS или SCSS:
    ```js
    import myImage from "../assets/images/example.jpg";
    const img = document.createElement("img");
    img.src = myImage;
    document.body.appendChild(img);
    ```
    или
    ```scss
    .example {
      background-image: url("../assets/images/example.jpg");
    }
    ```

## Компонентная структура

- Общие компоненты (Header, Footer) лежат в `src/components/`.
- Основные стили — в `src/styles/`.

## Сборка и запуск

- `npm run start` — запуск dev-сервера
- `npm run build` — production-сборка

## Конвертация шрифтов

- Все шрифты `.ttf` и `.otf`, добавленные в `src/assets/fonts` (и любые подпапки), автоматически конвертируются в `.woff` и `.woff2` при запуске сборки (`npm run start` или `npm run build`).
- Структура подпапок сохраняется.
- Если файлы `.woff` или `.woff2` уже существуют, они не будут перезаписаны.
- Для ручного запуска конвертации используйте:
  ```bash
  npm run fonts:convert
  ```
- Для корректной работы используйте только `.ttf` и `.otf` исходники. Конвертация происходит до сборки Webpack.
