const genericEmailTemplate = (pathname, token, content) =>
  `<html>
  <body>
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap");

      html {
        --dark: hsl(234, 8%, 23%);
        --light: hsl(228, 45%, 98%);
        --lightblue: hsl(230, 100%, 93%);
        --shadow: hsla(233, 8%, 23%, 0.4);
        --info: hsl(232, 100%, 61%);
        --success: hsl(160, 67%, 48%);
        --warning: hsl(46, 100%, 50%);
        --error: hsl(360, 88%, 56%);

        font-family: "Roboto", sans-serif;
      }

      body {
        background-color: var(--lightblue);
        display: flex;
        align-items: center;
        justify-items: center;
        align-content: center;
        justify-content: center;
        text-align: center;
        height: 100%;
        width: 100%;
      }

      h1,
      h2,
      h3 {
        margin: 0;
      }

      article {
        background-color: var(--light);
        border-radius: 0.75em;
        width: fit-content;
        max-width: 60ch;
        padding: 2em;
        display: grid;
        gap: 1em;
        align-items: center;
        justify-items: center;
        align-content: center;
        justify-content: center;
      }

      a {
        font-size: 0.75em;
      }

      button {
        background-color: var(--info);
        color: var(--light);
        border: none;
        border-radius: 0.75em;
        padding: 1em;
        font-size: 1rem;
        cursor: pointer;
      }
    </style>

    <article>
      <h1>${content.title}</h1>
      <p>${content.subtitle}</p>
      <p>If you don't know what this email is about please ignore or delete it.</p>
      <button
        onclick="window.open('${pathname}?token=${token}', '_blank')"
      >
        ${content.button}
      </button>
      <small>${content.small}</small>
      <a
        href="${pathname}?token=${token}"
      >
        ${pathname}?token=${[...Array(3).keys()]
    .map((index) => {
      let fraction;

      switch (index) {
        case 0:
          fraction = token.substring(index, Math.round(token.length / 3));
          break;

        case 1:
          fraction = token.substring(
            Math.round(token.length / 3),
            Math.round(token.length / 3) * 2
          );
          break;

        case 2:
          fraction = token.substring(Math.round(token.length / 3) * 2);
          break;

        default:
          break;
      }

      return "<br><span>" + fraction + "</span>";
    })
    .join("")}
      </a>
    </article>
  </body>
</html>
`;

module.exports = genericEmailTemplate;
