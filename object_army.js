
    ////////////////////////////////////////////////////////////////////
    //                          army OBJECT
    // this is the main object for dealing with Army
    /////////////////////////////////////////////////////////////////////

    army = {
        records: [],

        recordsSortable: [],

        recordsTemp: [],

        perPage: 25,

        pageDone: true,

        /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
        /*jslint sub: true */
        record: function () {
            this.data = {
                'user'   : '',
                'name'   : '',
                'userId' : '',
                'lvl'    : 0,
                'last'   : 0,
                'change' : 0,
                'elite'  : false
            };
        },

        copy2sortable: function () {
            try {
                var order = new sort.order();
                $j.extend(true, order.data, state.getItem("ArmySort", order.data));
                army.recordsSortable = [];
                $j.merge(army.recordsSortable, army.records);
                army.recordsSortable.sort($u.sortBy(order.data['reverse']['a'], order.data['value']['a'], $u.sortBy(order.data['reverse']['b'], order.data['value']['b'], $u.sortBy(order.data['reverse']['c'], order.data['value']['c']))));
                return true;
            } catch (err) {
                $u.error("ERROR in army.copy2sortable: " + err);
                return false;
            }
        },
        /*jslint sub: false */

        hbest: 3,

        load: function () {
            try {
                army.records = gm.getItem('army.records', 'default');
                if (army.records === 'default' || !$j.isArray(army.records)) {
                    army.records = gm.setItem('army.records', []);
                }

                army.copy2sortable();
                army.hbest = army.hbest === false ? JSON.hbest(army.records) : army.hbest;
                $u.log(3, "army.load Hbest", army.hbest);
                state.setItem("ArmyDashUpdate", true);
                $u.log(3, "army.load", army.records);
                return true;
            } catch (err) {
                $u.error("ERROR in army.load: " + err);
                return false;
            }
        },

        save: function () {
            try {
                var compress = false;
                gm.setItem('army.records', army.records, army.hbest, compress);
                state.setItem("ArmyDashUpdate", true);
                $u.log(3, "army.save", army.records);
                return true;
            } catch (err) {
                $u.error("ERROR in army.save: " + err);
                return false;
            }
        },

        loadTemp: function () {
            try {
                army.recordsTemp = ss.getItem('army.recordsTemp', 'default', true);
                if (army.recordsTemp === 'default' || !$j.isArray(army.recordsTemp)) {
                    army.recordsTemp = ss.setItem('army.recordsTemp', []);
                }

                $u.log(3, "army.loadTemp", army.recordsTemp);
                return true;
            } catch (err) {
                $u.error("ERROR in army.loadTemp: " + err);
                return false;
            }
        },

        saveTemp: function () {
            try {
                ss.setItem('army.recordsTemp', army.recordsTemp);
                $u.log(3, "army.saveTemp", army.recordsTemp);
                return true;
            } catch (err) {
                $u.error("ERROR in army.saveTemp: " + err);
                return false;
            }
        },

        deleteTemp: function () {
            try {
                ss.deleteItem('army.recordsTemp');
                ss.deleteItem('army.currentPage');
                army.recordsTemp = [];
                $u.log(3, "army.deleteTemp deleted");
                return true;
            } catch (err) {
                $u.error("ERROR in army.saveTemp: " + err);
                return false;
            }
        },

        init: function () {
            army.loadTemp();
            army.load();
        },

        /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
        /*jslint sub: true */
        setItem: function (record) {
            try {
                var it    = 0,
                    len   = 0,
                    found = false;

                for (it = 0, len = army.records.length; it < len; it += 1) {
                    if (army.records[it]['userId'] === record['userId']) {
                        army.records[it] = record;
                        found = true;
                        break;
                    }
                }

                if (!found) {
                    $u.log(3, "Added record'");
                    army.records.push(record);
                } else {
                    $u.log(3, "Updated record'");
                }
                
                army.save();
                army.copy2sortable();
                return record;
            } catch (err) {
                $u.error("ERROR in army.setItem: " + err);
                return undefined;
            }
        },

        getItem: function (userId) {
            try {
                var it    = 0,
                    len   = 0,
                    found = false;

                for (it = 0, len = army.records.length; it < len; it += 1) {
                    if (army.records[it]['userId'] === userId) {
                        found = true;
                        break;
                    }
                }

                if (!found) {
                    $u.log(1, "Unable to find 'userId'", userId);
                }

                return found ? army.records[it] : {};
            } catch (err) {
                $u.error("ERROR in army.getItem: " + err);
                return undefined;
            }
        },
        
        deleteItem: function (userId) {
            try {
                var it    = 0,
                    len   = 0,
                    found = false;

                for (it = 0, len = army.records.length; it < len; it += 1) {
                    if (army.records[it]['userId'] === userId) {
                        army.records[it].splice(it, 1);
                        found = true;
                        break;
                    }
                }

                if (!found) {
                    $u.log(1, "Unable to find 'userId'", userId);
                } else {
                    army.save();
                    army.copy2sortable();
                }
                
                return true;
            } catch (err) {
                $u.error("ERROR in army.setItem: " + err);
                return false;
            }
        },
        
        page: function () {
            try {
                if (!army.pageDone) {
                    var jData  = $j(),
                        pages  = $j(),
                        search = $j(),
                        record = {},
                        tStr   = '',
                        tTxt   = '',
                        tNum   = 0,
                        pCount = 0,
                        it     = 0,
                        len    = 0,
                        number = ss.getItem("army.currentPage", 1, true);
                        
                    caap.delayMain = true;
                    window.setTimeout(function () {
                        if (number === 1) {
                            pages = $j("a[href*='army_member.php?page=']", caap.globalContainer).last();
                            tStr = $u.hasContent(pages) ? pages.attr("href") : '';
                            tNum = $u.hasContent(tStr) ? tStr.regex(/page=(\d+)/) : null;
                            pCount = $u.setContent(tNum, 1);
                            state.setItem("ArmyPageCount", pCount);
                        } else {
                            pCount = state.getItem("ArmyPageCount", 1);
                        }
            
                        search = $j("a[href*='comments.php?casuser=']", caap.globalContainer);
                        search.each(function () {
                            var el = $j(this);
                            record = new army.record();
                            tStr = el.attr("href");
                            tNum = $u.hasContent(tStr) ? tStr.regex(/casuser=(\d+)/) : null;
                            record.data['userId'] = $u.setContent(tNum, 0);
                            tStr = el.parents("tr").eq(0).text().trim().innerTrim();
                            tTxt = $u.hasContent(tStr) ? tStr.regex(new RegExp('(.+)\\s+"')) : '';
                            record.data['user'] = $u.hasContent(tTxt) ?  tTxt.toString() : '';
                            tTxt = $u.hasContent(tStr) ? tStr.regex(new RegExp('"(.+)"')) : '';
                            record.data['name'] = $u.hasContent(tTxt) ? tTxt.toString() : '';
                            tNum = $u.hasContent(tStr) ? tStr.regex(/Level\s+(\d+)/) : null;
                            record.data['lvl'] = $u.setContent(tNum, 0);
                            record.data['last'] = new Date().getTime();
                            if ($u.hasContent(record.data['userId']) && record.data['userId'] > 0) {
                                army.recordsTemp.push(record.data);
                            } else {
                                $u.log(1, "army.page skipping record", record.data);
                            }
                        });
            
                        if (number === pCount) {
                            search = $j("img[src*='bonus_member.jpg']", caap.globalContainer).parent().parent().find("a[href*='oracle.php']");
                            if ($u.hasContent(search)) {
                                tStr = search.text();
                                tNum = $u.hasContent(tStr) ? tStr.regex(/Extra members x(\d+)/) : null;
                                len = $u.setContent(tNum, 0);
                                for (it = 1; it <= len; it += 1) {
                                    record = new army.record();
                                    record.data['userId'] = 0 - it;
                                    record.data['name'] = "Extra member " + it;
                                    record.data['lvl'] = 0;
                                    record.data['last'] = new Date().getTime();
                                    army.recordsTemp.push(record.data);
                                }
                            }
                        }
                                    
                        ss.setItem("army.currentPage", army.saveTemp() ? number + 1 : number);
                        $u.log(1, "army.page", number, pCount, army.recordsTemp);
                        army.pageDone = true;
                        caap.delayMain = false;
                    }, 400);
                }
                
                return true;
            } catch (err) {
                $u.error("ERROR in army.page: " + err);
                army.pageDone = true;
                caap.waitingForDomLoad = false;
                return false;
            }
        },
        
        run: function () {
            try {
                if (!config.getItem("EnableArmy", true) || !schedule.check("army_member")) {
                    return false;
                }

                var expectedPageCount = 0,
                    currentPage       = 0,
                    scanDays          = config.getItem("ArmyScanDays", 7);

                currentPage = ss.getItem("army.currentPage", 1, true);
                expectedPageCount = state.getItem("ArmyPageCount", 0);
                if (!expectedPageCount) {
                    expectedPageCount = Math.ceil((caap.stats['army']['actual'] - 1) / army.perPage);
                    expectedPageCount = expectedPageCount ? expectedPageCount : 0;
                }

                if (currentPage > expectedPageCount) {
                    army.pageDone = false;
                    $u.log(1, "army.run", expectedPageCount);
                    if (caap.stats['army']['actual'] - 1 !== army.recordsTemp.length) {
                        $u.log(2, "Army size mismatch. Next schedule set 30 mins.", caap.stats['army']['actual'] - 1, army.recordsTemp.length);
                        schedule.setItem("army_member", 1800, 300);
                    } else {
                        army.merge();
                        schedule.setItem("army_member", scanDays * 86400, 300);
                        $u.log(2, "Army merge complete. Next schedule set " + scanDays + " days.", army.records);
                    }

                    army.deleteTemp();
                    return false;
                } else if (army.pageDone) {
                    army.pageDone = false;
                    caap.ClickAjaxLinkSend("army_member.php?page=" + currentPage);
                }

                return true;
            } catch (err) {
                $u.error("ERROR in army.run: " + err);
                return false;
            }
        },

        merge: function () {
            try {
                var it     = 0,
                    len    = 0,
                    record = {};

                for (it = 0, len = army.recordsTemp.length; it < len; it += 1) {
                    record = army.getItem(army.recordsTemp[it]['userId']);
                    if ($u.hasContent(record)) {
                        army.recordsTemp[it]['elite'] = $u.setContent(record['elite'], false);
                        if (army.recordsTemp[it]['lvl'] > record['lvl']) {
                            army.recordsTemp[it]['change'] = army.recordsTemp[it]['last'];
                            $u.log(2, "Changed level", army.recordsTemp[it]);
                        } else {
                            if ($u.hasContent(record['change']) && record['change'] > 0) {
                                army.recordsTemp[it]['change'] = $u.setContent(record['change'], 0);
                                $u.log(3, "Copy change", army.recordsTemp[it]);
                            } else {
                                army.recordsTemp[it]['change'] = army.recordsTemp[it]['last'];
                                $u.log(3, "Set change", army.recordsTemp[it]);
                            }
                        }
                        
                        if (!$u.hasContent(army.recordsTemp[it]['name']) && $u.hasContent(record['name'])) {
                            army.recordsTemp[it]['name'] = record['name'];
                        }

                        if ($u.hasContent(army.recordsTemp[it]['name']) && $u.hasContent(record['name']) && army.recordsTemp[it]['user'] !== record['user']) {
                            army.recordsTemp[it]['name'] = record['name'];
                        }
                        
                        if (!$u.hasContent(army.recordsTemp[it]['user']) && $u.hasContent(record['user'])) {
                            army.recordsTemp[it]['user'] = record['user'];
                        }

                        if ($u.hasContent(army.recordsTemp[it]['user']) && $u.hasContent(record['user']) && army.recordsTemp[it]['user'] !== record['user']) {
                            army.recordsTemp[it]['user'] = record['user'];
                        }
                        
                        if (!$u.hasContent(army.recordsTemp[it]['lvl']) && $u.hasContent(record['lvl'])) {
                            army.recordsTemp[it]['lvl'] = record['lvl'];
                        }
                        
                        if (!$u.hasContent(army.recordsTemp[it]['elite']) && $u.hasContent(record['elite'])) {
                            army.recordsTemp[it]['elite'] = record['elite'];
                        }
                    }
                }

                army.records = army.recordsTemp.slice();
                army.save();
                army.copy2sortable();
                return true;
            } catch (err) {
                $u.error("ERROR in army.merge: " + err);
                return false;
            }
        },
       
        getIdList: function () {
            try {
                var it   = 0,
                    len  = 0,
                    list = [];

                for (it = 0, len = army.records.length; it < len; it += 1) {
                    if ($u.hasContent(army.records[it]['userId']) && army.records[it]['userId'] > 0) {
                        list.push(army.records[it]['userId']);
                    }
                }

                return list;
            } catch (err) {
                $u.error("ERROR in army.getIdList: " + err);
                return undefined;
            }
        },
        
        getEliteList: function () {
            try {
                var it   = 0,
                    len  = 0,
                    list = [];

                for (it = 0, len = army.records.length; it < len; it += 1) {
                    if ($u.hasContent(army.records[it]['userId']) && army.records[it]['userId'] > 0 && army.records[it]['elite']) {
                        list.push(army.records[it]['userId']);
                    }
                }

                return list;
            } catch (err) {
                $u.error("ERROR in army.getEliteList: " + err);
                return [];
            }
        }
        /*jslint sub: false */
    };
