//META{"name":"KSSLibrary","displayName":"KSSLibrary","website":"https://khub.kyza.gq/?plugin=KSSLibrary","source":"https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Libraries/KSSLibrary/KSSLibrary.plugin.js"}*//

/*@cc_on
@if (@_jscript)

	// Offer to self-install for clueless users that try to run this directly.
	var shell = WScript.CreateObject("WScript.Shell");
	var fs = new ActiveXObject("Scripting.FileSystemObject");
	var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\BetterDiscord\plugins");
	var pathSelf = WScript.ScriptFullName;
	// Put the user at ease by addressing them in the first person
	shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
	if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
		shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
	} else if (!fs.FolderExists(pathPlugins)) {
		shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
	} else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
		fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
		// Show the user where to put plugins in the future
		shell.Exec("explorer " + pathPlugins);
		shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
	}
	WScript.Quit();

@else@*/



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
function KSSLibrary(plugin) {
  if (!plugin) throw `Pass the plugin instance as an argument.`;
  this.plugin = plugin;

  this.selectors = {
    pluginVersion: this.plugin.getVersion(),
    pluginName: this.plugin.getName(),
    chat: new ZLibrary.DOMTools.Selector(
      ZLibrary.WebpackModules.getByProps("chat").chat
    ),
    chatTitle: new ZLibrary.DOMTools.Selector(
      ZLibrary.WebpackModules.getByProps("chat").title
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
    serverTitle: `.container-2Rl01u.clickable-2ap7je`,
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
    if (!kss) kss = "";
    for (let selector in this.selectors) {
      kss = kss.replaceAll(
        `|${selector}|`,
        (this.selectors[selector].value ?
          this.selectors[selector].value :
          this.selectors[selector]
        ).trim()
      );
    }
    return kss;
  };

  this.addSelector = (name, selector) => {
    if (this.selectors[name]) throw "Selector already exists.";
    this.selectors[name] = selector;
  };

  this.removeSelector = (name) => {
    if (!this.selectors[name]) throw "Selector does not exist.";
    this.selectors[name] = null;
  };

  this.getSelector = (name) => {
    return this.selectors[name];
  };

  this.selectDarkTheme = () => {
    ZLibrary.DiscordModules.UserSettingsUpdater.updateLocalSettings({
      theme: "dark"
    });
  };

  this.selectLightTheme = () => {
    ZLibrary.DiscordModules.UserSettingsUpdater.updateLocalSettings({
      theme: "light"
    });
  };

  this.selectShitTheme = () => {
    ZLibrary.DiscordModules.UserSettingsUpdater.updateLocalSettings({
      theme: "shit"
    });
  };

  this.selectCozyMode = () => {
    ZLibrary.DiscordModules.UserSettingsUpdater.updateLocalSettings({
      displayCompact: false
    });
  };

  this.selectCompactMode = () => {
    ZLibrary.DiscordModules.UserSettingsUpdater.updateLocalSettings({
      displayCompact: true
    });
  };

  this.modules = {};

  this.setModule = (moduleName, kss, enabled = true) => {
    this.modules[moduleName] = {
      enabled: enabled,
      kss: kss
    };
    if (enabled) {
      this.enableModule(moduleName);
    }
  };

  this.getModule = (moduleName) => {
    return this.modules[moduleName];
  };

  this.enableModule = (moduleName) => {
    if (this.modules[moduleName].enabled) {
      BdApi.clearCSS(`${this.plugin.getName()}-${moduleName}`);
    }
    this.modules[moduleName].enabled = true;
    BdApi.injectCSS(`${this.plugin.getName()}-${moduleName}`, this.parse(this.modules[moduleName].kss));
  }

  this.disableModule = (moduleName) => {
    this.modules[moduleName].enabled = false;
    BdApi.clearCSS(`${this.plugin.getName()}-${moduleName}`);
  }

  this.downloadStylesheet = (url) => {
    return new Promise(function(resolve, reject) {
      // Get file name from url.
      var xhr = new XMLHttpRequest();
      // xhr.responseType = 'blob';
      xhr.onload = function() {
        resolve(xhr);
      };
      xhr.onerror = reject;
      xhr.open('GET', url);
      xhr.send();
    }).then(function(xhr) {
      return xhr.response;
    });
  };
}
/* STOP: Library */

window.KSSLibrary = KSSLibrary;

var KSSLibrary = (() => {
  const config = {
    "info": {
      "name": "KSSLibrary",
      "authors": [{
        "name": "Kyza",
        "discord_id": "220584715265114113",
        "github_username": "KyzaGitHub"
      }],
      "version": "0.0.3",
      "description": "Easy CSS for BetterDiscord.",
      "github": "https://github.com/KyzaGitHub/Khub/tree/master/Libraries/KSSLibrary",
      "github_raw": "https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Libraries/KSSLibrary/KSSLibrary.plugin.js"
    },
    "changelog": [
      // {
      //   "title": "New Stuff",
      //   "items": ["Removed the Revenge Ping button."]
      // }
      // ,
      // {
      //   "title": "Bugs Squashed",
      //   "type": "fixed",
      //   "items": ["Fixed more visuals for the ghost button."]
      // }
      // ,
      // {
      //   "title": "Improvements",
      //   "type": "improved",
      //   "items": []
      // },
      // {
      //   "title": "On-going",
      //   "type": "progress",
      //   "items": []
      // }
    ],
    "main": "index.js"
  };

  return !global.ZeresPluginLibrary ? class {
    constructor() {
      this._config = config;
    }
    getName() {
      return config.info.name;
    }
    getAuthor() {
      return config.info.authors.map(a => a.name).join(", ");
    }
    getDescription() {
      return config.info.description;
    }
    getVersion() {
      return config.info.version;
    }
    load() {
      const title = "Library Missing";
      const ModalStack = BdApi.findModuleByProps("push", "update", "pop", "popWithKey");
      const TextElement = BdApi.findModuleByProps("Sizes", "Weights");
      const ConfirmationModal = BdApi.findModule(m => m.defaultProps && m.key && m.key() == "confirm-modal");
      if (!ModalStack || !ConfirmationModal || !TextElement) return BdApi.alert(title, `The library plugin needed for ${config.info.name} is missing.<br /><br /> <a href="https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js" target="_blank">Click here to download the library!</a>`);
      ModalStack.push(function(props) {
        return BdApi.React.createElement(ConfirmationModal, Object.assign({
          header: title,
          children: [TextElement({
            color: TextElement.Colors.PRIMARY,
            children: [`The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`]
          })],
          red: false,
          confirmText: "Download Now",
          cancelText: "Cancel",
          onConfirm: () => {
            require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
              if (error) return require("electron").shell.openExternal("https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");
              await new Promise(r => require("fs").writeFile(require("path").join(ContentManager.pluginsFolder, "0PluginLibrary.plugin.js"), body, r));
            });
          },
          onCancel: () => {
            if (document.querySelector("#KSSLibrary")) {
              document.querySelector("#KSSLibrary").remove();
            }
          }
        }, props));
      });
      ZLibrary.PluginUpdater.checkForUpdate("KSSLibrary", this.getVersion(), "https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Libraries/KSSLibrary/KSSLibrary.plugin.js");
    }
    start() {}
    stop() {}
  } : (([Plugin, Api]) => {
    const plugin = (Plugin, Api) => {
      const {
        Modals
      } = Api;

      return class KSSLibrary extends Plugin {

        onStart() {
          Modals.showAlertModal("You don't need to enable this plugin.", "It has been disabled for you automatically.");
          pluginModule.disablePlugin(this.getName());
        }

        onStop() {}

      };

    };
    return plugin(Plugin, Api);
  })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/