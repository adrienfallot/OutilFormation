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
                <legend><img src="images/vae.jpg" width="15%" alt="VAE Logo"> La Validation des Acquis d'Expérience</legend>
                <p>Toute personne, quels que soient son âge, sa nationalité, son statut et son niveau de formation, qui justifie d’au moins 1 an d’expérience en rapport direct avec la certification visée, peut prétendre à la VAE. Cette certification qui peut être un diplôme, un titre ou un certificat de qualification professionnelle doit être inscrite au Répertoire national des certifications professionnelles (RNCP).</p>
                <details>
                    <summary>Démarche</summary>
                    <p>Vous transmettez à l’autorité certificatrice un dossier décrivant votre expérience. Ensuite, selon la certification, vous serez mis en situation professionnelle devant un jury ou vous lui présenterez votre dossier. Dans les deux cas, le jury s’entretiendra avec vous et prendra une décision de validation totale, partielle ou d’un refus de validation. L’ensemble de la démarche dure entre huit et douze mois (de la définition du projet jusqu’aux épreuves de validation devant le jury).</p>
                </details>
                <details>
                    <summary>Outils</summary>
                    <ul class="square-List">
                        <li><a href="tools/vae-tableauDeBord.pdf">Tableau de bord</a></li>
                    </ul>
                </details>
                <a class="link" href="http://www.vae.gouv.fr/">http://www.vae.gouv.fr/</a>
            </fieldset>
            `
        )
    }

    function displayCIF()
    {
        $('#tools').append(
            `
            <fieldset class="contact100-form wrap-input100">
                <legend><img src="images/cif.jpg" width="15%" alt="CIF Logo"> Le Congès Individuel de Formation</legend>
                <p>Le congé individuel de formation (Cif) est un congé qui permet au salarié de s'absenter de son poste afin de suivre une formation pour se qualifier, évoluer ou se reconvertir. Le Cif est ouvert sous conditions. Il est accordé sur demande à l'employeur. Le salarié est rémunéré pendant toute la durée de la formation.</p>
                <details>
                    <summary>Démarche</summary>
                    <h3>Auprès de l'employeur</h3>
                    <p>Le salarié doit adresser une demande écrite d'autorisation d'absence à son employeur, de préférence par lettre recommandée avec accusé de réception, indiquant :</p>
                    <ul class="circle-list">
                        <li>la date de la formation</li>
                        <li>son intitulé</li>
                        <li>sa durée</li>
                        <li>l'organisme qui la réalise</li>
                    </ul>
                    <p>La demande doit être formulée au plus tard :</p>
                    <ul class="circle-list">
                        <li>120 jours avant le début de la formation si elle dure 6 mois ou plus, et si elle s'effectue en 1 fois à temps plein</li>
                        <li>ou 60 jours si elle dure moins de 6 mois, et si elle s'effectue à temps partiel ou sur plusieurs périodes ou si la demande concerne un congé pour passer un examen.</li>
                    </ul>
                    <p>L'employeur a 30 jours pour répondre au salarié.</p>
                    <p>Si les 2 conditions sont réunies (ancienneté et délai de franchise), l'employeur ne peut pas refuser le Cif. Il peut cependant reporter le départ du salarié de 9 mois maximum pour :</p>
                    <ul class="circle-list">
                        <liraisons de serviceli>
                        <li>ou dépassement d'un pourcentage d'absences simultanées de l'effectif de l'entreprise.</li>
                    </ul>
                    <p>Si l'employeur refuse ou reporte le Cif pour des raisons paraissant injustifiées, le salarié peut présenter une réclamation auprès :</p>
                    <ul class="circle-list">
                        <li>des délégués du personnel</li>
                        <li>ou de l'inspection du travail.</li>
                    </ul>
                    <p>Si le désaccord persiste, le salarié peut saisir le conseil des prud'hommes.</p>
                    <h3>Auprès de l'organisme financeur</h3>
                    <p>Les frais de formation peuvent être pris en charge.</p>
                    <p>Pour cela, le salarié doit s'adresser à :</p>
                    <ul class="circle-list">
                        <li>l'organisme auquel son entreprise cotise pour le Cif, pour les entreprises de plus de 10 salariés. Pour le savoir, le salarié doit s'adresser à son employeur ou à sa direction des ressources humaines </li>
                        <li>dans les autres cas, à un Opacif</li>
                    </ul>
                    <p>Le délai recommandé de dépôt de la demande est de 2 et 4 mois avant le début de la formation.</p>
                    <p>La demande peut être refusée notamment pour des raisons de coût.</p>
                </details>
                <a class="link" href="https://www.service-public.fr/particuliers/vosdroits/F14018">https://www.service-public.fr/particuliers/vosdroits/F14018</a>
            </fieldset>
            `
        )
    }

});