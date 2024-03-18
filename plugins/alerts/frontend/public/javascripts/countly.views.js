/*global
    CountlyHelpers,
    countlyGlobal,
    countlyAlerts,
    jQuery,
    countlyVue,
    app,
    countlyCommon,
    countlyAuth,
    CV,
 */
(function() {
    var ALERTS_FEATURE_NAME = "alerts";

    var AlertDrawer = countlyVue.views.BaseView.extend({
        template: '#alert-drawer',
        mixins: [
            countlyVue.container.dataMixin({
                "externalDataTypeOptions": "/alerts/data-type",
                "externalAlertDefine": "/alerts/data-define",
            })
        ],
        components: {
        },
        data: function() {
            return {
                title: "",
                saveButtonLabel: "",
                apps: [""],
                allowAll: false,
                showFilter: false,
                filterButton: false,
                showSubType1: true,
                showSubType2: false,
                showCondition: true,
                showConditionValue: true,
                alertDataSubType2Options: [],
                alertDataFilterKeyOptions: [],
                alertDataFilterValueOptions: [],
                alertDataFilterObject: null,
                alertDataFilterKey: null,
                alertDataFilterValue: null,


                eventTargets: [],
                metricTargets: [],
                defaultAlertDefine: {
                    events: {
                        target: [
                            { value: 'count', label: 'count'},
                            { value: 'sum', label: 'sum'},
                            { value: 'duration', label: 'duration'},
                            { value: 'average sum', label: 'average sum'},
                            { value: 'average duration', label: 'average duration'},
                        ]
                    },
                    views: {
                        target: [
                            { value: 'bounce rate', label: 'bounce rate' },
                            { value: '# of page views', label: '# of page views' }
                        ]
                    },
                    sessions: {
                        target: [
                            { value: 'average session duration', label: 'average session duration' },
                            { value: '# of sessions', label: '# of sessions' }
                        ]
                    },
                    users: {
                        target: [
                            { value: '# of users', label: '# of users' },
                            { value: '# of new users', label: '# of new users' }
                        ]
                    },
                    crashes: {
                        target: [
                            { value: '# of crashes/errors', label: '# of crashes/errors' },
                            { value: 'none-fatal crashes/errors per session', label: 'non-fatal crashes/errors per session' },
                            { value: 'fatal crashes/errors per session', label: 'fatal crashes/errors per session' },
                            { value: 'new crash/error', label: 'new crash/error' }
                        ],
                    },
                    survey: {
                        target: [
                            { value: '# of survey responses', label: '# of survey responses' },
                            { value: 'new survey response', label: 'new survey response' }
                        ]
                    },
                    NPS: {
                        target: [
                            { value: '# of responses', label: '# of responses' },
                            { value: 'new NPS response', label: 'new NPS response' }
                        ]
                    },
                    rating: {
                        target: [
                            { value: '# of responses', label: '# of responses' },
                            { value: 'new rating response', label: 'new rating response' }
                        ]
                    },
                    dataPoints: {
                        target: [
                            { value: 'total data points', label: 'total data points' },
                        ]
                    },
                    onlineUsers: {
                        target: [
                            { value: '# of online users', label: '# of online users' },
                            { value: 'overall record', label: 'overall record' },
                            { value: '30-day record', label: '30-day record' }
                        ]
                    },
                    cohorts: {
                        target: [
                            { value: '# of users in the cohort', label: '# of users in the cohort' }
                        ]
                    },
                    revenue: {
                        target: [
                            { value: 'total revenue', label: 'total revenue' },
                            { value: 'average revenue per user', label: 'average revenue per user' },
                            { value: 'average revenue per paying user', label: 'average revenue per paying user' },
                            { value: '# of paying users', label: '# of paying users' },
                        ]
                    }
                }
            };
        },
        watch: {

        },
        computed: {
            alertDataTypeOptions: function() {
                var alertDataTypeOptions = [
                    {label: jQuery.i18n.map["alert.Crash"], value: 'crashes'},
                    {label: jQuery.i18n.map["alert.Cohorts"], value: 'cohorts'},
                    {label: jQuery.i18n.map["alert.Data-points"], value: 'dataPoints'},
                    {label: jQuery.i18n.map["alert.Event"], value: 'events'},
                    {label: jQuery.i18n.map["alert.NPS"], value: 'nps'},
                    {label: jQuery.i18n.map["alert.Online-users"], value: 'onlineUsers'},
                    {label: jQuery.i18n.map["alert.Rating"], value: 'rating'},
                    {label: jQuery.i18n.map["alert.Revenue"], value: 'revenue'},
                    {label: jQuery.i18n.map["alert.Session"], value: 'sessions'},
                    {label: jQuery.i18n.map["alert.Survey"], value: 'survey'},
                    {label: jQuery.i18n.map["alert.User"], value: 'users'},
                    {label: jQuery.i18n.map["alert.View"], value: 'views'},
                ];
                if (this.externalDataTypeOptions) {
                    alertDataTypeOptions = alertDataTypeOptions.concat(this.externalDataTypeOptions);
                }
                return alertDataTypeOptions;
            },
            alertDefine: function() {
                var allOptions = JSON.parse(JSON.stringify(this.defaultAlertDefine));
                var eventTargets = this.eventTargets;
                var metricTargets = this.metricTargets;

                this.externalAlertDefine.forEach(function(define) {
                    allOptions = Object.assign(allOptions, define);
                });

                if (eventTargets && eventTargets.length) {
                    allOptions.event.target = eventTargets;
                }

                if (metricTargets && metricTargets.length) {
                    allOptions.metric.target = allOptions.metric.target.concat(metricTargets);
                }

                return allOptions;
            },
            alertDataSubTypeOptions: function() {
                var alertDataSubTypeOptions;
                if (this.$refs.drawerData.editedObject.alertDataType) {
                    alertDataSubTypeOptions = this.alertDefine[this.$refs.drawerData.editedObject.alertDataType].target;
                }
                return alertDataSubTypeOptions;
            },
        },
        props: {
            controls: {
                type: Object
            }
        },
        mounted: function() {
        },
        methods: {
            subType2Label: function(obj) {
                switch (obj.alertDataType) {
                case 'events':
                    return "Event";
                case 'views':
                    return "View";
                case 'cohorts':
                    return "Cohort";
                case 'survey':
                    return "Widget Name";
                case 'nps':
                    return "Widget Name";
                case 'rating':
                    return "Widget Name";
                }
            },
            showFilterButton: function(obj) {
                switch (obj.alertDataType) {
                case 'events':
                    return true;
                case 'crashes':
                    return true;
                case 'nps':
                    return true;
                case 'rating':
                    return true;
                }
            },
            getMetrics: function(notReset) {
                const formData = this.$refs.drawerData.editedObject;
                this.alertDataSubType2Options = [];
                if (!formData.selectedApps) {
                    return;
                }
                if (formData.alertDataType === 'views') {
                    countlyAlerts.getViewForApp(formData.selectedApps, (viewList) => {
                        this.alertDataSubType2Options = viewList.map((v) => {
                            return {value: v.value, label: v.name};
                        });
                    });

                }
                if (formData.alertDataType === 'events') {
                    countlyAlerts.getEventsForApp(formData.selectedApps, ({ events, segments }) => {
                        this.alertDataSubType2Options = events.map((e) => {
                            return {value: e.value, label: e.name};
                        });
                        this.alertDataFilterObject = segments;
                    });
                }
                if (formData.alertDataType === 'cohorts') {
                    countlyAlerts.getCohortsForApp(formData.selectedApps, (data) => {
                        this.alertDataSubType2Options = data.map((c) => {
                            return {value: c._id, label: c.name};
                        });
                    });
                }
                if (formData.alertDataType === 'survey') {
                    countlyAlerts.getSurveysForApp(formData.selectedApps, (data) => {
                        this.alertDataSubType2Options = data.map((s) => {
                            return {value: s._id, label: s.name};
                        });
                    });
                }
                if (formData.alertDataType === 'nps') {
                    countlyAlerts.getNPSForApp(formData.selectedApps, (data) => {
                        this.alertDataSubType2Options = data.map((n) => {
                            return {value: n._id, label: n.name};
                        });
                    });
                }
                if (formData.alertDataType === 'rating') {
                    countlyAlerts.getRatingForApp(formData.selectedApps, (data) => {
                        this.alertDataSubType2Options = data.map((r) => {
                            return {value: r._id, label: r.popup_header_text};
                        });
                    });
                }
                if (!notReset) {
                    this.resetAlertCondition();
                }
            },
            dataTypeSelected: function(val, notRest) {
                this.resetAlertConditionShow();
                this.resetFilterCondition();
                this.getMetrics();
                if (val === 'crashes' || val === 'rating' || val === 'nps') {
                    this.setFilterValueOptions();
                }
                var validDataTypesForFilter = ['events', 'crashes', 'nps', 'rating'];
                if (validDataTypesForFilter.includes(val)) {
                    this.showFilter = true;
                }
                else {
                    this.showFilter = false;
                }

                var validDataTypesForSubType2 = ['events', 'views', 'cohorts', 'survey', 'nps', 'rating'];
                if (validDataTypesForSubType2.includes(val)) {
                    this.showSubType2 = true;
                }
                else {
                    this.showSubType2 = false;
                }

                if (val === 'dataPoint' && countlyGlobal.member.global_admin === true) {
                    this.allowAll = true;
                }
                if (val === 'onlineUsers') {
                    this.showSubType2 = false;
                    this.showCondition = false;
                    this.showConditionValue = false;
                }
                if (!notRest) {
                    this.resetAlertCondition();
                }
            },
            setFilterKeyOptions: function() {
                const formData = this.$refs.drawerData.editedObject;
                if (!formData.selectedApps) {
                    return;
                }
                if (formData.alertDataType === 'events') {
                    if (formData.alertDataSubType2 && this.alertDataFilterObject) {
                        const options = this.alertDataFilterObject[formData.alertDataSubType2];
                        if (Array.isArray(options)) {
                            this.alertDataFilterKeyOptions = options.filter(a => a).map(a => ({ label: a, value: a }));
                        }
                    }
                }
            },
            setFilterValueOptions: function() {
                const formData = this.$refs.drawerData.editedObject;
                if (!formData.selectedApps) {
                    return;
                }
                if (formData.alertDataType === 'crashes') {
                    this.alertDataFilterValue = [];
                    this.alertDataFilterKey = "App Version";
                    countlyAlerts.getCrashesForFilter(formData.selectedApps, (data) => {
                        const app_version = Object.keys(data);
                        if (Array.isArray(app_version)) {
                            this.alertDataFilterValueOptions = app_version.filter(a => a).map(a => ({ label: a.replace(/:/g, '.'), value: a }));
                        }
                    });
                }
                if (formData.alertDataType === 'rating') {
                    this.alertDataFilterValue = [];
                    this.alertDataFilterKey = "Rating";
                    this.alertDataFilterValueOptions = [{label: '1', value: '1'}, {label: '2', value: '2'}, {label: '3', value: '3'}, {label: '4', value: '4'}, {label: '5', value: '5'}];
                }
                if (formData.alertDataType === 'nps') {
                    this.alertDataFilterValue = [];
                    this.alertDataFilterKey = "NPS scale";
                    this.alertDataFilterValueOptions = [{label: 'detractor', value: 'detractor'}, {label: 'passive', value: 'passive'}, {label: 'promoter', value: 'promoter'}];

                }
            },
            resetAlertCondition: function() {
                this.$refs.drawerData.editedObject.alertDataSubType = null;
                this.$refs.drawerData.editedObject.alertDataSubType2 = null;
                this.$refs.drawerData.editedObject.compareType = null;
                this.$refs.drawerData.editedObject.compareValue = null;
                this.$refs.drawerData.editedObject.filterKey = null;
                this.$refs.drawerData.editedObject.filterValue = null;
            },
            resetAlertConditionShow: function() {
                this.showSubType1 = true;
                this.showSubType2 = false;
                this.showCondition = true;
                this.showConditionValue = true;
                this.showFilter = false;
                this.filterButton = false;
            },
            resetFilterCondition: function() {
                this.alertDataFilterKeyOptions = [];
                this.alertDataFilterValueOptions = [];
                this.alertDataFilterKey = null;
                this.alertDataFilterValue = null;
            },
            // alertDataSubTypeSelected: function(alertDataSubType, notReset) {
            //     this.resetAlertConditionShow();
            //     switch (alertDataSubType) {
            //     case 'New crash occurence':
            //         this.showSubType2 = false;
            //         this.showCondition = false;
            //         this.showConditionValue = false;
            //         break;
            //     case 'Number of ratings':
            //         if (!notReset) {
            //             this.resetAlertConditionShow();
            //         }
            //         this.showSubType2 = true;
            //         this.alertDataSubType2Options = countlyAlerts.RatingOptions;
            //         break;
            //     case 'Number of page views':
            //     case 'Bounce rate':
            //         this.resetAlertConditionShow();
            //         this.showSubType2 = true;
            //         var self = this;
            //         countlyAlerts.getViewForApp(this.apps[0], function(viewList) {
            //             self.alertDataSubType2Options = viewList.map(function(v) {
            //                 return {value: v.value, label: v.name};
            //             });
            //         });
            //         break;
            //     case 't':
            //         this.showUserCount = true;
            //         this.showSubType2 = false;
            //         this.showCondition = false;
            //         this.showConditionValue = false;
            //         break;
            //     case 'o':
            //     case 'm':
            //         this.showSubType2 = false;
            //         this.showCondition = false;
            //         this.showConditionValue = false;
            //         break;
            //     default:
            //         if (!notReset) {
            //             this.resetAlertConditionShow();
            //         }
            //         return;
            //     }
            // },
            onSubmit: function(settings) {
                settings.selectedApps = [settings.selectedApps];
                if (settings._id) {
                    var rows = this.$store.getters["countlyAlerts/table/all"];
                    for (var i = 0; i < rows.length; i++) {
                        if ((rows[i]._id === settings._id) &&
                                (rows[i].alertDataType === 'onlineUsers' || settings.alertDataType === 'onlineUsers') &&
                                (rows[i].alertDataType !== settings.alertDataType)) {
                            if (rows[i].alertDataType !== 'onlineUsers') {
                                this.$store.dispatch("countlyAlerts/deleteAlert", rows[i]._id);
                            }
                            else {
                                this.$store.dispatch("countlyAlerts/deleteOnlineUsersAlert", rows[i]);
                            }
                            settings._id = null;
                        }
                    }
                }
                settings.filterKey = this.alertDataFilterKey;
                settings.filterValue = this.alertDataFilterValue;

                var target = settings.alertDataSubType;
                var subTarget = settings.alertDataSubType2;
                switch (settings.alertDataType) {
                case "event":
                    target = target.split("***")[1];
                    break;
                case "rating":
                    // subTarget = countlyAlerts.RatingOptions[subTarget].label;
                    // if (target === 'Bounce rate' || target === 'Number of page views') {
                    //     this.alertDataSubType2Options.forEach(function(item) {
                    //         if (item.value === settings.alertDataSubType2) {
                    //             subTarget = item.label;
                    //         }
                    //     });
                    // }
                    break;
                case 'metric':
                    if (target === 'Bounce rate' || target === 'Number of page views') {
                        this.alertDataSubType2Options.forEach(function(item) {
                            if (item.value === settings.alertDataSubType2) {
                                subTarget = item.label;
                            }
                        });
                    }
                    break;
                }

                var target2 = settings.alertDataSubType2 ? ' (' + subTarget + ')' : '';
                settings.compareDescribe = target + target2 ;

                switch (settings.alertDataSubType) {
                case 'New crash occurence':
                    break;
                default:
                    settings.compareDescribe += ' ' + settings.compareType +
                            ' ' + settings.compareValue + "%";
                    break;
                }
                delete settings.createdBy;

                if (settings.alertDataType === 'onlineUsers') {
                    var config = {
                        app: settings.selectedApps[0],
                        app_name: countlyGlobal.apps[settings.selectedApps[0]].name,
                        name: settings.alertName,
                        type: settings.alertDataSubType,
                        def: settings.compareType,
                        users: parseInt(settings.compareValue, 10),
                        minutes: parseInt(settings.compareValue2, 10),
                        email: settings.alertValues,
                        enabled: true,
                    };
                    if (settings._id) {
                        config._id = settings._id;
                    }
                    if (config.type === 't') {
                        config.condition_title = jQuery.i18n.prop("concurrent-users.condition-title", jQuery.i18n.map["concurrent-users." + config.def], countlyCommon.formatNumber(config.users), config.minutes);
                    }
                    else if (config.type === 'o') {
                        config.condition_title = jQuery.i18n.map["concurrent-users.alert-type.overall-title"];
                    }
                    else if (config.type === 'm') {
                        config.condition_title = jQuery.i18n.map["concurrent-users.alert-type.monthly-title"];
                    }

                    this.$store.dispatch("countlyAlerts/saveOnlineUsersAlert", config);
                    this.resetAlertConditionShow();
                    return;
                }
                this.$store.dispatch("countlyAlerts/saveAlert", settings);
                this.resetAlertConditionShow();
            },
            onClose: function($event) {
                this.$emit("close", $event);
            },
            onCopy: function(newState) {
                this.showSubType1 = true;
                this.showSubType2 = false;
                this.showCondition = false;
                this.showConditionValue = false;
                newState.selectedApps = newState.selectedApps[0];
                // this.onAppChange(newState.selectedApps, true);
                // this.alertDataSubTypeSelected(newState.alertDataSubType, true);
                this.getMetrics();

                if (newState._id !== null) {
                    this.title = jQuery.i18n.map["alert.Edit_Your_Alert"];
                    this.saveButtonLabel = jQuery.i18n.map["alert.save-alert"];
                    return;
                }
                this.title = jQuery.i18n.map["alert.Create_New_Alert"];
                this.saveButtonLabel = jQuery.i18n.map["alert.save"];
            },
        }
    });

    var TableView = countlyVue.views.BaseView.extend({
        template: '#alerts-table',
        mixins: [
            countlyVue.mixins.auth(ALERTS_FEATURE_NAME),
        ],
        computed: {
            tableRows: function() {
                var rows = this.$store.getters["countlyAlerts/table/all"];
                if (this.filteredApps.length > 0) {
                    var self = this;
                    rows = rows.filter(function(r) {
                        var matched = false;
                        self.filteredApps.forEach(function(a) {
                            if (r.selectedApps.indexOf(a) >= 0) {
                                matched = true;
                            }
                        });
                        return matched;
                    });
                }
                return rows;
            },
            initialized: function() {
                var result = this.$store.getters["countlyAlerts/table/getInitialized"];
                return result;
            },
            rowTableRows: function() {
                var rows = this.$store.getters["countlyAlerts/table/all"];
                return rows;
            }
        },
        data: function() {
            var appsSelectorOption = [];
            for (var id in countlyGlobal.apps) {
                appsSelectorOption.push({label: countlyGlobal.apps[id].name, value: id});
            }

            return {
                appsSelectorOption: appsSelectorOption,
                filterStatus: 'all',
                filteredApps: [],
                localTableTrackedFields: ['enabled'],
                isAdmin: countlyGlobal.member.global_admin,
                deleteElement: null,
            };
        },
        props: {
            callCreateAlertDrawer: {type: Function, default: function() {}},
        },
        methods: {
            createAlert: function() {
                this.callCreateAlertDrawer();
            },
            handleAlertEditCommand: function(command, scope) {
                if (command === "edit-comment") {
                    /* eslint-disable */
                        var data = Object.assign({}, scope.row);
                        /* eslint-enable */
                    this.$parent.$parent.openDrawer("home", data);
                }
                else if (command === "delete-comment") {
                    var self = this;
                    this.deleteElement = scope.row;
                    var deleteMessage = CV.i18n("alert.delete-confirm", "<b>" + this.deleteElement.alertName + "</b>");
                    CountlyHelpers.confirm(deleteMessage, "red", function(result) {
                        if (!result) {
                            return true;
                        }
                        if (self.deleteElement.alertDataType === 'onlineUsers') {
                            self.$store.dispatch("countlyAlerts/deleteOnlineUsersAlert", {alertID: self.deleteElement._id, appid: self.deleteElement.selectedApps[0]});
                        }
                        else {
                            self.$store.dispatch("countlyAlerts/deleteAlert", {alertID: self.deleteElement._id, appid: self.deleteElement.selectedApps[0]});
                        }
                    });
                }
            },
            updateStatus: function(scope) {
                var diff = scope.diff;
                var status = {};
                diff.forEach(function(item) {
                    status[item.key] = item.newValue;
                });
                var alertStatus = {};
                var onlineUsersAlertStatus = {};
                var rows = this.$store.getters["countlyAlerts/table/all"];
                for (var i = 0; i < rows.length; i++) {
                    if (status[rows[i]._id] !== undefined) {
                        if (rows[i].alertDataType === 'onlineUsers') {
                            onlineUsersAlertStatus[rows[i]._id] = status[rows[i]._id];
                        }
                        else {
                            alertStatus[rows[i]._id] = status[rows[i]._id];
                        }
                    }
                }
                var self = this;
                self.scope = scope;
                self.onlineUsersAlertStatus = onlineUsersAlertStatus;
                this.$store.dispatch("countlyAlerts/table/updateStatus", alertStatus).then(function() {
                    return self.$store.dispatch("countlyAlerts/table/updateOnlineusersAlertStatus", self.onlineUsersAlertStatus)
                        .then(function() {
                            return self.$store.dispatch("countlyAlerts/table/fetchAll");
                        });
                });
            },
            refresh: function() {
                // this.$store.dispatch("countlyHooks/table/fetchAll");
            },
        }
    });

    var AlertsHomeViewComponent = countlyVue.views.BaseView.extend({
        template: "#alerts-home",
        mixins: [
            countlyVue.mixins.hasDrawers("home"),
            countlyVue.mixins.auth(ALERTS_FEATURE_NAME),
        ],
        components: {
            "table-view": TableView,
            "drawer": AlertDrawer,
        },
        computed: {
            countData: function() {
                var count = this.$store.getters["countlyAlerts/table/count"];
                return [
                    {label: 'alert.RUNNING_ALERTS', value: count.r},
                    {label: 'alert.TOTAL_ALERTS_SENT', value: count.t},
                    {label: 'alert.ALERTS_SENT_TODAY', value: count.today},
                ];
            },
            shouldHideCount: function() {
                var result = this.$store.getters["countlyAlerts/table/getInitialized"];
                var rows = this.$store.getters["countlyAlerts/table/all"];
                return result && (rows.length === 0);
            },
            initialized: function() {
                var result = this.$store.getters["countlyAlerts/table/getInitialized"];
                return result;
            },
        },
        data: function() {
            return {
                canCreate: countlyAuth.validateCreate(ALERTS_FEATURE_NAME)
            };
        },
        beforeCreate: function() {
            this.$store.dispatch("countlyAlerts/initialize");
        },
        methods: {
            createAlert: function() {
                var config = countlyAlerts.defaultDrawerConfigValue();
                this.openDrawer("home", config);
            },
        },
    });
    var alertsView = new countlyVue.views.BackboneWrapper({
        component: AlertsHomeViewComponent,
        vuex: [{
            clyModel: countlyAlerts,
        }],
        templates: [
            "/alerts/templates/vue-main.html",
        ]
    });

    alertsView.featureName = ALERTS_FEATURE_NAME;


    app.route('/manage/alerts', 'alerts', function() {
        this.renderWhenReady(alertsView);
    });
    app.addMenu("management", {code: "alerts", permission: ALERTS_FEATURE_NAME, url: "#/manage/alerts", text: "alert.plugin-title", priority: 100});

    var conUpdateConcurrentUser = countlyAuth.validateUpdate("concurrent_users");
    var canCreateConcurrentUser = countlyAuth.validateCreate("concurrent_users");
    if (countlyGlobal.plugins.indexOf("concurrent_users") > -1 && (canCreateConcurrentUser || conUpdateConcurrentUser)) {
        countlyVue.container.registerData("/alerts/data-type");
        countlyVue.container.registerData("/alerts/data-define", {
            "online-users": {
                target: [
                    { value: 't', label: jQuery.i18n.map["concurrent-users.alert-type.t"]},
                    { value: 'o', label: jQuery.i18n.map["concurrent-users.alert-type.o"]},
                    { value: 'm', label: jQuery.i18n.map["concurrent-users.alert-type.m"]},
                ],
                condition: [
                    { value: 'gt', label: jQuery.i18n.map["concurrent-users.gt"]},
                    { value: 'lt', label: jQuery.i18n.map["concurrent-users.lt"]},
                ],
            }
        });
    }
})();
