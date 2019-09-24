/* START: Include ZLibrary */
let libraryScript = document.getElementById("ZLibraryScript");
if (!libraryScript || !window.ZLibrary) {
  if (libraryScript) libraryScript.parentElement.removeChild(libraryScript);
  libraryScript = document.createElement("script");
  libraryScript.setAttribute("type", "text/javascript");
  libraryScript.setAttribute(
    "src",
    "https://rauenzi.github.io/BDPluginLibrary/release/ZLibrary.js"
  );
  libraryScript.setAttribute("id", "ZLibraryScript");
  document.head.appendChild(libraryScript);
}
/* STOP: Include ZLibrary */

/* START: Utility Functions */
String.prototype.replaceAll = function(find, replace) {
  var str = this;
  return str.replace(
    new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"), "g"),
    replace
  );
};
/* STOP: Utility Functions */

/* START: Library */
function KSS() {
  this.selectors = {
    chat: new ZLibrary.DOMTools.Selector(
      ZLibrary.WebpackModules.getByProps("chat").chat
    ),
    channelTextArea: new ZLibrary.DOMTools.Selector(
      ZLibrary.WebpackModules.getByProps("channelTextArea").channelTextArea
    ),
    channelTextAreaInner: new ZLibrary.DOMTools.Selector(
      ZLibrary.WebpackModules.getByProps("channelTextArea").inner
    ),
    titleBar: new ZLibrary.DOMTools.Selector(
      ZLibrary.WebpackModules.getByProps("titleBar").titleBar
    ),
    searchBar: new ZLibrary.DOMTools.Selector(
      ZLibrary.WebpackModules.getByProps("searchBar").searchBar
    ),
    autocomplete: new ZLibrary.DOMTools.Selector(
      ZLibrary.WebpackModules.getByProps("autocomplete").autocomplete
    ),
    autocompleteRow: new ZLibrary.DOMTools.Selector(
      ZLibrary.WebpackModules.getByProps("autocompleteRow").autocompleteRow
    ),
    autocompleteSelectorSelected: new ZLibrary.DOMTools.Selector(
      ZLibrary.WebpackModules.getByProps("autocomplete").selectorSelected
    ),
    channelTitleBar: `.title-3qD0b-`,
    serverTitleBar: `.container-2Rl01u.clickable-2ap7je`,
    emojiPicker: new ZLibrary.DOMTools.Selector(
      ZLibrary.WebpackModules.getByProps("emojiPicker").emojiPicker
    ),
    category: new ZLibrary.DOMTools.Selector(
      ZLibrary.WebpackModules.getByProps("category").category
    ),
    emojiSearchBar: `.inner-3ErfOT`,
    emojiItem: new ZLibrary.DOMTools.Selector(
      ZLibrary.WebpackModules.getByProps("emojiItem").emojiItem
    ),
    emojiItemSelected: new ZLibrary.DOMTools.Selector(
      ZLibrary.WebpackModules.getByProps("emojiItem").selected
    ),
    emojiItemCategories: new ZLibrary.DOMTools.Selector(
      ZLibrary.WebpackModules.getByProps("emojiItem").categories
    ),
    emojiItemItem: new ZLibrary.DOMTools.Selector(
      ZLibrary.WebpackModules.getByProps("emojiItem").item
    )
  };

  this.parse = (kss) => {
    for (let selector in this.selectors) {
      kss = kss.replaceAll(
        `|${selector}|`,
        (this.selectors[selector].value
          ? this.selectors[selector].value
          : this.selectors[selector]
        ).trim()
      );
    }
    return kss;
  };

  this.addSelector = (name, selector) => {
    this.selectors[name] = selector;
  };

  this.removeSelector = (name) => {
    this.selectors[name] = null;
  };

  this.getSelector = (name) => {
    return this.selectors[name];
  };

  this.selectDarkTheme = () => {
    console.log("This function has not been created yet.");
  };

  this.selectLightTheme = () => {
    console.log("This function has not been created yet.");
  };

  this.selectCozyMode = () => {
    console.log("This function has not been created yet.");
  };

  this.selectCompactMode = () => {
    console.log("This function has not been created yet.");
  };
}
/* STOP: Library */

/* START: Test Cases */
// var kiss = new KSS();

// kiss.addSelector("heck", "what");
// kiss.getSelector("heck");
/* STOP: Test Cases */
