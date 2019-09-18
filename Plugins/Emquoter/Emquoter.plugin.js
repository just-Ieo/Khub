//META{"name":"Emquoter","displayName":"Emquoter","website":"https://khub.kyza.gq/?plugin=Emquoter","source":"https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Plugins/Emquoter/Emquoter.plugin.js"}*//

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

String.prototype.replaceAll = function(find, replace) {
  var str = this;
  return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
};

var Emquoter = (() => {
  const config = {
    "info": {
      "name": "Emquoter",
      "authors": [{
        "name": "Kyza",
        "discord_id": "220584715265114113",
        "github_username": "KyzaGitHub"
      }],
      "version": "0.0.8",
      "description": "Every wanted to quote other people's messages using embeds, but without the risk of being banned?",
      "github": "https://github.com/KyzaGitHub/Khub/tree/master/Plugins/Emquoter",
      "github_raw": "https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Plugins/Emquoter/Emquoter.plugin.js"
    },
    "changelog": [
      {
        "title": "New Stuff",
        "items": ["Added most of the support for markdown in quotes.", "Made sure the jump link was removed from error quotes."]
      }
      // ,
      // {
      //   "title": "Bugs Squashed",
      //   "type": "fixed",
      //   "items": ["Quotes should now display correctly."]
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
    // ,
    // "defaultConfig": [{
    //   "type": "category",
    //   "id": "timeAppearance",
    //   "name": "Time Appearance",
    //   "collapsible": true,
    //   "shown": true,
    //   "settings": [{
    //     "type": "switch",
    //     "id": "localizeTimes",
    //     "name": "Localize Times",
    //     "note": "Whether or not to localize times.",
    //     "value": true
    //   }, {
    //     "type": "switch",
    //     "id": "creationTimes",
    //     "name": "Creation Times",
    //     "note": "Whether or not message creation times should be displayed.",
    //     "value": true
    //   }, {
    //     "type": "switch",
    //     "id": "editedTimes",
    //     "name": "Edited Times",
    //     "note": "Whether or not message edit times should be displayed.",
    //     "value": true
    //   }]
    // }, {
    //   "type": "category",
    //   "id": "guildAppearance",
    //   "name": "Guild Appearance",
    //   "collapsible": true,
    //   "shown": false,
    //   "settings": [{
    //     "type": "switch",
    //     "id": "guildName",
    //     "name": "Guild Name",
    //     "note": "Whether or not the guild the message came from should be displayed.",
    //     "value": true
    //   }, {
    //     "type": "switch",
    //     "id": "channelName",
    //     "name": "Channel Name",
    //     "note": "Whether or not the channel the message came from should be displayed.",
    //     "value": true
    //   }]
    // }, {
    //   "type": "category",
    //   "id": "nameAppearance",
    //   "name": "Name Appearance",
    //   "collapsible": true,
    //   "shown": false,
    //   "settings": [{
    //     "type": "switch",
    //     "id": "tagAppearance",
    //     "name": "User Tag",
    //     "note": "Whether or not the tag of the user that sent the message should be displayed.",
    //     "value": true
    //   }, {
    //     "type": "switch",
    //     "id": "userIDAppearance",
    //     "name": "User ID",
    //     "note": "Whether or not the ID of the user that sent the message should be displayed.",
    //     "value": true
    //   }]
    // }, {
    //   "type": "category",
    //   "id": "linkAppearance",
    //   "name": "Link Appearance",
    //   "collapsible": true,
    //   "shown": false,
    //   "settings": [{
    //     "type": "switch",
    //     "id": "embedLinkAppearance",
    //     "name": "Embed Link",
    //     "note": "Whether or not the embed link should be displayed.",
    //     "value": false
    //   }, {
    //     "type": "switch",
    //     "id": "messageLinkAppearance",
    //     "name": "Message Link",
    //     "note": "Whether or not the message jump link should be prettified.",
    //     "value": true
    //   }]
    // }]
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
          }
        }, props));
      });
    }
    start() {}
    stop() {}
  } : (([Plugin, Api]) => {
    const plugin = (Plugin, Api) => {
      const {
        Toasts,
        DiscordSelectors,
        DiscordClasses,
        PluginUpdater,
        DiscordModules,
        WebpackModules,
        Tooltip,
        Modals,
        ReactTools,
        ReactComponents,
        ContextMenu,
        Patcher,
        Settings,
        PluginUtilities,
        DiscordAPI,
        DOMTools,
        DiscordClassModules
      } = Api;

      const {
        MessageActions,
        Dispatcher,
        DiscordPermissions,
        ChannelStore,
				SimpleMarkdown
      } = DiscordModules;

      var updateInterval;
      var removeInterval;

      const selectors = {
        "buttonList": new DOMTools.Selector(WebpackModules.getByProps('buttonContainer', 'clickOverride').buttonContainer).value.trim(),
        "button": new DOMTools.Selector(WebpackModules.getByProps('button', 'container').button).value.trim(),
        "messagePanel": new DOMTools.Selector(WebpackModules.getByProps('messages', 'messagesWrapper').messages).value.trim(),
        "messageContainer": new DOMTools.Selector(WebpackModules.getByProps('containerCozyBounded', 'containerCozy').containerCozyBounded).value.trim() + `:not([class*="isLocalBot"])`,
        "messages": new DOMTools.Selector(WebpackModules.getByProps('containerCozyBounded', 'containerCozy').containerCozyBounded).value.trim() + `:not([class*="isLocalBot"]):not(:empty) > div`,
        "chat": new DOMTools.Selector(WebpackModules.getByProps('chat').chat).value.trim(),
        "loadingMore": new DOMTools.Selector(WebpackModules.getByProps('loadingMore').loadingMore).value.trim(),
        "embeds": new DOMTools.Selector(WebpackModules.getByProps('embedContent').embedContent).value.trim()
      };

      const css = `
.theme-light .emquoter-image {
	filter: invert(30%);
	margin-top: 2px;
	width: 14px;
	height: 14px;
	background-color: var(--interactive-normal);
	cursor: pointer;
	-webkit-mask-image: url('https://image.flaticon.com/icons/svg/565/565703.svg');
	mask-image: url('https://image.flaticon.com/icons/svg/565/565703.svg');
}
.theme-dark .emquoter-image {
	filter: invert(70%);
	margin-top: 2px;
	width: 14px;
	height: 14px;
	background-color: var(--interactive-normal);
	cursor: pointer;
	-webkit-mask-image: url('https://image.flaticon.com/icons/svg/565/565703.svg');
	mask-image: url('https://image.flaticon.com/icons/svg/565/565703.svg');
}

[message-id] {
	transition-duration: 0.5s;
}
.theme-light .emquoter-highlighted {
	background-color: rgba(0, 0, 0, 0.2);
}
.theme-dark .emquoter-highlighted {
	background-color: rgba(255, 255, 255, 0.2);
}

[message-id] .emquoter-embed:not(:last-of-type) {
	margin-bottom: 4px;
}
[message-id] .emquoter-embed {
	margin-bottom: 4px;
}
			`;

      var quotes = [];

      var cachedMessages = [];

      var sendingQuotes = false;

      return class Emquoter extends Plugin {

        onStart() {
          BdApi.injectCSS("emquoter-css", css);

          updateInterval = setInterval(() => {
            PluginUpdater.checkForUpdate("emquoter", this.getVersion(), "https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Plugins/emquoter/emquoter.plugin.js");
          }, 5000);


          removeInterval = setInterval(() => {
            this.removeEmbeds();
          }, 100);

          this.addButtons();
          this.addMessageIDs();
          this.highlightMessages();
          this.updateQuoteAppearances();

          this.patch();
        }

        onStop() {
          BdApi.clearCSS("emquoter-css");
          this.unpatch();
          this.removeIntervals();
          this.removeButtons();
          this.clearQuotes();
        }

        removeIntervals() {
          clearInterval(updateInterval);
          clearInterval(removeInterval);
        }

        onSwitch() {
          this.updateQuoteAppearances();
        }

        getSettingsPanel() {
          const panel = this.buildSettingsPanel();
          panel.addListener((group, id, value) => {
            console.table(this.settings);
            this.updateQuoteAppearances();
          });
          return panel.getElement();
        }

        patch() {
          Patcher.before(MessageActions, "_sendMessage", (thisObject, methodArguments, returnValue) => {
            if (!sendingQuotes) {
              if (quotes.length > 0) {
                if (DiscordAPI.currentChannel.type == "DM") {
                  this.sendEmbedQuotes(methodArguments[1].content);
                } else {
                  if (DiscordAPI.currentChannel.checkPermissions(DiscordPermissions.EMBED_LINKS)) {
                    this.sendEmbedQuotes(methodArguments[1].content);
                  } else {
                    this.sendTextQuotes(methodArguments[1].content);
                  }
                }
                methodArguments[1].content = "";
                return false;
              }
              return false;
            } else {
              return false;
            }
          });
          Patcher.after(Dispatcher, "dirtyDispatch", (thisObject, methodArguments) => {
            const event = methodArguments[0];
            if (!event || !event.type || !DiscordAPI.currentChannel) return;

            // Subscribe to all the events needed.
            // These events will be used to add the quote buttons to the DOM.
            if (event.type == "CHANNEL_SELECT" || event.type == "LOAD_MESSAGES_SUCCESS_CACHED" || (event.type.indexOf("MESSAGE") > -1 && event.channelId == DiscordAPI.currentChannel.id) || event.type == "UPDATE_CHANNEL_DIMENSIONS") {
              // Don't throttle the DOM updates.
              setTimeout(() => {
                this.addButtons();
                this.addMessageIDs();
                this.highlightMessages();
                this.updateQuoteAppearances();
              }, 0);
            }
          });
        }

        unpatch() {
          Patcher.unpatchAll();
        }

        updateQuoteAppearances(refresh) {
          if (refresh) {
            DiscordAPI.currentChannel.updateChannel();
          }

          let messages = document.querySelectorAll(selectors.messages);
          for (let i = 0; i < messages.length; i++) {
            let messageLinks = messages[i].querySelectorAll("a");

            for (let j = 0; j < messageLinks.length; j++) {
              let messageLinkHTML = messageLinks[j].innerHTML;

              let embedLinkRegex = /^https:\/\/discord-embed-api.herokuapp.com\/embed\/(?:(\d{20}|\w{20}))$/g;
              let embedLinks = messageLinkHTML.match(embedLinkRegex);

              if (embedLinks) {
                // Will never loop more than once, but better to be safe than sorry.
                for (var k = 0; k < embedLinks.length; k++) {
                  messageLinks[j].innerHTML = "";
                  // Remove the embed quote, the jump links will take care of it.
                  messages[i].setAttribute("emquoter-remove-embeds", "");
                  this.removeEmbeds();
                }
              }

              // any character that is not a word character or whitespace
              let jumpLinkRegex = /^https:\/\/discordapp.com\/channels\/(?:(?:\d+)|@me)\/(?:\d+)\/(?:\d+)$/g;
              let jumpLinks = messageLinkHTML.match(jumpLinkRegex);

              if (jumpLinks) {
                // Will never loop more than once, but better to be safe than sorry.
                for (let k = 0; k < jumpLinks.length; k++) {
                  messageLinks[j].innerHTML = "Click To Jump";
                  if (messageLinks[j].nextSibling) {
                    messageLinks[j].nextSibling.textContent = messageLinks[j].nextSibling.textContent.trim();
                  }

                  let channelID = jumpLinks[k].split("/")[jumpLinks[k].split("/").length - 2];
                  let messageID = jumpLinks[k].split("/")[jumpLinks[k].split("/").length - 1];

                  if (jumpLinks.length > 5) {
                    // Use a slight timeout so it doesn't get ratelimited.
                    setTimeout(() => {
                      this.addArtificialQuote(messageLinks[j], channelID, messageID);
                    }, k * 350);
                  } else {
                    // Go fast, there aren't enough to be ratelimited for.
                    this.addArtificialQuote(messageLinks[j], channelID, messageID);
                  }
                }
              }
            }
          }
        }

        removeEmbeds() {
          var embedMessages = document.querySelectorAll("[emquoter-remove-embeds]");
          for (let i = 0; i < embedMessages.length; i++) {
            var embedMessage = embedMessages[i];
            var embeds = embedMessage.querySelectorAll(`[class*="embedWrapper"]:not(.emquoter-embed)`);

            for (let j = 0; j < embeds.length; j++) {
              if (embeds[j].querySelector(`a[href*="https://discord-embed-api.herokuapp.com/embed/"]`)) {
                embeds[j].remove();
                embedMessage.removeAttribute("emquoter-remove-embeds");
              }
            }
          }
        }

        addArtificialQuote(messageLink, channelID, messageID) {
          var messageObject;
          try {
            var channelObject = DiscordAPI.Channel.fromId(channelID);
            messageObject = channelObject.messages.find(function(messageObject) {
              return messageObject.id == messageID;
            });
          } catch (e) {}

          if (!messageObject) {
            let messageObject = cachedMessages.find((message) => {
              return message.channel_id == channelID && message.id == messageID;
            });
            if (messageObject) {
              console.log("Using manually cached messages.");
              this.buildQuoteEmbed(messageLink, messageLink, messageObject);
            } else {
              DiscordModules.APIModule.get({
                url: DiscordModules.DiscordConstants.Endpoints.MESSAGES(channelID),
                query: {
                  before: null,
                  after: null,
                  limit: 100,
                  around: messageID
                }
              }).then(res => {
                console.log("Using requested messages.");

                if (res.status != 200) return;
                let messageObject = res.body.find((message) => {
                  return message.channel_id == channelID && message.id == messageID;
                });

                for (let i = 0; i < res.body.length; i++) {
                  cachedMessages.push(res.body[i]);
                }

                this.buildQuoteEmbed(messageLink, messageObject);
              }).catch(res => {
                console.log("Using requested messages.");

                if (res.status != 403) return;

                this.buildQuoteEmbed(messageLink, messageObject);
              });
            }
          } else {
            console.log("Using Discord cached messages.");
            this.buildQuoteEmbed(messageLink, messageObject);
          }
        }

        buildQuoteEmbed(messageLink, messageObject) {
          try {
            messageObject.channel = DiscordAPI.Channel.fromId(messageObject.channel_id);
          } catch (e) {}
          try {
            messageObject.guild = messageObject.channel.guild;
          } catch (e) {}
          try {
            messageObject.author = DiscordAPI.User.fromId(messageObject.author.id);
          } catch (e) {}

          // Everything that has an embed pill in it.
          var embed = WebpackModules.getByProps('embedPill');

          var wrapper = document.createElement("div");
          wrapper.className = `${embed.embed} ${embed.embedMargin} emquoter-embed`;
          // messageLink.remove();
          // wrapper.insertAfter(messageLink.parentNode.parentNode);
          messageLink.parentNode.insertBefore(wrapper, messageLink.nextSibling);
          if (!messageLink.parentNode.parentNode.querySelector(`a[href*="https://discord-embed-api.herokuapp.com/embed/"]`)) {
            // messageLink.parentNode.parentNode.remove();
          }

          var pill = document.createElement("div");
          pill.className = embed.embedPill;
          wrapper.appendChild(pill);

          var inner = document.createElement("div");
          inner.className = embed.embedInner;
          wrapper.appendChild(inner);

          var content = document.createElement("div");
          content.className = embed.embedContent;
          inner.appendChild(content);

          var contentInner = document.createElement("div");
          contentInner.className = embed.embedContentInner;
          content.appendChild(contentInner);

          var providerIcon = document.createElement("img");
          providerIcon.style = "margin-right: 5px; width: 16px; height: 16px; transform: translateY(3px); border-radius: 100%;";
          if (messageObject) {
            contentInner.appendChild(providerIcon);
            console.log(messageObject);
            if (messageObject.guild) {
              if (messageObject.guild.icon) {
                var tried = false;
                providerIcon.src = `https://cdn.discordapp.com/icons/${messageObject.guild.id}/${messageObject.guild.icon}.gif?size=128`;
                providerIcon.onerror = () => {
                  if (!tried) {
                    providerIcon.src = `https://cdn.discordapp.com/icons/${messageObject.guild.id}/${messageObject.guild.icon}.png?size=128`;
                    tried = true;
                  }
                };
              } else if (messageObject.channel) {
                if (messageObject.channel.recipient) {
                  providerIcon.src = messageObject.channel.recipient.avatarUrl;
                } else {
                  providerIcon.remove();
                }
              } else {
                providerIcon.remove();
              }
            } else if (messageObject.channel) {
              if (messageObject.channel.recipient) {
                providerIcon.src = messageObject.channel.recipient.avatarUrl;
              } else {
                providerIcon.remove();
              }
            } else {
              providerIcon.remove();
            }
          }

          var providerName = document.createElement("div");
          providerName.className = embed.embedProvider;
          contentInner.appendChild(providerName);

          var authorWrapper = document.createElement("div");
          authorWrapper.className = `${embed.embedAuthor} ${embed.embedMargin}`;
          contentInner.appendChild(authorWrapper);

          var authorIcon = document.createElement("img");
          authorIcon.style = "margin-right: 5px; width: 16px; height: 16px; border-radius: 100%;";
          if (messageObject) {
            authorIcon.src = `${messageObject.author.avatarUrl}`;
            authorIcon.onerror = () => {
              authorIcon.remove();
            };
            authorWrapper.appendChild(authorIcon);
          }

          var authorName = document.createElement("div");
          authorName.className = `${embed.embedAuthorName}`;
          authorWrapper.appendChild(authorName);

          var description = document.createElement("div");
          description.className = `${embed.embedDescription} ${embed.embedMargin}`;
          contentInner.appendChild(description);

          if (messageObject) {
            var footer = document.createElement("div");
            footer.className = `${embed.embedFooter} ${embed.embedMargin}`;
            contentInner.appendChild(footer);

            footer.appendChild(messageLink);
            messageLink.style = "text-align: center; width: 100%;";
          }

          var image = document.createElement("a");
          image.className = embed.embedThumbnail;
          content.appendChild(image);

          var imageInner = document.createElement("img");
          imageInner.style = "width: 80px; height: 80px;";
          image.appendChild(imageInner);

          if (messageObject) {
            providerName.innerHTML = `${new Date(messageObject.timestamp.toString()).toLocaleDateString()} ${new Date(messageObject.timestamp.toString()).toLocaleTimeString()}`;
            authorName.innerHTML = `@${messageObject.author.tag}`;

            // console.log(this.parseMarkdown(messageObject.content));
            description.innerHTML = `${this.parseMarkdown(messageObject.content)}`;

            imageInner.src = `${messageObject.author.avatarUrl}`;
          } else {
            providerName.remove();
            authorWrapper.remove();
            description.innerHTML = `Unable to fetch the message.\nYou don't have permission to view it.`;
            image.remove();
						messageLink.remove();
          }
          this.removeEmbeds();
        }

        escapeHtml(unsafe) {
          return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
        }

        parseMarkdown(content) {
					console.log(DiscordModules.SimpleMarkdown);
          return DiscordModules.SimpleMarkdown.markdownToHtml(content, false);
        }

        clearQuotes() {
          quotes = [];
          this.highlightMessages();
        }

        addMessageIDs() {
          var channel = DiscordAPI.currentChannel;

          var nodes = Array.prototype.slice.call(document.querySelectorAll(selectors.messages));

          for (let i = 0; i < nodes.length; i++) {
            nodes[i].setAttribute("message-id", channel.messages[i].id);
          }
        }

        createButton() {
          let button = document.createElement("div");
          button.setAttribute("class", "emquoter-button");
          button.setAttribute("aria-label", "emquoter");
          button.setAttribute("role", "Button");

          let buttonImage = document.createElement("img");
          buttonImage.setAttribute("class", "emquoter-image");
          buttonImage.setAttribute("src", "https://image.flaticon.com/icons/svg/565/565703.svg");

          button.appendChild(buttonImage);

          return button;
        }

        highlightMessages() {
          var channel = DiscordAPI.currentChannel;

          for (let i = 0; i < channel.messages.length; i++) {
            document.querySelector(`[message-id="${channel.messages[i].id}"]`).className = document.querySelector(`[message-id="${channel.messages[i].id}"]`).className.replace(" emquoter-highlighted", "");
          }

          for (let i = 0; i < quotes.length; i++) {
            // We are only trying here because the message might not be in the current channel.
            try {
              document.querySelector(`[message-id="${quotes[i].message.id}"]`).className = document.querySelector(`[message-id="${quotes[i].message.id}"]`).className + " emquoter-highlighted";
            } catch (e) {}
          }
        }

        addButtons() {
          // console.log(WebpackModules.getAllModules());
          // var scrollerSelector = ;
          // var messages = ReactTools.getOwnerInstance(document.querySelector(scrollerSelector));
          // console.log(messages);


          var buttonLists = document.querySelectorAll(selectors.messages + " " + selectors.buttonList);
          for (let i = 0; i < buttonLists.length; i++) {
            let button = this.createButton();

            button.onclick = () => {
              var channel = DiscordAPI.currentChannel;

              var nodes = Array.prototype.slice.call(document.querySelectorAll(selectors.messages));

              var messageElement = button;
              while (!messageElement.getAttribute("message-id")) {
                if (!messageElement) break;
                messageElement = messageElement.parentNode;
              }

              var currentMessage = null;
              for (let i = 0; i < channel.messages.length; i++) {
                if (channel.messages[i].id == messageElement.getAttribute("message-id")) {
                  currentMessage = channel.messages[i];
                }
              }

              var quoteObject = {
                "message": currentMessage
              };

              if (quotes.length == 0) {
                quotes.push(quoteObject);
              } else {
                var shouldAdd = true;
                for (let i = 0; i < quotes.length; i++) {
                  if (quotes[i].message.id == quoteObject.message.id) {
                    quotes.splice(i, 1);
                    shouldAdd = false;
                    break;
                  }
                }
              }
              if (quotes.length >= 5) {
                console.log("Too many quotes!");
                shouldAdd = false;
              }
              if (shouldAdd) {
                quotes.push(quoteObject);
              }
              this.highlightMessages();

              // this.sendQuote(channel, hoveredMessage);
            };

            if (buttonLists[i].innerHTML.indexOf("emquoter-button") < 0) {
              buttonLists[i].insertBefore(button, buttonLists[i].childNodes[0]);
            }
          }
        }

        removeButtons() {
          var buttons = document.querySelectorAll(".emquoter-button");
          for (let i = 0; i < buttons.length; i++) {
            buttons[i].remove();
          }
        }

        sendTextQuotes(userMessage) {
          var channel = DiscordAPI.currentChannel;
          channel.sendBotMessage("Your message hasn't been sent. You do not have permission to embed links, and the backup quote system has not been created yet.\n\nHere's your message back:\n" + userMessage);
        }

        sendEmbedQuotes(userMessage) {
          sendingQuotes = true;

          let fullMessage = userMessage + "\n";

          let quoteAmount = quotes.length;
          let finishedMessages = 0;
          let messageWaitTimeout = setTimeout(() => {
            if (finishedMessages >= quoteAmount) {
              clearTimeout(messageWaitTimeout);

              this.clearQuotes();

              sendingQuotes = false;

              var channel = DiscordAPI.currentChannel;
              if (fullMessage.trim().length > 2000) {
                console.log(`The message is too long.\n${fullMessage.trim().length} of 2000 characters used.`);
                Toasts.show(`The message is too long.\n${fullMessage.trim().length} of 2000 characters used.`, {
                  type: "error",
                  icon: "https://image.flaticon.com/icons/svg/565/565703.svg",
                  timeout: 3000
                });
              } else {
                channel.sendMessage(fullMessage.trim(), false);
              }
            }
            console.log(`Waiting to send the message...\n${finishedMessages} of ${quoteAmount} completed.`);
          }, 1000);

          for (let i = 0; i < quotes.length; i++) {
            let message = quotes[i].message;
            // Convert pings to readable stuff.
            var finalMessage = message.content;
            // for () {
            //
            // }

            const obj = {};

            // `Created:\n   ${message.timestamp.toString()}${message.edited ? "\nEdited:\n   " + message.editedTimestamp.toString() : ""}` +
            // `\n${message.guild ? "Guild" : "Direct Message"}:\n   ${message.guild ? message.guild.name + "\n   " : ""}${message.channel.name.trim() != "" ? "#" + message.channel.name : "@" + message.channel.recipient.tag + "\n   <@" + message.author.id + ">"}`;

            obj.providerName = message.timestamp.toString();
            obj.providerUrl = ""; // The link on the Provider Name.
            obj.authorName = `@${message.author.tag}`;
            obj.authorUrl = ""; // The link on the Author Name.
            obj.title = "";
            obj.description = finalMessage;
            obj.banner = false; // Photo is a banner, nothing is a small image on the right.
            obj.image = message.author.avatarUrl; // The image displayed on the right.
            obj.color = "#000000"; // The color on the left of the embed.

            var request = require("request");

            console.log("Generating link embed quote...");
            Toasts.show("Generating link embed quote...", {
              type: "info",
              icon: "https://image.flaticon.com/icons/svg/565/565703.svg",
              timeout: 3000
            });

            request({
              url: "https://discord-embed-api.herokuapp.com/create/",
              method: "POST",
              json: obj
            }, (err, res, body) => {
              if (err) {
                console.log("Failed to generate link embed quote.");
                Toasts.show("Failed to generate link embed quote.", {
                  type: "error",
                  icon: "https://image.flaticon.com/icons/svg/565/565703.svg",
                  timeout: 3000
                });
                console.error(err);
                quoteAmount--;
                return;
              }
              console.log("Link embed quote generated.");
              Toasts.show("Link embed quote generated.", {
                type: "success",
                icon: "https://image.flaticon.com/icons/svg/565/565703.svg",
                timeout: 3000
              });
              fullMessage += `> <https://discordapp.com/channels/${(message.guild ? message.guild.id : "@me")}/${message.channelId}/${message.id}>\n> https://discord-embed-api.herokuapp.com/embed/${body.id}\n\n`;
              finishedMessages++;
            });
          }
        }
      };
    };
    return plugin(Plugin, Api);
  })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
