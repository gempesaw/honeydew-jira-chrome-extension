// TODO: maybe a 'loading' message ?

(function () {
    var ticket = getTicketFromJiraUrl();
    searchForTicket(ticket);

    // if we're on a search page, poll the url for changes so we can
    // keep putting ourselves in
    if (window.location.search.match(/(?:filter|jql)=/)) {
        var previousTicket = ticket;
        var search = window.setInterval( function () {
            var currentTicket = getTicketFromJiraUrl();
            if ( previousTicket !== currentTicket ) {
                searchForTicket(currentTicket);
                previousTicket = currentTicket;
            }
        }, 1000 );
    }

    function getTicketFromJiraUrl() {
        var matches = window.location.pathname.match(/\/browse\/(\w+-\d+)/);
        return matches[1];
    }

    function searchForTicket(ticket) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "https://qa-91.terminus1.openstack.internal/grep.php?filter=" + ticket, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                var features = JSON.parse(xhr.responseText);
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
        var base = "https://honeydew.be.jamconsultg.com/?";
        return features.reduce(function (html, feature) {
            feature = feature.replace(/\/opt\/honeydew\/features/, '');
            return html += "<li><a href=\"" + base + feature + "\" title=\"View this issue in automation\" target=\"_blank\">" + feature + "</a></li>";
        }, "");
    }

    function appendToSidebar(div) {
        var oldDiv = document.getElementById(hdewDivId);
        if (oldDiv === null ) {
            var sidebar = document.getElementById('viewissuesidebar');
            sidebar.appendChild(div);
        }
    }
}());
