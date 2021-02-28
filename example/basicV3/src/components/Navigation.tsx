import React from "react";
import styled from "styled-components";

import { Link as _Link } from "navigo-react";

const Link = styled(_Link)`
  display: inline-block;
  margin-right: 1em;
  color: #fff;
  font-size: 1em;
  cursor: pointer;
  text-decoration: underline;
`;

export default function Navigation() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/about/team">Team</Link>
      <Link to="/products/one">One</Link>
      <Link to="/foobar">No match</Link>
    </nav>
  );
}
