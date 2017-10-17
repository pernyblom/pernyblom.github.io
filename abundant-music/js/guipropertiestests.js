
function testValueComponents() {
    var dummyObject = {};

    var uidManager = new UniqueIdManager();
    uidManager.addUniqueId(dummyObject, "ns", "frasse");
    uidManager.addUniqueId(dummyObject, "ns", "olle");
    uidManager.addUniqueId(dummyObject, "ns", "Nisse");
    uidManager.addUniqueId(dummyObject, "ns", "Kalle");

    var counter = 1;


    var testObject = {
        getGuiPropertyInfos: function() {
            var result = new GuiPropertyInfos();
            var info = new GuiPropertyInfo(
            {
                propertyName: "testProperty",
                propertyCaption: "Caption for this stuff",
                defaultValue: 1043,
                splitInfo: new GuiSplitInfo({
                    group: "group1",
                    groupCaption: "Caption 1"
                })
            }
            );
            result.addPropertyInfo(info);
            info = new GuiPropertyInfo(
            {
                propertyName: "anotherProperty",
                propertyCaption: "Caption for other stuff",
                defaultValue: 142,
                splitInfo: new GuiSplitInfo({
                    group: "group1"
                })
            }
            );
            result.addPropertyInfo(info);
            info = new GuiPropertyInfo(
            {
                propertyName: "minConstraint",
                propertyCaption: "Has min/max constraint",
                defaultValue: 142,
                constraints: [{
                    getMinValue: function() {
                        return 0;
                    },
                    getMaxValue: function() {
                        return 10;
                    }
                }],
                splitInfo: new GuiSplitInfo({
                    group: "group2",
                    groupCaption: "Another Tab"
                })
            }
            );
            result.addPropertyInfo(info);
            var info = new GuiPropertyInfo(
            {
                propertyName: "stuff",
                propertyCaption: "Has enumerable values",
                defaultValue: 12,
                constraints: [{
                    getPossibleValues: function() {
                        return [4, 8, 12, 34];
                    }
                }],
                splitInfo: new GuiSplitInfo({
                    group: "group2"
                })
            }
            );
            result.addPropertyInfo(info);
            var info = new GuiPropertyInfo(
            {
                propertyName: "floatStuff",
                propertyCaption: "Is a float",
                defaultValue: 12.3,
                dataType: GuiPropertyDataType.FLOAT,
                splitInfo: new GuiSplitInfo({
                    group: "group2"
                })
            }
            );
            result.addPropertyInfo(info);
            var info = new GuiPropertyInfo(
            {
                propertyName: "floatLimitedStuff",
                propertyCaption: "Is a limited float",
                defaultValue: 12.3,
                dataType: GuiPropertyDataType.FLOAT,
                constraints: [{
                    getMinValue: function() {
                        return -34.34;
                    },
                    getMaxValue: function() {
                        return 10.342;
                    }
                }],
                splitInfo: new GuiSplitInfo({
                    group: "group2"
                })
            }
            );
            result.addPropertyInfo(info);
            var info = new GuiPropertyInfo(
            {
                propertyName: "stringProp",
                propertyCaption: "Is a string",
                defaultValue: "heool",
                dataType: GuiPropertyDataType.STRING,
                constraints: [new StringNotEmptyConstraint({
                    errorMessage: "No empty brother!!!"
                })],
                splitInfo: new GuiSplitInfo({
                    group: "group3",
                    groupCaption: "String stuff"
                })
            }
            );
            result.addPropertyInfo(info);
            var info = new GuiPropertyInfo(
            {
                propertyName: "stringProp2",
                propertyCaption: "Is a constrained string",
                defaultValue: "he",
                dataType: GuiPropertyDataType.STRING,
                constraints: [new StringLengthConstraint({
                    maxLength: 10,
                    minLength: 1
                })],
                splitInfo: new GuiSplitInfo({
                    group: "group3",
                    groupCaption: "String stuff"
                })
            }
            );
            result.addPropertyInfo(info);
            var info = new GuiPropertyInfo(
            {
                propertyName: "stringProp3",
                propertyCaption: "Is another constrained string",
                defaultValue: "afrika",
                dataType: GuiPropertyDataType.STRING,
                constraints: [{
                    getPossibleValues: function() {
                        return ["hello", "afrika", "tell", "me", "dr", "alban"]
                    }
                }],
                splitInfo: new GuiSplitInfo({
                    group: "group3",
                    groupCaption: "String stuff"
                })
            }
            );
            result.addPropertyInfo(info);
            info = new GuiPropertyInfo(
            {
                propertyName: "intSelect1",
                propertyCaption: "Int select",
                defaultValue: 142,
                dataType: GuiPropertyDataType.INT,
                possibleValues: [2, 3, 8, 92],
                displayFunction: function(object, propertyName, value) {
                    return value + "b";
                },
                displayHint: NumberPropertyDisplayHint.SELECT,
                splitInfo: new GuiSplitInfo({
                    group: "group4",
                    groupCaption: "Select stuff"
                })

            }
            );
            result.addPropertyInfo(info);
            info = new GuiPropertyInfo(
            {
                propertyName: "stringSelect1",
                propertyCaption: "String select",
                defaultValue: "hej",
                dataType: GuiPropertyDataType.STRING,
                possibleValues: ["hej", "lasse", "hur", "feels", "good"],
                displayFunction: function(object, propertyName, value) {
                    return value.toUpperCase();
                },
                displayHint: StringPropertyDisplayHint.SELECT,
                splitInfo: new GuiSplitInfo({
                    group: "group4"
                })
            }
            );
            result.addPropertyInfo(info);
            info = new GuiPropertyInfo(
            {
                propertyName: "booleanSelect1",
                propertyCaption: "Boolean select",
                defaultValue: true,
                dataType: GuiPropertyDataType.BOOLEAN,
                displayFunction: function(object, propertyName, value) {
                    return value ? "On" : "Off";
                },
                displayHint: BooleanPropertyDisplayHint.SELECT,
                splitInfo: new GuiSplitInfo({
                    group: "group4"
                })
            }
            );
            result.addPropertyInfo(info);
            info = new GuiPropertyInfo(
            {
                propertyName: "idRef",
                propertyCaption: "Id reference",
                defaultValue: "",
                dataType: GuiPropertyDataType.ID_REFERENCE,
                displayHint: IdReferencePropertyDisplayHint.SELECT,
                uniqueIdInfo: new GuiUniqueIdInfo({
                    namespace: "ns",
                    manager: uidManager
                }),
                splitInfo: new GuiSplitInfo({
                    group: "group5",
                    groupCaption: "Ids and Co"
                })
            }
            );
            result.addPropertyInfo(info);
            info = new GuiPropertyInfo(
            {
                propertyName: "intList",
                propertyCaption: "Integer list",
                defaultValue: [],
                dataType: GuiPropertyDataType.INT_LIST,
                displayHint: NumberListPropertyDisplayHint.TEXT,
                splitInfo: new GuiSplitInfo({
                    group: "group6",
                    groupCaption: "Simple lists"
                })
            }
            );
            result.addPropertyInfo(info);
            info = new GuiPropertyInfo(
            {
                propertyName: "intList2",
                propertyCaption: "Integer list 2",
                defaultValue: [],
                dataType: GuiPropertyDataType.INT_LIST,
                displayHint: NumberListPropertyDisplayHint.SELECT_LIST,
                listInfo: new GuiListInfo({
                    constructorInfos: [
                    new GuiConstructorInfo({
                        name: "stuff",
                        text: "New",
                        nameIsConstructor: false,
                        createValue: function() {
                            return 2
                        }
                    })
                    ],
                    itemsDisplayFunction: function(input) {
                        return input + "fkjsdjlf";
                    },
                    possibleValues: [1, 2, 3, 4, 5, 7, 9]
                }),
                splitInfo: new GuiSplitInfo({
                    group: "group6",
                    groupCaption: "Simple lists"
                })
            }
            );
            result.addPropertyInfo(info);
            info = new GuiPropertyInfo(
            {
                propertyName: "intList2d",
                propertyCaption: "Integer list 2D",
                defaultValue: [],
                dataType: GuiPropertyDataType.INT_LIST_2D,
                displayHint: NumberList2DPropertyDisplayHint.TEXT,
                splitInfo: new GuiSplitInfo({
                    group: "group6",
                    groupCaption: "Simple lists"
                })
            }
            );
            result.addPropertyInfo(info);
            info = new GuiPropertyInfo(
            {
                propertyName: "floatList",
                propertyCaption: "Float list",
                defaultValue: "",
                dataType: GuiPropertyDataType.FLOAT_LIST,
                displayHint: NumberListPropertyDisplayHint.TEXT,
                splitInfo: new GuiSplitInfo({
                    group: "group6",
                    groupCaption: "Simple lists"
                })
            }
            );
            result.addPropertyInfo(info);
            info = new GuiPropertyInfo(
            {
                propertyName: "floatList2d",
                propertyCaption: "Float list 2D",
                defaultValue: [],
                dataType: GuiPropertyDataType.FLOAT_LIST_2D,
                displayHint: NumberList2DPropertyDisplayHint.TEXT,
                splitInfo: new GuiSplitInfo({
                    group: "group6",
                    groupCaption: "Simple lists"
                })
            }
            );
            result.addPropertyInfo(info);
            info = new GuiPropertyInfo(
            {
                propertyName: "aProcedure",
                propertyCaption: "Add a unique ID",
                dataType: GuiPropertyDataType.PROCEDURE,
                displayHint: ProcedureDisplayHint.BUTTON,
                procedureInfo: new GuiProcedureInfo({
                    args: [1, "hello"]
                })
            }
            );
            result.addPropertyInfo(info);
            info = new GuiPropertyInfo(
            {
                propertyName: "aProcedure2",
                propertyCaption: "Remove a unique ID",
                dataType: GuiPropertyDataType.PROCEDURE,
                displayHint: ProcedureDisplayHint.BUTTON
            }
            );
            result.addPropertyInfo(info);
            info = new GuiPropertyInfo(
            {
                propertyName: "aProcedure3",
                propertyCaption: "Change a unique ID",
                dataType: GuiPropertyDataType.PROCEDURE,
                displayHint: ProcedureDisplayHint.BUTTON
            }
            );
            result.addPropertyInfo(info);

            info = new GuiPropertyInfo(
            {
                propertyName: "id",
                propertyCaption: "Id",
                defaultValue: "anId",
                dataType: GuiPropertyDataType.UNIQUE_ID,
                displayHint: UniqueIdPropertyDisplayHint.TEXT,
                uniqueIdInfo: new GuiUniqueIdInfo({
                    namespace: "ns",
                    manager: uidManager
                }),
                splitInfo: new GuiSplitInfo({
                    group: "group5",
                    groupCaption: "Ids and Co"
                })
            }
            );
            result.addPropertyInfo(info);
            return result;
        },
        testProperty: 231,
        anotherProperty: 43278,
        minConstraint: 9,
        stuff: 8,
        floatStuff: 234.23,
        floatLimitedStuff: 2.23,
        stringProp: "jasse",
        stringProp2: "jasse2",
        stringProp3: "dr",
        intSelect1: 2,
        stringSelect1: "lasse",
        booleanSelect1: false,
        idRef: "",
        aProcedure: function(a, b) {
            uidManager.addUniqueId(dummyObject, "ns", "Kalle" + counter);
            counter++;
        },
        aProcedure2: function() {
            var arr = uidManager.getUniqueIds("ns");
            if (arr.length > 1) {
                var index = Math.min(Math.round(Math.random() * arr.length) + 1, arr.length - 1);
            //                uidManager.removeUniqueId("ns", arr[index]);
            }
        },
        aProcedure3: function() {
            var arr = uidManager.getUniqueIds("ns");
            if (arr.length > 1) {
                var index = Math.min(Math.round(Math.random() * arr.length) + 1, arr.length - 1);
            //                uidManager.changeUniqueId(dummyObject, "ns", arr[index], arr[index] + "A");
            }
        },
        id: "olle",
        intList: [34, 32, 212],
        floatList: [34.34, 12.4, -0.7],
        intList2d: [[34, 32, 212], [35, 5], [7]],
        floatList2d: [[34.34, 32.1, 12.3], [1.35, 3.5], [7.1]],
        intList2: [1, 3, 5, 7]
    };

    var comp = new GuiPropertiesComponent({
        object: testObject
    });

    //    investigateObject(comp);

    //    logit("comp constructor " + comp.constructor);

    //    var resultArr = [];
    //    toJsonWithGuiPropertyInfos(testObject, resultArr);
    //    $content.append($("<textarea>" + resultArr.join("") + "</textarea>"));

    comp.spawn($content);
}

