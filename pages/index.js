import Head from "next/head";
import styles from "../styles/Home.module.css";

import { KeyboardTimePicker } from "@material-ui/pickers";
import { useState, useEffect, useRef } from "react";

import { io } from "socket.io-client";

import { Container, Grid, Divider, Header, Button } from "semantic-ui-react";

// use hooks
const url =
  process.env.NODE_ENV === "production"
    ? "https://sun-lit.herokuapp.com/"
    : `http://localhost:${process.env.PORT}/`;
//const socket = io(url);

export default function Home() {
  const [openTime, handleOpenChange] = useState(new Date());
  const [closeTime, handleCloseChange] = useState(new Date());

  const [disabled, handleDisable] = useState(false);
  var status = "Unknown";

  const socket = useRef();

  useEffect(() => {
    // connects to the same url server is being hosted on
    socket.current = io();

    socket.current.emit("hello", "hi");

    socket.current.on("message", (data) => console.log(data));
    // CLEAN UP THE EFFECT
    return () => socket.current.disconnect();
  }, []);

  return (
    <>
      <Head>
        <title>Sunlit</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.2/semantic.min.css"
        />
      </Head>
      <Container style={{ padding: "1em", margin: "1em" }}>
        <Header as="h3">Status: {status}</Header>
        <Button
          disabled={disabled}
          onClick={() => {
            handleDisable(true);
            socket.current.emit("toggle", "hi");
            setTimeout(() => handleDisable(false), 1000);
          }}
        >
          Open
        </Button>
      </Container>

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

export function getStaticProps(context) {
  return { props: {} };
}
