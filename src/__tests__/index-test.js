const babel = require("babel-core");
const plugin = require("../");

var example = `
import React, {Component} from 'react'; 
export default class MyComp extends Component {
  render() {
    return <View></View>;
  } 
}`;

describe("when react preset", () => {
  it("should transform with console.log", () => {
    const { code } = babel.transform(example, {
      presets: ["react"],
      plugins: [plugin]
    });
    expect(code).toMatchSnapshot();
  });
});

describe("when react-native preset", () => {
  it("should transform with console.log", () => {
    const { code } = babel.transform(example, {
      presets: ["react-native"],
      plugins: [plugin]
    });
    expect(code).toMatchSnapshot();
  });
});
