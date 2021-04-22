import Head from "next/head";
import styles from "../styles/Home.module.css";

import { KeyboardTimePicker } from "@material-ui/pickers";
import { useState } from "react";

import { Container, Grid, Divider, Header, Button } from "semantic-ui-react";

export default function Home() {
  const [openTime, handleOpenChange] = useState(new Date());
  const [closeTime, handleCloseChange] = useState(new Date());

  const [disabled, handleDisable] = useState(false);
  var status = "Unknown";
  return (
    <>
      <Head>
        <title>Sunlit</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header as="h3">Status: {status}</Header>
      <Button
        disabled={disabled}
        onClick={() => {
          handleDisable(true);
          setTimeout(() => handleDisable(false), 1000);
        }}
      >
        Open
      </Button>

      <Container style={{ padding: "1em", margin: "1em" }}>
        <KeyboardTimePicker
          label="Open Time"
          placeholder="08:00 AM"
          mask="__:__ _M"
          value={openTime}
          onChange={(date) => handleOpenChange(date)}
        />

        <KeyboardTimePicker
          label="Close Time"
          placeholder="08:00 PM"
          mask="__:__ _M"
          value={closeTime}
          onChange={(date) => handleCloseChange(date)}
        />
      </Container>
    </>
  );
}
