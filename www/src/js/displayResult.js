jQuery(document).ready(function($) 
{
    "use strict";

    var toolsScoreDict = {};

    var url_string = window.location.href;
    var url = new URL(url_string);

    var cifScore = url.searchParams.get("cif");
    toolsScoreDict["cifScore"] = cifScore;

    var vaeScore = url.searchParams.get("vae");
    toolsScoreDict["vaeScore"] = vaeScore;

    var toolsScoreArray = Object.keys(toolsScoreDict).map(function(key) {
        return [key, toolsScoreDict[key]];
    });

    // Sort the array based on the second element
    toolsScoreArray.sort(function(first, second) {
        return second[1] - first[1];
    });


    for (let scoreIndex = 0; scoreIndex < toolsScoreArray.length; scoreIndex++) 
    {
        const score = toolsScoreArray[scoreIndex];
        
        if(score[1] != -1)
        {
            switch (score[0]) 
            {
                case "vaeScore":
                    displayVAE();
                    break;
                case "cifScore":
                    displayCIF();
                    break;
                default:
                    break;
            }
        }
    }


    function displayVAE()
    {
        $('#tools').append(
            `
            <fieldset class="contact100-form wrap-input100">
                <legend>VAE</legend>
                `+vaeScore+`
            </fieldset>
            `
        )
    }

    function displayCIF()
    {
        $('#tools').append(
            `
            <fieldset class="contact100-form wrap-input100">
                <legend>CIF</legend>
                `+cifScore+`
            </fieldset>
            `
        )
    }

});