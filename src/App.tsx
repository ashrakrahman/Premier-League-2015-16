import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import NavBar from "./component/Nav";

const footerStyle = {
  position: "absolute",
  backgroundColor: "#f5f5f5",
  fontSize: "20px",
  color: "white",
  borderTop: "1px solid #E7E7E7",
  textAlign: "center",
  padding: "15px",
  left: "0",
  bottom: "0",
  height: "100%",
  width: "100%",
  textColor: "black"
} as React.CSSProperties;

const baseStyle = {
  position: "fixed",
  left: "0",
  bottom: "0",
  width: "100%",
  height: "45px"
} as React.CSSProperties;

class App extends React.Component<{}, {}> {
  render() {
    return (
      <div className={"root"} key="1">
        <NavBar />
        <div style={baseStyle} className="footer">
          <div style={footerStyle}>
            <p style={{ color: "grey", fontSize: "12px" }}>
              © 2020 Copyright : Premier League 2015-16
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
