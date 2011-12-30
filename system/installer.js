var currentSlide = 0;
var totalSlide = 3
var width = window.innerWidth;
var language ="en";
var stepActiveColor ="";
var stepInactiveColor ="";
var selectedPartition = "";
var selectedPartitionColor = "";
var normalPartitionColor = "";
var minimumPartitionSize = 1000;
var nextSlideValidators = {};

var onchangeUpdaterList = [
    "language",
    "computer_name",
    "full_name",
    "user_name",
    "password",
    "password2"
];

var alpha_start = ("a").charCodeAt(0);
var alpha_end = ("z").charCodeAt(0);

var ALPHA_start = ("A").charCodeAt(0);
var ALPHA_end = ("Z").charCodeAt(0);
var digit_start = ("0").charCodeAt(0);
var digit_end = ("9").charCodeAt(0);

function update_slide_visibility() {
    var items = document.querySelectorAll("div.steps_long");
    for (var i = 0; i < items.length; i++){
        if (i == currentSlide)
            continue;
        items[i].style.maxWidth = "0px";
    }
    items[currentSlide].style.maxWidth = "500px";

    items = document.querySelectorAll("div.steps");
    for (var i = 0; i < items.length; i++){
        items[i].style.color = stepInactiveColor;
    }
    items[currentSlide].style.color = stepActiveColor;

}

function validate_current_slide() {
    if (nextSlideValidators[currentSlide]) {
        eval("var canContinue = " + nextSlideValidators[currentSlide]);
      
        if (canContinue) {
            document.getElementById("next").removeAttribute("disabled");
        } else {
            document.getElementById("next").setAttribute("disabled", "disabled");
        }
    }
}

function slide() {
    var pos = currentSlide * width * -1;
    document.getElementById("slider").style.WebkitTransform="translateX(" + pos + "px)";
    update_slide_visibility();
    validate_current_slide();
}

function nextSlide() {
    if (currentSlide + 1 >= totalSlide)
        return;

    currentSlide ++;
    slide();
}

function previousSlide() {
    if (currentSlide - 1 < 0)
        return;

    currentSlide --;
    slide();
}

function setup() {
    var padding_left  = 0;
    var padding_right = 0;

    // Get padding from CSS
    if (document.styleSheets) {
        for (var i = 0; i < document.styleSheets.length; i ++) {
            var sheet = document.styleSheets[i];
            for (var j = 0; j < sheet.cssRules.length; j ++) {
                rules = sheet.cssRules[j];
                if (rules.selectorText == "div.column") {
                    padding_left  = rules.style.paddingLeft;
                    padding_right = rules.style.paddingRight;
                } else if (rules.selectorText == "div.steps") {
                    stepInactiveColor = rules.style.color;
                } else if (rules.selectorText == "div.steps_long") {
                    stepActiveColor = rules.style.color;
                } else if (rules.selectorText == "div.partition") {
                    normalPartitionColor = rules.style.backgroundColor;
                } else if (rules.selectorText == "div.partition_selected") {
                    selectedPartitionColor = rules.style.backgroundColor;
                }
            }
        }
    }

    width = window.innerWidth;
    var columns = document.querySelectorAll("div.column");
    for (var i = 0; i < columns.length; i++){
        columns[i].style.width = (width - parseInt(padding_left) - parseInt(padding_right))+ "px"; 
        columns[i].style.left = (i * width) + "px"; 

        var id = columns[i].id;

        nextSlideValidators[i] = "canContinue" + id.charAt(0).toUpperCase() + id.substring(1, id.length) + "()";
    }
    totalSlide = columns.length;
    get_languages();
    get_regions();
    get_keyboards();
    get_partitions();
    retranslate();
    setup_updater();
    update_slide_visibility();
    validate_current_slide();
}

function update_language() {
    var item = document.querySelector("select#language");
    language = item.options[item.selectedIndex].value; 
    retranslate();
}

function retranslate() {
    if (language == "C") {
        return;
    }

    var ajax = new XMLHttpRequest();

    ajax.onreadystatechange = function() {
        var success = false;
        if (ajax.readyState==4 && ajax.responseText) {
            var translations = eval("(" + ajax.responseText + ")")
            var items = document.querySelectorAll("span");
            for (var i = 0; i < items.length; i++){
                if (translations[items[i].id] != undefined) {
                    items[i].innerHTML = translations[items[i].id];
                }
            }
            success = true;
        } 

        if (success) {
            language = "C";
        } 
    }
    ajax.open("GET", "translations." + language + ".json");
    ajax.send(null);
}

function get_languages() {

    var ajax = new XMLHttpRequest();

    ajax.onreadystatechange = function() {
        if (ajax.readyState == 4 && ajax.responseText) {
            var languages = eval("(" + ajax.responseText + ")")
            var item = document.querySelector("select#language");
            item.options.length = 0;
            for (var lang in languages) {
                var option = document.createElement("option");
                if (lang == language)
                    option.selected = true;
                option.text = languages[lang];
                option.value = lang;
                item.add(option);
            }
        } 
    }
    ajax.open("GET", "languages.json");
    ajax.send(null);
}

function get_regions() {

    var ajax = new XMLHttpRequest();

    ajax.onreadystatechange = function() {
        if (ajax.readyState == 4 && ajax.responseText) {
            var regions = eval("(" + ajax.responseText + ")")
                var item = document.querySelector("select#region");
            item.options.length = 0;
            for (var region in regions) {
                var option = document.createElement("option");
                if (region == language)
                    option.selected = true;
                option.text = regions[region];
                option.value = region;
                item.add(option);
            }
        } 
    }
    ajax.open("GET", "regions.json");
    ajax.send(null);
}

