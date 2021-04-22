import "../styles/globals.css";

import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";

function MyApp({ Component, pageProps }) {
  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <Component {...pageProps} />
    </MuiPickersUtilsProvider>
  );
}

export default MyApp;
