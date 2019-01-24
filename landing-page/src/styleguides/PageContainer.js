import React from "react";
import styled from "styled-components";

const OuterContainer = styled.div`
  background: ${p => p.background};
  width: 100%;
  min-height: 100vh;
`;

const InnerContainer = styled.div`
  width: 100%;
  margin: 0 auto;
  max-width: 1280px;
  padding: 0 40px;
`;

export const PageContainer = ({
  background,
  innerStyle,
  children,
  ...props
}) => (
  <OuterContainer background={background} {...props}>
    <InnerContainer>{children}</InnerContainer>
  </OuterContainer>
);
