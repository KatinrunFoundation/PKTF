import React from "react";
import styled from "styled-components";
import { Color } from "./Color";

export const Highlight = styled.span`
  color: ${Color.green};
  ${p => p.large && "font-size: 1.20em;"}
  ${p => p.bold && "font-weight: bold;"}
  ${p => p.underline && "text-decoration: underline;"}
`;
