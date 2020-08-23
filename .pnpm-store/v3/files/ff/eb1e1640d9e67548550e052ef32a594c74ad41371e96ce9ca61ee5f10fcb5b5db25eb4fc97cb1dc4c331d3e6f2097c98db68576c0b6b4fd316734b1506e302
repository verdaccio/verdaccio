const defaults = {
  borderCharacters: {
    "invisible": [
      {v: " ", l: " ", j: " ", h: " ", r: " "},
      {v: " ", l: " ", j: " ", h: " ", r: " "},
      {v: " ", l: " ", j: " ", h: " ", r: " "}
    ],
    "solid": [
      {v: "│", l: "┌", j: "┬", h: "─", r: "┐"},
      {v: "│", l: "├", j: "┼", h: "─", r: "┤"},
      {v: "│", l: "└", j: "┴", h: "─", r: "┘"}
    ],
    "dashed": [
      {v: "|", l: "+", j: "+", h: "-", r: "+"},
      {v: "|", l: "+", j: "+", h: "-", r: "+"},
      {v: "|", l: "+", j: "+", h: "-", r: "+"}
    ],
    "none": [
      {v: "", l: "", j: "", h: "", r: ""},
      {v: "", l: "", j: "", h: "", r: ""},
      {v: "", l: "", j: "", h: "", r: ""}
    ]
  },
  align: "center",
  borderColor: null,
  borderStyle: "solid",
  color: false,
  compact: false,
  defaultErrorValue: "�",
  // defaultValue: "\u001b[31m?\u001b[39m",
  defaultValue: "[32m[37m[41m ?[49m[32m[39m",
  errorOnNull: false,
  footerAlign: "center",
  footerColor: false,
  formatter: null,
  headerAlign: "center",
  headerColor: "yellow",
  marginLeft: 2,
  marginTop: 1,
  paddingBottom: 0,
  paddingLeft: 1,
  paddingRight: 1,
  paddingTop: 0,
  showHeader: null, // undocumented
  truncate: false,
  width: "auto",
  GUTTER: 1, // undocumented
  columnSettings: [],
  // save so cell options can be merged into column options
  table: {
    body: "",
    columnInnerWidths: [],
    columnWidths: [],
    columns: [],
    footer: "",
    header: "", // post-rendered strings.
    height: 0,
    typeLocked: false // once a table type is selected can't switch
  }
}


// support deprecated border style values
defaults.borderCharacters["0"] = defaults.borderCharacters["none"]
defaults.borderCharacters["1"] = defaults.borderCharacters["solid"]
defaults.borderCharacters["2"] = defaults.borderCharacters["dashed"]


module.exports = defaults
