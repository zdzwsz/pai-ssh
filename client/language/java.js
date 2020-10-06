//monaco.languages.CompletionItemKind.Keyword:13//Module:8//Class:6//Color:15//Constructor:3//Enum:12//Field:4//File:16//Folder:8//Function:2//Interface:7//Method:1
var java_import = ["java.lang.*"];
var java_import_index = 0;
function CreateJavaHeadKeywork() {
    return [
        {
            label: 'package',
            kind: 13,
            documentation: "",
            insertText: 'package'
        },
        {
            label: 'import',
            kind: 13,
            documentation: "",
            insertText: 'import'
        }
    ]
}

function loadPackageDataByName(packageName) {
    var packages = javaClassNames;
    var arr = packageName.split(".");
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == "") break;
        packages = packages[arr[i]];
    }
    return packages;
}

function CreateJavaHeadImport(packageName) {
    var packages = null;
    if (packageName == "") {
        packages = javaClassNames;
    } else {
        packages = loadPackageDataByName(packageName)
    }
    var returnValue = [];
    if (packages != null) {
        for (var pack in packages) {
            if (pack == "c") {
                var classNames = packages["c"];
                for (var n = 0; n < classNames.length; n++) {
                    loadCompletWord(classNames[n], classNames[n], returnValue);
                }
            } else {
                loadCompletWord(pack, pack, returnValue);
            }
        }
    }
    return returnValue;
}

function loadCompletWord(key, word, returnValue) {
    var value = {
        label: key,
        kind: 13,
        documentation: "",
        insertText: word
    }
    returnValue.push(value);
}

var JavaHeadCompletionItemProvider = {
    triggerCharacters: ['.',' '],
    provideCompletionItems: function (model, position) {
        var textUntilPosition = model.getValueInRange({ startLineNumber: 1, startColumn: 1, endLineNumber: position.lineNumber, endColumn: position.column });
        if (textUntilPosition.indexOf("{") < 0) {
            var textLinePosition = model.getValueInRange({ startLineNumber: position.lineNumber, startColumn: 1, endLineNumber: position.lineNumber, endColumn: position.column });
            var index = textLinePosition.indexOf("import");
            if (index > -1) {
                return {"suggestions":CreateJavaHeadImport(trim(textLinePosition.substring(index + 6)))};
            } else {
                return {"suggestions":CreateJavaHeadKeywork()};
            }
        }
        
        return {"suggestions":[]};
    }
}

