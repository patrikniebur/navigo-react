import React from "react";
import styled from "styled-components";

import { Router, Route, Switch } from "navigo-react";
import Navigation from "./Navigation";
import About from "./About";
import Products from "./Products";
import Team from "./Team";

type ContainerProps = {
  padding?: string | 0;
  margin?: string | 0;
};

export const Container = styled.div<ContainerProps>`
  padding: ${(props) => ("padding" in props ? props.padding : "0")};
  margin: ${(props) => ("margin" in props ? props.margin : 0)};
`;

export default function App() {
  return (
    <Container padding="1em">
      <Router>
        <Navigation />
        <Switch>
          <Route path="/about/team" component={Team} />
          <Route path="/about" component={About} />
          <Route path="/products/:type" component={Products} />
          <Route path="*" component={Home} />
        </Switch>
        <Route path="/about/team" component={TeamPageFooter} />
      </Router>
    </Container>
  );
}

function Home() {
  return (
    <>
      <br />
      Home
    </>
  );
}

function TeamPageFooter() {
  return (
    <>
      <hr />
      Team page footer
    </>
  );
}