function get_keyboards() {

    var ajax = new XMLHttpRequest();

    ajax.onreadystatechange = function() {
        if (ajax.readyState == 4 && ajax.responseText) {
            var keyboards = eval("(" + ajax.responseText + ")")
            var item = document.querySelector("select#keyboard");
            item.options.length = 0;
            for (var keyboard in keyboards) {
                var option = document.createElement("option");
                if (keyboard == language)
                    option.selected = true;
                option.text = keyboards[keyboard];
                option.value = keyboard;
                item.add(option);
            }
        } 
    }
    ajax.open("GET", "keyboards.json");
    ajax.send(null);
}

function get_partitions() {

    var ajax = new XMLHttpRequest();

    ajax.onreadystatechange = function() {
        if (ajax.readyState == 4 && ajax.responseText) {
            var devices = eval("(" + ajax.responseText + ")")
            
            var item = document.getElementById("device_list");
            item.innerHTML = "";
            for (var i = 0;i < devices.length; i ++){
                var device = document.createElement("div");
                device.setAttribute("class", "device");
                var desc = "<b>" + devices[i].model + "</b> (" + devices[i].controller + ":" + devices[i].path + ")  <i>" + devices[i].size + "MB</i>" ;
                var txt = document.createTextNode(desc);
                item.appendChild(device);
                device.innerHTML = desc;
                for (var j = 0; j < devices[i].partitions.length; j ++) {
                    var p = devices[i].partitions[j];
                    if (p.size <= 0) {
                        continue;
                    }

                    var partition = document.createElement("div");
                    partition.setAttribute("class", "partition");
                    var id = "";
                    if (p.filesystem == "free") {
                        id = devices[i].path + "_free";
                    } else {
                        id = devices[i].path + p.id;
                    }
                    partition.setAttribute("id", id);
                    if (p.size > minimumPartitionSize) {
                        partition.setAttribute("onclick", "select_partition('" + id + "')");
                    }
                    var txt = "";
                    if (p.description) {
                        txt += "<b>" + p.description + "</b><br/>";
                    }
                    txt += id + ": " + p.size + " MB";
                    partition.innerHTML = txt;
                    device.appendChild(partition);
                    if (p.parent != "0") {
                        var parent_item = document.getElementById(devices[i].path + p.parent);
                        if (parent_item != undefined) {
                            parent_item.style.display = "none";
                        }
                    }
                }
            }
        } 
    }
    ajax.open("GET", "http://parted/get_devices");
    ajax.send(null);
}

function select_partition(partition) {
    var items = document.querySelectorAll("div.partition");
    for (var i = 0; i < items.length; i++){
        if (items[i].id == partition) {
            items[i].style.backgroundColor = selectedPartitionColor;
            continue;
        }
        items[i].style.backgroundColor = normalPartitionColor;
    }
    selectedPartition = partition;
    validate_current_slide ();
}

function canContinueLocale() {
    return true;
}

function canContinueTarget() {
    if (selectedPartition != "")
        return true;

    return false;
}

function setup_updater() {
    for (var i = 0; i < onchangeUpdaterList.length; i ++) {
        var id = onchangeUpdaterList [i];
        var item = document.getElementById(id);
        if (item != undefined) {
            item.setAttribute("onchange", "update_" + id + "(this)");
        }
    }
}

function validate_lowercase_alphanumeric(string) {
    var result = true;
    for (var i = 0; i < string.length; i ++) {
        var isAlpha = (string.charCodeAt(i) >= alpha_start && string.charCodeAt(i) <= alpha_end);
        var isDigit = (string.charCodeAt(i) >= digit_start && string.charCodeAt(i) <= digit_end);
        if (i == 0) {
            if (!isAlpha) {
                result = false;
                break;
            }
        }

        if (!(isAlpha || isDigit)) {
            result = false;
            break;
        }
    }
    return result;
}

function give_focus_if_invalid(result, item) {
    if (!result) {
        item.focus();
    }
}

function update_computer_name(item) {
    var result = false;

    if (item.value.length > 0) {
        result = true;
    }

    var lowercase = item.value.toLowerCase();
    result = result & validate_lowercase_alphanumeric (lowercase);
   
    item.value = lowercase;
    display_hint (item, !result);
    give_focus_if_invalid(item);
    return result;
}

function update_user_name(item) {
    // same validation with computer_name
    return update_computer_name(item);
}

function update_password(item) {
    var result = false;

    if (item.value.length > 7) {
        result = true;
    }

    var string = item.value;
    var hasAlpha = false;
    var hasDigit = false;
    var hasALPHA = false;
    if (result) {
        result = false;
        for (var i = 0; i < string.length; i ++) {
            var isAlpha = (string.charCodeAt(i) >= alpha_start && string.charCodeAt(i) <= alpha_end);
            var isALPHA = (string.charCodeAt(i) >= ALPHA_start && string.charCodeAt(i) <= ALPHA_end);
            var isDigit = (string.charCodeAt(i) >= digit_start && string.charCodeAt(i) <= digit_end);
            if (isAlpha) {
                hasAlpha = true;
            }

            if (isALPHA) {
                hasALPHA = true;
            }

            if (isDigit) {
                hasDigit = true;
            }

            if (hasALPHA && hasAlpha && hasDigit) {
                result = true
                break;
            }
        }
    }

    display_hint (item, !result);
    give_focus_if_invalid(item);
    return true;
}

function update_password2(item) {
    var result = false;
    var p = document.getElementById("password");
    if (p != undefined) {
        result = (p.value == item.value);    
    }

    display_hint (item, !result);
    give_focus_if_invalid(item);
    return result;
}

function display_hint(object, display) {
    var id = object.id;
    var item = document.getElementById("hint_" + id);
    if (item != undefined) {
        if (display) {
            item.style.display = "inherit";
        } else {
            item.style.display = "none";
        }
    }
}
