import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
html, body {
    width: 700px;
    height: 100%;
    min-height: 400px;
}

.rs-picker-menu {
    top: calc(50% - 183px + 20px) !important;
    left: calc(50% - 264px) !important;
}

#root {
    width: 100%;
    height: 100%;
}
`;
