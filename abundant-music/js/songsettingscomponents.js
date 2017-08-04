var SongSettingsComponent = (function() {

    function changeComponentValue(newValue, createdComps, index, tabsId, changeListener) {
        var oldComp = createdComps[index];
        var oldValue = oldComp.object;
//            logit("Searching for " + oldComp.id);
        $("#" + oldComp.id).remove();

        copyObjectPropertiesDeep(oldValue, newValue);
//            logit("New value " + JSON.stringify(newValue) + " " + oldValue._constructorName);
        var comp = new GuiPropertiesComponent({object: oldValue, propertyInfoProvider: propertyInfoProvider});
        createdComps[index] = comp;
        var contentArr = [];
        comp.createJQueryStrings(contentArr);

        var $theTab = $("#" + tabsId + index);
        $theTab.append($(contentArr.join("")));
        var $tabs = $("#" + tabsId);
        comp.jQueryCreated($tabs);

        // Code duplication below...
        addChangeListener(index, createdComps, changeListener);
        oldValue.dirty = true;
        settingsDirty = true;
        if (changeListener) {
            changeListener(comp, oldValue, oldValue);
        }

        comp.$component.detach();

        $("#topdiv").append(comp.$component);
        comp.alignComponents();

        comp.$component.detach();
        $theTab.append(comp.$component);

        addSideButtons(comp, index);
    }

    function addChangeListener(index, createdComps, changeListener) {
        var comp = createdComps[index];
        var oldValue = comp.object;
        comp.changeListeners.push(function() {
            oldValue.dirty = true;
        });
        if (changeListener) {
            comp.changeListeners.push(changeListener);
        }
    }


    function compIsSeed(c) {
        var propInfo = c.propertyInfo;
        return stringEndsWith(propInfo.propertyName.toLowerCase(), "seed");
    }

    function compIsControlEtc(c) {
        var propInfo = c.propertyInfo;
        var test = propInfo.propertyName.toLowerCase();

        var result =
            stringEndsWith(test, "volumemultipliers") ||
                stringEndsWith(test, "volumemultiplier") ||
                stringEndsWith(test, "reverbsends") ||
                stringEndsWith(test, "reverbsend") ||
                stringEndsWith(test, "chorussends") ||
                stringEndsWith(test, "chorussend");
        return result;
    }

    function compIsLikelihoodOrProbEtc(c) {
        var propInfo = c.propertyInfo;
        var test = propInfo.propertyName.toLowerCase();

        var result =
            stringEndsWith(test, "renderamountoverride") ||
                stringEndsWith(test, "probsoverride") ||
                stringEndsWith(test, "likelihood") ||
                stringEndsWith(test, "likelihoods") ||
                stringEndsWith(test, "likelihoodmultiplier") ||
                stringEndsWith(test, "likelihoodmultipliers") ||
                stringEndsWith(test, "probmultipliers") ||
                stringEndsWith(test, "fraction") ||
                stringEndsWith(test, "probability") ||
                stringEndsWith(test, "probabilities");
        return result;
    }


    function zeroInput(comp) {
        comp.$input.val("0");
        comp.setValueVerifyRaw();
    }

    function oneInput(comp) {
        comp.$input.val("1");
        comp.setValueVerifyRaw();
    }

    function clearSeed(comp) {
        comp.$input.val("");
        comp.setValueVerifyRaw();
    }
    function randomizeSeed(comp) {
        var seed = globalRnd.genrand_int32();
        comp.$input.val("" + seed);
        comp.setValueVerifyRaw();
    }
    function explicitizeSeed(comp) {
        var mainSeed = getMainSeed();
        var rnd = new MersenneTwister(mainSeed);
        var createModuleSeed = rnd.genrand_int31();
        var genInfoRnd = new MersenneTwister(createModuleSeed);
        globalGenInfo.randomize(genInfoRnd);
        var propInfo = comp.propertyInfo;

        var explicitSeed = globalGenInfo[propInfo.propertyName];

        if (explicitSeed) {
            comp.$input.val("" + explicitSeed);
            comp.setValueVerifyRaw();
        }
    }

    function getAllChildrenWithTest(index, createdComps, test) {
        var result = [];
        var comp = createdComps[index];
        for (var j=0; j<comp.children.length; j++) {
            var child = comp.children[j];
            if (test(child)) {
                result.push(child);
            }
        }
        return result;
    }

    function getAllSeedChildren(index, createdComps) {
        return getAllChildrenWithTest(index, createdComps, compIsSeed)
    }
    function getAllLikelihoodChildren(index, createdComps) {
        return getAllChildrenWithTest(index, createdComps, compIsLikelihoodOrProbEtc);
    }


    function addSideButtons(comp, index) {

        function addSeedButtonsEventHandlers(child, $clearButton, $randomizeButton, $explicitButton) {
            var propInfo = child.propertyInfo;
            $clearButton.click(function() {
                clearSeed(child);
            });
            $randomizeButton.click(function() {
                randomizeSeed(child);
            });
            if ($explicitButton) {
                $explicitButton.click(function() {
                    explicitizeSeed(child);
                });
            }
        }

        function addLikelihoodButtonsEventHandlers(child, $zeroButton, $oneButton) {
            $zeroButton.click(function() {
                zeroInput(child);
            });
            $oneButton.click(function() {
                oneInput(child);
            });
        }

        function addButtonValueEventHandler(child, $button, value) {
            $button.click(function() {
                child.$input.val("" + value);
                child.setValueVerifyRaw();
            });
        }

        for (var i=0; i<comp.children.length; i++) {
            var child = comp.children[i];

//            var test = stringEndsWith(child.propertyInfo.propertyName.toLowerCase(), "likelihoods");
//            if (test) {
//                logit(child.propertyInfo.propertyName + " was seed or etc" + test);
//            }


            if (compIsLikelihoodOrProbEtc(child)) {
                var propInfo = child.propertyInfo;

                var $zeroButton = $("<button style=\"height: 3em; font-size: 60%\" title=\"Set to zero\" class=\"zero-likelihood-button\">0</button>");
                var $oneButton = $("<button style=\"height: 3em; font-size: 60%\" title=\"Set to one\" class=\"one-likelihood-button\">1</button>");
                child.$component.append($zeroButton);
                child.$component.append($oneButton);

                $zeroButton.button();
                $oneButton.button();

                addLikelihoodButtonsEventHandlers(child, $zeroButton, $oneButton);
            }

            if (compIsControlEtc(child)) {
                var propInfo = child.propertyInfo;

                var divisions = 100;
                var strValue = child.$input.val();
                var value = parseFloat(strValue);
                if (isNaN(value)) {

                } else {

                    var $ctrlSlider = $("<div style=\"width: 10em; margin-right: 1em; height: 1em; display: inline-block; font-size: 60%\"  class=\"ctrl-slider\"></div>");
                    child.$component.append($ctrlSlider);

                    function refreshCtrl(toRefresh, $slider) {
                        return function() {
                            var value = clamp((1 / divisions) * $slider.slider("value"), 0, 1);
                            toRefresh.$input.val("" + value);
                            toRefresh.setValueVerifyRaw();
                        };
                    }

                    $ctrlSlider.slider({
                        min: 0,
                        max: divisions,
                        value: clamp(Math.round(value * divisions), 0, divisions),
                        slide: refreshCtrl(child, $ctrlSlider),
                        change: refreshCtrl(child, $ctrlSlider)
                    });

                    var values = [0, 1];
                    for (var j=0; j<values.length; j++) {
                        var value = values[j];
                        var $valueButton = $("<button style=\"height: 3em; font-size: 60%\" title=\"Set to zero\" class=\"zero-ctrl-button\">" + value + "</button>");
                        child.$component.append($valueButton);
                        $valueButton.button();

                        $valueButton.click(
                            (function() {
                                var $slider = $ctrlSlider;
                                var v = value;
                                return function() {
                                    $slider.slider("option", "value", clamp(v * divisions, 0, divisions));
                                }
                            })()
                        );
                    }

                }

            }


            if (compIsSeed(child)) {
                var propInfo = child.propertyInfo;

                var $clearButton = $("<button style=\"height: 3em; font-size: 60%\" title=\"Clear seed\" class=\"clear-seed-button\">C</button>");
                var $randomizeButton = $("<button style=\"height: 3em; font-size: 60%\" title=\"Randomize seed\" class=\"randomizer-seed-button\">R</button>");
                child.$component.append($clearButton);
                child.$component.append($randomizeButton);

                $clearButton.button();
                $randomizeButton.button();
                var $explicitButton = null;

                if (globalGenInfo[propInfo.propertyName]) {
                    var $explicitButton = $("<button style=\"height: 3em; font-size: 60%\" title=\"Explicit seed\" class=\"explicit-seed-button\">E</button>");
                    child.$component.append($explicitButton);
                    $explicitButton.button();
                }
                addSeedButtonsEventHandlers(child, $clearButton, $randomizeButton, $explicitButton);
            }

        }
    }


    function createTabs($parent, tabsId, tabsClass, tabCaptions, tabObjects, changeListener, presets, addSeeds) {

        if (!addSeeds) {
            addSeeds = [];
        }

        var tabsArr = ["<div id=\"" + tabsId + "\">"];

        var createdComps = [];
        var contentArrs = [];

        tabsArr.push('<ul class="' + tabsClass + '-ul">');
        for (var i=0; i<tabCaptions.length; i++) {
            tabsArr.push("<li><a href=\"#" + (tabsId + i) + "\" >" + tabCaptions[i] + "</a></li>");
        }
        tabsArr.push("</ul>");

        var hasSeeds = [];
        var hasLikelihoods = [];

        if (presets) {
            for (var i=0; i<presets.length; i++) {
                var preset = presets[i];
                for (var j=0; j<preset.items.length; j++) {
                    var item = preset.items[j];
                    uidManager.addUniqueId(uidManager, tabsId + i, item.name);
                }
            }
        }

        function addHeaderHtml(arr, index) {
            var defaultButtonId = (tabsId + "_default_button_" + index);
            var saveButtonId = (tabsId + "_save_button_" + index);
            var loadButtonId = (tabsId + "_load_button_" + index);
            var manageButtonId = (tabsId + "_manage_button_" + index);
            var clearSeedsButtonId = (tabsId + "_clear_seeds_button_" + index);
            var randomizeSeedsButtonId = (tabsId + "_randomize_seeds_button_" + index);
            var explicitSeedsButtonId = (tabsId + "_explicit_seeds_button_" + index);

            var buttonStyle = "style=\"height: 3em; font-size: 50%\"";
            var headerArr = [
                "<div " +
                    "id=\"" + (tabsId + "_header_" + i) + "\" " +
                    "class=\"" + tabsClass + "\" " +
                    " >",
                (presets ? "<button  style=\"" + buttonStyle + "\" id=\"" + defaultButtonId + "\" title=\"All settings to default values\"  >Set Default</button>" : ""),
                (hasSeeds[index] && addSeeds[index] ? "<button  style=\"" + buttonStyle + "\" id=\"" + clearSeedsButtonId + "\" title=\"Clear all seed values\" >Clear Seeds</button>" : ""),
                (hasSeeds[index] && addSeeds[index] ? "<button  style=\"" + buttonStyle + "\" id=\"" + randomizeSeedsButtonId + "\" title=\"Randomize all seed values\" >Randomize Seeds</button>" : ""),
                (hasSeeds[index] && addSeeds[index] ? "<button  style=\"" + buttonStyle + "\" id=\"" + explicitSeedsButtonId + "\" title=\"Set all seeds to their explicit values\"  >Explicit Seeds</button>" : ""),
                (presets ? "<button  style=\"" + buttonStyle + "\" id=\"" + saveButtonId + "\" title=\"Save current settings as a preset\" >Save</button>" : ""),
                (presets ? "<button  style=\"" + buttonStyle + "\" id=\"" + loadButtonId + "\" title=\"Load settings preset\" >Load</button>" : ""),
                (presets ? "<button  style=\"" + buttonStyle + "\" id=\"" + manageButtonId + "\" title=\"Edit settings presets\" >Edit Presets</button>" : ""),
                "</div>"
            ];
            arr.push(headerArr.join(""));
        }




        function createHeaderComponents(index) {

            var defaultButtonId = (tabsId + "_default_button_" + index);
            var saveButtonId = (tabsId + "_save_button_" + index);
            var loadButtonId = (tabsId + "_load_button_" + index);
            var manageButtonId = (tabsId + "_manage_button_" + index);

            var clearSeedsButtonId = (tabsId + "_clear_seeds_button_" + index);
            var randomizeSeedsButtonId = (tabsId + "_randomize_seeds_button_" + index);
            var explicitSeedsButtonId = (tabsId + "_explicit_seeds_button_" + index);

            if (hasSeeds[index] && addSeeds[index]) {
                $("#" + clearSeedsButtonId).button().click(function() {
                    var seedChildren = getAllSeedChildren(index, createdComps);
                    for (var i=0; i<seedChildren.length; i++) {
                        clearSeed(seedChildren[i]);
                    }
                });
                $("#" + randomizeSeedsButtonId).button().click(function() {
                    var seedChildren = getAllSeedChildren(index, createdComps);
                    for (var i=0; i<seedChildren.length; i++) {
                        randomizeSeed(seedChildren[i]);
                    }
                });
                $("#" + explicitSeedsButtonId).button().click(function() {
                    var seedChildren = getAllSeedChildren(index, createdComps);
                    for (var i=0; i<seedChildren.length; i++) {
                        explicitizeSeed(seedChildren[i]);
                    }
                });
            }

            if (presets) {
                $("#" + saveButtonId).button().click(function() {
                    var content = "";
                    var idSuggest = uidManager.getNextUniqueId(tabsId + index, tabCaptions[index] + " Sub-Settings ");
                    content += "<div>";
                    content += "<span class=\"preset-name-label\" >Name:</span>";
                    content += "<input class=\"preset-name-input ui-corner-all\" value=\"" + idSuggest + "\" />";
                    content += "</div>";
                    var options = {
                        modal: true,
                        width: 450,
                        buttons: {
                            "Save": function() {
                                if (presets) {
                                    var newId = $(this).find(".preset-name-input")[0].value;
                                    var preset = presets[index];
                                    var item = preset.getItemWithName(newId);

                                    if (!item) {
                                        item = new PresetItem();
                                        preset.items.push(item);
                                        uidManager.addUniqueId(uidManager, tabsId + index, newId);
                                    }
                                    item.name = newId;
                                    item.data = copyValueDeep(tabObjects[index]);

                                    preset.saveToLocalStorage();
                                }
//                        logit("Creating new item with name " + newItem.name);
                                $( this ).dialog( "close" );
                            },
                            "Cancel": function() {
                                $( this ).dialog( "close" );
                            }
                        }
                    };
                    showModalDialog("Save " + tabCaptions[index] + " Sub-Settings", content, options);
                });

                $("#" + loadButtonId).button().click(function() {

                    var content = "";
                    content += "<div>";
                    content += "<select class=\"preset-name-select ui-corner-all\" >";
                    if (presets) {
                        var preset = presets[index];
                        for (var i=0; i<preset.items.length; i++) {
                            var item = preset.items[i];
                            content += "<option value=\"" + item.name + "\" >" + item.name + "</option>";
                        }
                    }
                    content += "</select>";
                    content += "</div>";
                    var options = {
                        modal: true,
                        width: 450,
                        buttons: {
                            "Load": function() {
                                if (presets) {
                                    var presetName = $(this).find(".preset-name-select")[0].value;
                                    var preset = presets[index];
                                    var item = null;
                                    for (var i=0; i<preset.items.length; i++) {
                                        if (preset.items[i].name == presetName) {
                                            item = preset.items[i];
                                            break;
                                        }
                                    }
                                    if (item && item.data) {
                                        changeComponentValue(item.data, createdComps, index, tabsId, changeListener);
                                    }
//                            logit("Loading preset item " + JSON.stringify(item));
                                }
                                $( this ).dialog( "close" );
                            },
                            "Cancel": function() {
                                $( this ).dialog( "close" );
                            }
                        }
                    };
                    showModalDialog("Load " + tabCaptions[index] + " Sub-Settings", content, options);
                });

                $("#" + manageButtonId).button().click(function() {
                    var content = "";
                    content += "<div>";
                    content += "<ol class=\"preset-list\" >";
                    if (presets) {
                        var preset = presets[index];
                        for (var i=0; i<preset.items.length; i++) {
                            var item = preset.items[i];
                            content += "<li class=\"ui-widget-content\" >" + item.name + "</li>";
                        }
                    }
                    content += "</ol>";
                    content += "</div>";

                    content += "<div>";
                    content += "<button class=\"preset-rename-button\">Rename</button>";
                    content += "<button class=\"preset-duplicate-button\">Duplicate</button>";
                    content += "<button class=\"preset-delete-button\">Delete</button>";
                    content += "</div>";
                    var options = {
                        modal: true,
                        width: 450,
                        buttons: {
                            "Close": function() {
                                $( this ).dialog( "close" );
                            }
                        }
                    };
                    var selectedList = [];
                    var selectedSet = {};
                    var $dialog = showModalDialog("Edit " + tabCaptions[index] + " Sub-Settings", content, options);
                    var $list = $dialog.find(".preset-list").selectable({
                        selected: function(event, ui) {
                            var selected = ui.selected;
                            if (!arrayContains(selectedList, selected.innerHTML)) {
                                selectedList.push(selected.innerHTML);
                            }
                            selectedSet[selected.innerHTML] = selected;
                        },
                        unselected: function(event, ui) {
                            var unselected = ui.unselected;
                            arrayDelete(selectedList, unselected.innerHTML);
                            selectedSet[unselected.innerHTML] = null;
                        }
                    });
                    var $renameButton = $dialog.find(".preset-rename-button").button();
                    var $duplicateButton = $dialog.find(".preset-duplicate-button").button();
                    var $deleteButton = $dialog.find(".preset-delete-button").button();
                    $renameButton.click(
                        function() {
                            if (selectedList.length == 1) {
                                logit("Renaming " + selectedList[0]);
                            }
                        }
                    );
                    $deleteButton.click(
                        function() {
                            if (presets) {
                                var preset = presets[index];
                                for (var i=0; i<selectedList.length; i++) {
                                    var item = preset.getItemWithName(selectedList[i]);
                                    arrayDelete(preset.items, item);
                                    var $sel = $(selectedSet[selectedList[i]]);
                                    $sel.remove();
                                }
                                preset.saveToLocalStorage();
                                selectedList = [];
                                selectedSet = {};
                            }
                        }
                    );
                });

                $("#" + defaultButtonId).button().click(function() {
                    var newValue = eval("new " + tabObjects[index]._constructorName + "()");
                    changeComponentValue(newValue, createdComps, index, tabsId, changeListener);
                });
            }
        }



        for (var i=0; i<tabCaptions.length; i++) {
            var obj = tabObjects[i];

            var headerArr = [];
            var contentArr = [];

            if (obj) {
                var comp = new GuiPropertiesComponent({object: obj, propertyInfoProvider: propertyInfoProvider});
                createdComps[i] = comp;
                var seedChildren = getAllSeedChildren(i, createdComps);
                hasSeeds[i] = seedChildren.length > 0;
                var likelihoodChildren = getAllLikelihoodChildren(i, createdComps);
                hasLikelihoods[i] = likelihoodChildren.length > 0;
                comp.createJQueryStrings(contentArr);
                contentArrs.push(contentArr);
                addHeaderHtml(headerArr, i);
            }

            tabsArr.push(
                "<div " +
                    "id=\"" + (tabsId + i) + "\" " +
                    "class=\"" + tabsClass + "\" " +
                    " >" +
                    headerArr.join("") +
                    contentArr.join("") +
                    "</div>");
        }

        tabsArr.push("</div>");


        var $tabs = $(tabsArr.join(""));
        $parent.append($tabs);

        for (var i=0; i<tabCaptions.length; i++) {
            var $tab = $("#" + tabsId + i);
        }


        for (var i=0; i<createdComps.length; i++) {
            var comp = createdComps[i];
            comp.jQueryCreated($tabs);
            addChangeListener(i, createdComps, changeListener);
            createHeaderComponents(i);
        }

        for (var i=0; i<createdComps.length; i++) {
            var comp = createdComps[i];
            comp.alignComponents();
            addSideButtons(comp);
        }

        $tabs.tabs();

        return {
            createdComps: createdComps,
            changeListener: changeListener
        };
    }

    return {
        createTabs: createTabs,
        changeComponentValue: changeComponentValue
    }

})();


