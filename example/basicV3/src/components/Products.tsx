import React from "react";


export default function Products({ routeMatch }: any) {

  if (routeMatch && routeMatch.data) {
    // @ts-ignore
    return <p>Product. Type: {routeMatch.data.type}</p>;
  }
  return null;
}
