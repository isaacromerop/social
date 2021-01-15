import React from "react";
import { Dimmer, Loader, Container } from "semantic-ui-react";

const Loading = () => {
  return (
    <Container>
      <Dimmer active inline="centered">
        <Loader size="massive">Loading...</Loader>
      </Dimmer>
    </Container>
  );
};

export default Loading;