var JavaBodyCompletionItemProvider = {
    triggerCharacters: ["."],
    provideCompletionItems: function (model, position) {
        //console.log(headTypeIndex);
        var textUntilPosition = model.getValueInRange({ startLineNumber: 1, startColumn: 1, endLineNumber: position.lineNumber, endColumn: position.column });
        if (textUntilPosition.lastIndexOf(".") != textUntilPosition.length - 1) return {"suggestions":[]};
        var headTypeIndex = textUntilPosition.indexOf("{");
        
        if (headTypeIndex > 0) {
            var head = textUntilPosition.substring(0, headTypeIndex);
            if (headTypeIndex != java_import_index) {
                java_import_index == headTypeIndex;
                explainImport(head);
            }
            textUntilPosition = textUntilPosition.substring(headTypeIndex);
            var textLinePosition = trim(model.getValueInRange({ startLineNumber: position.lineNumber, startColumn: 1, endLineNumber: position.lineNumber, endColumn: position.column }));
            if (textLinePosition.indexOf("\"") > 0 || isIgnore(textLinePosition)) { return {"suggestions":[]}; }//字符串
            var pattern = /[a-zA-Z0-9_]/;
            var i = textLinePosition.length - 2;
            var variableEnd = textLinePosition.length - 1;
            var variableName = null;//变量名
            var arrayModel = 0;//数组模式
            var variableStatus = 0;
            for (; i >= 0; i--) {
                console.log(textLinePosition.charAt(i));
                if (textLinePosition.charAt(i) == "]") {
                    arrayModel = 1;
                }
                if (arrayModel == 1) {
                    if (textLinePosition.charAt(i) == "[") {
                        arrayModel = 2;
                        variableEnd = i;
                    }
                    continue;
                }
                if (arrayModel == 2 && textLinePosition.charAt(i) == " " && variableStatus == 0) {
                    continue;
                } else if (pattern.test(textLinePosition.charAt(i))) {
                    variableStatus = 1;
                } else if (variableStatus = 1 && !pattern.test(textLinePosition.charAt(i))) {
                    variableName = textLinePosition.substring(i + 1, variableEnd);
                    break;
                }
            }
            if (variableName == null && arrayModel != 1) {
                var variableName = textLinePosition.substring(i, variableEnd);
            }
            console.log("v:" + variableName);
            var type = null;
            if (variableName != null && variableName != "") {
                var isIgnoreLine = [];
                var layer = 0
                var type = null;
                var bracketsDown = false;
                for (var n = position.lineNumber - 1; n > 0; n--) {
                    var astLinePosition = trim(model.getValueInRange({ startLineNumber: n, startColumn: 1, endLineNumber: n, endColumn: 1000 }));
                    //console.log(astLinePosition);
                    if (!isIgnore(astLinePosition)) {
                        if (astLinePosition.indexOf("}") > -1) {
                            layer++;
                        }
                        if (astLinePosition.indexOf("{") > -1 && layer > 0) {
                            layer--;
                            if (astLinePosition.indexOf("{") == 0) {
                                bracketsDown = true;
                                continue;
                            }
                            else if (astLinePosition.indexOf("(") > 0 && astLinePosition.indexOf(")") > 0) {
                                continue;
                            }
                        }
                        if (bracketsDown == true) {
                            bracketsDown = false;
                            if (astLinePosition.indexOf("(") > 0 && astLinePosition.indexOf(")") > 0) {
                                continue;
                            }
                        }
                        if (layer > 0) continue;
                        var index = astLinePosition.lastIndexOf(variableName);
                        if (index > 0) {
                            if (astLinePosition.charAt(index - 1) != " ") continue;
                            if (pattern.test(astLinePosition.charAt(index + variableName.length))) continue;
                            var isMatching = true;
                            var isAyyay = 0;
                            for (var s = index + variableName.length; s < astLinePosition.length; s++) {
                                if (astLinePosition.charAt(s) == "=" || astLinePosition.charAt(s) == ";" || astLinePosition.charAt(s) == ")" || astLinePosition.charAt(s) == ",") {
                                    isMatching = true;
                                    break;
                                } else if (astLinePosition.charAt(s) == "[") {
                                    isAyyay = 1;
                                }
                                else if (astLinePosition.charAt(s) == "]") {
                                    isAyyay = 2;
                                    break;
                                }
                                else if (astLinePosition.charAt(s) != " ") {
                                    isMatching = false;
                                    break;
                                }
                            }
                            if (isAyyay == 2 && arrayModel < 2) {
                                return {"suggestions":CreateJavaMethod("Array")};
                            }
                            if (isMatching == true) {
                                var ii = index - 1;
                                var space = 0;
                                var num = 0;
                                var isAyyay = 0;
                                var isGeneric = 0;
                                for (; ii >= 0; ii--) {
                                    //console.log("111:" + astLinePosition.charAt(ii));
                                    if (astLinePosition.charAt(ii) == " " || astLinePosition.charAt(ii) == "\t") {
                                        num++;
                                        if (num > 15) break;
                                        if (space == 1) {
                                            type = trim(astLinePosition.substring(ii + 1, index));
                                            //console.log("111:"+type);
                                            break;
                                        }
                                        continue;
                                    } else if (astLinePosition.charAt(ii) == "]") {
                                        isAyyay = 1;
                                        continue;
                                    } else if (astLinePosition.charAt(ii) == "[") {
                                        if (isAyyay == 1 && arrayModel < 2) {
                                            return {"suggestions":CreateJavaMethod("Array")};
                                        }
                                        index = ii;
                                        continue;
                                    }

                                    else if (astLinePosition.charAt(ii) == ">") {
                                        isGeneric = 1;
                                        continue;
                                    } else if (astLinePosition.charAt(ii) == "<") {
                                        index = ii;
                                        isGeneric = 2;
                                        continue;
                                    } else if (isGeneric == 1) {
                                        continue;
                                    }

                                    if (pattern.test(astLinePosition.charAt(ii))) {
                                        space = 1;
                                        if (ii == 0) {
                                            type = trim(astLinePosition.substring(ii, index));
                                        }
                                    } else if (!pattern.test(astLinePosition.charAt(ii)) && space == 1) {
                                        type = trim(astLinePosition.substring(ii + 1, index));
                                        //console.log("111:"+type);
                                        break;
                                    } else {
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    if (type != null) {
                        return {"suggestions":CreateJavaMethod(type)};
                    }
                }

            }
            return {"suggestions":[]};
        }
    }
}



function CreateJavaMethod(className) {
    var returnValue = [];
    var className = findJavaClass(className);
    //console.log("find type:" + className);
    var classMethodName = classMethodNames[className];
    if (classMethodName) {
        loadAutoCompletionItem(classMethodName, returnValue);
        if (className != "java.lang.Object") {
            classMethodName = classMethodNames["java.lang.Object"];
            loadAutoCompletionItem(classMethodName, returnValue);
        }
    }
    return returnValue;
}

function loadAutoCompletionItem(classMethodName, returnValue) {
    for (var i = 0; i < classMethodName.length; i++) {
        var value = {
            label: classMethodName[i],
            kind: 13,
            documentation: "",
            insertText: classMethodName[i].substring(0, classMethodName[i].indexOf(":") - 1)
        }
        returnValue.push(value);
    }
}

function isIgnore(code) {
    if (code == null) return true;
    if (code.indexOf("//") == 0 || code.indexOf("/*") == 0 || code.indexOf("*/") > -1) return true;
    return false;
}

function explainImport(head) {
    java_import = ["java.lang.*"];
    var linkRegx = /[\s]*import[\s]+([a-zA-Z\.\*]+);/g;
    if (head != "" && head.length > 10) {
        var group = head.match(linkRegx)
        if (group)
            for (var i = 0; i < group.length; i++) {
                var value = trim(group[i]);
                java_import.push(trim(value.substring(6, value.length - 1)));
            }
    }

}

function findJavaClass(className) {
    if (className == "Array") return className = "Array";
    if (java_import.length > 0) {
        for (var i = 0; i < java_import.length; i++) {
            if (java_import[i].indexOf("."+className) > -1) {
                return java_import[i];
            } else if (java_import[i].indexOf("*") > -1) {
                var packageName = java_import[i].substring(0, java_import[i].length - 1);
                var packages = loadPackageDataByName(packageName);
                var cs = packages["c"];
                if (cs) {
                    for (var n = 0; n < cs.length; n++) {
                        if (cs[n] == className) {
                            return packageName + className;
                        }
                    }
                }
            }
        }
    }
    return className;
}

function trim(str) {
    return str.replace(/^(\s|\u00A0)+/, '').replace(/(\s|\u00A0)+$/, '');
}

function registerCompletionItemProvider(languages) {
    languages.registerCompletionItemProvider('java', JavaHeadCompletionItemProvider);
    languages.registerCompletionItemProvider('java', JavaBodyCompletionItemProvider);
}

