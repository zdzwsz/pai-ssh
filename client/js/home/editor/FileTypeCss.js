var fileTypeMap = new Map();
var zip = "fa fa-file-zip-o zip";
fileTypeMap.set("zip",zip);
fileTypeMap.set("rar", zip);
fileTypeMap.set("tar", zip);
fileTypeMap.set("cab", zip);
fileTypeMap.set("7z", zip);

var word = "fa fa-file-word-o word";
fileTypeMap.set("doc", word);
fileTypeMap.set("docx", word);

var audio = "fa fa-file-audio-o audio";
fileTypeMap.set("mp3", audio);
fileTypeMap.set("wma", audio);
fileTypeMap.set("rm", audio);
fileTypeMap.set("wav", audio);
fileTypeMap.set("midi", audio);
fileTypeMap.set("ape", audio);
fileTypeMap.set("flac", audio);

var movie = "fa fa-file-movie-o movie";
fileTypeMap.set("wmv", movie);
fileTypeMap.set("asf", movie);
fileTypeMap.set("asx", movie);
fileTypeMap.set("rmvb", movie);
fileTypeMap.set("mpg", movie);
fileTypeMap.set("mpeg", movie);
fileTypeMap.set("mpe", movie);
fileTypeMap.set("3gp", movie);
fileTypeMap.set("mp4", movie);
fileTypeMap.set("mov", movie);
fileTypeMap.set("m4v", movie);
fileTypeMap.set("avi", movie);
fileTypeMap.set("dat", movie);
fileTypeMap.set("mkv", movie);
fileTypeMap.set("flv", movie);
fileTypeMap.set("vob", movie);

var text = "fa fa-file-text-o text";
fileTypeMap.set("txt", text);
fileTypeMap.set("md", text);
fileTypeMap.set("css", text);
fileTypeMap.set("ini", text);
fileTypeMap.set("properties", text);
fileTypeMap.set("sh", text);
fileTypeMap.set("bat", text);

var powerpoint = "fa fa-file-powerpoint-o powerpoint";
fileTypeMap.set("ppt", powerpoint);
fileTypeMap.set("pptx", powerpoint);

var pdf = "fa fa-file-pdf-o pdf";
fileTypeMap.set("pdf", pdf);

var excel="fa fa-file-excel-o excel";
fileTypeMap.set("xls", excel);
fileTypeMap.set("xlsx",excel);

fileTypeMap.set("file", "fa fa-file-o");

var picture="fa fa-file-picture-o picture";
fileTypeMap.set("bmp", picture);
fileTypeMap.set("gif", picture);
fileTypeMap.set("jpg", picture);
fileTypeMap.set("png", picture);
fileTypeMap.set("tif", picture);
fileTypeMap.set("jpeg", picture);

var code="fa fa-file-code-o code";
fileTypeMap.set("js", code);
fileTypeMap.set("htm", code);
fileTypeMap.set("html", code);
fileTypeMap.set("java", code);
fileTypeMap.set("py", code);
fileTypeMap.set("json", code);
fileTypeMap.set("xml", code);
fileTypeMap.set("go", code);
fileTypeMap.set("xhtml", code);
fileTypeMap.set("php", code);
fileTypeMap.set("vue", code);
fileTypeMap.set("c", code);
fileTypeMap.set("jsp", code);

var defaultCss = fileTypeMap.get("file");

export default function getFileCss(fileName) {
    let language = "txt";
    if (fileName) {
        let i = fileName.lastIndexOf(".");
        if (i > 0) {
            language = fileName.substring(i + 1);
            let filecss = fileTypeMap.get(language);
            if (filecss == null) {
                return defaultCss;
            } else {
                return filecss;
            }
        }
    }
    return defaultCss;
}