(function decorateFlowdockLinks() {
    var jiraProjectsRegex = getJiraProjectsRegex();

    window.setInterval( function () {
        var messages = document.getElementsByClassName('msg-body');

        Array.prototype.slice.call(messages).filter(function (msg) {
            return jiraProjectsRegex.test(msg.innerHTML);
        }).forEach(function (msg) {
            msg.innerHTML = msg.innerHTML.replace(jiraProjectsRegex, ticketToLink);
        });

    }, 1000);

    function ticketToLink(ticket) {
        var base = 'https://arnoldmedia.jira.com/browse/';
        var link = '<a href="' + base + ticket + '" title="' + ticket + '" target="_blank" class="jira-link">' + ticket + '</a>';
        return link;
    }

    function getJiraProjectsRegex() {
        var projects = [
            'ADTECH',
            'AREPORT',
            'ARMYFIT',
            'SCMOBILE',
            'BACTES',
            'BLOG',
            'COMPLIANCE',
            'CREAT',
            'DS',
            'DSTWO',
            'QHDS',
            'DEV',
            'DROZ',
            'FACILITIES',
            'FEIN',
            'HLTHLN',
            'HLEXPORT',
            'HFPINTERNA',
            'HDEW',
            'MAINT',
            'MOBILE',
            'PSCHED',
            'PP',
            'PM',
            'PS',
            'QA',
            'REALAGE',
            'SC',
            'SCCONTENT',
            'SCFIT',
            'SN',
            'SCPHP',
            'SCPROG',
            'SCME',
            'SSO',
            'SITEOPS',
            'STAR',
            'TEAM',
            'TKT',
            'TIC',
            'TMA',
            'TNATION',
            'UX',
            'YUBARI'
        ];

        var joinedProjects = '(' + projects.map(function (it) {
                return it + '-\\d+';
        }).join('|') + ')';
        var plainTicket = joinedProjects + '(?!</a>|\\d|"|\\)|\\]|\')';
        return new RegExp(plainTicket);
    }
})();
