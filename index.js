var result = null
$("#cad-view > canvas").css('cursor', 'move')
window.requirejs(['./vendor/dxf.js'], function(dxfLib) {

var cadCanvas;
var dxfData = null;




//dxf
    document.getElementById('dxf').addEventListener('change', onFileSelectedDXF, false);

    function onFileSelectedDXF(evt) {
        toggleGenerateButton(false)
        dxfData = null;

        var file = evt.target.files[0];

        var reader = new FileReader();

        reader.onloadend = onSuccess;
        reader.onabort = abortUpload;
        reader.onerror = errorHandler;
        reader.readAsText(file);
    }

    function abortUpload() {
        
    }

    function errorHandler(evt) {
        switch (evt.target.error.code) {
            case evt.target.error.NOT_FOUND_ERR:
                alert('File Not Found!');
                break;
            case evt.target.error.NOT_READABLE_ERR:
                alert('File is not readable');
                break;
            case evt.target.error.ABORT_ERR:
                break; // noop
            default:
                alert('An error occurred reading this file.');
        }
    }

    var allNumberTexts = []

    function getObject(theObject) {
        var result = null;
        if (theObject instanceof Array) {
            for (var i = 0; i < theObject.length; i++) {
                result = getObject(theObject[i]);
            }
        } else {
            for (var prop in theObject) {

                if (prop == 'type') {
                    if (theObject[prop] === 'TEXT') {
                        if (!isNaN(theObject.text)) {
                            allNumberTexts.push(theObject);
                        }

                    }
                }
                if (theObject[prop] instanceof Object || theObject[prop] instanceof Array)
                    result = getObject(theObject[prop]);
            }
        }
        return allNumberTexts;
    }

    function onSuccess(evt) {
        var fileReader = evt.target;
        var parser = new window.DxfParser();
        var dxf1 = parser.parseSync(fileReader.result);

        var dxfContents = fileReader.result
        var helper = new dxfLib.Helper(dxfContents)
        const parsed = helper.parsed


        //get all numbertexts
        dxfData = getObject(dxf1)

        parsed.entities = parsed.entities.concat(dxfData)

        var font;
        var loader = new THREE.FontLoader();

        font = loader.parse(fontData)

        cadCanvas = new window.ThreeDxf.Viewer(parsed, document.getElementById('cad-view'), window.innerWidth, 700, font);

        $('#cadContainer').show()
    }

    function toggleGenerateButton(active) {
        $('#generate').attr("disabled", !active);
    }

})