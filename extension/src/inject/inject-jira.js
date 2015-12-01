/*global auth, hostname */
// TODO: maybe a 'loading' message ?

(function addHoneydewPanelToJIRA() {
    var ticket = getTicketFromJiraUrl();
    searchForTicket(ticket);

    // Switching between tickets (may) use AJAX now, so we'll just check more frequently
    var previousTicket = ticket;
    var search = window.setInterval( function () {
        var currentTicket = getTicketFromJiraUrl();
        if ( previousTicket !== currentTicket ) {
            console.log('used the interval');
            searchForTicket(currentTicket);
            previousTicket = currentTicket;
        }
    }, 1000 );

    function getTicketFromJiraUrl() {
        var matches = window.location.pathname.match(/\/browse\/(\w+-\d+)/);
        return matches[1];
    }

    function searchForTicket(ticket) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://' + hostname +  '/rest.php/tree/features?needle=' + ticket, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                var features = JSON.parse(xhr.responseText).list;
                console.log(features);
                appendToSidebar(createDiv(features));
            }
        };
        xhr.send();
    }

    var hdewDivId = "honeydew-feature-web-panel";
    function createDiv(features) {
        var featuresAsHtml = convertFeaturesToMarkup(features);
        var template = "<div id=\"honeydew-panel-heading\" class=\"mod-header\">" +
                "    <ul class=\"ops\"></ul>" +
                "    <h2 class=\"toggle-title\">Honeydew Automation</h2>" +
                "  </div>" +
                "" +
                "  <div class=\"mod-content\">" +
                "    <ul class=\"item-details ghx-separated\">" +
                featuresAsHtml +
                "    </ul>" +
                "  </div>";

        var hdewDiv = document.createElement('div');
        hdewDiv.setAttribute('id', hdewDivId);
        hdewDiv.setAttribute('class', 'module toggle-wrap expanded');
        hdewDiv.innerHTML = template;

        return hdewDiv;
    }

    function convertFeaturesToMarkup(features) {
        var base = "https://" + hostname + "/#/features/";
        if (features.length === 0) {
            return 'No features were found! You could <a href="' + base +'">make one</a>! :)';
        }
        else {
            return features.map(function (feature) {
                return feature.replace(/^features\//, '');
            }).reduce(function (html, feature) {
                return html += "<li><a href=\"" + base + feature + "\" title=\"View this issue in automation\" target=\"_blank\">" + feature + "</a></li>";
            }, "");
        }
    }

    function appendToSidebar(div) {
        var oldDiv = document.getElementById(hdewDivId);
        if (oldDiv === null ) {
            var sidebar = document.getElementById('viewissuesidebar');
            sidebar.appendChild(div);
        }
    }
})();
